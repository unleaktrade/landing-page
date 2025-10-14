import { motion } from "motion/react";
import { CheckCircle2, Circle, Sparkles, Target } from "lucide-react";
import { useState } from "react";

interface RoadmapPhase {
  id: string;
  letter: string;
  name: string;
  subtitle: string;
  core: string;
  focus: {
    title?: string;
    items: string[];
    steps?: { title: string; items: string[] }[];
  };
  outcome: string;
  status: "completed" | "in-progress" | "upcoming";
}

const roadmapPhases: RoadmapPhase[] = [
  {
    id: "phase-a",
    letter: "A",
    name: "Arturo Fuente",
    subtitle: "The Founders' Cut",
    core: "The OTC foundation — from single-asset swaps to multi-asset RFQs.",
    focus: {
      steps: [
        {
          title: "Step 1 — MVP",
          items: [
            "Core commit–reveal OTC engine enabling private 1:1 fungible token swaps.",
            "Trustless escrow (self-verifying) and atomic settlement with zk-verified confidentiality.",
            "Initial rollout focused on SPL ↔ SPL pairs to validate throughput and cryptographic stability."
          ]
        },
        {
          title: "Step 2 — Expansion",
          items: [
            "Extend the RFQ layer to support multi-asset trading structures, where a single maker offers one token against several different tokens, including NFTs.",
            "Unified settlement and pricing model for heterogeneous assets (SPL + NFT + synthetic).",
            "Enhanced RFQ schema and interface for complex quote creation and validation."
          ]
        }
      ],
      items: []
    },
    outcome: "UmbraTrade's universal OTC core — private, multi-asset, and verifiably secure.",
    status: "in-progress"
  },
  {
    id: "phase-b",
    letter: "B",
    name: "Bolivar",
    subtitle: "Prestige & Market Reach",
    core: "Reputation, liquidity scaling, and advanced RFQ architecture.",
    focus: {
      items: [
        "Launch of Prestige Levels dynamically adjusting bond and fee requirements by trading history and dispute record.",
        "RFQ fragmentation: a single maker's order can be partially filled by multiple takers, unlocking distributed, retail-level liquidity.",
        "Expanded multi-asset RFQ support for makers — enabling n → m structures, where multiple input tokens can be exchanged for multiple outputs in one OTC deal.",
        "Adaptive pricing and incentives weighted by reputation, trade size, and fill rate.",
        "Optional zk-KYC and decentralized identity attestations for higher-tier access."
      ]
    },
    outcome: "A scalable, merit-based OTC market where liquidity fragments and aggregates seamlessly under full privacy.",
    status: "upcoming"
  },
  {
    id: "phase-c",
    letter: "C",
    name: "Cohiba",
    subtitle: "Tokenization & Liquidity Fabric",
    core: "Introduction of the UmbraTrade's Token — the internal coordination, bonding, and fee unit of UmbraTrade.",
    focus: {
      title: "The escrow is the verifier — every trade self-verifies via commit–reveal logic, releasing or reclaiming bonds automatically.",
      items: [
        "Fees: paid for RFQ submission, reveal execution, and settlement.",
        "Bonds: staked by makers (and later relayers) to guarantee honest behavior; dynamically sized by Prestige Level and trade volume.",
        "Incentives: distributed to relayers for uptime and accurate routing.",
        "Governance: granting participation in protocol-level parameter decisions.",
        "No tokenized receipts or synthetic liquidity — escrows self-destruct post-settlement.",
        "Establish protocol treasury and initial staking mechanics for sustainability."
      ]
    },
    outcome: "UmbraTrade becomes a self-sustaining, economically secure network — all trust, cost, and incentive flows unified under one verifiable token logic.",
    status: "upcoming"
  },
  {
    id: "phase-d",
    letter: "D",
    name: "Davidoff",
    subtitle: "Market Fabric",
    core: "Unified relayer, data, and execution infrastructure.",
    focus: {
      items: [
        "Permissionless relayer mesh coordinating encrypted order discovery and routing.",
        "Dynamic fee streaming and incentives powered by UmbraTrade's Token economics.",
        "Advanced RFQ orchestration, pricing intelligence, and analytics framework.",
        "Settlement extensions for derivatives, credit instruments, and RWA-backed trades."
      ]
    },
    outcome: "UmbraTrade evolves into Solana's market infrastructure layer — liquidity, routing, and data fused through cryptographic trust.",
    status: "upcoming"
  },
  {
    id: "phase-e",
    letter: "E",
    name: "El Rey del Mundo",
    subtitle: "The Composable Stack",
    core: "Developer and protocol composability.",
    focus: {
      items: [
        "Comprehensive SDK + API suite for DAOs, asset managers, and custody providers.",
        "Programmable RFQ templates and automation modules for treasuries and on-chain funds.",
        "Plug-ins for asset issuers, RWA platforms, and DeFi integrations.",
        "Sandbox environment for third-party builders extending UmbraTrade's rails."
      ]
    },
    outcome: "UmbraTrade becomes a programmable infrastructure layer — powering automated, composable OTC markets on Solana.",
    status: "upcoming"
  },
  {
    id: "phase-f",
    letter: "F",
    name: "Flor de Selva",
    subtitle: "Institutional Symphony",
    core: "Governance, compliance, and enterprise-grade integration.",
    focus: {
      items: [
        "zk-proof audit trails and verifiable trade attestations for funds and OTC desks.",
        "Arbitration DAO, insurance vaults, and automated dispute management.",
        "Integration with custody, accounting, and regulatory reporting pipelines.",
        "Institutional onboarding stack with configurable privacy levels and audit access."
      ]
    },
    outcome: "Institutional-scale privacy and compliance — regulated liquidity on private, cryptographically verifiable rails.",
    status: "upcoming"
  }
];

export function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase-a");

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
    if (status === "in-progress") return <Sparkles className="w-5 h-5 text-purple-400" />;
    return <Circle className="w-5 h-5 text-white/20" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "completed") return "from-cyan-500/20 to-cyan-500/5";
    if (status === "in-progress") return "from-purple-500/20 to-purple-500/5";
    return "from-white/5 to-white/2";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/40 mb-4">The journey ahead</p>
            <h1 className="text-white mb-6">Building Solana's Private Market Infrastructure</h1>
            <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
              Each phase brings us closer to trustless, private, and permissionless OTC markets—where cryptographic guarantees replace institutional gatekeepers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-12 px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/30 to-transparent" />

            {/* Phases */}
            <div className="space-y-8">
              {roadmapPhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-12 top-8 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor(phase.status)} border border-white/10 flex items-center justify-center backdrop-blur-sm`}>
                        {getStatusIcon(phase.status)}
                      </div>
                    </div>
                  </div>

                  {/* Phase card */}
                  <div className="ml-16 md:ml-28">
                    <button
                      onClick={() => togglePhase(phase.id)}
                      className="w-full text-left group"
                    >
                      <div className={`relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-500 ${
                        expandedPhase === phase.id ? "border-white/20" : ""
                      }`}>
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getStatusColor(phase.status)} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                        
                        <div className="relative">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-white/40 text-sm">Phase {phase.letter}</span>
                                {phase.status === "in-progress" && (
                                  <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <h3 className="text-white mb-1">{phase.name}</h3>
                              <p className="text-white/60 text-sm italic">{phase.subtitle}</p>
                            </div>
                            <div className={`transform transition-transform duration-300 ${expandedPhase === phase.id ? "rotate-180" : ""}`}>
                              <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {/* Core */}
                          <p className="text-white/70 mb-4">{phase.core}</p>

                          {/* Expanded content */}
                          {expandedPhase === phase.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6 pt-6 border-t border-white/10"
                            >
                              {/* Focus */}
                              <div>
                                <h4 className="text-white/90 mb-3">Focus</h4>
                                {phase.focus.title && (
                                  <p className="text-white/60 text-sm mb-4 italic">{phase.focus.title}</p>
                                )}
                                
                                {/* Steps */}
                                {phase.focus.steps && phase.focus.steps.length > 0 && (
                                  <div className="space-y-4 mb-4">
                                    {phase.focus.steps.map((step, stepIndex) => (
                                      <div key={stepIndex} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                        <h5 className="text-white/90 text-sm mb-3">{step.title}</h5>
                                        <ul className="space-y-2">
                                          {step.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                                              <span className="text-cyan-400 flex-shrink-0 leading-relaxed">•</span>
                                              <span className="leading-relaxed">{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Items */}
                                {phase.focus.items && phase.focus.items.length > 0 && (
                                  <ul className="space-y-3">
                                    {phase.focus.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                                        <span className="text-cyan-400 flex-shrink-0 leading-relaxed">•</span>
                                        <span className="leading-relaxed">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              {/* Outcome */}
                              <div className="bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 rounded-xl p-4">
                                <div className="flex gap-3">
                                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-3 h-3 text-cyan-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-white/90 text-sm mb-2">Outcome</h4>
                                    <p className="text-white/70 text-sm leading-relaxed">{phase.outcome}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center"
          >
            <p className="text-white/40 italic max-w-2xl mx-auto">
              From zero-knowledge to tokenized coordination — UmbraTrade is Solana's invisible backbone for private, programmable OTC markets.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
