import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';
import StepWizard from '../components/StepWizard';
import SkillChip from '../components/SkillChip';
import ResumeImportReview from '../components/ResumeImportReview';
import { mergeProfileSections } from '../utils/profileMerge';
import { createCandidateProfile, updateCandidateProfile, addEducation, addExperience } from '../../api/candidateApi';

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { candidateProfile, replaceProfile } = useCandidate();
  const tabToStepMap = useMemo(
    () => ({
      cv: 1,
      personal: 2,
      professional: 3,
      qualifications: 4,
      skills: 5,
    }),
    [],
  );
  const stepToTabMap = useMemo(
    () => ({
      1: 'cv',
      2: 'personal',
      3: 'professional',
      4: 'qualifications',
      5: 'skills',
    }),
    [],
  );
  const currentStep = tabToStepMap[searchParams.get('tab')] || 1;
  const [resumeNotice, setResumeNotice] = useState('');
  const [resumeParseState, setResumeParseState] = useState({
    parsedResume: null,
    selectedSections: [],
    fileMeta: null,
  });
  const [resumeAutoApplied, setResumeAutoApplied] = useState(false);
  const [formData, setFormData] = useState(() => ({
    ...candidateProfile,
    dob: candidateProfile.dob || '',
    gender: candidateProfile.gender || '',
    coverLetter: candidateProfile.coverLetter || '',
    preferences: candidateProfile.preferences || {
      types: [],
      salary: [0, 30],
      locations: [],
      noticePeriod: '',
    },
  }));
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', from: '', to: '', grade: '' });
  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState({ title: '', company: '', from: '', to: '', description: '' });
  const [avatarPreview, setAvatarPreview] = useState(candidateProfile.avatar || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const steps = [
    { id: 1, label: 'CV & Review' },
    { id: 2, label: 'Basic Info' },
    { id: 3, label: 'Professional' },
    { id: 4, label: 'Edu & Exp' },
    { id: 5, label: 'Skills & Prefs' },
  ];

  const currentDraftProfile = useMemo(() => formData, [formData]);

  useEffect(() => {
    if (searchParams.get('tab')) {
      return;
    }

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('tab', 'cv');
      return nextParams;
    }, { replace: true });
  }, [searchParams, setSearchParams]);

  const setStep = (step) => {
    const nextTab = stepToTabMap[Math.min(Math.max(step, 1), 5)];
    if (!nextTab) return;

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('tab', nextTab);
      return nextParams;
    }, { replace: true });
  };

  const handleNext = () => {
    if (
      currentStep === 1 &&
      resumeParseState.parsedResume &&
      resumeParseState.selectedSections.length > 0 &&
      !resumeAutoApplied
    ) {
      const mergedProfile = mergeProfileSections(
        formData,
        resumeParseState.parsedResume,
        resumeParseState.selectedSections,
      );
      setFormData(mergedProfile);
      setResumeNotice(
        `Imported ${resumeParseState.selectedSections.length} section${resumeParseState.selectedSections.length > 1 ? 's' : ''} into your draft profile.`,
      );
      setResumeAutoApplied(true);
    }

    setStep(currentStep + 1);
  };
  const handleBack = () => setStep(currentStep - 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError('');

    try {
      const payload = {
        full_name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        current_role: formData.title || '',
        location: formData.location || '',
        professional_summary: formData.bio || '',
        dob: formData.dob || null,
        gender: formData.gender || '',
        experience_years: formData.experienceYears || '',
        linkedin: formData.linkedin || '',
        github: formData.github || '',
        portfolio: formData.portfolio || '',
        resume: formData.cvUrl?.startsWith('http') ? formData.cvUrl : '',
        profile_image: formData.avatar?.startsWith('http') ? formData.avatar : '',
        skills_legacy: formData.skills || [],
      };

      try {
        await createCandidateProfile(payload);
      } catch {
        await updateCandidateProfile(payload);
      }

      if (formData.education?.length > 0) {
        for (const edu of formData.education) {
          if (edu.degree) {
            await addEducation({
              degree: edu.degree,
              institution: edu.institution,
              start_date: edu.from,
              end_date: edu.to,
              cgpa: edu.grade
            }).catch(console.error);
          }
        }
      }

      if (formData.experience?.length > 0) {
        for (const exp of formData.experience) {
          if (exp.title) {
            await addExperience({
              job_title: exp.title,
              company_name: exp.company,
              start_date: exp.from,
              end_date: exp.to === 'Present' ? null : exp.to,
              description: exp.description,
              present: exp.to === 'Present' || !!exp.present
            }).catch(console.error);
          }
        }
      }

      replaceProfile(formData);
      navigate('/candidate/dashboard');

    } catch (error) {
      console.error('Profile save failed:', error);
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  };

  const handleResumeParsedUpdate = useCallback(({ parsedResume, selectedSections, fileMeta }) => {
    setResumeParseState({ parsedResume, selectedSections, fileMeta });
  }, []);

  const handleResumeApply = ({ profile, fileMeta, selectedSections }) => {
    setFormData((prev) => ({
      ...prev,
      ...profile,
      cvName: fileMeta?.cvName || prev.cvName,
      cvUrl: fileMeta?.cvUrl || prev.cvUrl,
    }));
    setResumeParseState((prev) => ({
      ...prev,
      selectedSections,
      fileMeta: fileMeta || prev.fileMeta,
    }));
    setResumeAutoApplied(true);
    setResumeNotice(`Imported ${selectedSections.length} section${selectedSections.length > 1 ? 's' : ''} into your draft profile.`);
  };

  const handleResumeFileReady = ({ cvName, cvUrl }) => {
    setFormData((prev) => ({ ...prev, cvName, cvUrl }));
    setResumeParseState((prev) => ({ ...prev, fileMeta: { cvName, cvUrl } }));
    setResumeAutoApplied(false);
  };

  const clearResumeFile = () => {
    setFormData((prev) => ({ ...prev, cvName: '', cvUrl: '' }));
    setResumeParseState({ parsedResume: null, selectedSections: [], fileMeta: null });
    setResumeNotice('');
    setResumeAutoApplied(false);
  };

  const addEducation = () => {
    if (!eduForm.degree || !eduForm.institution) return;
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { ...eduForm, id: Date.now() }],
    }));
    setEduForm({ degree: '', institution: '', from: '', to: '', grade: '' });
    setShowEduForm(false);
  };

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((entry) => entry.id !== id),
    }));
  };

  const addExperience = () => {
    if (!expForm.title || !expForm.company) return;
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...expForm, id: Date.now() }],
    }));
    setExpForm({ title: '', company: '', from: '', to: '', description: '' });
    setShowExpForm(false);
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((entry) => entry.id !== id),
    }));
  };

  return (
    <div className="mx-auto max-w-4xl px-1 pb-12 sm:px-0">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Complete Your Profile</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Let companies know who you are and what you&apos;re looking for.
        </p>
      </div>

      <StepWizard steps={steps} currentStep={currentStep} />

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-panel sm:p-8">
        {currentStep === 1 ? (
          <div className="space-y-8">
            <ResumeImportReview
              currentProfile={currentDraftProfile}
              cvName={formData.cvName}
              cvUrl={formData.cvUrl}
              onApply={handleResumeApply}
              onFileReady={handleResumeFileReady}
              onClearFile={clearResumeFile}
              onParsedResumeUpdate={handleResumeParsedUpdate}
            />

            {resumeNotice ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300">
                {resumeNotice}
              </div>
            ) : null}

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cover Letter (Optional)</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Write a brief cover letter for companies to read..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />
              <span className="text-xs text-slate-500">
                I agree to allow companies to view my profile and contact me regarding relevant job opportunities.
              </span>
            </label>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Years of Experience</label>
                <select
                  name="experienceYears"
                  value={formData.experienceYears || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                >
                  <option value="">Select Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Professional Summary / Bio</label>
                <span className="text-xs text-slate-400">{(formData.bio || '').length}/300</span>
              </div>
              <textarea
                name="bio"
                maxLength={300}
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Talk about your career achievements, skills, and goals..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">GitHub URL</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github || ''}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio || ''}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Education</h3>
                <button
                  type="button"
                  onClick={() => setShowEduForm((prev) => !prev)}
                  className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400"
                >
                  <Plus size={16} /> {showEduForm ? 'Cancel' : 'Add Education'}
                </button>
              </div>

              {showEduForm ? (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/20 dark:bg-blue-900/5 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={eduForm.degree}
                    onChange={(event) => setEduForm({ ...eduForm, degree: event.target.value })}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={eduForm.institution}
                    onChange={(event) => setEduForm({ ...eduForm, institution: event.target.value })}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="From"
                      value={eduForm.from}
                      onChange={(event) => setEduForm({ ...eduForm, from: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white sm:w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="To"
                      value={eduForm.to}
                      onChange={(event) => setEduForm({ ...eduForm, to: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white sm:w-1/2"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Grade/CGPA"
                      value={eduForm.grade}
                      onChange={(event) => setEduForm({ ...eduForm, grade: event.target.value })}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                    />
                    <button type="button" onClick={addEducation} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                      Add
                    </button>
                  </div>
                </div>
              ) : null}

              {formData.education?.length ? (
                <div className="space-y-3">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-bg sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white">{edu.degree}</p>
                        <p className="text-xs text-slate-500">{edu.institution} • {edu.from} - {edu.to}</p>
                      </div>
                      <button type="button" onClick={() => removeEducation(edu.id)} className="self-end text-slate-400 hover:text-red-500 sm:self-auto">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                  <p className="text-sm text-slate-500">No education entries added yet.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Work Experience</h3>
                <button
                  type="button"
                  onClick={() => setShowExpForm((prev) => !prev)}
                  className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400"
                >
                  <Plus size={16} /> {showExpForm ? 'Cancel' : 'Add Experience'}
                </button>
              </div>

              {showExpForm ? (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/20 dark:bg-blue-900/5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={expForm.title}
                      onChange={(event) => setExpForm({ ...expForm, title: event.target.value })}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={expForm.company}
                      onChange={(event) => setExpForm({ ...expForm, company: event.target.value })}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <input
                      type="text"
                      placeholder="From"
                      value={expForm.from}
                      onChange={(event) => setExpForm({ ...expForm, from: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white sm:w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="To or Present"
                      value={expForm.to}
                      onChange={(event) => setExpForm({ ...expForm, to: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white sm:w-1/2"
                    />
                  </div>
                  <textarea
                    placeholder="Description of your role..."
                    value={expForm.description}
                    onChange={(event) => setExpForm({ ...expForm, description: event.target.value })}
                    rows={3}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                  />
                  <button type="button" onClick={addExperience} className="w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700">
                    Add Experience
                  </button>
                </div>
              ) : null}

              {formData.experience?.length ? (
                <div className="space-y-3">
                  {formData.experience.map((exp) => (
                    <div key={exp.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-bg sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white">{exp.title}</p>
                        <p className="text-xs text-slate-500">{exp.company} • {exp.from} - {exp.to}</p>
                      </div>
                      <button type="button" onClick={() => removeExperience(exp.id)} className="self-end text-slate-400 hover:text-red-500 sm:self-auto">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                  <p className="text-sm text-slate-500">No work experience added yet.</p>
                  <button type="button" className="mt-2 text-xs font-bold text-blue-600 underline">Fresher? Skip this</button>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skills</label>
              <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-bg">
                {(formData.skills || []).map((skill) => (
                  <SkillChip
                    key={skill}
                    label={skill}
                    removable
                    onRemove={(selectedSkill) =>
                      setFormData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((item) => item !== selectedSkill),
                      }))
                    }
                  />
                ))}
                <input
                  type="text"
                  placeholder="Type skill and press Enter"
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    const value = event.target.value.trim();
                    if (!value || formData.skills.includes(value)) return;
                    setFormData((prev) => ({ ...prev, skills: [...prev.skills, value] }));
                    event.target.value = '';
                  }}
                  className="flex-1 bg-transparent text-sm focus:outline-none dark:text-white"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400">Popular:</span>
                {['React', 'Node.js', 'Python', 'Figma', 'TypeScript'].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      !formData.skills.includes(skill) &&
                      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
                    }
                    className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preferred Job Types</label>
              <div className="flex flex-wrap gap-3">
                {['Full-time', 'Part-time', 'Remote', 'Internship', 'Freelance'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const selectedTypes = formData.preferences.types.includes(type)
                        ? formData.preferences.types.filter((item) => item !== type)
                        : [...formData.preferences.types, type];
                      setFormData((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, types: selectedTypes },
                      }));
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                      formData.preferences.types.includes(type)
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-blue-600 dark:border-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-blue-500 bg-slate-100 p-0.5 dark:bg-bg">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <Camera size={32} />
                  </div>
                )}
                <input type="file" onChange={handleAvatarChange} accept="image/*" className="absolute inset-0 cursor-pointer opacity-0" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase text-white">Upload</span>
                </div>
              </div>
              <p className="cursor-pointer text-xs text-slate-400 underline">Tap to upload profile picture</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location / City*</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="Bangalore, India"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-bg dark:text-white"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-100 pt-8 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="order-2 rounded-xl px-6 py-3 text-left font-bold text-slate-500 transition-all hover:text-slate-900 disabled:opacity-0 dark:hover:text-white sm:order-1"
          >
            {'<-'} Back
          </button>

          {saveError && (
            <p className="text-sm text-red-500 text-center">{saveError}</p>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="order-1 w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700 active:scale-95 sm:order-2 sm:w-auto"
            >
              Next Step {'->'}
            </button>
          ) : (
            <button
                type="submit"
                disabled={isSaving}
                className="order-1 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-bold text-white transition-all hover:bg-green-700 active:scale-95 disabled:opacity-60 sm:order-2 sm:w-auto"
            >
                <CheckCircle2 size={20} />
                {isSaving ? 'Saving...' : 'Complete Profile Setup'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CandidateOnboarding;
