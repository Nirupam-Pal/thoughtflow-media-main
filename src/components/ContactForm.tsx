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
import { Mail, Phone, MapPin } from "lucide-react";

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
    <section id="contact" className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-x-clip">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Let's Build Something Amazing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your brand? Get in touch and let's discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Section - Unchanged */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">Get In Touch</h3>
              <p className="text-muted-foreground mb-8">
                We're here to help you achieve your marketing goals. Fill out the form and we'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-muted-foreground">thoughtflowmedia@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-muted-foreground">+91 7005046836</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-muted-foreground">Agartala, Tripura</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-5 sm:p-8 rounded-2xl shadow-soft border border-border min-w-0">
                
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
                        <Input placeholder="Your name" {...field} />
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
                        <Input type="email" placeholder="your@email.com" {...field} />
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
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 XXXXXXXXXX" {...field} />
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
                          className="min-h-[120px] resize-none"
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
                  className="w-full transition-all duration-300 hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;