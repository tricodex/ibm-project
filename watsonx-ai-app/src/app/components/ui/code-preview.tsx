// src/components/ui/code-preview.tsx
"use client"

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodePreviewProps {
  html: string
  css: string
  js: string
  preview: React.ReactNode
}

export function CodePreview({ html, css, js, preview }: CodePreviewProps) {
  const [copied, setCopied] = useState<'html' | 'css' | 'js' | null>(null)

  const onCopy = async (type: 'html' | 'css' | 'js', code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="rounded-lg border bg-background shadow">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Preview</h3>
        <div className="mt-2">{preview}</div>
      </div>
      <Tabs defaultValue="html" className="p-4">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="js">JavaScript</TabsTrigger>
        </TabsList>
        <TabsContent value="html">
          <CodeBlock code={html} language="html" onCopy={() => onCopy('html', html)} copied={copied === 'html'} />
        </TabsContent>
        <TabsContent value="css">
          <CodeBlock code={css} language="css" onCopy={() => onCopy('css', css)} copied={copied === 'css'} />
        </TabsContent>
        <TabsContent value="js">
          <CodeBlock code={js} language="javascript" onCopy={() => onCopy('js', js)} copied={copied === 'js'} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  language: string
  onCopy: () => void
  copied: boolean
}

function CodeBlock({ code, language, onCopy, copied }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className={cn(
        "px-4 py-3 font-mono text-sm rounded bg-muted overflow-x-auto",
        language === 'html' && "language-html",
        language === 'css' && "language-css",
        language === 'javascript' && "language-javascript"
      )}>
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={onCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}