import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from "@emailjs/browser"; // Import EmailJS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { BookCallButton } from "@/components/BookCallButton";

const contactMethods = [
  { icon: Mail, label: "Email", value: "thoughtflowmedia@gmail.com", href: "mailto:thoughtflowmedia@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 7005046836", href: "tel:+917005046836" },
  {
    icon: MapPin,
    label: "Location",
    value: "Barjala, near Barjala High School, Bhubanban, Agartala, Tripura 799006",
    href: "https://www.google.com/maps/search/?api=1&query=Barjala%2C+near+Barjala+High+School%2C+Bhubanban%2C+Agartala%2C+Tripura+799006",
  },
];

// 1. Updated Schema with Honeypot field (hidden from users)
const contactSchema = z.object({
  name: z.string().trim().nonempty({ message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  phone: z.string().trim().nonempty({ message: "Phone number is required" }).max(20),
  message: z.string().trim().nonempty({ message: "Message is required" }).max(1000),
  gotcha: z.string().optional(), // Honeypot field for spam protection
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      gotcha: "", // Default empty
    }
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    // 2. Spam Prevention: Silent Reject
    // If the hidden 'gotcha' field is filled, it's a bot. Fake success.
    if (values.gotcha) {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Send Email via EmailJS
      // Replace these placeholders with your actual IDs from EmailJS dashboard
      const serviceID = import.meta.env.VITE_SERVICE_ID;
      const templateID = import.meta.env.VITE_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_PUBLIC_KEY;

      await emailjs.send(
        serviceID,
        templateID,
        {
          from_name: values.name,
          from_email: values.email,
          phone: values.phone,
          message: values.message,
        },
        publicKey
      );

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      console.error("Email Error:", error);
      toast({
        title: "Something went wrong.",
        description: "Please try again later or email us directly.",
        variant: "destructive", // Shows red error toast
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="contact-heading" id="contact" className="section-aurora py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-x-clip">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          id="contact-heading"
          eyebrow="Contact"
          title="Let's Build Something"
          accent="Amazing"
          description="Ready to transform your brand? Get in touch and let's discuss your project."
        />

        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal className="space-y-8">
            <div>
              <h3 className="mb-4 font-display text-2xl font-bold md:text-3xl">Get In Touch</h3>
              <p className="text-muted-foreground">
                We're here to help you achieve your marketing goals. Fill out the form and we'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              {contactMethods.map(({ icon: Icon, label, value, href }) => {
                const external = href.startsWith("http");
                return (
                  <TiltCard key={label} className="rounded-2xl" max={5}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-2xl p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition duration-300 group-hover:scale-110 group-hover:bg-ember">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                        <span className="block break-words font-semibold">{value}</span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </a>
                  </TiltCard>
                );
              })}
            </div>

            <div className="glass flex flex-col items-start gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display font-semibold">Prefer to talk it through?</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(140_60%_45%)] opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(140_60%_45%)]" />
                  </span>
                  Free 30-minute strategy call
                </p>
              </div>
              <BookCallButton variant="outline" className="border-2 border-primary/30 bg-background/60 hover:bg-background">
                Book a call
              </BookCallButton>
            </div>
          </Reveal>

          {/* Form Section */}
          <Reveal delay={0.1}>
            <TiltCard className="rounded-2xl" max={0}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-0 space-y-6 p-5 sm:p-8">

                  {/* 4. Honeypot Field (Hidden) */}
                  <FormField
                    control={form.control}
                    name="gotcha"
                    render={({ field }) => (
                      <FormItem className="hidden" aria-hidden="true">
                        <Input {...field} tabIndex={-1} autoComplete="off" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" className="bg-background/70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" className="bg-background/70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 XXXXXXXXXX" className="bg-background/70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project..."
                            className="min-h-[120px] resize-none bg-background/70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full shadow-soft transition-shadow duration-300 hover:shadow-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
