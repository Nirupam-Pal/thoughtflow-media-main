import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MotionButton } from "./ui/motionButton";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contents", href: "#team" },
  { name: "Clients", href: "#testimonials" },
  { name: "Contact", href: "#contact" }
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback(
    (href: string) => {
      if (isHome) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setIsMobileMenuOpen(false);
        }
        return;
      }
      navigate(`/${href}`);
      setIsMobileMenuOpen(false);
    },
    [isHome, navigate],
  );

  return (
    <>
      {/* Mobile Menu - Rendered outside header to avoid z-index conflicts */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.5
          }}
          className="fixed inset-0 z-[60] lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.5
            }}
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border shadow-medium z-[61]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img 
                    src="/header_logo.png" 
                    alt="Thoughtflow Media" 
                    className="h-14 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors duration-300"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                <div className="space-y-3">
                  {navLinks.map((link, index) => (
                    <button
                      key={`${link.name}-${index}`}
                      onClick={() => scrollToSection(link.href)}
                      className="w-full text-left px-4 py-3.5 rounded-lg text-foreground hover:text-foreground hover:bg-accent font-medium transition-colors duration-300 relative z-10 block"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>

                <div className="mt-8 relative z-10">
                  <MotionButton/>
                  {/* <Button
                    onClick={() => scrollToSection("#contact")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft"
                    size="lg"
                  >
                    Get Started
                  </Button> */}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-border shrink-0">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  © 2024 Thoughtflow Media
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.header
        initial={{
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "100%",
          maxWidth: "100%",
          left: "50%",
          right: "50%",
          x: "-50%",
          y: 0,
          border: "none",
          borderRadius: 0
        }}
        animate={{
          boxShadow: scrolled ? "var(--shadow-soft)" : "none",
          width: scrolled 
            ? (isMobile ? "95%" : "85%") 
            : "100%",
          maxWidth: scrolled 
            ? (isMobile ? "100%" : "120rem") 
            : "100%",
          left: "50%",
          x: "-50%",
          y: scrolled ? (isMobile ? 5 : 10) : 0,
          backgroundColor: scrolled ? "hsl(var(--background))" : "transparent",
          border: scrolled ? "1px solid hsl(var(--border))" : "none",
          borderRadius: scrolled 
            ? (isMobile ? "1rem" : "9999px") 
            : 0
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 60,
          mass: 1
        }}
        className={`fixed top-0 z-50 max-w-[100vw] overflow-x-clip transition-all ${isScrolled ? "backdrop-blur-lg" : ""}`}
      >
        <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="block hover:scale-105 transition-transform duration-300"
            >
              <img 
                src="/header_logo.png" 
                alt="Thoughtflow Media" 
                className="h-12 w-auto max-h-12 object-contain sm:h-14 sm:max-h-14"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === index && (

                    <motion.span
                      layoutId='hovered-span'
                      className='absolute inset-0 h-full w-full rounded-md dark:bg-neutral-800'
                    />
                  )}
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}

              {/* <Button
                onClick={() => scrollToSection("#contact")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button> */}
              <MotionButton/>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-accent  rounded-lg transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>
    </>
  );
};

export default Header;