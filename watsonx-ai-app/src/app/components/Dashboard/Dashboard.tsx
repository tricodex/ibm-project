import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Calendar from '@/components/ui/calendar';
import { FiFolder, FiList, FiBarChart2, FiCode, FiStar, FiPlus } from 'react-icons/fi';
import MessageSection from './MessageSection';

const Dashboard: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-slideDown">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Projects Overview */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none animate-slideUp">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FiFolder className="mr-2" /> Projects Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">3 Active Projects</p>
            <Progress value={75} className="mb-2 h-2 bg-blue-300" />
            <p className="text-sm text-blue-200 mb-4">75% overall progress</p>
            <Link href="/projects">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-100">
                <FiPlus className="mr-2" /> New Project
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none animate-slideUp animation-delay-200">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FiList className="mr-2" /> Tasks Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">12 Pending Tasks</p>
            <Progress value={60} className="mb-2 h-2 bg-purple-300" />
            <p className="text-sm text-purple-200 mb-4">60% completed</p>
            <Link href="/tasks">
              <Button className="w-full bg-white text-purple-600 hover:bg-purple-100">
                View All Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Analytics Preview */}
        <Card className="bg-gradient-to-br from-green-600 to-green-800 border-none animate-slideUp animation-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FiBarChart2 className="mr-2" /> Analytics Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">20% Increase</p>
            <p className="text-sm text-green-200 mb-4">in productivity this week</p>
            <Link href="/analytics">
              <Button className="w-full bg-white text-green-600 hover:bg-green-100">
                View Full Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Code Review */}
        <Card className="bg-gradient-to-br from-red-600 to-red-800 border-none animate-slideUp animation-delay-600">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FiCode className="mr-2" /> Code Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">5 Pending Reviews</p>
            <p className="text-sm text-red-200 mb-4">Estimated time: 2 hours</p>
            <Link href="/code-review">
              <Button className="w-full bg-white text-red-600 hover:bg-red-100">
                Start Code Review
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-800 border-none animate-slideUp animation-delay-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FiStar className="mr-2" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-200 mb-4">Get AI-powered insights for your projects</p>
            <Link href="/ai-insights">
              <Button className="w-full bg-white text-yellow-600 hover:bg-yellow-100">
                Generate Insights
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 border-none animate-slideUp animation-delay-1000">
          <CardHeader>
            <CardTitle className="text-white">Project Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              selected={date}
              onSelect={(newDate) => setDate(newDate)}
              className="rounded-md border-indigo-400 text-white"
            />
          </CardContent>
        </Card>
      </div>
        
      {/* Message Section */}
      <div className="mt-8 animate-fadeIn animation-delay-1200">
        <MessageSection />
      </div>
    </div>
  );
};

export default Dashboard;