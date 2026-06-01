// Olive Pick icon library — clean line-art, rounded caps, matches logo aesthetic

interface IconProps {
  size?: number
  className?: string
}

// ── Time slots ────────────────────────────────────────────────────────────────

export function SunIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10" y1="1.5" x2="10" y2="3.8"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="10" y1="16.2" x2="10" y2="18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="1.5" y1="10" x2="3.8"  y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16.2" y1="10" x2="18.5" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="4.1"  y1="4.1"  x2="5.7"  y2="5.7"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14.3" y1="14.3" x2="15.9" y2="15.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="15.9" y1="4.1"  x2="14.3" y2="5.7"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="5.7"  y1="14.3" x2="4.1"  y2="15.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function MoonIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M15.5 11A6.5 6.5 0 1 1 9 4.5a5 5 0 0 0 6.5 6.5z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export function CalendarIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2.5" y="4" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <line x1="2.5" y1="8.5" x2="17.5" y2="8.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="7"   y1="2"   x2="7"   y2="5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13"  y1="2"   x2="13"  y2="5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7"  cy="12.5" r="1" fill="currentColor" />
      <circle cx="10" cy="12.5" r="1" fill="currentColor" />
      <circle cx="13" cy="12.5" r="1" fill="currentColor" />
    </svg>
  )
}

// ── Analysis severity ─────────────────────────────────────────────────────────

export function ConflictIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13.5" y1="6.5" x2="6.5" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function WarningIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M9.13 3.5 2.5 15.5A1 1 0 0 0 3.37 17h13.26a1 1 0 0 0 .87-1.5L10.87 3.5a1 1 0 0 0-1.74 0z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <line x1="10" y1="8.5" x2="10" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

export function TipIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5a5.5 5.5 0 0 1 3.5 9.7V14a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1v-1.8A5.5 5.5 0 0 1 10 2.5z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <line x1="7.5" y1="17" x2="12.5" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// ── Catalog ───────────────────────────────────────────────────────────────────

export function SearchIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="12.5" y1="12.5" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// ── Skin types ────────────────────────────────────────────────────────────────

export function DropletIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5C10 2.5 4 9 4 12.5a6 6 0 0 0 12 0C16 9 10 2.5 10 2.5z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <path d="M7.5 13.5a2.5 2.5 0 0 0 2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function LeafIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4 16C4 16 5 8 10 5.5c3.5-1.7 7-1 7-1S16 9 13 12c-2.5 2.5-9 4-9 4z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <line x1="4" y1="16" x2="10.5" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function BalanceIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="4" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 7 L1.5 11 Q3 13 4.5 11 L3 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M17 7 L15.5 11 Q17 13 18.5 11 L17 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function SparkleIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2L11.5 8.5L18 10L11.5 11.5L10 18L8.5 11.5L2 10L8.5 8.5L10 2z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
    </svg>
  )
}

export function FlowerIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="10" cy="4.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="10" cy="15.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="4.5" cy="10" rx="2.5" ry="2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="15.5" cy="10" rx="2.5" ry="2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="5.9" cy="5.9" rx="2" ry="2.5" transform="rotate(-45 5.9 5.9)" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="14.1" cy="14.1" rx="2" ry="2.5" transform="rotate(-45 14.1 14.1)" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="14.1" cy="5.9" rx="2" ry="2.5" transform="rotate(45 14.1 5.9)" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="5.9" cy="14.1" rx="2" ry="2.5" transform="rotate(45 5.9 14.1)" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

// ── States ────────────────────────────────────────────────────────────────────

export function CheckCircleIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <polyline points="6.5,10 9,12.5 13.5,7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BottleIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M8 2.5h4v2l2.5 3v8a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 5.5 15.5v-8L8 4.5v-2z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <line x1="5.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <polyline points="5,8 10,13 15,8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <polyline points="13,5 8,10 13,15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <polyline points="7,5 12,10 7,15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TrashIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <polyline points="4,6 16,6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 6V4.5h5V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6l.8 10.5h6.4L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function RecommendIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      {/* Wand */}
      <line x1="3" y1="17" x2="11" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Sparkles */}
      <path d="M13 2l.8 2.2L16 5l-2.2.8L13 8l-.8-2.2L10 5l2.2-.8L13 2z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M17 10l.5 1.2 1.2.5-1.2.5L17 13.5l-.5-1.3L15.3 11.7l1.2-.5L17 10z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}
