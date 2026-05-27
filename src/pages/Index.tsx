import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Portfolio from "@/components/Portfolio";
// import Team from "@/components/Contents";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Skiper30 } from "@/components/parallax";
import Clients from "@/components/Clients";
import Testimonials from "@/components/Testimonials";
import Contents from "@/components/Contents";
import Seo from "@/components/Seo";
// import AnimatedTestimonialsDemo from "@/components/Testimonials";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen min-w-0 w-full max-w-[100vw] overflow-x-clip">
      <Seo
        title="Digital Marketing Agency in Agartala | Thoughtflow Media"
        description="Thoughtflow Media is a full-service digital marketing agency in Agartala, Tripura. We run Meta & Google Ads, manage social media, and produce videos and graphics for brands across Northeast India."
        ogType="website"
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Thoughtflow Media",
          url: "https://thoughtflowmediaa.com",
          logo: "https://thoughtflowmediaa.com/tf-profile.png",
          sameAs: [],
        }}
      />
      <Header />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Portfolio />
      {/* <AnimatedTestimonialsDemo /> */}
      <Contents />
      {/* <Testimonials /> */}
      <Clients/>
      <Testimonials/>
      <ContactForm />
      <Skiper30/>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
