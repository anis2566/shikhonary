"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu,
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  ListTree,
  Layers,
  CreditCard,
  Sparkles,
  PlusCircle,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";

import { cn } from "@workspace/ui/lib/utils";

import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Sessions", url: "/sessions", icon: Shield },
];

const tenantsGroup: NavGroup = {
  title: "Tenants",
  icon: Building2,
  items: [
    { title: "Add Tenant", url: "/tenants/new", icon: PlusCircle },
    { title: "Organizations", url: "/tenants", icon: Building2 },
  ],
};

const billingGroup: NavGroup = {
  title: "Billing & Plans",
  icon: CreditCard,
  items: [
    { title: "Subscriptions", url: "/subscriptions", icon: Sparkles },
    {
      title: "Pricing Plans",
      url: "/subscription-plans",
      icon: Layers,
    },
  ],
};

const academicGroup: NavGroup = {
  title: "Academic",
  icon: BookOpen,
  items: [
    { title: "Hierarchy View", url: "/academic-tree", icon: ListTree },
    { title: "Classes", url: "/classes", icon: GraduationCap },
    { title: "Subjects", url: "/subjects", icon: BookOpen },
    { title: "Chapters", url: "/chapters", icon: FileText },
    { title: "Topics", url: "/topics", icon: ListTree },
    { title: "Sub-Topics", url: "/sub-topics", icon: Layers },
  ],
};

const questionBankGroup: NavGroup = {
  title: "Question Bank",
  icon: HelpCircle,
  items: [
    { title: "MCQs", url: "/mcqs", icon: HelpCircle },
    { title: "CQs", url: "/cqs", icon: FileText },
    { title: "Question Types", url: "/question-types", icon: Layers },
    { title: "Paper Builder", url: "/question-papers", icon: Sparkles },
  ],
};

const digitalLibraryGroup: NavGroup = {
  title: "Digital Library",
  icon: BookOpen,
  items: [
    { title: "Books", url: "/books", icon: BookOpen },
    { title: "Upload PDF", url: "/books/new", icon: PlusCircle },
  ],
};

const bottomItems: NavItem[] = [
  { title: "Settings", url: "/settings", icon: Settings },
];

interface SidebarContentProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed,
  onToggle,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = { email: "user@example.com" }; // Placeholder

  const [tenantsOpen, setTenantsOpen] = useState(true);
  const [billingOpen, setBillingOpen] = useState(true);
  const [academicOpen, setAcademicOpen] = useState(true);
  const [questionBankOpen, setQuestionBankOpen] = useState(true);
  const [digitalLibraryOpen, setDigitalLibraryOpen] = useState(true);

  const handleLogout = async () => {
    router.push("/auth");
  };

  // Collect all sidebar URLs to determine the best match for highlighting
  const allSidebarUrls = [
    ...navItems.map((i) => i.url),
    ...tenantsGroup.items.map((i) => i.url),
    ...billingGroup.items.map((i) => i.url),
    ...academicGroup.items.map((i) => i.url),
    ...questionBankGroup.items.map((i) => i.url),
    ...digitalLibraryGroup.items.map((i) => i.url),
    ...bottomItems.map((i) => i.url),
  ];

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/" || pathname === "/admin";
    }

    // Exact match is always active
    if (pathname === url) return true;

    // Check if current path is a sub-path of this item
    const isSubPath = pathname.startsWith(`${url}/`);
    if (!isSubPath) return false;

    // To avoid "Organizations" highlighting when "Add Tenant" (/tenants/new) is selected,
    // we only mark the parent as active if no other sidebar item provides a more specific match.
    const hasMoreSpecificMatch = allSidebarUrls.some(
      (otherUrl) =>
        otherUrl !== url &&
        pathname.startsWith(otherUrl) &&
        otherUrl.length > url.length,
    );

    return !hasMoreSpecificMatch;
  };

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isActive(item.url));

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.title}
      href={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
        isActive(item.url)
          ? "bg-primary text-primary-foreground shadow-glow"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}
    >
      <item.icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-transform duration-200",
          isActive(item.url) ? "scale-110" : "group-hover:scale-110",
        )}
      />
      {!collapsed && <span>{item.title}</span>}
      {isActive(item.url) && !collapsed && (
        <div className="absolute right-2 w-1 h-4 rounded-full bg-primary-foreground/30 animate-pulse" />
      )}
    </Link>
  );

  const renderNavGroup = (
    group: NavGroup,
    open: boolean,
    setOpen: (val: boolean) => void,
  ) => {
    const groupActive = isGroupActive(group);

    if (collapsed) {
      return <div className="space-y-1">{group.items.map(renderNavItem)}</div>;
    }

    return (
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <CollapsibleTrigger
          className={cn(
            "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            groupActive
              ? "text-foreground bg-muted/40"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <div className="flex items-center gap-3">
            <group.icon
              className={cn(
                "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                groupActive ? "scale-110" : "group-hover:scale-110",
              )}
            />
            <span>{group.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200 opacity-50",
              open && "rotate-180 opacity-100",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6 mt-1 space-y-1 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-border/40">
          {group.items.map(renderNavItem)}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md border-r border-border/50">
      {/* ── Sticky Sidebar Header (Logo + Collapse Button) ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-border/40 bg-card/60 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground leading-none">
                Shikhonary
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Admin Portal
              </span>
            </div>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex hover:bg-muted/50 text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* ── Scrollable Navigation ── */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "Main Menu" : "•••"}
          </div>
          <div className="space-y-1">{navItems.map(renderNavItem)}</div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "Tenants" : "•••"}
          </div>
          <div className="space-y-1">
            {renderNavGroup(tenantsGroup, tenantsOpen, setTenantsOpen)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "Education" : "•••"}
          </div>
          <div className="space-y-1">
            {renderNavGroup(academicGroup, academicOpen, setAcademicOpen)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "Resources" : "•••"}
          </div>
          <div className="space-y-1">
            {renderNavGroup(
              questionBankGroup,
              questionBankOpen,
              setQuestionBankOpen,
            )}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "Digital Library" : "•••"}
          </div>
          <div className="space-y-1">
            {renderNavGroup(
              digitalLibraryGroup,
              digitalLibraryOpen,
              setDigitalLibraryOpen,
            )}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "Billing" : "•••"}
          </div>
          <div className="space-y-1">
            {renderNavGroup(billingGroup, billingOpen, setBillingOpen)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {!collapsed ? "System" : "•••"}
          </div>
          <div className="space-y-1">{bottomItems.map(renderNavItem)}</div>
        </div>
      </nav>

      {/* ── Sticky Sidebar Footer (User + Logout) ── */}
      <div className="flex-shrink-0 p-4 border-t border-border/50 bg-card/60 backdrop-blur-md">
        {!collapsed && user && (
          <div className="mb-4 px-3 py-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                AA
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  Anichur Anis
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onToggle,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-card border border-border shadow-sm z-10"
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </Button>
      )}
    </aside>
  );
};
