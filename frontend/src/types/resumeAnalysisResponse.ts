export interface ResumeAnalysisResponse {
  filename: string;
  semantic_sections: Record<string, string>;
  skills_detected: string[];
  text_preview: string;
}
