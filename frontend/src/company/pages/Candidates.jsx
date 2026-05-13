import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import StatusFilters from '../components/StatusFilters';
import CandidateCard from '../components/CandidateCard';
import CandidateDetail from '../components/CandidateDetail';

const candidatesData = [
  { id: 1,  name: 'Alex Johnson',     role: 'Senior Software Engineer', location: 'San Francisco, CA', experience: '6 years exp.', education: 'B.Sc. Computer Science',      status: 'New',          skills: ['React', 'Node.js', 'TypeScript', 'AWS'],              summary: 'Full-stack engineer with 6 years of experience building scalable web applications. Passionate about clean code and developer experience.' },
  { id: 2,  name: 'Priya Sharma',     role: 'Product Designer',         location: 'Remote',            experience: '4 years exp.', education: 'B.Des. Interaction Design',  status: 'Interviewing', skills: ['Figma', 'UX Research', 'Prototyping', 'CSS'],          summary: 'Creative designer focused on crafting intuitive user experiences. Strong background in user research and design systems.' },
  { id: 3,  name: 'Marcus Lee',       role: 'Marketing Manager',        location: 'New York, NY',      experience: '7 years exp.', education: 'MBA Marketing',               status: 'Reviewed',     skills: ['SEO', 'Content Strategy', 'Google Ads', 'Analytics'],  summary: 'Results-driven marketing manager with a track record of growing brand presence and driving lead generation across digital channels.' },
  { id: 4,  name: 'Sara Williams',    role: 'Data Scientist',           location: 'Austin, TX',        experience: '3 years exp.', education: 'M.Sc. Data Science',          status: 'New',          skills: ['Python', 'TensorFlow', 'SQL', 'Tableau'],             summary: 'Data scientist specializing in machine learning models and business intelligence. Experienced in turning raw data into actionable insights.' },
  { id: 5,  name: 'James Carter',     role: 'DevOps Engineer',          location: 'Seattle, WA',       experience: '5 years exp.', education: 'B.Sc. Information Systems',   status: 'Selected',     skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],         summary: 'DevOps engineer with deep expertise in cloud infrastructure, automation pipelines, and site reliability engineering.' },
  { id: 6,  name: 'Lena Muller',      role: 'Frontend Developer',       location: 'Remote',            experience: '2 years exp.', education: 'B.Sc. Software Engineering',  status: 'Contacting',   skills: ['Vue.js', 'Tailwind CSS', 'JavaScript', 'Git'],        summary: 'Frontend developer with a keen eye for detail and a passion for building pixel-perfect, accessible web interfaces.' },
  { id: 7,  name: 'Omar Hassan',      role: 'Backend Engineer',         location: 'Chicago, IL',       experience: '5 years exp.', education: 'B.Sc. Computer Engineering',  status: 'Shortlisted',  skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis'],         summary: 'Backend engineer experienced in designing robust REST APIs and microservices architectures for high-traffic applications.' },
  { id: 8,  name: 'Nina Patel',       role: 'HR Specialist',            location: 'Boston, MA',        experience: '4 years exp.', education: 'B.A. Human Resources',        status: 'Rejected',     skills: ['Recruitment', 'Onboarding', 'HRIS', 'Compliance'],    summary: 'HR specialist with experience managing end-to-end recruitment cycles and building positive workplace cultures.' },
  { id: 9,  name: 'Ryan Torres',      role: 'Senior Software Engineer', location: 'Austin, TX',        experience: '8 years exp.', education: 'M.Sc. Computer Science',      status: 'Interviewing', skills: ['Go', 'Kubernetes', 'React', 'PostgreSQL'],            summary: 'Senior engineer with 8 years building distributed systems and leading cross-functional engineering teams at scale.' },
  { id: 10, name: 'Aisha Okonkwo',    role: 'Senior Software Engineer', location: 'Remote',            experience: '7 years exp.', education: 'B.Sc. Software Engineering',  status: 'Reviewed',     skills: ['Python', 'Django', 'AWS', 'Docker'],                  summary: 'Backend-focused engineer passionate about API design, performance optimization, and developer tooling.' },
  { id: 11, name: 'Daniel Park',      role: 'Product Designer',         location: 'San Francisco, CA', experience: '5 years exp.', education: 'B.F.A. Graphic Design',      status: 'Shortlisted',  skills: ['Figma', 'Motion Design', 'Design Systems', 'HTML'],   summary: 'Product designer with a strong visual background and deep experience building and scaling design systems for SaaS products.' },
  { id: 12, name: 'Sofia Reyes',      role: 'Marketing Manager',        location: 'Remote',            experience: '6 years exp.', education: 'B.A. Communications',         status: 'Contacting',   skills: ['HubSpot', 'Email Marketing', 'SEO', 'Copywriting'],   summary: 'Marketing manager specializing in inbound marketing, content strategy, and B2B demand generation for tech companies.' },
  { id: 13, name: 'Ethan Brooks',     role: 'DevOps Engineer',          location: 'Denver, CO',        experience: '4 years exp.', education: 'B.Sc. Information Technology', status: 'New',          skills: ['AWS', 'Terraform', 'GitHub Actions', 'Linux'],        summary: 'DevOps engineer focused on cloud-native infrastructure, GitOps workflows, and reducing deployment friction for dev teams.' },
  { id: 14, name: 'Mei Lin',          role: 'Data Scientist',           location: 'Seattle, WA',       experience: '4 years exp.', education: 'M.Sc. Statistics',            status: 'Interviewing', skills: ['R', 'Python', 'Spark', 'Power BI'],                   summary: 'Data scientist with expertise in statistical modeling, A/B testing, and building data pipelines for product analytics.' },
  { id: 15, name: 'Carlos Mendez',    role: 'Frontend Developer',       location: 'Miami, FL',         experience: '3 years exp.', education: 'B.Sc. Computer Science',      status: 'Reviewed',     skills: ['React', 'TypeScript', 'CSS', 'Storybook'],            summary: 'Frontend developer who loves building component libraries and accessible, performant UIs with modern React patterns.' },
  { id: 16, name: 'Fatima Al-Rashid', role: 'Backend Engineer',         location: 'Remote',            experience: '6 years exp.', education: 'B.Sc. Computer Engineering',  status: 'New',          skills: ['Node.js', 'GraphQL', 'MongoDB', 'AWS Lambda'],        summary: 'Backend engineer experienced in serverless architectures, GraphQL APIs, and building event-driven microservices.' },
  { id: 17, name: 'Tom Nguyen',       role: 'HR Specialist',            location: 'Chicago, IL',       experience: '3 years exp.', education: 'B.A. Psychology',             status: 'Contacting',   skills: ['Talent Acquisition', 'ATS', 'Interviewing', 'DEI'],   summary: 'HR specialist passionate about inclusive hiring practices and building structured interview processes that reduce bias.' },
  { id: 18, name: 'Grace Kim',        role: 'Senior Software Engineer', location: 'New York, NY',      experience: '9 years exp.', education: 'B.Sc. Computer Science',      status: 'Shortlisted',  skills: ['Java', 'Microservices', 'Kafka', 'GCP'],              summary: 'Senior engineer with extensive experience in high-throughput event-driven systems and platform engineering.' },
  { id: 19, name: 'Lucas Ferreira',   role: 'Product Designer',         location: 'Remote',            experience: '3 years exp.', education: 'B.Des. UX Design',           status: 'New',          skills: ['Figma', 'User Testing', 'Wireframing', 'Accessibility'], summary: 'UX-focused designer who champions accessibility and user research to inform every design decision.' },
  { id: 20, name: 'Hannah Schmidt',   role: 'Marketing Manager',        location: 'Boston, MA',        experience: '5 years exp.', education: 'M.A. Marketing',              status: 'Selected',     skills: ['Paid Media', 'Analytics', 'Brand Strategy', 'Notion'], summary: 'Data-driven marketing manager with a strong background in paid acquisition, brand positioning, and growth experimentation.' },
];

const STATUSES = ['New', 'Reviewed', 'Contacting', 'Interviewing', 'Shortlisted', 'Selected', 'Rejected'];
const ROLES       = ['All Roles', 'Engineering', 'Design', 'Marketing', 'Data Science', 'DevOps', 'HR'];
const EXPERIENCES = ['All Experience', '0-2 years', '3-5 years', '6+ years'];

const roleMatch = (candidate, role) => {
  if (role === 'All Roles') return true;
  const map = {
    Engineering:    ['engineer', 'developer'],
    Design:         ['designer'],
    Marketing:      ['marketing'],
    'Data Science': ['data'],
    DevOps:         ['devops'],
    HR:             ['hr', 'human resources'],
  };
  return (map[role] || []).some((k) => candidate.role.toLowerCase().includes(k));
};

const expMatch = (exp, filter) => {
  const years = parseInt(exp);
  if (filter === '0-2 years') return years <= 2;
  if (filter === '3-5 years') return years >= 3 && years <= 5;
  if (filter === '6+ years')  return years >= 6;
  return true;
};

const selectClass =
  'rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300';

const Candidates = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search,       setSearch]       = useState('');
  const [role,         setRole]         = useState('All Roles');
  const [experience,   setExperience]   = useState('All Experience');
  const [searchParams, setSearchParams] = useSearchParams();
  const [statuses,     setStatuses]     = useState(
    () => Object.fromEntries(candidatesData.map((c) => [c.id, c.status]))
  );
  const [selected,     setSelected]     = useState(null);

  // Auto-select first candidate on load
  const handleSelect = (c) => setSelected(c);

  const handleStatusChange = (id, newStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    // keep detail panel in sync
    setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
  };

  const withStatus = (list) => list.map((c) => ({ ...c, status: statuses[c.id] }));

  const jobFilter = searchParams.get('job');
  const clearJobFilter = () => setSearchParams({});

  const jobFilteredData = withStatus(
    jobFilter
      ? candidatesData.filter((c) => c.role.toLowerCase().includes(jobFilter.toLowerCase()))
      : candidatesData
  );

  const filters = [
    { label: 'All', count: jobFilteredData.length },
    ...STATUSES.map((s) => ({
      label: s,
      count: jobFilteredData.filter((c) => c.status === s).length,
    })),
  ];

  const filtered = jobFilteredData.filter((c) => {
    const matchStatus = activeFilter === 'All' || c.status === activeFilter;
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleMatch(c, role);
    const matchExp  = expMatch(c.experience, experience);
    return matchStatus && matchSearch && matchRole && matchExp;
  });

  return (
    <div className="mx-auto max-w-6xl py-2 sm:py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Candidates</h1>
        <p className="text-lg text-slate-600 dark:text-gray-400">Browse and manage applicant profiles</p>
      </div>

      {/* Active job filter banner */}
      {jobFilter && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
          <span>Showing candidates for: <span className="font-semibold">{jobFilter}</span></span>
          <button onClick={clearJobFilter} className="ml-auto flex items-center gap-1 rounded-lg px-2 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-500/20">
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* Status pill filters */}
      <StatusFilters filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Search + dropdowns */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>
        <select value={role}       onChange={(e) => setRole(e.target.value)}       className={selectClass}>
          {ROLES.map((r)       => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={experience} onChange={(e) => setExperience(e.target.value)} className={selectClass}>
          {EXPERIENCES.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-gray-500">
        {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
      </p>

      <div className="mt-4 flex gap-4">
        {/* Compact list - always visible */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          {filtered.length > 0
            ? filtered.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  onStatusChange={handleStatusChange}
                  onSelect={handleSelect}
                  isSelected={selected?.id === c.id}
                />
              ))
            : (
              <div className="rounded-2xl border border-slate-200 bg-[#fcfdff] p-6 text-slate-600 shadow-sm dark:border-[#22325a] dark:bg-[#05070d] dark:text-gray-400">
                No candidates match your filters.
              </div>
            )
          }
        </div>

        {/* Detail panel - sticky, always shown on desktop */}
        <div className="hidden lg:block flex-1 min-w-0">
          <div className="sticky top-4">
            <CandidateDetail
              candidate={selected}
              onClose={() => setSelected(null)}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile detail - full screen overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white p-4 dark:bg-[#05070d] lg:hidden">
          <CandidateDetail
            candidate={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
};

export default Candidates;

