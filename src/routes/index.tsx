import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, CircleDollarSign, Database,
  FileCheck2, FileText, Gauge, Landmark, LockKeyhole, Play, Plus, RefreshCw,
  Search, Server, ShieldCheck, Sparkles, Trash2, UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enterprise KRI Monitoring | VantageRisk" },
      { name: "description", content: "Monitor, create, and execute enterprise Key Risk Indicators across critical business domains." },
      { property: "og:title", content: "Enterprise KRI Monitoring | VantageRisk" },
      { property: "og:description", content: "A real-time enterprise platform for managing and processing Key Risk Indicators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KriPlatform,
});

type Screen = "scopes" | "dashboard" | "intake" | "execution";
type Kri = { id: string; name: string; category: string; risk: "High" | "Medium" | "Low"; threshold: string; executed: string; active: boolean };

const initialKris: Kri[] = [
  { id: "S2P-014", name: "PO Creation without PR Approval", category: "Procurement", risk: "High", threshold: "> 3% of POs", executed: "2h ago", active: true },
  { id: "S2P-021", name: "Duplicate Vendor Payments", category: "Payments", risk: "High", threshold: "> 0 incidents", executed: "5h ago", active: true },
  { id: "S2P-033", name: "Contract Price Variance Threshold", category: "Contracts", risk: "Medium", threshold: "> 5% variance", executed: "1d ago", active: true },
  { id: "S2P-047", name: "Late Payment Interest Exposure", category: "Compliance", risk: "Low", threshold: "< 1.2% AP", executed: "3d ago", active: true },
];

const scopes = [
  { title: "Order to Cash", code: "O2C", desc: "Revenue cycle, credit exposure and billing integrity.", count: 12, status: "Healthy", tone: "success", icon: CircleDollarSign },
  { title: "Source to Pay", code: "S2P", desc: "Procurement, vendor payments and contract compliance.", count: 14, status: "Watch", tone: "warning", icon: FileCheck2, active: true },
  { title: "Record to Report", code: "R2R", desc: "GL integrity, reconciliation and close accuracy.", count: 9, status: "Watch", tone: "warning", icon: Landmark },
  { title: "Privacy", code: "PRV", desc: "Data subject rights, consent and breach exposure.", count: 8, status: "Healthy", tone: "success", icon: LockKeyhole },
  { title: "Master Data", code: "MDM", desc: "Reference data quality, duplication and governance.", count: 5, status: "Critical", tone: "risk", icon: Database },
];

function KriPlatform() {
  const [screen, setScreen] = useState<Screen>("scopes");
  const [kris, setKris] = useState(initialKris);
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [executionName, setExecutionName] = useState("PO Creation without PR Approval");
  const [batch, setBatch] = useState(false);

  const go = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const execute = (name?: string) => { setBatch(!name); setExecutionName(name ?? "All Source to Pay KRIs"); go("execution"); };
  const filtered = useMemo(() => kris.filter((kri) =>
    (risk === "All" || kri.risk === risk) && `${kri.id} ${kri.name} ${kri.category}`.toLowerCase().includes(query.toLowerCase())), [kris, query, risk]);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-gold/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_35%_-10%,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_28%),radial-gradient(circle_at_100%_100%,color-mix(in_oklab,var(--success)_5%,transparent),transparent_25%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-10">
        <AppHeader />
        <main>
          {screen === "scopes" && <ScopeScreen onOpen={() => go("dashboard")} />}
          {screen === "dashboard" && <Dashboard kris={filtered} query={query} risk={risk} setQuery={setQuery} setRisk={setRisk} onBack={() => go("scopes")} onAdd={() => go("intake")} onExecute={execute} />}
          {screen === "intake" && <Intake onCancel={() => go("dashboard")} onSave={(kri) => { setKris((items) => [...items, kri]); toast.success("KRI added to Source to Pay", { description: `${kri.id} is ready for execution.` }); go("dashboard"); }} />}
          {screen === "execution" && <Execution name={executionName} batch={batch} onBack={() => go("dashboard")} />}
        </main>
        <footer className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>VantageRisk · Enterprise KRI Monitoring & Processing</span><span>Secure operations console</span>
        </footer>
      </div>
    </div>
  );
}

function AppHeader() {
  return <header className="flex items-center justify-between border-b border-border/70 pb-5">
    <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-gold-bright to-gold font-serif text-lg font-semibold text-primary-foreground shadow-gold">V</div><div><div className="font-serif text-lg text-foreground">Vantage<span className="text-gold">Risk</span></div><div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">KRI Command</div></div></div>
    <div className="flex items-center gap-4"><div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground md:flex"><span className="status-pulse size-1.5 rounded-full bg-success" />All systems nominal</div><div className="grid size-9 place-items-center rounded-full border border-border bg-surface-raised text-xs font-semibold text-gold">AR</div></div>
  </header>;
}

function ScopeScreen({ onOpen }: { onOpen: () => void }) {
  return <section className="screen-enter mt-10">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.3em] text-gold">Domain Overview</p><h1 className="mt-2 font-serif text-4xl font-medium lg:text-5xl">Enterprise Scope Areas</h1><p className="mt-3 max-w-xl text-sm text-muted-foreground">Select a domain to review and execute Key Risk Indicators across the enterprise.</p></div><div className="flex gap-2 text-xs text-muted-foreground"><span className="rounded-full border border-border bg-card px-3 py-1">5 domains</span><span className="rounded-full border border-border bg-card px-3 py-1">48 KRIs</span></div></div>
    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {scopes.map((scope) => { const Icon = scope.icon; return <button key={scope.code} type="button" onClick={scope.active ? onOpen : () => toast.info(`${scope.title} is available for review`, { description: "Source to Pay is the active workflow in this preview." })} className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition duration-200 hover:-translate-y-0.5 ${scope.active ? "active-sweep border-gold/50 bg-surface-raised shadow-gold" : "border-border bg-card/70 hover:border-gold/40"}`}>
        <div className="relative flex items-start justify-between"><div className={`grid size-12 place-items-center rounded-xl border ${scope.active ? "border-gold bg-gradient-to-br from-gold-bright to-gold text-primary-foreground" : "border-border bg-surface text-gold-bright"}`}><Icon size={21} /></div>{scope.active ? <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Active Scope</span> : <StatusBadge tone={scope.tone} label={scope.status} />}</div>
        <h2 className="relative mt-5 font-serif text-xl">{scope.title} <span className="font-sans text-xs text-muted-foreground">({scope.code})</span></h2><p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{scope.desc}</p><div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4"><span className="text-xs font-medium">{scope.count} KRIs</span><span className={`flex items-center gap-1 text-xs transition-transform group-hover:translate-x-1 ${scope.active ? "text-gold-bright" : "text-muted-foreground"}`}>{scope.active ? "Enter" : "Review"}<ArrowRight size={13} /></span></div>
      </button>; })}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-surface-raised to-surface p-6"><p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Portfolio Health</p><div className="mt-4 flex items-end gap-2"><span className="font-serif text-5xl">72</span><span className="mb-2 text-sm text-gold-bright">/ 100</span></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-gold to-gold-bright" /></div><p className="mt-3 text-xs text-muted-foreground">Composite score across 48 active indicators.</p></div>
    </div>
  </section>;
}

function Dashboard({ kris, query, risk, setQuery, setRisk, onBack, onAdd, onExecute }: { kris: Kri[]; query: string; risk: string; setQuery: (v: string) => void; setRisk: (v: string) => void; onBack: () => void; onAdd: () => void; onExecute: (name?: string) => void }) {
  return <section className="screen-enter mt-10"><PageTitle eyebrow="Source to Pay" title="S2P · KRI Management" onBack={onBack} aside={<span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="status-pulse size-1.5 rounded-full bg-warning" />2 thresholds breached</span>} />
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/60 p-3"><label className="flex min-w-52 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"><Search size={16} className="text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search KRIs, vendors, categories…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label><label className="relative"><select value={risk} onChange={(e) => setRisk(e.target.value)} className="h-9 appearance-none rounded-lg border border-border bg-surface pl-3 pr-9 text-sm outline-none focus:border-gold"><option>All</option><option>High</option><option>Medium</option><option>Low</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" /></label><Button variant="console" onClick={onAdd}><Plus />Add KRI</Button><Button variant="premium" onClick={() => onExecute()}><Play fill="currentColor" />Execute All KRIs</Button></div>
    <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card/40"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-border bg-surface/60 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><th className="px-5 py-3 font-medium">KRI ID</th><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Category</th><th className="px-5 py-3 font-medium">Risk threshold</th><th className="px-5 py-3 font-medium">Last executed</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr></thead><tbody>{kris.map((kri) => <tr key={kri.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-surface-raised/40"><td className="px-5 py-4 font-mono text-xs text-gold-bright">{kri.id}</td><td className="px-5 py-4 text-sm font-medium">{kri.name}</td><td className="px-5 py-4 text-xs text-muted-foreground">{kri.category}</td><td className={`px-5 py-4 text-xs ${kri.risk === "High" ? "text-risk" : kri.risk === "Medium" ? "text-warning" : "text-success"}`}>{kri.threshold}</td><td className="px-5 py-4 text-xs text-muted-foreground">{kri.executed}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button variant="premium" size="compact" onClick={() => onExecute(kri.name)}><Play />Execute</Button><Button variant="console" size="compact" onClick={() => toast.info(kri.name, { description: `${kri.category} · ${kri.threshold} · Last executed ${kri.executed}` })}>View Details</Button></div></td></tr>)}</tbody></table>{kris.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No KRIs match your filters.</div>}</div>
  </section>;
}

function Intake({ onCancel, onSave }: { onCancel: () => void; onSave: (kri: Kri) => void }) {
  const [step, setStep] = useState(1); const [name, setName] = useState(""); const [category, setCategory] = useState<"High" | "Medium" | "Low">("High"); const [source, setSource] = useState("SAP S/4HANA"); const [min, setMin] = useState("0"); const [max, setMax] = useState("10"); const [description, setDescription] = useState(""); const [mitigation, setMitigation] = useState("");
  const submit = (e: FormEvent) => { e.preventDefault(); if (step < 3) { setStep(step + 1); return; } if (!name.trim()) { toast.error("Enter a KRI name"); setStep(1); return; } onSave({ id: `S2P-${String(50 + Math.floor(Math.random() * 40)).padStart(3, "0")}`, name, category: source, risk: category, threshold: `${min}–${max}`, executed: "Not run" }); };
  return <section className="screen-enter mx-auto mt-10 max-w-4xl"><PageTitle eyebrow="KRI Intake" title="Create a new indicator" onBack={onCancel} /><form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-card/60 p-5 sm:p-7"><div className="flex items-center gap-3">{["Basics", "Thresholds", "Response"].map((label, index) => <div key={label} className="flex flex-1 items-center gap-2"><span className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs ${step > index + 1 ? "border-success bg-success/15 text-success" : step === index + 1 ? "border-gold bg-gold text-primary-foreground" : "border-border text-muted-foreground"}`}>{step > index + 1 ? <Check size={14} /> : index + 1}</span><span className={`hidden text-xs sm:block ${step === index + 1 ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>{index < 2 && <span className={`ml-auto h-px flex-1 ${step > index + 1 ? "bg-success/50" : "bg-border"}`} />}</div>)}</div>
      <div className="mt-8 min-h-[340px]">{step === 1 && <div className="grid gap-5 md:grid-cols-2"><Field label="KRI Name" wide><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Unapproved vendor onboarding" className="field" /></Field><Field label="Scope Area"><select className="field" defaultValue="S2P"><option value="S2P">Source to Pay (S2P)</option></select></Field><Field label="Risk Category"><select className="field" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}><option>High</option><option>Medium</option><option>Low</option></select></Field><Field label="Data Source" wide><select className="field" value={source} onChange={(e) => setSource(e.target.value)}><option>SAP S/4HANA</option><option>Ariba</option><option>Oracle</option><option>Document Upload</option></select></Field></div>}{step === 2 && <div><div className="mb-5 rounded-xl border border-gold/25 bg-gold/5 p-4"><div className="flex items-center gap-2 text-sm font-medium text-gold-bright"><Gauge size={17} />Threshold settings</div><p className="mt-1 text-xs text-muted-foreground">Define the acceptable range. Values outside this range trigger a risk event.</p></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Minimum value"><input className="field" type="number" value={min} onChange={(e) => setMin(e.target.value)} /></Field><Field label="Maximum value"><input className="field" type="number" value={max} onChange={(e) => setMax(e.target.value)} /></Field></div></div>}{step === 3 && <div className="grid gap-5"><Field label="Description"><textarea className="field min-h-24 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the risk signal and business impact." /></Field><Field label="Mitigation Plan"><textarea className="field min-h-24 resize-none" value={mitigation} onChange={(e) => setMitigation(e.target.value)} placeholder="Outline ownership and response actions." /></Field></div>}</div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-5"><Button type="button" variant="console" onClick={step === 1 ? onCancel : () => setStep(step - 1)}><ArrowLeft />{step === 1 ? "Cancel" : "Previous"}</Button><Button type="submit" variant="premium">{step === 3 ? <><Sparkles />Save & Add KRI</> : <>Continue<ArrowRight /></>}</Button></div></form></section>;
}

function Execution({ name, batch, onBack }: { name: string; batch: boolean; onBack: () => void }) {
  const [run, setRun] = useState(0); const [step, setStep] = useState(0);
  useEffect(() => { setStep(0); const timers = [700, 1800, 3100, 4600].map((delay, index) => window.setTimeout(() => setStep(index + 1), delay)); return () => timers.forEach(window.clearTimeout); }, [run]);
  return <section className="screen-enter mt-10"><div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-surface-raised to-surface p-5"><PageTitle compact eyebrow={batch ? "Batch Processing" : "Live Processing"} title={`S2P Execution Engine · ${name}`} onBack={onBack} /><Button variant="console" onClick={() => setRun((v) => v + 1)}><RefreshCw className={step < 4 ? "status-spin" : ""} />Re-run Execution</Button></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6"><p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Data Ingestion & Extraction</p><div className="mt-4 space-y-3"><SourceCard icon={Server} title="SAP ERP API" detail="Connected · 240ms latency" label="Connected" tone="success" /><SourceCard icon={FileText} title="Invoices_Q3.pdf" detail="18.4 MB · 1,240 pages" label="Uploaded" tone="gold" /></div><p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Extracted Data Preview</p><div className="mt-3 overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[480px] text-left text-xs"><thead><tr className="border-b border-border bg-surface/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="px-3 py-2 font-medium">Entity</th><th className="px-3 py-2 font-medium">Amount</th><th className="px-3 py-2 font-medium">Date</th><th className="px-3 py-2 font-medium">Confidence</th></tr></thead><tbody>{[["Meridian Steel Co.", "$142,300", "09/14", "98%"], ["Northlake Logistics", "$88,150", "09/13", "96%"], ["Corex Components", "$31,900", "09/12", "81%"]].map((row) => <tr key={row[0]} className="border-b border-border/50 last:border-0">{row.map((cell, i) => <td key={cell} className={`px-3 py-3 ${i === 3 ? (cell === "81%" ? "text-warning" : "text-success") : i > 0 ? "text-muted-foreground" : ""}`}>{cell}</td>)}</tr>)}</tbody></table></div></div>
      <div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Live Execution Status</p><span className={`flex items-center gap-2 text-xs ${step === 4 ? "text-success" : "text-gold-bright"}`}><span className={`size-1.5 rounded-full ${step === 4 ? "bg-success" : "status-pulse bg-gold"}`} />{step === 4 ? "Complete" : "Running"}</span></div><div className="mt-7">{["Fetching Document", "Gathering Info", "Analyzing Risk Rules & Thresholds", "Execution Complete"].map((label, index) => { const number = index + 1; const done = step > number || (step === 4 && number === 4); const active = step === index || (step === 0 && index === 0); return <div key={label} className="flex gap-4"><div className="flex flex-col items-center"><span className={`grid size-9 place-items-center rounded-full border text-xs ${done ? "border-success/30 bg-success/15 text-success" : active ? "border-gold text-gold-bright" : "border-border text-muted-foreground"}`}>{done ? <Check size={16} /> : active ? <RefreshCw size={15} className="status-spin" /> : number}</span>{number < 4 && <span className={`min-h-14 w-px flex-1 ${done ? "bg-success/30" : "bg-border"}`} />}</div><div className="pb-6"><p className={`text-sm font-medium ${active ? "text-gold-bright" : done ? "text-foreground" : "text-muted-foreground"}`}>{label}{active && number < 4 ? "…" : ""}</p><p className="mt-1 text-xs text-muted-foreground">{number === 1 ? "Retrieving documents and ledger records." : number === 2 ? "Extracting entities, amounts, dates and references." : number === 3 ? "Evaluating six rules against defined thresholds." : done ? "4 exceptions found across 3,412 line items." : "Verdict, logs and response queue."}</p>{number === 4 && done && <div className="mt-3 rounded-xl border border-risk/25 bg-risk/5 p-4"><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm font-medium"><ShieldCheck size={18} className="text-risk" />Risk verdict</span><StatusBadge tone="risk" label="High Risk" /></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Four purchase orders totaling $262,350 were created without approved requisitions. Route to Procurement Control for review.</p></div>}</div></div>; })}</div></div></div>
  </section>;
}

function PageTitle({ eyebrow, title, onBack, aside, compact = false }: { eyebrow: string; title: string; onBack: () => void; aside?: ReactNode; compact?: boolean }) { return <div className="flex flex-1 items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-4"><Button aria-label="Go back" title="Go back" variant="console" size="icon" onClick={onBack}><ArrowLeft /></Button><div className="min-w-0"><p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p><h1 className={`mt-1 truncate font-serif font-medium ${compact ? "text-lg sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{title}</h1></div></div><div className="hidden md:block">{aside}</div></div>; }
function StatusBadge({ tone, label }: { tone: string; label: string }) { const styles = tone === "success" ? "border-success/30 bg-success/10 text-success" : tone === "warning" ? "border-warning/30 bg-warning/10 text-warning" : "border-risk/30 bg-risk/10 text-risk"; return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles}`}>{label}</span>; }
function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={wide ? "md:col-span-2" : ""}><span className="mb-2 block text-xs font-medium text-muted-foreground">{label}</span>{children}</label>; }
function SourceCard({ icon: Icon, title, detail, label, tone }: { icon: typeof UploadCloud; title: string; detail: string; label: string; tone: string }) { return <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${tone === "success" ? "border-success/25 bg-success/5" : "border-border bg-surface"}`}><div className="flex min-w-0 items-center gap-3"><Icon size={18} className={tone === "success" ? "text-success" : "text-gold-bright"} /><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p><p className="text-[11px] text-muted-foreground">{detail}</p></div></div><span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${tone === "success" ? "bg-success/15 text-success" : "bg-gold/15 text-gold-bright"}`}>{label}</span></div>; }