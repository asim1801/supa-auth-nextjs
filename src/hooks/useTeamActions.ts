
import { useState } from 'react';
import { useOrganization } from '@/lib/organization';
import { useToast } from '@/hooks/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';

export function useTeamActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { inviteMember, updateMemberRole, removeMember, refreshMembers, members } = useOrganization();
  const { toast } = useToast();
  const { logMemberInvite, logMemberRoleChange, logMemberRemoved } = useAuditLogger();

  const handleInviteMember = async (email: string, role: 'admin' | 'member') => {
    setIsLoading(true);
    try {
      await inviteMember(email, role);
      await logMemberInvite(email, role);
      toast({
        title: 'Invitation sent',
        description: `Invitation sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Failed to invite member:', error);
      toast({
        title: 'Failed to send invitation',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      const member = members.find(m => m.id === memberId);
      const oldRole = member?.role;
      
      await updateMemberRole(memberId, newRole);
      
      if (oldRole && member?.user?.email) {
        await logMemberRoleChange(memberId, oldRole, newRole);
      }
      
      toast({
        title: 'Role updated',
        description: 'Member role has been updated',
      });
    } catch (error: any) {
      console.error('Failed to update role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update member role',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const member = members.find(m => m.id === memberId);
      
      await removeMember(memberId);
      
      if (member?.user?.email) {
        await logMemberRemoved(memberId, member.user.email);
      }
      
      toast({
        title: 'Member removed',
        description: 'Member has been removed from the team',
      });
    } catch (error: any) {
      console.error('Failed to remove member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  return {
    isLoading,
    handleInviteMember,
    handleChangeRole,
    handleRemoveMember,
  };
}
