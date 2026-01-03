import { Video, TrendingUp, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

const services = [
  {
    icon: Video,
    title: "Content Services",
    description: "End-to-end content creation including UGC videos, commercial ads, and social media content. From pre-production to post-production, we bring your brand story to life.",
    features: ["UGC Videos", "Commercial Ads", "YouTube Content", "Social Media Posts", "Pre & Post Production"]
  },
  {
    icon: TrendingUp,
    title: "Performance Marketing",
    description: "Data-driven marketing strategies that generate leads, drive conversions, and maximize sales. We turn clicks into customers and browsers into buyers.",
    features: ["Lead Generation", "Conversion Optimization", "ROI Tracking", "Sales Funnels", "Campaign Management"]
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Dynamic websites, admin portals, and landing pages built with cutting-edge technology. Automation solutions that streamline your business operations.",
    features: ["Custom Websites", "Admin Portals", "Landing Pages", "Work Automation", "API Integration"]
  }
];

// CHANGED: Updated container variants for smoother entry/exit
const containerVariants: Variants = {
  hidden: { 
    opacity: 1, // Keep container visible so children can animate
    transition: {
      // When emptying (animating out), stagger backwards faster
      staggerChildren: 0.1,
      staggerDirection: -1,
      when: "afterChildren"
    }
  },
  visible: {
    opacity: 1,
    transition: {
      // When filling (animating in), stagger normally
      staggerChildren: 0.2,
      when: "beforeChildren"
    },
  },
};

// CHANGED: Updated card variants to ensure smooth transitions both ways
const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, // Go back down
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1, 
    y: 0, // Move up to position
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

const Services = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative" id="services">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          // Removed once:true so header also animates in/out
          viewport={{ margin: "-50px" }} 
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            What We Do Best
          </h2>
          <p className="text-lg text-muted-foreground">
            Three core services, infinite possibilities. We blend creativity with technology 
            to deliver exceptional results.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          // Using a larger margin ensures the element is well inside the viewport 
          // before entering, and leaves before it's fully offscreen.
          viewport={{ margin: "-150px" }} 
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={cardVariants} className="h-full">
                <Card 
                  className="relative group p-8 border-2 border-border/50 hover:border-accent transition-all duration-500 hover:shadow-medium bg-card hover:bg-gradient-subtle cursor-pointer overflow-hidden h-full hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    <h3 className="font-display text-2xl font-semibold mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;