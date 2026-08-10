import type { Metadata } from 'next'
import AnimatedBackground from '@/components/about/AnimatedBackground'
import CompanyStory from '@/components/about/CompanyStory'
import MissionVision from '@/components/about/MissionVision'
import CoreValues from '@/components/about/CoreValues'
import CeoBio from '@/components/about/CeoBio'
import Technology from '@/components/about/Technology'
import IndustriesServed from '@/components/about/IndustriesServed'
import PremiumCTA from '@/components/about/PremiumCTA'

export const metadata: Metadata = {
  title: 'About | Dynamic Groove Media',
  description: 'Broadcast-grade media production company specializing in live streaming, RTMP infrastructure, multi-platform distribution, and cinematic content creation.',
}

export default function AboutPage() {
  return (
    <div className="relative bg-[#050505] text-white overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        <CompanyStory />
        <MissionVision />
        <CoreValues />
        <CeoBio />
        <Technology />
        <IndustriesServed />
        <PremiumCTA />
      </div>
    </div>
  )
}
