import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  ChevronRight,
  FileBadge2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';
import ProfileCompletionRing from '../components/ProfileCompletionRing';

const tabs = [
  { id: 'personal', label: 'Personal Info', shortLabel: 'Personal', icon: UserCircle2 },
  { id: 'professional', label: 'Professional', shortLabel: 'Work', icon: Briefcase },
  { id: 'qualifications', label: 'Qualifications', shortLabel: 'Qualifications', icon: GraduationCap },
  { id: 'skills', label: 'Skills & Links', shortLabel: 'Skills', icon: Sparkles },
  { id: 'cv', label: 'CV & Documents', shortLabel: 'CV', icon: FileBadge2 },
];

const SurfaceCard = ({ className = '', children }) => (
  <section className={`rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-panel ${className}`}>
    {children}
  </section>
);

const StatPill = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
      <Icon size={14} />
      <span>{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{value || 'Not added yet'}</p>
  </div>
);

const DetailTile = ({ icon: Icon, label, value, accent = 'blue' }) => {
  const accentClass =
    accent === 'emerald'
      ? 'from-emerald-500/15 to-emerald-100 text-emerald-700 dark:from-emerald-500/20 dark:to-emerald-900/10 dark:text-emerald-300'
      : accent === 'amber'
        ? 'from-amber-500/15 to-amber-100 text-amber-700 dark:from-amber-500/20 dark:to-amber-900/10 dark:text-amber-300'
        : 'from-blue-500/15 to-blue-100 text-blue-700 dark:from-blue-500/20 dark:to-blue-900/10 dark:text-blue-300';

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-bg/80 dark:hover:bg-bg">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClass}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{value || 'Not added yet'}</p>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-bg/60 dark:text-slate-400">
    {message}
  </div>
);

const TimelineCard = ({ title, subtitle, meta, description, icon: Icon }) => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-panel">
    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl" />
    <div className="relative flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{subtitle}</p>
        {meta ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{meta}</p> : null}
        {description ? <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
      </div>
    </div>
  </div>
);

const CandidateProfile = () => {
  const { candidateProfile, updateProfile } = useCandidate();
  const [searchParams] = useSearchParams();
  const activeTab = tabs.some((tab) => tab.id === searchParams.get('tab')) ? searchParams.get('tab') : 'personal';
  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const skills = useMemo(
    () => (candidateProfile.skills || []).filter((skill) => typeof skill === 'string' && skill.trim()),
    [candidateProfile.skills],
  );

  const primarySummary = candidateProfile.bio || 'Add a professional summary to help recruiters understand your strengths quickly.';

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateProfile('avatar', previewUrl);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <SurfaceCard className="overflow-hidden">
        <div className="relative bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_26%),linear-gradient(135deg,#f8fbff_0%,#eef5ff_45%,#f8fafc_100%)] px-5 py-6 dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_22%),linear-gradient(160deg,#0b1220_0%,#101b31_48%,#0b1324_100%)] sm:px-7 sm:py-7">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55))] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.04))] lg:block" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white/80 bg-white shadow-lg dark:border-white/10 dark:bg-bg">
                <img
                  src={candidateProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateProfile.name || 'Candidate')}&background=2563eb&color=fff&size=160`}
                  alt={candidateProfile.name || 'Candidate'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 text-center sm:text-left">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Upload photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                <Sparkles size={13} />
                Candidate Profile
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {candidateProfile.name || 'Your Profile'}
              </h1>
              <p className="mt-2 text-base font-medium text-slate-600 dark:text-slate-300">
                {candidateProfile.title || 'Add your professional headline'}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                {primarySummary}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <ProfileCompletionRing percentage={candidateProfile.completionPercentage} size={76} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Profile Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {candidateProfile.completionPercentage >= 100 ? 'Ready for recruiters' : 'Needs a few more details'}
                  </p>
                </div>
              </div>

              <Link
                to={`/candidate/onboarding?tab=${activeTab}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <Pencil size={16} />
                Edit {activeTabMeta.shortLabel}
              </Link>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatPill icon={Mail} label="Email" value={candidateProfile.email} />
            <StatPill icon={Phone} label="Phone" value={candidateProfile.phone} />
            <StatPill icon={MapPin} label="Location" value={candidateProfile.location} />
            <StatPill icon={Briefcase} label="Experience" value={candidateProfile.experienceYears || `${(candidateProfile.experience || []).length} role${(candidateProfile.experience || []).length === 1 ? '' : 's'} added`} />
          </div>
        </div>
      </SurfaceCard>

      <div className="-mx-1 overflow-x-auto px-1 no-scrollbar">
        <div className="flex min-w-max gap-3 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Link
                key={tab.id}
                to={`/candidate/profile?tab=${tab.id}`}
                className={`group inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-panel dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {isActive ? <ChevronRight size={15} className="opacity-80" /> : null}
              </Link>
            );
          })}
        </div>
      </div>

      {activeTab === 'personal' ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Overview</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DetailTile icon={UserCircle2} label="Full Name" value={candidateProfile.name} />
              <DetailTile icon={Mail} label="Email Address" value={candidateProfile.email} />
              <DetailTile icon={Phone} label="Phone Number" value={candidateProfile.phone} accent="emerald" />
              <DetailTile icon={MapPin} label="Current Location" value={candidateProfile.location} accent="amber" />
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Snapshot</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Recruiter View</h2>
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-bg/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {(candidateProfile.name || 'C').slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="break-words text-lg font-bold text-slate-900 dark:text-white">{candidateProfile.name || 'Candidate name'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{candidateProfile.title || 'Professional title goes here'}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:bg-panel dark:text-slate-300">
                  {candidateProfile.location || 'Location not added yet'}
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:bg-panel dark:text-slate-300">
                  {candidateProfile.phone || 'Phone not added yet'}
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:bg-panel dark:text-slate-300">
                  {candidateProfile.email || 'Email not added yet'}
                </div>
              </div>
            </div>
          </SurfaceCard>
        </div>
      ) : null}

      {activeTab === 'professional' ? (
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Career Summary</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Professional Details</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DetailTile icon={Briefcase} label="Current Role" value={candidateProfile.title} />
              <DetailTile icon={Briefcase} label="Experience Band" value={candidateProfile.experienceYears} accent="emerald" />
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-bg/70">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Professional Summary</p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {candidateProfile.bio || 'No professional summary added yet.'}
              </p>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Highlights</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Quick Facts</h2>
            <div className="mt-5 grid gap-3">
              <StatPill icon={Sparkles} label="Top Skills" value={skills.length ? `${skills.length} skills added` : 'No skills added yet'} />
              <StatPill icon={GraduationCap} label="Education" value={(candidateProfile.education || []).length ? `${candidateProfile.education.length} qualification${candidateProfile.education.length === 1 ? '' : 's'}` : 'No education added yet'} />
              <StatPill icon={Briefcase} label="Experience" value={(candidateProfile.experience || []).length ? `${candidateProfile.experience.length} work entr${candidateProfile.experience.length === 1 ? 'y' : 'ies'}` : 'No experience added yet'} />
            </div>
          </SurfaceCard>
        </div>
      ) : null}

      {activeTab === 'qualifications' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Academic History</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Education</h2>
            </div>
            {(candidateProfile.education || []).length ? (
              candidateProfile.education.map((edu) => (
                <TimelineCard
                  key={edu.id}
                  icon={GraduationCap}
                  title={edu.degree}
                  subtitle={edu.institution || 'Institution not added'}
                  meta={[edu.from, edu.to].filter(Boolean).join(' - ') || 'Timeline not added'}
                />
              ))
            ) : (
              <EmptyState message="No education entries added yet." />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Career Timeline</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Work Experience</h2>
            </div>
            {(candidateProfile.experience || []).length ? (
              candidateProfile.experience.map((exp) => (
                <TimelineCard
                  key={exp.id}
                  icon={Briefcase}
                  title={exp.title}
                  subtitle={exp.company || 'Company not added'}
                  meta={[exp.from, exp.to].filter(Boolean).join(' - ') || 'Timeline not added'}
                  description={exp.description}
                />
              ))
            ) : (
              <EmptyState message="No work experience added yet." />
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'skills' ? (
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Core Strengths</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Skills</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {skills.length ? (
                skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/15 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <EmptyState message="No skills added yet." />
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Online Presence</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Links</h2>
            <div className="mt-5 grid gap-4">
              <DetailTile icon={FileText} label="LinkedIn" value={candidateProfile.linkedin} />
              <DetailTile icon={FileText} label="GitHub" value={candidateProfile.github} accent="emerald" />
              <DetailTile icon={FileText} label="Portfolio" value={candidateProfile.portfolio} accent="amber" />
            </div>
          </SurfaceCard>
        </div>
      ) : null}

      {activeTab === 'cv' ? (
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Documents</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">CV & Resume</h2>

            <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/60 p-5 dark:border-slate-800 dark:from-bg dark:to-blue-900/5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <FileText size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Uploaded Resume</p>
                  <p className="mt-2 break-words text-base font-semibold text-slate-900 dark:text-white">
                    {candidateProfile.cvName || 'No CV uploaded yet'}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Keep your CV updated so recruiters can review your latest profile details and experience.
                  </p>

                  {candidateProfile.cvUrl ? (
                    <a
                      href={candidateProfile.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <FileText size={16} />
                      Open Uploaded Resume
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Status</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Document Readiness</h2>
            <div className="mt-5 grid gap-3">
              <StatPill icon={FileBadge2} label="Resume Upload" value={candidateProfile.cvName ? 'Uploaded successfully' : 'Pending upload'} />
              <StatPill icon={Sparkles} label="Profile Completion" value={`${candidateProfile.completionPercentage}% complete`} />
              <StatPill icon={Briefcase} label="Recruiter Ready" value={candidateProfile.completionPercentage >= 100 ? 'Yes, ready to apply' : 'Add a few more details'} />
            </div>
          </SurfaceCard>
        </div>
      ) : null}
    </div>
  );
};

export default CandidateProfile;
