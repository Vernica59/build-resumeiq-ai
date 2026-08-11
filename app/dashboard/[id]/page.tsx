'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AnalysisDisplay } from '@/components/analysis-display';
import Link from 'next/link';

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [resumeName, setResumeName] = useState('');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const resumeId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && resumeId) {
      fetchAnalysis();
    }
  }, [user, resumeId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError('');

      // First try to get existing analysis
      const response = await fetch(`/api/resumes/analyze?id=${resumeId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        setLoading(false);
        return;
      }

      // If no analysis exists, create one
      await performAnalysis();
setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const performAnalysis = async () => {
    try {
      setAnalyzing(true);
      setError('');

      const response = await fetch('/api/resumes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setAnalysis(null);
    setError('');
    performAnalysis();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
              ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Resume Analysis</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600 text-lg">Analyzing your resume with AI...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a minute</p>
          </div>
        )}

        {analysis && !analyzing && (
          <AnalysisDisplay analysis={analysis} />
        )}

        {!analysis && !analyzing && !error && (
          <div className="text-center py-12">
            <button
              onClick={performAnalysis}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
            >
              Analyze Resume
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
