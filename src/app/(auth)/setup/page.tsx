"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, TextField } from "@/components/auth-fields";
import { actions, useStore } from "@/lib/store";

export default function SetupPage() {
  const router = useRouter();
  const { company } = useStore();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    actions.setCompany({
      industry: String(d.get("industry") ?? ""),
      location: String(d.get("location") ?? ""),
      description: String(d.get("description") ?? ""),
    });
    router.push("/consultants");
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 2 of 2</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Set up company profile</h2>
        <p className="text-sm text-muted-foreground">Tell consultants a little about {company.name}.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <TextField label="Industry focus" name="industry" defaultValue={company.industry} />
        <TextField label="Location" name="location" defaultValue={company.location} />
        <Field label="Description" name="description">
          <Textarea id="description" name="description" rows={5} defaultValue={company.description} className="px-3.5 py-3 text-sm" />
        </Field>
        <Button type="submit" variant="gold" className="h-11 w-full text-sm font-bold">Finish</Button>
      </form>
    </>
  );
}
