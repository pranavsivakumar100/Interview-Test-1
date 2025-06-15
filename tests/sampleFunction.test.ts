import { describe, it, expect } from 'vitest'
import { processEntries } from '../src/lib/sampleFunction.js'
import { VoiceEntry } from '../src/lib/types.js'

describe('processEntries', () => {
  it('extracts tasks from voice entries', () => {
    const mockEntries: VoiceEntry[] = [
      {
        id: '1',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: 'I need to call my doctor tomorrow',
        transcript_user: 'I need to call my doctor tomorrow',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['health'],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      },
      {
        id: '2',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: 'Remember to buy groceries next week',
        transcript_user: 'Remember to buy groceries next week',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['shopping'],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      }
    ]

    const result = processEntries(mockEntries)

    expect(result.extractedTasks).toHaveLength(2)
    expect(result.extractedTasks[0]).toMatchObject({
      task_text: 'I need to call my doctor tomorrow',
      status: 'pending',
      category: 'health',
      source_entry_id: '1'
    })
    expect(result.extractedTasks[1]).toMatchObject({
      task_text: 'Remember to buy groceries next week',
      status: 'pending',
      category: 'shopping',
      source_entry_id: '2'
    })
  })

  it('handles entries without tasks', () => {
    const mockEntries: VoiceEntry[] = [
      {
        id: '1',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: 'Today was a good day',
        transcript_user: 'Today was a good day',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['reflection'],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      }
    ]

    const result = processEntries(mockEntries)

    expect(result.extractedTasks).toHaveLength(0)
    expect(result.tagFrequencies).toEqual({ reflection: 1 })
  })

  it('extracts multiple tasks from one entry', () => {
    const mockEntries: VoiceEntry[] = [
      {
        id: '3',
        user_id: 'user2',
        audio_url: null,
        transcript_raw: 'I need to call mom. Also, schedule a dentist appointment tomorrow.',
        transcript_user: 'I need to call mom. Also, schedule a dentist appointment tomorrow.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['personal', 'health'],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mockEntries)
    expect(result.extractedTasks).toHaveLength(2)
    expect(result.extractedTasks[0].task_text).toMatch(/call mom/i)
    expect(result.extractedTasks[1].task_text).toMatch(/schedule a dentist appointment tomorrow/i)
    expect(result.extractedTasks[1].due_date).not.toBeNull()
  })

  it('extracts task with category from text only', () => {
    const mockEntries: VoiceEntry[] = [
      {
        id: '4',
        user_id: 'user3',
        audio_url: null,
        transcript_raw: 'Plan my travel for next month',
        transcript_user: 'Plan my travel for next month',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mockEntries)
    expect(result.extractedTasks[0].category).toBe('travel')
    expect(result.extractedTasks[0].due_date).not.toBeNull()
  })

  it('does not extract task if no action verb', () => {
    const mockEntries: VoiceEntry[] = [
      {
        id: '5',
        user_id: 'user4',
        audio_url: null,
        transcript_raw: 'The weather is nice today',
        transcript_user: 'The weather is nice today',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mockEntries)
    expect(result.extractedTasks).toHaveLength(0)
  })

  it('handles empty transcript gracefully', () => {
    const mockEntries: VoiceEntry[] = [
      {
        id: '6',
        user_id: 'user5',
        audio_url: null,
        transcript_raw: '',
        transcript_user: '',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mockEntries)
    expect(result.extractedTasks).toHaveLength(0)
  })
}) 