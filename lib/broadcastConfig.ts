let broadcastCode = process.env.BROADCAST_ACCESS_CODE || 'DGM2024'
let guestCode = process.env.GUEST_ACCESS_CODE || 'GUEST2024'

export function getBroadcastCode() {
  return broadcastCode
}

export function setBroadcastCode(code: string) {
  broadcastCode = code
}

export function getGuestCode() {
  return guestCode
}

export function setGuestCode(code: string) {
  guestCode = code
}
