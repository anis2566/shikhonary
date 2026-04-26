"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  CalendarDays,
  Calendar,
  BarChart3,
  Bell,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ClipboardList,
  TrendingUp,
  BookOpen,
  FileSpreadsheet,
  FileEdit,
  Shield,
  Briefcase,
  DollarSign,
  CreditCard,
  SendHorizonal,
  BookCopy,
  Bus,
  Activity,
  Lock,
  Hash,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { cn } from "@workspace/ui/lib/utils";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Main",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "People",
    items: [
      { title: "Students", url: "/students", icon: GraduationCap },
      { title: "Teachers", url: "/teachers", icon: UserCheck },
      { title: "Guardians", url: "/guardians", icon: Shield },
      { title: "Staff", url: "/staff", icon: Briefcase },
      { title: "Batches", url: "/batches", icon: Users },
    ],
  },
  {
    label: "Academics",
    items: [
      { title: "Academic Years", url: "/academic-years", icon: Calendar },
      { title: "Timetable", url: "/timetable", icon: CalendarDays },
    ],
  },
  {
    label: "Utils",
    items: [{ title: "Counters", url: "/counters", icon: Hash }],
  },
  {
    label: "Fees",
    items: [
      { title: "Admission Fee", url: "/admission-fees", icon: DollarSign },
      { title: "Monthly Fee", url: "/monthly-fees", icon: DollarSign },
    ],
  },
  {
    label: "Examinations",
    items: [
      { title: "All Exams", url: "/exams", icon: ClipboardList },
      { title: "Create Exam", url: "/exams/new", icon: FileText },
      { title: "Question Bank", url: "/question-bank", icon: BookOpen },
      {
        title: "Paper Builder",
        url: "/question-paper-builder",
        icon: FileEdit,
      },
      { title: "Results", url: "/results", icon: TrendingUp },
      { title: "Report Cards", url: "/report-cards", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Attendance",
    items: [
      { title: "Student Attendance", url: "/attendance", icon: CalendarDays },
      {
        title: "Teacher Attendance",
        url: "/teacher-attendance",
        icon: UserCheck,
      },
      {
        title: "Mark Attendance",
        url: "/mark-attendance",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Fees & Payments",
    items: [
      { title: "Fee Structure", url: "/fee-structure", icon: DollarSign },
      { title: "Payments", url: "/payments", icon: CreditCard },
      { title: "Reminders", url: "/fee-reminders", icon: SendHorizonal },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Overview", url: "/analytics", icon: BarChart3 },
      { title: "Reports", url: "/reports", icon: FileSpreadsheet },
      { title: "Calendar", url: "/calendar", icon: Calendar },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Communications", url: "/communications", icon: Megaphone },
      { title: "Announcements", url: "/announcements", icon: Bell },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Library", url: "/library", icon: BookCopy },
      { title: "Transport", url: "/transport", icon: Bus },
      { title: "Audit Log", url: "/audit-log", icon: Activity },
      { title: "Roles", url: "/roles", icon: Lock },
    ],
  },
  {
    label: "Settings",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
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
  const user = { email: "admin@tenant.com" }; // Placeholder logic, should be replaced with actual auth session data if available

  const handleLogout = async () => {
    // In a real app, you might want to call an API to sign out
    router.push("/auth");
  };

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/" || pathname === "/admin";
    }
    return pathname.startsWith(url);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-glow">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground">
                Shikhonary
              </span>
              <span className="text-xs text-muted-foreground -mt-0.5">
                Tenant Portal
              </span>
            </div>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const linkContent = (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        collapsed && "justify-center",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.title}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                TA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Tenant Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
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
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-card border border-border shadow-sm z-40"
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </Button>
      )}
    </aside>
  );
};
