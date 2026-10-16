"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, ArrowUpRight, CreditCard, LayoutDashboard, LogOut, Settings2, Users, Layers3 } from "lucide-react";
import { useState } from "react";
const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/pricing", label: "Plans & pricing", icon: Layers3 },
  { href: "/subscriptions", label: "Subscriptions", icon: Activity },
  { href: "/invoices", label: "Invoices", icon: CreditCard },
];
export default function AppShell({ children, user }: { children: React.ReactNode; user: any }) {
  const path = usePathname(); const router = useRouter(); const [busy, setBusy] = useState(false);
  async function logout() { setBusy(true); await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  return <div className="app-layout"><aside className="sidebar"><Link href="/dashboard" className="brand"><span className="brand-mark">S</span><span>subscript<span className="brand-dot">.</span><small>WORKSPACE</small></span></Link><div className="workspace"><div className="workspace-avatar">{(user?.name || "U").slice(0,1).toUpperCase()}</div><div><strong>{user?.name || "Workspace"}</strong><small>{user?.role === "admin" ? "Administrator" : "Personal workspace"}</small></div><ArrowUpRight size={15} className="muted"/></div><div className="nav-label">WORKSPACE</div><nav>{links.map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`nav-link ${path === href ? "active" : ""}`}><Icon size={18}/>{label}</Link>)}{user?.role === "admin" && <><div className="nav-label admin-label">ADMINISTRATION</div><Link href="/admin" className={`nav-link ${path === "/admin" ? "active" : ""}`}><Settings2 size={18}/>Admin console</Link></>}</nav><div className="sidebar-bottom"><div className="plan-mini"><div className="plan-mini-icon"><Layers3 size={16}/></div><div><strong>Workspace plan</strong><small>Manage your subscription</small></div><Link href="/pricing" aria-label="View plans"><ArrowUpRight size={16}/></Link></div><button className="logout-button" onClick={logout} disabled={busy}><LogOut size={17}/>{busy ? "Signing out…" : "Sign out"}</button><div className="sidebar-foot">SUBSCRIPT v1.0 · BUILT FOR GROWTH</div></div></aside><main className="main-area"><header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <strong>{links.find(l=>l.href===path)?.label || (path === "/admin" ? "Admin console" : "Account")}</strong></div><div className="topbar-right"><span className="status-pill"><span/> All systems operational</span><div className="top-avatar">{(user?.name || "U").slice(0,1).toUpperCase()}</div></div></header><div className="page-content">{children}</div><footer className="footer"><span>© {new Date().getFullYear()} Subscript Inc.</span><span>Simple billing. Clear insights.</span></footer></main></div>;
}
