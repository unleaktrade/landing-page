import { motion } from "motion/react";
import { useParams } from "react-router-dom";
import { Linkedin, Twitter, Github, ArrowUpRight, Send, Hash } from "lucide-react";
import { useEffect } from "react";
import julienImage from "figma:asset/524423e86081819620c9996fd40046b079ec4ba8.png";
import guilhemImage from "figma:asset/754dfe5f69f5a54353b7b1fdaa778a4363ded25d.png";

interface TeamMember {
  name: string;
  role: string;
  location: string;
  tagline: string;
  summary: string;
  biography: string;
  expertise: string[];
  handle?: string;
  links: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    telegram?: string;
    discord?: string;
  };
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Julien SIE",
    role: "CEO / CTO",
    location: "France",
    tagline: "Engineering trust at scale.",
    summary: "Visionary tech entrepreneur with deep expertise in blockchain and token engineering, leading high-performing teams to design scalable architectures and transform complex systems into secure, value-driven solutions.",
    biography: "As CEO and CTO of UnleakTrade, Julien drives the strategic and technical vision behind a next-generation crypto trading platform that blends transparency, scalability, and intelligent automation. His leadership focuses on building a secure, high-performance ecosystem for digital asset trading, leveraging cutting-edge blockchain, AI, and token engineering principles. With deep expertise in decentralized finance, scalable architectures, and smart contract design, he oversees the full lifecycle of product innovation — from infrastructure and data systems to user experience and market strategy. His work ensures reliability, efficiency, and long-term value creation across all aspects of the platform. His pragmatic, innovation-driven approach continues to propel UnleakTrade's mission to redefine the future of crypto trading through engineering excellence and strategic vision.",
    expertise: ["Blockchain", "TokenEngineering", "DevOps", "DeFi", "ScalableArchitecture", "SmartContracts", "Fundraising", "Investment", "Leadership", "ProductStrategy"],
    handle: "@_whyvrafvr",
    links: {
      linkedin: "https://www.linkedin.com/in/julien-sie-jsie/",
      twitter: "https://x.com/_whyvrafvr",
      github: "https://github.com/whyvrafvr",
      telegram: "https://t.me/whyvrafvr"
    },
    image: julienImage
  },
  {
    name: "Guilhem BERTHALON",
    role: "COO / CMO",
    location: "France",
    tagline: "From execution to adoption.",
    summary: "Crypto-enthusiast passionate about blockchain innovation, leading international teams with deep expertise in IT architecture, digital transformation, cloud, and cybersecurity. Expert in leadership, innovation, and team scaling with a human-centered approach.",
    biography: "With over 13 years leading international teams of 80+ IT experts, Guilhem brings exceptional expertise in IT architecture, digital transformation, CRM systems, cloud solutions, and cybersecurity to UnleakTrade. A passionate crypto-enthusiast deeply invested in blockchain innovation across SOL, SUI, EVM, and Aptos ecosystems, he combines technical mastery with strategic vision. As an application architect and technical project manager, he has driven international expansion and managed complex projects for both public and private clients. An expert in leadership, innovation, and team scaling, he combines strategic vision with a human-centered approach to ensure performance and regulatory compliance. Recognized for excellence in project management and RFPs, he fosters sustainable value creation through innovative technological solutions.",
    expertise: ["Blockchain", "ITArchitecture", "DigitalTransformation", "Cloud", "Cybersecurity", "Leadership", "TeamScaling", "ProjectManagement"],
    handle: "@krokko7777",
    links: {
      linkedin: "https://www.linkedin.com/in/guilhem-berthalon/",
      twitter: "https://x.com/krokko7777"
    },
    image: guilhemImage
  },
  {
    name: "Abdulrazaq ALI",
    role: "Head of Growth & Community",
    location: "Nigeria",
    tagline: "Signal beats noise.",
    summary: "Growth and community strategist with 4+ years of hands-on experience building, filtering, and scaling crypto communities across Solana, Kaspa, and Web3 ecosystems.",
    biography: "Growth and community strategist with 4+ years of hands-on experience building, filtering, and scaling crypto communities across Solana, Kaspa, and Web3 ecosystems. Background includes FlashBlock, CryptoSky, Kasanova, BritCard, and multiple early stage protocols. Specializes in signal-led distribution on X, manual vetting, and private Discord/Telegram execution designed to attract serious traders, contributors, and long-term participants. Optimizes for leverage over vanity metrics through positioning, funnels, and execution loops that compound trust, participation, and depth.",
    expertise: ["GrowthFunnels", "XDistribution", "NarrativeControl", "CommunityOperations", "ContributorFiltering", "GoToMarket", "Solana", "Kaspa", "Web3", "SignalLedStrategy"],
    handle: "@Razzyox",
    links: {
      twitter: "https://x.com/Razzyox",
      telegram: "https://t.me/RAZZY_OX"
    }
  }
];

export function TeamPage() {
  const { memberId } = useParams<{ memberId?: string }>();

  // Scroll to team member if memberId param is present
  useEffect(() => {
    if (memberId) {
      setTimeout(() => {
        const element = document.getElementById(`team-${memberId}`);
        if (element) {
          const navHeight = 64; // Height of fixed navigation bar (h-16 = 64px)
          const extraPadding = 80; // Extra breathing room for better visibility
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navHeight - extraPadding;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [memberId]);

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
            <p className="text-white/40 mb-4">Meet the team</p>
            <h1 className="text-white mb-6">Building the future of private OTC trading.</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              A distributed team of crypto veterans, protocol architects, and operators bringing institutional-grade privacy to decentralized markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team members */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {teamMembers.map((member, index) => {
            const memberId = `team-${member.name.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <motion.div
                key={member.name}
                id={memberId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group scroll-mt-24"
              >
                {/* Card */}
                <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 hover:border-white/20 transition-all duration-500">
                  {/* Gradient glow on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 mx-auto md:mx-0">
                          {/* Gradient border */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-purple-400 to-cyan-400 opacity-80" />
                          {/* Avatar */}
                          <div className="relative m-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center overflow-hidden">
                            {member.image ? (
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
                            ) : (
                              <span className="text-white/40 text-4xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="mb-6">
                          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                            <h2 className="text-white">{member.name}</h2>
                            <div className="flex items-center gap-3">
                              <span className="text-white/40 text-sm">{member.location}</span>
                            </div>
                          </div>
                          <p className="text-white/50 mb-2">{member.role}</p>
                          {member.handle && member.links.twitter && (
                            <a 
                              href={member.links.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1 transition-colors"
                            >
                              {member.handle}
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Tagline */}
                        <p className="text-white/90 italic mb-4 text-lg">"{member.tagline}"</p>

                        {/* Summary */}
                        <p className="text-white/70 mb-6 leading-relaxed">{member.summary}</p>

                        {/* Biography */}
                        <div className="mb-6 pb-6 border-b border-white/10">
                          <p className="text-white/40 text-sm mb-3">Background</p>
                          <p className="text-white/60 leading-relaxed">{member.biography}</p>
                        </div>

                        {/* Expertise tags */}
                        <div className="mb-6">
                          <p className="text-white/40 text-sm mb-3">Expertise</p>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((tag, i) => (
                              <span 
                                key={i} 
                                className="relative group/tag px-3 py-1.5 text-sm rounded-full bg-white/[0.03] border border-white/10 text-white/70 hover:text-white/90 transition-colors"
                              >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                                <span className="relative">#{tag}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Social links */}
                        {Object.keys(member.links).length > 0 && (
                          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <span className="text-white/30 text-sm">Connect</span>
                            <div className="flex items-center gap-3">
                              {member.links.linkedin && (
                                <a
                                  href={member.links.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/40 hover:text-white/80 transition-colors"
                                  aria-label="LinkedIn"
                                >
                                  <Linkedin className="w-5 h-5" />
                                </a>
                              )}
                              {member.links.twitter && (
                                <a
                                  href={member.links.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/40 hover:text-white/80 transition-colors"
                                  aria-label="Twitter"
                                >
                                  <Twitter className="w-5 h-5" />
                                </a>
                              )}
                              {member.links.github && (
                                <a
                                  href={member.links.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/40 hover:text-white/80 transition-colors"
                                  aria-label="GitHub"
                                >
                                  <Github className="w-5 h-5" />
                                </a>
                              )}
                              {member.links.telegram && (
                                <a
                                  href={member.links.telegram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/40 hover:text-white/80 transition-colors"
                                  aria-label="Telegram"
                                >
                                  <Send className="w-5 h-5" />
                                </a>
                              )}
                              {member.links.discord && (
                                <a
                                  href={member.links.discord}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/40 hover:text-white/80 transition-colors"
                                  aria-label="Discord"
                                >
                                  <Hash className="w-5 h-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-20 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="relative">
              <p className="text-white/40 mb-3">Join us</p>
              <h2 className="text-white mb-4">Want to build the future with us?</h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                We're always looking for talented individuals who share our vision for private, fair, and trustless trading.
              </p>
              <a
                href="https://discord.com/invite/24mZUAqj4z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Get in touch
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}