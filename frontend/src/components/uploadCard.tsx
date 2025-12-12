interface Props {
  onFileChange: (file: File | null) => void
  onAnalyze: () => void
}

export default function UploadCard({ onFileChange, onAnalyze }: Props) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <label className="mb-2 block text-lg font-semibold">
        Upload Resume PDF
      </label>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="w-full rounded bg-gray-700 p-3"
      />

      <button
        onClick={onAnalyze}
        className="mt-4 w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-700"
      >
        Analyze Resume
      </button>
    </div>
  )
}
