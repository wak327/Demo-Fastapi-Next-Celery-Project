import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CampaignForm from "../components/CampaignForm";
import CampaignTable from "../components/CampaignTable";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import apiClient from "../lib/api";
import type { Campaign } from "../types/campaign";

const DashboardPage = () => {
  const router = useRouter();
  const { token, loading, logout } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCampaigns = async () => {
    if (!token) return;
    setRefreshing(true);
    setError(null);
    try {
      const response = await apiClient.get<Campaign[]>("/campaigns/");
      setCampaigns(response.data);
    } catch (err) {
      setError((err as Error).message || "Failed to load campaigns");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (!token) return;
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreateCampaign = async (data: { title: string; content: string; scheduled_time: string }) => {
    if (!token) {
      throw new Error("You must be logged in");
    }
    const scheduleISO = new Date(data.scheduled_time).toISOString();
    await apiClient.post("/campaigns/", {
      title: data.title,
      content: data.content,
      scheduled_time: scheduleISO
    });
    await fetchCampaigns();
  };

  if (loading) {
    return <Layout title="Dashboard">Loading...</Layout>;
  }

  if (!token) {
    return null;
  }

  return (
    <Layout title="Dashboard">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Campaign Dashboard</h1>
        <button
          onClick={logout}
          className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
        >
          Log out
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <CampaignForm onSubmit={handleCreateCampaign} />

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-700">Your campaigns</h2>
          <button
            onClick={fetchCampaigns}
            disabled={refreshing}
            className="rounded bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <CampaignTable campaigns={campaigns} />
      </div>
    </Layout>
  );
};

export default DashboardPage;
