"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Field, TextField } from "./auth-fields";
import { actions, useStore, type Company } from "@/lib/store";

function Form({ initial }: { initial: Company }) {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "").trim();
    if (!name) {
      setError("Company name is required.");
      return;
    }
    setError("");
    actions.setCompany({
      name,
      industry: String(d.get("industry") ?? ""),
      location: String(d.get("location") ?? ""),
      description: String(d.get("description") ?? ""),
    });
    toast.success("Company profile saved");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <TextField label="Company name *" name="name" defaultValue={initial.name} error={error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Industry focus" name="industry" defaultValue={initial.industry} />
        <TextField label="Location" name="location" defaultValue={initial.location} />
      </div>
      <Field label="Description" name="description">
        <Textarea id="description" name="description" rows={6} defaultValue={initial.description} className="px-3.5 py-3 text-sm leading-relaxed" />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" variant="gold" className="h-10 min-w-40 font-bold">Save changes</Button>
      </div>
    </form>
  );
}

export function CompanyForm() {
  const { company } = useStore();
  const initials = company.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Company profile</h1>
        <p className="text-sm text-muted-foreground">Updates here also appear in the mobile app.</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="size-14 rounded-xl after:rounded-xl">
            <AvatarFallback className="rounded-xl bg-secondary ring-1 ring-gold/25 text-lg font-bold text-gold">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">{company.name}</CardTitle>
            <CardDescription>{company.industry} · {company.location}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* key remounts the form with fresh defaults once stored data hydrates */}
          <Form key={company.name + company.location + company.industry} initial={company} />
        </CardContent>
      </Card>
    </div>
  );
}
