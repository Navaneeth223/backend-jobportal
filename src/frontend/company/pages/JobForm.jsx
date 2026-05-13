import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, X, ChevronDown, ArrowLeft } from 'lucide-react';

const SKILLS = [
  'JavaScript','TypeScript','React','Vue.js','Angular','Node.js','Python','Java','Go','Rust','C++','C#',
  'PHP','Ruby','Swift','Kotlin','SQL','PostgreSQL','MySQL','MongoDB','Redis','GraphQL','REST APIs',
  'Docker','Kubernetes','AWS','GCP','Azure','Terraform','CI/CD','Git','Linux','Figma','UX Research',
  'Prototyping','Design Systems','SEO','Google Ads','HubSpot','Content Strategy','Data Analysis',
  'Machine Learning','TensorFlow','PyTorch','Spark','Tableau','Power BI','Excel','Agile','Scrum',
  'Project Management','Communication','Leadership','Problem Solving','Teamwork',
];

const SkillPicker = ({ selected, onChange }) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = SKILLS.filter(s =>
    s.toLowerCase().includes(search.toLowerCase()) && !selected.includes(s)
  );

  const add    = (skill) => onChange([...selected, skill]);
  const remove = (skill) => onChange(selected.filter(s => s !== skill));

  return (
    <div className="flex flex-col gap-2 w-full" ref={ref}>
      <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">
        Requirements / Skills <span className="text-red-500">*</span>
      </label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(skill => (
            <span key={skill} className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
              {skill}
              <button type="button" onClick={() => remove(skill)} className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-200"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-gray-400"
      >
        <span>{selected.length > 0 ? `${selected.length} skill${selected.length > 1 ? 's' : ''} selected` : 'Search and add skills...'}</span>
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-lg dark:border-[#22325a] dark:bg-[#0a1739]">
          <div className="relative border-b border-slate-100 p-2 dark:border-[#1d2b4f]">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-lg bg-slate-50 py-1.5 pl-8 pr-3 text-sm text-slate-700 focus:outline-none dark:bg-[#111827] dark:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-2">
            {filtered.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {filtered.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => { add(skill); setSearch(''); }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-[#22325a] dark:bg-[#111827] dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-3 text-center text-xs text-slate-400 dark:text-gray-500">No skills found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, type = 'text', placeholder, required = false, name, value, onChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-colors focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600"
    />
  </div>
);

const TextAreaField = ({ label, placeholder, required = false, rows = 3, name, value, onChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="resize-none rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-colors focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600"
    />
  </div>
);

const SelectField = ({ label, options, required = false, name, value, onChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const initialState = {
  jobTitle: '', companyName: localStorage.getItem('companyName') || 'Demo Company', category: '', jobType: '',
  location: '', workMode: '', minSalary: '', maxSalary: '',
  description: '', skills: [], benefits: '',
  deadline: '', contactEmail: '',
};

const JobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editJob = location.state?.job;

  const [form, setForm] = useState(editJob ? {
    jobTitle:     editJob.title       || '',
    companyName:  editJob.company     || '',
    category:     editJob.category    || '',
    jobType:      editJob.type        || '',
    location:     editJob.location    || '',
    workMode:     editJob.type        || '',
    minSalary:    '',
    maxSalary:    '',
    description:  editJob.description || '',
    skills:       editJob.skills      || [],
    benefits:     '',
    deadline:     '',
    contactEmail: '',
  } : initialState);

  const isEditing = !!editJob;

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Posted:', form);
    setSubmitted(true);
    setTimeout(() => navigate('/jobs'), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl py-2 sm:py-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{isEditing ? 'Edit Job' : 'Post a Job'}</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{isEditing ? 'Update the job posting details' : 'Fill in the details to create a new job listing'}</p>
        </div>
        <Link
          to="/jobs"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-[#2a3b66] dark:bg-[#0a1739] dark:text-white dark:hover:bg-[#142448]"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-5 shadow-sm dark:border-[#1d2b4f] dark:bg-[#05070d] sm:p-6"
      >
        <section className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Job Details</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g., Senior Software Engineer" required />
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">Company Name</label>
              <div className="rounded-xl border border-slate-200 bg-slate-200 px-3.5 py-2 text-sm text-slate-600 dark:border-gray-700 dark:bg-[#1a2035] dark:text-gray-400 cursor-not-allowed">
                {form.companyName}
              </div>
            </div>
            <SelectField label="Category" name="category" value={form.category} onChange={handleChange} required options={['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Healthcare', 'Education', 'Other']} />
            <SelectField label="Job Type" name="jobType" value={form.jobType} onChange={handleChange} required options={['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Location & Compensation</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g., San Francisco, CA" required />
            <SelectField label="Work Mode" name="workMode" value={form.workMode} onChange={handleChange} required options={['On-site', 'Remote', 'Hybrid']} />
            <InputField label="Minimum Salary" name="minSalary" value={form.minSalary} onChange={handleChange} type="number" placeholder="e.g., 80000" />
            <InputField label="Maximum Salary" name="maxSalary" value={form.maxSalary} onChange={handleChange} type="number" placeholder="e.g., 120000" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Job Description</h3>
          <TextAreaField label="Job Description" name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and what the candidate will be working on..." required rows={4} />
          <SkillPicker selected={form.skills} onChange={skills => setForm(prev => ({ ...prev, skills }))} />
          <TextAreaField label="Benefits" name="benefits" value={form.benefits} onChange={handleChange} placeholder="List perks, benefits, and what makes this role attractive..." rows={3} />
        </section>

        <section className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Application Info</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField label="Application Deadline" name="deadline" value={form.deadline} onChange={handleChange} type="date" required />
            <InputField label="Contact Email" name="contactEmail" value={form.contactEmail} onChange={handleChange} type="email" placeholder="hr@company.com" required />
          </div>
        </section>

        {submitted && (
          <p className="rounded-xl bg-green-100 px-4 py-2.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Job posted successfully! Redirecting...
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#02031b] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#111630] dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isEditing ? 'Save Changes' : 'Post Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="shrink-0 rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
