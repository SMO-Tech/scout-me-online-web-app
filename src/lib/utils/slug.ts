/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Creates a player profile URL with slug
 * Format: /dashboard/scouting-profiles/{player-name-slug}-{player-id}
 * @param name - Player name
 * @param id - Player ID
 * @returns URL path with slug
 */
export function createPlayerUrl(name: string, id: string): string {
  const slug = createSlug(name);
  return `/dashboard/scouting-profiles/${slug}-${id}`;
}

/**
 * Creates a club profile URL with slug
 * Format: /dashboard/clubs/{club-name-slug}-{club-id}
 * @param name - Club name
 * @param id - Club ID
 * @returns URL path with slug
 */
export function createClubUrl(name: string, id: string): string {
  const slug = createSlug(name);
  return `/dashboard/clubs/${slug}-${id}`;
}

/**
 * Creates a match detail URL with slug
 * Format: /dashboard/matches/{match-title-slug}-{match-id}
 * @param title - Match title or description
 * @param id - Match ID
 * @returns URL path with slug
 */
export function createMatchUrl(title: string, id: string): string {
  const slug = createSlug(title);
  return `/dashboard/matches/${slug}-${id}`;
}

/**
 * Extracts ID from a slug-based URL (works for players, clubs, matches, etc.)
 * @param slugOrId - The slug (e.g., "john-doe-123") or ID from URL
 * @returns The ID (UUID)
 */
export function extractId(slugOrId: string): string {
  // If it's a UUID format (contains dashes in UUID pattern), return as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)) {
    return slugOrId;
  }
  
  // Otherwise, extract ID from slug-id format
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (5 parts)
  // Slug format: name-part1-part2-part3-part4-part5
  // We need to extract the last 5 hyphen-separated parts
  const parts = slugOrId.split('-');
  
  // If we have at least 5 parts, the last 5 parts should be the UUID
  if (parts.length >= 5) {
    // Try to match UUID pattern from the end
    // UUID pattern: 8-4-4-4-12 characters
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // Check if any 5 consecutive parts form a valid UUID
    for (let i = parts.length - 5; i >= 0; i--) {
      const potentialUuid = parts.slice(i, i + 5).join('-');
      if (uuidPattern.test(potentialUuid)) {
        return potentialUuid;
      }
    }
    
    // Fallback: return last 5 parts joined
    return parts.slice(-5).join('-');
  }
  
  // Fallback: return the original if we can't parse it
  return slugOrId;
}

/**
 * Extracts player ID from a slug-based URL (alias for extractId)
 * @param slugOrId - The slug or ID from URL
 * @returns The player ID
 */
export function extractPlayerId(slugOrId: string): string {
  return extractId(slugOrId);
}

/**
 * Extracts club ID from a slug-based URL
 * @param slugOrId - The slug or ID from URL
 * @returns The club ID
 */
export function extractClubId(slugOrId: string): string {
  return extractId(slugOrId);
}

/**
 * Extracts match ID from a slug-based URL
 * @param slugOrId - The slug or ID from URL
 * @returns The match ID
 */
export function extractMatchId(slugOrId: string): string {
  return extractId(slugOrId);
}

