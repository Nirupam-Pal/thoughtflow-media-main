import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/thoughtflowmediaa/" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/profile.php?id=100094976734947#" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/thoughtflow-media/posts/?feedView=all" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-x-clip border-t border-border/50 bg-gradient-subtle">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(16_98%_55%/0.5)] to-transparent" />

      <div className="container mx-auto min-w-0 px-4 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <div className="mb-10 grid gap-10 sm:mb-12 sm:grid-cols-2 sm:gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="mb-4 font-display text-2xl font-bold">
                Thoughtflow <span className="text-ember">Media</span>
              </h3>
              <p className="mb-6 max-w-md leading-relaxed text-muted-foreground">
                AI-powered creative marketing agency specializing in content creation,
                performance marketing, and web development.
              </p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <Magnetic key={label} strength={0.35}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass group flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-primary"
                      aria-label={`Visit our ${label}`}
                    >
                      <Icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-display font-semibold">Services</h4>
              <ul className="space-y-3">
                {[
                  "Content Creation",
                  "UGC Videos",
                  "Performance Marketing",
                  "Web Development",
                  "Lead Generation"
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="/#services"
                      className="inline-block text-muted-foreground transition duration-300 hover:translate-x-1 hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-display font-semibold">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Mail className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <a href="mailto:thoughtflowmedia@gmail.com" className="break-all transition-colors hover:text-foreground sm:break-words">
                    thoughtflowmedia@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Phone className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <a href="tel:+917005046836" className="transition-colors hover:text-foreground">
                    +91 7005046836
                  </a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>
                    Agartala, West Tripura<br />
                    Tripura,
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <p>© {currentYear} Thoughtflow Media. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:justify-end">
            <a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
