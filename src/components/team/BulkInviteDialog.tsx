'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Download, Check, X } from 'lucide-react';
import { useBulkInvitations } from '@/hooks/useBulkInvitations';

export function BulkInviteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailText, setEmailText] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const { isLoading, results, sendBulkInvitations, downloadTemplate, clearResults } = useBulkInvitations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) return;

    await sendBulkInvitations(emailText, role);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearResults();
    setEmailText('');
    setRole('member');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Bulk Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Invite Team Members</DialogTitle>
          <DialogDescription>
            Invite multiple team members at once by entering their email addresses
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="emails">Email Addresses</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
            <Textarea
              id="emails"
              placeholder="Enter email addresses separated by commas or new lines:&#10;&#10;john@example.com&#10;jane@example.com&#10;bob@example.com"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Separate email addresses with commas, semicolons, or new lines
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-role">Default Role</Label>
            <Select value={role} onValueChange={(value: 'admin' | 'member') => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading || !emailText.trim()}>
              {isLoading ? 'Sending Invitations...' : 'Send Invitations'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>

        {results.length > 0 && (
          <Card className="mt-4">
            <CardContent className="pt-4">
              <h4 className="font-medium mb-3">Invitation Results</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{result.email}</span>
                    <div className="flex items-center space-x-2">
                      {result.status === 'success' ? (
                        <Badge variant="default" className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>Sent</span>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <X className="h-3 w-3" />
                          <span>Failed</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
