"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Flame, 
  LayoutDashboard, 
  Building2, 
  ShieldAlert, 
  LifeBuoy, 
  AlertTriangle, 
  Ambulance, 
  LogOut, 
  Pin, 
  PinOff,
  Menu,
  X,
  Users,
  Truck
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

interface Props {
  profile: {
    id?: string;
    first_name: string;
    last_name: string;
    role: string;
  } | null;
  isAdmin: boolean;
  pendingCount?: number;
  userStationId?: string | null;
  userStationName?: string | null;
}

export default function DashboardSidebar({ 
  profile, 
  isAdmin, 
  pendingCount = 0,
  userStationId = null,
  userStationName = null
}: Props) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isExpanded = isHovered || isPinned;

  // Build navigation items dynamically based on role (Regional Admin vs Station User)
  const navItems = [];

  if (isAdmin) {
    // REGIONAL ADMIN NAVIGATION
    navItems.push(
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        active: pathname === "/dashboard",
        desc: "Regional overview",
      },
      {
        name: "All Stations",
        href: "/stations",
        icon: Building2,
        active: pathname.startsWith("/stations"),
        desc: "Regional directory",
      },
      {
        name: "BFP Operations",
        href: "/bfp",
        icon: Flame,
        active: pathname.startsWith("/bfp"),
        desc: "RTR, Fire & EMS",
        subItems: [
          { name: "RTR Rescue", href: "/bfp/rtr", icon: LifeBuoy, active: pathname.startsWith("/bfp/rtr") },
          { name: "Fire Incidents", href: "/bfp/fire-incidents", icon: AlertTriangle, active: pathname.startsWith("/bfp/fire-incidents") },
          { name: "EMS Services", href: "/bfp/ems", icon: Ambulance, active: pathname.startsWith("/bfp/ems") },
        ],
      },
      {
        name: "Approvals",
        href: "/admin/registrations",
        icon: ShieldAlert,
        active: pathname.startsWith("/admin/registrations"),
        desc: "Verify new personnel",
        badge: pendingCount > 0 ? pendingCount : undefined,
      }
    );
  } else {
    // STATION USER NAVIGATION (only sees their own station and operations)
    navItems.push(
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        active: pathname === "/dashboard",
        desc: "Station Status",
      },
      {
        name: userStationName ? userStationName : "My Station",
        href: userStationId ? `/stations/${userStationId}` : "/stations",
        icon: Building2,
        active: pathname === "/stations" || (!!userStationId && pathname === `/stations/${userStationId}`),
        desc: userStationName ? "Active Command Unit" : "Register / View Station",
      }
    );

    if (userStationId) {
      navItems.push(
        {
          name: "Personnel",
          href: `/stations/${userStationId}/personnel`,
          icon: Users,
          active: pathname.includes(`/stations/${userStationId}/personnel`),
          desc: "On/Off Duty Roster",
        },
        {
          name: "Equipment & PPEs",
          href: `/stations/${userStationId}/equipment`,
          icon: Truck,
          active: pathname.includes(`/stations/${userStationId}/equipment`),
          desc: "Firetrucks & Gear",
        },
        {
          name: "BFP Operations",
          href: "/bfp",
          icon: Flame,
          active: pathname.startsWith("/bfp"),
          desc: "My Operational Logs",
          subItems: [
            { name: "My RTR Rescue", href: `/bfp/rtr/${userStationId}`, icon: LifeBuoy, active: pathname.includes(`/bfp/rtr/${userStationId}`) },
            { name: "My Fire Incidents", href: `/bfp/fire-incidents/${userStationId}`, icon: AlertTriangle, active: pathname.includes(`/bfp/fire-incidents/${userStationId}`) },
            { name: "My EMS Records", href: `/bfp/ems/${userStationId}`, icon: Ambulance, active: pathname.includes(`/bfp/ems/${userStationId}`) },
          ],
        }
      );
    }
  }

  return (
    <>
      {/* Mobile Menu Trigger Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white red-glow">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-sm text-black">BFP SURIGAO</span>
            <span className="text-[10px] text-zinc-500 block leading-none font-semibold">
              {isAdmin ? "Regional Command" : "Station Portal"}
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Automatic Expand Sidebar for Desktop & Drawer for Mobile */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-zinc-200 shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isPinned ? "w-64" : isExpanded ? "w-64 shadow-2xl" : "w-[72px]"
        } ${
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top: Logo & Brand */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-100">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 red-glow group-hover:scale-105 transition-transform shadow-md">
                <Flame className="w-6 h-6" />
              </div>

              <div
                className={`transition-opacity duration-300 whitespace-nowrap ${
                  isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-wider text-black">BFP SURIGAO</span>
                  <span className="bg-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded text-white tracking-widest uppercase">
                    {isAdmin ? "ADMIN" : "STATION"}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-semibold block">
                  {isAdmin ? "Regional Command" : userStationName || "Station Command"}
                </span>
              </div>
            </Link>

            {/* Pin Toggle Button */}
            {isExpanded && (
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? "Unpin sidebar (auto-collapse)" : "Pin sidebar open"}
                className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                {isPinned ? <PinOff className="w-4 h-4 text-red-600" /> : <Pin className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item: any) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="space-y-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs font-bold transition-all group ${
                      item.active
                        ? "bg-red-50 text-red-600 border border-red-200/80 shadow-sm"
                        : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {item.active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-red-600 rounded-r" />
                    )}

                    <div
                      className={`w-5 h-5 flex items-center justify-center shrink-0 ${
                        item.active ? "text-red-600" : "text-zinc-500 group-hover:text-black"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Text Label & Subtext */}
                    <div
                      className={`flex-1 transition-opacity duration-300 overflow-hidden whitespace-nowrap ${
                        isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black truncate max-w-[130px]">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 block font-normal truncate">
                        {item.desc}
                      </span>
                    </div>
                  </Link>

                  {/* Sub-items (RTR, Fire Incident, EMS) */}
                  {item.subItems && isExpanded && (
                    <div className="pl-9 pr-2 space-y-1 py-1">
                      {item.subItems.map((sub: any) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              sub.active
                                ? "bg-red-100/70 text-red-700 font-bold"
                                : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                            }`}
                          >
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile & Logout */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
          {profile && (
            <div className="flex items-center gap-3 p-2 rounded-xl mb-2">
              <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-xs font-black text-red-600 shrink-0">
                {profile.first_name[0]}{profile.last_name[0]}
              </div>

              <div
                className={`flex-1 transition-opacity duration-300 overflow-hidden whitespace-nowrap ${
                  isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-bold text-black block truncate leading-tight">
                  {profile.first_name} {profile.last_name}
                </span>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                  {isAdmin ? "Regional Admin" : "Station Officer"}
                </span>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-600 shrink-0" />
              <span
                className={`transition-opacity duration-300 whitespace-nowrap ${
                  isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                Sign Out
              </span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
