'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RepositoryBrowser from '@/app/components/RepositoryBrowser';
import { api } from '@/lib/api';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const [project, setProject] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'code'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, issuesData] = await Promise.all([
          api.getProject(projectId as string),
          api.getIssues(parseInt(projectId as string)).catch(() => ({ issues: [] })),
        ]);
        setProject(projectData);
        setIssues(issuesData.issues || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <Link href="/projects" className="mt-4 inline-block text-primary-blue hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/projects" className="text-primary-blue hover:underline mb-4 inline-block">
        ← Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{project?.name}</h1>
        <p className="text-gray-600">{project?.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-accent-orange text-accent-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <Link
            href={`/projects/${projectId}/issues`}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'issues'
                ? 'border-accent-orange text-accent-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Issues ({issues.length})
          </Link>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'code'
                ? 'border-accent-orange text-accent-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Code
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card-modern p-6">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="mt-1 text-gray-800">{project?.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Visibility</label>
                <p className="mt-1 text-gray-800">{project?.private ? 'Private' : 'Public'}</p>
              </div>
            </div>
          </div>
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-800">{issues.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'open').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {issues.filter(i => i.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Issues</h2>
            <button className="bg-accent-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent-orange-dark transition">
              + New Issue
            </button>
          </div>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="card-modern p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{issue.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      {issue.assignee && (
                        <span>Assigned to {issue.assignee}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="h-[600px]">
          <RepositoryBrowser projectId={projectId as string} />
        </div>
      )}
    </div>
  );
}

