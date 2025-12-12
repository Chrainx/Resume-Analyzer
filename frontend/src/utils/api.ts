import type { ResumeAnalysisResponse } from "../types/resumeAnalysisResponse";
import type { MatchScoreResponse } from "../types/matchJobScore";

const API_URL = "http://127.0.0.1:8000";

export async function analyzeResume(file: File): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/analyze-resume`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to analyze resume");
  return res.json();
}

export async function computeMatch(
  file: File,
  jobDesc: string
): Promise<MatchScoreResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDesc);

  const res = await fetch(`${API_URL}/match-job`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to compute match score");
  return res.json();
}
