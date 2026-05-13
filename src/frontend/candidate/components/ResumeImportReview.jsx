import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, LoaderCircle, Sparkles, Upload } from 'lucide-react';
import { getResumeSupportMessage, parseResumeFile, validateResumeFile } from '../services/resumeParser';
import { getDefaultSelectedSections, getResumeSections, mergeProfileSections } from '../utils/profileMerge';

const fieldLabels = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  dob: 'Date of Birth',
  gender: 'Gender',
  title: 'Title',
  bio: 'Summary',
  experienceYears: 'Experience',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  portfolio: 'Portfolio',
  'preferences.types': 'Preferred job types',
};

const confidenceClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
};

const formatPreviewValue = (value) => {
  if (!value) return 'Not detected';
  if (Array.isArray(value)) return `${value.length} items detected`;
  return value;
};

const ResumeImportReview = ({
  currentProfile,
  cvName,
  cvUrl,
  onApply,
  onFileReady,
  onClearFile,
  onParsedResumeUpdate,
}) => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [parsedResume, setParsedResume] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);

  const sections = useMemo(() => getResumeSections(parsedResume), [parsedResume]);

  const toggleSection = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((item) => item !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setStatus('error');
      setError(validation.error);
      setParsedResume(null);
      return;
    }

    const fileMeta = {
      cvName: file.name,
      cvUrl: URL.createObjectURL(file),
    };

    onFileReady?.(fileMeta);
    setStatus('parsing');
    setError('');

    try {
      const result = await parseResumeFile(file);
      setParsedResume(result);
      setSelectedSections(getDefaultSelectedSections(result));
      setStatus('ready');
    } catch (parseError) {
      setParsedResume(null);
      setStatus('error');
      setError(parseError.message || 'Unable to parse this resume right now.');
    }
  };

  const handleApplySelected = () => {
    if (!parsedResume || selectedSections.length === 0) return;

    const mergedProfile = mergeProfileSections(currentProfile, parsedResume, selectedSections);
    onApply?.({
      profile: mergedProfile,
      fileMeta: {
        cvName,
        cvUrl,
      },
      selectedSections,
      parsedResume,
    });
  };

  useEffect(() => {
    onParsedResumeUpdate?.({
      parsedResume,
      selectedSections,
      fileMeta: { cvName, cvUrl },
    });
  }, [parsedResume, selectedSections, cvName, cvUrl, onParsedResumeUpdate]);

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-bg/70 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload CV / Resume</p>
            <p className="mt-1 text-sm text-slate-500">{getResumeSupportMessage()}</p>
          </div>

          {cvName ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              <FileText size={14} />
              <span className="max-w-[12rem] truncate">{cvName}</span>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/30 dark:border-slate-800 dark:bg-panel dark:hover:border-blue-800/60 dark:hover:bg-blue-900/5 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
            {status === 'parsing' ? <LoaderCircle size={26} className="animate-spin" /> : <Upload size={26} />}
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            {status === 'parsing' ? 'Uploading and parsing resume...' : 'Choose a PDF or DOCX resume'}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            We’ll detect your profile details, then let you review everything before applying it.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <label className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">
              {cvName ? 'Replace Resume' : 'Select File'}
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {cvName && onClearFile ? (
              <button
                type="button"
                onClick={() => {
                  setParsedResume(null);
                  setSelectedSections([]);
                  setStatus('idle');
                  setError('');
                  onClearFile();
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Clear file
              </button>
            ) : null}
          </div>
        </div>

        {status === 'error' ? (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Auto-fill is unavailable for this file.</p>
              <p className="mt-1">{error}</p>
              <p className="mt-1 text-xs opacity-80">You can still continue with manual profile entry.</p>
            </div>
          </div>
        ) : null}
      </div>

      {parsedResume && status === 'ready' ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-panel sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review extracted profile data</h3>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Choose which sections to apply. Existing profile values stay untouched for anything you leave unchecked.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSections(sections.map((section) => section.id))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelectedSections([])}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            </div>
          </div>

          {parsedResume.warnings?.length ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">Parser notes</p>
              <p className="mt-1">{parsedResume.warnings[0]}</p>
            </div>
          ) : null}

          <div className="space-y-3">
            {sections.map((section) => (
              <label
                key={section.id}
                className={`block rounded-2xl border p-4 transition-colors ${
                  selectedSections.includes(section.id)
                    ? 'border-blue-200 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-900/10'
                    : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-bg/60'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.id)}
                      onChange={() => toggleSection(section.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{section.label}</p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${confidenceClasses[section.confidence.tone]}`}
                        >
                          {section.confidence.label}
                        </span>
                      </div>

                      <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {section.type === 'fields'
                          ? section.entries.map((entry) => (
                              <div key={entry.field}>
                                <span className="font-medium text-slate-900 dark:text-white">{fieldLabels[entry.field] || entry.field}:</span>{' '}
                                <span>{formatPreviewValue(entry.value)}</span>
                              </div>
                            ))
                          : section.entries.slice(0, 3).map((entry, index) => (
                              <div key={entry.id || `${section.id}-${index}`}>
                                {section.id === 'skills' ? (
                                  <span>{entry}</span>
                                ) : section.id === 'education' ? (
                                  <span>{entry.degree}{entry.institution ? `, ${entry.institution}` : ''}</span>
                                ) : (
                                  <span>{entry.title}{entry.company ? `, ${entry.company}` : ''}</span>
                                )}
                              </div>
                            ))}

                        {section.type === 'list' && section.entries.length > 3 ? (
                          <p className="text-xs text-slate-400">+ {section.entries.length - 3} more items</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              {selectedSections.length > 0
                ? `${selectedSections.length} section${selectedSections.length > 1 ? 's' : ''} selected for import`
                : 'Select at least one section to apply the parsed data.'}
            </div>

            <button
              type="button"
              onClick={handleApplySelected}
              disabled={selectedSections.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              Apply selected data
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResumeImportReview;
