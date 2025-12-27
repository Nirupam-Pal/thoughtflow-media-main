// import { twMerge } from "tailwind-merge";
// import Marquee from "./ui/marquee";



// const testimonials = [
//     {
//         name: "Alex Thompson",
//         role: "CEO, TechStart Inc",
//         image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
//         content: "Thoughtflow Media transformed our online presence completely. Their strategic approach to content and performance marketing delivered a 300% increase in qualified leads within 3 months.",
//         rating: 5
//     },
//     {
//         name: "Jessica Martinez",
//         role: "Marketing Director, FashionHub",
//         image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
//         content: "The team's creativity and attention to detail is unmatched. They created stunning UGC content that resonated perfectly with our audience and drove significant engagement.",
//         rating: 5
//     },
//     {
//         name: "Robert Chang",
//         role: "Founder, GrowthLab",
//         image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
//         content: "Working with Thoughtflow Media was a game-changer. Their web development expertise and marketing insights helped us scale from startup to market leader.",
//         rating: 5
//     },
//     {
//         name: "Maria Santos",
//         role: "CMO, EcoProducts",
//         image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
//         content: "Professional, responsive, and results-driven. Thoughtflow Media doesn't just deliver projects—they deliver growth. Our ROI has been exceptional.",
//         rating: 5
//     },
//     {
//         name: "James Wilson",
//         role: "VP Sales, CloudSolutions",
//         image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
//         content: "The performance marketing campaigns exceeded all expectations. Thoughtflow Media's data-driven approach consistently delivers measurable results.",
//         rating: 5
//     },
//     {
//         name: "Sophia Lee",
//         role: "Brand Manager, StyleCo",
//         image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
//         content: "From concept to execution, every project was handled with precision and creativity. Thoughtflow Media is our go-to partner for all marketing needs.",
//         rating: 5
//     }
// ];

// const firstRow = testimonials.slice(0, testimonials.length / 2);
// const secondRow = testimonials.slice(testimonials.length / 2);

// const ReviewCard = ({ image, name, role, content }) => {
//     return (
//         <figure
//             className={twMerge(
//                 "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-200 p-4 bg-gradient-to-r from-card to-muted hover:from-accent/20 hover:to-secondary/20 transition-all duration-300"
//             )}
//         >
//             <div className="flex flex-row items-center gap-2">
//                 <img
//                     className="rounded-full bg-white/10"
//                     width="32"
//                     height="32"
//                     alt=""
//                     src={image}
//                 />
//                 <div className="flex flex-col">
//                     <figcaption className="text-sm font-medium ">
//                         {name}
//                     </figcaption>
//                     <p className="text-xs font-medium text-black/40">{role}</p>
//                 </div>
//             </div>
//             <blockquote className="mt-2 text-sm">{content}</blockquote>
//         </figure>
//     );
// };

// const Testimonials = () => {
//     return (
//         <section id="clients" className="relative py-20 lg:py-32 bg-secondary/30 overflow-hidden">
//             <div className="container mx-auto px-4">
//                 <div className="text-center mb-16 animate-fade-in">
//                     <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
//                         Trusted by Industry Leaders
//                     </h2>
//                     <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
//                         We've partnered with ambitious brands to drive meaningful growth.
//                     </p>
//                 </div>

//                 <div className="relative flex flex-col items-center justify-center w-full mt-12">
//                     {/* First Row Marquee */}
//                     <Marquee pauseOnHover className="[--duration:30s]">
//                         {firstRow.map((logo) => (
//                             <ReviewCard key={logo.image} {...logo} />
//                         ))}
//                     </Marquee>

//                     {/* Second Row Marquee */}
//                     <Marquee reverse pauseOnHover className="[--duration:30s]">
//                         {secondRow.map((logo) => (
//                             <ReviewCard key={logo.image} {...logo} />
//                         ))}
//                     </Marquee>

//                     {/* Fading Edges */}
//                     <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none z-30 bg-gradient-to-r from-secondary/30 to-transparent"></div>
//                     <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none z-30 bg-gradient-to-l from-secondary/30 to-transparent"></div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Testimonials

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}


const Testimonials = () => {
    return (
        <section id="clients" className="relative py-20 lg:py-32 bg-secondary/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        See what our clients have to say about our services and the results they've achieved.
                    </p>
                </div>

                <div className="relative flex flex-col items-center justify-center w-full">
                    <AnimatedTestimonialsDemo />
                </div>
            </div>
        </section>
    );
};

export default Testimonials