
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  BrainCircuit, 
  BarChart, 
  Clock, 
  Briefcase, 
  Users, 
  Building, 
  Handshake
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Talent Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to transform how talent connects with opportunities through intelligent matching and a human-centered approach.
        </p>
      </section>
      
      {/* Our Mission */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-4">
              At Talent Hub, we believe that finding the right job or candidate shouldn't be a frustrating, time-consuming process full of uncertainty.
            </p>
            <p className="text-lg mb-4">
              Our platform uses advanced technology to create meaningful connections between talented individuals and forward-thinking companies, while providing transparency and feedback at every step of the journey.
            </p>
            <p className="text-lg">
              We're committed to creating a more efficient, effective, and human job market for everyone.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
            <div className="flex flex-col items-center text-center">
              <BrainCircuit size={64} className="text-primary mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Intelligent Matching</h3>
              <p>
                Our platform uses advanced algorithms to match candidates with jobs based on skills, experience, preferences, and cultural fit – not just keywords.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How Talent Hub Works</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* For Job Seekers */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-primary" />
              For Job Seekers
            </h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Create your profile and upload your resume</li>
              <li>Get matched with relevant job opportunities</li>
              <li>Apply with one click using your profile</li>
              <li>Receive feedback and track your application status</li>
              <li>Schedule interviews and connect with employers</li>
            </ol>
            <div className="mt-6">
              <Button asChild>
                <Link to="/auth?mode=signup&role=job_seeker">Sign Up as Job Seeker</Link>
              </Button>
            </div>
          </div>
          
          {/* For Employers */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Building className="mr-2 text-primary" />
              For Employers
            </h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Create your company profile</li>
              <li>Post jobs with detailed requirements</li>
              <li>Get matched with qualified candidates</li>
              <li>Review applications with AI-assisted insights</li>
              <li>Schedule interviews and hire top talent</li>
            </ol>
            <div className="mt-6">
              <Button asChild>
                <Link to="/auth?mode=signup&role=employer">Sign Up as Employer</Link>
              </Button>
            </div>
          </div>
          
          {/* Our Technology */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BrainCircuit className="mr-2 text-primary" />
              Our Technology
            </h3>
            <ul className="space-y-3">
              <li><span className="font-medium">Skill matching:</span> We analyze skills and experience, not just keywords</li>
              <li><span className="font-medium">Cultural fit:</span> We consider company culture and candidate preferences</li>
              <li><span className="font-medium">Feedback loop:</span> We provide insights to improve your profile or job listings</li>
              <li><span className="font-medium">Streamlined process:</span> We simplify the application and hiring process</li>
            </ul>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Talent Hub</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality Matches</h3>
            <p>We focus on quality over quantity, ensuring better fit for both parties.</p>
          </div>
          
          <div className="text-center p-6">
            <BarChart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
            <p>Get valuable feedback and analytics to improve your success rate.</p>
          </div>
          
          <div className="text-center p-6">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Time</h3>
            <p>Our streamlined process reduces time-to-hire and job search duration.</p>
          </div>
          
          <div className="text-center p-6">
            <Handshake className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Human Touch</h3>
            <p>We combine technology with human expertise for the best experience.</p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Job Search or Hiring Process?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto opacity-90">
          Join thousands of job seekers and employers already using Talent Hub
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth?mode=signup">Create Account</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
