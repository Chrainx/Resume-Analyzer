import { useState } from "react";

interface ResumeAnalysis {
  filename: string;
  semantic_sections: Record<string, string>;
  skills_detected: string[];
  text_preview: string;
}

interface MatchScore {
  match_score: number;
  job_description: string;
}


function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [score, setScore] = useState<MatchScore | null>(null);

  const uploadResume = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/analyze-resume", {
      method: "POST",
      body: formData,
    });

    setResult(await res.json());
  };

  const matchScore = async () => {
    if (!file || !jobDesc) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDesc);

    const res = await fetch("http://127.0.0.1:8000/match-job", {
      method: "POST",
      body: formData,
    });

    setScore(await res.json());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold text-center text-blue-400">
          AI Resume Analyzer
        </h1>

        {/* Upload Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <label className="block mb-2 text-lg font-semibold">Upload Resume PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full bg-gray-700 p-3 rounded"
          />

          <button
            onClick={uploadResume}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold"
          >
            Analyze Resume
          </button>
        </div>

        {/* Job Description */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <label className="block mb-2 text-lg font-semibold">Job Description</label>
          <textarea
            className="w-full bg-gray-700 p-3 rounded text-white"
            rows={6}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />

          <button
            onClick={matchScore}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 p-3 rounded-lg font-semibold"
          >
            Compute Match Score
          </button>
        </div>

        {/* Display Resume Analysis */}
        {result && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Resume Analysis</h2>

            <p><strong>Skills Detected:</strong> {result.skills_detected.join(", ")}</p>

            <div className="mt-4 space-y-4">
              {Object.entries(result.semantic_sections).map(([section, text]) => (
                <div key={section}>
                  <h3 className="text-xl font-semibold text-blue-300">
                    {section.toUpperCase()}
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match Score */}
        {score && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-3xl font-bold text-green-400">
              Match Score: {score.match_score}%
            </h2>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
