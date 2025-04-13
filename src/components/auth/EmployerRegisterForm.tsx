
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PasswordStrengthMeter, { validatePassword } from './PasswordStrengthMeter';

interface EmployerRegisterFormProps {
  onSubmit: (companyName: string, name: string, email: string, password: string, recruiterType: 'internal' | 'agency') => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EmployerRegisterForm = ({ onSubmit, isLoading, error }: EmployerRegisterFormProps) => {
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recruiterType, setRecruiterType] = useState<'internal' | 'agency'>('internal');
  
  // Password validation state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Password validation
  useEffect(() => {
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
    setPasswordStrength(validation.strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validation
    if (passwordErrors.length > 0) {
      return;
    }
    
    console.log("EmployerRegisterForm: Submitting form with company:", companyName, "recruiter type:", recruiterType);
    await onSubmit(companyName, name, email, password, recruiterType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <Label>Are you an internal recruiter or an external recruitment agency?</Label>
          <RadioGroup 
            value={recruiterType} 
            onValueChange={(value) => setRecruiterType(value as 'internal' | 'agency')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="internal" id="internal" />
              <Label htmlFor="internal" className="cursor-pointer">
                Internal Recruiter (hiring for my own company)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="agency" id="agency" />
              <Label htmlFor="agency" className="cursor-pointer">
                External Recruitment Agency (hiring for multiple clients)
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">{recruiterType === 'internal' ? 'Company Name' : 'Agency Name'}</Label>
          <Input
            id="companyName"
            type="text"
            placeholder={recruiterType === 'internal' ? "Acme Corporation" : "ABC Recruitment Agency"}
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Your Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registerEmail">Email Address</Label>
          <Input
            id="registerEmail"
            type="email"
            placeholder={recruiterType === 'internal' ? "your.name@company.com" : "your.name@agency.com"}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registerPassword">Password</Label>
          <div className="relative">
            <Input
              id="registerPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <PasswordStrengthMeter 
            password={password}
            passwordErrors={passwordErrors}
            passwordStrength={passwordStrength}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">By signing up, you agree to our:</p>
          <ul className="list-disc list-inside pl-2 space-y-1">
            <li>Employer terms and conditions</li>
            <li>Data handling in compliance with privacy regulations</li>
            <li>Communication via email about your account and services</li>
          </ul>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || (formSubmitted && passwordErrors.length > 0)}
        >
          {isLoading ? 'Creating Account...' : 'Create Employer Account'}
        </Button>
      </CardContent>
    </form>
  );
};

export default EmployerRegisterForm;
