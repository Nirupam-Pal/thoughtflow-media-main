import { useCallback, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Clapperboard,
  Code2,
  Compass,
  FlaskConical,
  Images,
  Layers,
  Lightbulb,
  Network,
  Presentation,
  Rocket,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { CaseStudyStory, PortfolioProject } from "@/data/portfolioData";
import Process from "@/components/Process";
import { isUnsplash, unsplashAt } from "@/lib/design";
import { MediaCursorProvider } from "./MediaCursor";
import { MediaLightbox, type LightboxItem } from "./MediaLightbox";
import { Approach, CaseHero, ClosingCta, EditorialGrid, FannedStack, Ticker, WorkSection, nextProjectOf } from "./CaseStudyParts";
import { ArtImage, ImageTile } from "./ImageTile";
import { FeatureBand, FeatureMini } from "./FeatureBands";

type Kind = NonNullable<CaseStudyStory["feature"]>["kind"];

/** Process icons and heading per kind of project, so the steps read in the project's own language. */
const PROCESS: Record<Kind, { icons: LucideIcon[]; title: string; accent: string; description: string }> = {
  campaign: {
    icons: [Compass, Lightbulb, Clapperboard, Rocket],
    title: "From insight to",
    accent: "launch day",
    description: "How the campaign came together, from the first research session to every channel going live.",
  },
  funnel: {
    icons: [Search, BookOpen, Layers, Presentation],
    title: "From audit to",
    accent: "workshop",
    description: "How the training was built around the gaps the team actually had.",
  },
  build: {
    icons: [Search, Network, Code2, BarChart3],
    title: "From research to",
    accent: "results",
    description: "How the site was planned, engineered and measured for long-term organic growth.",
  },
  growth: {
    icons: [ClipboardCheck, Rocket, FlaskConical, TrendingUp],
    title: "From audit to",
    accent: "scale",
    description: "A weekly loop of launching, testing and moving budget to what works.",
  },
};

const DEFAULT_PROCESS = PROCESS.campaign;

/** Remote photos at a given size / crop; local images are already optimised. */
const sized = (src: string, width: number, ratio?: number) => (isUnsplash(src) ? unsplashAt(src, width, ratio) : src);

/**
 * Case-study layout for projects whose work is a photo gallery. Shares its structure with the
 * video and design case studies, and adds a signature animated section chosen by `story.feature`.
 */
export function GalleryCaseStudy({ project }: { project: PortfolioProject }) {
  const story = project.story;
  const feature = story?.feature;
  const galleryTitle = story?.gallery?.title ?? "Project Gallery";
  const entries = useMemo(() => project.gallery.map((item, index) => ({ item, index })), [project]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setOpenIndex(i), []);
  const process = feature ? PROCESS[feature.kind] : DEFAULT_PROCESS;

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      entries.map(({ item, index }) => ({
        key: index,
        title: item.alt,
        tag: item.tag ?? galleryTitle,
        group: galleryTitle,
        description: story?.gallery?.description,
        thumb: sized(item.src, 200, 16 / 10),
        thumbRatio: 16 / 10,
        frame: "free",
        render: () => (
          <img
            src={sized(item.src, 1600)}
            alt={item.alt}
            draggable={false}
            className="max-h-full max-w-full rounded-xl object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          />
        ),
      })),
    [entries, galleryTitle, story?.gallery?.description]
  );

  // "Campaign Highlights" → "Campaign" + accent "Highlights".
  const titleWords = galleryTitle.split(" ");
  const accent = titleWords.length > 1 ? titleWords.pop()! : galleryTitle;
  const lead = titleWords.length > 0 && accent !== galleryTitle ? titleWords.join(" ") : "";

  const tickerWords = [...(feature?.items.map((i) => i.title) ?? []), ...(story?.process?.map((p) => p.title) ?? [])];

  return (
    <MediaCursorProvider>
      <main className="min-w-0 flex-1">
        <CaseHero
          project={project}
          deliverables={`${entries.length} highlights`}
          primary={{ label: "View the gallery", icon: Images, onClick: () => open(0) }}
          visual={(still) => (
            <FannedStack
              still={still}
              aspect="aspect-[4/5]"
              cursor={{ label: "View", kind: "view" }}
              badge={{ value: entries.length, label: "Highlights" }}
              caption={entries[0] && { eyebrow: galleryTitle, title: entries[0].item.alt }}
              cards={entries.slice(0, 3).map(({ item, index }, i) => ({
                key: index,
                label: `View image: ${item.alt}`,
                onOpen: () => open(index),
                content: (
                  <ArtImage
                    src={item.src}
                    ratio={4 / 5}
                    eager={i === 0}
                    sizes="(min-width: 1024px) 280px, 45vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ),
              }))}
            >
              {feature && <FeatureMini feature={feature} still={still} />}
            </FannedStack>
          )}
        />

        {tickerWords.length > 0 && <Ticker words={[...new Set(tickerWords)]} />}

        {story?.approach && <Approach statement={story.approach.statement} points={story.approach.points} />}

        {feature && <FeatureBand feature={feature} image={entries[1]?.item.src ?? entries[0]?.item.src} />}

        {entries.length > 0 && (
          <WorkSection
            title={lead}
            accent={accent}
            description={`${story?.gallery?.description ?? ""} Tap any image to see it full size.`.trim()}
            collections={[{ title: galleryTitle, count: entries.length }]}
          >
            <EditorialGrid
              items={entries}
              keyOf={(e) => e.index}
              render={(e, role) => (
                <ImageTile
                  item={{ ...e.item, tag: e.item.tag ?? galleryTitle }}
                  index={e.index}
                  onOpen={open}
                  noun="image"
                  size={role === "feature" || role === "solo" ? "lg" : "md"}
                  sizes={role === "feature" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                  className={role === "feature" ? "aspect-video lg:aspect-auto lg:h-full" : "aspect-video"}
                />
              )}
            />
          </WorkSection>
        )}

        {story?.process && story.process.length > 0 && (
          <Process
            id="project-process"
            eyebrow="How We Did It"
            title={process.title}
            accent={process.accent}
            description={process.description}
            steps={story.process.map((step, i) => ({ ...step, icon: process.icons[i % process.icons.length] }))}
          />
        )}

        <ClosingCta
          eyebrow="Your project next"
          title={story?.cta?.title ?? "Have a project"}
          accent={story?.cta?.accent ?? "in mind?"}
          body={story?.cta?.body ?? "Let's talk about what you want to build, and how we can help."}
          peeks={entries.slice(-2).map(({ item, index }) => (
            <div key={index} className="relative aspect-[4/5]">
              <img src={sized(item.src, 360, 4 / 5)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
          next={nextProjectOf(project)}
        />
      </main>

      <MediaLightbox items={lightboxItems} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} label="image" />
    </MediaCursorProvider>
  );
}
