import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import { tasksApi } from '../../api/tasks';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole, TaskStatus } from '../../types';
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

  if (projectLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading project...</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Project not found</div>
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
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {project.title}
            </h1>
            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Difficulty: {project.difficulty}</span>
              <span>•</span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'tasks'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Tasks
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">About this project</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div>
                    <h3 className="font-semibold mb-2">Tech Stack</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {project.techStack.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
                  {tasksLoading ? (
                    <div>Loading tasks...</div>
                  ) : tasks.length === 0 ? (
                    <div className="text-gray-500">No tasks available</div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                task.status === TaskStatus.OPEN
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === TaskStatus.IN_PROGRESS
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Difficulty: {task.difficulty}</span>
                              {task.githubIssueNumber && (
                                <a
                                  href={`${githubUrl}/issues/${task.githubIssueNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View Issue #{task.githubIssueNumber}
                                </a>
                              )}
                            </div>
                            {task.status === TaskStatus.OPEN && (
                              <Link
                                to={`/learner/tasks/${task.id}`}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                              >
                                Start Task
                              </Link>
                            )}
                            {task.status === TaskStatus.IN_PROGRESS && (
                              <Link
                                to={`/learner/tasks/${task.id}`}
                                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
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

