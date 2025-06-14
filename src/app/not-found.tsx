import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription className="text-lg">
              The page you&apos;re looking for doesn&apos;t exist.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This might be because the page has been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Need help? Contact support
            </p>
            <Button variant="ghost" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Get Help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 