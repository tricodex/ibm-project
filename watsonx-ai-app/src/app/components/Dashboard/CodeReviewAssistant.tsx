import React, { useState, useEffect } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiGitPullRequest, FiAlertCircle, FiCheckCircle, FiCode } from 'react-icons/fi';

interface CodeChange {
  id: string;
  filename: string;
  content: string;
}

const CodeReviewAssistant: React.FC = () => {
  const { generateText, isLoading } = useWatson();
  const [codeChanges, setCodeChanges] = useState<CodeChange[]>([]);
  const [reviewComments, setReviewComments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Simulating fetching code changes from a version control system
    const mockCodeChanges: CodeChange[] = [
      { id: '1', filename: 'app.js', content: 'function getData() { return fetch("/api/data").then(res => res.json()) }' },
      { id: '2', filename: 'utils.js', content: 'const formatDate = (date) => date.toLocaleDateString()' },
      { id: '3', filename: 'styles.css', content: '.button { background-color: #007bff; color: white; padding: 10px 15px; }' },
    ];
    setCodeChanges(mockCodeChanges);
  }, []);

  const reviewCode = async (change: CodeChange) => {
    const prompt = `Review the following code change and provide constructive feedback:
    Filename: ${change.filename}
    Code:
    ${change.content}
    
    Please provide feedback on:
    1. Code quality
    2. Potential bugs or issues
    3. Performance considerations
    4. Suggestions for improvement`;

    const review = await generateText({
      input: prompt,
      modelId: 'GRANITE_13B_CHAT_V2',
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: { max_new_tokens: 300 },
    });

    setReviewComments(prev => ({ ...prev, [change.id]: review?.generated_text || 'No feedback generated.' }));
  };

  const getSeverityIcon = (comment: string) => {
    if (comment.toLowerCase().includes('critical') || comment.toLowerCase().includes('major issue')) {
      return <FiAlertCircle className="text-red-500" />;
    } else if (comment.toLowerCase().includes('minor') || comment.toLowerCase().includes('suggestion')) {
      return <FiCheckCircle className="text-green-500" />;
    } else {
      return <FiCode className="text-yellow-500" />;
    }
  };

  return (
    <Card title="AI Code Review Assistant" className="mb-6">
      <div className="space-y-4">
        {codeChanges.map(change => (
          <div key={change.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FiGitPullRequest className="mr-2" />
                {change.filename}
              </h3>
              <Button onClick={() => reviewCode(change)} disabled={isLoading} size="sm">
                {isLoading ? 'Reviewing...' : 'Review'}
              </Button>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm overflow-x-auto">
              {change.content}
            </pre>
            {reviewComments[change.id] && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                <h4 className="font-semibold flex items-center">
                  {getSeverityIcon(reviewComments[change.id])}
                  <span className="ml-2">AI Review Comments:</span>
                </h4>
                <p className="text-sm mt-1">{reviewComments[change.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CodeReviewAssistant;