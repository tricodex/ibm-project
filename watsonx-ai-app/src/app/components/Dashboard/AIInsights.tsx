import React from 'react'
import { RefreshCcwIcon } from 'lucide-react'

interface AIInsightsProps {
  insight: string
  onRefresh: () => void
  isLoading: boolean
}

const AIInsights: React.FC<AIInsightsProps> = ({ insight, onRefresh, isLoading }) => {
  return (
    <div className="mt-8 bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">AI Insights</h2>
        <button
          onClick={onRefresh}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          <RefreshCcwIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : insight ? (
          <p className="text-gray-700 dark:text-gray-300">{insight}</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No insights available. Click refresh to generate.</p>
        )}
      </div>
    </div>
  )
}

export default AIInsights