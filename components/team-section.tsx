import { supabase } from '@/utils/supabase/server'

interface TeamMember {
  id: number
  name: string
  role: string
  image_url: string | null
}

export default async function TeamSection() {
  const { data: team, error } = await supabase
    .from('team_members')
    .select('*')
    .order('id', { ascending: true })
    .limit(3)

  if (error) {
    console.error('Supabase error:', error)
  }

  const members = (team as TeamMember[]) ?? []
  const slots = 3
  const cards: (TeamMember | null)[] = []
  for (let i = 0; i < slots; i++) {
    cards.push(members[i] ?? null)
  }

  return (
    <section id="team" style={{ padding: '112px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#c9a96e', marginBottom: '16px' }}>Our Team</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>The People Behind the Lens</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto' }}>Meet the crew that makes every production extraordinary.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {cards.map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ aspectRatio: '3/4', background: 'rgba(5,5,5,0.75)', backdropFilter: 'blur(8px)', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
                {m && m.image_url && (
                  <img src={m.image_url} alt={m.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505, transparent)', zIndex: 10 }} />
                {(!m || !m.image_url) && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '48px', height: '48px', color: 'rgba(255,255,255,0.15)' }}>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', zIndex: 20, textAlign: 'left' }}>
                  <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px', margin: 0, opacity: m ? 1 : 0.3 }}>{m ? m.name : 'Loading...'}</h3>
                  <p style={{ color: '#c9a96e', fontSize: '11px', margin: '4px 0 0', opacity: m ? 1 : 0.3 }}>{m ? m.role : 'Fetching data'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
