import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { projectsApi } from '../../api/projects';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole } from '../../types';

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

  return (
    <ProtectedRoute allowedRoles={[UserRole.LEARNER]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            {user?.headline && (
              <p className="mt-2 text-lg text-gray-600">{user.headline}</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Recommended Projects
            </h2>
            {isLoading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recommended projects found. Check out all projects{' '}
                <Link to="/projects" className="text-blue-600 hover:underline">
                  here
                </Link>
                .
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.slice(0, 6).map((project) => (
                  <Link
                    key={project.id}
                    to={`/learner/projects/${project.id}`}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.tasks?.length || 0} tasks
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              to="/projects"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all projects →
            </Link>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

