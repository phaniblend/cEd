import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import Layout from '../../components/Layout';

export default function AppsCatalog() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => projectsApi.getAll({ featured: true, status: 'ACTIVE' }),
  });

  const projects = data?.projects || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">App Catalog</h1>
        <p className="text-gray-600 mb-8">
          Browse affordable, open-source apps built by our community of learners.
        </p>

        {isLoading ? (
          <div className="text-center py-8">Loading apps...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No featured apps available.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const githubUrl = `https://github.com/${project.githubOrg}/${project.githubRepo}`;
              const completedTasks = project.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;
              const totalTasks = project.tasks?.length || 0;
              const maturity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Maturity: {maturity}%</span>
                    <span>Difficulty: {project.difficulty}</span>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gray-600 text-white text-center text-sm rounded-md hover:bg-gray-700"
                    >
                      View on GitHub
                    </a>
                    <Link
                      to={`/apps/${project.slug}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-center text-sm rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

