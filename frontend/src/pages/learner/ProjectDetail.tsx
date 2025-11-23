import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import { tasksApi } from '../../api/tasks';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole, TaskStatus, ProjectDifficulty } from '../../types';
import { useState } from 'react';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.getByProject(projectId!),
    enabled: !!projectId && activeTab === 'tasks',
  });

  const project = projectData?.project;
  const tasks = tasksData?.tasks || [];

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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.OPEN:
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case TaskStatus.IN_PROGRESS:
        return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
      case TaskStatus.COMPLETED:
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (projectLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
            <p className="mt-4 text-gray-400">Loading project...</p>
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
            <p className="text-gray-400">Project not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  const githubUrl = `https://github.com/${project.githubOrg}/${project.githubRepo}`;

  return (
    <ProtectedRoute allowedRoles={[UserRole.LEARNER]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/learner/dashboard"
              className="text-accent-purple hover:text-purple-400 text-sm inline-flex items-center gap-2"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </div>

          <div className="card mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {project.title}
                </h1>
                <p className="text-gray-400 text-lg mb-6">{project.description}</p>
              </div>
              {project.featured && (
                <span className="ml-4 px-3 py-1 text-sm bg-accent-purple/20 text-accent-purple rounded-full border border-accent-purple/30">
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-accent-blue/20 text-accent-blue rounded-full border border-accent-blue/30"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                {project.difficulty}
              </span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:text-blue-400 inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="border-b border-dark-border">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-accent-purple text-accent-purple bg-dark-hover'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'tasks'
                      ? 'border-b-2 border-accent-purple text-accent-purple bg-dark-hover'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  Tasks ({tasks.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' ? (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">About this project</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
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
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Available Tasks</h2>
                  {tasksLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
                      <p className="mt-4 text-gray-400">Loading tasks...</p>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No tasks available</div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="card border-dark-border hover:border-accent-purple/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                            <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>Difficulty: {task.difficulty}</span>
                              {task.githubIssueNumber && (
                                <a
                                  href={`${githubUrl}/issues/${task.githubIssueNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-blue hover:text-blue-400"
                                >
                                  Issue #{task.githubIssueNumber}
                                </a>
                              )}
                            </div>
                            {task.status === TaskStatus.OPEN && (
                              <Link
                                to={`/learner/tasks/${task.id}`}
                                className="btn-primary text-sm"
                              >
                                Start Task
                              </Link>
                            )}
                            {task.status === TaskStatus.IN_PROGRESS && (
                              <Link
                                to={`/learner/tasks/${task.id}`}
                                className="btn-secondary text-sm"
                              >
                                Continue
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
