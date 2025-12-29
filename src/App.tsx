import { useEffect, useState } from "react";
import CallAnalyticsChart from "./components/CallAnalyticsChart";
import EditChartModal from "./components/EditChartModel";
import EmailPromptModal from "./components/EmailPromptModel";
import OverwriteConfirmModal from "./components/OverwriteConfirmModel";
import { supabase } from "./lib/supabase";

/* -------------------------
   Constants
--------------------------*/
const DEFAULT_VALUES = [120, 180, 150, 210];

const STORAGE_EMAIL_KEY = "active_email";
const STORAGE_LAST_SAVED_KEY = "last_saved_at";

/* -------------------------
   App Component
--------------------------*/
export default function App() {
  /* Chart state */
  const [chartData, setChartData] = useState<number[]>(DEFAULT_VALUES);
  const [tempData, setTempData] = useState<number[]>(DEFAULT_VALUES);

  /* UI state */
  const [showEdit, setShowEdit] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showOverwrite, setShowOverwrite] = useState(false);

  /* User context */
  const [email, setEmail] = useState("");
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [previousValues, setPreviousValues] = useState<number[] | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  /* -------------------------
     Restore state on refresh
  --------------------------*/
  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_EMAIL_KEY);
    const storedSavedAt = localStorage.getItem(STORAGE_LAST_SAVED_KEY);

    if (!storedEmail) return;

    const loadSavedData = async () => {
      const { data } = await supabase
        .from("chart_data")
        .select("values")
        .eq("email", storedEmail)
        .maybeSingle();

      if (data?.values) {
        setChartData(data.values);
        setTempData(data.values);
        setActiveEmail(storedEmail);
        setEmail(storedEmail);
        setLastSavedAt(storedSavedAt);
      }
    };

    loadSavedData();
  }, []);

  /* -------------------------
     Edit → Save flow
  --------------------------*/
  const handleSaveFromEditor = () => {
    setShowEdit(false);
    setShowEmail(true);
  };

  const handleEmailConfirm = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }

    const { data } = await supabase
      .from("chart_data")
      .select("values")
      .eq("email", email)
      .maybeSingle();

    if (data?.values) {
      setPreviousValues(data.values);
      setShowEmail(false);
      setShowOverwrite(true);
    } else {
      saveToSupabase();
    }
  };

  const saveToSupabase = async () => {
    const now = new Date();

    await supabase
  .from("chart_data")
  .upsert(
    {
      email,
      values: tempData,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "email",
    }
  );


    setChartData(tempData);
    setActiveEmail(email);
    setLastSavedAt(now.toLocaleString());

    /* Persist across refresh */
    localStorage.setItem(STORAGE_EMAIL_KEY, email);
    localStorage.setItem(STORAGE_LAST_SAVED_KEY, now.toLocaleString());

    setShowEmail(false);
    setShowOverwrite(false);
    setPreviousValues(null);
  };

  /* -------------------------
     Render
  --------------------------*/
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Dashboard Header */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h1 className="text-2xl font-semibold">
            Analytics Dashboard
          </h1>

          <p className="text-sm text-gray-500 mb-3">
            Custom chart analytics with persisted user data
          </p>

          {activeEmail ? (
            <div className="text-sm">
              <div>
                <span className="font-medium">Viewing data for:</span>{" "}
                {activeEmail}
              </div>
              {lastSavedAt && (
                <div className="text-gray-500">
                  Last saved: {lastSavedAt}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              No user data loaded yet
            </div>
          )}
        </div>

        {/* Chart */}
        <CallAnalyticsChart
          data={chartData}
          onEdit={() => {
            setTempData(chartData);
            setShowEdit(true);
          }}
        />
      </div>

      {/* Modals */}
      {showEdit && (
        <EditChartModal
          values={tempData}
          onChange={setTempData}
          onSave={handleSaveFromEditor}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showEmail && (
        <EmailPromptModal
          email={email}
          setEmail={setEmail}
          onConfirm={handleEmailConfirm}
        />
      )}

      {showOverwrite && previousValues && (
        <OverwriteConfirmModal
          previousValues={previousValues}
          email={email}
          onOverwrite={saveToSupabase}
          onCancel={() => {
            setShowOverwrite(false);
            setPreviousValues(null);
          }}
        />
      )}
    </div>
  );
}
