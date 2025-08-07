"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { toast } from "react-hot-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UserDashboardPage = () => {
  const { user } = useUser();
  if (!user) return null;
  const [stats, setStats] = useState({
    totalVoters: 12,
    totalInstitutions: 10,
    totalCandidates: 12,
    totalElections: 120,
  });
  const pieData = [
    { name: "Voters", value: stats.totalVoters },
    { name: "Institutions", value: stats.totalInstitutions },
    { name: "Candidates", value: stats.totalCandidates },
    { name: "Elections", value: stats.totalElections },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      await axios.get("/api/dashboard").then((res) => {
        console.log(res.data);
        setStats({
          totalVoters: res.data.totalVoters,
          totalInstitutions: res.data.totalInstitutions,
          totalCandidates: res.data.totalCandidates,
          totalElections: res.data.totalElections,
        });
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        Welcome, {user?.name}!
      </h1>
      <div className="mt-8">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Elections Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
