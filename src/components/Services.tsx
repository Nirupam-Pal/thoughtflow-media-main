import { Video, TrendingUp, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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

const Services = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative" id="services">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            What We Do Best
          </h2>
          <p className="text-lg text-muted-foreground">
            Three core services, infinite possibilities. We blend creativity with technology 
            to deliver exceptional results.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="relative group p-8 border-2 border-border/50 hover:border-accent transition-all duration-500 hover:shadow-medium bg-card hover:bg-gradient-subtle cursor-pointer overflow-hidden animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
