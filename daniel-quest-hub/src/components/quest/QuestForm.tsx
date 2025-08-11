import React, { useState } from 'react'
import { Quest, QuestPriority } from '@/types/quest'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { calculateXP, generateId } from '@/lib/utils'
import { format } from 'date-fns'

interface QuestFormProps {
  quest?: Quest
  onSave: (quest: Quest) => void
  onCancel: () => void
}

export function QuestForm({ quest, onSave, onCancel }: QuestFormProps) {
  const [formData, setFormData] = useState({
    title: quest?.title || '',
    description: quest?.description || '',
    priority: quest?.priority || 'medium' as QuestPriority,
    dueDate: quest?.dueDate ? format(quest.dueDate, 'yyyy-MM-dd') : '',
    estimatedTime: quest?.estimatedTime?.toString() || '',
    tags: quest?.tags.join(', ') || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required'
    }

    if (formData.estimatedTime && (isNaN(Number(formData.estimatedTime)) || Number(formData.estimatedTime) < 1)) {
      newErrors.estimatedTime = 'Estimated time must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const questData: Quest = {
      id: quest?.id || generateId(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: quest?.status || 'active',
      xpReward: calculateXP(formData.priority),
      createdAt: quest?.createdAt || new Date(),
      completedAt: quest?.completedAt,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags,
      estimatedTime: formData.estimatedTime ? Number(formData.estimatedTime) : undefined,
    }

    onSave(questData)
  }

  const priorityOptions = [
    { value: 'low', label: '🟢 Low - Easy quest (10 XP)' },
    { value: 'medium', label: '🟡 Medium - Normal quest (25 XP)' },
    { value: 'high', label: '🟠 High - Challenging quest (50 XP)' },
    { value: 'critical', label: '🔴 Critical - Epic quest (100 XP)' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
          Quest Title *
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter your quest title..."
          className={errors.title ? 'border-red-400' : ''}
        />
        {errors.title && (
          <p className="text-red-400 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your quest... (optional)"
          rows={3}
          className="flex w-full rounded-lg border border-gaming-border bg-gaming-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gaming-bg disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-1">
          Priority Level
        </label>
        <Select
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as QuestPriority }))}
          options={priorityOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-text-primary mb-1">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-text-primary mb-1">
            Estimated Time (min)
          </label>
          <Input
            id="estimatedTime"
            type="number"
            min="1"
            value={formData.estimatedTime}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
            placeholder="30"
            className={errors.estimatedTime ? 'border-red-400' : ''}
          />
          {errors.estimatedTime && (
            <p className="text-red-400 text-xs mt-1">{errors.estimatedTime}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-text-primary mb-1">
          Tags
        </label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="work, personal, urgent (separate with commas)"
        />
        <p className="text-text-secondary text-xs mt-1">
          Separate multiple tags with commas
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="gaming"
        >
          {quest ? 'Update Quest' : 'Create Quest'}
        </Button>
      </div>
    </form>
  )
}