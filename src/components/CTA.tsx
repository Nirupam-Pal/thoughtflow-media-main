import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-background overflow-x-clip">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-premium p-6 sm:p-10 md:p-16 shadow-medium overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(38_50%_85%),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(38_45%_88%),transparent_60%)]" />
            
            <div className="relative z-10 text-center">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 break-words">
                Ready to Transform Your Brand?
              </h2>
              
              <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
                Let's discuss how we can help you achieve your marketing goals. 
                Get a free consultation and see what we can do together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full min-w-0">
                <Button 
                  size="lg"
                  className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-primary/30 hover:border-primary/50 hover:bg-background/50 backdrop-blur-sm"
                >
                  Schedule a Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
