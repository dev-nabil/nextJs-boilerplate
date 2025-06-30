"use client";

import {
  ChevronDown,
  Layers,
  LayoutGrid,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface NavSection {
  title: string;
  icon: LucideIcon;
  links: Omit<NavItem, "icon" | "exact">[];
}

const mainNavLinks: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
];

const navSections: NavSection[] = [
  {
    title: "Content Management",
    icon: Layers,
    links: [
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/banners", label: "Banner" },
      { href: "/admin/blog", label: "Blog" },
    ],
  },
  {
    title: "User Management",
    icon: User,
    links: [
      { href: "/admin/users?role=buyer", label: "Buyer" },
      { href: "/admin/users?role=seller", label: "Seller" },
      { href: "/admin/admins", label: "Admin" },
    ],
  },
  {
    title: "Payment Management",
    icon: Wallet,
    links: [
      { href: "/admin/bill", label: "Payment (Bill)" },
      { href: "/admin/subscription", label: "Subscription" },
      { href: "/admin/boost-profile", label: "Boost Profile" },
      { href: "/admin/boost-project", label: "Boost Project" },
      { href: "/admin/bid-points", label: "Bid Points" },
      { href: "/admin/commissions", label: "Commissions" },
      { href: "/admin/withdraw-proposal", label: "Payout" },
    ],
  },
  {
    title: "Help & Support",
    icon: LayoutGrid,
    links: [
      { href: "/admin/disputes", label: "Dispute" },
      { href: "/admin/contacts", label: "Contact" },
      { href: "/admin/faq", label: "FAQ" },
    ],
  },
];

const settingsNavLink: NavItem = {
  href: "/admin/settings",
  label: "General Settings",
  icon: LayoutGrid,
};

export default function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state: sidebarState } = useSidebar();
  const defaultOpenSections = navSections.map((section) => section.title);
  const [openCollapsibles, setOpenCollapsibles] =
    React.useState<string[]>(defaultOpenSections);

  const toggleCollapsible = (title: string) => {
    setOpenCollapsibles((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const commonButtonClasses =
    "justify-start text-sm font-medium rounded-lg px-3 py-2.5 w-full";
  const activeClasses =
    "bg-brand-active-bg text-brand-active-text hover:bg-opacity-90";
  const inactiveClasses =
    "text-brand-text hover:bg-brand-hover-bg hover:text-brand-text";

  // Helper function to check if a link is active
  const isLinkActive = (href: string) => {
    const [path, query] = href.split("?");
    const isPathMatch = pathname.startsWith(path);

    if (!isPathMatch) return false;

    if (!query) return true;

    const currentRole = searchParams.get("role");
    const linkRole = new URLSearchParams(query).get("role");

    return currentRole === linkRole;
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="m-3 w-64 rounded-2xl border-none bg-[#F7F7F7]"
    >
      <SidebarHeader className="flex h-16 items-center justify-center px-4 lg:px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#96dda5] to-[#02958a] bg-clip-text text-2xl font-bold text-transparent">
            Yaha Chha
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu className="space-y-1 pr-2 pl-0">
          {mainNavLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    commonButtonClasses,
                    isActive ? activeClasses : inactiveClasses,
                    "flex items-center gap-3"
                  )}
                >
                  <Link href={link.href}>
                    <link.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-brand-active-text" : "text-brand-icon"
                      )}
                    />
                    {sidebarState === "expanded" && <span>{link.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {navSections.map((section) => {
            const isSectionActive = section.links.some((link) =>
              isLinkActive(link.href)
            );
            const isOpen = openCollapsibles.includes(section.title);
            return (
              <Collapsible
                key={section.title}
                open={isOpen}
                onOpenChange={() => toggleCollapsible(section.title)}
              >
                <SidebarMenuItem className="space-y-0.5">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        commonButtonClasses,
                        "flex w-full items-center gap-3",
                        isSectionActive && !isOpen
                          ? activeClasses
                          : inactiveClasses
                      )}
                    >
                      <section.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isSectionActive && !isOpen
                            ? "text-brand-active-text"
                            : "text-brand-icon"
                        )}
                      />
                      {sidebarState === "expanded" && (
                        <span className="flex-1 text-left">
                          {section.title}
                        </span>
                      )}
                      {sidebarState === "expanded" && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {sidebarState === "expanded" && (
                      <SidebarMenuSub className="border-l-slate-300 pl-5">
                        {section.links.map((link) => {
                          const isActive = isLinkActive(link.href);
                          return (
                            <SidebarMenuSubItem key={link.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive}
                                className={cn(
                                  "w-full justify-start rounded-md px-3 py-2 text-sm",
                                  isActive
                                    ? "font-semibold !text-white"
                                    : "text-brand-text hover:bg-brand-hover-bg"
                                )}
                              >
                                <Link href={link.href}>{link.label}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(settingsNavLink.href)}
              className={cn(
                commonButtonClasses,
                pathname.startsWith(settingsNavLink.href)
                  ? activeClasses
                  : inactiveClasses,
                "flex items-center gap-3"
              )}
            >
              <Link href={settingsNavLink.href}>
                <settingsNavLink.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    pathname.startsWith(settingsNavLink.href)
                      ? "text-brand-active-text"
                      : "text-brand-icon"
                  )}
                />
                {sidebarState === "expanded" && (
                  <span>{settingsNavLink.label}</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
