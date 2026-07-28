/**
 * @hanzo/stats - Data providers for various stats sources
 */

import type { GitHubStats, AIStats, StackOverflowUser } from '../types'

/**
 * GitHub Stats Provider
 */
export class GitHubProvider {
  private apiBase: string

  constructor(apiBase: string = '/api/github') {
    this.apiBase = apiBase
  }

  async getStats(): Promise<GitHubStats> {
    const response = await fetch(`${this.apiBase}/stats`)
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch GitHub stats')
    }
    return data.stats
  }

  async getCommits(options: { user?: string; since?: string; limit?: number } = {}): Promise<any[]> {
    const params = new URLSearchParams()
    if (options.user) params.set('user', options.user)
    if (options.since) params.set('since', options.since)
    if (options.limit) params.set('limit', String(options.limit))

    const response = await fetch(`${this.apiBase}/commits?${params}`)
    const data = await response.json()
    return data.commits || []
  }
}

/**
 * AI Usage Stats Provider
 */
export class AIProvider {
  private apiBase: string

  constructor(apiBase: string = '/api/claude') {
    this.apiBase = apiBase
  }

  async getStats(): Promise<AIStats> {
    const response = await fetch(`${this.apiBase}/stats`)
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch AI stats')
    }
    return data.stats
  }

  async getByModel(): Promise<{ model: string; input: number; output: number }[]> {
    const response = await fetch(`${this.apiBase}/stats`)
    const data = await response.json()
    return data.by_model || []
  }
}

/**
 * StackOverflow Stats Provider
 */
export class StackOverflowProvider {
  private userId: string
  private apiKey?: string

  constructor(userId: string, apiKey?: string) {
    this.userId = userId
    this.apiKey = apiKey
  }

  async getUser(): Promise<StackOverflowUser> {
    let url = `https://api.stackexchange.com/2.3/users/${this.userId}?site=stackoverflow`
    if (this.apiKey) {
      url += `&key=${this.apiKey}`
    }

    const response = await fetch(url)
    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error('User not found')
    }

    const user = data.items[0]
    return {
      reputation: user.reputation,
      answer_count: user.answer_count,
      question_count: user.question_count,
      badge_counts: user.badge_counts,
      profile_image: user.profile_image,
      display_name: user.display_name
    }
  }
}

/**
 * Spotify Stats Provider (uses embed URLs)
 */
export class SpotifyProvider {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  getProfileUrl(): string {
    return `https://open.spotify.com/user/${this.userId}`
  }

  getPlaylistEmbedUrl(playlistId: string): string {
    return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
  }

  getAlbumEmbedUrl(albumId: string): string {
    return `https://open.spotify.com/embed/album/${albumId}?utm_source=generator&theme=0`
  }

  getTrackEmbedUrl(trackId: string): string {
    return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
  }
}

/**
 * SoundCloud Stats Provider
 */
export class SoundCloudProvider {
  private username: string

  constructor(username: string) {
    this.username = username
  }

  getProfileUrl(): string {
    return `https://soundcloud.com/${this.username}`
  }

  getLikesEmbedUrl(visual: boolean = true): string {
    const url = encodeURIComponent(`https://soundcloud.com/${this.username}/likes`)
    return `https://w.soundcloud.com/player/?url=${url}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false${visual ? '&visual=true' : ''}`
  }

  getTracksEmbedUrl(visual: boolean = false): string {
    const url = encodeURIComponent(`https://soundcloud.com/${this.username}/tracks`)
    return `https://w.soundcloud.com/player/?url=${url}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false${visual ? '&visual=true' : ''}`
  }

  getSetsEmbedUrl(visual: boolean = true): string {
    const url = encodeURIComponent(`https://soundcloud.com/${this.username}/sets`)
    return `https://w.soundcloud.com/player/?url=${url}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false${visual ? '&visual=true' : ''}`
  }
}

/**
 * Combined stats provider
 */
export interface StatsProviders {
  github?: GitHubProvider
  ai?: AIProvider
  stackoverflow?: StackOverflowProvider
  spotify?: SpotifyProvider
  soundcloud?: SoundCloudProvider
}

export function createProviders(config: {
  github?: { apiBase?: string }
  ai?: { apiBase?: string }
  stackoverflow?: { userId: string; apiKey?: string }
  spotify?: { userId: string }
  soundcloud?: { username: string }
}): StatsProviders {
  const providers: StatsProviders = {}

  if (config.github) {
    providers.github = new GitHubProvider(config.github.apiBase)
  }

  if (config.ai) {
    providers.ai = new AIProvider(config.ai.apiBase)
  }

  if (config.stackoverflow) {
    providers.stackoverflow = new StackOverflowProvider(
      config.stackoverflow.userId,
      config.stackoverflow.apiKey
    )
  }

  if (config.spotify) {
    providers.spotify = new SpotifyProvider(config.spotify.userId)
  }

  if (config.soundcloud) {
    providers.soundcloud = new SoundCloudProvider(config.soundcloud.username)
  }

  return providers
}

export default {
  GitHubProvider,
  AIProvider,
  StackOverflowProvider,
  SpotifyProvider,
  SoundCloudProvider,
  createProviders
}
