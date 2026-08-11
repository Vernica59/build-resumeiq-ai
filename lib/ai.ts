export interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  suggestions: string[];

  atsBreakdown: {
    contact: number;
    education: number;
    experience: number;
    skills: number;
    projects: number;
    keywords: number;
  };
}
export async function analyzeResume(
  resumeText: string
): Promise<ResumeAnalysis> {
  const text = resumeText.toLowerCase();
  console.log("education:", text.includes("education"));
  console.log("experience:", text.includes("experience"));
  console.log("employment:", text.includes("employment"));
  console.log("work history:", text.includes("work history"));
  console.log("skills:", text.includes("skills"));
  console.log("projects:", text.includes("projects"));
  console.log("project:", text.includes("project"));

  let score = 0;
  let contactScore = 0;
  let educationScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  let projectsScore = 0;
  let keywordsScore = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const suggestions: string[] = [];

  // Contact information
  // Contact information
const hasEmail = /\S+@\S+\.\S+/.test(resumeText);
const hasPhone = /\d{10}/.test(resumeText.replace(/\D/g, ""));

contactScore = hasEmail && hasPhone ? 10 : hasEmail || hasPhone ? 5 : 0;

if (contactScore === 10) {
  strengths.push("Complete contact information found.");
} else {
  improvements.push("Add complete contact information.");
}

// Education
if (text.includes("education")) {
  educationScore = 8;
  strengths.push("Education section found.");
} else {
  improvements.push("Add an Education section.");
}

// Experience
if (
  text.includes("experience") ||
  text.includes("employment") ||
  text.includes("work history")
) {
  experienceScore = 16;
  strengths.push("Experience section found.");
} else {
  improvements.push("Add an Experience section.");
}

// Skills
if (
  text.includes("skills") ||
  text.includes("technical skills")
) {
  skillsScore = 18;
  strengths.push("Skills section found.");
} else {
  improvements.push("Add a Skills section.");
}

// Projects
if (
  text.includes("projects") ||
  text.includes("project")
) {
  projectsScore = 12;
  strengths.push("Projects section found.");
} else {
  improvements.push("Add a Projects section.");
}

// Certifications
if (
  text.includes("certifications") ||
  text.includes("certification")
) {
  strengths.push("Certifications section found.");
} else {
  improvements.push("Add a Certifications section.");
}

// Resume length
const words = resumeText.split(/\s+/).length;

if (words > 250) {
  strengths.push("Resume contains sufficient detail.");
} else {
  improvements.push("Resume appears too short.");
}

// Keywords
const keywordPool = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "node",
  "sql",
  "mysql",
  "mongodb",
  "html",
  "css",
  "machine learning",
  "ai",
  "data structures",
  "algorithms",
  "git",
  "github",
];

const keywords = keywordPool.filter((keyword) =>
  text.includes(keyword)
);

keywordsScore = Math.min(keywords.length * 3, 20);

if (keywords.length >= 5) {
  strengths.push("Good variety of technical skills.");
} else {
  improvements.push("Add more relevant technical skills and keywords.");
}

// Final Score
score =
  contactScore +
  educationScore +
  experienceScore +
  skillsScore +
  projectsScore +
  keywordsScore;
  // Cap score
  score = Math.min(score, 100);

  suggestions.push(
    "Quantify achievements using numbers and measurable results."
  );
  suggestions.push(
    "Tailor keywords to the specific job description."
  );
  suggestions.push(
    "Keep formatting clean and consistent."
  );

  return {
  score,
  summary:
    "Resume analyzed using local ATS-style scoring without external AI services.",
  strengths,
  improvements,
  keywords,
  suggestions,

  atsBreakdown: {
    contact: contactScore,
    education: educationScore,
    experience: experienceScore,
    skills: skillsScore,
    projects: projectsScore,
    keywords: keywordsScore,
  },
};
}