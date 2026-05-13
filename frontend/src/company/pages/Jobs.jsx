import { useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Users, Pencil, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const jobData = [
  { id: 1, title: 'Senior Software Engineer', company: 'Demo Company', location: 'San Francisco, CA', category: 'Engineering', salary: '$120,000 - $180,000', type: 'Hybrid',  status: 'Open',   daysAgo: 14, description: 'We are looking for an experienced Senior Software Engineer to join our growing engineering team. In this role you will architect and build scalable backend services, contribute to our frontend React applications, and collaborate closely with product managers and designers to deliver high-quality features. You will mentor junior engineers, participate in system design discussions, and help shape our technical roadmap. We value clean code, thorough code reviews, and a culture of continuous improvement.', postedAt: 'Posted 2 weeks ago', applicants: 4 },
  { id: 2, title: 'Product Designer',          company: 'Demo Company', location: 'Remote',            category: 'Design',       salary: '$90,000 - $140,000',  type: 'Remote',  status: 'Open',   daysAgo: 14, description: 'Join our design team to create beautiful and intuitive user experiences across our web and mobile platforms. You will own the end-to-end design process - from user research and journey mapping to wireframes, prototypes, and polished high-fidelity designs. Working closely with engineers and product managers, you will ensure that every interaction is accessible, consistent, and delightful. You will also contribute to and maintain our growing design system used across all product surfaces.', postedAt: 'Posted 2 weeks ago', applicants: 3 },
  { id: 3, title: 'Marketing Manager',         company: 'Demo Company', location: 'New York, NY',      category: 'Marketing',    salary: '$85,000 - $125,000',  type: 'On-site', status: 'Open',   daysAgo: 7,  description: 'We are seeking a strategic and data-driven Marketing Manager to lead our marketing initiatives and grow our brand presence. You will develop and execute multi-channel campaigns spanning SEO, paid media, email marketing, and social platforms. You will manage a team of marketers, own the content calendar, analyze campaign performance, and report on key growth metrics. The ideal candidate has a strong creative instinct balanced with an analytical mindset and a track record of driving measurable results.', postedAt: 'Posted 1 week ago',  applicants: 3 },
  { id: 4, title: 'DevOps Engineer',            company: 'Demo Company', location: 'Seattle, WA',       category: 'Engineering',  salary: '$110,000 - $160,000', type: 'Hybrid',  status: 'Closed', daysAgo: 21, description: 'We are looking for a skilled DevOps Engineer to help us build and maintain our cloud infrastructure. You will manage CI/CD pipelines, Kubernetes clusters, and observability stacks while driving reliability and automation across our platform.', postedAt: 'Posted 3 weeks ago', applicants: 2 },
  { id: 5, title: 'Data Scientist',             company: 'Demo Company', location: 'Austin, TX',        category: 'Engineering',  salary: '$100,000 - $150,000', type: 'Remote',  status: 'Open',   daysAgo: 7,  description: 'Join our data team to build machine learning models and analytics pipelines that drive product decisions. You will work closely with engineering and product to translate data insights into actionable outcomes.', postedAt: 'Posted 1 week ago',  applicants: 2 },
  { id: 6, title: 'Frontend Developer',         company: 'Demo Company', location: 'Remote',            category: 'Engineering',  salary: '$80,000 - $120,000',  type: 'Remote',  status: 'Open',   daysAgo: 4,  description: 'We are looking for a Frontend Developer to build responsive, accessible web interfaces. You will work with our design system and collaborate closely with designers and backend engineers to ship polished product features.', postedAt: 'Posted 4 days ago',  applicants: 2 },
  { id: 7, title: 'Backend Engineer',           company: 'Demo Company', location: 'Chicago, IL',       category: 'Engineering',  salary: '$100,000 - $145,000', type: 'On-site', status: 'Open',   daysAgo: 5,  description: 'We need a Backend Engineer to design and maintain our REST APIs and microservices. You will own services end-to-end, optimize database performance, and collaborate with frontend teams to deliver cohesive features.', postedAt: 'Posted 5 days ago',  applicants: 2 },
  { id: 8, title: 'HR Specialist',              company: 'Demo Company', location: 'Boston, MA',        category: 'HR',           salary: '$65,000 - $90,000',   type: 'On-site', status: 'Closed', daysAgo: 7,  description: 'We are hiring an HR Specialist to manage full-cycle recruitment, onboarding, and employee relations. You will work closely with hiring managers to build great teams and foster a positive workplace culture.', postedAt: 'Posted 1 week ago',  applicants: 2 },
];

const typeBadge = {
  Remote:   'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Hybrid:   'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  'On-site':'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
};

// --- Compact row card ---
const JobCard = ({ job, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(job)}
    className={`mb-2 cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
      isSelected
        ? 'border-blue-400 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-500/10'
        : 'border-slate-200 bg-[#fcfdff] hover:border-slate-300 dark:border-[#22325a] dark:bg-[#05070d] dark:hover:border-[#3456a5]'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        {job.title.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{job.title}</p>
        <p className="truncate text-xs text-slate-500 dark:text-gray-400">{job.location}</p>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[job.type]}`}>{job.type}</span>
    </div>
    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400 dark:text-gray-500">
      <span className="flex items-center gap-1"><DollarSign size={11} />{job.salary}</span>
      <span className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-gray-300"><Users size={13} />{job.applicants} applicants</span>
      <span className={`font-semibold ${job.status === 'Open' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
        * {job.status}
      </span>
    </div>
  </div>
);

// --- Detail panel ---
const JobDetail = ({ job, onClose, onDelete, onToggleStatus }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  if (!job) return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#fcfdff] p-8 text-center dark:border-[#22325a] dark:bg-[#05070d]">
      <p className="text-sm text-slate-400 dark:text-gray-500">Select a job to view details</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fcfdff] shadow-sm dark:border-[#22325a] dark:bg-[#05070d]">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-[#22325a]">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">{job.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeBadge[job.type]}`}>{job.type}</span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${job.status === 'Open' ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400' : 'border-red-200 bg-red-100 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'}`}>
            {job.status}
          </span>
          {onClose && (
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#142448] lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-5">
        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-400" />{job.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-blue-400" />{job.category}</span>
          <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-green-400" />{job.salary}</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Clock size={12} />{job.postedAt}</span>
          <span
            onClick={() => navigate(`/candidates?job=${encodeURIComponent(job.title)}`)}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-green-600 hover:underline dark:text-green-400"
          >
            <Users size={14} />{job.applicants} applicants
          </span>
        </div>

        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Description</h4>
          <p className={`text-sm leading-relaxed text-slate-700 dark:text-gray-300 lg:line-clamp-none ${!expanded ? 'line-clamp-2' : ''}`}>
            {job.description}
          </p>
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 lg:hidden"
          >
            {expanded ? 'Show less' : 'More...'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-[#22325a]">
          <button
            onClick={() => navigate('/post-job', { state: { job } })}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 dark:hover:bg-[#142448]"
          >
            <Pencil size={14} /> Edit Job
          </button>
          <button
            onClick={() => navigate(`/candidates?job=${encodeURIComponent(job.title)}`)}
            className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
          >
            <Users size={14} /> View Candidates
          </button>
          <button
            onClick={() => onToggleStatus?.()}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
              job.status === 'Open'
                ? 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400'
                : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}
          >
            {job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
          </button>
          <button
            onClick={() => onDelete?.()}
            className="flex items-center gap-1.5 rounded-xl border border-red-700 bg-red-700 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-800 dark:bg-red-800 dark:border-red-800 dark:hover:bg-red-900"
          >
            <X size={14} /> Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main page ---
const Jobs = () => {
  const [jobs,          setJobs]          = useState(jobData);
  const [selected,      setSelected]      = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmClose,  setConfirmClose]  = useState(false);
  const [confirmReopen, setConfirmReopen] = useState(false);
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [sortBy,        setSortBy]        = useState('default');

  const handleToggleStatus = () => {
    if (selected?.status === 'Open') {
      setConfirmClose(true);
    } else {
      setConfirmReopen(true);
    }
  };

  const handleConfirmClose = () => {
    setJobs(prev => prev.map(j => j.id === selected.id ? { ...j, status: 'Closed' } : j));
    setSelected(prev => prev ? { ...prev, status: 'Closed' } : prev);
    setConfirmClose(false);
  };

  const handleConfirmReopen = () => {
    setJobs(prev => prev.map(j => j.id === selected.id ? { ...j, status: 'Open' } : j));
    setSelected(prev => prev ? { ...prev, status: 'Open' } : prev);
    setConfirmReopen(false);
  };

  const handleDelete = () => {
    setJobs(prev => prev.filter(j => j.id !== selected.id));
    setSelected(null);
    setConfirmDelete(false);
  };

  return (
    <div className="mx-auto max-w-6xl py-2 sm:py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Job Listings</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Browse and manage job postings</p>
        </div>
        <div className="flex w-full items-center sm:w-auto">
          <Link to="/post-job" className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto">
            + Post a Job
          </Link>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3 px-1 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Status filter pills - full width on mobile */}
        <div className="flex w-full gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-[#1d2b4f] dark:bg-[#0a1739] sm:w-auto">
          {['All', 'Open', 'Closed'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`flex-1 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all sm:flex-none ${
                statusFilter === f
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1a2f6b] dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}>
              {f}
              <span className="ml-1.5 text-xs opacity-60">
                {f === 'All' ? jobs.length : jobs.filter(j => j.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-slate-500 dark:text-gray-400">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 sm:flex-none"
          >
            <option value="default">Default</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="applicants-desc">Most Applicants</option>
            <option value="applicants-asc">Fewest Applicants</option>
          </select>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4">
        {/* List */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          {(() => {
            const filtered = jobs
              .filter(j => statusFilter === 'All' || j.status === statusFilter)
              .sort((a, b) => {
                switch (sortBy) {
                  case 'newest':           return a.daysAgo - b.daysAgo;
                  case 'oldest':           return b.daysAgo - a.daysAgo;
                  case 'title-asc':        return a.title.localeCompare(b.title);
                  case 'title-desc':       return b.title.localeCompare(a.title);
                  case 'applicants-desc':  return b.applicants - a.applicants;
                  case 'applicants-asc':   return a.applicants - b.applicants;
                  default:                 return 0;
                }
              });
            return filtered.length > 0
              ? filtered.map(job => <JobCard key={job.id} job={job} isSelected={selected?.id === job.id} onSelect={setSelected} />)
              : <div className="rounded-2xl border border-slate-200 bg-[#fcfdff] p-6 text-center text-sm text-slate-500 dark:border-[#22325a] dark:bg-[#05070d] dark:text-gray-400">No jobs found.</div>;
          })()}
        </div>

        {/* Detail - sticky on desktop */}
        <div className="hidden lg:block flex-1 min-w-0">
          <div className="sticky top-4">
            <JobDetail job={selected} onClose={() => setSelected(null)} onDelete={() => setConfirmDelete(true)} onToggleStatus={handleToggleStatus} />
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white p-4 dark:bg-[#05070d] lg:hidden">
          <JobDetail job={selected} onClose={() => setSelected(null)} onDelete={() => setConfirmDelete(true)} onToggleStatus={handleToggleStatus} />
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-[#1d2b4f] dark:bg-[#05070d]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Job Posting?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-white">{selected?.title}</span>? This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close job confirmation */}
      {confirmClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-[#1d2b4f] dark:bg-[#05070d]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Close Job Posting?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              Closing <span className="font-semibold text-slate-700 dark:text-white">{selected?.title}</span> will stop accepting new applications. You can reopen it later.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleConfirmClose} className="flex-1 rounded-xl border border-red-300 bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400">
                Close Job
              </button>
              <button onClick={() => setConfirmClose(false)} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reopen job confirmation */}
      {confirmReopen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-[#1d2b4f] dark:bg-[#05070d]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reopen Job Posting?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              Reopening <span className="font-semibold text-slate-700 dark:text-white">{selected?.title}</span> will allow candidates to apply again.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleConfirmReopen} className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">
                Reopen Job
              </button>
              <button onClick={() => setConfirmReopen(false)} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

