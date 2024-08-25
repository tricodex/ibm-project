import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useWatson } from '@/hooks/useWatson';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import ProjectList from './ProjectList';
import TaskBoard from './TaskBoard';
import ProjectTimeline from './ProjectTimeline';
import AICodeAssistant from './AICodeAssistant';
import ProjectAnalyzer from './ProjectAnalyzer';
import CodeOptimizer from './CodeOptimizer';
import CodeReviewAssistant from './CodeReviewAssistant';
import ProjectHealthMonitor from './ProjectHealthMonitor';
import CollaborativeIdeaGenerator from './CollaborativeIdeaGenerator';
import CodeExplainer from './CodeExplainer';
import Chat from '@/components/Chat';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import Dropdown from '@/components/ui/Dropdown';
import Tabs from '@/components/ui/Tabs';
import ProgressBar from '@/components/ui/ProgressBar';
import Calendar from '@/components/ui/Calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { FiList, FiGrid, FiPlus, FiRefreshCw } from 'react-icons/fi';

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const { isDarkMode, viewMode, toggleDarkMode, toggleViewMode } = useDashboard();
  const { generateProjectInsights, getCodeSuggestions } = useWatson();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    // Simulating fetching projects from an API
    const mockProjects: Project[] = [
      { id: 1, name: 'Project A', status: 'In Progress', progress: 75, dueDate: '2023-12-31', description: 'A cutting-edge web application.' },
      { id: 2, name: 'Project B', status: 'Completed', progress: 100, dueDate: '2023-11-15', description: 'An innovative mobile app.' },
      { id: 3, name: 'Project C', status: 'Not Started', progress: 0, dueDate: '2024-01-31', description: 'A machine learning model for predictions.' },
      { id: 4, name: 'Project D', status: 'In Progress', progress: 40, dueDate: '2023-12-15', description: 'An e-commerce platform overhaul.' },
      { id: 5, name: 'Project E', status: 'On Hold', progress: 60, dueDate: '2024-02-28', description: 'A blockchain-based solution.' },
    ];
    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
  }, []);

  const handleAddProject = async () => {
    try {
      const insight = await generateProjectInsights("User is adding a new project");
      setAiSuggestion(insight);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating project insight:", error);
      setToastMessage('Failed to generate project insight');
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const codeSuggestions = await getCodeSuggestions(query);
      setAiSuggestion(codeSuggestions);
      setToastMessage('Code suggestions generated!');
    } catch (error) {
      console.error("Error generating code suggestions:", error);
      setToastMessage('Failed to generate code suggestions');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.status === status));
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project: Project) => {
    // Implement edit project logic
    console.log('Editing project:', project);
  };

  const handleDeleteProject = (projectId: number) => {
    // Implement delete project logic
    console.log('Deleting project:', projectId);
  };

  const refreshDashboard = () => {
    // Implement refresh logic here
    setToastMessage('Dashboard refreshed!');
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
              <Button onClick={refreshDashboard} className="flex items-center">
                <FiRefreshCw className="mr-2" /> Refresh
              </Button>
            </div>
            
            <Tabs
              tabs={[
                { id: 'projects', label: 'Projects' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'codeTools', label: 'Code Tools' },
                { id: 'aiAssistants', label: 'AI Assistants' },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'projects' && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <Card title="Projects">
                        <div className="flex justify-between items-center mb-4">
                          <Dropdown
                            options={['All', 'In Progress', 'Completed', 'Not Started', 'On Hold']}
                            onSelect={handleStatusFilter}
                            placeholder="Filter by status"
                          />
                          <div className="flex space-x-2">
                            <Button
                              variant={viewMode === 'list' ? 'primary' : 'secondary'}
                              onClick={() => toggleViewMode('list')}
                              size="sm"
                            >
                              <FiList size={18} />
                            </Button>
                            <Button
                              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                              onClick={() => toggleViewMode('grid')}
                              size="sm"
                            >
                              <FiGrid size={18} />
                            </Button>
                          </div>
                        </div>
                        <ProjectList 
                          projects={filteredProjects} 
                          viewMode={viewMode} 
                          onEditProject={handleEditProject}
                          onDeleteProject={handleDeleteProject}
                          onSelectProject={handleProjectSelect}
                        />
                      </Card>
                      <ProjectHealthMonitor />
                    </div>
                    <ProjectTimeline projects={projects} />
                    {selectedProject && <ProjectAnalyzer project={selectedProject} />}
                  </>
                )}

                {activeTab === 'tasks' && (
                  <Card title="Task Management">
                    <TaskBoard />
                  </Card>
                )}

                {activeTab === 'codeTools' && (
                  <>
                    <CodeReviewAssistant />
                    <CodeOptimizer />
                    <CodeExplainer />
                  </>
                )}

                {activeTab === 'aiAssistants' && (
                  <>
                    <AICodeAssistant />
                    <CollaborativeIdeaGenerator />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <Card title="Calendar" className="mt-6">
              <Calendar onSelectDate={setSelectedDate} />
              {selectedDate && (
                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Selected date: {selectedDate.toLocaleDateString()}
                </p>
              )}
            </Card>
          </div>
        </main>
      </div>
      <Chat isVisible={true} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project"
      >
        <form className="space-y-4">
          <Input label="Project Name" placeholder="Enter project name" />
          <Input label="Description" placeholder="Enter project description" />
          <Input label="Due Date" type="date" />
          <Button onClick={() => setIsModalOpen(false)} fullWidth>Add Project</Button>
        </form>
      </Modal>
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Toast
              message={toastMessage}
              type="success"
              onClose={() => setToastMessage('')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;