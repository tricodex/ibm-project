// src/app/components/Dashboard/Tasks.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatson } from '@/hooks/useWatson';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toast, ToastProvider, ToastViewport } from '@/app/components/ui/toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { FiPlus, FiClock, FiCpu, FiList, FiAward } from 'react-icons/fi';
import styles from './Tasks.module.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  estimatedTime?: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [projectDescription, setProjectDescription] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  const {
    generateTaskBreakdown,
    estimateProjectDuration,
    suggestTechStack,
    generateTestCases,
    isLoading,
  } = useWatson();

  useEffect(() => {
    // Fetch tasks from API or load from storage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to storage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      setTasks([...tasks, { ...newTask, id: Date.now(), status: 'To Do', priority: 'Medium' } as Task]);
      setNewTask({});
      setIsModalOpen(false);
      setToastMessage('Task added successfully!');
    }
  };

  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handlePriorityChange = (taskId: number, newPriority: Task['priority']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  const handleGenerateTaskBreakdown = async () => {
    if (projectDescription) {
      const breakdown = await generateTaskBreakdown(projectDescription);
      setAiSuggestion(breakdown);
      setToastMessage('AI-generated task breakdown received!');
    }
  };

  const handleEstimateProjectDuration = async () => {
    const taskTitles = tasks.map(task => task.title);
    const estimate = await estimateProjectDuration(taskTitles);
    setAiSuggestion(estimate);
    setToastMessage('AI-estimated project duration received!');
  };

  const handleSuggestTechStack = async () => {
    const projectRequirements = tasks.map(task => task.description).join(' ');
    const suggestion = await suggestTechStack(projectRequirements);
    setAiSuggestion(suggestion);
    setToastMessage('AI-suggested tech stack received!');
  };

  const handleGenerateTestCases = async () => {
    const functionality = tasks.map(task => `${task.title}: ${task.description}`).join('\n');
    const testCases = await generateTestCases(functionality);
    setAiSuggestion(testCases);
    setToastMessage('AI-generated test cases received!');
  };

  return (
    <ToastProvider>
      <TooltipProvider>
        <div className={styles.tasksContainer}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.taskActions}>
                <Button onClick={() => setIsModalOpen(true)}>
                  <FiPlus className="mr-2" /> Add Task
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleEstimateProjectDuration}>
                      <FiClock className="mr-2" /> Estimate Duration
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    AI will estimate the project duration based on current tasks
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSuggestTechStack}>
                      <FiCpu className="mr-2" /> Suggest Tech Stack
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    AI will suggest a tech stack based on task descriptions
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleGenerateTestCases}>
                      <FiList className="mr-2" /> Generate Test Cases
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    AI will generate test cases based on task descriptions
                  </TooltipContent>
                </Tooltip>
              </div>

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="todo">To Do</TabsTrigger>
                  <TabsTrigger value="inprogress">In Progress</TabsTrigger>
                  <TabsTrigger value="done">Done</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <TaskList 
                    tasks={tasks} 
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                  />
                </TabsContent>
                <TabsContent value="todo">
                  <TaskList 
                    tasks={tasks.filter(task => task.status === 'To Do')} 
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                  />
                </TabsContent>
                <TabsContent value="inprogress">
                  <TaskList 
                    tasks={tasks.filter(task => task.status === 'In Progress')} 
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                  />
                </TabsContent>
                <TabsContent value="done">
                  <TaskList 
                    tasks={tasks.filter(task => task.status === 'Done')} 
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>AI Task Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter project description for AI-powered task breakdown"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
              <Button onClick={handleGenerateTaskBreakdown} className="mt-4">
                <FiAward className="mr-2" /> Generate Task Breakdown
              </Button>
              {aiSuggestion && (
                <div className={styles.aiSuggestion}>
                  <h4>AI Suggestion:</h4>
                  <p>{aiSuggestion}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                <div className={styles.modalForm}>
                  <Input 
                    placeholder="Task Title"
                    value={newTask.title || ''}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <Textarea 
                    placeholder="Task Description"
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <Select
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <DialogFooter>
                    <Button type="submit">Add Task</Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <Toast
                  title="Notification"
                  description={toastMessage}
                  onOpenChange={(open) => {
                    if (!open) setToastMessage('');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <ToastViewport />
        </div>
      </TooltipProvider>
    </ToastProvider>
  );
};

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: Task['status']) => void;
  onPriorityChange: (taskId: number, newPriority: Task['priority']) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange, onPriorityChange }) => {
  return (
    <div className={styles.taskList}>
      {tasks.map(task => (
        <Card key={task.id} className={styles.taskCard}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{task.description}</p>
            <div className={styles.taskActions}>
              <Select
                defaultValue={task.status}
                onValueChange={(value) => onStatusChange(task.id, value as Task['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue={task.priority}
                onValueChange={(value) => onPriorityChange(task.id, value as Task['priority'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {task.estimatedTime && (
              <p className={styles.estimatedTime}>Estimated time: {task.estimatedTime}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Tasks;