
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Building,
  Users,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "We've received your message and will respond shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userType: ''
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">Our team is here to help</p>
              <a href="mailto:support@talenthub.com" className="text-primary hover:underline">
                support@talenthub.com
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Phone className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-4">Mon-Fri, 9am-5pm</p>
              <a href="tel:+18001234567" className="text-primary hover:underline">
                +1 (800) 123-4567
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-4">Our headquarters</p>
              <address className="not-italic">
                123 Innovation Way<br />
                San Francisco, CA 94103
              </address>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="John Doe" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="john@example.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userType">I am a</Label>
              <Select value={formData.userType} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_seeker">Job Seeker</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange}
                placeholder="How can we help you?" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange}
                placeholder="Please describe your question or concern..." 
                rows={5} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">How Can We Help?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Job Seekers</h3>
                <p className="text-muted-foreground">
                  Need help with your profile, applications, or have questions about the platform? Our support team is ready to assist you.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Employers</h3>
                <p className="text-muted-foreground">
                  Questions about posting jobs, reviewing applications, or managing your company profile? Our employer success team is here to help.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Partnerships</h3>
                <p className="text-muted-foreground">
                  Interested in partnering with Talent Hub? Let's discuss how we can work together to create more opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">General Inquiries</h3>
                <p className="text-muted-foreground">
                  For press, media, or other general inquiries, our team will direct your message to the appropriate department.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">FAQs</h3>
            <p className="mb-4">
              Looking for quick answers? Check our frequently asked questions.
            </p>
            <Button variant="outline" asChild className="w-full">
              <a href="/faq">View FAQ</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
