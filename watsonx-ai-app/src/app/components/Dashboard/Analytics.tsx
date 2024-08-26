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
import { FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';
import styles from './Analytics.module.css';

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
    if (progress >= 80) return { status: 'Healthy', color: 'green' };
    if (progress >= 60) return { status: 'Moderate', color: 'yellow' };
    return { status: 'At Risk', color: 'red' };
  };

  return (
    <TooltipProvider>
      <div className={styles.analyticsContainer}>
        <Card className={styles.card}>
          <CardHeader>
            <CardTitle>Project Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.filters}>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projectData.map(project => (
                    <SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={fetchAIInsights} disabled={isLoading}>
                {isLoading ? 'Generating Insights...' : 'Refresh AI Insights'}
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className={styles.overviewGrid}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={styles.progressIndicator}>
                        <Progress value={calculateOverallProgress()} />
                        <span>{calculateOverallProgress()}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {projectData.map(project => {
                        const health = getProjectHealth(project.completed);
                        return (
                          <div key={project.name} className={styles.healthIndicator}>
                            <span>{project.name}</span>
                            <Badge style={{ backgroundColor: health.color }}>{health.status}</Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Task Completion Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={taskCompletionData}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="completed" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="progress">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
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
                <ScrollArea className={styles.insightsArea}>
                <Alert x={undefined}>
                <AlertTitle>AI-Generated Insights</AlertTitle>
                    <AlertDescription>
                      {aiInsights || 'No insights available. Click "Refresh AI Insights" to generate.'}
                    </AlertDescription>
                  </Alert>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
          <Alert x={undefined}>
          <AlertTitle>Analytics Tip</AlertTitle>
              <AlertDescription>
                Use the AI Insights tab to get personalized recommendations based on your project data.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

        <Card className={styles.card}>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricsGrid}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={styles.metric}>
                    <FiTrendingUp className={styles.metricIcon} />
                    <span className={styles.metricValue}>87%</span>
                    <span className={styles.metricLabel}>On-Time Completion Rate</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Percentage of tasks completed within the estimated timeframe
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={styles.metric}>
                    <FiTrendingDown className={styles.metricIcon} />
                    <span className={styles.metricValue}>2.5 days</span>
                    <span className={styles.metricLabel}>Average Task Delay</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Average time tasks are delayed beyond their estimated completion date
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={styles.metric}>
                    <FiAlertCircle className={styles.metricIcon} />
                    <span className={styles.metricValue}>3</span>
                    <span className={styles.metricLabel}>Critical Issues</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Number of high-priority issues that require immediate attention
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Analytics;