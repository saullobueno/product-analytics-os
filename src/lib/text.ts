export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const DEVICE_LABELS: Record<string, string> = {
  ios: 'iOS',
}

/** Como capitalize(), mas com grafias especiais conhecidas (ex.: iOS). */
export function formatDeviceLabel(device: string): string {
  return DEVICE_LABELS[device] ?? capitalize(device)
}
