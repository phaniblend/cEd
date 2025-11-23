import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import Layout from '../../components/Layout';

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['project', 'slug', slug],
    queryFn: () => projectsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const project = data?.project;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
            <p className="mt-4 text-gray-400">Loading app details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-400">App not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  const githubUrl = `https://github.com/${project.githubOrg}/${project.githubRepo}`;
  const completedTasks = project.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;
  const totalTasks = project.tasks?.length || 0;
  const maturity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/apps"
            className="text-accent-purple hover:text-purple-400 text-sm inline-flex items-center gap-2"
          >
            <span>←</span> Back to App Catalog
          </Link>
        </div>

        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-xl text-gray-400 mb-6">{project.description}</p>
            </div>
            {project.liveAppUrl && (
              <span className="ml-4 px-3 py-1 text-sm bg-accent-green/20 text-accent-green rounded-full border border-accent-green/30">
                Live
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-accent-blue/20 text-accent-blue rounded-full border border-accent-blue/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Project Info</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Difficulty:</span>
                  <span className="ml-2 text-white">{project.difficulty}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Maturity:</span>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white font-semibold">{maturity}%</span>
                    </div>
                    <div className="w-full bg-dark-hover rounded-full h-2">
                      <div
                        className="bg-accent-green h-2 rounded-full transition-all"
                        style={{ width: `${maturity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Status:</span>
                  <span className="ml-2 text-white">{project.status}</span>
                </div>
              </div>
            </div>
          </div>

          {project.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-dark-hover text-gray-300 rounded-full border border-dark-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-6 border-t border-dark-border">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            {project.liveAppUrl && (
              <a
                href={project.liveAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live App
              </a>
            )}
            <button
              onClick={() => alert('Request help feature coming soon!')}
              className="btn-secondary"
            >
              Request Help
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
