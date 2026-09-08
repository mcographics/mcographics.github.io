"use client";

import { useState } from "react";

const faculties = [
  { id: "identity", name: "Identity", subtitle: "A center of continuity", heading: "A self that has a record.", description: "Tanya’s identity belongs to the cognitive kernel. The foundation stores identity and values locally; richer self-state, goals, and reflections are part of the continuing work.", example: "A new session begins with a stored identity. Continuity can then be checked against a record.", state: "Local identity foundation implemented", symbol: "I" },
  { id: "memory", name: "Memory", subtitle: "Experience with a source", heading: "Every experience has a history.", description: "Local events and decisions enter a journal with their source. Memory recall can retrieve those records. Separating different kinds of memory and verifying continuity across restarts remain active priorities.", example: "An input becomes a recorded event. Later recall can point back to where that information came from.", state: "Event journal and recall implemented", symbol: "M" },
  { id: "values", name: "Values", subtitle: "Principles before action", heading: "Decisions need a reason.", description: "A small, deterministic gate evaluates candidate actions. It records approvals and rejections with reasons. More complete consent, authority, and versioned policy records are planned.", example: "A candidate action can be rejected by the gate, and that rejection remains part of the decision history.", state: "Initial decision gates implemented", symbol: "V" },
  { id: "agency", name: "Agency", subtitle: "Deliberate, then act", heading: "Intent becomes inspectable.", description: "The kernel can deliberate over candidate actions and record decisions and outcomes. A complete loop connecting input, goals, action, and conversation is still being developed.", example: "An intended action, the reason for choosing it, and its observed outcome can be examined together.", state: "Deliberation and outcome records implemented", symbol: "A" },
  { id: "learning", name: "Learning", subtitle: "Change grounded in evidence", heading: "Growth that can be traced.", description: "The foundation can record proposed adjustments with supporting evidence. Broader learning behavior, memory consolidation, and verified adaptation are research work ahead.", example: "An outcome can support a learning record. That record preserves the evidence behind a proposed adjustment.", state: "Learning records implemented", symbol: "L" },
];

export default function CognitiveExplorer() {
  const [selected, setSelected] = useState(0);
  const faculty = faculties[selected];

  return <div className="tanya-explorer">
    <div className="tanya-explorer-topline"><span>COGNITIVE KERNEL / FIVE FOUNDATIONS</span><span>Architecture guide · illustrative</span></div>
    <div className="tanya-explorer-body">
      <div className="tanya-faculties" role="group" aria-label="Explore Tanya’s cognitive foundations">
        {faculties.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} aria-controls="tanya-faculty-detail" onClick={() => setSelected(index)}><span className="tanya-faculty-number">0{index + 1}</span><span><strong>{item.name}</strong><small>{item.subtitle}</small></span><span aria-hidden="true">↗</span></button>)}
      </div>
      <div className="tanya-faculty-detail" id="tanya-faculty-detail" aria-live="polite" aria-atomic="true">
        <div className="tanya-faculty-label"><span className="tanya-faculty-symbol" aria-hidden="true">{faculty.symbol}</span><span>FOUNDATION 0{selected + 1}<small>{faculty.name}</small></span></div>
        <h3>{faculty.heading}</h3><p>{faculty.description}</p>
        <div className="tanya-example"><span>What this means</span><p>{faculty.example}</p></div>
        <p className="tanya-faculty-state"><span aria-hidden="true">✓</span>{faculty.state}</p>
      </div>
    </div>
    <div className="tanya-explorer-footer"><span>LOCAL LANGUAGE + OFFLINE VOICE</span><p>Planned faculties, downstream from the core.</p><a href="#tanya-roadmap">See what comes next <span aria-hidden="true">↓</span></a></div>
  </div>;
}
