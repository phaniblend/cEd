'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    pullRequests: 0,
    teamMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (user?.id) {
          const projects: any = await api.getProjects(user.id);
          const projectCount = projects.projects?.length || 0;
          
          // Count issues across all projects
          let totalIssues = 0;
          for (const project of projects.projects || []) {
            try {
              const issues: any = await api.getIssues(project.id);
              totalIssues += issues.issues?.length || 0;
            } catch (e) {
              // Ignore errors for individual projects
            }
          }
          
          setStats({
            projects: projectCount,
            tasks: totalIssues,
            pullRequests: 0, // TODO: Count PRs
            teamMembers: 0, // TODO: Count team members
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your cEd workspace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active Projects</p>
              <p className="text-3xl font-bold text-primary-blue">{loading ? '...' : stats.projects}</p>
            </div>
            <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Open Tasks</p>
              <p className="text-3xl font-bold text-accent-orange">{loading ? '...' : stats.tasks}</p>
            </div>
            <div className="w-12 h-12 bg-accent-orange rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pull Requests</p>
              <p className="text-3xl font-bold text-green-600">{loading ? '...' : stats.pullRequests}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Team Members</p>
              <p className="text-3xl font-bold text-purple-600">{loading ? '...' : stats.teamMembers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/projects/new" className="block w-full bg-primary-blue text-white px-4 py-3 rounded-lg text-center font-semibold hover:bg-primary-blue-dark transition">
              Create New Project
            </Link>
            <Link href="/projects" className="block w-full bg-accent-orange text-white px-4 py-3 rounded-lg text-center font-semibold hover:bg-accent-orange-dark transition">
              Browse Projects
            </Link>
            <Link href="/teams" className="block w-full border-2 border-primary-blue text-primary-blue px-4 py-3 rounded-lg text-center font-semibold hover:bg-blue-50 transition">
              Manage Teams
            </Link>
          </div>
        </div>

        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-3 border-b">
              <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800"><span className="font-semibold">John Doe</span> created a new project</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 pb-3 border-b">
              <div className="w-8 h-8 bg-accent-orange rounded-full flex items-center justify-center text-white text-sm font-semibold">
                JS
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800"><span className="font-semibold">Jane Smith</span> opened a pull request</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AB
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800"><span className="font-semibold">Alex Brown</span> completed a task</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
