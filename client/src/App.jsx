import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentLayout from './layouts/StudentLayout';
import IndustryLayout from './layouts/IndustryLayout';
import AcademicianLayout from './layouts/AcademicianLayout';
import InstitutionLayout from './layouts/InstitutionLayout';
import StudentDashboard from './pages/student/Dashboard';
import SkillAssessment from './pages/student/SkillAssessment';
import SkillProfile from './pages/student/SkillProfile';
import Internships from './pages/student/Internships';
import Placements from './pages/student/Placements';
import Applications from './pages/student/Applications';
import Portfolio from './pages/student/Portfolio';
import Learning from './pages/student/Learning';
import IndustryDashboard from './pages/industry/Dashboard';
import PostJob from './pages/industry/PostJob';
import Applicants from './pages/industry/Applicants';
import Programs from './pages/industry/Programs';
import Collaborations from './pages/industry/Collaborations';
import AcademicianDashboard from './pages/academician/Dashboard';
import Opportunities from './pages/academician/Opportunities';
import Research from './pages/academician/Research';
import InstitutionDashboard from './pages/institution/Dashboard';
import Students from './pages/institution/Students';
import PlacementAnalytics from './pages/institution/PlacementAnalytics';
import SkillTrends from './pages/institution/SkillTrends';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PublicPortfolio from './pages/student/PublicPortfolio';


export default function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/portfolio/:userId" element={<PublicPortfolio />} />


      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="skill-assessment" element={<SkillAssessment />} />
        <Route path="skill-profile" element={<SkillProfile />} />
        <Route path="internships" element={<Internships />} />
        <Route path="placements" element={<Placements />} />
        <Route path="applications" element={<Applications />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="learning" element={<Learning />} />
      </Route>

      <Route path="/industry" element={<ProtectedRoute role="industry"><IndustryLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<IndustryDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="programs" element={<Programs />} />
        <Route path="collaborations" element={<Collaborations />} />
      </Route>

      <Route path="/academician" element={<ProtectedRoute role="academician"><AcademicianLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AcademicianDashboard />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="research" element={<Research />} />
      </Route>

      <Route path="/institution" element={<ProtectedRoute role="institution"><InstitutionLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InstitutionDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="placement-analytics" element={<PlacementAnalytics />} />
        <Route path="skill-trends" element={<SkillTrends />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
