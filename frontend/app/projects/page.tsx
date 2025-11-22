'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const result: any = await api.getProjects(user?.id);
        setProjects(result.projects || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
        // Set empty array on error to show empty state
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your repositories and projects</p>
        </div>
        <Link
          href="/projects/new"
          className="bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-orange-dark transition shadow-lg"
        >
          + New Project
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="card-modern p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                {project.private && (
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated 2 days ago
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-12 card-modern">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first project</p>
          <Link
            href="/projects/new"
            className="inline-block bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-orange-dark transition"
          >
            Create Project
          </Link>
        </div>
      )}
    </div>
  );
}

