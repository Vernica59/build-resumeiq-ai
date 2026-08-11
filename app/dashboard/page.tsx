'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ResumeUpload } from '@/components/resume-upload';
import Link from 'next/link';

interface Resume {
  id: string;
  fileName: string;
  originalName: string;
  uploadedAt: string;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (!response.ok) throw new Error('Failed to fetch resumes');
      const data = await response.json();
      setResumes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (resume: Resume) => {
    setResumes([resume, ...resumes]);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes?id=${resumeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      setResumes(resumes.filter((r) => r.id !== resumeId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">ResumeIQ AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 font-medium">Welcome, <span className="font-bold">{user?.name}</span></span>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Upload Your Resume</h2>
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Resumes List */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Your Resumes</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 rounded-lg text-red-800 font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-blue-600"></div>
              <p className="mt-3 text-slate-700 font-medium text-lg">Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <p className="text-center text-slate-700 py-12 font-medium text-lg">No resumes uploaded yet. Upload one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 transition bg-gradient-to-br from-blue-50 to-white"
                >
                  <h3 className="font-bold text-blue-900 truncate mb-2 text-lg">
                    {resume.originalName}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 font-medium">
                    Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/dashboard/${resume.id}`}
                    className="inline-block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition mb-3 shadow-md"
                  >
                    View Analysis
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition text-sm border border-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
