// src/app/components/Dashboard/CodeProjectStructure.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useWatson } from '@/hooks/useWatson';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toast, ToastProvider, ToastViewport } from '@/app/components/ui/toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tree, TreeItem } from '@/components/ui/tree';
import { CodePreview } from '@/components/ui/code-preview';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FiFolder, FiFile, FiPlus, FiEdit, FiTrash2, FiCode, FiRefreshCw } from 'react-icons/fi';
import styles from './CodeProjectStructure.module.css';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

const CodeProjectStructure: React.FC = () => {
  const { generateProjectInsights, generateCodeSnippet } = useWatson();
  const [projectStructure, setProjectStructure] = useState<FileNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Mock initial project structure - replace with actual data fetching
    setProjectStructure([
      {
        id: '1',
        name: 'src',
        type: 'folder',
        children: [
          { id: '2', name: 'index.js', type: 'file', content: 'console.log("Hello, World!");' },
          { id: '3', name: 'styles', type: 'folder', children: [
            { id: '4', name: 'main.css', type: 'file', content: 'body { font-family: sans-serif; }' }
          ]}
        ]
      },
      { id: '5', name: 'package.json', type: 'file', content: '{ "name": "my-project", "version": "1.0.0" }' }
    ]);
  }, []);

  const handleNodeSelect = (node: FileNode) => {
    setSelectedNode(node);
  };

  const handleAddNode = (parentId: string | null) => {
    setDialogMode('add');
    setNewNodeName('');
    setNewNodeContent('');
    setIsDialogOpen(true);
  };

  const handleEditNode = (node: FileNode) => {
    setDialogMode('edit');
    setSelectedNode(node);
    setNewNodeName(node.name);
    setNewNodeContent(node.content || '');
    setIsDialogOpen(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    // Implement delete logic
    setToastMessage('Node deleted successfully');
  };

  const handleDialogSubmit = () => {
    if (dialogMode === 'add') {
      // Implement add logic
      setToastMessage('New node added successfully');
    } else {
      // Implement edit logic
      setToastMessage('Node updated successfully');
    }
    setIsDialogOpen(false);
  };

  const generateAiSuggestions = async () => {
    const projectString = JSON.stringify(projectStructure);
    try {
      const suggestions = await generateProjectInsights(`Analyze this project structure and suggest improvements: ${projectString}`);
      setAiSuggestions(suggestions);
      setToastMessage('AI suggestions generated successfully');
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setToastMessage('Failed to generate AI suggestions');
    }
  };

  const generateFileContent = async (fileType: string) => {
    try {
      const content = await generateCodeSnippet(`Generate a sample ${fileType} file content`);
      setNewNodeContent(content);
      setToastMessage('Sample file content generated successfully');
    } catch (error) {
      console.error('Error generating file content:', error);
      setToastMessage('Failed to generate file content');
    }
  };

  const renderTree = (nodes: FileNode[]) => (
    <Tree>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          icon={node.type === 'folder' ? <FiFolder /> : <FiFile />}
          label={
            <div className={styles.treeItemLabel}>
              <span>{node.name}</span>
              <div className={styles.treeItemActions}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => handleEditNode(node)}>
                      <FiEdit />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteNode(node.id)}>
                      <FiTrash2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                {node.type === 'folder' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleAddNode(node.id)}>
                        <FiPlus />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          }
          onClick={() => handleNodeSelect(node)}
        >
          {node.children && renderTree(node.children)}
        </TreeItem>
      ))}
    </Tree>
  );

  return (
    <ToastProvider>
      <TooltipProvider>
        <Card className={styles.codeProjectStructure}>
          <CardHeader>
            <CardTitle>Code Project Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.structureContainer}>
              <div className={styles.treeView}>
                <ScrollArea className={styles.scrollArea}>
                  {renderTree(projectStructure)}
                </ScrollArea>
                <Button onClick={() => handleAddNode(null)} className={styles.addRootButton}>
                  <FiPlus /> Add Root Node
                </Button>
              </div>
              <div className={styles.preview}>
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">File Content</TabsTrigger>
                    <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content">
                    {selectedNode && selectedNode.type === 'file' ? (
                      <CodePreview
                        code={selectedNode.content || ''}
                        language="javascript"
                      />
                    ) : (
                      <p>Select a file to view its content</p>
                    )}
                  </TabsContent>
                  <TabsContent value="suggestions">
                    <ScrollArea className={styles.scrollArea}>
                      <pre>{aiSuggestions}</pre>
                    </ScrollArea>
                    <Button onClick={generateAiSuggestions} className={styles.generateButton}>
                      <FiRefreshCw /> Generate Suggestions
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Alert>
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Use AI suggestions to optimize your project structure and improve code organization.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === 'add' ? 'Add New Node' : 'Edit Node'}</DialogTitle>
            </DialogHeader>
            <div className={styles.dialogForm}>
              <Input
                placeholder="Node name"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
              />
              <Textarea
                placeholder="File content (for files only)"
                value={newNodeContent}
                onChange={(e) => setNewNodeContent(e.target.value)}
              />
              <Button onClick={() => generateFileContent('JavaScript')}>
                <FiCode /> Generate Sample Content
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleDialogSubmit}>
                {dialogMode === 'add' ? 'Add' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toastMessage && (
          <Toast
            title="Notification"
            description={toastMessage}
            onOpenChange={(open) => {
              if (!open) setToastMessage('');
            }}
          />
        )}
        <ToastViewport />
      </TooltipProvider>
    </ToastProvider>
  );
};

export default CodeProjectStructure;