import { Translations } from "@/data/translations/types";
import {
  Building2,
  Star,
  Briefcase,
  FileCheck,
  UserCheck,
  Calculator,
  BookOpen,
  MessageSquareCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavChildItem {
  id: string;
  title: (t: Translations) => string;
  desc?: (t: Translations) => string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
}

export interface NavItem {
  id: string;
  title: (t: Translations) => string;
  href: string;
  type?: "link" | "dropdown" | "mega";
  children?: NavChildItem[];
}

/**
 * Hem üst menü (Navbar) hem de alt menü (Footer) tarafından ortak kullanılan dinamik navigasyon yapısı.
 * Buraya yeni bir sayfa veya alt grup eklendiğinde hem Navbar hem de Footer otomatik olarak güncellenir.
 */
export const navigationConfig: NavItem[] = [
  {
    id: "home",
    title: (t) => t.nav.home,
    href: "/",
    type: "link",
  },
  {
    id: "kurumsal",
    title: (t) => t.nav.corporate,
    href: "/kurumsal",
    type: "dropdown",
    children: [
      {
        id: "about",
        title: (t) => t.nav.aboutUs,
        desc: (t) => t.nav.aboutUsDesc,
        href: "/kurumsal",
        icon: Building2,
      },
      {
        id: "why-us",
        title: (t) => t.nav.whyUs,
        desc: (t) => t.nav.whyUsDesc,
        href: "/kurumsal#neden-biz",
        icon: Star,
      },
      {
        id: "team",
        title: (t) => t.nav.team,
        desc: (t) => t.nav.teamDesc,
        href: "/kurumsal#ekip",
        icon: Briefcase,
      },
      {
        id: "certificates",
        title: (t) => t.nav.qualityCertificates,
        desc: (t) => t.nav.qualityCertificatesDesc,
        href: "/belgeler",
        icon: FileCheck,
      },
      {
        id: "career",
        title: (t) => t.nav.career || "Kariyer & İK",
        desc: (t) => t.nav.careerDesc || "Kariyer fırsatları & iş başvurusu",
        href: "/kariyer",
        icon: UserCheck,
      },
    ],
  },
  {
    id: "services",
    title: (t) => t.nav.services,
    href: "/hizmetlerimiz",
    type: "mega",
    children: [
      {
        id: "ithalat",
        title: (t) => t.services.import.title,
        desc: (t) => t.services.import.desc,
        href: "/hizmetlerimiz/ithalat",
      },
      {
        id: "ihracat",
        title: (t) => t.services.export.title,
        desc: (t) => t.services.export.desc,
        href: "/hizmetlerimiz/ihracat",
      },
      {
        id: "dir",
        title: (t) => t.services.dir.title,
        desc: (t) => t.services.dir.desc,
        href: "/hizmetlerimiz/dahilde-isleme",
      },
      {
        id: "haricte",
        title: (t) => t.services.haricte.title,
        desc: (t) => t.services.haricte.desc,
        href: "/hizmetlerimiz/haricte-isleme",
      },
      {
        id: "antrepo",
        title: (t) => t.services.antrepo.title,
        desc: (t) => t.services.antrepo.desc,
        href: "/hizmetlerimiz/antrepo",
      },
      {
        id: "transit",
        title: (t) => t.services.transit.title,
        desc: (t) => t.services.transit.desc,
        href: "/hizmetlerimiz/transit",
      },
      {
        id: "serbest-bolge",
        title: (t) => t.services.serbestBolge.title,
        desc: (t) => t.services.serbestBolge.desc,
        href: "/hizmetlerimiz/serbest-bolge",
      },
      {
        id: "danismanlik",
        title: (t) => t.services.danismanlik.title,
        desc: (t) => t.services.danismanlik.desc,
        href: "/hizmetlerimiz/danismanlik",
      },
      {
        id: "hukuk",
        title: (t) => t.services.hukuk.title,
        desc: (t) => t.services.hukuk.desc,
        href: "/hizmetlerimiz/hukuk",
      },
      {
        id: "sigorta",
        title: (t) => t.services.sigorta.title,
        desc: (t) => t.services.sigorta.desc,
        href: "/hizmetlerimiz/sigorta",
      },
    ],
  },
  {
    id: "tools",
    title: (t) => t.nav.toolsMenu,
    href: "/araclar",
    type: "dropdown",
    children: [
      {
        id: "tools-desk",
        title: (t) => t.nav.toolsDesk,
        desc: (t) => t.nav.toolsDeskDesc,
        href: "/araclar",
        icon: Calculator,
      },
      {
        id: "circulars",
        title: (t) => t.nav.circularsBulletins,
        desc: (t) => t.nav.circularsBulletinsDesc,
        href: "/sirkuler",
        icon: BookOpen,
      },
      {
        id: "degerlendirme",
        title: (t) => t.nav.evaluation || "Müşteri Değerlendirme & Anket",
        desc: (t) => t.nav.evaluationDesc || "Hizmet kalitesi ve memnuniyet anketi",
        href: "/degerlendirme",
        icon: MessageSquareCheck,
      },
    ],
  },
  {
    id: "contact",
    title: (t) => t.nav.contact,
    href: "/iletisim",
    type: "link",
  },
];
