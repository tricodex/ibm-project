import React from 'react';
import { useWatson } from '@/hooks/useWatson';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
}

interface ProjectListProps {
  viewMode: 'grid' | 'list';
}

const ProjectList: React.FC<ProjectListProps> = ({ viewMode }) => {
  const { generateProjectInsights } = useWatson();

  // Mock data - replace with actual data fetching logic
  const projects: Project[] = [
    { id: '1', name: 'Web App', description: 'E-commerce platform', progress: 60, dueDate: '2023-12-31' },
    { id: '2', name: 'Mobile App', description: 'Fitness tracker', progress: 30, dueDate: '2024-03-15' },
    { id: '3', name: 'Desktop App', description: 'Task management tool', progress: 80, dueDate: '2023-10-15' },
    { id: '4', name: 'API Integration', description: 'Third-party services integration', progress: 45, dueDate: '2024-01-30' },
    // Add more projects...
  ];

  const handleProjectClick = async (project: Project) => {
    const insights = await generateProjectInsights(JSON.stringify(project));
    console.log(`AI Insights for ${project.name}:`, insights);
    // Implement logic to display insights to the user
  };

  return (
    <div className={`project-boxes ${viewMode === 'grid' ? 'jsGridView' : 'jsListView'}`}>
      {projects.map((project) => (
        <div key={project.id} className="project-box-wrapper" onClick={() => handleProjectClick(project)}>
          <div className="project-box" style={{ backgroundColor: '#e9e7fd' }}>
            <div className="project-box-header">
              <span>{project.dueDate}</span>
              <div className="more-wrapper">
                <button className="project-btn-more">
                  {/* Add more icon */}
                </button>
              </div>
            </div>
            <div className="project-box-content-header">
              <p className="box-content-header">{project.name}</p>
              <p className="box-content-subheader">{project.description}</p>
            </div>
            <div className="box-progress-wrapper">
              <p className="box-progress-header">Progress</p>
              <div className="box-progress-bar">
                <span className="box-progress" style={{ width: `${project.progress}%`, backgroundColor: '#4f3ff0' }}></span>
              </div>
              <p className="box-progress-percentage">{project.progress}%</p>
            </div>
            <div className="project-box-footer">
              {/* Add project participants and days left */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;