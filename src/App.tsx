import { useState } from "react";
import CallAnalyticsChart, {
  type ChartData,
} from "./components/CallAnalyticsChart";
import { supabase } from "./lib/supabase";

const defaultData: ChartData[] = [
  { day: "Mon", calls: 120 },
  { day: "Tue", calls: 200 },
  { day: "Wed", calls: 150 },
  { day: "Thu", calls: 280 },
  { day: "Fri", calls: 220 },
  { day: "Sat", calls: 90 },
  { day: "Sun", calls: 60 },
];

export default function App() {
  const [chartData, setChartData] = useState(defaultData);

  const [email, setEmail] = useState("");
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const handleSaveToSupabase = async () => {
    if (!email) {
      alert("Email is required");
      return;
    }

    const { data: existing } = await supabase
      .from("chart_data")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      const overwrite = window.confirm(
        "Data already exists for this email. Overwrite?"
      );
      if (!overwrite) return;
    }

    const { error } = await supabase.from("chart_data").upsert(
  {
    email,
    values: chartData,
  },
  {
    onConflict: "email",
  }
);


    if (error) {
      alert("Error saving data");
    } else {
      alert("Data saved successfully");
      setShowEmailPrompt(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1️⃣ Title */}
        <h1 className="text-3xl font-bold">
          Voice Agent Analytics
        </h1>

        {/* 2️⃣ Chart */}
        <CallAnalyticsChart data={chartData} />

        {/* 3️⃣ Edit Inputs */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="font-semibold">Edit Call Values</h3>

          {chartData.map((item, index) => (
            <div key={item.day} className="flex items-center gap-2">
              <span className="w-12">{item.day}</span>
              <input
                type="number"
                className="border p-1 w-24"
                value={item.calls}
                onChange={(e) => {
                  const updated = [...chartData];
                  updated[index] = {
                    ...item,
                    calls: Number(e.target.value),
                  };
                  setChartData(updated);
                }}
              />
            </div>
          ))}
        </div>

        {/* 4️⃣ SAVE BUTTON */}
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => setShowEmailPrompt(true)}
        >
          Save Changes
        </button>

        {/* 5️⃣ EMAIL PROMPT */}
        {showEmailPrompt && (
          <div className="bg-white p-4 rounded shadow space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleSaveToSupabase} 
            >
              Confirm Save
            </button>
          </div>
        )}

        {/* ✅ 6️⃣ LOAD SAVED DATA BUTTON (PUT YOUR CODE HERE) */}
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded"
          onClick={async () => {
            if (!email) {
              alert("Enter email first");
              return;
            }

            const { data } = await supabase
              .from("chart_data")
              .select("values")
              .eq("email", email)
              .single();

            if (data) {
              setChartData(data.values);
            } else {
              alert("No saved data found");
            }
          }}
        >
          Load Saved Data
        </button>

      </div>
    </div>
  );
}
