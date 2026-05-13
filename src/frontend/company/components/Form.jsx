import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Reusable Input Component to keep code clean
const InputField = ({ label, type = "text", placeholder, required = false, value, onChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-colors focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600"
    />
  </div>
);

// Reusable Textarea Component
const TextAreaField = ({ label, placeholder, required = false }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea 
      placeholder={placeholder}
      rows="3"
      className="resize-none rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-colors focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600"
    />
  </div>
);

const Form = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');

  const handleCreate = () => {
    if (companyName.trim()) {
      localStorage.setItem('companyName', companyName.trim());
    }
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-5 shadow-sm dark:border-[#1d2b4f] dark:bg-[#05070d] sm:p-6">
      <div className="flex items-center gap-2.5 pb-1">
        <Building2 size={26} className="text-blue-600 dark:text-[#2d7dff]" />
        <div className="h-8 w-px bg-slate-300 dark:bg-[#35538e]" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Create Company Profile</h2>
      </div>

      <section className="space-y-4">
        <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField label="Company Name" placeholder="Enter company name" required value={companyName} onChange={e => setCompanyName(e.target.value)} />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-900 dark:text-gray-300 sm:text-sm">Category *</label>
            <select className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white">
              <option>Select category</option>
              <option>Technology</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
          </div>
          <InputField label="Logo URL" placeholder="https://example.com/logo.png" />
          <InputField label="Cover Image URL" placeholder="https://example.com/cover.jpg" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField label="Location" placeholder="e.g., San Francisco, CA" required />
          <InputField label="Phone" placeholder="+1 (555) 123-4567" />
          <InputField label="Full Address" placeholder="123 Business St, Suite 100" required />
          <InputField label="Email" type="email" placeholder="contact@company.com" required />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="border-b border-slate-200 pb-2.5 text-xl font-semibold text-slate-900 dark:border-[#1d2b4f] dark:text-white">Company Details</h3>
        <TextAreaField label="About Us" placeholder="Tell us about your company..." required />
        <TextAreaField label="Vision" placeholder="What is your company's vision?" required />
        <TextAreaField label="Mission" placeholder="What is your company's mission?" required />
      </section>

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleCreate} className="flex-1 rounded-xl bg-[#02031b] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#111630] dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Create Company
        </button>
        <button onClick={() => navigate('/dashboard')} className="shrink-0 rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Form;
