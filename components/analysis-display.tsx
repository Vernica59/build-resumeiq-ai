'use client';

interface AnalysisDisplayProps {
  analysis: any;
  loading?: boolean;
}

export function AnalysisDisplay({
  analysis,
  loading,
}: AnalysisDisplayProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-24 bg-gray-200 rounded-lg" />
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!analysis) return null;

  const strengths = analysis.strengths || [];
  const improvements = analysis.improvements || [];
  const keywords = analysis.keywords || [];

  const suggestions =
    analysis.suggestions || [
      "Tailor your resume for every job application.",
      "Use measurable achievements with numbers.",
      "Add more technical skills relevant to your field.",
      "Keep formatting clean and ATS-friendly.",
      "Proofread your resume before submitting.",
    ];

  const summary =
    analysis.summary ||
    "Your resume has been analyzed successfully. Below are the strengths, improvements and recommendations to improve your ATS score.";

  const scoreColor =
    analysis.score >= 80
      ? "text-green-600"
      : analysis.score >= 60
      ? "text-yellow-600"
      : "text-red-600";

  const scoreBg =
    analysis.score >= 80
      ? "bg-green-50"
      : analysis.score >= 60
      ? "bg-yellow-50"
      : "bg-red-50";

  return (
    <div className="space-y-6">

      {/* Overall Score */}
      <div
        className={`${scoreBg} rounded-xl border-l-4 ${scoreColor.replace(
          "text-",
          "border-"
        )} p-6`}
      >
        <div className="flex justify-between items-center">

          <div>
            <h3 className="text-gray-700 font-semibold mb-2">
              Overall Score
            </h3>

            <h1 className={`text-5xl font-bold ${scoreColor}`}>
              {analysis.score}/100
            </h1>
          </div>

          <div
            className="w-28 h-28 rounded-full border-4 flex items-center justify-center"
            style={{
              borderColor:
                analysis.score >= 80
                  ? "#16a34a"
                  : analysis.score >= 60
                  ? "#ca8a04"
                  : "#dc2626",
            }}
          >
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {analysis.score}%
            </span>
          </div>

        </div>
      </div>

      {/* Summary */}

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Resume Summary
        </h2>

        <p className="text-gray-700 leading-8">{summary}</p>
      </div>

      {/* Strengths */}

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          Resume Strengths
        </h2>

        <div className="space-y-3">
          {strengths.length > 0 ? (
            strengths.map((item: string, index: number) => (
              <div
                key={index}
                className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4"
              >
                <p className="text-gray-700">{item}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">
              No strengths detected yet.
            </p>
          )}
        </div>
      </div>

      {/* Improvements */}

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          Areas for Improvement
        </h2>

        <div className="space-y-3">
          {improvements.length > 0 ? (
            improvements.map((item: string, index: number) => (
              <div
                key={index}
                className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4"
              >
                <p className="text-gray-700">{item}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">
              No improvements suggested.
            </p>
          )}
        </div>
      </div>

      {/* Keywords */}

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          Key Skills & Keywords
        </h2>

        <div className="flex flex-wrap gap-3">
          {keywords.length > 0 ? (
            keywords.map((item: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-gray-700">
              No keywords detected.
            </p>
          )}
        </div>
      </div>

      {/* AI Recommendations */}

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          AI Recommendations
        </h2>

        <div className="space-y-3">
          {suggestions.map((item: string, index: number) => (
            <div
              key={index}
              className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4"
            >
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter Tips */}

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          Recruiter Tips
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
          <li>Use action verbs such as Developed, Designed, Implemented and Led.</li>
          <li>Add measurable achievements using percentages or numbers.</li>
          <li>Customize your resume for every job description.</li>
          <li>Include internships, projects and certifications.</li>
          <li>Keep formatting consistent and ATS friendly.</li>
          <li>Include GitHub, LinkedIn and Portfolio links.</li>
          <li>Avoid grammatical and spelling mistakes.</li>
        </ul>
      </div>

    </div>
  );
}