import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
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
          <div className="text-center">Loading app details...</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">App not found</div>
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
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-3">Project Info</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Difficulty:</strong> {project.difficulty}
                </p>
                <p>
                  <strong>Maturity:</strong> {maturity}%
                </p>
                <p>
                  <strong>Status:</strong> {project.status}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              View on GitHub
            </a>
            <button
              onClick={() => alert('Request help feature coming soon!')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Request Help
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

