"use client";

import { useLang } from "./LangProvider";

type Node = {
  x: number;
  y: number;
  icon: string;
  title: string;
  sub: string;
  color: string;
};

const NODE_W = 168;
const NODE_H = 64;

export function WorkflowDiagram() {
  const { t } = useLang();
  const w = t.workflow;

  // Lignes : principale (y=148) + branches (haut y=58 / bas y=238)
  const nodes: Node[] = [
    { x: 10, y: 148, icon: "📝", title: "Google Forms", sub: w.trigger, color: "#22c55e" },
    { x: 208, y: 148, icon: "🔍", title: "Hunter.io", sub: w.enrich, color: "#FF6B35" },
    { x: 406, y: 148, icon: "⚙️", title: "Code", sub: w.score, color: "#3b82f6" },
    { x: 604, y: 148, icon: "◆", title: "IF", sub: w.ifq, color: "#a855f7" },
    { x: 812, y: 58, icon: "👤", title: "Pipedrive", sub: w.person, color: "#16a34a" },
    { x: 1010, y: 58, icon: "📊", title: "Pipedrive", sub: w.deal, color: "#16a34a" },
    { x: 1208, y: 58, icon: "🔔", title: "Gmail", sub: w.notify, color: "#ea4335" },
    { x: 812, y: 238, icon: "✉️", title: "Gmail", sub: w.reject, color: "#ef4444" },
  ];

  // bord droit -> bord gauche, au centre vertical (y + NODE_H/2)
  const c = (n: Node) => ({ rx: n.x + NODE_W, lx: n.x, cy: n.y + NODE_H / 2 });
  const straight = (a: Node, b: Node) =>
    `M${c(a).rx},${c(a).cy} L${c(b).lx},${c(b).cy}`;
  const branch = (a: Node, b: Node) => {
    const A = c(a);
    const B = c(b);
    const midX = (A.rx + B.lx) / 2;
    return `M${A.rx},${A.cy} C${midX},${A.cy} ${midX},${B.cy} ${B.lx},${B.cy}`;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-[#0b1220] p-4">
      <svg
        viewBox="0 0 1386 330"
        className="w-full min-w-[860px]"
        role="img"
        aria-label={w.title}
      >
        <defs>
          {/* grille pointillée façon n8n */}
          <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#1e293b" />
          </pattern>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
          </marker>
        </defs>

        <rect width="1386" height="330" fill="url(#grid)" />

        {/* connecteurs (dessinés avant les nœuds) */}
        <g fill="none" stroke="#64748b" strokeWidth="2">
          <path d={straight(nodes[0], nodes[1])} markerEnd="url(#arrow)" />
          <path d={straight(nodes[1], nodes[2])} markerEnd="url(#arrow)" />
          <path d={straight(nodes[2], nodes[3])} markerEnd="url(#arrow)" />
          <path d={branch(nodes[3], nodes[4])} markerEnd="url(#arrow)" />
          <path d={straight(nodes[4], nodes[5])} markerEnd="url(#arrow)" />
          <path d={straight(nodes[5], nodes[6])} markerEnd="url(#arrow)" />
          <path d={branch(nodes[3], nodes[7])} markerEnd="url(#arrow)" />
        </g>

        {/* étiquettes de branche */}
        <g fontSize="11" fontWeight="600">
          <rect x="772" y="92" width="62" height="20" rx="10" fill="#16a34a" opacity="0.15" />
          <text x="803" y="106" textAnchor="middle" fill="#22c55e">
            {w.target}
          </text>
          <rect x="760" y="196" width="86" height="20" rx="10" fill="#ef4444" opacity="0.15" />
          <text x="803" y="210" textAnchor="middle" fill="#f87171">
            {w.off}
          </text>
        </g>

        {/* nœuds */}
        {nodes.map((n, i) => (
          <g key={i}>
            <rect
              x={n.x}
              y={n.y}
              width={NODE_W}
              height={NODE_H}
              rx="12"
              fill="#1e293b"
              stroke="#334155"
            />
            <rect x={n.x + 12} y={n.y + 16} width="32" height="32" rx="8" fill={n.color} />
            <text
              x={n.x + 28}
              y={n.y + 32}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
            >
              {n.icon}
            </text>
            <text x={n.x + 54} y={n.y + 28} fill="#e2e8f0" fontSize="13" fontWeight="600">
              {n.title}
            </text>
            <text x={n.x + 54} y={n.y + 46} fill="#94a3b8" fontSize="11">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
