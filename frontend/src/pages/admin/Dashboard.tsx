import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../api/projects';
import { tasksApi } from '../../api/tasks';
import { githubApi } from '../../api/github';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole } from '../../types';

// Tech stack examples - user can enter any tech stack
const TECH_STACK_EXAMPLES = [
  'react-vite',
  'nextjs',
  'vue-nuxt',
  'angular',
  'svelte',
  'remix',
  'solid',
  'qwik',
];

export default function AdminDashboard() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { data: installationsData } = useQuery({
    queryKey: ['github', 'installations'],
    queryFn: () => githubApi.getInstallations(),
  });

  const installations = installationsData?.installations || [];
  const defaultInstallationId = installations.length > 0 ? installations[0].id : null;

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={() => setShowProjectForm(true)}
              className="btn-primary"
            >
              + Create Project
            </button>
          </div>

          {showProjectForm && (
            <ProjectCreationForm
              installations={installations}
              defaultInstallationId={defaultInstallationId}
              onClose={() => setShowProjectForm(false)}
              onProjectCreated={(projectId) => {
                setSelectedProject(projectId);
                setShowProjectForm(false);
                setShowTaskForm(true);
              }}
            />
          )}

          {showTaskForm && selectedProject && (
            <TaskCreationForm
              projectId={selectedProject}
              installationId={defaultInstallationId}
              onClose={() => {
                setShowTaskForm(false);
                setSelectedProject(null);
              }}
            />
          )}

          <ProjectsList onSelectProject={setSelectedProject} />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function ProjectCreationForm({
  installations,
  defaultInstallationId,
  onClose,
  onProjectCreated,
}: {
  installations: any[];
  defaultInstallationId: number | null;
  onClose: () => void;
  onProjectCreated: (projectId: string) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    techStackTemplate: 'react-vite',
    installationId: defaultInstallationId || 0,
    difficulty: 'BEGINNER' as const,
    tags: [] as string[],
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => projectsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onProjectCreated(response.project.id);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    createMutation.mutate({
      ...formData,
      slug,
      githubOrg: '', // Will be set from installation
    });
  };

  return (
    <div className="card mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            required
            className="input-field w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., World Famous To-Do Lister"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            className="input-field w-full"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the project..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tech Stack Template
          </label>
          <input
            type="text"
            required
            className="input-field w-full"
            value={formData.techStackTemplate}
            onChange={(e) => setFormData({ ...formData, techStackTemplate: e.target.value })}
            placeholder="e.g., react-vite, nextjs, vue-nuxt, angular, svelte, remix, solid, qwik"
            list="tech-stack-examples"
          />
          <datalist id="tech-stack-examples">
            {TECH_STACK_EXAMPLES.map((example) => (
              <option key={example} value={example} />
            ))}
          </datalist>
          <p className="text-xs text-gray-400 mt-1">
            Enter any tech stack. Our app will use the latest official CLI tools to generate starter code.
            Examples: react-vite, nextjs, vue-nuxt, angular, svelte, remix, solid, qwik
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={formData.techStack.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            placeholder="React, TypeScript, TailwindCSS"
          />
        </div>

        {installations.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Installation
            </label>
            <select
              className="input-field w-full"
              value={formData.installationId}
              onChange={(e) =>
                setFormData({ ...formData, installationId: parseInt(e.target.value) })
              }
            >
              {installations.map((inst: any) => (
                <option key={inst.id} value={inst.id}>
                  {inst.account?.login || `Installation ${inst.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            className="input-field w-full"
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value as any })
            }
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={formData.tags.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            placeholder="todo-app, frontend, react"
          />
        </div>

        {createMutation.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {(createMutation.error as any)?.response?.data?.message || 'Failed to create project'}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function TaskCreationForm({
  projectId,
  installationId,
  onClose,
}: {
  projectId: string;
  installationId: number | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    difficulty: 'EASY' as const,
    tags: [] as string[],
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => tasksApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      // Reset form
      setFormData({
        title: '',
        description: '',
        tech: '',
        difficulty: 'EASY',
        tags: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      installationId,
    });
  };

  return (
    <div className="card mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Add Task to Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Task Title
          </label>
          <input
            type="text"
            required
            className="input-field w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Create UI with list adder"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            className="input-field w-full"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the task..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tech Identifier
          </label>
          <input
            type="text"
            required
            className="input-field w-full"
            value={formData.tech}
            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
            placeholder="e.g., react, vue, angular"
          />
          <p className="text-xs text-gray-400 mt-1">
            This will be used by learners to filter tasks (e.g., "react")
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            className="input-field w-full"
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value as any })
            }
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={formData.tags.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            placeholder="ui, component, list"
          />
        </div>

        {createMutation.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {(createMutation.error as any)?.response?.data?.message || 'Failed to create task'}
          </div>
        )}

        {createMutation.isSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            Task created successfully! GitHub issue created.
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Done
          </button>
        </div>
      </form>
    </div>
  );
}

function ProjectsList({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectsApi.getAll({}),
  });

  const projects = data?.projects || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading projects...</div>;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-white mb-4">All Projects</h2>
      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No projects yet. Create your first project!</div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-dark-border rounded-lg p-4 bg-dark-bg hover:border-accent-blue transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {project.tasks?.length || 0} tasks • {project.difficulty}
                  </p>
                </div>
                <button
                  onClick={() => onSelectProject(project.id)}
                  className="btn-secondary"
                >
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

