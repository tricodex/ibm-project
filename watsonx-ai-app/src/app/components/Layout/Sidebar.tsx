import React from 'react'
import Link from 'next/link'
import { HomeIcon, FolderIcon, CheckSquareIcon, MessageSquareIcon } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <aside className={`bg-gray-800 text-white ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <nav className="mt-10">
        <Link href="/dashboard" className="flex items-center py-2 px-4 text-gray-100 hover:bg-gray-700">
          <HomeIcon className="h-5 w-5" />
          {!isCollapsed && <span className="mx-4">Dashboard</span>}
        </Link>
        <Link href="/projects" className="flex items-center mt-5 py-2 px-4 text-gray-100 hover:bg-gray-700">
          <FolderIcon className="h-5 w-5" />
          {!isCollapsed && <span className="mx-4">Projects</span>}
        </Link>
        <Link href="/tasks" className="flex items-center mt-5 py-2 px-4 text-gray-100 hover:bg-gray-700">
          <CheckSquareIcon className="h-5 w-5" />
          {!isCollapsed && <span className="mx-4">Tasks</span>}
        </Link>
        <Link href="/ai-assistant" className="flex items-center mt-5 py-2 px-4 text-gray-100 hover:bg-gray-700">
          <MessageSquareIcon className="h-5 w-5" />
          {!isCollapsed && <span className="mx-4">AI Assistant</span>}
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar