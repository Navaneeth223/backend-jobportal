import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';
import { useJobFilters } from '../hooks/useJobFilters';
import { getJobs, getSavedJobs, saveJob, removeSavedJob, applyToJob as apiApplyToJob, getMyApplications } from '../api/candidateApi';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';

const BrowseJobs = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filterType = searchParams.get('filter');
  const requestedJobId = searchParams.get('jobId');

  const [apiJobs, setApiJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [apiApplications, setApiApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { filters, updateFilters, clearFilters } = useJobFilters([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const queryParams = {};
        if (filters.search) queryParams.keyword = filters.search;
        if (filters.jobTypes && filters.jobTypes.length) queryParams.job_type = filters.jobTypes.join(',');
        if (filters.location && filters.location.length) queryParams.location = filters.location.join(',');
        // For category, you can add similar logic
        
        const data = await getJobs(queryParams);
        const results = data.results || data;
        const jobsArray = Array.isArray(results) ? results : [];
        
        // Map DRF fields to frontend fields
        const mappedJobs = jobsArray.map(j => ({
          ...j,
          company: j.company_name, // Map to company for useJobFilters
          companyName: j.company_name,
          companyLogo: j.company_logo,
          salaryMin: j.salary_min,
          salaryMax: j.salary_max,
          jobType: j.job_type,
          workMode: j.work_mode,
          postedAt: j.posted_at,
          experienceRequired: '1-3 yrs' // Fallback for local filtering if needed
        }));
        setApiJobs(mappedJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    const fetchSavedAndApps = async () => {
      try {
        const [savedData, appsData] = await Promise.all([
          getSavedJobs(),
          getMyApplications()
        ]);
        setSavedJobIds(savedData.map(item => item.job));
        
        const apps = appsData.results || appsData;
        setApiApplications(Array.isArray(apps) ? apps.map(app => app.job) : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavedAndApps();
  }, []);

  const hasApplied = (jobId) => apiApplications.includes(jobId);

  const handleApply = async (jobId) => {
    try {
      await apiApplyToJob(jobId);
      setApiApplications(prev => [...prev, jobId]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSaveJob = async (jobId) => {
    try {
      if (savedJobIds.includes(jobId)) {
        await removeSavedJob(jobId);
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        await saveJob(jobId);
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Local filtering is done by useJobFilters, but we'll manually apply it here so we can use apiJobs directly
  const filteredJobs = apiJobs; 

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.postedAt || b.posted_at) - new Date(a.postedAt || a.posted_at);
    if (sortBy === 'Salary: High to Low') return b.salaryMax - a.salaryMax;
    return 0; // Relevance or default
  });

  const prioritizedJobs = useMemo(() => {
    if (!requestedJobId || !sortedJobs.some((job) => job.id === requestedJobId)) {
      return sortedJobs;
    }

    const targetJob = sortedJobs.find((job) => job.id === requestedJobId);
    const otherJobs = sortedJobs.filter((job) => job.id !== requestedJobId);
    return [targetJob, ...otherJobs];
  }, [requestedJobId, sortedJobs]);

  const totalPages = Math.ceil(prioritizedJobs.length / itemsPerPage);
  const activePage = requestedJobId ? 1 : Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedJobs = prioritizedJobs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const hasApplied = (jobId) => applications.some(a => a.jobId === jobId);

  useEffect(() => {
    if (!requestedJobId || !paginatedJobs.some((job) => job.id === requestedJobId)) {
      return;
    }

    const targetCard = document.querySelector(`[data-job-id="${requestedJobId}"]`);
    targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [paginatedJobs, requestedJobId, view]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {filterType === 'recommended' ? 'Recommended Jobs' : filterType === 'saved' ? 'Saved Jobs' : 'Browse Jobs'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Showing {sortedJobs.length} results</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-panel dark:text-slate-300 lg:hidden"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
          
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-panel">
            <button 
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 focus:outline-none dark:border-slate-800 dark:bg-panel dark:text-slate-300"
          >
            <option>Relevance</option>
            <option>Newest</option>
            <option>Salary: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterPanel 
              filters={filters} 
              onChange={updateFilters} 
              onClear={clearFilters} 
            />
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {paginatedJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  view={view}
                  isSaved={savedJobIds.includes(job.id)}
                  hasApplied={hasApplied(job.id)}
                  onSave={() => handleToggleSaveJob(job.id)}
                  onApply={() => handleApply(job.id)}
                  data-job-id={job.id}
                  className={job.id === requestedJobId ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
              <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                <Search size={48} className="text-slate-300" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No jobs found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your filters to find more opportunities.</p>
              <button 
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {sortedJobs.length > itemsPerPage && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${activePage === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div 
        className={`fixed inset-0 z-50 transform transition-transform duration-300 lg:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full w-80 bg-white p-6 shadow-2xl dark:bg-panel">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)}>
              <X size={24} className="text-slate-500" />
            </button>
          </div>
          <FilterPanel 
            filters={filters} 
            onChange={updateFilters} 
            onClear={clearFilters} 
          />
        </div>
        <div 
          className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsFilterOpen(false)}
        />
      </div>
    </div>
  );
};

// Import Search for Empty State
import { Search } from 'lucide-react';

export default BrowseJobs;
