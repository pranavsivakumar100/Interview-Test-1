import { extractTasksFromText } from './taskExtractor.js'
import { VoiceEntry, ProcessedResult, ExtractedTask } from './types.js'

/**
 * processEntries
 * --------------
 * PURE function — no IO, no mutation, deterministic.
 * Processes voice entries to extract tasks and analyze tags.
 */
export function processEntries(entries: VoiceEntry[]): ProcessedResult {
  const tagFrequencies: Record<string, number> = {}
  const extractedTasks: ExtractedTask[] = []

  for (const entry of entries) {
    // Process tags
    for (const tag of entry.tags_user) {
      tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1
    }

    // Extract tasks from transcript
    const tasks = extractTasksFromText(entry.transcript_user, entry.id, entry.tags_user)
    extractedTasks.push(...tasks)
  }

  return {
    summary: `Analyzed ${entries.length} entries, found ${extractedTasks.length} tasks`,
    tagFrequencies,
    extractedTasks
  }
}

export default processEntries 