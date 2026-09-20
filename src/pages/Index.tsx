import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Portfolio from "@/components/Portfolio";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Skiper30 } from "@/components/parallax";
import Clients from "@/components/Clients";
import Testimonials from "@/components/Testimonials";
import Seo from "@/components/Seo";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { getHomeSeo } from "@/seo/site.js";

// Below-the-fold sections with heavy dependencies (Swiper carousels; form + validation + EmailJS)
// are split into their own chunks so they don't compete with the hero for the main thread.
// They still hydrate/render right after load — they are not scroll-gated — so their content is
// always present for crawlers. The fallback reserves height to avoid layout shift.
const Contents = lazy(() => import("@/components/Contents"));
const ContactForm = lazy(() => import("@/components/ContactForm"));
const SectionFallback = ({ minHeight }: { minHeight: number }) => (
  <div aria-hidden="true" style={{ minHeight }} />
);

const HOME_SEO = getHomeSeo();

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const t = window.setTimeout(() => {
      scrollToTarget(document.getElementById(id));
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen min-w-0 w-full max-w-[100vw] overflow-x-clip">
      <Seo {...HOME_SEO} />

      {/* Lets keyboard and screen-reader users bypass the navigation. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Process />
        <WhyChooseUs />
        <Portfolio />
        <Suspense fallback={<SectionFallback minHeight={1200} />}>
          <Contents />
        </Suspense>
        <Clients />
        <Testimonials />
        <Suspense fallback={<SectionFallback minHeight={900} />}>
          <ContactForm />
        </Suspense>
        <Skiper30 />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
