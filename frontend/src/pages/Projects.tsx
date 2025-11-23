import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import Layout from '../components/Layout';
import { ProjectDifficulty } from '../types';

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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">All Projects</h1>
          <p className="text-gray-400">Browse all available projects to contribute to</p>
        </div>

        <div className="card mb-6">
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or tech stack..."
              className="input-field w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTag === ''
                  ? 'bg-accent-purple text-white'
                  : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-accent-purple text-white'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-4">No projects found.</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
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
    </Layout>
  );
}
