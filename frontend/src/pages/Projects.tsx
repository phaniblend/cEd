import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import Layout from '../components/Layout';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'all', selectedTag],
    queryFn: () => projectsApi.getAll({ status: 'ACTIVE', tag: selectedTag || undefined }),
  });

  const projects = data?.projects || [];
  const filteredProjects = searchTerm
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : projects;

  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Projects</h1>

        <div className="mb-6 space-y-4">
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or tech stack..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedTag === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-md text-sm ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
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
                  {project.tasks?.length || 0} tasks • {project.difficulty}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

