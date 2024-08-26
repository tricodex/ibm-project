import React, { useState, useEffect, useCallback } from 'react';
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
import Textarea from '@/components/ui/textarea';
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
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { FiPlus, FiClock, FiCpu, FiList, FiAward, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  estimatedTime?: string;
}

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task: Partial<Task>;
  setTask: React.Dispatch<React.SetStateAction<Partial<Task>>>;
}

function AddTaskDialog({ open, onClose, onSubmit, task, setTask }: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Task title"
          value={task.title || ''}
          onChange={(e) => setTask((prev) => ({ ...prev, title: e.target.value }))}
          className="mb-4"
        />
        <Textarea
          placeholder="Task description"
          value={task.description || ''}
          onChange={(e) => setTask((prev) => ({ ...prev, description: e.target.value }))}
          className="mb-4"
        />
        <DialogFooter>
          <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" /> Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [projectDescription, setProjectDescription] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    generateTaskBreakdown,
    estimateProjectDuration,
    suggestTechStack,
    generateTestCases,
  } = useWatson();

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = useCallback(() => {
    if (newTask.title && newTask.description) {
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: Date.now(), status: 'To Do', priority: 'Medium' } as Task]);
      setNewTask({});
      setIsModalOpen(false);
      setToastMessage('Task added successfully!');
    } else {
      setToastMessage('Please provide both title and description.');
    }
  }, [newTask]);

  const handleStatusChange = useCallback((taskId: number, newStatus: Task['status']) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  }, []);

  const handlePriorityChange = useCallback((taskId: number, newPriority: Task['priority']) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  }, []);

  const handleAIOperation = useCallback(async (operation: () => Promise<string>, successMessage: string) => {
    setIsLoading(true);
    try {
      const result = await operation();
      setAiSuggestion(result);
      setToastMessage(successMessage);
    } catch (error) {
      console.error('AI operation failed:', error);
      setToastMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateTaskBreakdown = useCallback(async () => {
    if (!projectDescription) {
      setToastMessage('Please enter a project description.');
      return;
    }
    const systemPrompt = `
      Analyze the project description and generate a markdown list of tasks, each with:
      1. Title
      2. Description
      3. Estimated time
      4. Priority
    `;
    await handleAIOperation(
      () => generateTaskBreakdown(projectDescription, 'GRANITE_34B_CODE_INSTRUCT', systemPrompt),
      'Task breakdown generated successfully!'
    );
  }, [projectDescription, generateTaskBreakdown, handleAIOperation]);

  const handleEstimateProjectDuration = useCallback(async () => {
    const taskTitles = tasks.map(task => task.title);
    const systemPrompt = `
      Estimate the duration for each task and total project duration. Highlight potential risks.
    `;
    await handleAIOperation(
      () => estimateProjectDuration(taskTitles, 'GRANITE_13B_INSTRUCT_V2', systemPrompt),
      'Project duration estimate generated!'
    );
  }, [tasks, estimateProjectDuration, handleAIOperation]);

  const handleSuggestTechStack = useCallback(async () => {
    const projectRequirements = tasks.map(task => task.description).join(' ');
    const systemPrompt = `
      Suggest a suitable tech stack based on the project requirements, with pros and cons.
    `;
    await handleAIOperation(
      () => suggestTechStack(projectRequirements, 'GRANITE_13B_INSTRUCT_V2', systemPrompt),
      'Tech stack suggestion received!'
    );
  }, [tasks, suggestTechStack, handleAIOperation]);

  const handleGenerateTestCases = useCallback(async () => {
    const functionality = tasks.map(task => `${task.title}: ${task.description}`).join('\n');
    const systemPrompt = `
      Generate a set of test cases, including edge cases, for the listed functionality.
    `;
    await handleAIOperation(
      () => generateTestCases(functionality, 'GRANITE_13B_INSTRUCT_V2', systemPrompt),
      'Test cases generated successfully!'
    );
  }, [tasks, generateTestCases, handleAIOperation]);

  return (
    <ToastProvider>
      <TooltipProvider>
        <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen animate-fadeIn">
          <Card className="bg-gray-800 border-gray-700 shadow-xl animate-slideDown">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <FiList className="mr-2" /> Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 animate-slideUp">
                  <FiPlus className="mr-2" /> Add Task
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleEstimateProjectDuration}
                      className="bg-green-600 hover:bg-green-700 animate-slideUp"
                    >
                      <FiClock className="mr-2" /> Estimate Duration
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    AI will estimate the project duration based on current tasks.
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleSuggestTechStack} 
                      className="bg-purple-600 hover:bg-purple-700 animate-slideUp"
                    >
                      <FiCpu className="mr-2" /> Suggest Tech Stack
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    AI will suggest a tech stack based on task descriptions.
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleGenerateTestCases} 
                      className="bg-yellow-600 hover:bg-yellow-700 animate-slideUp"
                    >
                      <FiList className="mr-2" /> Generate Test Cases
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    AI will generate test cases based on task descriptions.
                  </TooltipContent>
                </Tooltip>
              </div>

              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 gap-4">
                  <TabsTrigger value="all" className="text-sm">All Tasks</TabsTrigger>
                  <TabsTrigger value="todo" className="text-sm">To Do</TabsTrigger>
                  <TabsTrigger value="inprogress" className="text-sm">In Progress</TabsTrigger>
                  <TabsTrigger value="done" className="text-sm">Done</TabsTrigger>
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

          <Card className="bg-gray-800 border-gray-700 shadow-xl animate-slideUp">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <FiAward className="mr-2" /> AI Task Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter project description for AI-powered task breakdown"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="mb-4 bg-gray-700 text-white border-gray-600"
              />
              <Button 
                onClick={handleGenerateTaskBreakdown} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <FiAward className="mr-2" /> 
                {isLoading ? 'Generating...' : 'Generate Task Breakdown'}
              </Button>
              {aiSuggestion && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg animate-fadeIn">
                  <h4 className="text-lg font-semibold text-white mb-2">AI Suggestion:</h4>
                  <ReactMarkdown className="text-gray-300 prose prose-invert">
                    {aiSuggestion}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>

          <AddTaskDialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTask}
            task={newTask}
            setTask={setNewTask}
          />

          {toastMessage && (
            <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
              <Toast className="bg-gray-800 border border-gray-700 text-white">
                <p>{toastMessage}</p>
              </Toast>
            </div>
          )}
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

const TaskList: React.FC<TaskListProps> = React.memo(({ tasks, onStatusChange, onPriorityChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </div>
  );
});
TaskList.displayName = 'TaskList'; // Add display name here




const TaskCard: React.FC<{
  task: Task;
  onStatusChange: (taskId: number, newStatus: Task['status']) => void;
  onPriorityChange: (taskId: number, newPriority: Task['priority']) => void;
}> = React.memo(({ task, onStatusChange, onPriorityChange }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
          {task.title}
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">{task.description}</p>
        <div className="space-y-2">
          <Select
            defaultValue={task.status}
            onValueChange={(value) => onStatusChange(task.id, value as Task['status'])}
          >
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={task.priority}
            onValueChange={(value) => onPriorityChange(task.id, value as Task['priority'])}
          >
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {task.estimatedTime && (
          <p className="mt-4 text-sm text-gray-400">
            <FiAlertCircle className="inline-block mr-1" />
            Estimated time: {task.estimatedTime}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
TaskCard.displayName = 'TaskCard'; // Add display name here


const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'Low':
      return 'bg-green-600 text-white';
    case 'Medium':
      return 'bg-yellow-600 text-white';
    case 'High':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

export default Tasks;
