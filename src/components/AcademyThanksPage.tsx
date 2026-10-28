import { Link } from "react-router";
import { ArrowLeft, MailCheck } from "lucide-react";
import { RISK_NOTICE } from "./AcademyPage";
import { TELEGRAM_URL } from "./utils/links";

// Thank-you page after buying the Wick Masters full guide. It only says what
// happens next and reads nothing from the URL, so it is safe to render on the
// server and to land on directly.
export function AcademyThanksPage() {
  return (
    <div className="min-h-screen text-white">
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative glass-card border border-white/10 rounded-3xl p-6 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="relative space-y-6">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-400/20 flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              </div>
              <h1 className="text-3xl lg:text-4xl tracking-tight">
                Thanks, your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Wick Masters
                </span>{" "}
                guide is on its way
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Check the inbox of the email address you used at checkout. Your download links for the full guide
                and the 10 cheat sheets arrive from UnleakTrade Academy, usually within a minute.
              </p>
              <p className="text-white/70 leading-relaxed">
                Nothing after 10 minutes? Look in your spam folder first. Still nothing: message us on{" "}
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors"
                >
                  Telegram
                </a>{" "}
                with the email address you used and we will resend the links.
              </p>
              <Link
                to="/academy"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to the Academy
              </Link>
            </div>
          </div>

          <aside aria-label="Risk notice" className="glass-card border border-white/20 rounded-2xl p-8 mt-12">
            <p className="text-white/80 leading-relaxed">{RISK_NOTICE}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
