import { Sparkles, Target, Zap, Users } from "lucide-react";
import { motion, Variants } from "framer-motion";

const reasons = [
  {
    icon: Sparkles,
    title: "AI-Powered Creativity",
    description: "Leverage cutting-edge AI technology to create content that stands out and resonates with your audience."
  },
  {
    icon: Target,
    title: "Results-Driven Approach",
    description: "Every strategy is built around measurable outcomes. We focus on what matters: your growth and success."
  },
  {
    icon: Zap,
    title: "Lightning Fast Delivery",
    description: "Speed without compromise. Our streamlined processes ensure rapid delivery while maintaining premium quality."
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Work with a passionate team committed to your success. We're partners in your growth journey."
  }
];

// Animation Variants matching the Service section style
const containerVariants: Variants = {
  hidden: { 
    opacity: 1, 
    transition: {
      // Stagger backwards when animating out
      staggerChildren: 0.1,
      staggerDirection: -1,
      when: "afterChildren"
    }
  },
  visible: {
    opacity: 1,
    transition: {
      // Stagger forwards when animating in
      staggerChildren: 0.2,
      when: "beforeChildren"
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, // Slight slide up/down
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-gradient-premium relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(38_25%_88%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(38_25%_88%)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="container mx-auto min-w-0 px-4 sm:px-6 relative z-10">
        {/* Header Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Why Choose Thoughtflow Media
          </h2>
          <p className="text-lg text-muted-foreground">
            We don't just deliver projects—we build partnerships that drive lasting success.
          </p>
        </motion.div>
        
        {/* Grid Animation */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="inline-flex w-16 h-16 rounded-2xl bg-background shadow-soft items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-medium transition-all duration-300">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-3">
                  {reason.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;