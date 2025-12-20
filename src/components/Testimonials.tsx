import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "CEO, TechStart Inc",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    content: "Thoughtflow Media transformed our online presence completely. Their strategic approach to content and performance marketing delivered a 300% increase in qualified leads within 3 months.",
    rating: 5
  },
  {
    name: "Jessica Martinez",
    role: "Marketing Director, FashionHub",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    content: "The team's creativity and attention to detail is unmatched. They created stunning UGC content that resonated perfectly with our audience and drove significant engagement.",
    rating: 5
  },
  {
    name: "Robert Chang",
    role: "Founder, GrowthLab",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    content: "Working with Thoughtflow Media was a game-changer. Their web development expertise and marketing insights helped us scale from startup to market leader.",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "CMO, EcoProducts",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    content: "Professional, responsive, and results-driven. Thoughtflow Media doesn't just deliver projects—they deliver growth. Our ROI has been exceptional.",
    rating: 5
  },
  {
    name: "James Wilson",
    role: "VP Sales, CloudSolutions",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    content: "The performance marketing campaigns exceeded all expectations. Thoughtflow Media's data-driven approach consistently delivers measurable results.",
    rating: 5
  },
  {
    name: "Sophia Lee",
    role: "Brand Manager, StyleCo",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    content: "From concept to execution, every project was handled with precision and creativity. Thoughtflow Media is our go-to partner for all marketing needs.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it—here's what our partners have to say
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-2xl shadow-soft border border-border group hover:shadow-medium transition-all duration-300 animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
