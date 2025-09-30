import { FormEvent, useState } from "react";

interface CampaignFormProps {
  onSubmit: (data: { title: string; content: string; scheduled_time: string }) => Promise<void>;
}

const CampaignForm = ({ onSubmit }: CampaignFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ title, content, scheduled_time: scheduledTime });
      setTitle("");
      setContent("");
      setScheduledTime("");
    } catch (err) {
      setError((err as Error).message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow">
      <div>
        <label className="block text-sm font-semibold text-slate-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700">Scheduled Time</label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isSubmitting ? "Scheduling..." : "Schedule Campaign"}
      </button>
    </form>
  );
};

export default CampaignForm;
