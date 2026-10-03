import { useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Youtube } from "./BrandIcons";
import { YOUTUBE_URL } from "./utils/links";
import {
  PINNED_SHORT_ID,
  selectShorts,
  splitTitle,
  shortEmbedUrl,
  shortFallbackThumbnailUrl,
  shortThumbnailUrl,
  type ShortItem,
} from "./utils/shorts";
import shortsFeed from "../data/shorts.json";

type ShortsProps = {
  /** Feed items; defaults to the JSON synced at build time by scripts/fetch-shorts.mjs. */
  items?: ShortItem[];
};

export function Shorts({ items = shortsFeed.items }: ShortsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const shorts = selectShorts(items);

  if (shorts.length === 0) return null;

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
                  playing={activeId === short.id}
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
    </section>
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
