import { getConfidenceMeta } from '../services/resumeParser';

export const RESUME_SECTION_CONFIG = [
  {
    id: 'personal',
    label: 'Personal Information',
    type: 'fields',
    fields: ['name', 'email', 'phone', 'location', 'dob', 'gender'],
  },
  {
    id: 'professional',
    label: 'Professional Details',
    type: 'fields',
    fields: ['title', 'bio', 'experienceYears', 'linkedin', 'github', 'portfolio'],
  },
  {
    id: 'preferences',
    label: 'Preferred Job Types',
    type: 'fields',
    fields: ['preferences.types'],
  },
  {
    id: 'skills',
    label: 'Skills',
    type: 'list',
    field: 'skills',
  },
  {
    id: 'education',
    label: 'Education',
    type: 'list',
    field: 'education',
  },
  {
    id: 'experience',
    label: 'Experience',
    type: 'list',
    field: 'experience',
  },
];

const isFilledValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

const getFieldValue = (data = {}, fieldPath = '') => {
  return fieldPath.split('.').reduce((value, key) => {
    if (value && typeof value === 'object') {
      return value[key];
    }
    return undefined;
  }, data);
};

const setFieldValue = (target, fieldPath, value) => {
  const keys = fieldPath.split('.');
  const lastKey = keys.pop();
  let current = target;

  keys.forEach((key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  });

  current[lastKey] = value;
};

const withStableEntryIds = (entries = [], prefix) =>
  entries.map((entry, index) => ({
    ...entry,
    id: entry.id || `${prefix}-${Date.now()}-${index}`,
  }));

const normalizeSkillEntries = (entries = []) =>
  entries
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim();
      if (entry && typeof entry === 'object') {
        if (typeof entry.label === 'string') return entry.label.trim();
        return Object.keys(entry)
          .filter((key) => /^\d+$/.test(key))
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => entry[key])
          .join('')
          .trim();
      }
      return '';
    })
    .filter(Boolean);

export const getResumeSections = (parsedResume) =>
  RESUME_SECTION_CONFIG.map((section) => {
    const confidenceLevel = parsedResume?.confidence?.[section.id] || 'low';
    const confidence = getConfidenceMeta(confidenceLevel);

    if (section.type === 'fields') {
      const entries = section.fields
        .map((field) => ({ field, value: getFieldValue(parsedResume?.data, field) }))
        .filter((entry) => isFilledValue(entry.value));

      return {
        ...section,
        confidence,
        hasData: entries.length > 0,
        entries,
      };
    }

    const entries = parsedResume?.data?.[section.field] || [];

    return {
      ...section,
      confidence,
      hasData: entries.length > 0,
      entries,
    };
  }).filter((section) => section.hasData);

export const getDefaultSelectedSections = (parsedResume) =>
  getResumeSections(parsedResume).map((section) => section.id);

export const mergeProfileSections = (baseProfile, parsedResume, selectedSectionIds) => {
  const selected = new Set(selectedSectionIds);
  const nextProfile = { ...baseProfile };
  const parsedData = parsedResume?.data || {};

  RESUME_SECTION_CONFIG.forEach((section) => {
    if (!selected.has(section.id)) return;

    if (section.type === 'fields') {
      section.fields.forEach((field) => {
        const incomingValue = getFieldValue(parsedData, field);
        if (isFilledValue(incomingValue)) {
          if (field.includes('.')) {
            setFieldValue(nextProfile, field, incomingValue);
          } else {
            nextProfile[field] = incomingValue;
          }
        }
      });
      return;
    }

    const incomingEntries = parsedData[section.field];
    if (Array.isArray(incomingEntries) && incomingEntries.length > 0) {
      nextProfile[section.field] =
        section.field === 'skills'
          ? normalizeSkillEntries(incomingEntries)
          : withStableEntryIds(incomingEntries, section.field);
    }
  });

  return nextProfile;
};
