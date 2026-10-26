import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Lightbulb, MonitorPlay, Play, Scissors } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolioData";
import Process from "@/components/Process";
import { LazyVideo } from "@/components/motion/LazyVideo";
import { buildPlaylist, embedUrl, isVertical, videoPoster, youTubeId, type PlaylistEntry } from "@/lib/video";
import { MediaCursorProvider } from "./MediaCursor";
import { MediaLightbox, type LightboxItem } from "./MediaLightbox";
import { Approach, CaseHero, ClosingCta, FannedStack, ShowcaseSection, Ticker, WorkSection, nextProjectOf } from "./CaseStudyParts";
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

        <ClosingCta
          eyebrow="Your story next"
          title="Got a story worth"
          accent="stopping the scroll for?"
          body="Let's create it. From the first hook to the final cut, we'll make video your audience can't swipe past."
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

