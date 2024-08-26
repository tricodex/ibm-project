import React from 'react'
import Dashboard from '@/components/Dashboard/Dashboard'
import Sidebar from '../components/Layout/Sidebar'

const DashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  return (
    <div className="w-full min-h-screen">
      <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
      <Dashboard />
    </div>
  )
}

export default DashboardPage