// src/types/project.ts
export interface Project {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    owner: string;
    members: string[];
    status: string;
    progress: number;
    dueDate: string;
  }