"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CheckCircle2,
  Circle,
  Flame,
  Target,
  TrendingDown,
  Utensils,
  Scale,
  Activity,
  Info,
  RefreshCcw,
} from "lucide-react";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function FitTrackPro() {
  const [weight, setWeight] = useState<number>(0);
  const [inputWeight, setInputWeight] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User Profile (Replace with your data or add a settings form)
  const height = 170; // cm
  const targetWeight = 70; // kg

  // Fetch Data on Load
  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setHistory(
        data.map((d) => ({
          date: new Date(d.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
          weight: d.weight,
        })),
      );
      if (data.length > 0) setWeight(data[data.length - 1].weight);
    }
    setLoading(false);
  }

  async function handleUpdate() {
    const newW = parseFloat(inputWeight);
    if (!newW) return alert("Enter a valid weight");

    const { error } = await supabase
      .from("logs")
      .insert([{ weight: newW, created_at: new Date() }]);

    if (error) {
      alert("Error syncing: " + error.message);
    } else {
      setInputWeight("");
      fetchLogs();
    }
  }

  const bmi = weight > 0 ? (weight / (height / 100) ** 2).toFixed(1) : "0";
  const remaining = weight > 0 ? (weight - targetWeight).toFixed(1) : "0";

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-8 selection:bg-green-500/30">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-green-400 italic">
              FITTRACK<span className="text-white">.PRO</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
              Personal Progress Engine
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:rotate-180 transition-transform duration-500"
          >
            <RefreshCcw size={18} className="text-green-400" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* STAT CARDS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Scale size={16} />{" "}
                  <span className="text-xs font-bold uppercase">Current</span>
                </div>
                <div className="text-3xl font-black">
                  {weight || "—"}{" "}
                  <span className="text-sm font-normal text-zinc-500">kg</span>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Activity size={16} />{" "}
                  <span className="text-xs font-bold uppercase">BMI Score</span>
                </div>
                <div className="text-3xl font-black text-blue-400">{bmi}</div>
              </div>
              <div className="bg-green-400 text-black p-5 rounded-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} />{" "}
                  <span className="text-xs font-bold uppercase">To Goal</span>
                </div>
                <div className="text-3xl font-black">
                  {remaining}{" "}
                  <span className="text-sm font-normal opacity-70">kg</span>
                </div>
              </div>
            </div>

            {/* PROGRESS CHART */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 h-[350px]">
              <h3 className="text-sm font-bold text-zinc-500 uppercase mb-6 flex items-center gap-2">
                <TrendingDown size={16} className="text-green-400" /> Weight
                Analytics
              </h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#18181b"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#52525b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#09090b",
                        border: "1px solid #27272a",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="step"
                      dataKey="weight"
                      stroke="#4ade80"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#4ade80" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MEAL PLAN CHECKLIST */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Utensils size={18} className="text-green-400" /> Daily
                Nutrition Log
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { m: "Warm Lemon Water", d: "Early Morning" },
                  { m: "2 Eggs + 1 Fruit", d: "Breakfast" },
                  { m: "Rice (1/2) + Fish/Chicken", d: "Lunch" },
                  { m: "Green Tea + Peanuts", d: "Evening" },
                  { m: "No Rice + Chicken/Fish", d: "Dinner" },
                  { m: "2L Water Completed", d: "Hydration" },
                ].map((item) => (
                  <div
                    key={item.m}
                    className="group flex items-center gap-4 p-4 bg-black/40 border border-zinc-800/50 rounded-2xl hover:border-green-500/50 transition-all cursor-pointer"
                  >
                    <Circle
                      className="text-zinc-700 group-hover:text-green-400"
                      size={20}
                    />
                    <div>
                      <div className="text-sm font-medium">{item.m}</div>
                      <div className="text-[10px] uppercase text-zinc-500 font-bold">
                        {item.d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR: UPDATES & EXERCISES */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
              <h3 className="font-bold mb-4">Log Today's Progress</h3>
              <div className="relative">
                <input
                  type="number"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-2xl font-black text-green-400 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="00.0"
                />
                <span className="absolute right-5 top-6 text-zinc-600 font-bold">
                  KG
                </span>
              </div>
              <button
                onClick={handleUpdate}
                className="w-full bg-zinc-100 text-black font-bold py-4 rounded-2xl mt-4 hover:bg-white active:scale-[0.98] transition-all"
              >
                Sync to Cloud
              </button>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
                <Flame size={18} /> Home Workout
              </h3>
              <div className="space-y-4">
                {[
                  { n: "Spot Jogging", q: "12 Minutes" },
                  { n: "Pushups", q: "3 Sets x 12" },
                  { n: "Squats", q: "3 Sets x 20" },
                  { n: "Plank Hold", q: "60 Seconds" },
                ].map((ex) => (
                  <div
                    key={ex.n}
                    className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2"
                  >
                    <span className="text-zinc-300">{ex.n}</span>
                    <span className="font-bold text-zinc-500">{ex.q}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-blue-500/60 mt-4 uppercase font-bold tracking-widest text-center">
                No Gym Required
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Force Deployment Build: 2026-03-31
