import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Clapperboard, Lightbulb, MonitorPlay, Play, Scissors } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolioData";
import Process from "@/components/Process";
import { Reveal } from "@/components/motion/Reveal";
import { LazyVideo } from "@/components/motion/LazyVideo";
import { buildPlaylist, embedUrl, isVertical, videoPoster, youTubeId, type PlaylistEntry } from "@/lib/video";
import { MediaCursorProvider, useMediaCursor } from "./MediaCursor";
import { MediaLightbox, type LightboxItem } from "./MediaLightbox";
import { Approach, CaseHero, ClosingCta, Eyebrow, FannedStack, ShowcaseSection, Ticker, WorkSection, nextProjectOf } from "./CaseStudyParts";
import { PosterImage } from "./VideoTile";
import { VideoCollection } from "./VideoShowcase";

const PROCESS_ICONS = [Lightbulb, Clapperboard, Scissors, MonitorPlay];

/**
 * Cinematic case-study layout for projects with video sections. Everything it shows comes from
 * the project's data (sections, videos, optional `story`); missing story parts are simply skipped.
 */
export function VideoCaseStudy({ project }: { project: PortfolioProject }) {
  const sections = useMemo(() => project.videoSections ?? [], [project]);
  const playlist = useMemo(() => buildPlaylist(sections), [sections]);
  const lightboxItems = useMemo(() => playlist.map(toLightboxItem), [playlist]);
  const story = project.story;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setOpenIndex(i), []);

  const bySrc = (src?: string) => playlist.find((e) => e.video.src === src);
  const picked = (story?.heroVideos ?? []).map(bySrc).filter((e): e is PlaylistEntry => !!e);
  const heroEntries = picked.length ? picked : playlist.filter((e) => isVertical(e.video)).slice(0, 3);
  const showreel = bySrc(story?.showreel) ?? playlist.find((e) => !isVertical(e.video)) ?? playlist[0];

  // Section → its slice of the playlist.
  let offset = 0;
  const sectionEntries = sections.map((s) => {
    const slice = playlist.slice(offset, offset + s.videos.length);
    offset += s.videos.length;
    return slice;
  });

  return (
    <MediaCursorProvider>
      <main className="min-w-0 flex-1">
        <CaseHero
          project={project}
          deliverables={`${playlist.length} videos`}
          primary={{ label: "Watch the showreel", icon: Play, onClick: () => showreel && open(showreel.index) }}
          visual={(still) => (
            <FannedStack
              still={still}
              aspect="aspect-[9/16]"
              cursor={{ label: "Play", kind: "play" }}
              badge={{ value: playlist.length, label: "Videos" }}
              caption={heroEntries[0] && { eyebrow: "Now playing", title: heroEntries[0].video.title }}
              cards={heroEntries.map((entry, i) => {
                const poster = videoPoster(entry.video);
                return {
                  key: entry.index,
                  label: `Play video: ${entry.video.title}`,
                  onOpen: () => open(entry.index),
                  content: entry.video.preview ? (
                    <LazyVideo src={entry.video.preview} poster={poster.src} />
                  ) : (
                    <PosterImage src={poster.src} fallback={poster.fallback} eager={i === 0} />
                  ),
                };
              })}
            />
          )}
        />

        <Ticker words={[...new Set(playlist.map((e) => e.video.tag ?? e.section.title))]} />

        {story?.approach && <Approach statement={story.approach.statement} points={story.approach.points} />}

        <WorkSection
          title="Every frame built to"
          accent="stop the scroll"
          description={`${playlist.length} videos across ${sections.length} collections. Tap any one to watch it full screen.`}
          collections={sections.map((s) => ({ title: s.title, count: s.videos.length }))}
        >
          {sections.map((s, i) => (
            <ShowcaseSection
              key={s.title}
              title={s.title}
              description={s.description}
              number={i + 1}
              total={sections.length}
              stats={[
                { label: "Videos", value: String(s.videos.length) },
                { label: "Format", value: s.videos.every(isVertical) ? "9:16" : "16:9" },
              ]}
            >
              <VideoCollection section={s} entries={sectionEntries[i]} onOpen={open} />
            </ShowcaseSection>
          ))}
        </WorkSection>

        {story?.process && story.process.length > 0 && (
          <Process
            id="video-process"
            eyebrow="Creative Process"
            title="From first idea to"
            accent="final cut"
            description="Every video goes through the same four steps, so quality stays high even when we ship fast."
            steps={story.process.map((step, i) => ({ ...step, icon: PROCESS_ICONS[i % PROCESS_ICONS.length] }))}
          />
        )}

        {showreel && <Showreel entry={showreel} onOpen={open} />}

        <ClosingCta
          eyebrow="Your story next"
          title="Got a story worth"
          accent="stopping the scroll for?"
          body="Let's create it. From the first hook to the final cut, we'll make video your audience can't swipe past."
          peeks={playlist
            .filter((e) => isVertical(e.video) && e.video.poster)
            .slice(-2)
            .map((e) => (
              <div key={e.index} className="relative aspect-[9/16]">
                <PosterImage src={e.video.poster} />
              </div>
            ))}
          next={nextProjectOf(project)}
        />
      </main>

      <MediaLightbox items={lightboxItems} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} label="video" />
    </MediaCursorProvider>
  );
}

function toLightboxItem(entry: PlaylistEntry): LightboxItem {
  const { video, section } = entry;
  const vertical = isVertical(video);
  return {
    key: entry.index,
    title: video.title,
    tag: video.tag ?? section.title,
    group: section.title,
    description: section.description,
    thumb: videoPoster(video).src,
    thumbRatio: vertical ? 9 / 16 : 16 / 9,
    frame: vertical ? "9:16" : "16:9",
    render: () => <VideoPlayer entry={entry} />,
  };
}

function VideoPlayer({ entry }: { entry: PlaylistEntry }) {
  const { video } = entry;
  if (youTubeId(video.src)) {
    return (
      <iframe
        src={embedUrl(video.src)}
        title={video.title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={video.src}
      poster={video.poster}
      title={video.title}
      className="absolute inset-0 h-full w-full bg-black object-contain"
      controls
      autoPlay
      playsInline
      preload="auto"
    />
  );
}

/* ─────────────────────────── showreel ─────────────────────────── */

function Showreel({ entry, onOpen }: { entry: PlaylistEntry; onOpen: (i: number) => void }) {
  const reduced = useReducedMotion();
  const cursor = useMediaCursor();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.86, 1]);
  const poster = videoPoster(entry.video, true);

  return (
    <section aria-labelledby="showreel-heading" className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28 lg:py-36">
      <div className="grain absolute inset-0 opacity-[0.09]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_10%,hsl(16_95%_55%/0.25),transparent_70%),radial-gradient(45%_35%_at_5%_95%,hsl(340_80%_50%/0.14),transparent_70%)]" />

      <div className="container relative mx-auto min-w-0 px-4 sm:px-6">
        <div className="mb-10 grid gap-6 sm:mb-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <Reveal>
              <Eyebrow dark>Featured Work · {entry.video.tag ?? entry.section.title}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="showreel-heading" className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
                {entry.video.title}
              </h2>
            </Reveal>
          </div>
          {entry.section.description && (
            <Reveal delay={0.12} className="max-w-sm text-white/60 md:text-right">
              <p>{entry.section.description}.</p>
            </Reveal>
          )}
        </div>

        <motion.div ref={ref} style={{ scale }} className="origin-top will-change-transform">
          <button
            type="button"
            onClick={() => {
              cursor.hide();
              onOpen(entry.index);
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && cursor.show("Watch", "play")}
            onPointerLeave={(e) => e.pointerType === "mouse" && cursor.hide()}
            aria-haspopup="dialog"
            aria-label={`Play video: ${entry.video.title}`}
            className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-black shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:aspect-video sm:rounded-[2rem] [@media(hover:hover)]:cursor-none"
          >
            <div className="absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
              <PosterImage src={poster.src} fallback={poster.fallback} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex h-20 w-20 items-center justify-center sm:h-28 sm:w-28">
                <span className="bg-ember absolute inset-0 animate-ping rounded-full opacity-25 [animation-duration:2.4s] motion-reduce:animate-none" />
                <span className="bg-ember relative flex h-full w-full items-center justify-center rounded-full shadow-[0_20px_60px_-10px_hsl(8_90%_50%/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                  <Play className="h-7 w-7 translate-x-[2px] fill-white text-white sm:h-9 sm:w-9" />
                </span>
              </span>
            </div>
            <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-white/75 sm:bottom-8 sm:left-8 sm:right-8 sm:text-sm">
              <span>Play film</span>
              <span className="tabular-nums">{isVertical(entry.video) ? "9:16" : "16:9"}</span>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

