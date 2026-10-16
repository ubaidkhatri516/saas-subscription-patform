"use client";
import { Check, ArrowRight } from "lucide-react";
import { money } from "@/lib/format";
export default function PlanCard({ plan, current, onChoose, loading }: { plan: any; current?: boolean; onChoose: (plan: any)=>void; loading?: boolean }) {
 return <article className={`plan-card ${plan.slug === "pro" ? "featured" : ""}`}>
  {plan.slug === "pro" && <div className="popular-tag">MOST POPULAR</div>}
  <div className="plan-top"><span className={`plan-icon ${plan.slug}`}><span>{plan.slug === "starter" ? "S" : plan.slug === "pro" ? "P" : "B"}</span></span>{current && <span className="current-tag">CURRENT PLAN</span>}</div>
  <h3>{plan.name}</h3><p className="plan-description">{plan.description}</p>
  <div className="price-line"><strong>{money(plan.price_cents)}</strong><span>/ month</span></div>
  <div className="usage-line"><span>Monthly usage limit</span><strong>{Number(plan.usage_limit).toLocaleString()}</strong></div>
  <div className="plan-divider"/><p className="feature-heading">WHAT'S INCLUDED</p><ul className="feature-list">{(Array.isArray(plan.features) ? plan.features : []).map((feature: string) => <li key={feature}><span><Check size={13}/></span>{feature}</li>)}</ul>
  <button className={`button ${current ? "button-secondary" : plan.slug === "pro" ? "button-primary" : "button-outline"} plan-button`} disabled={current || loading} onClick={() => onChoose(plan)}>{current ? "Your current plan" : loading ? "Please wait…" : plan.price_cents === 0 ? "Switch to Starter" : "Choose " + plan.name}<ArrowRight size={16}/></button>
 </article>
}
