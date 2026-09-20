import { twMerge } from "tailwind-merge";
import Marquee from "./ui/marquee";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";



// const testimonials = [
  // {
    // name: "Alex Thompson",
    // role: "CEO, TechStart Inc",
    // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    // content: "Thoughtflow Mediaa transformed our online presence completely. Their strategic approach to content and performance marketing delivered a 300% increase in qualified leads within 3 months.",
    // rating: 5
  // },
  // {
    // name: "Jessica Martinez",
    // role: "Marketing Director, FashionHub",
    // image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    // content: "The team's creativity and attention to detail is unmatched. They created stunning UGC content that resonated perfectly with our audience and drove significant engagement.",
    // rating: 5
  // },
  // {
    // name: "Robert Chang",
    // role: "Founder, GrowthLab",
    // image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    // content: "Working with Thoughtflow Mediaa was a game-changer. Their web development expertise and marketing insights helped us scale from startup to market leader.",
    // rating: 5
  // },
  // {
    // name: "Maria Santos",
    // role: "CMO, EcoProducts",
    // image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    // content: "Professional, responsive, and results-driven. Thoughtflow Mediaa doesn't just deliver projects—they deliver growth. Our ROI has been exceptional.",
    // rating: 5
  // },
  // {
    // name: "James Wilson",
    // role: "VP Sales, CloudSolutions",
    // image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    // content: "The performance marketing campaigns exceeded all expectations. Thoughtflow Mediaa's data-driven approach consistently delivers measurable results.",
    // rating: 5
  // },
  // {
    // name: "Sophia Lee",
    // role: "Brand Manager, StyleCo",
    // image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    // content: "From concept to execution, every project was handled with precision and creativity. Thoughtflow Mediaa is our go-to partner for all marketing needs.",
    // rating: 5
  // }
// ];

const logos = [
  { name: "Vidya Bridge", src: "/logos/1.webp" },
  { name: "Refresh Rays", src: "/logos/2.webp" },
  { name: "Fit Factory", src: "/logos/3.webp" },
  { name: "Aimsas", src: "/logos/4.webp" },
  { name: "The Core Acedemy", src: "/logos/5.webp" },
  { name: "Milestone Institute", src: "/logos/6.webp" },
  { name: "Dr. SK Biology", src: "/logos/7.webp" },
  { name: "Synapse", src: "/logos/8.webp" },
  { name: "Longtharai", src: "/logos/9.webp" },
  { name: "Petuk Somabesh 3.0", src: "/logos/10.webp" },
  { name: "Smoke Of Longtwrai", src: "/logos/11.webp" },
  { name: "Dr. SK Global", src: "/logos/12.webp" },
  { name: "Aadhyan", src: "/logos/13.webp" },
  { name: "Junior", src: "/logos/14.webp" },
  { name: "Untitled 3", src: "/logos/15.webp" },
  { name: "CA ANKITA BORA", src: "/logos/16.webp" },
  { name: "Green Hub", src: "/logos/17.webp" },
  { name: "Rencare Energy", src: "/logos/18.webp" },
  { name: "Prayam Classes", src: "/logos/19.webp" },
  { name: "7 Oceans Centre of Music", src: "/logos/20.webp" },
  { name: "Chessverse", src: "/logos/21.webp" },
  { name: "Dilaas", src: "/logos/22.webp" },
  { name: "NPA", src: "/logos/23.webp" },
  { name: "stylelinepols", src: "/logos/24.webp" },
  { name: "Barat Gro Kids", src: "/logos/25.webp" },
  { name: "Smoke of Longtwrai", src: "/logos/26.webp" },
  { name: "Adflow Productions", src: "/logos/27.webp" },
  { name: "Swaad Korok", src: "/logos/28.webp" },
  { name: "Conjugate", src: "/logos/29.webp" },
  { name: "Saura", src: "/logos/30.webp" },
  { name: "Scented Cafe", src: "/logos/31.webp" },
  { name: "Spaces", src: "/logos/32.webp" },
];

const firstRow = logos.slice(0, logos.length / 2);
const secondRow = logos.slice(logos.length / 2);

// const ReviewCard = ({ image, name, role, content, src }) => {
//   return (
//     <figure
//       className={twMerge(
//         "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-200 p-4 bg-gradient-to-r from-card to-muted hover:from-accent/20 hover:to-secondary/20 transition-all duration-300"
//       )}
//     >
//       <div className="flex flex-row items-center gap-2">
//         <img
//           className="rounded-full bg-white/10"
//           width="32"
//           height="32"
//           alt=""
//           src={src}
//         />
//         <div className="flex flex-col">
//           {/* <figcaption className="text-sm font-medium ">
//             {name}
//           </figcaption> */}
//           {/* <p className="text-xs font-medium text-black/40">{role}</p> */}
//         </div>
//       </div>
//       <blockquote className="mt-2 text-sm">{content}</blockquote>
//     </figure>
//   );
// };

// Plain translucent tiles (no backdrop-filter): the marquee renders each logo
// several times, and blur on that many layers would tank scroll FPS.
const LogoCard = ({ src, name }) => {
  return (
    <div
      className={twMerge(
        "relative flex shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/70 shadow-soft transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-medium",
        "h-24 w-24 p-2 sm:h-28 sm:w-28 sm:p-3 md:h-32 md:w-32"
      )}
    >
      <img
        className="h-full w-full rounded-full object-contain"
        alt={name}
        src={src}
        loading="lazy"
        decoding="async"
        width={96}
        height={96}
      />
    </div>
  );
};

// const Testimonials = () => {
//   return (
//     <section id="clients" className="relative py-20 lg:py-32 bg-secondary/30 overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16 animate-fade-in">
//           <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
//             Trusted by Industry Leaders
//           </h2>
//           <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
//             We've partnered with ambitious brands to drive meaningful growth.
//           </p>
//         </div>

//         <div className="relative flex flex-col items-center justify-center w-full mt-12">
//           {/* First Row Marquee */}
//           <Marquee pauseOnHover className="[--duration:30s]">
//             {firstRow.map((logo) => (
//               <LogoCard key={logo.src} {...logo} />
//             ))}
//           </Marquee>

//           {/* Second Row Marquee */}
//           <Marquee reverse pauseOnHover className="[--duration:30s]">
//             {secondRow.map((logo) => (
//               <LogoCard key={logo.src} {...logo} />
//             ))}
//           </Marquee>

//           {/* Fading Edges */}
//           <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none z-30 bg-gradient-to-r from-secondary/30 to-transparent"></div>
//           <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none z-30 bg-gradient-to-l from-secondary/30 to-transparent"></div>
//         </div>
//       </div>
//     </section>
//   );
// };

const Clients = () => {
  return (
    <section aria-labelledby="clients-heading" id="testimonials" className="section-aurora relative pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 bg-secondary/30 overflow-x-clip overflow-hidden">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          id="clients-heading"
          eyebrow="Our Clients"
          title="Trusted by"
          accent="50+ Brands"
          description="We've partnered with ambitious brands to drive meaningful growth."
        />

        <Reveal className="relative flex flex-col items-center justify-center w-full min-w-0 mt-8 sm:mt-12 overflow-hidden">
          <div className="relative w-full [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]">
            <Marquee pauseOnHover className="[--duration:30s] [--gap:.5rem] sm:[--gap:.75rem] md:[--gap:1rem]">
              {firstRow.map((logo) => (
                <LogoCard key={logo.src} {...logo} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:30s] [--gap:.5rem] sm:[--gap:.75rem] md:[--gap:1rem]">
              {secondRow.map((logo) => (
                <LogoCard key={logo.src} {...logo} />
              ))}
            </Marquee>
          </div>
          <div className="hidden md:block absolute inset-y-0 left-0 w-1/4 pointer-events-none z-30 bg-gradient-to-r from-secondary/30 to-transparent"></div>
          <div className="hidden md:block absolute inset-y-0 right-0 w-1/4 pointer-events-none z-30 bg-gradient-to-l from-secondary/30 to-transparent"></div>
        </Reveal>
      </div>
      <div className="hidden md:block absolute inset-y-0 left-0 w-1/3 pointer-events-none z-30 bg-gradient-to-r from-secondary via-secondary/50 to-transparent"></div>
      <div className="hidden md:block absolute inset-y-0 right-0 w-1/3 pointer-events-none z-30 bg-gradient-to-l from-secondary via-secondary/50 to-transparent"></div>
    </section>
  );
};

export default Clients;
