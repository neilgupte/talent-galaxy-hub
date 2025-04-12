
import { UserRole } from './common-types';
import { Profile } from './profile-types';
import { Company } from './company-types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  companyName?: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
