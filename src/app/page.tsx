'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Features } from '@/components/Features';
import PowerFeatures from '@/components/PowerFeatures';
import { 
  Shield, 
  Users, 
  Globe, 
  Settings,
  ArrowRight,
  Github,
  Lock,
  Zap,
  Star,
  CheckCircle,
  Layout
} from 'lucide-react';

export default function HomePage() {
  const techStack = [
    'Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 
    'Supabase', 'React Query', 'React Hook Form', 'Zod', 'MIT License'
  ];

  const features = [
    'Free & Open Source',
    'Enterprise-grade security',
    'Real-time authentication',
    'Complete source code included'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 text-primary/20 animate-ping"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Supauth
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/components-gallery">
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Layout className="mr-2 h-4 w-4" />
                Components Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center space-y-8 mb-16">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border bg-muted/50 backdrop-blur-sm animate-fade-in">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">Open Source Authentication Kit</span>
              </div>
              
              <div className="space-y-6 animate-fade-in delay-200">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="block bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    Secure Auth
                  </span>
                  <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Build secure, scalable applications with this free, open-source authentication kit.
                  <span className="block mt-2 font-semibold text-foreground">
                    Complete with team management and beautiful UI components.
                  </span>
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in delay-300">
                {features.map((feature, index) => (
                  <div key={feature} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/30 border hover:bg-muted/50 transition-colors">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in delay-500">
                <a 
                  href="https://github.com/asim1801/supa-auth-nextjs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto"
                >
                  <Button className="px-6 py-4 h-auto w-full sm:w-auto hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub - 100% Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="text-center space-y-6 animate-fade-in delay-1000">
              <h3 className="text-lg font-semibold text-muted-foreground">Built with modern technologies</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      <PowerFeatures />

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Supauth</span>
            </div>
            <p className="text-muted-foreground">
              Free & Open Source - Built with ❤️ for the developer community
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <Link href="https://github.com/asim1801/supa-auth-nextjs/issues" target="_blank" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 