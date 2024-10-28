"use client";

import { usePathname } from "next/navigation";
import {
  Dashboard as DashboardIcon,
  MenuBook as ReadingIcon,
  Headset as ListeningIcon,
  Create as WritingIcon,
  Mic as SpeakingIcon,
  TrendingUp as ProgressIcon,
  AccountCircle as AccountIcon,
  ExpandMore as ExpandIcon,
} from "@mui/icons-material";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  activeBackground: string;
  colorClass: string;
};

const navItems: NavItem[] = [
  {
    name: "Listening",
    icon: <ListeningIcon />,
    path: "/listening",
    activeBackground: "bg-indigo-200",
    colorClass: "text-indigo-600",
  },
  {
    name: "Reading",
    icon: <ReadingIcon />,
    path: "/reading",
    activeBackground: "bg-green-200",
    colorClass: "text-green-600",
  },
  {
    name: "Writing",
    icon: <WritingIcon />,
    path: "/writing",
    activeBackground: "bg-yellow-200",
    colorClass: "text-yellow-600",
  },
  {
    name: "Speaking",
    icon: <SpeakingIcon />,
    path: "/speaking",
    activeBackground: "bg-pink-200",
    colorClass: "text-pink-600",
  },
  {
    name: "Progress",
    icon: <ProgressIcon />,
    path: "/progress",
    activeBackground: "bg-blue-200",
    colorClass: "text-blue-600",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  // Placeholder user information for display
  const userName = "IELTS Student";
  const userEmail = "student@example.com";

  return (
    <div className="fixed top-0 left-0 w-64 bg-gray-50 p-6 flex flex-col justify-between h-screen text-gray-800">
      <div>
        <div className="flex items-center space-x-3 mb-12">
          <DashboardIcon fontSize="large" className="text-blue-600" />
          <h1 className="text-2xl font-semibold">IELTS Prep</h1>
        </div>
        
        <nav className="space-y-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 p-3 text-lg rounded-lg transition ${
                pathname === item.path ? `${item.activeBackground} ${item.colorClass}` : "text-gray-500"
              } hover:${item.colorClass} hover:bg-gray-200`}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4 mt-auto bg-gray-200 p-3 rounded-lg">
        <AccountIcon fontSize="large" className="text-gray-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-gray-500">{userEmail}</span>
        </div>
        <ExpandIcon className="ml-auto text-gray-600" />
      </div>
    </div>
  );
};

export default Sidebar;
