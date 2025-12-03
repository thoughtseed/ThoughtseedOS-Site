import React from 'react';
import { Project } from '../types';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isActive = false }) => {
  // Use the first screenshot from the project's screenshots array, fallback to mock image
  const projectImage = project.screenshots && project.screenshots.length > 0 
    ? project.screenshots[0] 
    : `https://picsum.photos/seed/${project.id}/800/600`;

  return (
    <div 
      className={`
        group relative h-full w-full flex flex-col 
        bg-white dark:bg-cosmic-dark/90 backdrop-blur-xl
        overflow-hidden transition-all duration-700 ease-out
        ${isActive 
            ? 'scale-100 opacity-100 border-2 border-neo-lime shadow-[0_0_60px_rgba(204,255,0,0.3)] z-50' 
            : 'scale-90 opacity-30 grayscale blur-[2px] border border-gray-200 dark:border-white/10 z-0'
        }
      `}
    >
      
      {/* Image Container */}
      <div className="relative h-[60%] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-80'}`} />
        
        <img 
          src={projectImage} 
          alt={project.name} 
          className="w-full h-full object-cover"
        />
        
        {isActive && (
            <div className="absolute top-4 right-4 z-20 flex gap-2 animate-in fade-in duration-700">
                {project.featured && (
                <div className="bg-neo-lime text-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[0_0_10px_#ccff00]">
                    Featured
                </div>
                )}
            </div>
        )}

        <div className="absolute bottom-4 left-4 z-20 translate-y-2 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
             <span className="text-neo-pink text-xs font-mono mb-1 block tracking-widest">{project.client}</span>
             <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] border border-white/30 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {tag}
                    </span>
                ))}
             </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-grow p-6 flex flex-col justify-between relative transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
        <div>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase leading-none font-sans text-neo-black dark:text-white">
                {project.name}
                </h3>
                {project.url && isActive && (
                    <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-full border border-gray-300 dark:border-white/20 text-neo-black dark:text-white hover:bg-neo-lime hover:text-black hover:border-neo-lime transition-all duration-300 hover:scale-110"
                    >
                    <ArrowUpRight size={20} />
                    </a>
                )}
            </div>
            <p className="text-sm font-mono text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                {project.description}
            </p>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between items-end">
             <div className="flex flex-wrap gap-x-4 text-xs font-mono text-gray-500 dark:text-gray-500">
                {project.tech.slice(0, 3).map((t, i) => (
                    <span key={i}>// {t}</span>
                ))}
             </div>
             <span className={`text-xs font-bold ${isActive ? 'text-neo-lime' : 'text-gray-500'}`}>{project.year}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;