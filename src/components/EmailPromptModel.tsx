interface Props {
  email: string;
  setEmail: (e: string) => void;
  onConfirm: () => void;
}

export default function EmailPromptModal({
  email,
  setEmail,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="font-semibold mb-2">
          Save your analytics
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Enter your email to store and retrieve your chart data.
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={onConfirm}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
