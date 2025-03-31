
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage = () => {
  const lastUpdated = "May 15, 2023";
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>
      
      <div className="prose prose-headings:font-semibold prose-headings:text-2xl dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Introduction</h2>
          <Separator className="my-4" />
          <p>
            At Talent Hub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Information We Collect</h2>
          <Separator className="my-4" />
          <p>We may collect information about you in various ways, including:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Personal Data</h3>
          <p>
            Personally identifiable information that you provide to us, such as your name, address, phone number, email address, resume/CV, work history, education, and other information relevant to job applications or job postings.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>
          <p>
            Information that is created when you create an account, such as your login credentials, profile information, and account settings.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
          <p>
            Information about how you use our platform, such as the pages you visit, the time and date of your visits, the time spent on those pages, and other diagnostic data.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Cookies and Tracking Technologies</h3>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">How We Use Your Information</h2>
          <Separator className="my-4" />
          <p>We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our platform</li>
            <li>To match job seekers with job opportunities</li>
            <li>To process job applications</li>
            <li>To communicate with you about our services</li>
            <li>To improve our platform and user experience</li>
            <li>To monitor the usage of our platform</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Disclosure of Your Information</h2>
          <Separator className="my-4" />
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Employers:</strong> If you are a job seeker, we may share your information with employers who post jobs on our platform.
            </li>
            <li>
              <strong>Job Seekers:</strong> If you are an employer, we may share your job postings and company information with job seekers on our platform.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Your Data Protection Rights</h2>
          <Separator className="my-4" />
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction of your personal information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to request restriction of processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to object to processing of your personal information</li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Data Security</h2>
          <Separator className="my-4" />
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Changes to This Privacy Policy</h2>
          <Separator className="my-4" />
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Contact Us</h2>
          <Separator className="my-4" />
          <p>
            If you have any questions about this Privacy Policy, you can contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>By email: privacy@talenthub.com</li>
            <li>By phone: +1 (800) 123-4567</li>
            <li>By mail: 123 Innovation Way, San Francisco, CA 94103</li>
          </ul>
        </section>
        
        <div className="mt-12 text-center">
          <p className="mb-4">
            Need more information or have questions about our privacy practices?
          </p>
          <Link to="/contact" className="text-primary hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
