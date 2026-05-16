import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, ExternalLink, Trash2, Search } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import { getMyApplications, withdrawApplication } from '../api/candidateApi';

const MyApplications = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { ensureConversationForApplication } = useCandidate();
  const activeTab = searchParams.get('tab') || 'applied';

  const [apiApplications, setApiApplications] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        const results = data.results || data;
        
        const mappedApps = (Array.isArray(results) ? results : []).map(app => {
          let frontendStatus = 'applied';
          if (app.recruiter_status === 'interview') frontendStatus = 'interview_scheduled';
          else if (app.recruiter_status === 'selected') frontendStatus = 'selected';
          else if (app.recruiter_status === 'rejected') frontendStatus = 'rejected';
          else if (app.recruiter_status === 'reviewing') frontendStatus = 'applied';

          return {
            id: app.id,
            jobId: app.job,
            jobTitle: app.job_title,
            company: app.company_name,
            companyLogo: app.company_logo,
            appliedDate: new Date(app.applied_at).toISOString().split('T')[0],
            status: frontendStatus,
            interviewDate: app.interview_date,
            interviewType: app.interview_type
          };
        });
        setApiApplications(mappedApps);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    try {
      await withdrawApplication(appId);
      setApiApplications(prev => prev.filter(app => app.id !== appId));
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'applied', label: 'Applied', count: apiApplications.filter(a => a.status === 'applied').length },
    { id: 'shortlisted', label: 'Shortlisted', count: apiApplications.filter(a => a.status === 'shortlisted').length },
    { id: 'selected', label: 'Selected', count: apiApplications.filter(a => a.status === 'selected').length },
    { id: 'interview', label: 'Interview Scheduled', count: apiApplications.filter(a => a.status === 'interview_scheduled').length },
    { id: 'rejected', label: 'Rejected', count: apiApplications.filter(a => a.status === 'rejected').length },
  ];

  const filteredApplications = apiApplications.filter(app => {
    if (activeTab === 'interview') return app.status === 'interview_scheduled';
    return app.status === activeTab;
  });

  const handleOpenMessages = (application) => {
    const conversationId = ensureConversationForApplication(application);
    navigate(conversationId ? `/candidate/messages?chatId=${conversationId}` : '/candidate/messages');
  };

  const handleViewJob = (jobId) => {
    navigate(`/candidate/jobs?jobId=${jobId}`);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Track Your Applications</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep track of your journey with different companies.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-px dark:border-slate-800 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="flex-1 space-y-4">
        {filteredApplications.length > 0 ? (
          <div className="grid gap-4">
            {filteredApplications.map((app) => (
              <div 
                key={app.id}
                className="group flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-panel sm:flex-row sm:items-center"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                  {app.companyLogo}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{app.jobTitle}</h3>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <p className="font-medium text-slate-600 dark:text-slate-400">{app.company}</p>
                  <p className="text-xs text-slate-400">Applied on {app.appliedDate}</p>
                </div>

                {activeTab === 'interview' && app.interviewDate && (
                  <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/10 sm:min-w-[200px]">
                    <div className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-400">
                      <Calendar size={16} />
                      Next Step: Interview
                    </div>
                    <p className="mt-1 text-xs text-purple-600/80 dark:text-purple-400/80">
                      {new Date(app.interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <div className="mt-2 inline-flex rounded-lg bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/40">
                      {app.interviewType} Round
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 sm:border-none sm:pt-0">
                  {activeTab === 'applied' && (
                     <button 
                        onClick={() => handleWithdraw(app.id)}
                        className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 dark:bg-red-900/10"
                     >
                        <Trash2 size={16} /> Withdraw
                     </button>
                  )}
                  {['shortlisted', 'selected', 'interview'].includes(activeTab) && (
                    <button
                      type="button"
                      onClick={() => handleOpenMessages(app)}
                      className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100 dark:bg-blue-900/10"
                    >
                       <MessageSquare size={16} /> Message
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleViewJob(app.jobId)}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                  >
                     <ExternalLink size={16} /> View Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-slate-100 p-8 dark:bg-slate-800">
              <Search size={64} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No {activeTab} applications yet</h3>
            <p className="mt-2 text-slate-500">Explore new opportunities and start your journey today.</p>
            <Link 
              to="/candidate/jobs"
              className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
