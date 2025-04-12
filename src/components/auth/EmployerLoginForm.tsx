
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, BriefcaseIcon } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface EmployerLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EmployerLoginForm = ({ onSubmit, isLoading, error }: EmployerLoginFormProps) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email required",
        description: "Please enter your company email address to reset your password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsResettingPassword(true);
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password"
      });
    } catch (err) {
      toast({
        title: "Failed to send reset email",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsResettingPassword(false);
    }
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
          <Label htmlFor="email">Company Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="company@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs" 
              type="button"
              onClick={handleForgotPassword}
              disabled={isResettingPassword}
            >
              {isResettingPassword ? "Sending..." : "Forgot password?"}
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In to Employer Portal'}
        </Button>
      </CardContent>
    </form>
  );
};

export default EmployerLoginForm;
