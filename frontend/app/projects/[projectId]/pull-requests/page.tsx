'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DiffViewer from '@/app/components/DiffViewer';

export default function PullRequestsPage() {
  const params = useParams();
  const projectId = params.projectId;
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPR, setSelectedPR] = useState<any | null>(null);

  useEffect(() => {
    // TODO: Fetch pull requests from API
    setTimeout(() => {
      setPullRequests([
        {
          id: 1,
          title: 'Add authentication feature',
          description: 'Implement JWT-based authentication',
          status: 'open',
          base: 'main',
          head: 'feature/auth',
          author: 'John Doe',
        },
        {
          id: 2,
          title: 'Fix database connection issue',
          description: 'Resolve connection pooling problems',
          status: 'merged',
          base: 'main',
          head: 'fix/db-connection',
          author: 'Jane Smith',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'merged':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-gray-600">Loading pull requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href={`/projects/${projectId}`} className="text-primary-blue hover:underline mb-2 inline-block">
            ← Back to Project
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pull Requests</h1>
        </div>
        <button className="bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-orange-dark transition shadow-lg">
          + New Pull Request
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          {pullRequests.map((pr) => (
            <div
              key={pr.id}
              className={`card-modern p-4 cursor-pointer transition ${
                selectedPR?.id === pr.id ? 'ring-2 ring-primary-blue' : ''
              }`}
              onClick={() => setSelectedPR(pr)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{pr.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pr.status)}`}>
                  {pr.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{pr.description}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span>{pr.author}</span>
                <span>{pr.base} ← {pr.head}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {selectedPR ? (
            <div className="space-y-6">
              <div className="card-modern p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPR.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPR.status)}`}>
                        {selectedPR.status}
                      </span>
                      <span>{selectedPR.author}</span>
                      <span>{selectedPR.base} ← {selectedPR.head}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Merge
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Close
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{selectedPR.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Changes</h3>
                <DiffViewer
                  diff={`--- a/src/App.tsx\n+++ b/src/App.tsx\n@@ -1,5 +1,10 @@\n import React from 'react';\n+\n+function App() {\n+  return <div>Hello World</div>;\n+}\n+\n+export default App;\n`}
                />
              </div>

              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary-blue pl-4">
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-gray-600">Looks good! Just a small suggestion...</p>
                  </div>
                </div>
                <textarea
                  className="w-full mt-4 border border-gray-300 rounded-lg p-3"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <button className="mt-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-blue-dark transition">
                  Comment
                </button>
              </div>
            </div>
          ) : (
            <div className="card-modern p-12 text-center">
              <p className="text-gray-500">Select a pull request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

