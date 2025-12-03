export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  tags: string[];
  screenshots: string[];
  tech: string[];
  url: string | null;
  client: string;
  year: string;
  featured: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  approach: string;
  benefits: string[];
  deliverables: string[];
  featured: boolean;
}

export interface Data {
  projects: Project[];
  services: Service[];
}