import { getCurrentUser } from '@/lib/auth';
import { getResume, extractTextFromPDF, saveAnalysis, getAnalysis } from '@/lib/resume';
import { analyzeResume } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { resumeId } = await request.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID required' },
        { status: 400 }
      );
    }

    // Check if analysis already exists
    const existingAnalysis = await getAnalysis(resumeId, user.id);
    if (existingAnalysis) {
      return NextResponse.json(existingAnalysis);
    }

    // Get resume file
    const resumeData = await getResume(resumeId, user.id);
    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(resumeData.data);

    // Analyze with AI
    const analysis = await analyzeResume(resumeText); 
    console.log("ANALYSIS RESULT:", analysis);

    // Save analysis
    const savedAnalysis = await saveAnalysis(resumeId, user.id, {
      content: resumeText,
      score: analysis.score,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      keywords: analysis.keywords,
      userId: user.id,
      resumeId,
    });
    console.log("SAVED ANALYSIS:", savedAnalysis);

       return NextResponse.json({
  ...savedAnalysis,
  summary: analysis.summary,
  suggestions: analysis.suggestions,
  atsBreakdown: analysis.atsBreakdown,
});
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID required' },
        { status: 400 }
      );
    }

    const analysis = await getAnalysis(resumeId, user.id);
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}
