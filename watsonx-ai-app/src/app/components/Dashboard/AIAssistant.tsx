import React, { useState } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { WatsonModelId } from '@/constants/watsonModels';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Textarea from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Toast, ToastProvider, ToastViewport } from '@/app/components/ui/toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/app/components/ui/tooltip';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodePreview } from '@/components/ui/code-preview';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FiCode, FiCpu, FiList, FiClock, FiTool, FiBriefcase, FiZap, FiSettings } from 'react-icons/fi';

interface AIAssistantProps {
  onGenerateInsights: (context: string, modelId?: WatsonModelId) => Promise<string>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerateInsights }) => {
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
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <CardTitle className="text-2xl font-bold flex items-center">
            <FiCpu className="mr-2" /> AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-2 bg-gray-800 p-1 rounded-lg">
              {[
                { value: 'code', icon: FiCode, label: 'Code' },
                { value: 'suggestions', icon: FiCpu, label: 'Suggestions' },
                { value: 'insights', icon: FiZap, label: 'Insights' },
                { value: 'tasks', icon: FiList, label: 'Tasks' },
                { value: 'duration', icon: FiClock, label: 'Duration' },
                { value: 'techstack', icon: FiTool, label: 'Tech Stack' },
                { value: 'tests', icon: FiBriefcase, label: 'Tests' },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center justify-center p-2 text-sm font-medium transition-all duration-200 ease-in-out"
                >
                  <Icon className="mr-2" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <Textarea
                placeholder={`Enter your ${activeTab} prompt here...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                rows={5}
              />
              
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Advanced Mode</span>
                        <Switch
                          checked={advancedMode}
                          onCheckedChange={setAdvancedMode}
                          className="bg-gray-600"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Toggle Advanced Mode
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {advancedMode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                  <Select value={model} onValueChange={(value: WatsonModelId) => setModel(value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>

                      <SelectItem value="GRANITE_13B_CHAT_V2">ibm/granite-13b-chat-v2</SelectItem>
                      <SelectItem value="GRANITE_13B_INSTRUCT_V2">ibm/granite-13b-instruct-v2</SelectItem>
                      <SelectItem value="GRANITE_20B_MULTILINGUAL">ibm/granite-20b-multilingual</SelectItem>
                      <SelectItem value="GRANITE_3B_CODE_INSTRUCT">ibm/granite-3b-code-instruct</SelectItem>
                      <SelectItem value="GRANITE_8B_CODE_INSTRUCT">ibm/granite-8b-code-instruct</SelectItem>
                      <SelectItem value="GRANITE_20B_CODE_INSTRUCT">ibm/granite-20b-code-instruct</SelectItem>
                      <SelectItem value="GRANITE_34B_CODE_INSTRUCT">ibm/granite-34b-code-instruct</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Max Tokens: {maxTokens}</label>
                    <Slider
                      min={1}
                      max={1000}
                      step={1}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                      className="bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Temperature: {temperature.toFixed(2)}</label>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="bg-gray-700"
                    />
                  </div>
                </div>
              )}

              <ScrollArea className="h-[300px] border border-gray-700 rounded-lg p-4 bg-gray-800">
                {activeTab === 'code' ? (
                  <CodePreview
                    html={output}
                    css=""
                    js=""
                    preview={<div dangerouslySetInnerHTML={{ __html: output }} />}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-gray-300">{output}</pre>
                )}
              </ScrollArea>

              <div className="flex justify-end space-x-2">
                <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700">Copy</Button>
                <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-700">Save</Button>
                <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700">Export</Button>
                <Button onClick={() => handleOpenDialog('AI Output Details', output)} className="bg-blue-600 hover:bg-blue-700">View Details</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-800 p-4">
          <Alert x className="bg-blue-900 border-blue-700 text-white">
            <AlertTitle className="font-bold">AI Assistant Tips</AlertTitle>
            <AlertDescription>
              Use clear and specific prompts for better results. Experiment with different models and settings in advanced mode.
            </AlertDescription>
          </Alert>
        </CardFooter>

        <Accordion type="single" collapsible className="bg-gray-800 rounded-b-xl">
          <AccordionItem value="history">
            <AccordionTrigger className="px-6 py-4 text-white hover:bg-gray-700">View Generation History</AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-gray-700">
              <p className="text-gray-300">Your generation history will appear here.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px]">
            <pre className="whitespace-pre-wrap text-sm text-gray-300">{dialogContent.content}</pre>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toastMessage && (
        <Toast className="bg-gray-800 text-white border border-gray-700">
          <p>{toastMessage}</p>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default AIAssistant;