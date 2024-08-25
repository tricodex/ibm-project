import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to AI-Powered Coding Dashboard
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Boost your productivity with AI-assisted coding and project management
        </p>
        <div className="flex space-x-4">
          <Link href="/dashboard" passHref>
            <Button size="lg">Get Started</Button>
          </Link>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
        <div className="mt-12">
          <Image
            src="/dashboard-preview.png"
            alt="Dashboard Preview"
            width={800}
            height={450}
            className="rounded-lg shadow-xl"
          />
        </div>
      </main>
    </div>
  )
}

export default LandingPage