import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { projectsApi } from '../../api/projects';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole, ProjectDifficulty } from '../../types';

export default function LearnerDashboard() {
  const { user } = useAuth();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', 'recommended'],
    queryFn: () => projectsApi.getAll({ status: 'ACTIVE' }),
  });

  const recommendedProjects = projectsData?.projects || [];

  // Filter by user skills if available
  const filteredProjects = user?.skills && user.skills.length > 0
    ? recommendedProjects.filter((project) =>
        project.techStack.some((tech) =>
          user.skills.some((skill) =>
            tech.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(tech.toLowerCase())
          )
        )
      )
    : recommendedProjects;

  const getDifficultyColor = (difficulty: ProjectDifficulty) => {
    switch (difficulty) {
      case ProjectDifficulty.BEGINNER:
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case ProjectDifficulty.INTERMEDIATE:
        return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
      case ProjectDifficulty.ADVANCED:
        return 'bg-accent-red/20 text-accent-red border-accent-red/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.LEARNER]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            {user?.headline && (
              <p className="text-xl text-gray-400">{user.headline}</p>
            )}
            {user?.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-accent-blue/20 text-accent-blue rounded-full border border-accent-blue/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-accent-green/20 to-accent-green/5 border-accent-green/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Projects Available</p>
                  <p className="text-3xl font-bold text-white">{filteredProjects.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Your Skills</p>
                  <p className="text-3xl font-bold text-white">{user?.skills?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-accent-purple/20 to-accent-purple/5 border-accent-purple/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Recommended</p>
                  <p className="text-3xl font-bold text-white">{filteredProjects.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Projects */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Recommended Projects
              </h2>
              <Link
                to="/projects"
                className="text-accent-purple hover:text-purple-400 font-medium flex items-center gap-2"
              >
                View all <span>→</span>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
                <p className="mt-4 text-gray-400">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400 mb-4">No recommended projects found.</p>
                <Link to="/projects" className="btn-primary inline-block">
                  Browse All Projects
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.slice(0, 6).map((project) => (
                  <Link
                    key={project.id}
                    to={`/learner/projects/${project.id}`}
                    className="card hover:border-accent-purple/50 transition-all hover:transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex-1">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="ml-2 px-2 py-1 text-xs bg-accent-purple/20 text-accent-purple rounded border border-accent-purple/30">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded border border-accent-blue/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-400">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                      <span className={`px-3 py-1 text-xs rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                      <span className="text-sm text-gray-400">
                        {project.tasks?.length || 0} tasks
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
