'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import KanbanBoard from '@/app/components/KanbanBoard';
import { api } from '@/lib/api';

export default function IssuesPage() {
  const params = useParams();
  const projectId = params.projectId;
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const result: any = await api.getIssues(parseInt(projectId as string));
        // Transform API response to match component expectations
        const transformedIssues = (result.issues || []).map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          status: issue.status,
          assignee: issue.assignee_id ? `User ${issue.assignee_id}` : null,
        }));
        setIssues(transformedIssues);
      } catch (err: any) {
        setError(err.message || 'Failed to load issues');
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchIssues();
    }
  }, [projectId]);

  const handleIssueUpdate = async (issueId: number, newStatus: string) => {
    try {
      await api.updateIssueStatus(issueId.toString(), newStatus);
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update issue');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error && issues.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <Link href={`/projects/${projectId}`} className="text-primary-blue hover:underline">
          ← Back to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href={`/projects/${projectId}`} className="text-primary-blue hover:underline mb-2 inline-block">
            ← Back to Project
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Issues</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 ${
                viewMode === 'kanban'
                  ? 'bg-primary-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${
                viewMode === 'list'
                  ? 'bg-primary-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
          <button className="bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-orange-dark transition shadow-lg">
            + New Issue
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard issues={issues} onIssueUpdate={handleIssueUpdate} />
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="card-modern p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{issue.title}</h3>
                  {issue.description && (
                    <p className="text-gray-600 mb-3">{issue.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : issue.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {issue.status.replace('_', ' ')}
                    </span>
                    {issue.assignee && <span className="text-gray-600">Assigned to {issue.assignee}</span>}
                  </div>
                </div>
                <button className="text-primary-blue hover:underline text-sm">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

