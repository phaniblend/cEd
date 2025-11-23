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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            App Catalog 🛍️
          </h1>
          <p className="text-xl text-gray-400">
            Browse affordable, open-source apps built by our community of learners.
          </p>
        </div>

        {isLoading ? (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
            <p className="mt-4 text-gray-400">Loading apps...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-4">No featured apps available.</p>
            <p className="text-sm text-gray-500">Check back soon for new apps!</p>
          </div>
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
                  className="card hover:border-accent-purple/50 transition-all hover:transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex-1">
                      {project.title}
                    </h3>
                    {project.liveAppUrl && (
                      <span className="ml-2 px-2 py-1 text-xs bg-accent-green/20 text-accent-green rounded border border-accent-green/30">
                        Live
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded border border-accent-blue/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-400">
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Maturity</span>
                      <span className="text-white font-semibold">{maturity}%</span>
                    </div>
                    <div className="w-full bg-dark-hover rounded-full h-2">
                      <div
                        className="bg-accent-green h-2 rounded-full transition-all"
                        style={{ width: `${maturity}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-dark-border">
                    <span>Difficulty: {project.difficulty}</span>
                    <span>{totalTasks} tasks</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-secondary text-center text-sm"
                    >
                      GitHub
                    </a>
                    <Link
                      to={`/apps/${project.slug}`}
                      className="flex-1 btn-primary text-center text-sm"
                    >
                      Details
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
