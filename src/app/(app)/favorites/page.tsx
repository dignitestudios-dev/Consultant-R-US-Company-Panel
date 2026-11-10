import type { Metadata } from "next";
import { ConsultantBrowser } from "@/components/consultant-browser";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return <ConsultantBrowser mode="favorites" />;
}
