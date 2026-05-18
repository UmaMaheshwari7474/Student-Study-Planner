"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CheckSquare, Calendar as CalendarIcon, BookOpen, Settings, LogOut, TrendingUp, Clock } from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Tasks & Exams", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: CalendarIcon },
  { name: "Study Schedule", href: "/schedule", icon: Clock },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Pomodoro", href: "/pomodoro", icon: Clock }, // Added Pomodoro
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup');
  
  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }
  }, [isAuthPage]);

  if (isAuthPage) return null;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon gradient-bg">SP</div>
        <h2 className="logo-text">StudyPlanner</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/");
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="nav-icon" size={20} />
              <span>{item.name}</span>
              {isActive && <div className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="nav-item" 
          onClick={() => document.body.classList.toggle('dark')}
        >
          <Settings className="nav-icon" size={20} />
          <span>Toggle Theme</span>
        </button>
        <button className="nav-item" onClick={handleLogout}>
          <LogOut className="nav-icon" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
