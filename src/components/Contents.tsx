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

"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css";

import { cn } from "@/lib/utils";

const Contents = () => {
  const images = [
  { 
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", 
    alt: "Modern Office Interior" 
  },
  { 
    src: "https://images.unsplash.com/photo-1765748292453-be1838360416?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    alt: "Minimalist Architecture" 
  },
  { 
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", 
    alt: "Skyscraper Facade" 
  },
  { 
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80", 
    alt: "Professional Workspace" 
  },
  { 
    src: "https://images.unsplash.com/photo-1766506366613-22641a82be26?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    alt: "Abstract Geometry" 
  }
];

  return (
    <section id="team" className="py-20 lg:py-32 bg-[#f5f4f3]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Take a look of our contents
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate experts dedicated to bringing your vision to life.
          </p>
        </div>
        
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          <Carousel_003 images={images} loop={true} showNavigation={true} autoplay={true} />
        </div>
      </div>
    </section>
  );
};

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
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
  .Carousal_003 {
    width: 100%;
    height: 450px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    border-radius: 1.5rem;
    overflow: hidden;
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
      className={cn("relative w-full max-w-5xl px-5", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        // autoplay={autoplay ? { delay: 2500, disableOnInteraction: false } : false}
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        // loop={loop}
        
        /* CORE FIXES:
           1. loopedSlides: Forces Swiper to clone enough slides to populate both sides.
           2. loopAdditionalSlides: Adds extra buffer for smooth 3D perspective.
           3. watchSlidesProgress: Prevents blank rendering or "random" slide jumps.
        */
        // loopedSlides={images.length} 
        loopAdditionalSlides={5}    
        watchSlidesProgress={true}  
        
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
        {images.map((image, index) => (
          <SwiperSlide key={`team-slide-${index}`}>
            <img className="h-full w-full object-cover" src={image.src} alt={image.alt} />
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

export default Contents;
