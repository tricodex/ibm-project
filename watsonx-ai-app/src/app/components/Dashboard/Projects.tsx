// src/app/components/Dashboard/Projects.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import DataTable, { Column } from '@/app/components/ui/datatable';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/app/components/ui/tooltip';
import { FiList, FiGrid, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import styles from './Projects.module.css';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.status === status));
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      setProjects(projects.filter(project => project.id !== projectId));
      setFilteredProjects(filteredProjects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const projectData = {
      name: formData.get('name')?.toString(),
      description: formData.get('description')?.toString(),
      status: formData.get('status')?.toString(),
      progress: parseInt(formData.get('progress')?.toString() || '0'),
      dueDate: formData.get('dueDate')?.toString(),
    };

    try {
      const url = editingProject ? `/api/projects` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...projectData, id: editingProject?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const savedProject = await response.json();

      if (editingProject) {
        setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
        setFilteredProjects(filteredProjects.map(p => p.id === savedProject.id ? savedProject : p));
      } else {
        setProjects([...projects, savedProject]);
        setFilteredProjects([...filteredProjects, savedProject]);
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const tableColumns: Column<Project>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Progress',
      accessor: 'progress',
      render: (value) => <Progress value={Number(value)} />,
    },
    { header: 'Due Date', accessor: 'dueDate' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, project) => (
        <div className={styles.actionButtons}>
          <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
            <FiEdit size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project.id)}>
            <FiTrash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <TooltipProvider>
      <div className={styles.projectsContainer}>
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
                  onClick={() => setViewMode('list')}
                >
                  <FiList size={18} />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid size={18} />
                </Button>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleAddProject} size="sm" className={styles.addProjectButton}>
                    <FiPlus className="mr-2" /> Add Project
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Add a new project
                </TooltipContent>
              </Tooltip>
            </div>

            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <DataTable columns={tableColumns} data={filteredProjects} />
              </TabsContent>
              <TabsContent value="grid">
                <div className={styles.gridView}>
                  {filteredProjects.map(project => (
                    <Card key={project.id} className={styles.projectCard}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{project.description}</p>
                        <Progress value={project.progress} className="mt-2" />
                        <p className="mt-2">Status: {project.status}</p>
                        <p>Due Date: {project.dueDate}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                          <FiEdit size={16} className="mr-2" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project.id)}>
                          <FiTrash2 size={16} className="mr-2" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitProject}>
              <div className={styles.modalForm}>
                <Input 
                  name="name"
                  placeholder="Enter project name" 
                  defaultValue={editingProject?.name || ''}
                />
                <Input 
                  name="description"
                  placeholder="Enter project description" 
                  defaultValue={editingProject?.description || ''}
                />
                <Input 
                  name="dueDate"
                  type="date" 
                  defaultValue={editingProject?.dueDate || ''}
                />
                <Select name="status" defaultValue={editingProject?.status || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  name="progress"
                  type="number" 
                  placeholder="Enter progress (0-100)"
                  defaultValue={editingProject?.progress.toString() || '0'}
                  min="0"
                  max="100"
                />
                <DialogFooter>
                  <Button type="submit">{editingProject ? 'Update Project' : 'Add Project'}</Button>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Projects;
