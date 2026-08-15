import { create } from 'zustand'

export type StreamSource = 'hls' | 'youtube' | 'facebook' | 'vdo' | 'guest'

export interface StreamAnalytics {
  viewerCount: number
  bitrate: number
  uploadBandwidth: number
  fps: number
  cpu: number
  resolution: string
  duration: number
  hlsSegments: number
  rtmpConnected: boolean
  platformStatus: {
    hls: 'connected' | 'degraded' | 'offline'
    youtube: 'connected' | 'degraded' | 'offline'
    facebook: 'connected' | 'degraded' | 'offline'
  }
}

interface StreamStore {
  activeSource: StreamSource | null
  isLive: boolean
  isStandby: boolean
  streamTitle: string
  youtubeId: string
  isChannel: boolean
  facebookInput: string
  hlsUrl: string
  isProducerMode: boolean
  analytics: StreamAnalytics
  setActiveSource: (source: StreamSource | null) => void
  setIsLive: (live: boolean) => void
  setStreamTitle: (title: string) => void
  setYoutubeId: (id: string) => void
  setIsChannel: (channel: boolean) => void
  setFacebookInput: (input: string) => void
  setHlsUrl: (url: string) => void
  toggleProducerMode: () => void
  updateAnalytics: (partial: Partial<StreamAnalytics>) => void
}

const defaultAnalytics: StreamAnalytics = {
  viewerCount: 0,
  bitrate: 0,
  uploadBandwidth: 0,
  fps: 0,
  cpu: 0,
  resolution: 'N/A',
  duration: 0,
  hlsSegments: 0,
  rtmpConnected: false,
  platformStatus: {
    hls: 'offline',
    youtube: 'offline',
    facebook: 'offline',
  },
}

export const useStreamStore = create<StreamStore>((set) => ({
  activeSource: null,
  isLive: false,
  isStandby: true,
  streamTitle: 'Live Broadcast',
  youtubeId: '',
  isChannel: true,
  facebookInput: '',
  hlsUrl: 'http://127.0.0.1:8585/hls/stream.m3u8',
  isProducerMode: false,
  analytics: defaultAnalytics,
  setActiveSource: (source) => set({ activeSource: source }),
  setIsLive: (live) =>
    set({
      isLive: live,
      isStandby: !live,
      ...(live && { activeSource: 'hls' }),
    }),
  setStreamTitle: (title) => set({ streamTitle: title }),
  setYoutubeId: (id) => set({ youtubeId: id }),
  setIsChannel: (channel) => set({ isChannel: channel }),
  setFacebookInput: (input) => set({ facebookInput: input }),
  setHlsUrl: (url) => set({ hlsUrl: url }),
  toggleProducerMode: () =>
    set((state) => ({ isProducerMode: !state.isProducerMode })),
  updateAnalytics: (partial) =>
    set((state) => ({
      analytics: { ...state.analytics, ...partial },
    })),
}))
