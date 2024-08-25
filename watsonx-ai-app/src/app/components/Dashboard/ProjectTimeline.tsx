import React from 'react';
import { Project } from '@/types/project';
import { format, differenceInDays } from 'date-fns';

interface ProjectTimelineProps {
  projects: Project[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects }) => {
  // Filter out projects that do not have a dueDate
  const validProjects = projects.filter((project) => project.dueDate);

  // If there are no valid projects with due dates, return early
  if (validProjects.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No projects with valid due dates found.</p>;
  }

  // Sort projects by due date
  const sortedProjects = [...validProjects].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const earliestDate = new Date(sortedProjects[0].dueDate);
  const latestDate = new Date(sortedProjects[sortedProjects.length - 1].dueDate);
  const totalDays = differenceInDays(latestDate, earliestDate) + 1;

  const getPositionPercentage = (date: string) => {
    const projectDate = new Date(date);
    const daysDifference = differenceInDays(projectDate, earliestDate);
    return (daysDifference / totalDays) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-yellow-500';
      case 'Completed': return 'bg-green-500';
      case 'Not Started': return 'bg-gray-500';
      case 'On Hold': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Project Timeline</h2>
      <div className="relative h-20 bg-gray-200 dark:bg-gray-700 rounded-lg">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="absolute transform -translate-x-1/2"
            style={{ left: `${getPositionPercentage(project.dueDate)}%`, top: '50%' }}
          >
            <div className={`w-4 h-4 rounded-full ${getStatusColor(project.status)}`} />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{project.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(project.dueDate), 'MMM d, yyyy')}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(earliestDate, 'MMM d, yyyy')}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(latestDate, 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
};

export default ProjectTimeline;
