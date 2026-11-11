import { fetchBackendNoStore } from "./api";

export interface DocumentItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  isPublic?: boolean;
  createdAt?: string | null;
}

export async function getDocumentsAsync(): Promise<DocumentItem[]> {
  try {
    const res = await fetchBackendNoStore("/api/documents");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.documents)) {
        return data.documents;
      }
    }
  } catch (error) {
    console.error("[getDocumentsAsync] Backend fetch failed:", error);
  }
  return [];
}
