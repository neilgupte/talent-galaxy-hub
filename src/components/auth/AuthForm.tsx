
import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Eye, EyeOff, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Common weak passwords list
const COMMON_PASSWORDS = [
  'password', 'password123', 'qwerty', '123456', 'admin', 'welcome', 
  'abc123', 'letmein', '111111', '12345678', 'default'
];

const AuthForm = () => {
  const { login, register, continueWithGoogle, continueWithLinkedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('job_seeker');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Password validation function
  useEffect(() => {
    if (!registerPassword) {
      setPasswordStrength(0);
      setPasswordErrors([
        'Minimum 8 characters',
        'At least 1 uppercase letter',
        'At least 1 lowercase letter',
        'At least 1 number',
        'At least 1 special character',
        'No more than 3 identical characters in a row',
        'Must not be a common password'
      ]);
      return;
    }

    const errors: string[] = [];

    // Check minimum length
    if (registerPassword.length < 8) {
      errors.push('Minimum 8 characters');
    }

    // Check uppercase
    if (!/[A-Z]/.test(registerPassword)) {
      errors.push('At least 1 uppercase letter');
    }

    // Check lowercase
    if (!/[a-z]/.test(registerPassword)) {
      errors.push('At least 1 lowercase letter');
    }

    // Check number
    if (!/[0-9]/.test(registerPassword)) {
      errors.push('At least 1 number');
    }

    // Check special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(registerPassword)) {
      errors.push('At least 1 special character');
    }

    // Check repeated characters
    if (/(.)\1{3,}/.test(registerPassword)) {
      errors.push('No more than 3 identical characters in a row');
    }

    // Check common passwords
    if (COMMON_PASSWORDS.some(pwd => registerPassword.toLowerCase().includes(pwd))) {
      errors.push('Must not be a common password');
    }

    setPasswordErrors(errors);

    // Calculate password strength
    const totalChecks = 7;
    const passedChecks = totalChecks - errors.length;
    const strength = Math.floor((passedChecks / totalChecks) * 100);
    setPasswordStrength(strength);
  }, [registerPassword]);

  const getStrengthLabel = (strength: number) => {
    if (strength === 0) return 'Very Weak';
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Moderate';
    if (strength < 100) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (strength: number) => {
    if (strength === 0) return 'bg-red-500';
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 100) return 'bg-green-400';
    return 'bg-green-600';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      // Navigation will be handled by the auth state change in AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordErrors.length > 0) {
      setError('Please fix all password requirements before continuing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(registerName, registerEmail, registerPassword, registerRole);
      // Navigation will be handled by the register function in AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await continueWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    }
  };

  const handleLinkedInLogin = async () => {
    setError(null);
    try {
      await continueWithLinkedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'LinkedIn login failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Login to Your Account</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" type="button">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  className="w-full"
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A12.337 12.337 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    />
                  </svg>
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLinkedInLogin} 
                  className="w-full"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </div>
            </CardContent>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Fill in your details to create a new account
              </CardDescription>
            </CardHeader>
            
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
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="registerPassword"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Password strength meter */}
                {registerPassword && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span>Password Strength:</span>
                      <span className={
                        passwordStrength >= 70 ? "text-green-600" : 
                        passwordStrength >= 40 ? "text-yellow-600" : 
                        "text-red-600"
                      }>
                        {getStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className={getStrengthColor(passwordStrength)} />
                    
                    <div className="space-y-1 mt-3">
                      <p className="text-xs font-medium">Password requirements:</p>
                      <ul className="space-y-1">
                        {[
                          'Minimum 8 characters',
                          'At least 1 uppercase letter',
                          'At least 1 lowercase letter',
                          'At least 1 number',
                          'At least 1 special character',
                          'No more than 3 identical characters in a row',
                          'Must not be a common password'
                        ].map((req, index) => (
                          <li key={index} className="flex items-center text-xs">
                            {passwordErrors.includes(req) ? (
                              <X className="h-3 w-3 text-red-500 mr-2 shrink-0" />
                            ) : (
                              <Check className="h-3 w-3 text-green-500 mr-2 shrink-0" />
                            )}
                            <span className={passwordErrors.includes(req) ? "text-red-500" : "text-green-500"}>
                              {req}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerConfirmPassword}
                    onChange={e => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup value={registerRole} onValueChange={value => setRegisterRole(value as UserRole)}>
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
                disabled={isLoading || passwordErrors.length > 0 || registerPassword !== registerConfirmPassword}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  className="w-full"
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A12.337 12.337 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    />
                  </svg>
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLinkedInLogin} 
                  className="w-full"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </div>
            </CardContent>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
