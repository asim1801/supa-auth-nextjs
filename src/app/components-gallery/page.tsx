'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Calendar } from '@/components/ui/calendar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Features } from '@/components/Features';
import { 
  Shield, 
  Users, 
  Globe, 
  Settings,
  ArrowLeft,
  Github,
  Lock,
  Zap,
  Star,
  CheckCircle,
  Layout,
  Home,
  AlertCircle,
  Terminal,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  User,
  Building2,
  Code,
  Palette,
  Component,
  Eye,
  Copy,
  Check,
  UserPlus,
  Crown
} from 'lucide-react';

export default function ComponentsGallery() {
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(13);

  const copyToClipboard = (text: string, componentName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedComponent(componentName);
    setTimeout(() => setCopiedComponent(null), 2000);
  };

  const starterKitComponents = [
    {
      title: "Authentication Components",
      icon: <Shield className="h-5 w-5" />,
      description: "Complete authentication system with forms, social auth, and magic links",
      components: [
        {
          name: "Sign In Form",
          description: "Email/password authentication with validation",
          preview: (
            <Card className="w-full max-w-md bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Sign In</CardTitle>
                <CardDescription className="text-muted-foreground">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Email</label>
                  <input className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="demo@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Password</label>
                  <input type="password" className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="••••••••" />
                </div>
                <Button className="w-full">Sign In</Button>
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account? <Link href="#" className="text-primary hover:underline">Sign up</Link>
                </p>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["Email/Password auth", "Form validation", "Error handling", "Responsive design"]
        },
        {
          name: "Sign Up Form", 
          description: "User registration with email verification",
          preview: (
            <Card className="w-full max-w-md bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Create Account</CardTitle>
                <CardDescription className="text-muted-foreground">Sign up for a new account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Full Name</label>
                  <input className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Email</label>
                  <input className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Password</label>
                  <input type="password" className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="••••••••" />
                </div>
                <Button className="w-full">Create Account</Button>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["User registration", "Email verification", "Password strength", "Terms acceptance"]
        },
        {
          name: "Social Auth",
          description: "OAuth integration with Google, GitHub, and other providers",
          preview: (
            <Card className="w-full max-w-md bg-card border-border">
              <CardContent className="pt-6 space-y-3">
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Magic Link
                </Button>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["OAuth providers", "Magic links", "Social login", "Secure tokens"]
        }
      ]
    },
    {
      title: "Profile Management",
      icon: <User className="h-5 w-5" />,
      description: "Complete user profile system with avatar upload and settings",
      components: [
        {
          name: "Profile Card",
          description: "User profile overview with stats and verification status",
          preview: (
            <Card className="w-full max-w-sm bg-card border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-card-foreground">Alex Demo User</h3>
                    <p className="text-sm text-muted-foreground">demo@example.com</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">Member since 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="default" className="text-xs">Email verified</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">2FA Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["Avatar upload", "Profile info", "Verification status", "Account stats"]
        },
        {
          name: "Profile Form",
          description: "Editable user profile with validation",
          preview: (
            <Card className="w-full max-w-md bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Profile Information</CardTitle>
                <CardDescription className="text-muted-foreground">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Full Name</label>
                  <input className="w-full p-2 border border-border rounded bg-background text-foreground" defaultValue="Alex Demo User" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Email</label>
                  <input className="w-full p-2 border border-border rounded bg-background text-foreground" defaultValue="demo@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Bio</label>
                  <textarea className="w-full p-2 border border-border rounded h-20 bg-background text-foreground" placeholder="Tell us about yourself..."></textarea>
                </div>
                <Button className="w-full">Update Profile</Button>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["Form validation", "Real-time updates", "File upload", "Change detection"]
        },
        {
          name: "Change Password",
          description: "Secure password change with validation",
          preview: (
            <Card className="w-full max-w-md bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Change Password</CardTitle>
                <CardDescription className="text-muted-foreground">Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Current Password</label>
                  <input type="password" className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">New Password</label>
                  <input type="password" className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Confirm Password</label>
                  <input type="password" className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="••••••••" />
                </div>
                <Button className="w-full">Update Password</Button>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["Password strength", "Confirmation check", "Security validation", "Toast notifications"]
        }
      ]
    },
    {
      title: "Team Management",
      icon: <Users className="h-5 w-5" />,
      description: "Multi-tenant team system with roles and permissions",
      components: [
        {
          name: "Team Overview",
          description: "Dashboard showing team statistics and member count",
          preview: (
            <div className="grid grid-cols-3 gap-4 w-full">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-xl font-bold text-card-foreground">12</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-xl font-bold text-card-foreground">3</p>
                      <p className="text-xs text-muted-foreground">Admins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="text-xl font-bold text-card-foreground">1</p>
                      <p className="text-xs text-muted-foreground">Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ),
          path: "/team-members",
          features: ["Team statistics", "Role distribution", "Member analytics", "Activity tracking"]
        },
        {
          name: "Invite Member",
          description: "Send team invitations with role selection",
          preview: (
            <Card className="w-full max-w-md bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Invite Team Member</CardTitle>
                <CardDescription className="text-muted-foreground">Send an invitation to join your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Email Address</label>
                  <input className="w-full p-2 border border-border rounded bg-background text-foreground" placeholder="colleague@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Role</label>
                  <select className="w-full p-2 border border-border rounded bg-background text-foreground">
                    <option>Member</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-card-foreground">Message (Optional)</label>
                  <textarea className="w-full p-2 border border-border rounded h-16 bg-background text-foreground" placeholder="Welcome to our team!"></textarea>
                </div>
                <Button className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </CardContent>
            </Card>
          ),
          path: "/team-members",
          features: ["Email invitations", "Role assignment", "Custom messages", "Invitation tracking"]
        },
        {
          name: "Team Member Card",
          description: "Individual member profile with role management",
          preview: (
            <Card className="w-full max-w-sm bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c2b7a5b9?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-semibold text-card-foreground">Jane Doe</h4>
                      <p className="text-sm text-muted-foreground">jane@example.com</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Admin</Badge>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit Role</Button>
                      <Button size="sm" variant="ghost">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
          path: "/team-members",
          features: ["Member profiles", "Role management", "Status tracking", "Quick actions"]
        }
      ]
    },
    {
      title: "Dashboard Layout",
      icon: <Layout className="h-5 w-5" />,
      description: "Complete dashboard with navigation, user menu, and responsive design",
      components: [
        {
          name: "Dashboard Header",
          description: "Navigation header with user menu and organization switcher",
          preview: (
            <Card className="w-full bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Demo
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <h1 className="text-xl font-semibold text-card-foreground">Supauth</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <ThemeToggle />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
          path: "/profile",
          features: ["Responsive navigation", "User menu", "Quick actions", "Theme toggle"]
        },
        {
          name: "Organization Switcher",
          description: "Multi-tenant organization selection",
          preview: (
            <Card className="w-full max-w-sm bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Current Organization</span>
                </div>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Demo Company</span>
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Separator />
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Organization
                </Button>
              </CardContent>
            </Card>
          ),
          path: "/create-organization",
          features: ["Multi-tenant support", "Organization switching", "Creation flow", "Settings access"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Starter Kit Components</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a 
              href="https://github.com/asim1801/supa-auth-nextjs" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">Complete Authentication Starter Kit</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Production-Ready Components
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the complete authentication system with user management, team collaboration, 
              and secure access control. All components are production-ready and fully functional.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline">Authentication System</Badge>
              <Badge variant="outline">Team Management</Badge>
              <Badge variant="outline">User Profiles</Badge>
              <Badge variant="outline">Role-Based Access</Badge>
              <Badge variant="outline">Multi-Tenant</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Components Showcase */}
      <section className="container mx-auto px-4 py-20">
        <div className="space-y-16">
          {starterKitComponents.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  {category.icon}
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>
              
              <div className="grid gap-12">
                {category.components.map((component, componentIndex) => (
                  <div key={component.name} className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold">{component.name}</h3>
                      <p className="text-muted-foreground">{component.description}</p>
                    </div>
                    
                    <Card className="overflow-hidden bg-muted/10 border-border">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-center min-h-[300px]">
                          {component.preview}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {component.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Try It Out</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Link href={component.path}>
                            <Button className="w-full">
                              <Eye className="mr-2 h-4 w-4" />
                              View Live Component
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Build Your App?</h2>
            <p className="text-lg text-muted-foreground">
              Get started with this complete authentication starter kit. All components are production-ready and fully customizable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/asim1801/supa-auth-nextjs" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full sm:w-auto">
                  <Github className="mr-2 h-5 w-5" />
                  Clone Repository
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 