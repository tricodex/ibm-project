import React from 'react'

interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card