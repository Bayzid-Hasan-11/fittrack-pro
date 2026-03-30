"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function FitTrackPro() {
  const [weight, setWeight] = useState(85);
  const [target, setTarget] = useState(70);
  const [history, setHistory] = useState([
    { date: "Mar 24", weight: 87 },
    { date: "Mar 26", weight: 86.2 },
    { date: "Mar 31", weight: 85 },
  ]);

  // BMI Logic
  const height = 170; // cm
  const bmi = (weight / (height / 100) ** 2).toFixed(1);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-green-400">
          FITTRACK PRO
        </h1>
        <div className="bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 text-sm">
          BMI: <span className="font-bold text-blue-400">{bmi}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                  Progress Trend
                </p>
                <h2 className="text-3xl font-bold">Weight Journey</h2>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <TrendingDown size={18} /> -2.0kg
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#4ade80" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#4ade80"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#4ade80" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meal Plan Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-green-400">
                <Utensils size={18} /> Meal Checklist
              </h3>
              <div className="space-y-3">
                {[
                  "Warm Lemon Water",
                  "2 Eggs + 1 Fruit",
                  "Fish/Chicken + 1/2 Rice",
                  "Green Tea + Peanuts",
                ].map((meal) => (
                  <div
                    key={meal}
                    className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800"
                  >
                    <Circle className="text-zinc-600" size={20} />
                    <span className="text-sm">{meal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-400">
                <Flame size={18} /> Workout Plan
              </h3>
              <div className="space-y-3 text-sm text-zinc-400">
                <p>• 15 Min Spot Jogging</p>
                <p>• 3x15 Pushups (No Gym Needed)</p>
                <p>• 3x20 Squats</p>
                <p>• 30 Sec Plank (3 sets)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Stats */}
        <div className="space-y-6">
          <div className="bg-green-400 text-black p-6 rounded-3xl">
            <Target className="mb-2" size={32} />
            <h3 className="font-black text-xl leading-tight">
              Target:
              <br />
              {target} kg
            </h3>
            <p className="mt-2 text-sm font-medium opacity-80">
              Remaining: {(weight - target).toFixed(1)}kg
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
            <h3 className="font-bold mb-4">Log New Weight</h3>
            <input
              type="number"
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl mb-4 text-2xl font-bold"
              placeholder="00.0"
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <button className="w-full bg-zinc-100 text-black font-bold py-4 rounded-xl hover:bg-white transition-colors">
              Update Stats
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
