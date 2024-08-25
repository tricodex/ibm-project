'use client'
import React, { useState, useEffect } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useWatson } from '@/hooks/useWatson'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import ProjectList, { Project } from './ProjectList'
import Chat from '@/components/Chat'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import DataTable from '@/components/ui/DataTable'
import Dropdown from '@/components/ui/Dropdown'
import Tabs from '@/components/ui/Tabs'
import ProgressBar from '@/components/ui/ProgressBar'
import Calendar from '@/components/ui/Calendar'
import { FiList, FiGrid, FiPlus } from 'react-icons/fi'
import styles from './Dashboard.module.css'

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

  useEffect(() => {
    // Simulating fetching projects from an API
    const mockProjects: Project[] = [
      { id: 1, name: 'Project A', status: 'In Progress', progress: 75, dueDate: '2023-12-31' },
      { id: 2, name: 'Project B', status: 'Completed', progress: 100, dueDate: '2023-11-15' },
      { id: 3, name: 'Project C', status: 'Not Started', progress: 0, dueDate: '2024-01-31' },
      { id: 4, name: 'Project D', status: 'In Progress', progress: 40, dueDate: '2023-12-15' },
      { id: 5, name: 'Project E', status: 'On Hold', progress: 60, dueDate: '2024-02-28' },
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
    { header: 'ID', accessor: 'id' as const },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Status', accessor: 'status' as const },
    { 
      header: 'Progress', 
      accessor: 'progress' as const,
      render: (value: number | string) => (
        <div className={styles['progress-bar']}>
          <div 
            className={styles['progress-bar-inner']} 
            style={{ width: typeof value === 'number' ? `${value}%` : '0%' }}
          ></div>
        </div>
      )
    },
    { header: 'Due Date', accessor: 'dueDate' as const },
  ]

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={styles.main}>
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
        />
        <main className={styles['main-content']}>
          <h1 className={styles['main-title']}>Dashboard</h1>
          <div className={styles['card-grid']}>
            <Card title="Projects Overview" className={styles.card}>
              <div className={styles['card-header']}>
                <h2>Total Projects: {projects.length}</h2>
                <Button onClick={handleAddProject} className={styles.button}>
                  <FiPlus /> Add Project
                </Button>
              </div>
              <ProgressBar progress={75} showPercentage color="var(--progress-fill-color)" />
            </Card>
            <Card title="AI Insights" className={styles.card}>
              <div className={styles['ai-buttons']}>
                <Button onClick={handleProjectPrioritization}>Get Project Priorities</Button>
                <Button onClick={handleRiskAssessment}>Risk Assessment</Button>
              </div>
              {aiSuggestion && (
                <div className={styles['ai-suggestion']}>
                  <h3>AI Suggestion:</h3>
                  <p>{aiSuggestion}</p>
                </div>
              )}
            </Card>
            <Card title="Calendar" className={styles.card}>
              <Calendar onSelectDate={setSelectedDate} />
              {selectedDate && (
                <p className={styles['selected-date']}>Selected date: {selectedDate.toLocaleDateString()}</p>
              )}
            </Card>
          </div>
          <Card title="Projects" className={styles.card}>
            <div className={styles['card-header']}>
              <Dropdown
                options={['All', 'In Progress', 'Completed', 'Not Started', 'On Hold']}
                onSelect={handleStatusFilter}
                placeholder="Filter by status"
              />
              <div className={styles['view-toggle']}>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'secondary'}
                  onClick={() => toggleViewMode('list')}
                >
                  <FiList size={18} />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => toggleViewMode('grid')}
                >
                  <FiGrid size={18} />
                </Button>
              </div>
            </div>
            <ProjectList projects={filteredProjects} viewMode={viewMode} />
          </Card>
          <Card title="Project Details" className={styles.card}>
            <Tabs
              tabs={[
                {
                  id: 'table',
                  label: 'Table View',
                  content: <DataTable columns={tableColumns} data={filteredProjects} />
                },
                {
                  id: 'chart',
                  label: 'Chart View',
                  content: <div>Chart placeholder</div>
                }
              ]}
            />
          </Card>
        </main>
      </div>
      <Chat isVisible={true} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project"
      >
        <form className={styles['modal-form']}>
          <Input label="Project Name" placeholder="Enter project name" />
          <Input label="Description" placeholder="Enter project description" />
          <Input label="Due Date" type="date" />
          <Button onClick={() => setIsModalOpen(false)}>Add Project</Button>
        </form>
      </Modal>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  )
}

export default Dashboard