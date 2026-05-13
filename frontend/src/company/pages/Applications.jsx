import { useState } from 'react';
import { ArrowUpDown, Clock, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const applicationData = [
  { id: 1,  jobTitle: "Senior Software Engineer", company: "Demo Company", status: "Pending",  date: "Jan 16, 2026", coverLetter: "I am very interested in this position and believe my 7 years of experience in full-stack development makes me a strong fit for your team. Throughout my career, I have designed and shipped production-grade applications using React, Node.js, and cloud infrastructure on AWS. I thrive in collaborative environments and have a proven track record of mentoring junior developers, leading code reviews, and delivering features on tight deadlines. I am particularly drawn to Demo Company's commitment to engineering excellence and would be excited to contribute to your platform's next phase of growth.", message: "Looking forward to hearing from you and discussing how my background aligns with your team's goals!" },
  { id: 2,  jobTitle: "Product Designer",          company: "Demo Company", status: "Opened",   date: "Jan 17, 2026", coverLetter: "As a passionate product designer with a strong portfolio in creating user-centric digital experiences, I would love to bring my skills to Demo Company. Over the past 5 years I have led end-to-end design processes — from user research and wireframing to high-fidelity prototypes and design system maintenance — across both mobile and web platforms. I believe great design is rooted in empathy and data, and I consistently collaborate with engineers and product managers to ensure that what ships is both beautiful and functional. Your focus on intuitive, accessible products resonates deeply with my design philosophy.", message: "I am available for interviews any time next week and happy to walk through my portfolio in detail." },
  { id: 3,  jobTitle: "Marketing Manager",         company: "Demo Company", status: "Selected", date: "Jan 20, 2026", coverLetter: "With over 8 years of experience in digital marketing and brand strategy, I am confident I can make a meaningful impact at Demo Company. I have successfully managed multi-channel campaigns across SEO, paid media, email, and social platforms, consistently delivering measurable growth in lead generation and brand awareness. In my previous role I grew organic traffic by 140% in under a year and led a team of six marketers through a full brand refresh. I am drawn to Demo Company's data-driven culture and believe my analytical approach to creative strategy would be a great match for your marketing goals.", message: "Excited about this opportunity and happy to share campaign case studies during the interview." },
  { id: 4,  jobTitle: "DevOps Engineer",            company: "Demo Company", status: "Rejected", date: "Jan 22, 2026", coverLetter: "I am applying for the DevOps Engineer role with 5 years of hands-on experience in cloud infrastructure, CI/CD pipelines, and site reliability engineering. I have architected and maintained Kubernetes clusters on AWS and GCP, reduced deployment times by 60% through automated pipelines, and implemented monitoring solutions using Prometheus and Grafana. I am passionate about building resilient, scalable systems and fostering a DevOps culture that bridges the gap between development and operations teams. Demo Company's engineering-first approach is exactly the kind of environment where I do my best work.", message: "Thank you for considering my application. I look forward to the possibility of contributing to your infrastructure team." },
  { id: 5,  jobTitle: "Data Scientist",             company: "Demo Company", status: "Pending",  date: "Jan 25, 2026", coverLetter: "I am excited to apply for the Data Scientist position at Demo Company. I hold an M.Sc. in Data Science and have 4 years of industry experience building machine learning models that drive real business decisions. My work spans predictive analytics, NLP, and recommendation systems, with production deployments using Python, TensorFlow, and Spark. I have collaborated closely with product and engineering teams to translate complex model outputs into actionable insights and intuitive dashboards. I am particularly interested in Demo Company's use of data to personalize user experiences and would love to contribute to that mission.", message: "I would welcome the chance to discuss how my modeling experience can support your data initiatives." },
  { id: 6,  jobTitle: "Frontend Developer",         company: "Demo Company", status: "Opened",   date: "Feb 2, 2026",  coverLetter: "I have been building responsive, accessible web interfaces for 3 years using Vue.js and React, and I am eager to bring that experience to Demo Company. I take pride in writing clean, maintainable component code and have a strong eye for pixel-perfect implementation of design specs. I have worked closely with designers using Figma handoffs and contributed to shared component libraries that improved team velocity significantly. I am excited by Demo Company's focus on user experience and would love to help craft interfaces that delight your users.", message: "Happy to share my GitHub portfolio and discuss any of my past projects in detail." },
  { id: 7,  jobTitle: "Backend Engineer",           company: "Demo Company", status: "Pending",  date: "Feb 5, 2026",  coverLetter: "With 5 years of backend engineering experience, I specialize in building high-performance REST APIs and microservices using Java and Spring Boot. I have designed systems that handle millions of requests per day, optimized PostgreSQL query performance, and implemented Redis caching strategies that cut response times by half. I am comfortable owning services end-to-end — from schema design to deployment — and I enjoy collaborating with frontend teams to deliver cohesive product features. Demo Company's engineering culture and scale are exactly what I am looking for in my next role.", message: "I look forward to the opportunity to discuss how I can contribute to your backend infrastructure." },
  { id: 8,  jobTitle: "HR Specialist",              company: "Demo Company", status: "Rejected", date: "Feb 8, 2026",  coverLetter: "I bring 4 years of HR experience spanning full-cycle recruitment, onboarding program design, and HRIS administration. I have managed hiring pipelines for technical and non-technical roles simultaneously, reduced time-to-hire by 25% through process improvements, and built onboarding experiences that improved 90-day retention rates. I am passionate about creating inclusive workplaces and have led initiatives around diversity hiring and employee engagement surveys. I believe Demo Company's people-first values align closely with my own approach to HR.", message: "Thank you for your time and consideration. I hope to connect further about this opportunity." },
  { id: 9,  jobTitle: "Senior Software Engineer",   company: "Demo Company", status: "Opened",   date: "Feb 10, 2026", coverLetter: "I am a senior engineer with 8 years of experience across fintech and SaaS products, with deep expertise in distributed systems and API design. I have led teams of up to 6 engineers, introduced engineering best practices including TDD and trunk-based development, and driven architectural decisions that improved system reliability to 99.9% uptime. I am drawn to Demo Company's technical challenges and believe my background in scaling backend systems would be a strong asset to your engineering team.", message: "I am available for a technical interview at your earliest convenience and excited to learn more about the role." },
  { id: 10, jobTitle: "Data Scientist",             company: "Demo Company", status: "Selected", date: "Feb 12, 2026", coverLetter: "I am a data scientist with a strong foundation in statistical modeling and a passion for translating data into business value. Over the past 5 years I have built recommendation engines, churn prediction models, and A/B testing frameworks that directly influenced product decisions. I am proficient in Python, SQL, and cloud-based ML platforms, and I have experience presenting findings to both technical and non-technical stakeholders. I am particularly excited about Demo Company's data-driven product philosophy and would love to contribute to your analytics capabilities.", message: "Looking forward to discussing how my experience aligns with your data science roadmap." },
  { id: 11, jobTitle: "Product Designer",           company: "Demo Company", status: "Pending",  date: "Feb 14, 2026", coverLetter: "Design is not just my profession — it is how I think. With 6 years of product design experience across mobile and web, I have developed a deep understanding of how to balance user needs with business goals. I have led design sprints, built and maintained design systems used by teams of 20+, and conducted usability studies that directly shaped product direction. I admire Demo Company's commitment to thoughtful, user-centered design and would be thrilled to contribute to your product team.", message: "I would love to walk you through my case studies and discuss how I approach complex design challenges." },
  { id: 12, jobTitle: "DevOps Engineer",            company: "Demo Company", status: "Selected", date: "Feb 17, 2026", coverLetter: "I am a DevOps engineer with 6 years of experience building and maintaining cloud-native infrastructure on AWS and Azure. I have implemented GitOps workflows, managed multi-region Kubernetes deployments, and built observability stacks using Datadog and PagerDuty. I am passionate about reliability engineering and have driven SRE practices that reduced incident response times by 40%. Demo Company's infrastructure scale and engineering culture are a great match for the kind of work I do best.", message: "Excited about this role and happy to discuss my infrastructure experience in more detail." },
  { id: 13, jobTitle: "Marketing Manager",          company: "Demo Company", status: "Opened",   date: "Feb 19, 2026", coverLetter: "I am a marketing professional with 6 years of experience in B2B SaaS, specializing in demand generation and content marketing. I have built marketing programs from the ground up, managed budgets exceeding $500K, and consistently exceeded pipeline targets through data-driven campaign optimization. I have experience leading cross-functional teams and working closely with sales to align messaging and improve conversion rates. Demo Company's growth trajectory and market position make this an exciting opportunity I would love to be part of.", message: "I am happy to share campaign performance data and discuss my approach to growth marketing." },
];

const statusStyles = {
  Pending:  'bg-amber-100 text-amber-700 border-amber-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/50',
  Opened:   'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/50',
  Selected: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50',
  Rejected: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50',
};

// --- Compact row card ---
const AppCard = ({ app, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(app)}
    className={`mb-2 cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
      isSelected
        ? 'border-blue-400 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-500/10'
        : 'border-slate-200 bg-[#fcfdff] hover:border-slate-300 dark:border-[#22325a] dark:bg-[#05070d] dark:hover:border-[#3456a5]'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        {app.jobTitle.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{app.jobTitle}</p>
        <p className="truncate text-xs text-slate-500 dark:text-gray-400">{app.company}</p>
      </div>
      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyles[app.status]}`}>
        {app.status}
      </span>
    </div>
    <div className="mt-2 flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
      <Clock size={11} /> {app.date}
    </div>
  </div>
);

// --- Detail panel ---
const AppDetail = ({ app, onClose }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  if (!app) return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#fcfdff] p-8 text-center dark:border-[#22325a] dark:bg-[#05070d]">
      <p className="text-sm text-slate-400 dark:text-gray-500">Select an application to view details</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fcfdff] shadow-sm dark:border-[#22325a] dark:bg-[#05070d]">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-[#22325a]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {app.jobTitle.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{app.jobTitle}</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{app.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[app.status]}`}>
            {app.status}
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
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
          <Clock size={14} className="text-blue-400" /> Applied on {app.date}
        </div>

        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Cover Letter</h4>
          <p className={`text-sm leading-relaxed text-slate-700 dark:text-gray-300 ${!expanded ? 'line-clamp-2 lg:line-clamp-[unset]' : ''}`}>
            {app.coverLetter}
          </p>
          <button onClick={() => setExpanded(v => !v)} className="mt-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 lg:hidden">
            {expanded ? 'Show less' : 'More...'}
          </button>
        </div>

        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Additional Message</h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-gray-300">{app.message}</p>
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-[#22325a]">
          <button
            onClick={() => navigate(`/candidates?job=${encodeURIComponent(app.jobTitle)}`)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 dark:hover:bg-[#142448]"
          >
            <ExternalLink size={14} /> View Candidates
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main page ---
const Applications = () => {
  const [sortBy,    setSortBy]    = useState('date-desc');
  const [selected,  setSelected]  = useState(null);

  const sorted = [...applicationData].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':  return new Date(b.date) - new Date(a.date);
      case 'date-asc':   return new Date(a.date) - new Date(b.date);
      case 'title-asc':  return a.jobTitle.localeCompare(b.jobTitle);
      case 'title-desc': return b.jobTitle.localeCompare(a.jobTitle);
      default:           return 0;
    }
  });

  return (
    <div className="mx-auto max-w-6xl py-2 sm:py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Job Applications</h1>
          <p className="text-lg text-slate-600 dark:text-gray-400">Manage and track candidate applications</p>
        </div>

      </div>

      {/* Sort */}
      <div className="mb-4 flex items-center gap-2">
        <ArrowUpDown size={15} className="text-slate-400" />
        <span className="text-sm text-slate-500 dark:text-gray-400">Sort by:</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4">
        {/* List */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          {sorted.map(app => (
            <AppCard key={app.id} app={app} isSelected={selected?.id === app.id} onSelect={setSelected} />
          ))}
        </div>

        {/* Detail — sticky on desktop */}
        <div className="hidden lg:block flex-1 min-w-0">
          <div className="sticky top-4">
            <AppDetail app={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white p-4 dark:bg-[#05070d] lg:hidden">
          <AppDetail app={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
};

export default Applications;
