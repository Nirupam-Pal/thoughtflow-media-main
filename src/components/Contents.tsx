// import { Linkedin, Twitter } from "lucide-react";

// const teamMembers = [
//   {
//     name: "Sarah Johnson",
//     role: "Founder & CEO",
//     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
//     bio: "10+ years in digital marketing and brand strategy",
//     linkedin: "#",
//     twitter: "#"
//   },
//   {
//     name: "Michael Chen",
//     role: "Creative Director",
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
//     bio: "Award-winning content creator and visual storyteller",
//     linkedin: "#",
//     twitter: "#"
//   },
//   {
//     name: "Emily Rodriguez",
//     role: "Performance Marketing Lead",
//     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
//     bio: "Data-driven strategist with proven ROI results",
//     linkedin: "#",
//     twitter: "#"
//   },
//   {
//     name: "David Kim",
//     role: "Lead Developer",
//     image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
//     bio: "Full-stack engineer specializing in modern web solutions",
//     linkedin: "#",
//     twitter: "#"
//   }
// ];

// const Team = () => {
//   return (
//     <section id="team" className="py-20 lg:py-32 bg-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16 animate-fade-in">
//           <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
//             Meet Our Team
//           </h2>
//           <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
//             Passionate experts dedicated to bringing your vision to life
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
//           {teamMembers.map((member, index) => (
//             <div 
//               key={index}
//               className="group animate-fade-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
//                 <img 
//                   src={member.image} 
//                   alt={member.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
//                   <a 
//                     href={member.linkedin}
//                     className="p-2 bg-primary-foreground text-primary rounded-full hover:scale-110 transition-transform"
//                     aria-label="LinkedIn"
//                   >
//                     <Linkedin className="h-5 w-5" />
//                   </a>
//                   <a 
//                     href={member.twitter}
//                     className="p-2 bg-primary-foreground text-primary rounded-full hover:scale-110 transition-transform"
//                     aria-label="Twitter"
//                   >
//                     <Twitter className="h-5 w-5" />
//                   </a>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
//                 <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
//                 <p className="text-sm text-muted-foreground">{member.bio}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Team;


// const images = [
//   { 
//     src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", 
//     alt: "Modern Office Interior" 
//   },
//   { 
//     src: "https://images.unsplash.com/photo-1765748292453-be1838360416?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
//     alt: "Minimalist Architecture" 
//   },
//   { 
//     src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", 
//     alt: "Skyscraper Facade" 
//   },
//   { 
//     src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80", 
//     alt: "Professional Workspace" 
//   },
//   { 
//     src: "https://images.unsplash.com/photo-1766506366613-22641a82be26?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
//     alt: "Abstract Geometry" 
//   }
// ];

// src/components/Contents.tsx
"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, Play, X } from "lucide-react";
import React, { useState } from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/effect-cards";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Local Video Paths
const localVideos = [
  "/videos/1.mp4",
  "/videos/2.mp4",
  "/videos/3.mp4",
  "/videos/4.mp4",
  "/videos/5.mp4",
  "/videos/6.mp4",
  "/videos/7.mp4",
  "/videos/8.mp4",
  "/videos/9.mp4",
  "/videos/10.mp4",
  "/videos/11.mp4",
  "/videos/12.mp4",
];

// Base images
const baseImages = [
  {
    src: "",
    alt: "Modern Office Interior"
  },
  {
    src: "",
    alt: "Minimalist Architecture"
  },
  {
    src: "",
    alt: "Skyscraper Facade"
  },
  {
    src: "",
    alt: "Professional Workspace"
  },
  {
    src: "",
    alt: "Abstract Geometry"
  }
];

const images = [
  {
    src: "/posters/1.jpg",
    alt: "Modern Office Interior"
  },
  {
    src: "/posters/2.jpg",
    alt: "Minimalist Architecture"
  },
  {
    src: "/posters/3.jpg",
    alt: "Skyscraper Facade"
  },
  {
    src: "/posters/4.jpg",
    alt: "Professional Workspace"
  },
  {
    src: "/posters/5.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/6.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/7.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/8.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/9.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/10.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/11.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/12.jpg",
    alt: "Abstract Geometry"
  },
  {
    src: "/posters/13.jpg",
    alt: "Abstract Geometry"
  },
];

const contentItems = localVideos.map((videoPath, index) => ({
  videoSrc: videoPath,
  ...baseImages[index % baseImages.length]
}));

const Contents = () => {
  const [openVideoSrc, setOpenVideoSrc] = useState<string | null>(null);

  return (
    <section id="team" className="py-16 sm:py-20 lg:py-32 bg-[#f5f4f3] overflow-x-clip">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Take a look of our high<br />
            ROI-driven Ad Videos
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Highly engineered ROI-driven Ad videos (90% better performance)
          </p>
        </div>

        <div className="flex flex-col h-full w-full items-center justify-center overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center font-display">Video Production</h3>
          <Carousel_003
            items={contentItems}
            loop={true}
            showNavigation={true}
            autoplay={!openVideoSrc}
            onItemClick={(src) => setOpenVideoSrc(src)}
          />
        </div>

        <Dialog open={!!openVideoSrc} onOpenChange={(open) => !open && setOpenVideoSrc(null)}>
          {/* CHANGED: Changed sm:max-w-[450px] to max-w-fit to allow wider videos */}
          <DialogContent className="max-w-[calc(100vw-1rem)] sm:max-w-[90vw] p-2 sm:p-0 bg-transparent border-none shadow-none flex flex-col items-center justify-center outline-none">
            <DialogTitle className="sr-only">Project Video</DialogTitle>
            <DialogDescription className="sr-only">Video Player Overlay</DialogDescription>

            {openVideoSrc && (
              /* CHANGED: Removed aspect-[9/16] and fixed width/height constraints. 
                 Added max viewport constraints and flex centering. */
              <div className="relative max-w-full rounded-2xl overflow-hidden bg-black shadow-2xl z-10 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenVideoSrc(null);
                  }}
                  className="
                    fixed 
                    top-3
                    right-3
                    sm:top-5 
                    sm:right-5 
                    z-[100] 
                    p-2.5
                    sm:p-3 
                    bg-black/60 
                    hover:bg-black/80 
                    backdrop-blur-md 
                    rounded-full 
                    text-white 
                    border border-white/20
                    shadow-xl
                    transition-transform
                    hover:scale-110
                    active:scale-95
                  "
                  style={{ pointerEvents: 'auto' }}
                  aria-label="Close video"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* CHANGED: Removed w-full h-full wrapper div */}
                <video
                  src={openVideoSrc}
                  className="w-full max-w-full h-auto max-h-[min(85dvh,85vh)] object-contain"
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col h-full w-full min-w-0 items-center justify-center overflow-x-clip overflow-y-hidden mt-8 sm:mt-10 bg-[#f5f4f3] px-1">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center font-display">Ad posters that brings enrollments <br /> (50% better performance)</h3>
        <Carousel_001 className="" images={images} showPagination loop autoplay />
      </div>
    </section>
  );
};

const Carousel_003 = ({
  items,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = true,
  spaceBetween = 0,
  onItemClick,
}: {
  items: { src: string; alt: string; videoSrc: string | null }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  onItemClick?: (src: string) => void;
}) => {
  const css = `
  .Carousal_003 {
    width: 100%;
    height: min(52vh, 420px);
    padding-bottom: 2.5rem !important;
  }

  @media (min-width: 640px) {
    .Carousal_003 {
      height: min(48vh, 440px);
    }
  }

  @media (min-width: 1024px) {
    .Carousal_003 {
      height: 450px;
    }
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: min(88vw, 300px);
    max-width: 300px;
    border-radius: 1.5rem;
    overflow: hidden;
    cursor: pointer;
  }

  @media (min-width: 640px) {
    .Carousal_003 .swiper-slide {
      width: min(72vw, 300px);
    }
  }

  @media (min-width: 1024px) {
    .Carousal_003 .swiper-slide {
      width: 300px;
    }
  }

  .swiper-button-next, .swiper-button-prev {
    background: rgba(255, 255, 255, 0.9);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: black !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 20;
  }

  .swiper-button-next:hover, .swiper-button-prev:hover {
    background: white;
    transform: scale(1.1);
  }

  .swiper-pagination-bullet-active {
    background: #000 !important;
  }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn("relative w-full max-w-5xl min-w-0 px-3 sm:px-5", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={loop}
        loopAdditionalSlides={5}
        watchSlidesProgress={true}
        autoplay={autoplay ? {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        } : false}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={showPagination ? { clickable: true } : false}
        navigation={showNavigation ? { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } : false}
        className="Carousal_003"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={`content-slide-${index}`}
            onClick={() => item.videoSrc && onItemClick?.(item.videoSrc)}
          >
            <div className="relative w-full h-full group">
              <video
                className="h-full w-full object-cover"
                src={item.videoSrc || ""}
                autoPlay
                muted
                loop
                playsInline
              />

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {showNavigation && (
          <>
            <div className="swiper-button-next after:hidden"><ChevronRightIcon className="h-6 w-6" /></div>
            <div className="swiper-button-prev after:hidden"><ChevronLeftIcon className="h-6 w-6" /></div>
          </>
        )}
      </Swiper>
    </motion.div>
  );
};

const Carousel_001 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_001 {
    padding-bottom: 50px !important;
  }
  `;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("w-full max-w-5xl min-w-0 relative px-1 sm:px-0", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: false,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={loop}
        slidesPerView={1.2}
        breakpoints={{
          640: {
            slidesPerView: 1.8,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 40,
          },
        }}
        coverflowEffect={{
          rotate: 0,
          slideShadows: false,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_001"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="h-[min(52vh,360px)] w-full sm:h-[min(50vh,420px)] md:h-[min(55vh,480px)] lg:h-[500px]"
          >
            <img
              className="h-full w-full max-h-full object-contain"
              src={image.src}
              alt={image.alt}
            />
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden">
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_001 };

export default Contents;