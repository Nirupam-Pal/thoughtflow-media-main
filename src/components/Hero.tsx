import { CtaButton } from "./ui/cta-button";
import CountUp from "react-countup";
import HeroBackground from "./HeroBackground";

const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-x-clip bg-background pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20">
      <HeroBackground />

      <div className="container mx-auto min-w-0 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-[clamp(1.75rem,5vw+1rem,4.5rem)] md:text-7xl lg:text-7xl font-bold mb-5 sm:mb-6 tracking-tight px-0.5">
              <div className="bg-gradient-to-r mb-4 from-primary via-primary/35 to-primary bg-clip-text text-transparent break-words leading-tight">
                AI-Powered Marketing Agency 
              </div>
              <span className="block  text-foreground">
                In Agartala, India 
                {/* <span><HeroText /> </span> */}
              </span>
            </h1>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed break-words px-0.5">
              Thoughtflow Media is an <span className="highlight-text bg-primary/20 text-primary font-semibold px-2 rounded-md">AI-powered creative marketing agency</span> based in Agartala, Tripura. We've delivered <span className="highlight-text bg-primary/20 text-primary font-semibold px-2 rounded-md">1,000+ projects</span> for 50+ brands — from UGC videos and Meta Ad campaigns to custom websites — helping businesses across Northeast India grow faster.
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

          <div
            className="opacity-0 animate-fade-in mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto min-w-0"
            style={{ animationDelay: "0.7s" }}
          >
            {[
              { number: "1000+", label: "Projects Delivered" },
              { number: "98%", label: "Client Satisfaction Rate" },
              { number: "20+", label: "Creative Specialists" },
              { number: "15+ L", label: "Ads Spend Experience" },
            ].map((stat, index) => {
              const numericValue = parseInt(stat.number.replace(/[^\d]/g, ''));
              const suffix = stat.number.replace(/\d/g, '');
              const prefix = index === 3 ? "₹" : "";
              
              return (
                <div
                  key={index}
                  className="text-center border border-slate-400 rounded-xl px-1.5 py-2.5 sm:px-2 sm:py-3 flex flex-col items-center justify-center min-h-[92px] sm:min-h-[100px] min-w-0"
                >
                  <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 tabular-nums">
                    {prefix}
                    <CountUp
                      end={numericValue}
                      duration={3.5}
                      delay={index * 0.2}
                      suffix={suffix}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>
                  <div className="text-[11px] leading-snug sm:text-sm text-muted-foreground break-words hyphens-auto px-0.5">
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
