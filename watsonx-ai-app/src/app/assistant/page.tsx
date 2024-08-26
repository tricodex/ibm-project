'use client';
import React from 'react'
import AIAssistant from '@/components/Dashboard/AIAssistant'
import Sidebar from '../components/Layout/Sidebar'
import { WatsonModelId } from '@/constants/watsonModels';

const AIAssistantPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-24l' : 'ml-64'}`}>
        <AIAssistant onGenerateInsights={function (context: string, modelId?: WatsonModelId): Promise<string> {
          throw new Error('Function not implemented.');
        } } />
      </div>
    </div>
  )
}

export default AIAssistantPage