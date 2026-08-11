import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">ResumeIQ AI</h1>
          <Link
            href="/auth"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-bold text-blue-900 mb-6 leading-tight">
              Get AI-Powered Feedback on Your Resume
            </h2>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed font-medium">
              ResumeIQ AI uses advanced artificial intelligence to analyze your resume, provide actionable feedback, and help you stand out to recruiters.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg"
              >
                Start Free
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-l-4 border-blue-600">
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-600">
                <h3 className="font-bold text-blue-900 mb-2 text-lg">📊 Smart Analysis</h3>
                <p className="text-slate-700 font-medium">Get your resume scored and analyzed by AI</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-600">
                <h3 className="font-bold text-green-900 mb-2 text-lg">✨ Personalized Insights</h3>
                <p className="text-slate-700 font-medium">Receive targeted improvements for your profile</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-600">
                <h3 className="font-bold text-purple-900 mb-2 text-lg">🎯 Career Optimization</h3>
                <p className="text-slate-700 font-medium">Discover key skills and keywords to highlight</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-600">
                <h3 className="font-bold text-orange-900 mb-2 text-lg">💡 Actionable Suggestions</h3>
                <p className="text-slate-700 font-medium">Get specific recommendations to improve your resume</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-white mb-14">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-xl">Upload</h4>
              <p className="text-slate-700 font-medium text-base">Upload your resume in PDF format</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-xl">Analyze</h4>
              <p className="text-slate-700 font-medium text-base">Our AI analyzes your resume instantly</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-xl">Improve</h4>
              <p className="text-slate-700 font-medium text-base">Get personalized suggestions to improve</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-5">Ready to Improve Your Resume?</h3>
          <p className="text-blue-100 mb-10 text-lg font-medium">Join thousands of job seekers who&apos;ve improved their resumes with ResumeIQ AI</p>
          <Link
            href="/auth"
            className="inline-block px-10 py-4 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-lg transition shadow-lg text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        </div>
      </footer>
    </div>
  );
}
