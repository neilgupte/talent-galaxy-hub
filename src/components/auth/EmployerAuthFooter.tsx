
import React from 'react';
import SocialLogin from './SocialLogin';

interface EmployerAuthFooterProps {
  activeTab: string;
  onGoogleLogin: () => Promise<void>;
  onLinkedInLogin: () => Promise<void>;
}

const EmployerAuthFooter: React.FC<EmployerAuthFooterProps> = ({
  activeTab,
  onGoogleLogin,
  onLinkedInLogin
}) => {
  return (
    <div className="px-6 pb-6">
      <p className="text-center text-sm text-muted-foreground mb-2">Or continue with</p>
      <SocialLogin
        onGoogleLogin={onGoogleLogin}
        onLinkedInLogin={onLinkedInLogin}
      />
      <div className="text-center mt-4 text-sm">
        <a href="/auth" className="text-primary hover:underline">
          {activeTab === 'login' 
            ? 'Looking for a job? Sign in as a job seeker'
            : 'Looking for a job? Sign up as a job seeker'
          }
        </a>
      </div>
    </div>
  );
};

export default EmployerAuthFooter;
