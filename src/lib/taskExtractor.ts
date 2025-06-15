import { ExtractedTask, VoiceEntry } from './types.js';

// Patterns for task detection
const actionVerbs = [
  'need', 'call', 'schedule', 'book', 'meet', 'buy', 'send', 'email',
  'remind', 'check', 'follow', 'complete', 'finish', 'start', 'prepare',
  'organize', 'plan', 'arrange', 'set', 'make', 'do', 'get', 'find'
];

const temporalIndicators = [
  'tomorrow', 'next week', 'today', 'tonight', 'this week',
  'next month', 'next year', 'this month', 'this year',
  'in a week', 'in a month', 'in a year'
];

const categories = [
  'work', 'personal', 'health', 'finance', 'home', 'social',
  'shopping', 'travel', 'education', 'other'
];

/**
 * Extracts a date from text using temporal indicators
 */
function extractDate(text: string): string | null {
  const lowerText = text.toLowerCase();
  for (const indicator of temporalIndicators) {
    if (lowerText.includes(indicator)) {
      const date = new Date();
      if (indicator === 'tomorrow') {
        date.setDate(date.getDate()+1);
      } else if (indicator === 'next week') {
        date.setDate(date.getDate()+7);
      } else if (indicator === 'next month') {
        date.setMonth(date.getMonth()+1);
      } else if (indicator === 'next year') {
        date.setFullYear(date.getFullYear() + 1);
      }
      return date.toISOString().split('T')[0];
    }
  }
  return null;
}

/**
 * Determines the category of a task based on keywords and tags
 */
function determineCategory(text: string, tags: string[]): string | null {
  // First check tags
  for (const tag of tags) {
    if (categories.includes(tag)) {
      return tag;
    }
  }

  // Then check text content
  const lowerText = text.toLowerCase();
  for (const category of categories) {
    if (lowerText.includes(category)) {
      return category;
    }
  }
  return null;
}

/**
 * Extracts tasks from a given text
 */
export function extractTasksFromText(text: string, entryId: string, tags: string[] = []): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    
    // Check if sentence contains any action verbs
    const hasActionVerb = actionVerbs.some(verb => lowerSentence.includes(verb));
    
    if (hasActionVerb) {
      const task: ExtractedTask = {
        task_text: sentence.trim(),
        due_date: extractDate(sentence),
        status: 'pending',
        category: determineCategory(sentence, tags),
        source_entry_id: entryId
      };
      tasks.push(task);
    }
  }

  return tasks;
} 