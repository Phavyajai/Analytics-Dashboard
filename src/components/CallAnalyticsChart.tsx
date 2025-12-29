import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TIME_LABELS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
];

type Props = {
  data: number[];
  onEdit: () => void;
};

export default function CallAnalyticsChart({ data, onEdit }: Props) {
  const chartData = TIME_LABELS.map((label, index) => ({
    time: label,
    duration: data[index],
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            Average Call Duration
          </h2>
          <p className="text-sm text-gray-500">
            Duration in seconds (per 30-minute interval)
          </p>
        </div>

        <button
          onClick={onEdit}
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          Edit analytics values
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis
              label={{
                value: "Seconds",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="duration" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}