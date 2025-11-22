'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isPrivate = formData.get('private') === 'true';

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user?.id) {
        setError('You must be logged in to create a project');
        return;
      }

      await api.createProject({
        name,
        description,
        private: isPrivate,
        owner_id: user.id,
      });

      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/projects" className="text-primary-blue hover:underline mb-4 inline-block">
        ← Back to Projects
      </Link>

      <div className="card-modern p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Project</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition"
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Visibility
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="private"
                  value="false"
                  defaultChecked
                  className="mr-2"
                />
                <span>Public - Anyone can view this project</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="private"
                  value="true"
                  className="mr-2"
                />
                <span>Private - Only you and invited members can view</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-orange-dark transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <Link
              href="/projects"
              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

