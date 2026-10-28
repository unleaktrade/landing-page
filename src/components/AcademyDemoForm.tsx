import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MailCheck, Send } from "lucide-react";
import { isValidEmail } from "./utils/validation";
import { TELEGRAM_URL, TURNSTILE_SITE_KEY, WICKMASTERS_DEMO_WEBHOOK_URL } from "./utils/links";
import { loadTurnstile } from "./utils/turnstile";
import type { TurnstileApi } from "./utils/turnstile";

type Status = "idle" | "sending" | "sent" | "error";

// Free demo request: the email goes to an Airtable webhook, which logs it in
// the Orders table and emails the download link. Airtable sends no CORS
// headers we can rely on, so the POST is a `no-cors` simple request with a
// form-urlencoded body (a safelisted content type Airtable accepts; it rejects
// text/plain, and JSON would need a preflight): the response is opaque and
// only a network failure counts as an error. A Cloudflare Turnstile token rides along in the body and
// the automation verifies it server-side before doing anything, then dedupes
// and rate-limits on its side.
export function AcademyDemoForm() {
  const [email, setEmail] = useState("");
  // Honeypot: hidden from people and assistive tech, bots tend to fill it.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState(false);
  // Turnstile token: single use, valid for 5 minutes. Empty until the
  // (usually invisible) challenge passes.
  const [token, setToken] = useState("");
  const [waitingForCheck, setWaitingForCheck] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<{ api: TurnstileApi; id?: string }>();

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !widgetRef.current) return;
        const id = api.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: "free-demo",
          theme: "dark",
          appearance: "interaction-only",
          callback: (t) => {
            setToken(t);
            setWaitingForCheck(false);
          },
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
        turnstileRef.current = { api, id };
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      turnstileRef.current?.api.remove(turnstileRef.current.id);
      turnstileRef.current = undefined;
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    if (!token) {
      setWaitingForCheck(true);
      return;
    }
    setStatus("sending");
    try {
      await fetch(WICKMASTERS_DEMO_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        // URLSearchParams sets Content-Type: application/x-www-form-urlencoded.
        body: new URLSearchParams({ email: value, website, source: "academy", token }),
      });
      setStatus("sent");
    } catch {
      // The token may have been consumed: get a fresh one for the retry.
      setToken("");
      turnstileRef.current?.api.reset(turnstileRef.current.id);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="academy-demo-form flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <MailCheck className="w-5 h-5 flex-shrink-0 text-cyan-400" aria-hidden="true" />
        <p className="text-white/80 text-sm leading-relaxed">
          Check your inbox: the download link for the free demo is on its way from UnleakTrade Academy, usually
          within a minute. Nothing after 10 minutes? Look in your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="academy-demo-form">
      <label htmlFor="academy-demo-email" className="block text-white/80 text-sm mb-2">
        Email address for the free demo
      </label>
      <div className="academy-demo-row">
        <input
          id="academy-demo-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={invalid}
          aria-describedby={invalid ? "academy-demo-error" : undefined}
          disabled={status === "sending"}
          className={`academy-demo-input rounded-lg border bg-white/5 text-white placeholder:text-white/30 ${
            invalid ? "border-red-500/50" : "border-white/20"
          }`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="academy-demo rounded-lg border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4 flex-shrink-0" />
          <span>{status === "sending" ? "Sending..." : "Email me the demo"}</span>
        </button>
      </div>
      <div className="academy-hp" aria-hidden="true">
        <label htmlFor="academy-demo-website">Website</label>
        <input
          id="academy-demo-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div ref={widgetRef} className="mt-2" />
      {invalid && (
        <p id="academy-demo-error" className="text-red-400 text-sm mt-2">
          Enter a valid email address.
        </p>
      )}
      {waitingForCheck && (
        <p role="status" className="text-white/70 text-sm mt-2">
          Checking that you are human. Submit again in a few seconds.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-red-400 text-sm mt-2">
          We could not send your request. Check your connection and try again, or message us on{" "}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline">
            Telegram
          </a>
          .
        </p>
      )}
      <p className="text-white/60 text-xs mt-2">We use your email to send you the download link.</p>
    </form>
  );
}
