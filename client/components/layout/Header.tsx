import React from 'react';
import { cn } from '@/lib/utils';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
}

export function Header({ onToggleSidebar, isCollapsed }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-9 w-9 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers, orders, services..."
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <Button size="sm" className="hidden md:flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Order #1234</p>
                    <p className="text-xs text-muted-foreground">Customer John Doe - Car Service</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-lg">
                  <div className="h-2 w-2 bg-warning rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Service Delayed</p>
                    <p className="text-xs text-muted-foreground">Order #1230 - Tire Replacement</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-lg">
                  <div className="h-2 w-2 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Service Completed</p>
                    <p className="text-xs text-muted-foreground">Order #1225 - Oil Change</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
