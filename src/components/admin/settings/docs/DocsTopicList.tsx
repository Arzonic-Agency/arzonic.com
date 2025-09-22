"use client";

import React, { useEffect, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { getAllTopics } from '@/lib/server/actions'

interface Topic {
  id: string
  created_at: string
  title?: string
  description?: string
  [key: string]: any
}

interface DocsTopicListProps {
  onEdit?: (topic: Topic) => void
  t?: (key: string) => string
}

const DocsTopicList = ({ onEdit, t }: DocsTopicListProps) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { topics: topicsData } = await getAllTopics()
        setTopics(topicsData)
      } catch (error) {
        console.error('Error fetching topics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading topics...</div>
  }

  return (
    <div>    
        <ul className="list">
          {topics.map((topic) => (
            <li key={topic.id} className="list-row">
              <div>
                <div className="font-bold">{topic.title || 'Untitled Topic'}</div>
                <div className="text-sm text-gray-500">
                  Created: {new Date(topic.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {topic.description || 'No description'}
                </div>
              </div>
              {onEdit && (
                <button className="btn btn-sm" onClick={() => onEdit(topic)}>
                  <FaPen /> <span className="md:flex hidden">{t?.("edit") || "Edit"}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
        </div>
  )
}

export default DocsTopicList