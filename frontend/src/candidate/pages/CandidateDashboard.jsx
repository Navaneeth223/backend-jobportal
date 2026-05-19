import React from 'react';
import { Briefcase, Calendar, Bookmark, Eye, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCandidate } from '../context/CandidateContext';
import { getCandidateProfile, getSavedJobs } from '../../api/candidateApi';
import { mockJobs } from '../data/mockJobs';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import ProfileCompletionRing from '../components/ProfileCompletionRing';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';

const CandidateDashboard = () => {
  const { applications, toggleSaveJob, applyToJob } = useCandidate();
  const [candidateProfile, setCandidateProfile] = React.useState(null);
  const [savedJobs, setSavedJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, savedJobsData] = await Promise.all([
          getCandidateProfile(),
          getSavedJobs()
        ]);
        setCandidateProfile({
          ...profileData,
          name: profileData.full_name || '',
          experienceYears: profileData.experience_years,
          cvUrl: profileData.resume || '',
          avatar: profileData.profile_image || '',
          experience: (profileData.experience || []).map(exp => ({
            ...exp,
            title: exp.job_title || exp.title,
            company: exp.company_name || exp.company,
            from: exp.start_date,
            to: exp.present ? 'Present' : exp.end_date,
          })),
          skills: profileData.skills_legacy || profileData.skill_set?.map(s => s.skill_name) || [],
          bio: profileData.professional_summary || '',
          completionPercentage: profileData.full_name ? (profileData.resume ? 100 : 70) : 0,
        });
        setSavedJobs(savedJobsData || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!candidateProfile) {
    return <div>Profile not found. Please complete onboarding.</div>;
  }

  const stats = [
    { label: 'Jobs Applied', value: applications.length, icon: Briefcase, iconBg: 'bg-blue-500', trend: '+3 this week' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview_scheduled').length, icon: Calendar, iconBg: 'bg-purple-500', trend: '+1 soon' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: Bookmark, iconBg: 'bg-yellow-500', trend: '0 new' },
    { label: 'Profile Views', value: 47, icon: Eye, iconBg: 'bg-green-500', trend: '+12% vs last month' }
  ];

  const recommendedJobs = mockJobs.filter(j => j.matchPercentage > 85).slice(0, 4);
  const recentActivities = [...applications].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5);

  const checklistItems = [
    { label: 'Basic Info added', complete: !!candidateProfile.name },
    { label: 'Skills added', complete: candidateProfile.skills.length > 0 },
    { label: 'Upload your CV', complete: !!candidateProfile.cvUrl },
    { label: 'Add work experience', complete: candidateProfile.experience.length > 0 },
    { label: 'Write a professional summary', complete: !!candidateProfile.bio }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {candidateProfile.name} 👋</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Here's what's happening with your job search today.</p>
        </div>
        
        <div className="flex items-center gap-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/20 dark:bg-blue-900/10">
          <ProfileCompletionRing percentage={candidateProfile.completionPercentage} size={70} />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Your profile is {candidateProfile.completionPercentage}% complete</p>
            <Link
              to={candidateProfile.completionPercentage >= 100 ? '/candidate/profile' : '/candidate/onboarding'}
              className="group mt-1 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400"
            >
              {candidateProfile.completionPercentage >= 100 ? 'View profile' : 'Complete now'} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
            <Link to="/candidate/jobs?filter=recommended" className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
              View all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="w-[300px] shrink-0 sm:w-[350px]">
                <JobCard 
                  job={job} 
                  isSaved={savedJobs.includes(job.id)}
                  onSave={toggleSaveJob}
                  onApply={applyToJob}
                />
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-panel">
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="relative flex items-start gap-4">
                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-50 dark:border-panel dark:bg-bg">
                       <Briefcase size={16} className="text-blue-600" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          You applied to <span className="font-bold">{activity.jobTitle}</span> at <span className="font-bold">{activity.company}</span>
                        </p>
                        <p className="text-xs text-slate-500">{activity.appliedDate}</p>
                      </div>
                      <ApplicationStatusBadge status={activity.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Checklist */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Strengthen Your Profile</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-panel">
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.complete ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                      <AlertCircle size={18} className="text-yellow-500" />
                    )}
                    <span className={`text-sm ${item.complete ? 'text-slate-500' : 'font-medium text-slate-900 dark:text-white'}`}>
                      {item.label}
                    </span>
                  </div>
                  {!item.complete && (
                    <Link to="/candidate/onboarding" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">
                      Add now
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
               <p className="text-sm font-bold">Pro Tip 💡</p>
               <p className="mt-1 text-xs opacity-90">Adding a professional summary increases your chances of getting noticed by 40%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
