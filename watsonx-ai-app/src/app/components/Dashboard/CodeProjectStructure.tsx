import React, { useState, useEffect } from 'react';
import { useWatson } from '@/hooks/useWatson';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToastProvider, Toast } from '@/components/ui/toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tree } from '@/components/ui/tree';
import { CodePreview } from '@/components/ui/code-preview';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FiPlus, FiCode, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';

// Define the structure of the FileNode and AISuggestion interfaces
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface AISuggestion {
  type: 'add' | 'modify' | 'delete';
  path: string;
  content?: string;
  reason: string;
}

// Main component for managing and displaying the code project structure
const CodeProjectStructure: React.FC = () => {
  // Custom hook for AI functionality
  const { generateProjectInsights, generateCodeSnippet } = useWatson();
  
  // State variables to manage the project structure, selected node, AI suggestions, and more
  const [projectStructure, setProjectStructure] = useState<FileNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  // Effect to initialize the project structure on component mount
  useEffect(() => {
    // Mock initial project structure - replace with actual data fetching
    setProjectStructure([
      {
        id: '1',
        name: 'src',
        type: 'folder',
        children: [
          {
            id: '2',
            name: 'index.js',
            type: 'file',
            content: `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';
    import './styles/main.css';
    
    ReactDOM.render(<App />, document.getElementById('root'));
            `,
          },
          {
            id: '3',
            name: 'App.js',
            type: 'file',
            content: `
    import React from 'react';
    import Header from './components/Header';
    import Footer from './components/Footer';
    import './styles/app.css';
    
    function App() {
      return (
        <div className="app">
          <Header />
          <main>
            <h1>Welcome to My App</h1>
          </main>
          <Footer />
        </div>
      );
    }
    
    export default App;
            `,
          },
          {
            id: '4',
            name: 'styles',
            type: 'folder',
            children: [
              {
                id: '5',
                name: 'main.css',
                type: 'file',
                content: `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
                `,
              },
              {
                id: '6',
                name: 'app.css',
                type: 'file',
                content: `
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    main {
      flex: 1;
    }
                `,
              },
            ],
          },
          {
            id: '7',
            name: 'components',
            type: 'folder',
            children: [
              {
                id: '8',
                name: 'Header.js',
                type: 'file',
                content: `
    import React from 'react';
    
    function Header() {
      return (
        <header className="header">
          <h1>App Header</h1>
        </header>
      );
    }
    
    export default Header;
                `,
              },
              {
                id: '9',
                name: 'Footer.js',
                type: 'file',
                content: `
    import React from 'react';
    
    function Footer() {
      return (
        <footer className="footer">
          <p>© 2024 My App</p>
        </footer>
      );
    }
    
    export default Footer;
                `,
              },
              {
                id: '10',
                name: 'Sidebar.js',
                type: 'file',
                content: `
    import React from 'react';
    
    function Sidebar() {
      return (
        <aside className="sidebar">
          <nav>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </nav>
        </aside>
      );
    }
    
    export default Sidebar;
                `,
              },
            ],
          },
          {
            id: '11',
            name: 'utils',
            type: 'folder',
            children: [
              {
                id: '12',
                name: 'api.js',
                type: 'file',
                content: `
    export async function fetchData(endpoint) {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
                `,
              },
              {
                id: '13',
                name: 'helpers.js',
                type: 'file',
                content: `
    export function formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date));
    }
                `,
              },
            ],
          },
          {
            id: '14',
            name: 'config',
            type: 'folder',
            children: [
              {
                id: '15',
                name: 'constants.js',
                type: 'file',
                content: `
    export const API_BASE_URL = 'https://api.example.com';
    export const APP_NAME = 'My App';
                `,
              },
              {
                id: '16',
                name: 'routes.js',
                type: 'file',
                content: `
    export const ROUTES = {
      HOME: '/',
      ABOUT: '/about',
      CONTACT: '/contact',
    };
                `,
              },
            ],
          },
          {
            id: '17',
            name: 'assets',
            type: 'folder',
            children: [
              {
                id: '18',
                name: 'images',
                type: 'folder',
                children: [
                  {
                    id: '19',
                    name: 'logo.png',
                    type: 'file',
                    content: '', // Binary files like images would not have content represented here
                  },
                ],
              },
              {
                id: '20',
                name: 'fonts',
                type: 'folder',
                children: [
                  {
                    id: '21',
                    name: 'Roboto-Regular.ttf',
                    type: 'file',
                    content: '', // Binary files like fonts would not have content represented here
                  },
                ],
              },
            ],
          },
          {
            id: '22',
            name: 'tests',
            type: 'folder',
            children: [
              {
                id: '23',
                name: 'App.test.js',
                type: 'file',
                content: `
    import { render, screen } from '@testing-library/react';
    import App from '../App';
    
    test('renders welcome message', () => {
      render(<App />);
      const welcomeElement = screen.getByText(/Welcome to My App/i);
      expect(welcomeElement).toBeInTheDocument();
    });
                `,
              },
            ],
          },
        ],
      },
      {
        id: '24',
        name: 'package.json',
        type: 'file',
        content: `
    {
      "name": "my-project",
      "version": "1.0.0",
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      },
      "dependencies": {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "react-scripts": "5.0.0"
      },
      "devDependencies": {
        "@testing-library/react": "^12.0.0"
      }
    }
        `,
      },
      {
        id: '25',
        name: '.gitignore',
        type: 'file',
        content: `
    /node_modules
    /build
    /.env
        `,
      },
      {
        id: '26',
        name: 'README.md',
        type: 'file',
        content: `
    # My Project
    
    This is a React project with a well-structured architecture.
    
    ## Available Scripts
    
    - \`npm start\`: Runs the app in development mode.
    - \`npm run build\`: Builds the app for production.
    - \`npm test\`: Launches the test runner.
    - \`npm run eject\`: Ejects the app from the default configuration.
    
    ## Folder Structure
    
    - \`src/\`: Source code.
    - \`src/components/\`: Reusable UI components.
    - \`src/utils/\`: Utility functions.
    - \`src/config/\`: Configuration files.
    - \`src/assets/\`: Static assets like images and fonts.
    - \`src/tests/\`: Unit tests.
        `,
      },
    ]);
    
  }, []);

  // Function to handle selection of a node in the project tree
  const handleNodeSelect = (node: FileNode) => {
    setSelectedNode(node);
  };

  // Function to open the dialog for adding a new node
  const handleAddNode = (parentId: string | null) => {
    setDialogMode('add');
    setNewNodeName('');
    setNewNodeContent('');
    setIsDialogOpen(true);
  };

  // Function to open the dialog for editing an existing node
  const handleEditNode = (node: FileNode) => {
    setDialogMode('edit');
    setSelectedNode(node);
    setNewNodeName(node.name);
    setNewNodeContent(node.content || '');
    setIsDialogOpen(true);
  };

  // Function to handle the deletion of a node
  const handleDeleteNode = (nodeId: string) => {
    // Implement delete logic here
    setToastMessage('Node deleted successfully');
  };

  // Function to submit the dialog form for adding or editing a node
  const handleDialogSubmit = () => {
    if (dialogMode === 'add') {
      // Implement add logic here
      setToastMessage('New node added successfully');
    } else {
      // Implement edit logic here
      setToastMessage('Node updated successfully');
    }
    setIsDialogOpen(false);
  };

  // Function to generate AI suggestions for improving the project structure
  const generateAiSuggestions = async () => {
    const projectString = JSON.stringify(projectStructure);
    const systemPrompt = `
      You are an AI assistant specialized in analyzing and optimizing code project structures.
      Given a JSON representation of a project structure, provide suggestions for improvements.
      Your suggestions should be in the following JSON format:
      [
        {
          "type": "add" | "modify" | "delete",
          "path": "path/to/file/or/folder",
          "content": "New or modified content (for add or modify operations)",
          "reason": "Explanation for the suggestion"
        }
      ]
      Limit your response to a maximum of 5 suggestions.
      Focus on improving project organization, following best practices, and enhancing overall code quality.
    `;
    
    try {
      const suggestions = await generateProjectInsights(
        `Analyze this project structure and suggest improvements: ${projectString}`,
        'GRANITE_13B_INSTRUCT_V2',
        systemPrompt
      );
      const parsedSuggestions: AISuggestion[] = JSON.parse(suggestions);
      setAiSuggestions(parsedSuggestions);
      setToastMessage('AI suggestions generated successfully');
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setToastMessage('Failed to generate AI suggestions');
    }
  };

  // Function to generate sample file content using AI
  const generateFileContent = async (fileType: string) => {
    const systemPrompt = `
      You are an AI assistant specialized in generating sample code files.
      Create a realistic and well-structured ${fileType} file with best practices and common patterns.
      Include comments explaining key parts of the code.
    `;

    try {
      const content = await generateCodeSnippet(
        `Generate a sample ${fileType} file content`,
        'GRANITE_34B_CODE_INSTRUCT',
        systemPrompt
      );
      setNewNodeContent(content);
      setToastMessage('Sample file content generated successfully');
    } catch (error) {
      console.error('Error generating file content:', error);
      setToastMessage('Failed to generate file content');
    }
  };

  // Function to apply an AI-generated suggestion
  const applySuggestion = (suggestion: AISuggestion) => {
    // Implement logic to apply the suggestion to the project structure
    console.log('Applying suggestion:', suggestion);
    setToastMessage(`Applied suggestion: ${suggestion.type} ${suggestion.path}`);
    // After applying, remove the suggestion from the list
    setAiSuggestions(aiSuggestions.filter(s => s !== suggestion));
  };

  // Function to reject an AI-generated suggestion
  const rejectSuggestion = (suggestion: AISuggestion) => {
    // Remove the suggestion from the list
    setAiSuggestions(aiSuggestions.filter(s => s !== suggestion));
    setToastMessage(`Rejected suggestion: ${suggestion.type} ${suggestion.path}`);
  };

  // Render the component structure
  return (
    <ToastProvider>
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Code Project Structure</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Project Tree Card */}
          <Card className="w-full lg:w-1/3 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Project Tree</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] border border-gray-700 rounded-lg shadow-inner bg-gray-900">
                <Tree 
                  nodes={projectStructure} 
                  onNodeSelect={handleNodeSelect}
                  onNodeAdd={(node) => handleAddNode(node.id)}
                  onNodeEdit={handleEditNode}
                  onNodeDelete={(node) => handleDeleteNode(node.id)}
                />
              </ScrollArea>
              <Button onClick={() => handleAddNode(null)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                <FiPlus className="mr-2" /> Add Root Node
              </Button>
            </CardContent>
          </Card>
          {/* File Viewer and AI Suggestions */}
          <div className="w-full lg:w-2/3">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>File Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content">
                  <TabsList className="mb-4">
                    <TabsTrigger value="content">File Content</TabsTrigger>
                    <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content">
                    {selectedNode && selectedNode.type === 'file' ? (
                      <CodePreview
                        html={selectedNode.content || ''}
                        css=""
                        js=""
                        preview={<div dangerouslySetInnerHTML={{ __html: selectedNode.content || '' }} />}
                      />
                    ) : (
                      <p className="text-gray-400 text-center py-8">Select a file to view its content</p>
                    )}
                  </TabsContent>
                  <TabsContent value="suggestions">
                    <ScrollArea className="h-[300px] border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900">
                      {aiSuggestions.length > 0 ? (
                        aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="mb-4 p-2 bg-gray-800 rounded">
                            <p className="font-semibold">{suggestion.type} {suggestion.path}</p>
                            <p className="text-sm text-gray-300 mt-1">{suggestion.reason}</p>
                            <div className="mt-2 flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => applySuggestion(suggestion)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <FiCheck className="mr-1" /> Apply
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => rejectSuggestion(suggestion)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <FiX className="mr-1" /> Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center">No suggestions available. Generate some!</p>
                      )}
                    </ScrollArea>
                    <Button onClick={generateAiSuggestions} className="w-full bg-green-600 hover:bg-green-700">
                      <FiRefreshCw className="mr-2" /> Generate Suggestions
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alert with instructions */}
        <Alert x className="mt-6 bg-blue-900 border-blue-700">
          <AlertTitle>How to Use AI Suggestions</AlertTitle>
          <AlertDescription>
            1. Click &quot;Generate Suggestions&quot; to get AI-powered improvement ideas for your project structure.
            2. Review each suggestion carefully.
            3. Click &quot;Apply&quot; to implement a suggestion or &quot;Reject&quot; to dismiss it.
            4. Suggestions are based on best practices but use your judgment before applying them.
          </AlertDescription>
        </Alert>

        {/* Dialog for adding/editing nodes */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === 'add' ? 'Add New Node' : 'Edit Node'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
              <Button onClick={() => generateFileContent('JavaScript')} className="w-full bg-purple-600 hover:bg-purple-700">
                <FiCode className="mr-2" /> Generate Sample Content
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleDialogSubmit} className="bg-blue-600 hover:bg-blue-700">
                {dialogMode === 'add' ? 'Add' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Display toast messages */}
        {toastMessage && (
          <Toast>
            <p>{toastMessage}</p>
          </Toast>
        )}
      </div>
    </ToastProvider>
  );
};

export default CodeProjectStructure;
