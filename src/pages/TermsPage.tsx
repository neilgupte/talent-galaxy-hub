
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const TermsPage = () => {
  const lastUpdated = "May 15, 2023";
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>
      
      <div className="prose prose-headings:font-semibold prose-headings:text-2xl dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Agreement to Terms</h2>
          <Separator className="my-4" />
          <p>
            These Terms of Service constitute a legally binding agreement made between you and Talent Hub concerning your access to and use of our website and platform.
          </p>
          <p>
            By accessing or using the platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Platform Usage</h2>
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Account Registration</h3>
          <p>
            To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Account Security</h3>
          <p>
            You are responsible for safeguarding the password that you use to access the platform. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">User Content</h3>
          <p>
            You retain ownership of any content you submit to the platform. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Prohibited Activities</h3>
          <p>
            You may not access or use the platform for any purpose other than that for which we make it available. The platform may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Job Seeker Terms</h2>
          <Separator className="my-4" />
          <p>
            As a job seeker, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information about your skills, experience, and qualifications</li>
            <li>Not misrepresent your education, experience, or other qualifications</li>
            <li>Not apply for jobs for which you are clearly unqualified</li>
            <li>Not share or distribute job listings outside the platform without permission</li>
            <li>Not use automated methods to apply for jobs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Employer Terms</h2>
          <Separator className="my-4" />
          <p>
            As an employer, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information about your company and job opportunities</li>
            <li>Not post jobs that are misleading, illegal, or discriminatory</li>
            <li>Not use the platform to collect personal information for purposes other than considering an individual for employment</li>
            <li>Comply with all applicable employment and data protection laws</li>
            <li>Not contact candidates for purposes unrelated to employment opportunities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Intellectual Property</h2>
          <Separator className="my-4" />
          <p>
            The platform and its original content, features, and functionality are owned by Talent Hub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Limitation of Liability</h2>
          <Separator className="my-4" />
          <p>
            In no event will Talent Hub, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the platform, any websites linked to it, any content on the platform or such other websites, including any direct, indirect, special, incidental, consequential, or punitive damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Indemnification</h2>
          <Separator className="my-4" />
          <p>
            You agree to defend, indemnify, and hold harmless Talent Hub, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Service or your use of the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Termination</h2>
          <Separator className="my-4" />
          <p>
            We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue using the platform or contact us to request account deletion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Governing Law</h2>
          <Separator className="my-4" />
          <p>
            These Terms shall be governed by and defined following the laws of [Your Country/State]. Talent Hub and yourself irrevocably consent that the courts of [Your Country/State] shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Changes to Terms</h2>
          <Separator className="my-4" />
          <p>
            We reserve the right to modify these Terms at any time. If we make changes to these Terms, we will post the revised Terms on the platform and update the "Last Updated" date at the top of these Terms.
          </p>
          <p>
            Your continued use of the platform following the posting of revised Terms means that you accept and agree to the changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Contact Us</h2>
          <Separator className="my-4" />
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>By email: legal@talenthub.com</li>
            <li>By phone: +1 (800) 123-4567</li>
            <li>By mail: 123 Innovation Way, San Francisco, CA 94103</li>
          </ul>
        </section>
        
        <div className="mt-12 text-center">
          <p className="mb-4">
            By using Talent Hub, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="text-primary hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
