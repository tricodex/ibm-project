import React from 'react'
import styles from './ProjectList.module.css'

export interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface ProjectListProps {
  projects: Project[];
  viewMode: 'list' | 'grid';
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, viewMode }) => {
  return (
    <div className={`${styles['project-list']} ${styles[viewMode]}`}>
      {projects.map((project) => (
        <div key={project.id} className={styles['project-item']}>
          <h3 className={styles['project-name']}>{project.name}</h3>
          <p className={styles['project-status']}>{project.status}</p>
          <div className={styles['progress-bar']}>
            <div 
              className={styles['progress-bar-inner']} 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          <p className={styles['project-due-date']}>Due: {project.dueDate}</p>
        </div>
      ))}
    </div>
  )
}

export default ProjectList