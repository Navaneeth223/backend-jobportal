import { useState, useEffect } from 'react';
import { User, Building2, Pencil, MapPin, Phone, Mail, Globe, Briefcase } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// --- Shared initial data ---
const initialCompany = {
  name: 'Demo Company',
  category: 'Technology',
  address: '123 Business St, Suite 100',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  email: 'contact@democompany.com',
  website: 'www.democompany.com',
  employees: '50-200 employees',
  logoUrl: '',
  coverUrl: '',
  about: 'Demo Company is a forward-thinking technology firm dedicated to building innovative software solutions that empower businesses worldwide.',
  vision: 'To be the leading platform connecting top talent with world-class companies globally.',
  mission: 'Empowering organizations to build exceptional teams through smart, data-driven hiring.',
};

const initialJob = {
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@democompany.com',
  phone: '+1 (555) 987-6543',
  location: 'San Francisco, CA',
  role: 'HR Manager',
  avatarUrl: '',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  bio: 'Experienced HR professional passionate about connecting great talent with great companies.',
};

// --- Reusable field components ---
const inputCls = 'rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600';

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// --- Info chip for view mode ---
const InfoChip = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300">
    <Icon size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />
    {text}
  </div>
);

const SectionBlock = ({ title, text }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#22325a] dark:bg-[#0a1739]">
    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">{title}</h4>
    <p className="text-sm leading-relaxed text-slate-700 dark:text-gray-300">{text}</p>
  </div>
);

// --- Company: View ---
const CompanyView = ({ data }) => (
  <div className="space-y-5">
    {/* Name + meta */}
    <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-[#1d2b4f]">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.name}</h3>
      <p className="text-sm text-slate-500 dark:text-gray-400">{data.category}</p>
      <p className="text-sm text-slate-400 dark:text-gray-500">{data.address} - {data.location}</p>
    </div>

    {/* Contact chips - 2 col on mobile */}
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <InfoChip icon={MapPin}    text={data.location} />
      <InfoChip icon={Phone}     text={data.phone} />
      <InfoChip icon={Mail}      text={data.email} />
      <InfoChip icon={Globe}     text={data.website} />
      <InfoChip icon={Briefcase} text={data.employees} />
    </div>

    {/* About / Vision / Mission - stacked on mobile, 3-col on sm */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SectionBlock title="About Us" text={data.about} />
      <SectionBlock title="Vision"   text={data.vision} />
      <SectionBlock title="Mission"  text={data.mission} />
    </div>
  </div>
);

// --- Company: Edit (prefilled) ---
const CompanyEdit = ({ data, onChange }) => (
  <>
    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Basic Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Company Name" required>
          <input className={inputCls} value={data.name} onChange={e => onChange('name', e.target.value)} />
        </Field>
        <Field label="Category" required>
          <select className={inputCls} value={data.category} onChange={e => onChange('category', e.target.value)}>
            {['Technology','Healthcare','Finance','Education','Retail'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Logo URL">
          <input className={inputCls} value={data.logoUrl} placeholder="https://example.com/logo.png" onChange={e => onChange('logoUrl', e.target.value)} />
        </Field>
        <Field label="Cover Image URL">
          <input className={inputCls} value={data.coverUrl} placeholder="https://example.com/cover.jpg" onChange={e => onChange('coverUrl', e.target.value)} />
        </Field>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Location" required>
          <input className={inputCls} value={data.location} onChange={e => onChange('location', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={data.phone} onChange={e => onChange('phone', e.target.value)} />
        </Field>
        <Field label="Full Address" required>
          <input className={inputCls} value={data.address} onChange={e => onChange('address', e.target.value)} />
        </Field>
        <Field label="Email" required>
          <input className={inputCls} type="email" value={data.email} onChange={e => onChange('email', e.target.value)} />
        </Field>
        <Field label="Website">
          <input className={inputCls} value={data.website} onChange={e => onChange('website', e.target.value)} />
        </Field>
        <Field label="Company Size">
          <input className={inputCls} value={data.employees} onChange={e => onChange('employees', e.target.value)} />
        </Field>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Company Details</h3>
      <Field label="About Us" required>
        <textarea rows="3" className={`${inputCls} resize-none`} value={data.about} onChange={e => onChange('about', e.target.value)} />
      </Field>
      <Field label="Vision" required>
        <textarea rows="3" className={`${inputCls} resize-none`} value={data.vision} onChange={e => onChange('vision', e.target.value)} />
      </Field>
      <Field label="Mission" required>
        <textarea rows="3" className={`${inputCls} resize-none`} value={data.mission} onChange={e => onChange('mission', e.target.value)} />
      </Field>
    </section>
  </>
);

// --- Job Profile: View ---
const JobView = ({ data }) => (
  <div className="space-y-5">
    {/* Avatar + name - centered on mobile, row on sm */}
    <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-5 dark:border-[#1d2b4f] sm:flex-row sm:items-start">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-3xl font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        {data.firstName.charAt(0)}{data.lastName.charAt(0)}
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.firstName} {data.lastName}</h3>
        <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {data.role}
        </span>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-gray-400">{data.bio}</p>
      </div>
    </div>

    {/* Contact chips - 2 col on mobile */}
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <InfoChip icon={MapPin} text={data.location} />
      <InfoChip icon={Phone}  text={data.phone} />
      <InfoChip icon={Mail}   text={data.email} />
      <InfoChip icon={Globe}  text={data.linkedin} />
    </div>
  </div>
);

// --- Job Profile: Edit (prefilled) ---
const JobEdit = ({ data, onChange }) => (
  <>
    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Personal Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="First Name" required>
          <input className={inputCls} value={data.firstName} onChange={e => onChange('firstName', e.target.value)} />
        </Field>
        <Field label="Last Name" required>
          <input className={inputCls} value={data.lastName} onChange={e => onChange('lastName', e.target.value)} />
        </Field>
        <Field label="Email" required>
          <input className={inputCls} type="email" value={data.email} onChange={e => onChange('email', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={data.phone} onChange={e => onChange('phone', e.target.value)} />
        </Field>
        <Field label="Location">
          <input className={inputCls} value={data.location} onChange={e => onChange('location', e.target.value)} />
        </Field>
        <Field label="Role / Title">
          <select className={inputCls} value={data.role} onChange={e => onChange('role', e.target.value)}>
            {['Recruiter','HR Manager','Hiring Manager','Admin'].map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Profile Details</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Avatar URL">
          <input className={inputCls} value={data.avatarUrl} placeholder="https://example.com/avatar.png" onChange={e => onChange('avatarUrl', e.target.value)} />
        </Field>
        <Field label="LinkedIn">
          <input className={inputCls} value={data.linkedin} onChange={e => onChange('linkedin', e.target.value)} />
        </Field>
      </div>
      <Field label="Bio" required>
        <textarea rows="3" className={`${inputCls} resize-none`} value={data.bio} onChange={e => onChange('bio', e.target.value)} />
      </Field>
    </section>

    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Security</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Current Password">
          <input className={inputCls} type="password" placeholder="Enter current password" />
        </Field>
        <Field label="New Password">
          <input className={inputCls} type="password" placeholder="Enter new password" />
        </Field>
      </div>
    </section>
  </>
);

// --- Main Profile page ---
const Profile = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') === 'company' ? 'company' : 'job';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [editMode, setEditMode]   = useState(false);

  useEffect(() => {
    setActiveTab(tabParam);
    setEditMode(false);
  }, [tabParam]);
  const [company,  setCompany]    = useState(initialCompany);
  const [job,      setJob]        = useState(initialJob);
  const [draft,    setDraft]      = useState(null);

  const isCompany = activeTab === 'company';

  const startEdit = () => {
    setDraft(isCompany ? { ...company } : { ...job });
    setEditMode(true);
  };

  const cancelEdit = () => { setEditMode(false); setDraft(null); };

  const saveEdit = () => {
    if (isCompany) setCompany(draft);
    else setJob(draft);
    setEditMode(false);
    setDraft(null);
  };

  const handleChange = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));

  return (
    <div className="mx-auto max-w-5xl px-0 py-2 sm:py-6">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-5 shadow-sm dark:border-[#1d2b4f] dark:bg-[#05070d] sm:p-6">

        {/* Header */}
        <div className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            {isCompany ? <Building2 size={24} className="text-blue-600 dark:text-[#2d7dff]" /> : <User size={24} className="text-blue-600 dark:text-[#2d7dff]" />}
            <div className="h-7 w-px bg-slate-300 dark:bg-[#35538e]" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {isCompany ? 'Company Profile' : 'My Profile'}
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
            {!editMode && (
              <button onClick={startEdit} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 sm:w-auto sm:py-2">
                <Pencil size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!editMode && isCompany  && <CompanyView data={company} />}
        {!editMode && !isCompany && <JobView data={job} />}
        {editMode  && isCompany  && <CompanyEdit data={draft} onChange={handleChange} />}
        {editMode  && !isCompany && <JobEdit data={draft} onChange={handleChange} />}

        {/* Actions */}
        {editMode && (
          <div className="flex items-center gap-3 pt-2">
            <button onClick={saveEdit} className="flex-1 rounded-xl bg-[#02031b] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#111630] dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Save Changes
            </button>
            <button onClick={cancelEdit} className="shrink-0 rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800">
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;

