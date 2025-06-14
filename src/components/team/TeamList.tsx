
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMemberCard } from './TeamMemberCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending';
  joinedAt: string;
  avatar?: string;
}

interface TeamListProps {
  members: TeamMember[];
  currentUserId?: string;
  isCurrentUserAdmin?: boolean;
  onChangeRole?: (memberId: string, newRole: 'admin' | 'member') => void;
  onRemoveMember?: (memberId: string) => void;
  showHeader?: boolean;
  title?: string;
  description?: string;
  className?: string;
  emptyMessage?: string;
}

export function TeamList({
  members,
  currentUserId,
  isCurrentUserAdmin = false,
  onChangeRole = () => {},
  onRemoveMember = () => {},
  showHeader = true,
  title = "Team Members",
  description = "Manage your team members and their roles",
  className,
  emptyMessage = "No team members found. Invite someone to get started!"
}: TeamListProps) {
  if (members.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <EmptyState
            icon={Users}
            title="No team members"
            description={emptyMessage}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            currentUserId={currentUserId}
            isCurrentUserAdmin={isCurrentUserAdmin}
            onChangeRole={onChangeRole}
            onRemoveMember={onRemoveMember}
          />
        ))}
      </CardContent>
    </Card>
  );
}
