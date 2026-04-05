// Theme colors
export const COLORS = {
  bg: '#0a0a0f',
  surface: '#111118',
  surface2: '#18181f',
  border: '#2a2a38',
  accent: '#e8ff47',
  accent2: '#ff4747',
  accent3: '#47c4ff',
  text: '#f0f0f5',
  muted: '#6b6b80',
  success: '#47ff9b',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BASE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  HEALTH: '/api/health',
  MEMBERS: '/api/members',
  CLASSES: '/api/classes',
} as const;

// Membership types
export const MEMBERSHIP_TYPES = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ELITE: 'elite',
} as const;

// Class levels
export const CLASS_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;
