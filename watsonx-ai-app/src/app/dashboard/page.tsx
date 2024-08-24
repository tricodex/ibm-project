'use client'

import { useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useWatson } from '@/hooks/useWatson'
import ProjectList from '@/components/Dashboard/ProjectList'
import MessageSection from '@/components/Dashboard/MessageSection'


export default function DashboardPage() {
  const { 
    isDarkMode, 
    viewMode, 
    isMessagesSectionVisible, 
    toggleDarkMode, 
    toggleViewMode, 
    toggleMessagesSection 
  } = useDashboard()
  const { isLoading, generateProjectInsights } = useWatson()
  const [aiInsight, setAiInsight] = useState('')

  const handleGenerateInsight = async () => {
    const insight = await generateProjectInsights("Analyze current project status")
    setAiInsight(insight)
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <p className="app-name">AI-Powered Coding Dashboard</p>
          <div className="search-wrapper">
            <input className="search-input" type="text" placeholder="Search projects" />
          </div>
        </div>
        <div className="app-header-right">
          <button className="mode-switch" title="Switch Theme" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="add-btn" title="Add New Project">
            +
          </button>
          <button className="profile-btn">
            User Profile
          </button>
        </div>
      </header>
      <div className="app-content">
        <div className="projects-section">
          <div className="projects-section-header">
            <p>Projects</p>
            <p className="time">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="projects-section-line">
            <div className="view-actions">
              <button 
                className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`} 
                title="List View" 
                onClick={() => toggleViewMode('list')}
              >
                List
              </button>
              <button 
                className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`} 
                title="Grid View" 
                onClick={() => toggleViewMode('grid')}
              >
                Grid
              </button>
            </div>
          </div>
          <ProjectList viewMode={viewMode} />
        </div>
        {isMessagesSectionVisible && <MessageSection />}
      </div>
      <div className="ai-insights-section">
        <h2>AI Insights</h2>
        <button onClick={handleGenerateInsight} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Project Insight'}
        </button>
        {aiInsight && <p>{aiInsight}</p>}
      </div>
      <button className="messages-btn" onClick={toggleMessagesSection}>
        {isMessagesSectionVisible ? 'Close Chat' : 'Open AI Chat'}
      </button>
    </div>
  )
}