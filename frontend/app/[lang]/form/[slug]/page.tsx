import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicFormClient from "@/components/DynamicFormClient";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5001";

async function getFormData(slug: string) {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/forms/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !data.form) return null;
    return data.form;
  } catch (error) {
    console.error("[Form Fetch Error]:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const form = await getFormData(slug);

  if (!form) {
    return {
      title: "Form Bulunamadı | Kalem Gümrük Müşavirliği",
    };
  }

  return {
    title: `${form.title} | Kalem Gümrük Müşavirliği`,
    description: form.description || "Kalem Gümrük Müşavirliği resmi başvuru ve talep formu.",
  };
}

export default async function FormPage({ params }: Props) {
  const { lang, slug } = await params;
  const form = await getFormData(slug);

  if (!form) {
    notFound();
  }

  return <DynamicFormClient form={form} lang={lang || "tr"} />;
}
