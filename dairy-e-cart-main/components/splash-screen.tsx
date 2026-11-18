'use client'

import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShow(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  const word1 = "Padma".split("")
  const word2 = "Dairy".split("")

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950 transition-opacity duration-500">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
          {word1.map((char, index) => (
            <span
              key={`w1-${index}`}
              className="animate-letter text-green-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
          {word2.map((char, index) => (
            <span
              key={`w2-${index}`}
              className="animate-letter text-white"
              style={{ animationDelay: `${(word1.length + index) * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Loading Bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full w-full rounded-full bg-green-500"
            style={{ animation: 'sweep 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </div>
  )
}
