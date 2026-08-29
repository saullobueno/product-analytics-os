import { subDays } from 'date-fns'
import type {
  Channel,
  DeviceSegment,
  FunnelStepDefinition,
  ReleaseEvent,
} from './types'

/** Seed fixa: o dataset inteiro é reprodutível entre reloads e testes. */
export const SEED = 424_242

export const TOTAL_DAYS = 90

/** "Hoje" do dataset = data real do sistema, truncada ao dia. */
export function datasetEndDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function datasetStartDate(): Date {
  return subDays(datasetEndDate(), TOTAL_DAYS - 1)
}

export const DEVICE_SEGMENTS: readonly DeviceSegment[] = [
  'android',
  'ios',
  'web',
]

export const DEVICE_SHARE: Record<DeviceSegment, number> = {
  android: 0.55,
  ios: 0.35,
  web: 0.1,
}

export const CHANNELS: readonly Channel[] = [
  'organic',
  'paid',
  'referral',
  'social',
]

export const FUNNEL_STEPS: readonly FunnelStepDefinition[] = [
  { id: 'landing', label: 'Landing' },
  { id: 'signup', label: 'Signup' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'activated', label: 'Activated' },
]

/**
 * Release "narrativa": causa uma regressão real e detectável na
 * conversão mobile a partir desta data, para o AI Analyst (fase 4)
 * ter uma causa raiz genuína para encontrar nos dados — não é só
 * texto decorativo. Ver ADR 0003.
 */
export function releaseEvent(): ReleaseEvent {
  const date = subDays(datasetEndDate(), 8)
  return {
    version: '2.4.0',
    date: date.toISOString().slice(0, 10),
    notes: 'Redesign do fluxo de onboarding mobile',
  }
}
