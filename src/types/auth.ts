
import { type Database } from '@/lib/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];

export interface User extends Profile {
  role: 'owner' | 'admin' | 'member';
  organizationId: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}
