
import { useState } from "react";
import { Send, User, Mail, MessageSquare, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { handleSpotlight } from "@/lib/interactions";

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...formData }),
      });

      if (!response.ok) throw new Error("Request failed");

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out — I'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast({
        variant: "destructive",
        title: "Couldn't send your message",
        description: "Please email me directly at andersadalberth@gmail.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    { Icon: Mail, label: "Email", value: "andersadalberth@gmail.com", href: "mailto:andersadalberth@gmail.com" },
    { Icon: Phone, label: "Phone", value: "+45 29 36 29 92", href: "tel:+4529362992" },
    { Icon: MapPin, label: "Location", value: "Copenhagen, Denmark", href: undefined },
  ];

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Info column */}
          <div className="space-y-8 lg:col-span-2">
            <div className="flex flex-col items-start">
              <span className="eyebrow mb-3">Contact</span>
              <h2 className="section-heading text-3xl font-bold md:text-4xl">Get In Touch</h2>
              <p className="mt-4 text-muted-foreground">
                Have a question, a role, or an idea you'd like to discuss? I'd love to hear
                from you — I usually reply within a day.
              </p>
            </div>

            <div className="space-y-3">
              {contactDetails.map(({ Icon, label, value, href }) => {
                const content = (
                  <div
                    onMouseMove={handleSpotlight}
                    className="spotlight flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition-colors hover:border-primary/40 sm:gap-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white to-neutral-300 text-neutral-900 shadow-md sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                      <p className="whitespace-nowrap text-[13px] font-medium text-foreground sm:text-base">{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {[
                { href: "https://www.linkedin.com/in/anders-adalberth-andersen-58b537215", label: "LinkedIn", Icon: Linkedin },
                { href: "https://github.com/aaandersen", label: "GitHub", Icon: Github },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <div
              onMouseMove={handleSpotlight}
              className="glass-card spotlight rounded-2xl p-6 shadow-lg sm:p-8"
            >
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

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
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  className="btn-gradient h-auto w-full py-6 text-base font-semibold"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
