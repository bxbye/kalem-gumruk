import { fetchBackendNoStore } from "./api";

export interface FeedbackItem {
  id: string;
  fullName: string;
  company?: string | null;
  rating: number;
  serviceType?: string | null;
  comment: string;
  isApproved?: boolean;
  createdAt: string;
}

export async function getApprovedFeedbacksAsync(): Promise<FeedbackItem[]> {
  try {
    const res = await fetchBackendNoStore("/api/feedbacks?approvedOnly=true");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.feedbacks)) {
        return data.feedbacks;
      }
    }
  } catch (error) {
    console.error("[getApprovedFeedbacksAsync] Backend fetch failed:", error);
  }
  return [];
}
