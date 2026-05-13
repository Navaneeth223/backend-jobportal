import { useCandidate } from '../context/CandidateContext';

export const useCandidateProfile = () => {
  const { candidateProfile, updateProfile } = useCandidate();

  const getProfileCompleteness = () => {
    // Basic logic to calculate completeness based on filled fields
    let filled = 0;
    const fields = ['name', 'title', 'location', 'bio', 'avatar', 'cvUrl'];
    fields.forEach(f => {
      if (candidateProfile[f]) filled++;
    });
    
    if (candidateProfile.skills.length > 0) filled++;
    if (candidateProfile.education.length > 0) filled++;
    if (candidateProfile.experience.length > 0) filled++;

    return Math.round((filled / (fields.length + 3)) * 100);
  };

  return {
    profile: candidateProfile,
    updateProfile,
    completeness: getProfileCompleteness()
  };
};
