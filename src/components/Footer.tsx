import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-subtle border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold mb-4">
              Thoughtflow Media
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              AI-powered creative marketing agency specializing in content creation, 
              performance marketing, and web development.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "https://www.instagram.com/thoughtflowmediaa/" },
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=100094976734947#" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/thoughtflow-media/posts/?feedView=all" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors duration-300 group"
                    aria-label={`Visit our ${Icon.name}`}
                  >
                    <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {[
                "Content Creation",
                "UGC Videos",
                "Performance Marketing",
                "Web Development",
                "Lead Generation"
              ].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="thoughtflowmedia@gmail.com" className="hover:text-foreground transition-colors">
                  thoughtflowmedia@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-foreground transition-colors">
                  +91 7005046836
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                  Agartala, West Tripura<br />
                  Tripura, 
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Thoughtflow Media. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
