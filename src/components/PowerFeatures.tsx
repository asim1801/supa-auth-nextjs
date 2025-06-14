'use client';
import {
	Zap,
	Cpu,
	Fingerprint,
	Pencil,
	Settings2,
	Sparkles,
	LogIn,
	ShieldCheck,
	KeyRound,
	Mail,
	Github,
	User,
	Settings,
	Shield,
	Users,
	UserPlus,
	MailPlus,
	Activity,
	Building2,
	Lock,
	ArrowRightLeft,
	Component,
	Palette,
	MonitorSmartphone,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';

const featureCategories = [
	{
		title: 'Authentication & Security',
		features: [
			{
				title: 'Sign In & Sign Up',
				icon: LogIn,
				description: 'Complete authentication flows with email verification.',
			},
			{
				title: 'Two-Factor Authentication',
				icon: ShieldCheck,
				description: 'Enhanced security with 2FA setup and QR codes.',
			},
			{
				title: 'Password Reset',
				icon: KeyRound,
				description: 'Secure password recovery with email verification.',
			},
			{
				title: 'Magic Link Auth',
				icon: Mail,
				description: 'Passwordless authentication system.',
			},
			{
				title: 'Social Login',
				icon: Github,
				description: 'OAuth integration with GitHub and Google.',
			},
		],
	},
	{
		title: 'User Management',
		features: [
			{
				title: 'User Profiles',
				icon: User,
				description: 'Complete profile management with avatar upload.',
			},
			{
				title: 'Account Settings',
				icon: Settings,
				description: 'Personal information and preferences.',
			},
			{
				title: 'Security Settings',
				icon: Shield,
				description: 'Password changes and security options.',
			},
		],
	},
	{
		title: 'Team Collaboration',
		features: [
			{
				title: 'Team Management',
				icon: Users,
				description: 'Create and manage teams with role-based permissions.',
			},
			{
				title: 'Member Invitations',
				icon: UserPlus,
				description: 'Invite team members via email with role assignment.',
			},
			{
				title: 'Bulk Invitations',
				icon: MailPlus,
				description: 'Send multiple invitations at once.',
			},
			{
				title: 'Activity Tracking',
				icon: Activity,
				description: 'Monitor team member activities and permissions.',
			},
		],
	},
	{
		title: 'Organization Management',
		features: [
			{
				title: 'Multi-tenant Organizations',
				icon: Building2,
				description: 'Create and manage multiple organizations.',
			},
			{
				title: 'Organization Settings',
				icon: Settings2,
				description: 'Configure branding, billing, and preferences.',
			},
			{
				title: 'Role-based Access',
				icon: Lock,
				description: 'Fine-grained permission control.',
			},
			{
				title: 'Organization Switching',
				icon: ArrowRightLeft,
				description: 'Easy switching between organizations.',
			},
		],
	},
	{
		title: 'UI Components',
		features: [
			{
				title: '50+ UI Components',
				icon: Component,
				description: 'Complete component library with Shadcn UI.',
			},
			{
				title: 'Dark/Light Theme',
				icon: Palette,
				description: 'Built-in theme switching support.',
			},
			{
				title: 'Responsive Design',
				icon: MonitorSmartphone,
				description: 'Mobile-first responsive layouts.',
			},
		],
	},
];

export default function PowerFeatures() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto w-full max-w-5xl space-y-16 px-4">
				<AnimatedContainer className="mx-auto max-w-3xl text-center">
					<h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
						An Entire Platform at Your Fingertips
					</h2>
					<p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
						Everything you need to build fast, secure, scalable apps.
					</p>
				</AnimatedContainer>

				{featureCategories.map(category => (
					<div key={category.title} className="space-y-8">
						<AnimatedContainer delay={0.2} className="">
							<h3 className="text-2xl font-bold tracking-wide">{category.title}</h3>
						</AnimatedContainer>
						<AnimatedContainer
							delay={0.4}
							className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
						>
							{category.features.map((feature, i) => (
								<FeatureCard key={i} feature={feature} />
							))}
						</AnimatedContainer>
					</div>
				))}
			</div>
		</section>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', y: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
} 