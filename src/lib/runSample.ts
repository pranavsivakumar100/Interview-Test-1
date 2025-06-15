import { processEntries } from './sampleFunction.js';
import { VoiceEntry } from './types.js';

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
];

const result = processEntries(mockEntries);
console.log(JSON.stringify(result, null, 2));
