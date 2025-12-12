import type { ResumeAnalysisResponse } from '../types/resumeAnalysisResponse'

export default function ResumeAnalysis({
  result,
}: {
  result: ResumeAnalysisResponse
}) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Resume Analysis</h2>

      <p>
        <strong>Skills Detected:</strong> {result.skills_detected.join(', ')}
      </p>

      <div className="mt-4 space-y-4">
        {Object.entries(result.semantic_sections).map(([section, text]) => (
          <div key={section}>
            <h3 className="text-xl font-semibold text-blue-300">
              {section.toUpperCase()}
            </h3>
            <p className="whitespace-pre-wrap text-gray-300">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
