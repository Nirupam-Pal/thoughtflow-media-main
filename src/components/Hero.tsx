import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroText from "./ui/HeroText";
import { CtaButton } from "./ui/cta-button";
import CountUp from "react-countup";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle pt-16 sm:pt-20 md:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(38_45%_90%),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(38_35%_92%),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <div className="bg-gradient-to-r from-primary via-primary/35 to-primary bg-clip-text text-transparent">
                Creative AI-Powered
              </div>
              <span className="block mt-2 ">
                Marketing <span><HeroText /> </span>
              </span>
            </h1>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your brand with premium content creation, performance marketing,
              and cutting-edge web development. Where creativity meets results.
            </p>
            
          </div>

          <div className="opacity-0 animate-fade-in-up gap-6 flex flex-col sm:flex-row justify-center items-center">
            {/* <Button
              size="lg"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button> */}
            <div id="button" className="w-full sm:w-auto flex justify-center">
              <CtaButton />
            </div>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/20 hover:border-primary/40 hover:bg-accent/50 transition-all duration-300"
            >
              View Our Work
            </Button> */}
          </div>

          <div className="opacity-0 animate-fade-in mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto" style={{ animationDelay: "0.7s" }}>
            {[
              { number: "1000+", label: "Projects Delivered" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "20+", label: "Team Members" },
              { number: "15+ lacs", label: "Ads Spend Experience" },
            ].map((stat, index) => {
              const numericValue = parseInt(stat.number.replace(/[^\d]/g, ''));
              const suffix = stat.number.replace(/\d/g, '');
              
              return (
                <div key={index} className="text-center border border-slate-400 rounded-xl px-2 py-3">
                  <div className="font-display  text-3xl md:text-4xl font-bold text-primary mb-1">
                    <CountUp
                      end={numericValue}
                      duration={3.5}
                      delay={index * 0.2}
                      suffix={suffix}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
