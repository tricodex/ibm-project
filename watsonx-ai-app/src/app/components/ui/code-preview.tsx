import React, { useState } from 'react';
import { Eye, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  html: string;
  css: string;
  js: string;
  preview: React.ReactNode;
}

export function CodePreview({ html, css, js, preview }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');

  return (
    <div className="rounded-lg overflow-hidden bg-gray-900 shadow-xl">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'html' | 'css' | 'js')}>
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-gray-700 p-1 rounded-md">
            {[
              { value: 'preview', icon: Eye, label: 'Preview' },
              { value: 'html', icon: Code, label: 'HTML' },
              { value: 'css', icon: Code, label: 'CSS' },
              { value: 'js', icon: Code, label: 'JS' },
              

            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  'flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all duration-200',
                  activeTab === value ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 mr-2" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="relative overflow-hidden">
          {/* <TabsContent value="preview" className={cn("p-4 bg-white dark:bg-gray-800 min-h-[200px]", activeTab === 'preview' ? 'block' : 'hidden')}>
            {preview}
          </TabsContent> */}
          <TabsContent value="preview" className={activeTab === 'preview' ? 'block' : 'hidden'}>
            <Editor height="300px" language="html" theme="vs-dark" value={html} />
          </TabsContent>
          <TabsContent value="html" className={activeTab === 'html' ? 'block' : 'hidden'}>
            <Editor height="300px" language="html" theme="vs-dark" value={html} />
          </TabsContent>
          <TabsContent value="css" className={activeTab === 'css' ? 'block' : 'hidden'}>
            <Editor height="300px" language="css" theme="vs-dark" value={css} />
          </TabsContent>
          <TabsContent value="js" className={activeTab === 'js' ? 'block' : 'hidden'}>
            <Editor height="300px" language="javascript" theme="vs-dark" value={js} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default CodePreview;
