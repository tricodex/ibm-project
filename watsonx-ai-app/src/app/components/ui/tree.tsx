import React, { useState } from 'react';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

interface TreeProps {
  nodes: FileNode[];
  onNodeSelect?: (node: FileNode) => void;
  onNodeAdd?: (parentNode: FileNode) => void;
  onNodeEdit?: (node: FileNode) => void;
  onNodeDelete?: (node: FileNode) => void;
}

const TreeItem: React.FC<{ 
  node: FileNode; 
  level: number;
  onNodeSelect?: (node: FileNode) => void;
  onNodeAdd?: (node: FileNode) => void;
  onNodeEdit?: (node: FileNode) => void;
  onNodeDelete?: (node: FileNode) => void;
}> = ({ node, level, onNodeSelect, onNodeAdd, onNodeEdit, onNodeDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const Icon = node.type === 'folder' ? (isOpen ? FiChevronDown : FiChevronRight) : FiFile;

  return (
    <div className="tree-item-container">
      <div 
        className={`tree-item group flex items-center py-1 px-2 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${level === 0 ? 'mt-1' : ''}`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={() => onNodeSelect && onNodeSelect(node)}
      >
        {node.type === 'folder' && (
          <span onClick={handleToggle} className="mr-1 transition-transform duration-200 ease-in-out transform">
            <Icon className={`w-4 h-4 text-gray-500 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
          </span>
        )}
        <Icon className={`w-4 h-4 mr-2 ${node.type === 'folder' ? 'text-yellow-400' : 'text-blue-400'}`} />
        <span className="text-sm text-gray-700 dark:text-gray-200">{node.name}</span>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
          {onNodeAdd && node.type === 'folder' && (
            <button onClick={(e) => { e.stopPropagation(); onNodeAdd(node); }} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title='onNode'>
              <FiPlus size={14} />
            </button>
          )}
          {onNodeEdit && (
            <button onClick={(e) => { e.stopPropagation(); onNodeEdit(node); }} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title='onNode'>
              <FiEdit size={14} />
            </button>
          )}
          {onNodeDelete && (
            <button onClick={(e) => { e.stopPropagation(); onNodeDelete(node); }} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title='onNode'>
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
      {node.children && isOpen && (
        <div className="tree-children ml-4 animate-slideDown">
          {node.children.map((child) => (
            <TreeItem 
              key={child.id} 
              node={child} 
              level={level + 1}
              onNodeSelect={onNodeSelect}
              onNodeAdd={onNodeAdd}
              onNodeEdit={onNodeEdit}
              onNodeDelete={onNodeDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree: React.FC<TreeProps> = ({ nodes, onNodeSelect, onNodeAdd, onNodeEdit, onNodeDelete }) => {
  return (
    <div className="tree p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-fadeIn">
      {nodes.map((node) => (
        <TreeItem 
          key={node.id} 
          node={node} 
          level={0}
          onNodeSelect={onNodeSelect}
          onNodeAdd={onNodeAdd}
          onNodeEdit={onNodeEdit}
          onNodeDelete={onNodeDelete}
        />
      ))}
    </div>
  );
};

export { Tree, TreeItem };