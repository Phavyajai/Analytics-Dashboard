interface Props {
  previousValues: number[];
  email: string;
  onOverwrite: () => void;
  onCancel: () => void;
}

export default function OverwriteConfirmModal({
  previousValues,
  email,
  onOverwrite,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="font-semibold mb-3">
          Overwrite existing data?
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          We found saved values for <b>{email}</b>
        </p>

        <div className="bg-gray-50 p-3 rounded text-sm mb-4">
          {previousValues.map((v, i) => (
            <div key={i}>
              Month {i + 1}: {v}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onOverwrite}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Overwrite
          </button>
        </div>
      </div>
    </div>
  );
}
