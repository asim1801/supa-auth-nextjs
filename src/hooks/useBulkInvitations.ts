
import { useState } from 'react';
import { useOrganization } from '@/lib/organization';
import { useToast } from '@/hooks/use-toast';

export interface BulkInviteResult {
  email: string;
  status: 'success' | 'error';
  message?: string;
}

export function useBulkInvitations() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BulkInviteResult[]>([]);
  const { inviteMember } = useOrganization();
  const { toast } = useToast();

  const parseEmailList = (emailText: string): string[] => {
    return emailText
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)
      .filter((email, index, arr) => arr.indexOf(email) === index); // Remove duplicates
  };

  const validateEmails = (emails: string[]): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.filter(email => emailRegex.test(email));
  };

  const sendBulkInvitations = async (
    emailText: string, 
    role: 'admin' | 'member' = 'member',
    customMessage?: string
  ) => {
    setIsLoading(true);
    setResults([]);

    const emails = parseEmailList(emailText);
    const validEmails = validateEmails(emails);
    const invalidEmails = emails.filter(email => !validEmails.includes(email));

    const inviteResults: BulkInviteResult[] = [];

    // Add invalid emails to results
    invalidEmails.forEach(email => {
      inviteResults.push({
        email,
        status: 'error',
        message: 'Invalid email format'
      });
    });

    // Process valid emails
    for (const email of validEmails) {
      try {
        await inviteMember(email, role);
        inviteResults.push({
          email,
          status: 'success'
        });
      } catch (error: any) {
        inviteResults.push({
          email,
          status: 'error',
          message: error.message || 'Failed to send invitation'
        });
      }
    }

    setResults(inviteResults);
    setIsLoading(false);

    const successCount = inviteResults.filter(r => r.status === 'success').length;
    const errorCount = inviteResults.filter(r => r.status === 'error').length;

    toast({
      title: 'Bulk Invitations Complete',
      description: `${successCount} invitations sent successfully, ${errorCount} failed`,
      variant: errorCount > 0 ? 'destructive' : 'default',
    });

    return inviteResults;
  };

  const downloadTemplate = () => {
    const csvContent = 'Email Address\nexample1@company.com\nexample2@company.com\nexample3@company.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitation-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearResults = () => setResults([]);

  return {
    isLoading,
    results,
    sendBulkInvitations,
    downloadTemplate,
    clearResults,
    parseEmailList,
    validateEmails,
  };
}
