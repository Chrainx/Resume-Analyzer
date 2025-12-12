import type { MatchScoreResponse } from '../types/matchJobScore'

export default function MatchScore({ score }: { score: MatchScoreResponse }) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 text-center shadow-lg">
      <h2 className="text-3xl font-bold text-green-400">
        Match Score: {score.match_score}%
      </h2>
    </div>
  )
}
