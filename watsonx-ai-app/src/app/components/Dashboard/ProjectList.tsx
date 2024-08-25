import React from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Project } from '@/types/project';
import { Menu } from '@headlessui/react';

interface ProjectListProps {
  projects: Project[];
  viewMode: 'list' | 'grid';
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  viewMode, 
  onEditProject, 
  onDeleteProject 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
        <ProjectMenu project={project} />
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
        {project.status}
      </span>
      <div className="mt-4 flex-grow">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{project.progress}% Complete</span>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Due: {project.dueDate}</p>
    </div>
  );

  const ProjectRow = ({ project }: { project: Project }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-grow">{project.name}</h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} mr-4`}>
        {project.status}
      </span>
      <div className="w-1/4 mr-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mr-4">Due: {project.dueDate}</p>
      <ProjectMenu project={project} />
    </div>
  );

  const ProjectMenu = ({ project }: { project: Project }) => (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
          <FiMoreVertical className="h-5 w-5" />
        </Menu.Button>
      </div>
      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => onEditProject(project)}
              >
                <FiEdit2 className="mr-2 h-5 w-5" />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => onDeleteProject(project.id)}
              >
                <FiTrash2 className="mr-2 h-5 w-5" />
                Delete
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );

  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {projects.map((project) => (
        viewMode === 'grid' ? (
          <ProjectCard key={project.id} project={project} />
        ) : (
          <ProjectRow key={project.id} project={project} />
        )
      ))}
    </div>
  );
};

export default ProjectList;