'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GuestInfo {
  id: string
  name: string
  audioLevel: number
  videoEnabled: boolean
  micMuted: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
  cameraAngle: string
}

const mockGuests: GuestInfo[] = [
  { id: '1', name: 'Guest 1', audioLevel: 0.45, videoEnabled: true, micMuted: false, connectionQuality: 'excellent', cameraAngle: 'Front' },
  { id: '2', name: 'Guest 2', audioLevel: 0.72, videoEnabled: false, micMuted: true, connectionQuality: 'good', cameraAngle: 'Front' },
  { id: '3', name: 'Guest 3', audioLevel: 0.12, videoEnabled: true, micMuted: false, connectionQuality: 'fair', cameraAngle: 'Side' },
  { id: '4', name: 'Host', audioLevel: 0.88, videoEnabled: true, micMuted: false, connectionQuality: 'excellent', cameraAngle: 'Main' },
]

const qualityColors = {
  excellent: 'bg-green-500',
  good: 'bg-yellow-500',
  fair: 'bg-orange-500',
  poor: 'bg-red-500',
}

function AudioMeter({ level }: { level: number }) {
  const bars = 8
  const activeBars = Math.round(level * bars)

  return (
    <div className="flex items-end gap-[2px] h-4">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-t-sm ${i < activeBars ? 'bg-green-500' : 'bg-zinc-700'}`}
          animate={{
            height: i < activeBars ? `${((i + 1) / bars) * 100}%` : '15%',
          }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  )
}

function GuestCard({ guest }: { guest: GuestInfo }) {
  return (
    <motion.div
      className="relative rounded-lg overflow-hidden bg-zinc-800/80 border border-zinc-700/50 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-video bg-zinc-900 flex items-center justify-center relative">
        {guest.videoEnabled ? (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-700 mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold text-zinc-400">
                  {guest.name.charAt(0)}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Camera Preview</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-700 mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-500">
                {guest.name.charAt(0)}
              </span>
            </div>
            <p className="text-xs text-zinc-500">Camera Off</p>
          </div>
        )}

        {guest.micMuted && (
          <div className="absolute top-2 left-2 bg-red-500/80 rounded-full p-1">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${qualityColors[guest.connectionQuality]}`} />
          <span className="text-[10px] text-zinc-400 uppercase">{guest.connectionQuality}</span>
        </div>

        <div className="absolute bottom-2 left-2">
          <span className="text-xs font-medium text-white drop-shadow-lg">
            {guest.name}
          </span>
        </div>
      </div>

      <div className="p-2 flex items-center justify-between">
        <AudioMeter level={guest.audioLevel} />
        <motion.button
          className={`text-[10px] px-2 py-0.5 rounded ${
            guest.micMuted
              ? 'bg-red-500/20 text-red-400'
              : 'bg-green-500/20 text-green-400'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {guest.micMuted ? 'Unmute' : 'Mute'}
        </motion.button>
      </div>
    </motion.div>
  )
}

function SceneButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
        active
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700'
      }`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  )
}

export default function ProducerPanel() {
  const [activeScene, setActiveScene] = useState('Multi-View')
  const [isExpanded, setIsExpanded] = useState(false)

  const scenes = ['Multi-View', 'Single Guest', 'Full Screen', 'Split Screen']

  return (
    <div className="w-full">
      <motion.div
        className="rounded-xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-md overflow-hidden"
        initial={false}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Producer Panel
              </h3>
            </div>
            <motion.button
              className="text-xs text-zinc-500 hover:text-yellow-400 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
              whileTap={{ scale: 0.95 }}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </motion.button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {mockGuests.map((guest) => (
                    <GuestCard key={guest.id} guest={guest} />
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-mono">
                    Scene Control
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scenes.map((scene) => (
                      <SceneButton
                        key={scene}
                        label={scene}
                        active={activeScene === scene}
                        onClick={() => setActiveScene(scene)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/30">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                      Stream Routing
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input type="checkbox" defaultChecked className="accent-yellow-500" />
                        HLS Out
                      </label>
                      <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input type="checkbox" defaultChecked className="accent-yellow-500" />
                        YouTube Relay
                      </label>
                      <label className="flex items-center gap-2 text-xs text-zinc-400">
                        <input type="checkbox" defaultChecked className="accent-yellow-500" />
                        Facebook Relay
                      </label>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/30">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                      Studio Status
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Recording</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Preview</span>
                        <span className="text-yellow-400">Program</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Latency</span>
                        <span className="text-zinc-300">42ms</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 p-2 border-t border-zinc-800">
                  <motion.button
                    className="text-xs px-4 py-1.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    End Stream
                  </motion.button>
                  <motion.button
                    className="text-xs px-4 py-1.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Recording
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isExpanded && (
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
              <span>4 guests</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>Scene: {activeScene}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
