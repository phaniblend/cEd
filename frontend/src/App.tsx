import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Projects from './pages/Projects';
import LearnerDashboard from './pages/learner/Dashboard';
import ProjectDetail from './pages/learner/ProjectDetail';
import TaskWorkbench from './pages/learner/TaskWorkbench';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import LearnerDetail from './pages/recruiter/LearnerDetail';
import AppsCatalog from './pages/apps/Catalog';
import AppDetail from './pages/apps/AppDetail';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
        <Route path="/learner/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/learner/tasks/:taskId" element={<TaskWorkbench />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/learners/:learnerId" element={<LearnerDetail />} />
        <Route path="/apps" element={<AppsCatalog />} />
        <Route path="/apps/:slug" element={<AppDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

