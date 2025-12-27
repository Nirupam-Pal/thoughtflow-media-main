import { twMerge } from "tailwind-merge";
import Marquee from "./ui/marquee";



// const testimonials = [
  // {
    // name: "Alex Thompson",
    // role: "CEO, TechStart Inc",
    // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    // content: "Thoughtflow Media transformed our online presence completely. Their strategic approach to content and performance marketing delivered a 300% increase in qualified leads within 3 months.",
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
    // content: "Working with Thoughtflow Media was a game-changer. Their web development expertise and marketing insights helped us scale from startup to market leader.",
    // rating: 5
  // },
  // {
    // name: "Maria Santos",
    // role: "CMO, EcoProducts",
    // image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    // content: "Professional, responsive, and results-driven. Thoughtflow Media doesn't just deliver projects—they deliver growth. Our ROI has been exceptional.",
    // rating: 5
  // },
  // {
    // name: "James Wilson",
    // role: "VP Sales, CloudSolutions",
    // image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    // content: "The performance marketing campaigns exceeded all expectations. Thoughtflow Media's data-driven approach consistently delivers measurable results.",
    // rating: 5
  // },
  // {
    // name: "Sophia Lee",
    // role: "Brand Manager, StyleCo",
    // image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    // content: "From concept to execution, every project was handled with precision and creativity. Thoughtflow Media is our go-to partner for all marketing needs.",
    // rating: 5
  // }
// ];

const logos = [
  { name: "Vidya Bridge", src: "/logos/1.png" },
  { name: "Refresh Rays", src: "/logos/2.png" },
  { name: "Fit Factory", src: "/logos/3.png" },
  { name: "Aimsas", src: "/logos/4.png" },
  { name: "The Core Acedemy", src: "/logos/5.png" },
  { name: "Milestone Institute", src: "/logos/6.png" },
  // { name: "Synapse", src: "/logos/7.png" },
  { name: "Synapse", src: "/logos/8.png" },
  { name: "Longtharai", src: "/logos/9.png" },
  { name: "Petuk Somabesh 3.0", src: "/logos/10.png" },
  { name: "Smoke Of Longtwrai", src: "/logos/11.png" },
  // { name: "CA ANKITA BORA", src: "/logos/12.png" },
  { name: "Aadhyan", src: "/logos/13.png" },
  { name: "Junior", src: "/logos/14.png" },
  { name: "Untitled 3", src: "/logos/15.png" },
  { name: "CA ANKITA BORA", src: "/logos/16.png" },
  { name: "Green Hub", src: "/logos/17.png" },
  { name: "Rencare Energy", src: "/logos/18.jpg" },
  { name: "Prayam Classes", src: "/logos/19.png" },
  { name: "7 Oceans Centre of Music", src: "/logos/20.jpg" },
  { name: "Chessverse", src: "/logos/21.jpg" },
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

const LogoCard = ({ src, name }) => {
  return (
    <div
      className={twMerge(
        "relative flex items-center justify-center overflow-hidden from-card to-muted hover:from-accent/20 hover:to-secondary/20 transition-all duration-300 w-24 p-2 sm:w-28 sm:p-3 md:w-32 md:p-4"
      )}
    >
      <img
        // className="max-h-12 w-auto object-contain"
        className="rounded-full bg-white/10 object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
        alt={name}
        src={src}
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
    <section id="testimonials" className="relative py-20 lg:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Trusted by 100+ Brands
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We've partnered with ambitious brands to drive meaningful growth.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center w-full mt-12 overflow-hidden">
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
          <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none z-30 bg-gradient-to-r from-secondary/30 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none z-30 bg-gradient-to-l from-secondary/30 to-transparent"></div>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none z-30 bg-gradient-to-r from-secondary via-secondary/50 to-transparent"></div>
      <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none z-30 bg-gradient-to-l from-secondary via-secondary/50 to-transparent"></div>
    </section>
  );
};

export default Clients;
