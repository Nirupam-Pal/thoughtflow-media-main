import { Sparkles, Target, Zap, Users } from "lucide-react";

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

const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-premium relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(38_25%_88%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(38_25%_88%)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Why Choose Thoughtflow
          </h2>
          <p className="text-lg text-muted-foreground">
            We don't just deliver projects—we build partnerships that drive lasting success.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div 
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
