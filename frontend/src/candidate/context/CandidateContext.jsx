import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs } from '../data/mockJobs';
import { mockApplications } from '../data/mockApplications';
import { mockNotifications } from '../data/mockNotifications';
import { mockMessages } from '../data/mockMessages';

const CandidateContext = createContext();

const normalizeSkillValue = (entry) => {
  if (typeof entry === 'string') {
    return entry.trim();
  }

  if (entry && typeof entry === 'object') {
    if (typeof entry.label === 'string') {
      return entry.label.trim();
    }

    return Object.keys(entry)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => entry[key])
      .join('')
      .trim();
  }

  return '';
};

const normalizeEntries = (entries, fallback = []) => (Array.isArray(entries) ? entries : fallback);

const normalizeProfile = (profile = {}) => ({
  name: profile.name || '',
  email: profile.email || '',
  phone: profile.phone || '',
  avatar: profile.avatar || null,
  title: profile.title || '',
  location: profile.location || '',
  bio: profile.bio || '',
  linkedin: profile.linkedin || '',
  github: profile.github || '',
  portfolio: profile.portfolio || '',
  coverLetter: profile.coverLetter || '',
  experienceYears: profile.experienceYears || '',
  dob: profile.dob || '',
  gender: profile.gender || '',
  cvUrl: profile.cvUrl || null,
  cvName: profile.cvName || null,
  skills: normalizeEntries(profile.skills).map(normalizeSkillValue).filter(Boolean),
  education: normalizeEntries(profile.education).filter((entry) => entry && typeof entry === 'object'),
  experience: normalizeEntries(profile.experience).filter((entry) => entry && typeof entry === 'object'),
  preferences: {
    types: Array.isArray(profile.preferences?.types) ? profile.preferences.types : [],
    salary: Array.isArray(profile.preferences?.salary) ? profile.preferences.salary : [0, 30],
    locations: Array.isArray(profile.preferences?.locations) ? profile.preferences.locations : [],
    noticePeriod: profile.preferences?.noticePeriod || '',
  },
});

const calculateCompletionPercentage = (profile) => {
  const checkpoints = [
    profile.name,
    profile.email,
    profile.phone,
    profile.title,
    profile.location,
    profile.bio,
    profile.skills?.length,
    profile.education?.length,
    profile.experience?.length,
    profile.cvName,
  ];

  const completed = checkpoints.filter(Boolean).length;
  return Math.round((completed / checkpoints.length) * 100);
};

const withProfileMeta = (profile) => ({
  ...normalizeProfile(profile),
  completionPercentage: calculateCompletionPercentage(normalizeProfile(profile)),
});

export const useCandidate = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
};

export const CandidateProvider = ({ children }) => {
  const [candidateProfile, setCandidateProfile] = useState(() => {
    const saved = localStorage.getItem('candidate-profile');
    if (saved) return withProfileMeta(JSON.parse(saved));
    return withProfileMeta({
      name: 'Navaneeth',
      email: 'navaneeth@example.com',
      phone: '+91 98765 43210',
      avatar: null,
      title: 'Frontend Developer',
      location: 'Bangalore, India',
      bio: 'Passionate frontend developer with a love for React and Tailwind CSS.',
      linkedin: '',
      github: '',
      portfolio: '',
      experienceYears: '1-2',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'],
      education: [
        { id: 1, degree: 'B.Tech in Computer Science', institution: 'ABC University', from: '2018', to: '2022', grade: '8.5 CGPA' }
      ],
      experience: [
        { id: 1, title: 'Junior Web Developer', company: 'SoftTech Solutions', from: 'June 2022', to: 'Present', description: 'Working on internal dashboards.' }
      ],
      cvUrl: null,
      cvName: null,
    });
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('candidate-applications');
    return saved ? JSON.parse(saved) : mockApplications;
  });

  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('candidate-saved-jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('candidate-profile', JSON.stringify(candidateProfile));
  }, [candidateProfile]);

  useEffect(() => {
    localStorage.setItem('candidate-applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('candidate-saved-jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const unreadMessages = messages.reduce((acc, msg) => acc + msg.unreadCount, 0);
  const notificationCount = notifications.filter(n => !n.read).length;

  const updateProfile = (field, value) => {
    setCandidateProfile(prev => withProfileMeta({
      ...prev,
      [field]: value
    }));
  };

  const replaceProfile = (nextProfile) => {
    setCandidateProfile(withProfileMeta(nextProfile));
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const applyToJob = (jobId) => {
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) return;

    const newApplication = {
      id: applications.length + 1,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied'
    };

    setApplications(prev => {
      if (prev.some(a => a.jobId === jobId)) return prev;
      return [newApplication, ...prev];
    });
  };

  const addEducation = (edu) => {
    setCandidateProfile(prev => withProfileMeta({
      ...prev,
      education: [...prev.education, { ...edu, id: Date.now() }]
    }));
  };

  const removeEducation = (id) => {
    setCandidateProfile(prev => withProfileMeta({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const addExperience = (exp) => {
    setCandidateProfile(prev => withProfileMeta({
      ...prev,
      experience: [...prev.experience, { ...exp, id: Date.now() }]
    }));
  };

  const removeExperience = (id) => {
    setCandidateProfile(prev => withProfileMeta({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const ensureConversationForApplication = (application) => {
    if (!application) return null;

    const existingConversation = messages.find((conversation) =>
      conversation.jobTitle === application.jobTitle && conversation.companyName === application.company
    );

    if (existingConversation) {
      return existingConversation.id;
    }

    const relatedJob = mockJobs.find((job) => job.id === application.jobId);
    const nextConversationId = messages.length ? Math.max(...messages.map((conversation) => conversation.id)) + 1 : 1;

    const newConversation = {
      id: nextConversationId,
      jobTitle: application.jobTitle,
      companyName: application.company,
      companyInitials: application.companyLogo,
      location: relatedJob?.location || candidateProfile.location || 'Location not specified',
      experience: relatedJob?.experienceRequired || 'Not specified',
      applicationStage: application.status.replaceAll('_', ' '),
      lastMessage: 'Start your conversation with the hiring team.',
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: 'company',
          text: `Hi ${candidateProfile.name}, feel free to message us here about the ${application.jobTitle} role.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setMessages((prev) => [...prev, newConversation]);
    return newConversation.id;
  };

  const sendMessage = (conversationId, text) => {
    setMessages(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: text,
          timestamp: new Date().toISOString(),
          messages: [
            ...conv.messages,
            { id: conv.messages.length + 1, sender: 'candidate', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return conv;
    }));
  };

  return (
    <CandidateContext.Provider value={{
      candidateProfile,
      applications,
      savedJobs,
      notifications,
      messages,
      unreadMessages,
      notificationCount,
      updateProfile,
      replaceProfile,
      toggleSaveJob,
      applyToJob,
      addEducation,
      removeEducation,
      addExperience,
      removeExperience,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      ensureConversationForApplication,
      sendMessage
    }}>
      {children}
    </CandidateContext.Provider>
  );
};
