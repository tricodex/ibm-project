'use client'
import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  selected?: Date | null
  onSelect: (date: Date) => void
  className?: string
}

const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, className }) => {
  const [currentDate, setCurrentDate] = useState(selected || new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onSelect(selectedDate)
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Previous month">
          <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Next month">
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-gray-500 dark:text-gray-400 font-medium">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="text-center py-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
          const isSelected = selected?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={cn(
                "text-center py-2 rounded-full transition-colors",
                isToday ? "bg-blue-500 text-white hover:bg-blue-600" : "",
                isSelected ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-white" : "hover:bg-blue-100 dark:hover:bg-gray-700"
              )}
              title={`Select ${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
