import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface CalendarProps {
  onSelectDate: (date: Date) => void
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

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
    onSelectDate(selectedDate)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100" title="Previous month">
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100" title="Next month">
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-gray-500 font-medium">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="text-center py-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`text-center py-2 rounded-full hover:bg-blue-100 ${
                isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
              }`}
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