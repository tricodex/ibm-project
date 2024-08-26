// src/app/components/Dashboard/Projects.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { DataTable } from '@/app/components/ui/datatable';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { FiList, FiGrid, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import styles from './Projects.module.css';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      // Replace this with actual API call
      const mockProjects: Project[] = [
        { id: 1, name: 'Project Alpha', description: 'Lorem ipsum dolor sit amet', created_at: '2022-01-01', updated_at: '2022-01-02', owner: 'John Doe', members: ['Jane Doe', 'Bob Smith'], status: 'In Progress', progress: 75, dueDate: '2024-09-30' },
        { id: 2, name: 'Project Beta', description: 'Lorem ipsum dolor sit amet', created_at: '2022-01-03', updated_at: '2022-01-04', owner: 'Jane Doe', members: ['John Doe', 'Bob Smith'], status: 'Not Started', progress: 0, dueDate: '2024-10-15' },
        { id: 3, name: 'Project Gamma', description: 'Lorem ipsum dolor sit amet', created_at: '2022-01-05', updated_at: '2022-01-06', owner: 'Bob Smith', members: ['John Doe', 'Jane Doe'], status: 'Completed', progress: 100, dueDate: '2024-08-31' },
      ];
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    };

    fetchProjects();
  }, []);

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

  const handleDeleteProject = (projectId: number) => {
    // Implement delete logic
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement add/edit logic
    setIsModalOpen(false);
    setEditingProject(null);
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
    {
      header: 'Actions',
      cell: ({ row }: { row: { original: Project } }) => (
        <div className={styles.actionButtons}>
          <Button variant="outline" size="sm" onClick={() => handleEditProject(row.original)}>
            <FiEdit size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteProject(row.original.id)}>
            <FiTrash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

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
                  placeholder="Enter project name" 
                  defaultValue={editingProject?.name || ''}
                />
                <Input 
                  placeholder="Enter project description" 
                  defaultValue={editingProject?.description || ''}
                />
                <Input 
                  type="date" 
                  defaultValue={editingProject?.dueDate || ''}
                />
                <Select defaultValue={editingProject?.status || ''}>
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