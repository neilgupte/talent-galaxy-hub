
import React from 'react';
import { Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Common weak passwords list
const COMMON_PASSWORDS = [
  'password', 'password123', 'qwerty', '123456', 'admin', 'welcome', 
  'abc123', 'letmein', '111111', '12345678', 'default'
];

interface PasswordStrengthMeterProps {
  password: string;
  passwordErrors: string[];
  passwordStrength: number;
}

export const validatePassword = (password: string): { errors: string[], strength: number } => {
  if (!password) {
    return {
      errors: [
        'Minimum 8 characters',
        'At least 1 uppercase letter',
        'At least 1 lowercase letter',
        'At least 1 number',
        'At least 1 special character',
        'No more than 3 identical characters in a row',
        'Must not be a common password'
      ],
      strength: 0
    };
  }

  const errors: string[] = [];

  // Check minimum length
  if (password.length < 8) {
    errors.push('Minimum 8 characters');
  }

  // Check uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('At least 1 uppercase letter');
  }

  // Check lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('At least 1 lowercase letter');
  }

  // Check number
  if (!/[0-9]/.test(password)) {
    errors.push('At least 1 number');
  }

  // Check special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('At least 1 special character');
  }

  // Check repeated characters
  if (/(.)\1{3,}/.test(password)) {
    errors.push('No more than 3 identical characters in a row');
  }

  // Check common passwords
  if (COMMON_PASSWORDS.some(pwd => password.toLowerCase().includes(pwd))) {
    errors.push('Must not be a common password');
  }

  // Calculate password strength
  const totalChecks = 7;
  const passedChecks = totalChecks - errors.length;
  const strength = Math.floor((passedChecks / totalChecks) * 100);

  return { errors, strength };
};

export const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return 'Very Weak';
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Moderate';
  if (strength < 100) return 'Strong';
  return 'Very Strong';
};

export const getStrengthColor = (strength: number): string => {
  if (strength === 0) return 'bg-red-500';
  if (strength < 40) return 'bg-red-500';
  if (strength < 70) return 'bg-yellow-500';
  if (strength < 100) return 'bg-green-400';
  return 'bg-green-600';
};

const PasswordStrengthMeter = ({ password, passwordErrors, passwordStrength }: PasswordStrengthMeterProps) => {
  if (!password) return null;
  
  return (
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
  );
};

export default PasswordStrengthMeter;
