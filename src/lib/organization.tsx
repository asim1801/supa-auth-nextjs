'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { useAuth } from './auth';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  ownerId: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'inactive';
  joinedAt: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  members: OrganizationMember[];
  isLoading: boolean;
  switchOrganization: (organizationId: string) => void;
  refreshOrganizations: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  inviteMember: (email: string, role: 'admin' | 'member') => Promise<void>;
  updateMemberRole: (memberId: string, role: 'admin' | 'member') => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshOrganizations = React.useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user's organization memberships
      const { data: memberships, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          role,
          status,
          organizations (
            id,
            name,
            slug,
            description,
            logo_url,
            created_at,
            owner_id
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching organizations:', error);
        return;
      }

      // Properly handle the nested structure from Supabase
      const orgs: Organization[] = [];
      
      if (memberships) {
        for (const membership of memberships) {
          // Handle the case where organizations might be an array or single object
          const orgData = Array.isArray(membership.organizations) 
            ? membership.organizations[0] 
            : membership.organizations;
            
          if (orgData) {
            orgs.push({
              id: orgData.id,
              name: orgData.name,
              slug: orgData.slug,
              description: orgData.description || undefined,
              logoUrl: orgData.logo_url || undefined,
              createdAt: orgData.created_at,
              ownerId: orgData.owner_id,
            });
          }
        }
      }

      setOrganizations(orgs);

      // Set current organization from localStorage or first org
      const savedOrgId = localStorage.getItem('currentOrganizationId');
      const currentOrg = savedOrgId 
        ? orgs.find(org => org.id === savedOrgId) 
        : orgs[0];

      if (currentOrg) {
        setCurrentOrganization(currentOrg);
        localStorage.setItem('currentOrganizationId', currentOrg.id);
        // Call refreshMembers inline to avoid circular dependency
        if (isSupabaseConfigured()) {
          try {
            const { data: memberData, error } = await supabase
              .from('organization_members')
              .select(`
                id,
                user_id,
                organization_id,
                role,
                status,
                created_at,
                profiles (
                  id,
                  email,
                  full_name,
                  avatar_url
                )
              `)
              .eq('organization_id', currentOrg.id)
              .eq('status', 'active');

            if (!error && memberData) {
              const formattedMembers: OrganizationMember[] = [];
              for (const member of memberData) {
                const profileData = Array.isArray(member.profiles) 
                  ? member.profiles[0] 
                  : member.profiles;

                formattedMembers.push({
                  id: member.id,
                  userId: member.user_id,
                  organizationId: member.organization_id,
                  role: member.role,
                  status: member.status,
                  joinedAt: member.created_at,
                  user: profileData ? {
                    id: profileData.id,
                    email: profileData.email,
                    fullName: profileData.full_name || undefined,
                    avatarUrl: profileData.avatar_url || undefined,
                  } : undefined
                });
              }
              setMembers(formattedMembers);
            }
          } catch (memberError) {
            console.error('Error loading members:', memberError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshMembers = React.useCallback(async (orgId?: string) => {
    const organizationId = orgId || currentOrganization?.id;
    if (!organizationId || !isSupabaseConfigured()) return;

    try {
      const { data: memberData, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          organization_id,
          role,
          status,
          created_at,
          profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching members:', error);
        return;
      }

      const formattedMembers: OrganizationMember[] = [];

      if (memberData) {
        for (const member of memberData) {
          const profileData = Array.isArray(member.profiles) 
            ? member.profiles[0] 
            : member.profiles;

          formattedMembers.push({
            id: member.id,
            userId: member.user_id,
            organizationId: member.organization_id,
            role: member.role,
            status: member.status,
            joinedAt: member.created_at,
            user: profileData ? {
              id: profileData.id,
              email: profileData.email,
              fullName: profileData.full_name || undefined,
              avatarUrl: profileData.avatar_url || undefined,
            } : undefined
          });
        }
      }

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }, [currentOrganization?.id]);

  useEffect(() => {
    if (isLoaded && user) {
      refreshOrganizations();
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [user, isLoaded, refreshOrganizations]);

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      localStorage.setItem('currentOrganizationId', organizationId);
      refreshMembers(organizationId);
    }
  };

  const inviteMember = async (email: string, role: 'admin' | 'member') => {
    if (!currentOrganization || !user || !isSupabaseConfigured()) {
      throw new Error('No current organization or user');
    }

    // Enhanced validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check if user is already a member
    const existingMember = members.find(m => m.user?.email === email);
    if (existingMember) {
      throw new Error('User is already a member of this organization');
    }

    // Create invitation with enhanced tracking
    const { error } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: currentOrganization.id,
        email,
        role,
        invited_by: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('An invitation for this email is already pending');
      }
      throw new Error(error.message);
    }
  };

  const updateMemberRole = async (memberId: string, role: 'admin' | 'member') => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('id', memberId);

    if (error) {
      throw new Error(error.message);
    }

    await refreshMembers();
  };

  const removeMember = async (memberId: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('organization_members')
      .update({ status: 'inactive' })
      .eq('id', memberId);

    if (error) {
      throw new Error(error.message);
    }

    await refreshMembers();
  };

  const value = {
    currentOrganization,
    organizations,
    members,
    isLoading,
    switchOrganization,
    refreshOrganizations,
    refreshMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}
