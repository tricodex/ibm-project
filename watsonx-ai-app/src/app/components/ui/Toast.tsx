import React, { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, InfoIcon } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
    error: <XCircleIcon className="h-5 w-5 text-red-400" />,
    info: <InfoIcon className="h-5 w-5 text-blue-400" />,
  }

  const colors = {
    success: 'bg-green-50 dark:bg-green-900 border-green-400',
    error: 'bg-red-50 dark:bg-red-900 border-red-400',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-400',
  }

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 ${colors[type]} rounded-lg shadow dark:text-gray-400`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {icons[type]}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        onClick={() => {
          setIsVisible(false)
          onClose()
        }}
      >
        <span className="sr-only">Close</span>
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Toast