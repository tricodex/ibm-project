import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FiSend, FiRefreshCw } from 'react-icons/fi'
import styles from './AIAssistant.module.css' // Assuming you create a CSS module for styling

interface AIAssistantProps {
  onGenerateInsights: (prompt: string) => Promise<string>
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerateInsights }) => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const responseEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const insight = await onGenerateInsights(prompt)
      setResponse(insight)
    } catch (error) {
      console.error('Error generating insights:', error)
      setResponse('Failed to generate insights. Please try again.')
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [response])

  return (
    <Card className={styles.aiAssistantCard}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={styles.textarea}
            rows={4}
          />
          <Button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? (
              <>
                <FiRefreshCw className={styles.loadingIcon} /> Generating...
              </>
            ) : (
              <>
                <FiSend className={styles.sendIcon} /> Generate Insights
              </>
            )}
          </Button>
        </form>
        {response && (
          <div className={styles.responseContainer}>
            <h3 className={styles.responseTitle}>AI Response:</h3>
            <p className={styles.responseText}>{response}</p>
            <div ref={responseEndRef} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
