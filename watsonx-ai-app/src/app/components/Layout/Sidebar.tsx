'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  FolderIcon, 
  CheckSquareIcon, 
  MessageSquareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  BarChartIcon,
  SettingsIcon,
  HelpCircleIcon,
  GitMerge,
} from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const pathname = usePathname();  // use usePathname from next/navigation
  const [activeItem, setActiveItem] = useState('');

  const sidebarItems = [
    { icon: HomeIcon, text: 'Dashboard', href: '/dashboard' },
    { icon: FolderIcon, text: 'Projects', href: '/projects' },
    { icon: GitMerge, text: 'Structure', href: '/code-project-structure' },
    { icon: CheckSquareIcon, text: 'Tasks', href: '/tasks' },
    { icon: BarChartIcon, text: 'Analytics', href: '/analytics' },
    { icon: MessageSquareIcon, text: 'AI Assistant', href: '/assistant' },
    { icon: SettingsIcon, text: 'Settings', href: '/settings' },
  ];

  useEffect(() => {
    // Set activeItem based on the current pathname
    const currentItem = sidebarItems.find(item => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.text);
    }
  }, [pathname]);

  return (
    <aside className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 bg-gray-900 text-white ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
            <div className="w-11 h-11 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold mr-3">
              <Image
                src="/granix6.png"
                alt="Granite"
                width={40}
                height={40}
              />
            </div>
            {!isCollapsed && <h1 className="app-name">granix</h1>}
          </Link>
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition-colors duration-200">
            {isCollapsed ? <ChevronRightIcon size={24} /> : <ChevronLeftIcon size={24} />}
          </button>
        </div>

        <nav className="flex-grow mt-6">
          {sidebarItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              className={`flex items-center py-3 px-4 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200
                ${activeItem === item.text ? 'bg-gray-800 text-white' : ''}
                ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`h-6 w-6 ${isCollapsed ? 'mr-0' : 'mr-4'}`} />
              {!isCollapsed && <span>{item.text}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <Link href="/help" className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
            <HelpCircleIcon className={`h-6 w-6 ${isCollapsed ? 'mx-auto' : 'mr-4'}`} />
            {!isCollapsed && <span>Help & Support</span>}
          </Link>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <Image
              src="/profile-picture.jpg"
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-400">john@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
