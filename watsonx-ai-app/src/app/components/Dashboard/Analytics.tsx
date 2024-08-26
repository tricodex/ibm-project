// src/app/components/Dashboard/Analytics.tsx
'use client';

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, BarChart, PieChart, Tooltip as RechartsTooltip, Legend, Line, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

// Mock data - replace with real data fetching logic
const projectData = [
  { name: 'Project A', completed: 65, inProgress: 25, notStarted: 10 },
  { name: 'Project B', completed: 80, inProgress: 15, notStarted: 5 },
  { name: 'Project C', completed: 40, inProgress: 50, notStarted: 10 },
  { name: 'Project D', completed: 90, inProgress: 10, notStarted: 0 },
];

const taskCompletionData = [
  { date: '2023-01', completed: 20 },
  { date: '2023-02', completed: 35 },
  { date: '2023-03', completed: 50 },
  { date: '2023-04', completed: 75 },
  { date: '2023-05', completed: 90 },
];

const teamPerformanceData = [
  { name: 'Team A', performance: 85 },
  { name: 'Team B', performance: 70 },
  { name: 'Team C', performance: 95 },
  { name: 'Team D', performance: 60 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const Analytics: React.FC = () => {
  const { generateProjectInsights } = useWatson();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState('all');
  const [aiInsights, setAiInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAIInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const insights = await generateProjectInsights(`Provide insights for ${selectedProject === 'all' ? 'all projects' : selectedProject}`);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [generateProjectInsights, selectedProject]);

  useEffect(() => {
    fetchAIInsights();
  }, [fetchAIInsights]);

  const calculateOverallProgress = () => {
    const totalCompleted = projectData.reduce((acc, project) => acc + project.completed, 0);
    return Math.round(totalCompleted / projectData.length);
  };

  const getProjectHealth = (progress: number) => {
    if (progress >= 80) return { status: 'Healthy', color: 'bg-green-500' };
    if (progress >= 60) return { status: 'Moderate', color: 'bg-yellow-500' };
    return { status: 'At Risk', color: 'bg-red-500' };
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white animate-fadeIn">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Project Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projectData.map(project => (
                    <SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={fetchAIInsights} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              >
                {isLoading ? (
                  <FiRefreshCw className="mr-2 animate-spin" />
                ) : (
                  <FiRefreshCw className="mr-2" />
                )}
                {isLoading ? 'Generating...' : 'Refresh Insights'}
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slideDown">
              <TabsList className="grid w-full grid-cols-4 gap-4 bg-gray-700 p-1 rounded-lg">
                {['overview', 'progress', 'performance', 'insights'].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="text-sm capitalize transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-6 transition-all duration-300 ease-in-out">
                <TabsContent value="overview" className="space-y-4">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Progress value={calculateOverallProgress()} className="flex-grow mr-4" />
                        <span className="text-2xl font-bold">{calculateOverallProgress()}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Project Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {projectData.map(project => {
                        const health = getProjectHealth(project.completed);
                        return (
                          <div key={project.name} className="flex justify-between items-center mb-2">
                            <span>{project.name}</span>
                            <Badge className={`${health.color} text-white`}>{health.status}</Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Task Completion Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={taskCompletionData}>
                          <XAxis dataKey="date" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="progress">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={projectData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#8884d8" />
                      <Bar dataKey="inProgress" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="notStarted" stackId="a" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="performance">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={teamPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="performance"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {teamPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="insights">
                  <ScrollArea className="h-[300px] bg-gray-700 rounded-lg p-4">
                    <Alert x>
                      <AlertTitle>AI-Generated Insights</AlertTitle>
                      <AlertDescription>
                        {aiInsights || 'No insights available. Click "Refresh Insights" to generate.'}
                      </AlertDescription>
                    </Alert>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Alert x>
              <AlertTitle>Pro Tip</AlertTitle>
              <AlertDescription>
                Use the AI Insights tab for personalized recommendations based on your project data.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl animate-slideUp">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: FiTrendingUp, value: '87%', label: 'On-Time Completion Rate', tooltip: 'Percentage of tasks completed within the estimated timeframe' },
                { icon: FiTrendingDown, value: '2.5 days', label: 'Average Task Delay', tooltip: 'Average time tasks are delayed beyond their estimated completion date' },
                { icon: FiAlertCircle, value: '3', label: 'Critical Issues', tooltip: 'Number of high-priority issues that require immediate attention' },
              ].map((metric, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-700 p-4 rounded-lg text-center transition-all duration-300 hover:bg-gray-600 cursor-pointer">
                      <metric.icon className="text-3xl mb-2 mx-auto text-blue-400" />
                      <span className="text-2xl font-bold block">{metric.value}</span>
                      <span className="text-sm text-gray-300">{metric.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {metric.tooltip}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Analytics;