import { MetadataRoute } from 'next'
import axios from 'axios'
import { createPlayerUrl, createClubUrl, createMatchUrl } from '@/lib/utils/slug'

// Base URL for the site
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://scoutme.cloud'

// API base URL - use environment variable or fallback to production API
// Remove trailing slash if present (axios handles path joining)
const apiBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://api.scoutme.cloud').replace(/\/$/, '')

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
      // Silently skip if API URL not configured
      return []
    }

    const client = axios.create({ 
      baseURL: apiBaseUrl,
      timeout: 5000 // Reduced timeout for faster failure
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Fetching players from: ${apiBaseUrl}/player?limit=100`)
    }
    
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
        
        // Log response structure in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Sitemap] Players API response status: ${response.status}`, {
            hasData: !!response.data?.data,
            dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not array',
            responseKeys: Object.keys(response.data || {})
          })
        }
        
        const data: any[] = response.data?.data || response.data || []
        
        if (Array.isArray(data)) {
          allPlayers.push(...data)
          // Check if there's a next cursor
          cursor = response.data?.nextCursor || response.data?.cursor || null
          hasMore = cursor !== null && data.length === 100
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Sitemap] Fetched ${data.length} players, total: ${allPlayers.length}`)
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Sitemap] Players API did not return an array:', response.data)
          }
          hasMore = false
        }
        
        // Safety check
        if (allPlayers.length / 100 >= maxPages) {
          hasMore = false
        }
      } catch (pageError: any) {
        // Log all errors in development to diagnose issues
        if (process.env.NODE_ENV === 'development') {
          console.error('[Sitemap] Error fetching players page:', {
            message: pageError.message,
            code: pageError.code,
            status: pageError.response?.status,
            statusText: pageError.response?.statusText,
            data: pageError.response?.data
          })
        }
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
  } catch (error: any) {
    // Log all errors in development to diagnose issues
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sitemap] Error fetching players:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
    return []
  }
}

/**
 * Fetches all clubs from the API
 */
async function fetchClubs(): Promise<SitemapEntry[]> {
  try {
    if (!apiBaseUrl) {
      // Silently skip if API URL not configured
      return []
    }

    const client = axios.create({ 
      baseURL: apiBaseUrl,
      timeout: 5000 // Reduced timeout for faster failure
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Fetching clubs from: ${apiBaseUrl}/club/`)
    }
    
    const response = await client.get('/club/')
    
    // Log response structure in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Clubs API response status: ${response.status}`, {
        hasData: !!response.data?.data,
        dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not array',
        responseKeys: Object.keys(response.data || {})
      })
    }
    
    const clubs = response.data?.data || response.data || []
    
    if (!Array.isArray(clubs)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Sitemap] Clubs API did not return an array:', response.data)
      }
      return []
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Fetched ${clubs.length} clubs`)
    }
    
    return clubs.map((club: any) => ({
      url: `${baseUrl}${createClubUrl(club.name || 'club', club.id)}`,
      lastModified: club.updatedAt || club.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  } catch (error: any) {
    // Log all errors in development to diagnose issues
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sitemap] Error fetching clubs:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
    return []
  }
}

/**
 * Fetches all matches from the API
 */
async function fetchMatches(): Promise<SitemapEntry[]> {
  try {
    if (!apiBaseUrl) {
      // Silently skip if API URL not configured
      return []
    }

    const client = axios.create({ 
      baseURL: apiBaseUrl,
      timeout: 5000 // Reduced timeout for faster failure
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Fetching matches from: ${apiBaseUrl}/match/all-match`)
    }
    
    const response = await client.get('/match/all-match')
    
    // Log response structure in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Matches API response status: ${response.status}`, {
        hasData: !!response.data?.data,
        dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not array',
        responseKeys: Object.keys(response.data || {})
      })
    }
    
    const matches = response.data?.data || response.data || []
    
    if (!Array.isArray(matches)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Sitemap] Matches API did not return an array:', response.data)
      }
      return []
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sitemap] Fetched ${matches.length} matches`)
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
  } catch (error: any) {
    // Log all errors in development to diagnose issues
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sitemap] Error fetching matches:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
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

