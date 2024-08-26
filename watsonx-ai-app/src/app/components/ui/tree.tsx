// src/components/ui/tree.tsx
'use client';

import React from 'react';
import { FiFolder, FiFile } from 'react-icons/fi';

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

const TreeItem: React.FC<{ node: FileNode; onNodeSelect?: (node: FileNode) => void }> = ({ node, onNodeSelect }) => (
  <div className="tree-item" onClick={() => onNodeSelect && onNodeSelect(node)}>
    {node.type === 'folder' ? <FiFolder /> : <FiFile />} {node.name}
  </div>
);

const Tree: React.FC<TreeProps> = ({ nodes, onNodeSelect }) => {
  const renderTreeItems = (nodes: FileNode[]) =>
    nodes.map((node) => (
      <div key={node.id}>
        <TreeItem node={node} onNodeSelect={onNodeSelect} />
        {node.children && <div className="ml-4">{renderTreeItems(node.children)}</div>}
      </div>
    ));

  return <div className="tree">{renderTreeItems(nodes)}</div>;
};

export { Tree, TreeItem };
