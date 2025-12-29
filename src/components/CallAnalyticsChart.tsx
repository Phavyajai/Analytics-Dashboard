import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: number[];
  onEdit: () => void;
}

const labels = ["Jan", "Feb", "Mar", "Apr"];

export default function CallAnalyticsChart({ data, onEdit }: Props) {
  const chartData = labels.map((label, i) => ({
    month: label,
    value: data[i],
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Monthly Call Analytics
        </h2>

        <button
          onClick={onEdit}
          className="text-sm text-indigo-600 hover:underline"
        >
          Edit chart values
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
