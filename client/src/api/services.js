import api from './axios';

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
  getMe:    ()     => api.get('/api/auth/me'),
};

export const studentAPI = {
  getProfile:          ()     => api.get('/api/student/profile'),
  updateProfile:       (data) => api.put('/api/student/profile', data),
  getPortfolio:        ()     => api.get('/api/student/portfolio'),
  updatePortfolio:     (data) => api.put('/api/student/portfolio', data),
  getPublicPortfolio:  (uid)  => api.get(`/api/student/portfolio/${uid}`),
  getSkillProfile:     ()     => api.get('/api/student/skill-profile'),
  getApplications:     ()     => api.get('/api/student/applications'),
  getDashboard:        ()     => api.get('/api/student/dashboard'),
};


// NOTE: backend mounts at /api/skills  (plural)
export const skillAPI = {
  getCategories:    ()     => api.get('/api/skills/categories'),
  getQuestions:     (params) => api.get('/api/skills/questions', { params }),
  submitAssessment: (data) => api.post('/api/skills/submit', data),
  getResult:        ()     => api.get('/api/skills/result'),
};

export const jobAPI = {
  getAll:                (params)             => api.get('/api/jobs', { params }),
  getById:               (id)                 => api.get(`/api/jobs/${id}`),
  getRecommended:        ()                   => api.get('/api/jobs/recommended'),
  getPosted:             ()                   => api.get('/api/jobs/posted'),
  postJob:               (data)               => api.post('/api/jobs', data),
  apply:                 (jobId, data)        => api.post(`/api/jobs/${jobId}/apply`, data),
  updateApplicantStatus: (jobId, sid, data)   => api.put(`/api/jobs/${jobId}/applicants/${sid}`, data),
};

export const industryAPI = {
  getProfile:            ()      => api.get('/api/industry/profile'),
  updateProfile:         (data)  => api.put('/api/industry/profile', data),
  getDashboard:          ()      => api.get('/api/industry/dashboard'),
  getApplicants:         (p)     => api.get('/api/industry/applicants', { params: p }),
  getLearningPrograms:   ()      => api.get('/api/industry/programs'),
  postLearningProgram:   (data)  => api.post('/api/industry/programs', data),
  getCollaborations:     ()      => api.get('/api/industry/collaborations'),
  postCollaboration:     (data)  => api.post('/api/industry/collaborations', data),
  updateCollaboration:   (id, d) => api.put(`/api/industry/collaborations/${id}`, d),
};

export const academicianAPI = {
  getProfile:             ()         => api.get('/api/academician/profile'),
  updateProfile:          (data)     => api.put('/api/academician/profile', data),
  getDashboard:           ()         => api.get('/api/academician/dashboard'),
  // Backend returns { opportunities: [...] }
  getOpportunities:       (params)   => api.get('/api/academician/opportunities', { params }),
  getResearch:            ()         => api.get('/api/academician/research'),
  applyToOpportunity:     (id, data) => api.post(`/api/academician/opportunities/${id}/apply`, data),
  applyToCollaboration:   (id)       => api.post(`/api/academician/research/${id}/apply`, {}),
};

export const institutionAPI = {
  getProfile:            ()  => api.get('/api/institution/profile'),
  updateProfile:   (data)    => api.put('/api/institution/profile', data),
  getDashboard:          ()  => api.get('/api/institution/dashboard'),
  getStudents:      (params) => api.get('/api/institution/students', { params }),
  getPlacementAnalytics: ()  => api.get('/api/institution/placement-analytics'),
  getSkillTrends:        ()  => api.get('/api/institution/skill-trends'),
};

export const learningAPI = {
  getAll:  (params) => api.get('/api/learning', { params }),
  getById: (id)     => api.get(`/api/learning/${id}`),
};
