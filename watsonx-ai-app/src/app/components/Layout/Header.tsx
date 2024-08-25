import React, { useState } from 'react'
import { MoonIcon, SunIcon, MenuIcon, SearchIcon } from 'lucide-react'
import Button from '@/components/ui/Button'

interface HeaderProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
  toggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden" title="Toggle Sidebar">
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-700 dark:text-white ml-4">AI-Powered Coding Dashboard</h1>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>
          </div>
          <div className="flex items-center">
            <Button
              onClick={toggleDarkMode}
              className="text-gray-500 focus:outline-none"
              variant="outline"
              size="sm"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            <img
              className="h-8 w-8 rounded-full ml-4"
              src="https://via.placeholder.com/150"
              alt="User Profile"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header