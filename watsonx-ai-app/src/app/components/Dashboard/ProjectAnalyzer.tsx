import React, { useState } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FiActivity, FiClock, FiList, FiServer } from 'react-icons/fi';

interface Project {
  id: number;
  name: string;
  description: string;
}

const ProjectAnalyzer: React.FC<{ project: Project }> = ({ project }) => {
  const { generateProjectInsights, generateTaskBreakdown, estimateProjectDuration, suggestTechStack, isLoading } = useWatson();
  const [insights, setInsights] = useState('');
  const [tasks, setTasks] = useState('');
  const [duration, setDuration] = useState('');
  const [techStack, setTechStack] = useState('');

  const analyzeProject = async () => {
    setInsights(await generateProjectInsights(project.description));
    const taskList = await generateTaskBreakdown(project.description);
    setTasks(taskList);
    setDuration(await estimateProjectDuration(taskList.split('\n')));
    setTechStack(await suggestTechStack(project.description));
  };

  return (
    <Card title={`AI Analysis for ${project.name}`} className="mb-6">
      <Button onClick={analyzeProject} disabled={isLoading} className="mb-4">
        {isLoading ? 'Analyzing...' : 'Analyze Project'}
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="flex items-center text-lg font-semibold mb-2">
            <FiActivity className="mr-2" /> Project Insights
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{insights || 'No insights generated yet.'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="flex items-center text-lg font-semibold mb-2">
            <FiList className="mr-2" /> Task Breakdown
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
            {tasks.split('\n').map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="flex items-center text-lg font-semibold mb-2">
            <FiClock className="mr-2" /> Estimated Duration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{duration || 'No duration estimated yet.'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="flex items-center text-lg font-semibold mb-2">
            <FiServer className="mr-2" /> Suggested Tech Stack
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{techStack || 'No tech stack suggested yet.'}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProjectAnalyzer;