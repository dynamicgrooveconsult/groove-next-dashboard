'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Toast, { useToast } from '@/components/Toast'

interface CeoProfile {
  full_name: string
  position: string
  short_bio: string
  full_biography: string
  photo_url: string
  facebook_link: string
  instagram_link: string
  linkedin_link: string
  youtube_link: string
  email_address: string
  phone_number: string
}

const defaultProfile: CeoProfile = {
  full_name: '',
  position: '',
  short_bio: '',
  full_biography: '',
  photo_url: '',
  facebook_link: '',
  instagram_link: '',
  linkedin_link: '',
  youtube_link: '',
  email_address: '',
  phone_number: '',
}

const STORAGE_BUCKET = 'ceo-images'

export default function CeoProfileManager() {
  const { showToast, ToastComponent } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<CeoProfile>(defaultProfile)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/ceo')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setProfile((prev) => ({ ...prev, photo_url: '' }))
  }

  const updateField = (field: keyof CeoProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setError('')
    setSaving(true)

    try {
      let photoUrl = profile.photo_url

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `ceo/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, photoFile)

        if (uploadError) throw new Error(uploadError.message)

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName)

        photoUrl = urlData.publicUrl
      }

      const res = await fetch('/api/ceo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          photo_url: photoUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      const updated = await res.json()
      setProfile(updated)
      setPhotoFile(null)
      setPhotoPreview(null)
      showToast('CEO profile updated successfully.', 'success')
    } catch (err: any) {
      setError(err.message)
      showToast(err.message, 'error')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-zinc-400">Loading profile...</p>
      </div>
    )
  }

  const hasPhoto = photoPreview || profile.photo_url

  return (
    <div className="p-8 max-w-3xl">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">CEO Profile Manager</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Update the CEO information displayed on the About page
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Image Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Profile Image</h3>

          {hasPhoto && (
            <div className="mb-4">
              <div className="w-40 h-40 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                <img
                  src={photoPreview || profile.photo_url}
                  alt="CEO preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-700 transition text-sm">
              <span className="text-yellow-500">📸</span>
              <span className="text-zinc-300">
                {photoFile ? photoFile.name : hasPhoto ? 'Replace Photo' : 'Upload Photo'}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
            </label>

            {hasPhoto && (
              <button
                onClick={removePhoto}
                className="px-4 py-2.5 text-sm text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Full Name</label>
              <input
                value={profile.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Position / Title</label>
              <input
                value={profile.position}
                onChange={(e) => updateField('position', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Email Address</label>
              <input
                value={profile.email_address}
                onChange={(e) => updateField('email_address', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="ceo@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Phone Number</label>
              <input
                value={profile.phone_number}
                onChange={(e) => updateField('phone_number', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
        </div>

        {/* Biography Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Biography</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Short Bio</label>
              <textarea
                value={profile.short_bio}
                onChange={(e) => updateField('short_bio', e.target.value)}
                rows={3}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Full Biography</label>
              <textarea
                value={profile.full_biography}
                onChange={(e) => updateField('full_biography', e.target.value)}
                rows={5}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Facebook</label>
              <input
                value={profile.facebook_link}
                onChange={(e) => updateField('facebook_link', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Instagram</label>
              <input
                value={profile.instagram_link}
                onChange={(e) => updateField('instagram_link', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">LinkedIn</label>
              <input
                value={profile.linkedin_link}
                onChange={(e) => updateField('linkedin_link', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">YouTube</label>
              <input
                value={profile.youtube_link}
                onChange={(e) => updateField('youtube_link', e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold text-sm hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
