
# Component Documentation

## Core Components

### Authentication Components

Located in the main pages, these handle user authentication flows:

- **Index.tsx** - Landing page with login/signup forms
- **ResetPassword.tsx** - Password reset functionality

### Layout Components

#### DashboardLayout
Main layout wrapper for authenticated pages.

**Props:**
- `children: React.ReactNode` - Page content

**Features:**
- Responsive sidebar navigation
- User menu with profile/logout
- Theme toggle integration
- Organization switcher

#### ProtectedRoute
Route wrapper that requires authentication and optional role-based access.

**Props:**
- `children: React.ReactNode` - Protected content
- `requiredRole?: 'owner' | 'admin' | 'member'` - Minimum required role

**Usage:**
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>
```

### UI Components

#### ThemeToggle
Animated toggle switch for dark/light theme switching.

**Props:**
- `className?: string` - Additional CSS classes

**Features:**
- Smooth sliding animation
- Icons change based on theme
- Integrates with ThemeProvider

### Page Components

#### Dashboard
Main dashboard page showing user overview and quick actions.

#### Profile
User profile management page.

**Features:**
- Edit user information
- Change password
- Avatar upload (when connected to Supabase)

#### TeamMembers
Team management interface for admins/owners.

**Features:**
- View all team members
- Manage user roles
- Remove users from organization
- Send invitations

#### Invitations
Manage pending and past organization invitations.

**Features:**
- Accept/decline pending invitations
- View invitation history
- Role information display

#### CreateOrganization
Form to create new organizations.

**Access:** Admin role or higher required

## Hooks

### useAuth
Main authentication hook providing user state and auth methods.

**Returns:**
```tsx
{
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

**Usage:**
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### useTheme
Theme management hook from ThemeProvider.

**Returns:**
```tsx
{
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: Theme) => void;
}
```

## Types

### User
```tsx
interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  organizationId: string;
}
```

### Organization Roles
- **Owner**: Full access, can delete organization
- **Admin**: Can manage members and settings
- **Member**: Basic access to organization content

## Styling Guidelines

### Theme Support
All components support both light and dark themes using CSS custom properties.

### Responsive Design
Components use Tailwind's responsive utilities:
- Mobile-first approach
- Tablet breakpoint: `md:`
- Desktop breakpoint: `lg:`

### Color Scheme
- Primary: Blue variants
- Secondary: Gray variants
- Success: Green variants
- Destructive: Red variants

### Component Structure
Most components follow this pattern:
```tsx
export default function ComponentName() {
  // State and hooks
  // Event handlers
  // Return JSX with proper className organization
}
```
