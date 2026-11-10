import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConsultantDetail } from "@/components/consultant-detail";
import { CONSULTANTS } from "@/lib/data";

export function generateStaticParams() {
  return CONSULTANTS.map((c) => ({ id: String(c.id) }));
}

const find = (id: string) => CONSULTANTS.find((c) => String(c.id) === id);

export async function generateMetadata(props: PageProps<"/consultants/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const person = find(id);
  return { title: person ? person.name : "Consultant not found" };
}

export default async function ConsultantPage(props: PageProps<"/consultants/[id]">) {
  const { id } = await props.params;
  const person = find(id);
  if (!person) notFound();
  return <ConsultantDetail person={person} />;
}
