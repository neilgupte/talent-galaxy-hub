
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlanFeature {
  feature: string;
  included: boolean;
  tooltip?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  features: PlanFeature[];
  highlighted?: boolean;
  jobPostings: number | string;
  featuredJobs: number;
  candidateSearches: string;
}

const PricingPage = () => {
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  const [billingPeriod, setBillingPeriod] = React.useState('monthly');
  
  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses just getting started with hiring.',
      monthlyPrice: 49,
      annualPrice: 39,
      currency: '$',
      jobPostings: 3,
      featuredJobs: 0,
      candidateSearches: '25 per month',
      features: [
        { 
          feature: 'AI Candidate Matching', 
          included: true,
          tooltip: 'Our algorithm matches your job to potential candidates' 
        },
        { 
          feature: 'Branded Company Profile', 
          included: true 
        },
        { 
          feature: 'Basic Application Management', 
          included: true 
        },
        { 
          feature: 'Email Support', 
          included: true 
        },
        { 
          feature: 'Application Analytics', 
          included: false,
          tooltip: 'Track performance of your job postings' 
        },
        { 
          feature: 'Featured Job Postings', 
          included: false 
        },
        { 
          feature: 'Priority Placement in Search', 
          included: false 
        },
        { 
          feature: 'Candidate Communication Tools', 
          included: false 
        },
        { 
          feature: 'Dedicated Account Manager', 
          included: false 
        }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Designed for growing companies with regular hiring needs.',
      monthlyPrice: 99,
      annualPrice: 79,
      currency: '$',
      jobPostings: 10,
      featuredJobs: 2,
      candidateSearches: '100 per month',
      highlighted: true,
      features: [
        { 
          feature: 'AI Candidate Matching', 
          included: true,
          tooltip: 'Our algorithm matches your job to potential candidates' 
        },
        { 
          feature: 'Branded Company Profile', 
          included: true 
        },
        { 
          feature: 'Basic Application Management', 
          included: true 
        },
        { 
          feature: 'Email Support', 
          included: true 
        },
        { 
          feature: 'Application Analytics', 
          included: true,
          tooltip: 'Track performance of your job postings' 
        },
        { 
          feature: 'Featured Job Postings', 
          included: true 
        },
        { 
          feature: 'Priority Placement in Search', 
          included: true 
        },
        { 
          feature: 'Candidate Communication Tools', 
          included: false 
        },
        { 
          feature: 'Dedicated Account Manager', 
          included: false 
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For organizations with high-volume hiring and custom needs.',
      monthlyPrice: 249,
      annualPrice: 199,
      currency: '$',
      jobPostings: 'Unlimited',
      featuredJobs: 10,
      candidateSearches: 'Unlimited',
      features: [
        { 
          feature: 'AI Candidate Matching', 
          included: true,
          tooltip: 'Our algorithm matches your job to potential candidates' 
        },
        { 
          feature: 'Branded Company Profile', 
          included: true 
        },
        { 
          feature: 'Basic Application Management', 
          included: true 
        },
        { 
          feature: 'Email Support', 
          included: true 
        },
        { 
          feature: 'Application Analytics', 
          included: true,
          tooltip: 'Track performance of your job postings' 
        },
        { 
          feature: 'Featured Job Postings', 
          included: true 
        },
        { 
          feature: 'Priority Placement in Search', 
          included: true 
        },
        { 
          feature: 'Candidate Communication Tools', 
          included: true 
        },
        { 
          feature: 'Dedicated Account Manager', 
          included: true 
        }
      ]
    }
  ];

  const getStartedLink = (planId: string) => {
    if (!isAuthenticated) {
      return `/auth?mode=signup&role=employer&plan=${planId}`;
    } else if (user?.role !== 'employer') {
      return `/account/upgrade?plan=${planId}`;
    } else {
      return `/account/billing?plan=${planId}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6">Pricing Plans for Employers</h1>
        <p className="text-xl text-muted-foreground">
          Choose the right plan to find qualified candidates and grow your team.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <Tabs defaultValue="monthly" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="monthly"
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly Billing
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              onClick={() => setBillingPeriod('annual')}
            >
              Annual Billing <span className="ml-2 text-green-500 text-xs font-medium">Save 20%</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg border overflow-hidden ${
              plan.highlighted
                ? 'border-primary shadow-lg relative'
                : 'border-border'
            }`}
          >
            {plan.highlighted && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground mt-2 min-h-[50px]">
                {plan.description}
              </p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold">
                  {plan.currency}
                  {billingPeriod === 'monthly'
                    ? plan.monthlyPrice
                    : plan.annualPrice}
                </span>
                <span className="text-muted-foreground ml-2">
                  / month
                </span>
              </div>

              <Button
                asChild
                className="w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                <Link to={getStartedLink(plan.id)}>
                  Get Started
                </Link>
              </Button>
            </div>

            <div className="border-t border-border p-6">
              <h4 className="font-semibold mb-4">What's included:</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                  <span>
                    <strong>{plan.jobPostings}</strong> Job Postings
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                  <span>
                    <strong>{plan.featuredJobs}</strong> Featured Job Slots
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                  <span>
                    <strong>{plan.candidateSearches}</strong> Candidate Searches
                  </span>
                </li>

                <div className="border-t border-border my-4"></div>

                <TooltipProvider>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        className={`rounded-full p-1 ${
                          feature.included
                            ? 'bg-primary/10'
                            : 'bg-muted'
                        }`}
                      >
                        {feature.included ? (
                          <Check
                            className={`h-4 w-4 ${
                              feature.included
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </span>
                      <span
                        className={
                          feature.included ? '' : 'text-muted-foreground line-through'
                        }
                      >
                        {feature.feature}
                      </span>
                      {feature.tooltip && (
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </li>
                  ))}
                </TooltipProvider>
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-muted rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. The changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How does billing work?</h3>
              <p className="text-muted-foreground">
                You'll be billed at the beginning of each billing cycle (monthly or annual). We accept all major credit cards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                New accounts can post one job for free to test our platform before committing to a paid plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I need more job postings?</h3>
              <p className="text-muted-foreground">
                You can purchase additional job posting credits or upgrade to a higher tier plan.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Need a Custom Solution?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          For larger organizations or unique requirements, we offer tailored solutions to meet your specific hiring needs.
        </p>
        <Button asChild size="lg">
          <Link to="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
};

export default PricingPage;
