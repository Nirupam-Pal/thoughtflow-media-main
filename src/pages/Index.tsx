import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Portfolio from "@/components/Portfolio";
import Team from "@/components/Team";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Skiper30 } from "@/components/parallax";
import Clients from "@/components/Clients";
import Testimonials from "@/components/Testimonials";
// import AnimatedTestimonialsDemo from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Portfolio />
      <Testimonials/>
      {/* <AnimatedTestimonialsDemo /> */}
      <Team />
      {/* <Testimonials /> */}
      <Clients/>
      <ContactForm />
      <Skiper30/>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
