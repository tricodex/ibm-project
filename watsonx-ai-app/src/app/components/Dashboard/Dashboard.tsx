'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboard } from '@/hooks/useDashboard'
import { useWatson } from '@/hooks/useWatson'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ProjectList from './ProjectList'
import { Project } from '@/types/project'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Toast, ToastProvider, ToastViewport, ToastAction } from '@/components/ui/Toast'
import DataTable from '@/components/ui/DataTable'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { ProgressBar } from '@/components/ui/ProgressBar'
import Calendar from '@/components/ui/Calendar'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/Tooltip'
import { FiList, FiGrid, FiPlus, FiRefreshCw, FiAlertTriangle, FiAward } from 'react-icons/fi'
import { AIAssistant } from './AIAssistant'
import { SearchBar } from './SearchBar'
import MessageSection from './MessageSection'
import CollaborativeIdeaGenerator from './CollaborativeIdeaGenerator'
import ProjectTimeline from './ProjectTimeline'
import AIInsights from './AIInsights'
import TaskBoard from './TaskBoard'
import CodeReviewAssistant from './CodeReviewAssistant'

const Dashboard: React.FC = () => {
  const { 
    isDarkMode, 
    viewMode, 
    toggleDarkMode, 
    toggleViewMode
  } = useDashboard()
  const { generateProjectInsights, getCodeSuggestions } = useWatson()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulating fetching projects from an API
    const mockProjects: Project[] = [
      { 
        id: '1', 
        name: 'Project Watson', 
        description: 'A project for building a web application', 
        created_at: '2022-10-01', 
        updated_at: '2022-10-05', 
        owner: 'John Doe', 
        members: ['Jane Smith', 'Mike Johnson'],
        status: 'In Progress',
        progress: 60,
        dueDate: '2023-12-31'
      },
      { 
        id: '2', 
        name: 'Project Granite', 
        description: 'A project for developing a mobile app', 
        created_at: '2022-09-15', 
        updated_at: '2022-10-03', 
        owner: 'Alice Brown', 
        members: ['Bob Wilson', 'Emily Davis'],
        status: 'Not Started',
        progress: 0,
        dueDate: '2024-03-15'
      },
      { 
        id: '3', 
        name: 'Project IBM', 
        description: 'A coding project for creating a backend API', 
        created_at: '2022-10-03', 
        updated_at: '2022-10-06', 
        owner: 'Samuel Lee', 
        members: ['Olivia Taylor', 'Daniel Clark'],
        status: 'Completed',
        progress: 100,
        dueDate: '2023-11-30'
      },
    ]
    setProjects(mockProjects)
    setFilteredProjects(mockProjects)
  }, [])

  const handleAddProject = async () => {
    try {
      const insight = await generateProjectInsights("User is adding a new project")
      setAiSuggestion(insight)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error generating project insight:", error)
      setToastMessage('Failed to generate project insight')
    }
  }

  const handleSearch = async (query: string) => {
    try {
      const codeSuggestions = await getCodeSuggestions(query)
      setAiSuggestion(codeSuggestions)
      setToastMessage('Code suggestions generated!')
    } catch (error) {
      console.error("Error generating code suggestions:", error)
      setToastMessage('Failed to generate code suggestions')
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    if (status === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.status === status))
    }
  }

  const handleProjectPrioritization = async () => {
    const projectNames = projects.map(p => p.name).join(', ')
    const prompt = `Given these projects: ${projectNames}, suggest a priority order based on their current status and due dates.`
    try {
      const prioritySuggestion = await generateProjectInsights(prompt)
      setAiSuggestion(prioritySuggestion)
      setToastMessage('AI-generated project prioritization received!')
    } catch (error) {
      console.error("Error generating project prioritization:", error)
      setToastMessage('Failed to generate project prioritization')
    }
  }

  const handleRiskAssessment = async () => {
    const projectDetails = projects.map(p => `${p.name} (Status: ${p.status}, Progress: ${p.progress}%, Due: ${p.dueDate})`).join('; ')
    const prompt = `Based on these project details: ${projectDetails}, identify potential risks and suggest mitigation strategies.`
    try {
      const riskAssessment = await generateProjectInsights(prompt)
      setAiSuggestion(riskAssessment)
      setToastMessage('AI-generated risk assessment received!')
    } catch (error) {
      console.error("Error generating risk assessment:", error)
      setToastMessage('Failed to generate risk assessment')
    }
  }

  const tableColumns = [
    { header: 'ID', accessor: 'id' as keyof Project },
    { header: 'Name', accessor: 'name' as keyof Project },
    { header: 'Status', accessor: 'status' as keyof Project },
    { 
      header: 'Progress', 
      accessor: 'progress' as keyof Project,
      cell: ({ row }: { row: { original: Project } }) => <ProgressBar progress={row.original.progress} showPercentage />
    },
    { header: 'Due Date', accessor: 'dueDate' as keyof Project },
  ]

  return (
    <ToastProvider>
      <TooltipProvider>
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode}
              toggleSidebar={toggleSidebar}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800">
              <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
                  <Button onClick={() => setToastMessage('Dashboard refreshed!')} className="flex items-center">
                    <FiRefreshCw className="mr-2" /> Refresh
                  </Button>
                </div>

                <SearchBar onSearch={handleSearch} />

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="code-review">Code Review</TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Projects Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center mb-4">
                                <p className="text-2xl font-bold">Total Projects: {projects.length}</p>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button onClick={handleAddProject} size="sm">
                                      <FiPlus className="mr-2" /> Add Project
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Add a new project to your dashboard
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <ProgressBar progress={75} showPercentage />
                            </CardContent>
                          </Card>

                          <Card>
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

                          <Card>
                            <CardHeader>
                              <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Button onClick={handleProjectPrioritization} className="w-full">
                                  <FiAward className="mr-2" /> Prioritize Projects
                                </Button>
                                <Button onClick={handleRiskAssessment} className="w-full">
                                  <FiAlertTriangle className="mr-2" /> Risk Assessment
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <ProjectTimeline projects={projects} />
                      </TabsContent>

                      <TabsContent value="projects">
                        <Card>
                          <CardHeader>
                            <CardTitle>Projects</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-4">
                              <Select onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[180px]">
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
                              <div className="flex space-x-2">
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

                        <Card className="mt-6">
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
                                <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
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
              </div>
            </main>
          </div>
          <MessageSection />

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Modal'>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
              <p className="mb-4">Enter the details for your new project.</p>
              <form onSubmit={(e) => {
                e.preventDefault()
                setIsModalOpen(false)
                setToastMessage('New project added successfully!')
              }}>
                <div className="space-y-4 mt-4">
                  <Input placeholder="Enter project name" />
                  <Input placeholder="Enter project description" />
                  <Input type="date" />
                  <Button type="submit">Add Project</Button>
                </div>
              </form>
            </div>
          </Modal>

          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <Toast
                  title="Notification"
                  action={
                    <ToastAction altText="Close notification">Close</ToastAction>
                  }
                  onOpenChange={(open) => {
                    if (!open) setToastMessage('')
                  }}
                >
                  {toastMessage}
                </Toast>
              </motion.div>
            )}
          </AnimatePresence>
          <ToastViewport />
        </div>
      </TooltipProvider>
    </ToastProvider>
  )
}

export default Dashboard
