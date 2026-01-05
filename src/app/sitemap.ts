import { MetadataRoute } from 'next'
import axios from 'axios'
import { createPlayerUrl, createClubUrl, createMatchUrl } from '@/lib/utils/slug'

// Base URL for the site
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://scoutme.cloud'

// API base URL
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

interface SitemapEntry {
  url: string
  lastModified?: Date | string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/**
 * Fetches all players from the API (with pagination support)
 */
async function fetchPlayers(): Promise<SitemapEntry[]> {
  try {
    if (!apiBaseUrl) {
      console.warn('API base URL not configured, skipping players in sitemap')
      return []
    }

    const client = axios.create({ 
      baseURL: apiBaseUrl,
      timeout: 10000 // 10 second timeout
    })
    
    const allPlayers: any[] = []
    let cursor: string | null = null
    let hasMore = true
    const maxPages = 50 // Limit to prevent infinite loops
    
    // Fetch players with pagination
    while (hasMore && allPlayers.length < 5000) { // Max 5000 players
      try {
        const url: string = cursor 
          ? `player?limit=100&cursor=${cursor}`
          : `player?limit=100`
        
        const response: any = await client.get(url)
        const data: any[] = response.data?.data || response.data || []
        
        if (Array.isArray(data)) {
          allPlayers.push(...data)
          // Check if there's a next cursor
          cursor = response.data?.nextCursor || response.data?.cursor || null
          hasMore = cursor !== null && data.length === 100
        } else {
          hasMore = false
        }
        
        // Safety check
        if (allPlayers.length / 100 >= maxPages) {
          hasMore = false
        }
      } catch (pageError) {
        console.error('Error fetching players page:', pageError)
        hasMore = false
      }
    }
    
    return allPlayers.map((player: any) => {
      const playerName = player.name || 
        `${player.firstName || ''} ${player.lastName || ''}`.trim() || 
        'player'
      
      return {
        url: `${baseUrl}${createPlayerUrl(playerName, player.id)}`,
        lastModified: player.updatedAt || player.createdAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      }
    })
  } catch (error) {
    console.error('Error fetching players for sitemap:', error)
    return []
  }
}

/**
 * Fetches all clubs from the API
 */
async function fetchClubs(): Promise<SitemapEntry[]> {
  try {
    if (!apiBaseUrl) {
      console.warn('API base URL not configured, skipping clubs in sitemap')
      return []
    }

    const client = axios.create({ 
      baseURL: apiBaseUrl,
      timeout: 10000
    })
    
    const response = await client.get('/club/')
    const clubs = response.data?.data || response.data || []
    
    if (!Array.isArray(clubs)) {
      return []
    }
    
    return clubs.map((club: any) => ({
      url: `${baseUrl}${createClubUrl(club.name || 'club', club.id)}`,
      lastModified: club.updatedAt || club.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  } catch (error) {
    console.error('Error fetching clubs for sitemap:', error)
    return []
  }
}

/**
 * Fetches all matches from the API
 */
async function fetchMatches(): Promise<SitemapEntry[]> {
  try {
    if (!apiBaseUrl) {
      console.warn('API base URL not configured, skipping matches in sitemap')
      return []
    }

    const client = axios.create({ 
      baseURL: apiBaseUrl,
      timeout: 10000
    })
    
    const response = await client.get('/match/all-match')
    const matches = response.data?.data || response.data || []
    
    if (!Array.isArray(matches)) {
      return []
    }
    
    return matches.slice(0, 2000).map((match: any) => { // Limit to 2000 matches
      const homeClub = match.matchClubs?.find((c: any) => c.isUsersTeam)
      const awayClub = match.matchClubs?.find((c: any) => !c.isUsersTeam)
      const matchTitle = `${homeClub?.name || 'Home'} vs ${awayClub?.name || 'Away'}`
      
      return {
        url: `${baseUrl}${createMatchUrl(matchTitle, match.id)}`,
        lastModified: match.updatedAt || match.createdAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6
      }
    })
  } catch (error) {
    console.error('Error fetching matches for sitemap:', error)
    return []
  }
}

/**
 * Generates the sitemap dynamically
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/coaches`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/dashboard/scouting-profiles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/dashboard/clubs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/dashboard/matches`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    }
  ]

  // Fetch dynamic pages in parallel
  const [players, clubs, matches] = await Promise.all([
    fetchPlayers(),
    fetchClubs(),
    fetchMatches()
  ])

  // Combine all entries
  const allEntries: SitemapEntry[] = [
    ...staticPages,
    ...players,
    ...clubs,
    ...matches
  ]

  // Convert to Next.js sitemap format
  return allEntries.map(entry => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }))
}

