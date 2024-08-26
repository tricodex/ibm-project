'use client';
import React from 'react'
import AIInsights from '@/components/Dashboard/AIInsights'
import Sidebar from '../components/Layout/Sidebar'

const AIInsightsPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AIInsights insight={''} onRefresh={function (): void {
                  throw new Error('Function not implemented.');
              } } isLoading={false} />
      </div>
    </div>
  )
}

export default AIInsightsPage