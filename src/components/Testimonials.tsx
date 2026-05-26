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
    // {
    //   quote:
    //     "TFM is hands down the most creative marketing agency in Tripura! I had a fantastic overall experience and couldn't be happier with the service. Best of luck to the team—you guys are doing great work!",
    //   name: "Sabarni Choudhury",
    //   designation: "Product Manager at TechFlow",
    //   src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   rating: 5,
    // },
    // {
    //   quote:
    //     "I’m really satisfied with the work TFM has done for me. They are easily the most creative agency in Tripura, and the overall experience was top-notch. Everything was good, and I’d definitely recommend them",
    //   name: "Satyajit",
    //   designation: "CTO at InnovateSphere",
    //   src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   rating: 5,
    // },
    // {
    //   quote:
    //     "The creative content ideas and social media marketing services from TFM are just amazing. I’m very happy with the results so far. I'm excited to see them continue to work hard and deliver such great value!",
    //   name: "Ratan",
    //   designation: "Operations Director at CloudScale",
    //   src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   rating: 4,
    // },
    {
      quote:
        "TFM provides truly amazing creative content and social media marketing services. I’ve had a positive experience working with them and appreciate the fresh ideas they bring to the table. It’s been a great partnership!",
      name: "Prasenjit Debnath",
      designation: "Chemistry Mentor, Core Academy",
      src: "/clients/PrasenjitSir2.jpeg",
      rating: 5,
    },
    {
      quote:
        "TFM delivers exceptional creative content and social media marketing services. My experience working with them has been highly positive, and I truly value the innovative ideas and creativity they consistently bring. It has been a wonderful partnership overall!",
      name: "Sujoy Datta Muhury",
      designation: "Engineering Lead at DataPro",
      src: "/clients/Sujoy.jpeg",
      rating: 4,
    },
    {
      quote:
        "The social media marketing and creative content ideas at TFM are simply amazing. I had a perfect 5-star experience and was completely satisfied with the service. Highly recommended for anyone looking for creative flair!",
      name: "Uttam Kumar Das",
      designation: "Founder, Oxford Hub of English",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
    },
    {
      quote:
        "Working with TFM has been an innovative and exciting experience. Their creative content and social media strategies are just amazing and have really helped us stand out. I’m 100% satisfied and would recommend them to anyone!",
      name: "Pratik Saha",
      designation: "Founder | Mathematics Mentor , Prayam Classes",
      src: "/clients/PratikSir.jpg",
      rating: 5,
    },
    {
      quote:
        "I’m so impressed with the work TFM has done; they really are a team that makes the dream work! The service was excellent, and I’m fully satisfied with the results. Keep up the great work and always believe in your team!",
      name: "Aditya Mitra",
      designation: "Consultant of Bharat Consultancy",
      src: "/clients/Aditya Mitra.jpg",
      rating: 5,
    },
    {
      quote:
        "TFM is definitely the most creative marketing agency in Tripura. My experience was flawless from start to finish, and I’m incredibly happy with the service. Best of luck to the whole team!",
      name: "Bhaskar Biswas",
      designation: "Physics Teacher | Assistant Professor, ICFAI University Tripura",
      src: "/clients/Bhashkar.jpeg",
      rating: 5,
    },
    {
      quote:
        "Working with TFM has been a smooth and reassuring experience. We truly appreciate their commitment and the thoughtfulness they bring to every step. Creative Content ideas & Social media marketing services.... Just amazing! Quality work... Best Marketing Agency. Most Creative Marketing Agency in Tripura... Best of Luck. Nice work... Satisfied for this work. Go Ahead.",
      name: "Pratik Debnath",
      designation: "Founder, Chessverse",
      src: "/clients/PratikDebnath.jpeg",
      rating: 5,
    },
    {
      quote:
        "Nice work... Satisfied with the service. Go ahead",
      name: "Souptik Bhowmik",
      designation: "Chemistry Mentor | Aimsas-A Hybrid Smart Skool",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4,
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}

const Testimonials = () => {
  return (
    <section id="clients" className="relative py-16 sm:py-20 lg:py-32 bg-secondary/30 overflow-x-clip overflow-hidden">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our clients have to say about our services and the results they've achieved.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center w-full min-w-0 overflow-hidden px-0">
          <AnimatedTestimonialsDemo />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;