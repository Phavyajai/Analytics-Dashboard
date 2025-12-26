import CallAnalyticsChart from "./components/CallAnalyticsChart";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Voice Agent Analytics
        </h1>

        <CallAnalyticsChart />
      </div>
    </div>
  );
}
