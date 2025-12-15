interface Props {
  jobDesc: string
  setJobDesc: (v: string) => void
  onMatch: () => void
  disabled?: boolean
}

export default function JobDescriptionCard({
  jobDesc,
  setJobDesc,
  onMatch,
  disabled,
}: Props) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <label className="mb-2 block text-lg font-semibold">
        Job Description
      </label>

      <textarea
        className="w-full rounded bg-gray-700 p-3 text-white"
        rows={6}
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        disabled={disabled}
      />

      <button
        onClick={onMatch}
        className="mt-4 w-full rounded-lg bg-green-600 p-3 font-semibold hover:bg-green-700"
        disabled={disabled}
      >
        Compute Match Score
      </button>
    </div>
  )
}
