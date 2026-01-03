import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const projects = [
  {
    title: "TechStart Brand Campaign",
    category: "Content Production",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: "Complete brand transformation with UGC content strategy"
  },
  {
    title: "FashionHub Social Media",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    description: "Viral social media campaign reaching 2M+ impressions"
  },
  {
    title: "EcoProducts E-commerce",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: "Custom e-commerce platform with automated workflows"
  },
  {
    title: "GrowthLab Lead Generation",
    category: "Performance Marketing",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description: "Data-driven campaigns generating 300% ROI"
  },
  {
    title: "StyleCo Video Production",
    category: "Content Production",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop",
    description: "High-impact commercial ads and product videos"
  },
  {
    title: "CloudSolutions Portal",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
    description: "Enterprise admin portal with real-time analytics"
  }
];

const categories = ["All", "Content Production", "Social Media", "Web Development", "Performance Marketing"];

// 1. Container controls the sequence (Stagger)
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each card
    },
  },
};

// 2. Card controls the individual look (From top to bottom)
const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -50 // Starts 50px above the final position
  },
  visible: { 
    opacity: 1, 
    y: 0, // Slides down to natural position
    transition: {
      duration: 0.7, // Slows down the animation
      ease: "easeOut"
    }
  },
};

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Animation */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ margin: "-50px" }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Work
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful projects and transformative campaigns
          </p>
        </motion.div>

        {/* Filter Buttons Animation */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ margin: "-50px" }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-soft scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <motion.div 
          // Key ensures animation restarts when category changes
          key={activeCategory}
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px", once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={`${project.title}-${index}`}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-primary-foreground text-primary rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ExternalLink className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground mb-3">
                  {project.category}
                </div>
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;