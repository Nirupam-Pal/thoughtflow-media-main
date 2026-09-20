import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCallButton } from "@/components/BookCallButton";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

const CTA = () => {
  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-background overflow-x-clip">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <Reveal className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-premium p-6 shadow-medium sm:rounded-3xl sm:p-10 md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,hsl(16_95%_72%/0.35),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,hsl(38_45%_88%),transparent_60%)]" />
            <div className="hero-fine-grid absolute inset-0 opacity-60" />

            <div className="relative z-10 text-center">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 break-words tracking-tight">
                Ready to Transform <span className="text-ember">Your Brand?</span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
                Let's discuss how we can help you achieve your marketing goals.
                Get a free consultation and see what we can do together.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full min-w-0">
                <Magnetic className="w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium transition-shadow duration-300"
                  >
                    <a href="#contact">
                      <Mail className="mr-2 h-5 w-5" />
                      Get in Touch
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </Magnetic>

                <Magnetic className="w-full sm:w-auto">
                  <BookCallButton
                    size="lg"
                    variant="outline"
                    className="glass w-full sm:w-auto border-2 border-primary/30 hover:border-primary/50 hover:bg-background/60"
                  />
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTA;
