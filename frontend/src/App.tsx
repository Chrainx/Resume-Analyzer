import { useState } from 'react'
import UploadCard from './components/uploadCard'
import JobDescriptionCard from './components/jobDescriptionCard'
import ResumeAnalysis from './components/ResumeAnalysis'
import MatchScore from './components/matchScore'
import Loader from './components/loader'

import { analyzeResume, computeMatch } from './utils/api'
import type { ResumeAnalysisResponse } from './types/resumeAnalysisResponse'
import type { MatchScoreResponse } from './types/matchJobScore'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null)
  const [score, setScore] = useState<MatchScoreResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)

    const analysis = await analyzeResume(file)
    setResult(analysis)

    setLoading(false)
  }

  const handleMatch = async () => {
    if (!file || !jobDesc) return

    const result = await computeMatch(file, jobDesc)
    setScore(result)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-10 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-center text-4xl font-bold text-blue-400">
          AI Resume Analyzer
        </h1>
        <UploadCard
          file={file}
          onFileChange={setFile}
          onAnalyze={handleAnalyze}
          disabled={loading}
        />
        <JobDescriptionCard
          jobDesc={jobDesc}
          setJobDesc={setJobDesc}
          onMatch={handleMatch}
          disabled={loading}
        />

        {loading && <Loader />}
        {result && <ResumeAnalysis result={result} />}
        {score && <MatchScore score={score} />}

        {(result || score) && (
          <button
            onClick={() => {
              setResult(null)
              setScore(null)
              setFile(null)
              setJobDesc('')
            }}
            className="w-full rounded-lg bg-red-500 p-3 font-semibold hover:bg-red-600"
          >
            Clear Results
          </button>
        )}
      </div>
    </div>
  )
}

export default App
