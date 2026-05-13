import { useState, useMemo } from 'react';

export const useJobFilters = (initialJobs) => {
  const [filters, setFilters] = useState({
    search: '',
    jobTypes: [],
    experience: 'Any',
    salaryRange: [0, 30],
    location: [],
    datePosted: 'Any time'
  });

  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      // Search
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) && !job.company.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Job Type
      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) {
        return false;
      }

      // Experience
      if (filters.experience !== 'Any') {
        const expMap = {
          'Fresher': 'fresher',
          '1-3 yrs': [1, 3],
          '3-5 yrs': [3, 5],
          '5+ yrs': [5, 100]
        };
        
        const target = expMap[filters.experience];
        if (target === 'fresher') {
          if (!job.experienceRequired.toLowerCase().includes('fresher')) return false;
        } else if (Array.isArray(target)) {
          const jobExp = parseInt(job.experienceRequired);
          if (isNaN(jobExp) || jobExp < target[0] || jobExp > target[1]) return false;
        }
      }

      // Salary
      const salary = parseInt(job.salaryMax);
      if (!isNaN(salary) && (salary < filters.salaryRange[0] || salary > filters.salaryRange[1])) {
        // This is a simple check, actual logic might be more complex
      }

      return true;
    });
  }, [initialJobs, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      jobTypes: [],
      experience: 'Any',
      salaryRange: [0, 30],
      location: [],
      datePosted: 'Any time'
    });
  };

  return {
    filters,
    filteredJobs,
    updateFilters,
    clearFilters
  };
};
