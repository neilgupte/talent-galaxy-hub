
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { UserRole } from '@/types';
import PasswordStrengthMeter, { validatePassword } from './PasswordStrengthMeter';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const RegisterForm = ({ onSubmit, isLoading, error }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('job_seeker');
  
  // Password validation state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Password validation
  useEffect(() => {
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
    setPasswordStrength(validation.strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (passwordErrors.length > 0) {
      return;
    }
    
    await onSubmit(name, email, password, role);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
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
          <Label htmlFor="registerEmail">Email</Label>
          <Input
            id="registerEmail"
            type="email"
            placeholder="your.email@example.com"
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
        
        <div className="space-y-2">
          <Label>I am a:</Label>
          <RadioGroup value={role} onValueChange={value => setRole(value as UserRole)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="job_seeker" id="job_seeker" />
              <Label htmlFor="job_seeker">Job Seeker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="employer" id="employer" />
              <Label htmlFor="employer">Employer</Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || passwordErrors.length > 0}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </CardContent>
    </form>
  );
};

export default RegisterForm;
