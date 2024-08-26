// src/app/components/Dashboard/Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';
import { useWatson } from '@/hooks/useWatson';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import ProjectList from './ProjectList';
import { Project } from '@/types/project';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ToastProvider, ToastViewport } from '@/app/components/ui/toast';
import DataTable from '@/app/components/ui/datatable';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Calendar from '@/app/components/ui/calendar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  FiList,
  FiGrid,
  FiPlus,
  FiRefreshCw,
  FiAlertTriangle,
  FiAward,
} from 'react-icons/fi';
import AIAssistant from './AIAssistant';
import SearchBar from './SearchBar';
import MessageSection from './MessageSection';
import CollaborativeIdeaGenerator from './CollaborativeIdeaGenerator';
import ProjectTimeline from './ProjectTimeline';
import AIInsights from './AIInsights';
import TaskBoard from './TaskBoard';
import CodeReviewAssistant from './CodeReviewAssistant';
import styles from './Dashboard.module.css';

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
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate fetching projects from an API
  useEffect(() => {
    const mockProjects: Project[] = [
      { id: 1, name: 'Project Alpha', description: 'Lorem ipsum dolor sit amet', created_at: '2022-01-01', updated_at: '2022-01-02', owner: 'John Doe', members: ['Jane Doe', 'Bob Smith'], status: 'In Progress', progress: 75, dueDate: '2024-09-30' },
      { id: 2, name: 'Project Beta', description: 'Lorem ipsum dolor sit amet', created_at: '2022-01-03', updated_at: '2022-01-04', owner: 'Jane Doe', members: ['John Doe', 'Bob Smith'], status: 'Not Started', progress: 0, dueDate: '2024-10-15' },
      { id: 3, name: 'Project Gamma', description: 'Lorem ipsum dolor sit amet', created_at: '2022-01-05', updated_at: '2022-01-06', owner: 'Bob Smith', members: ['John Doe', 'Jane Doe'], status: 'Completed', progress: 100, dueDate: '2024-08-31' },
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

  const handleProjectPrioritization = async () => {
    const projectNames = projects.map(p => p.name).join(', ');
    const prompt = `Given these projects: ${projectNames}, suggest a priority order based on their current status and due dates.`;
    try {
      const prioritySuggestion = await generateProjectInsights(prompt);
      setAiSuggestion(prioritySuggestion);
      setToastMessage('AI-generated project prioritization received!');
    } catch (error) {
      console.error("Error generating project prioritization:", error);
      setToastMessage('Failed to generate project prioritization');
    }
  };

  const handleRiskAssessment = async () => {
    const projectDetails = projects.map(p => `${p.name} (Status: ${p.status}, Progress: ${p.progress}%, Due: ${p.dueDate})`).join('; ');
    const prompt = `Based on these project details: ${projectDetails}, identify potential risks and suggest mitigation strategies.`;
    try {
      const riskAssessment = await generateProjectInsights(prompt);
      setAiSuggestion(riskAssessment);
      setToastMessage('AI-generated risk assessment received!');
    } catch (error) {
      console.error("Error generating risk assessment:", error);
      setToastMessage('Failed to generate risk assessment');
    }
  };

  const tableColumns = [
    { header: 'ID', accessor: 'id' as keyof Project },
    { header: 'Name', accessor: 'name' as keyof Project },
    { header: 'Status', accessor: 'status' as keyof Project },
    {
      header: 'Progress',
      accessor: 'progress' as keyof Project,
      cell: ({ row }: { row: { original: Project } }) => (
        <Progress value={row.original.progress} />
      ),
    },
    { header: 'Due Date', accessor: 'dueDate' as keyof Project },
  ];

  return (
    <ToastProvider>
      <TooltipProvider>
        <div className={styles.dashboardContainer}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <div className={styles.mainContent}>
            <Header
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              toggleSidebar={toggleSidebar}
            />
            <main className={styles.mainArea}>
              <div className={styles.dashboardHeader}>
                <h1 className={styles.title}>Dashboard</h1>
                <Button onClick={() => setToastMessage('Dashboard refreshed!')} className={styles.refreshButton}>
                  <FiRefreshCw className="mr-2" /> Refresh
                </Button>
              </div>

              <SearchBar onSearch={handleSearch} />

              <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.tabsContainer}>
                <TabsList className={styles.tabsList}>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="code-review">Code Review</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={styles.tabContent}
                  >
                    <TabsContent value="overview">
                      <div className={styles.gridContainer}>
                        <Card className={styles.card}>
                          <CardHeader>
                            <CardTitle>Projects Overview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className={styles.projectOverview}>
                              <p className={styles.totalProjects}>Total Projects: {projects.length}</p>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button onClick={handleAddProject} size="sm" className={styles.addProjectButton}>
                                    <FiPlus className="mr-2" /> Add Project
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Add a new project to your dashboard
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Progress value={75} />
                          </CardContent>
                        </Card>

                        <Card className={styles.card}>
                          <CardHeader>
                            <CardTitle>Project Calendar</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Calendar
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="rounded-md border"
                            />
                            {selectedDate && (
                              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                                Selected date: {selectedDate.toLocaleDateString()}
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        <Card className={styles.card}>
                          <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className={styles.quickActions}>
                              <Button onClick={handleProjectPrioritization} className={styles.fullWidthButton}>
                                <FiAward className="mr-2" /> Prioritize Projects
                              </Button>
                              <Button onClick={handleRiskAssessment} className={styles.fullWidthButton}>
                                <FiAlertTriangle className="mr-2" /> Risk Assessment
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <ProjectTimeline projects={projects} />
                    </TabsContent>

                    <TabsContent value="projects">
                      <Card className={styles.card}>
                        <CardHeader>
                          <CardTitle>Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className={styles.projectFilters}>
                            <Select onValueChange={handleStatusFilter}>
                              <SelectTrigger className={styles.statusFilter}>
                                <SelectValue placeholder="Filter by status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className={styles.viewModeButtons}>
                              <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleViewMode('list')}
                              >
                                <FiList size={18} />
                              </Button>
                              <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleViewMode('grid')}
                              >
                                <FiGrid size={18} />
                              </Button>
                            </div>
                          </div>
                          <ProjectList
                            projects={filteredProjects}
                            viewMode={viewMode}
                            onEditProject={(id) => console.log('Edit project', id)}
                            onDeleteProject={(id) => console.log('Delete project', id)}
                          />
                        </CardContent>
                      </Card>

                      <Card className={`${styles.card} mt-6`}>
                        <CardHeader>
                          <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="table">
                            <TabsList>
                              <TabsTrigger value="table">Table View</TabsTrigger>
                              <TabsTrigger value="chart">Chart View</TabsTrigger>
                            </TabsList>
                            <TabsContent value="table">
                              <DataTable columns={tableColumns} data={filteredProjects} />
                            </TabsContent>
                            <TabsContent value="chart">
                              <div className={styles.chartPlaceholder}>
                                Chart placeholder
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="ai-insights">
                      <AIInsights insight={aiSuggestion} onRefresh={handleProjectPrioritization} isLoading={false} />
                      <AIAssistant onGenerateInsights={generateProjectInsights} />
                      <CollaborativeIdeaGenerator />
                    </TabsContent>

                    <TabsContent value="tasks">
                      <TaskBoard />
                    </TabsContent>

                    <TabsContent value="code-review">
                      <CodeReviewAssistant />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </main>
          </div>
          <MessageSection />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsModalOpen(false);
                  setToastMessage('New project added successfully!');
                }}
              >
                <div className={styles.modalForm}>
                  <Input placeholder="Enter project name" />
                  <Input placeholder="Enter project description" />
                  <Input type="date" />
                  <DialogFooter>
                    <Button type="submit">Add Project</Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <ToastViewport />
        </div>
      </TooltipProvider>
    </ToastProvider>
  );
};

export default Dashboard;