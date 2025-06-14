'use client'

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Users, Globe } from 'lucide-react';

export default function CreateOrganizationPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Organization</h1>
          <p className="text-muted-foreground">
            Set up your new organization to start collaborating with your team.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Organization Details</span>
            </CardTitle>
            <CardDescription>
              Provide basic information about your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                placeholder="Enter organization name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-slug">Organization Slug</Label>
              <Input
                id="org-slug"
                placeholder="my-organization"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                This will be used in your organization URL
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                placeholder="Brief description of your organization"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1">
                <Building className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
              <Button variant={"outline" as const} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Team Management</p>
                  <p className="text-sm text-muted-foreground">Invite and manage team members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Global Access</p>
                  <p className="text-sm text-muted-foreground">Collaborate from anywhere</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 