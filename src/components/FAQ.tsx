import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Platform Basics",
    question: "What is UnleakTrade?",
    answer:
      "UnleakTrade is a private **OTC (Over-The-Counter)** auction platform on **Solana** for trading any **SPL (Solana Program Library) token** (listed or unlisted) via private auctions, with **ZK (Zero-Knowledge)** verified liquidity and trustless, fully on-chain settlement.",
  },
  {
    category: "Platform Basics",
    question:
      "Why use this OTC instead of another OTC venue or an AMM?",
    answer:
      "Most venues either execute in public (so size, timing, and intent leak) or rely on trust-heavy coordination. UnleakTrade's core differentiator is that it encodes the entire **RFQ (Request For Quote)** lifecycle into a verifiable on-chain state machine, and uses bonds + timeouts to enforce completion and penalize griefing. This matters for whales because the cost of \"leakage\" is usually not the fee: it's adverse price movement and being gamed.",
  },
  {
    category: "Economics & Incentives",
    question: "What's the minimum trade size?",
    answer:
      "There is **no enforced minimum trade size** on UnleakTrade: you can create an **RFQ (Request For Quote)** for any amount, including smaller tickets like **$2,000**. All settled OTC trades pay a **flat 5 bps (0.05%) protocol fee**, regardless of size, paid in **USDC (USD Coin)**.\n\nThat said, OTC auctions are generally **most efficient above ~$10,000**, where avoiding slippage and information leakage meaningfully outweighs on-chain AMM execution. Below that range, AMMs may offer simpler or cheaper execution, but UnleakTrade intentionally keeps the fee model simple and lets participants choose the execution venue that best fits their trade.",
  },
  {
    category: "Platform Basics",
    question: "Why not an AMM?",
    answer:
      "An AMM (**Automated Market Maker)** prices against a public pool and your trade is executed against a curve; large trades tend to pay explicit slippage and also reveal execution to the market. UnleakTrade instead runs a private auction where takers compete to fill a maker's request, and only the final settlement needs to hit the chain. That's typically better for large size because you're seeking a negotiated/competitive fill rather than pushing a pool price.",
  },
  {
    category: "Platform Basics",
    question: "What's a DEX?",
    answer:
      'A DEX (**Decentralized Exchange)** is an on-chain exchange - often an AMM or an order book - where orders/swaps are executed via smart contracts. UnleakTrade is still on-chain for settlement, but it\'s not a "public order book DEX" pattern, it is an OTC/RFQ auction flow with commit/reveal and bonding to minimize information leakage and enforce fair behavior.',
  },
  {
    category: "Core Concepts",
    question:
      "What's an RFQ (Request For Quote) on UnleakTrade?",
    answer:
      "An RFQ is an on-chain object created by the **maker** that defines the trade request (tokens involved), the bonding requirement, and the timing windows. It is uniquely identified by `(maker, uuid)` and stored in a dedicated on-chain RFQ account (a **PDA = Program Derived Address**).",
  },
  {
    category: "Roles & Participants",
    question: "Who is the maker on UnleakTrade?",
    answer:
      "On UnleakTrade, the maker is the party who **initiates** the RFQ and later **selects** the winning taker. The maker creates the RFQ draft, publishes it, and after the auction they must fund their side of the settlement within the funding time window.",
  },
  {
    category: "Roles & Participants",
    question: "Who is the taker on UnleakTrade?",
    answer:
      "On UnleakTrade, takers are bidders: they respond to a maker's RFQ by submitting bids/quotes during the commit/reveal auction. If a taker is selected, they must fund their side of the settlement (and pay the protocol fee, in USDC) within the funding time window.",
  },
  {
    category: "Core Concepts",
    question: "What's a Quote vs a Bid vs an Auction?",
    answer:
      "A quote (or bid) is the taker's proposed execution terms for the maker's RFQ (the price they're willing to trade at for the specified pair/size). The auction is the competitive process where multiple takers submit quotes and the maker selects the winning one. UnleakTrade implements this with a commit/reveal flow: takers first commit a hash of their quote, then later reveal the details for validation.",
  },
  {
    category: "Technical Mechanics",
    question: "What is commit/reveal and why does it matter?",
    answer:
      "Commit/reveal is a two-step auction design used to reduce copying and information leakage. In the **commit** phase, takers submit a hashed commitment (so the content isn't revealed). In the **reveal** phase, takers reveal the actual bid details and the program validates that the revealed quote matches the prior commitment. This protects bidders from having their quote instantly mirrored and helps keep the process fair for size.",
  },
  {
    category: "Technical Mechanics",
    question: "Is it fully on-chain?",
    answer:
      'The settlement engine is an on-chain Solana program that enforces the RFQ lifecycle, bond accounting, state transitions, and atomic settlement. There is also an off-chain component ("Liquidity Guard") that performs validation and generates attestations and ZK proofs used during the process, but the final enforcement and settlement happen on-chain.',
  },
  {
    category: "Technical Mechanics",
    question: "What's ZK (Zero-Knowledge) doing here?",
    answer:
      "ZK (Zero-Knowledge) is used so a participant can prove something (for example, eligibility/solvency constraints required by the protocol flow) without publicly revealing sensitive details. In UnleakTrade's flow, takers generate a ZK proof via a REST API and submit it with their commitment; invalid proofs are rejected.",
  },
  {
    category: "Technical Mechanics",
    question:
      'What is the "Liquidity Guard"? (and what does "REST API" mean?)',
    answer:
      "Liquidity Guard is an off-chain microservice that (1) verifies liquidity/solvency before commitment, (2) generates signed attestations for makers and takers, and (3) feeds validated actions to the on-chain Settlement Engine.\n\nA **REST API (Representational State Transfer Application Programming Interface)** is simply an HTTP service interface; here it's used to request and receive ZK proof material needed for the on-chain commit step.",
  },
  {
    category: "Economics & Incentives",
    question: 'What are "fees" on UnleakTrade?',
    answer:
      "A protocol fee is paid during funding/settlement: in the reference sequence, the selected taker deposits their settlement asset and pays a fee in **USDC (USD Coin)**, which is transferred to the UnleakTrade treasury. The exact fee amount/rate is a protocol parameter.",
  },
  {
    category: "Economics & Incentives",
    question: 'What are "bonds" and why do they exist?',
    answer:
      "A bond is a USDC amount posted by *each participant* to make griefing expensive and force timely completion. Bonds are held in an RFQ-owned USDC token account (an **ATA = Associated Token Account**) and are returned on successful settlement. If someone fails to do their required step in time, their bond can be slashed and redistributed. Counterparties **have skin-in-the-game**.",
  },
  {
    category: "Economics & Incentives",
    question: "How exactly does bond slashing work?",
    answer:
      "If one party fails to act (for example, not funding or not revealing), they lose their bond. Bonds are **never paid to the counterparty**. Each participant posts their own bond, and on a normal successful settlement each participant simply gets **their own bond back**. If a participant fails to complete a required action within the protocol's deadlines (for example, missing a funding or reveal deadline), their bond can be **slashed** according to the program rules. When slashing happens, the slashed bond is **not redistributed to the other trading party**; it is handled by the protocol (for example routed to the protocol treasury / fee destination) rather than being shared with the counterparty.",
  },
  {
    category: "Economics & Incentives",
    question: "What are TTLs?",
    answer:
      "TTLs **(TTL = Time To Live)** are deadlines that define the allowed time window for each phase of the RFQ lifecycle. In the Settlement Engine, TTLs include `commit_ttl`, `reveal_ttl`, `selection_ttl`, and `fund_ttl`. If a TTL expires, the RFQ can be marked expired/aborted/ignored, and bonds are distributed according to the rules.",
  },
  {
    category: "Settlement & Security",
    question: "How does settlement work?",
    answer:
      "After the maker selects a winning taker quote, both sides deposit the required assets during the funding phase. Once funded, the program executes the swap atomically: it transfers the quote asset to the maker, the base asset to the taker, transfers the fee to the treasury, and returns both bonds (unless a timeout rule triggered slashing).",
  },
  {
    category: "Settlement & Security",
    question: "Is there custody risk?",
    answer:
      'The design is escrow-style and program-enforced: assets are deposited into program-controlled accounts for the purpose of atomic settlement, then released according to the RFQ state machine. This is not "custody" in the traditional centralized sense, but it is still smart-contract escrow: the trust assumption is the correctness/security of the on-chain program.',
  },
  {
    category: "Platform Basics",
    question: "Why Solana?",
    answer:
      "UnleakTrade is built on **Solana** because it uniquely aligns with where crypto liquidity, real-world adoption, and performant blockchain technology are converging: \n\n" +
      "• **Liquidity is actively growing on Solana** — Solana has seen extraordinary on-chain usage and economic value, consistently leading in daily transactions and decentralized exchange activity compared to other blockchains, evidencing deep and active markets that matter for OTC flows.\n\n" +
      "• **Favourable macro & institutional context** — Solana has attracted major partners (e.g., payments and stablecoin infrastructure integrations like Visa, Western Union, Circle) and increasing institutional interest, which supports larger capital flows and real financial market use cases.\n\n" +
      "• **High performance with very low fees:** Solana’s technology delivers high throughput (thousands of TPS and sub-second finality) and transaction costs that are fractions of a cent, enabling fast, predictable execution without the congestion or gas spikes common on older networks.\n\n" +
      "• **Modern consensus & architecture:** Solana’s hybrid Proof-of-History (PoH) plus Proof-of-Stake (PoS) design is optimized for parallel processing and low latency, making it ideal for high-frequency or large-scale financial applications like OTC auctions.\n\n" +
      "• **Native support for zero-knowledge innovations:** Solana is pioneering *ZK Compression* and other zero-knowledge extensions at the base layer, enabling dramatically lower state costs, privacy primitives, and scalable proofs without relying on external rollups or secondary chains — a strong technical fit for UnleakTrade’s ZK-assisted liquidity model.\n\n" +
      "Together, these factors make Solana a strong foundation for UnleakTrade: it offers deep liquidity, real adoption signals from both retail and institutional players, extremely efficient execution, and evolving zero-knowledge capabilities that align with our privacy and performance goals.",
  },

];

// Helper to convert markdown-style bold to spans
const renderText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 bg-white/5 text-purple-300 rounded text-sm font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | null
  >(null);

  // Get unique categories
  const categories = Array.from(
    new Set(faqData.map((item) => item.category)),
  );

  // Filter FAQ items
  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.answer
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-white/40 mb-4">
            Questions & Answers
          </p>
          <h2 className="text-white mb-6">
            Everything you need to know.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Deep technical documentation on protocol mechanics,
            auction flow, and settlement architecture.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 space-y-4"
        >
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${!selectedCategory
                ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                : "bg-white/[0.02] border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20"
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category === selectedCategory
                      ? null
                      : category,
                  )
                }
                className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCategory === category
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                  : "bg-white/[0.02] border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQ.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
              >
                <div className="group relative">
                  {/* Gradient glow on hover/active */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 ${isOpen
                      ? "opacity-100"
                      : "group-hover:opacity-50"
                      }`}
                  />

                  <div
                    className={`relative bg-white/[0.02] border rounded-xl transition-all duration-300 ${isOpen
                      ? "border-white/20"
                      : "border-white/10 group-hover:border-white/15"
                      }`}
                  >
                    {/* Question button */}
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
                    >
                      <div className="flex-1">
                        <p className="text-white/90 group-hover:text-white transition-colors">
                          {item.question}
                        </p>
                        {!isOpen && (
                          <p className="text-white/30 text-sm mt-1">
                            {item.category}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Answer */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 pt-0 border-t border-white/5">
                            <div className="pt-4 space-y-3">
                              <p className="text-purple-400/60 text-sm">
                                {item.category}
                              </p>
                              <div className="text-white/60 leading-relaxed whitespace-pre-line">
                                {renderText(item.answer)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No results message */}
        {filteredFAQ.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/40">
              No questions found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}