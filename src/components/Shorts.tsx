import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Youtube } from "./BrandIcons";
import { YOUTUBE_URL } from "./utils/links";
import {
  PINNED_SHORT_ID,
  selectShorts,
  splitTitle,
  shortEmbedUrl,
  shortFallbackThumbnailUrl,
  shortThumbnailUrl,
  shortWatchUrl,
  shortsData,
  type ShortItem,
} from "./utils/shorts";

type ShortsProps = {
  /** Shorts to choose from; defaults to the static list in utils/shorts.ts. */
  items?: ShortItem[];
};

// Matches the lg breakpoint in index.css, where all four cards fit in a row.
const WIDE_QUERY = "(min-width: 64rem)";

/** True on laptop and desktop widths, where Shorts open in a lightbox. */
function useIsWide() {
  const [isWide, setIsWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(WIDE_QUERY);
    const onChange = () => setIsWide(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isWide;
}

export function Shorts({ items = shortsData }: ShortsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const isWide = useIsWide();
  const shorts = selectShorts(items);

  if (shorts.length === 0) return null;

  // Phones play inside the card (the videos are made for that screen).
  // Wider screens keep small cards and open a large vertical player.
  const inlineId = isWide ? null : activeId;
  const lightboxIndex = isWide ? shorts.findIndex((s) => s.id === activeId) : -1;

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="shorts-scrim text-center space-y-4 mb-12"
        >
          <h2 className="shorts-legible text-3xl lg:text-4xl tracking-tight">
            Learn UnleakTrade in 60 seconds
          </h2>
          <p className="shorts-legible text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Short videos on what the protocol does and how the app works. Start with the intro, then catch up on the latest episodes.
          </p>
        </motion.div>

        <Carousel opts={{ align: "start", containScroll: "trimSnaps" }}>
          <CarouselContent className="shorts-track">
            {shorts.map((short, index) => (
              <CarouselItem key={short.id} className="shorts-slide">
                <ShortCard
                  short={short}
                  index={index}
                  pinned={short.id === PINNED_SHORT_ID}
                  playing={inlineId === short.id}
                  onPlay={() => setActiveId(short.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="shorts-arrows">
              <CarouselPrevious className="shorts-nav border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white" />
              <CarouselNext className="shorts-nav border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white" />
            </div>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shorts-link inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm text-purple-300 hover:border-white/20 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              More on YouTube
            </a>
          </div>
        </Carousel>
      </div>

      <ShortLightbox
        shorts={shorts}
        index={lightboxIndex}
        onSelect={(index) => setActiveId(shorts[index].id)}
        onClose={() => setActiveId(null)}
      />
    </section>
  );
}

type ShortLightboxProps = {
  shorts: ShortItem[];
  /** Index of the Short being played, or -1 when closed. */
  index: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

function ShortLightbox({ shorts, index, onSelect, onClose }: ShortLightboxProps) {
  const short = index >= 0 ? shorts[index] : undefined;
  const step = (delta: number) => onSelect((index + delta + shorts.length) % shorts.length);

  return (
    <Dialog open={short !== undefined} onOpenChange={(open) => !open && onClose()}>
      {short && (
        <DialogContent
          className="shorts-lightbox"
          aria-describedby={undefined}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous Short"
              className="shorts-step flex items-center justify-center rounded-full border border-white/10 bg-black/50 text-white hover:border-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="shorts-stage rounded-2xl border border-white/10 overflow-hidden">
              <iframe
                key={short.id}
                src={shortEmbedUrl(short.id)}
                title={short.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full border-0"
              />
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next Short"
              className="shorts-step flex items-center justify-center rounded-full border border-white/10 bg-black/50 text-white hover:border-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 px-14">
            <DialogTitle className="shorts-lightbox-title text-base text-white">
              {short.title}
            </DialogTitle>
            <a
              href={shortWatchUrl(short.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="shorts-link inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-300 shrink-0"
            >
              Watch on YouTube
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

type ShortCardProps = {
  short: ShortItem;
  index: number;
  pinned: boolean;
  playing: boolean;
  onPlay: () => void;
};

function ShortCard({ short, index, pinned, playing, onPlay }: ShortCardProps) {
  const { headline, series } = splitTitle(short.title);
  const badge = pinned ? "Start here" : series;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="shorts-card rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-all"
    >
      {playing ? (
        <iframe
          src={shortEmbedUrl(short.id)}
          title={short.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play: ${short.title}`}
          className="shorts-trigger absolute inset-0 w-full h-full text-left"
        >
          <img
            src={shortThumbnailUrl(short.id)}
            alt=""
            loading="lazy"
            onError={(event) => {
              const img = event.currentTarget;
              const fallback = shortFallbackThumbnailUrl(short.id);
              if (img.src !== fallback) img.src = fallback;
            }}
            className="shorts-poster absolute inset-0 w-full h-full object-cover"
          />
          <div className="shorts-shade absolute inset-0" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="shorts-play flex items-center justify-center rounded-full border border-white/20 backdrop-blur-sm">
              <Play className="w-6 h-6" fill="currentColor" aria-hidden="true" />
            </span>
          </div>

          <div className="shorts-legible absolute inset-x-0 bottom-0 p-5 space-y-2">
            {badge && (
              <div className="text-xs uppercase tracking-wide text-purple-300">{badge}</div>
            )}
            <div className="shorts-headline text-base tracking-tight">{headline}</div>
          </div>
        </button>
      )}
    </motion.div>
  );
}
