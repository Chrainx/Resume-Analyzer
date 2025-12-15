interface Props {
  file: File | null
  onFileChange: (file: File | null) => void
  onAnalyze: () => void
  disabled?: boolean
}

export default function UploadCard({
  file,
  onFileChange,
  onAnalyze,
  disabled,
}: Props) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <label className="mb-2 block text-lg font-semibold">
        Upload Resume PDF
      </label>

      <input
        id="resumeInput"
        type="file"
        accept="application/pdf"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      <label
        htmlFor="resumeInput"
        className={`block w-full cursor-pointer rounded-lg bg-gray-700 p-3 text-center font-semibold hover:bg-gray-600 ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
      >
        {file ? 'Change File' : 'Upload Resume'}
      </label>

      {file && (
        <p className="mt-2 text-sm text-gray-300">
          Uploaded File: <span className="font-semibold">{file.name}</span>
        </p>
      )}

      <button
        onClick={onAnalyze}
        className="mt-4 w-full rounded-lg bg-blue-500 p-3 font-semibold hover:bg-blue-600 disabled:opacity-40"
        disabled={disabled}
      >
        Analyze Resume
      </button>
    </div>
  )
}
