
import { useState } from "react";
import { Send, User, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll respond as soon as possible.",
      });
      
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have a question or want to work together? Feel free to contact me.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-8 shadow-lg animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <div className="relative">
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    className="min-h-32 pl-10"
                    required
                  />
                  <MessageSquare className="absolute left-3 top-6 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-6 h-auto text-base font-medium"
              >
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Prefer direct contact? Email me at{" "}
              <a
                href="mailto:andersadalberth@gmail.com"
                className="text-primary hover:underline"
              >
                andersadalberth@gmail.com
              </a>{" "}
              or call{" "}
              <a href="tel:+4529362992" className="text-primary hover:underline">
                +45 29362992
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
