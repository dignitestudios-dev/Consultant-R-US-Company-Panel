import type { Metadata } from "next";
import { ConsultantDetail } from "@/features/consultants/components/consultant-detail";

export const metadata: Metadata = { title: "Consultant" };

export default async function ConsultantPage(props: PageProps<"/consultants/[id]">) {
  const { id } = await props.params;
  return <ConsultantDetail id={id} />;
}
