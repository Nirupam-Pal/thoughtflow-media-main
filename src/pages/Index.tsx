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
    <div className="min-h-screen">
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
