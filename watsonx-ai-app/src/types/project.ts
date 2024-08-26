// src/types/project.ts
export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner: string;
  members: string[];
  status: string; // Ensure this line exists and is correct
  progress: number;
  dueDate: string;
}

export interface ProjectUpdateInput {
  id: number;
  name: string;
  description: string;
  status: string;  // Ensure this line exists and is correct
  progress: string;
  dueDate: string;
}
