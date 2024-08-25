import React from 'react'

interface ProgressBarProps {
  progress: number
  color?: string
  height?: number
  showPercentage?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-blue-500',
  height = 4,
  showPercentage = false,
}) => {
  const percentage = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="relative pt-1">
      <div className={`overflow-hidden h-${height} mb-4 text-xs flex rounded bg-gray-200`}>
        <div
          className={`${color} w-[${percentage}%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center`}
        ></div>
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>{percentage.toFixed(0)}% Complete</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar