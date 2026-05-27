import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPortfolioProjectBySlug, type PortfolioGalleryItem } from "@/data/portfolioData";
import { cn } from "@/lib/utils";
import { isPrerenderedDocument } from "@/lib/prerender";
import Seo from "@/components/Seo";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const galleryItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 * i,
      duration: 0.5,
      ease: EASE,
    },
  }),
};

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = getPortfolioProjectBySlug(slug);
  const skipMotionInitial = isPrerenderedDocument();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!project) {
      navigate("/404", { replace: true });
    }
  }, [project, navigate]);

  const gallery = project?.gallery ?? [];
  const activeItem: PortfolioGalleryItem | undefined = gallery[activeIndex];

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? gallery.length - 1 : i - 1));
  }, [gallery.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= gallery.length - 1 ? 0 : i + 1));
  }, [gallery.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext]);

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background min-w-0 w-full max-w-[100vw] overflow-x-clip">
      <Seo
        title={`${project.title} | Thoughtflow Media`}
        description={project.description}
        image={project.image}
        ogType="article"
        canonicalPath={`/portfolio/${project.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          url: `https://thoughtflowmediaa.com/portfolio/${project.slug}`,
          image: project.image,
          publisher: {
            "@type": "Organization",
            name: "Thoughtflow Media",
            url: "https://thoughtflowmediaa.com",
          },
        }}
      />
      <Header />
      <main className="flex-1 pt-24 pb-16 sm:pt-28 md:pt-32 sm:pb-20 min-w-0">
        <motion.div
          className="container mx-auto min-w-0 px-4 sm:px-6 max-w-6xl"
          variants={pageVariants}
          initial={skipMotionInitial ? false : "initial"}
          animate="animate"
        >
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Button
              variant="ghost"
              className="group -ml-2 mb-8 rounded-full text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/#portfolio">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Portfolio
              </Link>
            </Button>
          </motion.div>

          <header className="relative mb-12 sm:mb-14 md:mb-16 min-w-0 py-8 sm:py-10 md:py-12 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent border border-border/40 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
                className="inline-flex items-center px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-xs font-semibold text-primary mb-5 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                {project.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 break-words hyphens-auto leading-tight"
              >
                {project.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.45 }}
                className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-3xl leading-relaxed font-medium"
              >
                {project.description}
              </motion.p>
            </div>
          </header>

          {gallery.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.4 }}
              aria-label="Project gallery"
              className="mb-12 sm:mb-16"
            >
              <h2 className="sr-only">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {gallery.map((item, index) => (
                  <motion.button
                    key={`${item.src}-${index}`}
                    type="button"
                    custom={index}
                    variants={galleryItemVariants}
                    initial="hidden"
                    animate="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    onClick={() => openLightbox(index)}
                    className={cn(
                      "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted text-left",
                      "shadow-soft ring-1 ring-border/60 transition-all duration-500",
                      "hover:shadow-medium hover:ring-primary/20 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      index === 0 &&
                        "sm:col-span-2 lg:col-span-2 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]",
                    )}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-3 left-3 right-3 text-xs font-medium text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 line-clamp-2">
                      {item.alt}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {project.videoSections && project.videoSections.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: gallery.length > 0 ? 0.35 : 0.28, duration: 0.4 }}
              className={cn(
                "space-y-14 sm:space-y-16 md:space-y-20",
                gallery.length === 0 && "mt-0"
              )}
            >
              {project.videoSections.map((section, sectionIndex) => (
                <motion.section
                  key={`video-section-${sectionIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + sectionIndex * 0.1, duration: 0.5 }}
                  aria-label={`${section.title} videos`}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-muted-foreground text-base sm:text-lg">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "grid gap-4 md:gap-5",
                      section.videos.some((v) => v.aspectRatio === "9:16")
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1 lg:grid-cols-2",
                    )}
                  >
                    {section.videos.map((video, videoIndex) => (
                      <motion.div
                        key={`video-${sectionIndex}-${videoIndex}`}
                        custom={videoIndex}
                        variants={galleryItemVariants}
                        initial="hidden"
                        animate="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        className={cn(
                          "group relative overflow-hidden rounded-2xl bg-muted",
                          "shadow-soft ring-1 ring-border/60 transition-all duration-500",
                          "hover:shadow-medium hover:ring-primary/20 hover:-translate-y-1",
                          video.aspectRatio === "16:9" && "aspect-video",
                          video.aspectRatio === "9:16" && "aspect-[9/16]",
                          video.aspectRatio === "1:1" && "aspect-square",
                          !video.aspectRatio && "aspect-video",
                        )}
                      >
                        <iframe
                          src={video.src}
                          title={video.title}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </motion.div>
          )}

          {project.imageSections && project.imageSections.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: gallery.length > 0 ? 0.35 : 0.28, duration: 0.4 }}
              className={cn(
                "space-y-14 sm:space-y-16 md:space-y-20",
                gallery.length === 0 && "mt-0"
              )}
            >
              {project.imageSections.map((section, sectionIndex) => (
                <motion.section
                  key={`image-section-${sectionIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + sectionIndex * 0.1, duration: 0.5 }}
                  aria-label={`${section.title} images`}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-muted-foreground text-base sm:text-lg">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {section.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                      {section.images.map((image, imageIndex) => (
                        <motion.button
                          key={`image-${sectionIndex}-${imageIndex}`}
                          type="button"
                          custom={imageIndex}
                          variants={galleryItemVariants}
                          initial="hidden"
                          animate="visible"
                          viewport={{ once: true, margin: "-40px" }}
                          onClick={() => openLightbox(imageIndex)}
                          className={cn(
                            "group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/60 via-secondary/40 to-background text-left flex items-center justify-center",
                            "shadow-lg hover:shadow-2xl ring-1 ring-border/40 transition-all duration-500",
                            "hover:ring-primary/30 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "min-h-[350px] backdrop-blur-sm border border-gradient-to-r from-primary/10 via-transparent to-primary/10"
                          )}
                        >
                          {/* Glow effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                          </div>

                          <img
                            src={image.src}
                            alt={image.alt}
                            className="h-auto w-auto max-h-[600px] max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03] p-6 relative z-10"
                            loading="lazy"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="pointer-events-none absolute bottom-4 left-4 right-4 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 line-clamp-2 drop-shadow-md">
                            {image.alt}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-secondary/60 via-secondary/40 to-background p-12 border border-border/40 ring-1 ring-border/40">
                      <p className="text-muted-foreground text-center font-medium">No images available in this section yet</p>
                    </div>
                  )}
                </motion.section>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className={cn(
            "max-w-[min(calc(100vw-1rem),1200px)] w-[calc(100vw-1rem)] sm:w-full max-h-[90dvh] border-0 bg-transparent p-0 shadow-none",
            "[&>button]:hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          )}
          onPointerDownOutside={() => setLightboxOpen(false)}
        >
          <DialogTitle className="sr-only">
            {activeItem ? `${project.title} — ${activeItem.alt}` : "Image preview"}
          </DialogTitle>
          <div className="relative rounded-2xl overflow-hidden bg-primary/95 ring-1 ring-white/10 shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur-sm transition hover:bg-background"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>

            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative"
                >
                  <img
                    src={activeItem.src}
                    alt={activeItem.alt}
                    className="max-h-[min(70dvh,78vh,820px)] w-full max-w-full object-contain bg-black/20"
                  />
                  <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 sm:px-6 pb-4 sm:pb-5 pt-10 sm:pt-12 text-xs sm:text-sm text-white/95 line-clamp-3 sm:line-clamp-none">
                    {activeItem.alt}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur-sm transition hover:bg-background md:left-4"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur-sm transition hover:bg-background md:right-4"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1.5">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to image ${i + 1}`}
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === activeIndex ? "w-6 bg-primary-foreground" : "w-1.5 bg-primary-foreground/35 hover:bg-primary-foreground/60",
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioDetail;
