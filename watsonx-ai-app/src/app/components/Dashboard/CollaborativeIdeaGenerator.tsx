import React, { useState, useEffect } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiUsers, FiZap, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

interface Idea {
  id: string;
  content: string;
  votes: number;
}

const CollaborativeIdeaGenerator: React.FC = () => {
  const { generateText, isLoading } = useWatson();
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [teamFeedback, setTeamFeedback] = useState('');

  const generateIdeas = async () => {
    if (!topic) return;

    const prompt = `Generate 5 innovative ideas for the following project topic: ${topic}
    For each idea, provide:
    1. A brief description
    2. Potential benefits
    3. Possible challenges`;

    const response = await generateText({
      input: prompt,
      modelId: 'GRANITE_13B_CHAT_V2',
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: { max_new_tokens: 500 },
    });

    if (response?.generated_text) {
      const generatedIdeas = response.generated_text.split('\n\n').map((idea, index) => ({
        id: `idea-${index + 1}`,
        content: idea.trim(),
        votes: 0,
      }));
      setIdeas(generatedIdeas);
    }
  };

  const voteIdea = (id: string, value: number) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === id ? { ...idea, votes: idea.votes + value } : idea
      )
    );
  };

  useEffect(() => {
    if (ideas.length > 0) {
      generateTeamFeedback();
    }
  }, [ideas]);

  const generateTeamFeedback = async () => {
    const topIdea = ideas.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
    const prompt = `Based on the following top-voted idea for our ${topic} project:
    ${topIdea.content}
    
    Generate constructive team feedback, including:
    1. Potential improvements
    2. Implementation strategies
    3. Possible risks to consider`;

    const response = await generateText({
      input: prompt,
      modelId: 'GRANITE_13B_CHAT_V2',
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: { max_new_tokens: 300 },
    });

    setTeamFeedback(response?.generated_text || '');
  };

  return (
    <Card title="Collaborative Idea Generator" className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter project topic..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={generateIdeas} disabled={isLoading || !topic}>
          <FiZap className="mr-2" /> Generate Ideas
        </Button>
      </div>
      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm mb-2">{idea.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => voteIdea(idea.id, 1)}>
                  <FiThumbsUp />
                </Button>
                <Button size="sm" onClick={() => voteIdea(idea.id, -1)}>
                  <FiThumbsDown />
                </Button>
                <span className="text-sm font-semibold">{idea.votes} votes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {teamFeedback && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FiUsers className="mr-2" /> AI Team Feedback
          </h3>
          <p className="text-sm">{teamFeedback}</p>
        </div>
      )}
    </Card>
  );
};

export default CollaborativeIdeaGenerator;