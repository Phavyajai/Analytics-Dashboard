interface Props {
  values: number[];
  onChange: (v: number[]) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function EditChartModal({
  values,
  onChange,
  onSave,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="font-semibold mb-4">
          Edit chart values
        </h3>

        {values.map((v, i) => (
          <input
            key={i}
            type="number"
            value={v}
            onChange={(e) => {
              const updated = [...values];
              updated[i] = Number(e.target.value);
              onChange(updated);
            }}
            className="border p-2 w-full mb-2 rounded"
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={onSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
