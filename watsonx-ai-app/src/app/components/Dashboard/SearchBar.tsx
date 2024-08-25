import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FiSearch } from 'react-icons/fi'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" size="sm">
        <FiSearch className="mr-2" /> Search
      </Button>
    </form>
  )
}