
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Shield, User, Clock, Mail } from 'lucide-react';

interface TeamMemberCardProps {
  member: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    status: 'active' | 'pending';
    joinedAt: string;
    avatar?: string;
  };
  currentUserId?: string;
  isCurrentUserAdmin: boolean;
  onChangeRole: (memberId: string, newRole: 'admin' | 'member') => void;
  onRemoveMember: (memberId: string) => void;
}

export function TeamMemberCard({ 
  member, 
  currentUserId, 
  isCurrentUserAdmin, 
  onChangeRole, 
  onRemoveMember 
}: TeamMemberCardProps) {
  const isCurrentUser = member.id === currentUserId;
  const initials = member.name.split(' ').map(n => n[0]).join('');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="group flex items-center justify-between p-6 border-2 rounded-xl hover:shadow-lg hover:border-primary/20 transition-all duration-200 bg-card">
      <div className="flex items-center space-x-6">
        <Avatar className="h-14 w-14 ring-2 ring-border group-hover:ring-primary/20 transition-all duration-200">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-secondary/20">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <div className="flex items-center space-x-2">
              {member.status === 'pending' && (
                <Badge variant={getStatusBadgeVariant(member.status)} className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Pending</span>
                </Badge>
              )}
              {isCurrentUser && (
                <Badge variant="outline" className="text-primary border-primary">
                  You
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{member.email}</span>
          </div>
          
          <p className="text-xs text-muted-foreground flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Badge 
          variant={getRoleBadgeVariant(member.role)} 
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium"
        >
          {getRoleIcon(member.role)}
          <span className="capitalize">{member.role}</span>
        </Badge>
        
        {isCurrentUserAdmin && !isCurrentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => onChangeRole(member.id, member.role === 'admin' ? 'member' : 'admin')}
                className="flex items-center space-x-2"
              >
                {member.role === 'admin' ? (
                  <>
                    <User className="h-4 w-4" />
                    <span>Make Member</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Make Admin</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onRemoveMember(member.id)}
                className="text-destructive hover:text-destructive focus:text-destructive"
              >
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
