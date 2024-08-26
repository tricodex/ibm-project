// src/app/components/Dashboard/AIAssistant.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { WatsonModelId } from '@/constants/watsonModels';
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodePreview } from '@/components/ui/code-preview';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FiCode, FiCpu, FiList, FiClock, FiTool, FiBriefcase, FiZap } from 'react-icons/fi';
import styles from './AIAssistant.module.css';

const AIAssistant: React.FC = () => {
  const {
    generateCodeSnippet,
    getCodeSuggestions,
    generateProjectInsights,
    generateTaskBreakdown,
    estimateProjectDuration,
    suggestTechStack,
    generateTestCases,
    isLoading,
  } = useWatson();

  const [activeTab, setActiveTab] = useState('code');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [model, setModel] = useState<WatsonModelId>('GRANITE_13B_CHAT_V2');
  const [maxTokens, setMaxTokens] = useState(200);
  const [temperature, setTemperature] = useState(0.7);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '' });

  const handleGenerate = async () => {
    setOutput('');
    let result = '';
    try {
      switch (activeTab) {
        case 'code':
          result = await generateCodeSnippet(input, model);
          break;
        case 'suggestions':
          result = await getCodeSuggestions(input, model);
          break;
        case 'insights':
          result = await generateProjectInsights(input, model);
          break;
        case 'tasks':
          result = await generateTaskBreakdown(input, model);
          break;
        case 'duration':
          result = await estimateProjectDuration(input.split(','), model);
          break;
        case 'techstack':
          result = await suggestTechStack(input, model);
          break;
        case 'tests':
          result = await generateTestCases(input, model);
          break;
      }
      setOutput(result);
      setToastMessage('AI generation completed successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      setToastMessage('An error occurred during AI generation.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setToastMessage('Output copied to clipboard!');
  };

  const handleSave = () => {
    // Implement saving logic (e.g., to local storage or backend)
    setToastMessage('Output saved successfully!');
  };

  const handleExport = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_output_${activeTab}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMessage('Output exported successfully!');
  };

  const handleOpenDialog = (title: string, content: string) => {
    setDialogContent({ title, content });
    setIsDialogOpen(true);
  };

  return (
    <ToastProvider>
      <TooltipProvider>
        <Card className={styles.aiAssistant}>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="code"><FiCode /> Code Generation</TabsTrigger>
                <TabsTrigger value="suggestions"><FiCpu /> Code Suggestions</TabsTrigger>
                <TabsTrigger value="insights"><FiZap /> Project Insights</TabsTrigger>
                <TabsTrigger value="tasks"><FiList /> Task Breakdown</TabsTrigger>
                <TabsTrigger value="duration"><FiClock /> Duration Estimation</TabsTrigger>
                <TabsTrigger value="techstack"><FiTool /> Tech Stack Suggestion</TabsTrigger>
                <TabsTrigger value="tests"><FiBriefcase /> Test Case Generation</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <Textarea
                  placeholder={`Enter your ${activeTab} prompt here...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={styles.input}
                />
                
                <div className={styles.controls}>
                  <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate'}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        checked={advancedMode}
                        onCheckedChange={setAdvancedMode}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Toggle Advanced Mode
                    </TooltipContent>
                  </Tooltip>
                </div>

                {advancedMode && (
                  <div className={styles.advancedControls}>
                    <Select value={model} onValueChange={(value: WatsonModelId) => setModel(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GRANITE_13B_CHAT_V2">GRANITE 13B Chat V2</SelectItem>
                        <SelectItem value="GRANITE_13B_INSTRUCT_V1">GRANITE 13B Instruct V1</SelectItem>
                        {/* Add other model options */}
                      </SelectContent>
                    </Select>
                    <div>
                      <label>Max Tokens: {maxTokens}</label>
                      <Slider
                        min={1}
                        max={1000}
                        step={1}
                        value={[maxTokens]}
                        onValueChange={(value) => setMaxTokens(value[0])}
                      />
                    </div>
                    <div>
                      <label>Temperature: {temperature.toFixed(2)}</label>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[temperature]}
                        onValueChange={(value) => setTemperature(value[0])}
                      />
                    </div>
                  </div>
                )}

                <ScrollArea className={styles.outputArea}>
                  {activeTab === 'code' ? (
                    <CodePreview
                      code={output}
                      language="javascript"
                      onCopy={handleCopy}
                    />
                  ) : (
                    <pre>{output}</pre>
                  )}
                </ScrollArea>

                <div className={styles.actions}>
                  <Button onClick={handleCopy}>Copy</Button>
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={handleExport}>Export</Button>
                  <Button onClick={() => handleOpenDialog('AI Output Details', output)}>View Details</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Alert>
              <AlertTitle>AI Assistant Tips</AlertTitle>
              <AlertDescription>
                Use clear and specific prompts for better results. Experiment with different models and settings in advanced mode.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

        <Accordion type="single" collapsible>
          <AccordionItem value="history">
            <AccordionTrigger>View Generation History</AccordionTrigger>
            <AccordionContent>
              {/* Implement history logic here */}
              <p>Your generation history will appear here.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogContent.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className={styles.dialogContent}>
              <pre>{dialogContent.content}</pre>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
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

export default AIAssistant;