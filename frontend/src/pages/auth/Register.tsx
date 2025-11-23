import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import Layout from '../../components/Layout';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.LEARNER);
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      await register(name, email, password, role, headline || undefined, skillsArray.length > 0 ? skillsArray : undefined);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-400">Join cEd and start your journey</p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field w-full"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field w-full"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="input-field w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value={UserRole.LEARNER}>Learner</option>
                  <option value={UserRole.RECRUITER}>Recruiter</option>
                  <option value={UserRole.BUYER}>Buyer</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-300 mb-2">
                  Headline (optional)
                </label>
                <input
                  id="headline"
                  name="headline"
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g., Full-stack developer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                  Skills (comma-separated, optional)
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  className="input-field w-full"
                  placeholder="React, Node.js, TypeScript"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="font-medium text-accent-purple hover:text-purple-400">
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
