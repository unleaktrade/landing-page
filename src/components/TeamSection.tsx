import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Linkedin, Twitter, Github, Send, Hash } from "lucide-react";
import julienImage from "figma:asset/524423e86081819620c9996fd40046b079ec4ba8.png";
import guilhemImage from "figma:asset/754dfe5f69f5a54353b7b1fdaa778a4363ded25d.png";

interface TeamMember {
  name: string;
  role: string;
  location: string;
  tagline: string;
  oneLiner: string;
  focus: string[];
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
    oneLiner: "Visionary architect defining protocol economics, strategic direction, and technical foundations for institutional-grade privacy infrastructure.",
    focus: ["Token engineering & economics", "Protocol vision & strategy", "DeFi architecture", "Smart contracts & systems"],
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
    oneLiner: "Operations and growth leader aligning compliance, partnerships, and go-to-market to drive adoption.",
    focus: ["Ops leadership", "GTM & partnerships", "Compliance", "Growth marketing"],
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
    oneLiner: "Builds growth systems that attract high conviction traders and filter out low signal participation.",
    focus: ["Growth funnels & positioning", "X distribution & narrative control", "Community operations & contributor filtering", "Early-stage go-to-market execution"],
    handle: "@Razzyox",
    links: {
      twitter: "https://x.com/Razzyox",
      telegram: "https://t.me/RAZZY_OX"
    }
  }
];

export function TeamSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-white/40 mb-4">The people behind UnleakTrade</p>
          <h2 className="text-white mb-6">Built by professionals, for professionals.</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            A distributed team of crypto veterans, engineers, and operators bringing institutional-grade privacy to decentralized trading.
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card - clickable to team page */}
              <div
                onClick={() => navigate(`/team/${member.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className="relative h-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  {/* Avatar with gradient border */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      {/* Gradient border */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-purple-400 to-cyan-400 opacity-70" />
                      {/* Avatar placeholder */}
                      <div className="relative m-[2px] w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center overflow-hidden">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
                        ) : (
                          <span className="text-white/40 text-xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white truncate">{member.name}</h3>
                      <p className="text-white/40 text-sm truncate">{member.role}</p>
                      {member.handle && member.links.twitter && (
                        <a
                          href={member.links.twitter}
                          onClick={(e) => { e.stopPropagation(); }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm mt-1 inline-block transition-colors"
                        >
                          {member.handle}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-white/90 italic mb-3">"{member.tagline}"</p>

                  {/* One-liner */}
                  <p className="text-white/60 text-sm mb-4 leading-relaxed">{member.oneLiner}</p>

                  {/* Focus areas */}
                  <div className="space-y-1.5 mb-4">
                    {member.focus.map((item, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="text-cyan-400 flex-shrink-0">•</span>
                        <span className="text-white/50 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social links */}
                  {Object.keys(member.links).length > 0 && (
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {member.links.linkedin && (
                        <a
                          href={member.links.linkedin}
                          onClick={(e) => { e.stopPropagation(); }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.links.twitter && (
                        <a
                          href={member.links.twitter}
                          onClick={(e) => { e.stopPropagation(); }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {member.links.github && (
                        <a
                          href={member.links.github}
                          onClick={(e) => { e.stopPropagation(); }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {member.links.telegram && (
                        <a
                          href={member.links.telegram}
                          onClick={(e) => { e.stopPropagation(); }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                          aria-label="Telegram"
                        >
                          <Send className="w-4 h-4" />
                        </a>
                      )}
                      {member.links.discord && (
                        <a
                          href={member.links.discord}
                          onClick={(e) => { e.stopPropagation(); }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                          aria-label="Discord"
                        >
                          <Hash className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}