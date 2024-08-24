import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useWatson } from '@/hooks/useWatson';
import ProjectList from './ProjectList';
import MessageSection from './MessageSection';

const Dashboard: React.FC = () => {
  const { 
    isDarkMode, 
    viewMode, 
    isMessagesSectionVisible, 
    toggleDarkMode, 
    toggleViewMode, 
    toggleMessagesSection 
  } = useDashboard();
  const { generateProjectInsights, getCodeSuggestions } = useWatson();

  const handleAddProject = async () => {
    const insight = await generateProjectInsights("User is adding a new project");
    console.log("AI-generated project insight:", insight);
    // Implement project addition logic here
  };

  const handleSearch = async (query: string) => {
    const codeSuggestions = await getCodeSuggestions(query);
    console.log("AI-generated code suggestions:", codeSuggestions);
    // Implement search logic and display code suggestions
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <p className="app-name">AI-Powered Coding Dashboard</p>
          <div className="search-wrapper">
            <input 
              className="search-input" 
              type="text" 
              placeholder="Search"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {/* Add search icon */}
          </div>
        </div>
        <div className="app-header-right">
          <button className="mode-switch" title="Switch Theme" onClick={toggleDarkMode}>
            {/* Add mode switch icon */}
          </button>
          <button className="add-btn" title="Add New Project" onClick={handleAddProject}>
            {/* Add plus icon */}
          </button>
          <button className="notification-btn">
            {/* Add notification icon */}
          </button>
          <button className="profile-btn">
            {/* Add profile image and name */}
          </button>
        </div>
      </header>
      <div className="app-content">
        <div className="app-sidebar">
          {/* Add sidebar items */}
        </div>
        <div className="projects-section">
          <div className="projects-section-header">
            <p>Projects</p>
            <p className="time">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="projects-section-line">
            <div className="projects-status">
              {/* Add project status items */}
            </div>
            <div className="view-actions">
              <button className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`} title="List View" onClick={() => toggleViewMode('list')}>
                {/* Add list icon */}
              </button>
              <button className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`} title="Grid View" onClick={() => toggleViewMode('grid')}>
                {/* Add grid icon */}
              </button>
            </div>
          </div>
          <ProjectList viewMode={viewMode} />
        </div>
        {isMessagesSectionVisible && <MessageSection />}
      </div>
      <button className="messages-btn" onClick={toggleMessagesSection}>
        {/* Add message icon */}
      </button>
    </div>
  );
};

export default Dashboard;