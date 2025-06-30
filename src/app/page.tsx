import { ThemeToggle } from "@/components/theme-toggle";
import {
  AnimatedLayout,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cacheUtils, serverFetch } from "@/lib/server-fetch";
import {
  ArrowRight,
  Code2,
  Database,
  ExternalLink,
  Github,
  Palette,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import Link from "next/link";

/**
 * Fetch home page data with caching
 * Demonstrates server-side data fetching with cache management
 */
async function getHomeData() {
  const cacheConfig = cacheUtils.getCacheConfig("static");

  try {
    const response = await serverFetch("/api/home", {
      ...cacheConfig,
      tags: ["home", "static"],
    });

    return (
      response.data || {
        stats: {
          components: 50,
          examples: 25,
          features: 15,
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    return {
      stats: {
        components: 50,
        examples: 25,
        features: 15,
      },
    };
  }
}

/**
 * Home Page Component
 * The main landing page showcasing the boilerplate features
 *
 * Features:
 * - Server-side data fetching
 * - Animated layout with stagger effects
 * - Feature showcase cards
 * - Demo navigation links
 * - Responsive design
 *
 * @example
 * This page is automatically rendered at the root route "/"
 */
export default async function HomePage() {
  const data = await getHomeData();

  const features = [
    {
      icon: Code2,
      title: "TypeScript First",
      description:
        "Built with TypeScript for better developer experience and type safety",
      details:
        "Comprehensive type definitions and strict TypeScript configuration",
      color: "bg-blue-500",
    },
    {
      icon: Database,
      title: "RTK Query",
      description:
        "Powerful data fetching and caching with Redux Toolkit Query",
      details: "Automatic caching, background updates, and optimistic updates",
      color: "bg-purple-500",
    },
    {
      icon: Palette,
      title: "Shadcn UI",
      description: "Beautiful and accessible UI components built with Radix UI",
      details: "Customizable, accessible, and production-ready components",
      color: "bg-green-500",
    },
    {
      icon: Zap,
      title: "Framer Motion",
      description:
        "Smooth animations and transitions throughout the application",
      details: "Page transitions, micro-interactions, and gesture support",
      color: "bg-yellow-500",
    },
    {
      icon: Shield,
      title: "Authentication",
      description: "Cookie-based authentication with Google OAuth integration",
      details: "Secure JWT tokens, role-based access, and session management",
      color: "bg-red-500",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Mobile-first design that works on all devices",
      details: "Tailwind CSS with responsive utilities and mobile optimization",
      color: "bg-indigo-500",
    },
  ];

  const demoLinks = [
    {
      title: "RTK Query Demo",
      description: "Learn how to use Redux Toolkit Query for data fetching",
      href: "/demo/rtk-query",
      badge: "API",
    },
    {
      title: "Data Table Demo",
      description: "Explore the enhanced data table with sorting and filtering",
      href: "/demo/data-table",
      badge: "Components",
    },
    {
      title: "Server Fetch Demo",
      description: "See server-side data fetching with cache management",
      href: "/demo/server-fetch",
      badge: "SSR",
    },
    {
      title: "Authentication Demo",
      description: "Try the authentication system with Google OAuth",
      href: "/auth/login",
      badge: "Auth",
    },
  ];

  return (
    <AnimatedLayout className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <StaggerContainer>
          <StaggerItem>
            <Badge variant="secondary" className="mb-4">
              v1.0.0 - Production Ready
            </Badge>
          </StaggerItem>

          <StaggerItem>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Next.js Comprehensive
              <span className="text-primary block">Boilerplate</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A production-ready boilerplate with comprehensive demo examples,
              built for developers who want to learn modern web development with
              Next.js, TypeScript, and the latest tools.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="/demo/rtk-query">
                  Explore Demos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://github.com/yourusername/nextjs-boilerplate"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {data.stats.components}+
                </div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {data.stats.examples}+
                </div>
                <div className="text-sm text-muted-foreground">Examples</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {data.stats.features}+
                </div>
                <div className="text-sm text-muted-foreground">Features</div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with modern tools and best practices for scalable web
            applications
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <StaggerItem key={feature.title}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Demo Links Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Demos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore comprehensive examples and learn how to use each feature
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {demoLinks.map((demo, index) => (
            <StaggerItem key={demo.title}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{demo.title}</CardTitle>
                    <Badge variant="outline">{demo.badge}</Badge>
                  </div>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={demo.href}>
                      Try Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <StaggerContainer>
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Clone the repository and start building your next project with
              this comprehensive boilerplate.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">View All Demos</Link>
              </Button>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>
    </AnimatedLayout>
  );
}
