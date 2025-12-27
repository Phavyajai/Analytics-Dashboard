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
  const [emailError, setEmailError] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const handleSaveToSupabase = async () => {
    setEmailError("");
    setStatusMessage(null);

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    const { data: existing, error: checkError } = await supabase
      .from("chart_data")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing data:", checkError);
      setStatusMessage({ text: "Error checking existing data", type: "error" });
      return;
    }

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
      console.error("Error saving data:", error);
      setStatusMessage({ text: "Error saving data", type: "error" });
    } else {
      setStatusMessage({ text: `Data saved successfully for ${email}`, type: "success" });
    }
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLoadFromSupabase = async (targetEmail?: string) => {
    setEmailError("");
    setStatusMessage(null);

    const emailToUse = targetEmail ?? email;
    if (!emailToUse) {
      setEmailError("Enter email first");
      return;
    }

    if (!isValidEmail(emailToUse)) {
      setEmailError("Invalid email address");
      return;
    }

    const { data, error } = await supabase
      .from("chart_data")
      .select("values")
      .eq("email", emailToUse)
      .maybeSingle();

    if (error) {
      console.error("Error loading data:", error);
      setStatusMessage({ text: "Error loading data", type: "error" });
      return;
    }

    if (data?.values) {
      setChartData(data.values);
      setEmail(emailToUse);
      setStatusMessage({ text: `Loaded data for ${emailToUse}`, type: "success" });
    } else {
      setStatusMessage({ text: `No saved data exists for ${emailToUse}`, type: "error" });
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
          onClick={handleSaveToSupabase}
        >
          Save Changes
        </button>

        {/* 5️⃣ EMAIL INPUT & SAVE */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setStatusMessage(null);
            }}
          />

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleSaveToSupabase}
            >
              Confirm Save
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setEmail("")}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">Current email: <span className="font-medium">{email || "—"}</span></div>
        {emailError && <div className="text-sm text-red-600">{emailError}</div>}
        {statusMessage && (
          <div className={`text-sm ${statusMessage.type === "error" ? "text-red-600" : statusMessage.type === "success" ? "text-green-600" : "text-gray-600"}`}>
            {statusMessage.text}
          </div>
        )}

        {/* ✅ 6️⃣ LOAD SAVED DATA BUTTON */}
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded"
          onClick={async () => await handleLoadFromSupabase()}
        >
          Load Saved Data
        </button>

      </div>
    </div>
  );
}
