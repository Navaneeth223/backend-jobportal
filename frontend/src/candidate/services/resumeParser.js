import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth/mammoth.browser';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = ['pdf', 'docx'];
const SECTION_HEADERS = [
  'summary',
  'profile',
  'about',
  'experience',
  'work experience',
  'employment',
  'education',
  'skills',
  'technical skills',
  'projects',
  'certifications',
  'achievements',
  'contact',
];

const COMMON_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Next.js',
  'Tailwind CSS',
  'HTML',
  'CSS',
  'Redux',
  'Figma',
  'Python',
  'Java',
  'C#',
  'AWS',
  'Docker',
  'Kubernetes',
  'MongoDB',
  'PostgreSQL',
  'SQL',
  'REST API',
  'GraphQL',
  'Git',
  'Angular',
  'Vue',
  'React Native',
  'Flutter',
  'Product Design',
  'UI Design',
  'UX Research',
  'Testing',
];

const sectionConfidenceLevels = {
  high: { label: 'High confidence', tone: 'emerald' },
  medium: { label: 'Needs review', tone: 'amber' },
  low: { label: 'Low confidence', tone: 'rose' },
};

export const getResumeSupportMessage = () => 'Supports PDF and DOCX up to 5MB.';

export const getFileExtension = (fileName = '') => {
  const segments = fileName.split('.');
  return segments.length > 1 ? segments.pop().toLowerCase() : '';
};

export const validateResumeFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Please choose a resume file to continue.' };
  }

  const extension = getFileExtension(file.name);

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PDF or DOCX resume.',
    };
  }

  if (file.size > MAX_RESUME_FILE_SIZE) {
    return {
      valid: false,
      error: 'This file is larger than 5MB. Please upload a smaller resume.',
    };
  }

  return { valid: true, extension };
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeWhitespace = (text = '') =>
  text
    .replace(/\r/g, '\n')
    .split('\u0000')
    .join('')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const isLikelyHeading = (line = '') => {
  const normalized = line.trim().toLowerCase();
  if (!normalized || normalized.length > 40) return false;
  return SECTION_HEADERS.includes(normalized);
};

const splitLines = (text) =>
  normalizeWhitespace(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const extractSectionBlock = (text, heading) => {
  const lines = splitLines(text);
  const headingIndex = lines.findIndex((line) => line.toLowerCase() === heading.toLowerCase());

  if (headingIndex === -1) return '';

  const collected = [];

  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const currentLine = lines[index];
    if (collected.length > 0 && isLikelyHeading(currentLine)) {
      break;
    }
    collected.push(currentLine);
  }

  return collected.join('\n').trim();
};

const parsePdfText = async (file) => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const items = textContent.items || [];

    let currentLineY = null;
    let currentLine = [];
    const pageLines = [];

    items.forEach((item) => {
      const y = item.transform?.[5] ?? 0;
      if (currentLineY !== null && Math.abs(y - currentLineY) > 5) {
        pageLines.push(currentLine.join(' ').trim());
        currentLine = [];
      }

      currentLine.push('str' in item ? item.str : '');
      currentLineY = y;
    });

    if (currentLine.length) {
      pageLines.push(currentLine.join(' ').trim());
    }

    const pageText = pageLines.filter(Boolean).join('\n');
    if (pageText) {
      pages.push(pageText);
    }
  }

  return pages.join('\n\n');
};

const parseDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return {
    text: result.value,
    warnings: result.messages.map((message) => message.message),
  };
};

const cleanPhoneNumber = (phone = '') => phone.replace(/\s{2,}/g, ' ').trim();

const extractEmail = (text) => {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : '';
};

const extractPhone = (text) => {
  const match = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,5}[\s-]?\d{3,5}/);
  return match ? cleanPhoneNumber(match[0]) : '';
};

const extractLink = (text, keyword) => {
  const pattern = new RegExp(`https?:\\/\\/[^\\s]*${escapeRegExp(keyword)}[^\\s]*`, 'i');
  const match = text.match(pattern);
  return match ? match[0].replace(/[),.;]+$/, '') : '';
};

const extractPortfolio = (text, excludedLinks) => {
  const matches = text.match(/https?:\/\/[^\s]+/gi) || [];
  return (
    matches
      .map((link) => link.replace(/[),.;]+$/, ''))
      .find((link) => !excludedLinks.some((excluded) => excluded && link.includes(excluded))) || ''
  );
};

const extractDob = (text) => {
  const labelMatch = text.match(/(?:date of birth|dob|born)\s*[:-]?\s*([\d]{1,2}[./-][\d]{1,2}[./-][\d]{2,4}|[\d]{4}[./-][\d]{1,2}[./-][\d]{1,2})/i);
  if (labelMatch) return labelMatch[1];

  const dateMatch = text.match(/\b(?:0?[1-9]|[12]\d|3[01])[./-](?:0?[1-9]|1[0-2])[./-](?:\d{2}|\d{4})\b/);
  return dateMatch ? dateMatch[0] : '';
};

const extractGender = (text) => {
  const genderMatch = text.match(/\b(male|female|non[- ]binary|nonbinary|other|transgender|man|woman)\b/i);
  return genderMatch ? genderMatch[1].replace(/\bnon[- ]binary\b/i, 'Non-binary') : '';
};

const extractPreferredJobTypes = (text) => {
  const found = new Set();
  const patterns = {
    'Full-time': /\bfull[- ]time\b/i,
    'Part-time': /\bpart[- ]time\b/i,
    Remote: /\bremote\b/i,
    Internship: /\bintern(ship|ships)?\b/i,
    Freelance: /\bfreelance\b/i,
    Contract: /\bcontract\b/i,
  };

  Object.entries(patterns).forEach(([label, regex]) => {
    if (regex.test(text)) found.add(label);
  });

  return Array.from(found);
};

const extractName = (lines) => {
  const candidate = lines.find((line) => {
    if (!line || line.length > 40) return false;
    if (line.includes('@') || /\d/.test(line) || line.includes('http')) return false;
    const words = line.split(/\s+/);
    return words.length >= 2 && words.length <= 4;
  });

  return candidate || '';
};

const extractTitle = (lines, name) => {
  const candidate = lines.find((line) => {
    if (!line || line === name || line.length > 70) return false;
    if (line.includes('@') || line.includes('http')) return false;
    return /(developer|engineer|designer|manager|analyst|specialist|lead|consultant|architect|recruiter|marketer)/i.test(line);
  });

  return candidate || '';
};

const isLikelySkillListLine = (line = '') => {
  const normalized = line.toLowerCase();
  const matchedSkills = COMMON_SKILLS.filter((skill) => {
    const pattern = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i');
    return pattern.test(line);
  });

  return (
    /\b(skills?|technologies|tools)\b/i.test(line) ||
    matchedSkills.length >= 2 ||
    (matchedSkills.length >= 1 && /[,|/]/.test(normalized))
  );
};

const extractLocation = (lines) => {
  const candidate = lines.find((line) => {
    if (!line || line.length > 60) return false;
    if (line.includes('@') || line.includes('http')) return false;
    if (isLikelyHeading(line) || isLikelySkillListLine(line)) return false;
    return /,/.test(line) || /(india|usa|uae|remote|bangalore|bengaluru|mumbai|delhi|hyderabad|pune|chennai|kolkata)/i.test(line);
  });

  return candidate || '';
};

const extractSummary = (text, lines, title) => {
  const explicitSummary =
    extractSectionBlock(text, 'summary') ||
    extractSectionBlock(text, 'profile') ||
    extractSectionBlock(text, 'about');

  if (explicitSummary) {
    return explicitSummary.split('\n').slice(0, 3).join(' ').trim();
  }

  const firstContent = lines
    .filter((line) => line !== title)
    .find((line) => line.length > 60 && !line.includes('@') && !line.includes('http'));

  return firstContent || '';
};

const extractSkills = (text) => {
  const explicitSkills = extractSectionBlock(text, 'skills') || extractSectionBlock(text, 'technical skills');
  const collected = new Set();

  if (explicitSkills) {
    explicitSkills
      .split(/[\n,|/•]+/)
      .map((skill) => skill.replace(/^[-*]/, '').trim())
      .filter((skill) => skill.length > 1 && skill.length < 40)
      .forEach((skill) => collected.add(skill));
  }

  COMMON_SKILLS.forEach((skill) => {
    const pattern = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i');
    if (pattern.test(text)) {
      collected.add(skill);
    }
  });

  return Array.from(collected).slice(0, 12);
};

const parseEducationEntries = (text) => {
  const block = extractSectionBlock(text, 'education');
  if (!block) return [];

  const lines = block.split('\n').filter(Boolean);
  const entries = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];
    if (!current) continue;

    const next = lines[index + 1] || '';
    const yearMatch = `${current} ${next}`.match(/(19|20)\d{2}(?:\s*[-–]\s*(19|20)\d{2}|[\s-]*Present)?/g);

    if (/(b\.?tech|bachelor|master|m\.?tech|mba|bca|mca|bsc|msc|diploma|phd|degree)/i.test(current)) {
      entries.push({
        id: `edu-${index}`,
        degree: current,
        institution: next && !/(19|20)\d{2}/.test(next) ? next : '',
        from: yearMatch?.[0]?.split(/[-–]/)[0]?.trim() || '',
        to: yearMatch?.[0]?.split(/[-–]/)[1]?.trim() || '',
        grade: '',
      });
    }
  }

  return entries.slice(0, 4);
};

const parseExperienceEntries = (text) => {
  const block =
    extractSectionBlock(text, 'experience') ||
    extractSectionBlock(text, 'work experience') ||
    extractSectionBlock(text, 'employment');

  if (!block) return [];

  const lines = block.split('\n').filter(Boolean);
  const entries = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];
    const next = lines[index + 1] || '';
    const afterNext = lines[index + 2] || '';
    const combined = `${current} ${next} ${afterNext}`;
    const hasDateRange = /(19|20)\d{2}|present/i.test(combined);

    if (!hasDateRange) continue;

    entries.push({
      id: `exp-${index}`,
      title: current,
      company: next && !/(19|20)\d{2}|present/i.test(next) ? next : '',
      from: combined.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s*(19|20)\d{2}/i)?.[0] || '',
      to: combined.match(/(?:-|–|to)\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s*(19|20)\d{2})/i)?.[1] || '',
      description: afterNext.length > 20 ? afterNext : '',
    });
  }

  return entries.slice(0, 5);
};

const deriveExperienceYears = (experienceEntries) => {
  if (!experienceEntries.length) return '';
  if (experienceEntries.length === 1) return '1-2';
  if (experienceEntries.length <= 2) return '3-5';
  if (experienceEntries.length <= 4) return '5-10';
  return '10+';
};

const buildConfidence = (data) => ({
  personal: data.name && (data.email || data.phone) ? 'high' : data.name ? 'medium' : 'low',
  professional: data.title || data.bio ? 'medium' : 'low',
  skills: data.skills.length >= 4 ? 'high' : data.skills.length > 0 ? 'medium' : 'low',
  education: data.education.length > 0 ? 'medium' : 'low',
  experience: data.experience.length > 0 ? 'medium' : 'low',
});

const structureResumeData = (text) => {
  const lines = splitLines(text);
  const name = extractName(lines);
  const title = extractTitle(lines, name);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const location = extractLocation(lines);
  const linkedin = extractLink(text, 'linkedin.com');
  const github = extractLink(text, 'github.com');
  const portfolio = extractPortfolio(text, ['linkedin.com', 'github.com']);
  const skills = extractSkills(text);
  const education = parseEducationEntries(text);
  const experience = parseExperienceEntries(text);
  const bio = extractSummary(text, lines, title);
  const dob = extractDob(text);
  const gender = extractGender(text);
  const preferences = { types: extractPreferredJobTypes(text) };

  return {
    name,
    email,
    phone,
    location,
    title,
    bio,
    linkedin,
    github,
    portfolio,
    experienceYears: deriveExperienceYears(experience),
    skills,
    education,
    experience,
    dob,
    gender,
    preferences,
  };
};

export const getConfidenceMeta = (level) => sectionConfidenceLevels[level] || sectionConfidenceLevels.low;

export const parseResumeFile = async (file) => {
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  let extractedText = '';
  let warnings = [];

  if (validation.extension === 'pdf') {
    extractedText = await parsePdfText(file);
  }

  if (validation.extension === 'docx') {
    const result = await parseDocxText(file);
    extractedText = result.text;
    warnings = result.warnings;
  }

  const text = normalizeWhitespace(extractedText);

  if (!text) {
    throw new Error('We could not read any text from this resume. Please try another file or enter details manually.');
  }

  const data = structureResumeData(text);
  const confidence = buildConfidence(data);

  if (!data.name && !data.email && !data.skills.length) {
    throw new Error('The resume was uploaded, but we could not confidently extract profile details from it.');
  }

  return {
    fileName: file.name,
    extension: validation.extension,
    text,
    data,
    confidence,
    warnings,
  };
};
