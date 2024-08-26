'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative z-10">
        <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6">
          <Link href='\' className="flex items-center">
            <div className="w-11 h-11 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold mr-3">
              <Image
                src="/granix6.png"
                alt="Granix"
                width={40}
                height={40}
              />
            </div>
            <h1 className="app-name">granix</h1>
          </Link>
        </header>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <main className="container mx-auto px-4 py-8">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-center">About Granix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <Avatar className="h-24 w-24 mr-6">
                    <AvatarImage src="/patrick-camara.jpeg" alt="Patrick Camara" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">Patrick Camara</h2>
                    <p className="text-gray-600">Full Stack AI Developer</p>
                    <p className="text-gray-600">AI: Cognitive Science, MSc, Vrije Universiteit Amsterdam</p>
                    <p className="text-gray-600">Psychology, BSc, Vrije Universiteit Amsterdam</p>

                    <div className="flex mt-2">
                      <Badge variant="secondary" className="mr-2">AI-Powered Project Management</Badge>
                      <Badge variant="secondary" className="mr-2">IBM Watson Integration</Badge>
                      <Badge variant="secondary">Collaborative Coding</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-lg mb-4">
                  Granix is a revolutionary AI-powered project management platform designed to elevate your coding projects. Built on the foundation of IBM&apos;s Granite models, Granix seamlessly integrates AI-driven insights, collaborative tools, and intuitive project management to transform your development workflow. Our mission is to make complex project management simple, efficient, and intelligent.
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="vision" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vision">Vision</TabsTrigger>
                <TabsTrigger value="features">Key Features</TabsTrigger>
                <TabsTrigger value="philosophy">AI Philosophy</TabsTrigger>
              </TabsList>
              <TabsContent value="vision">
                <Card>
                  <CardHeader>
                    <CardTitle>Revolutionizing Project Management with AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Granix envisions a future where AI seamlessly integrates into every aspect of project management, from task allocation to code review. We aim to empower developers and project managers with intelligent insights, predictive analytics, and automated workflows that adapt to each team&apos;s unique needs.</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" className="mt-4">Explore Granix</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Discover how Granix can transform your projects</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Innovative Project Management Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>AI-powered task breakdown and estimation</li>
                      <li>Intelligent code review and suggestions</li>
                      <li>Predictive project timelines and resource allocation</li>
                      <li>Collaborative real-time coding environment</li>
                      <li>Automated documentation and knowledge base generation</li>
                    </ul>
                    <Progress value={75} className="mt-4" />
                    <p className="text-sm text-gray-600 mt-2">Platform Development: 75% Complete</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="philosophy">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-First Approach to Project Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>At the core of Granix is our AI-first philosophy, leveraging the power of IBM&apos;s Granite models to revolutionize project management:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Adaptive AI that learns from your team&apos;s patterns and preferences</li>
                      <li>Ethical AI implementation ensuring fairness and transparency</li>
                      <li>Continuous learning and improvement through user feedback</li>
                      <li>Seamless integration of AI across all project stages</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Join the AI-Powered Project Management Revolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Granix is more than just a project management tool; it&apos;s a paradigm shift in how we approach software development. We&apos;re pushing the boundaries of AI integration in project management, and we invite developers, project managers, and tech enthusiasts to join us on this exciting journey.</p>
                <Button>
                  <a href="mailto:contact@granix.ai">Get Involved</a>
                </Button>
              </CardContent>
            </Card>
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AboutPage;
