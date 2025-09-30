import dayjs from "dayjs";

import type { Campaign } from "../types/campaign";

interface CampaignTableProps {
  campaigns: Campaign[];
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-800",
  running: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700"
};

const CampaignTable = ({ campaigns }: CampaignTableProps) => {
  if (!campaigns.length) {
    return <p className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">No campaigns yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Scheduled</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Content</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{campaign.title}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {dayjs(campaign.scheduled_time).format("MMM D, YYYY h:mm A")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${statusStyles[campaign.status] || "bg-slate-200 text-slate-600"}`}>
                  {campaign.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{campaign.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
