'use client'

import Image from 'next/image'

interface FigurinhaProps {
  name: string
  birthDate?: string
  height?: string
  weight?: string
  club?: string
  photoUrl?: string
  number?: number
  country?: string
  countryFlag?: string
  className?: string
  watermark?: boolean
}

export default function FigurinhaCard({
  name = 'JOGADOR',
  birthDate = '1-1-2000',
  height = '1,75m',
  weight = '70',
  club = 'TIME FC',
  photoUrl,
  number = 10,
  country = 'BRA',
  countryFlag = '🇧🇷',
  className = '',
  watermark = false,
}: FigurinhaProps) {
  const bgColors: Record<string, string> = {
    BRA: '#b8e0f7',
    ARG: '#b8e0f7',
    FRA: '#c5d4f0',
    default: '#b8d8f7',
  }
  const bgColor = bgColors[country] || bgColors.default

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: 200,
        height: 280,
        borderRadius: 14,
        background: bgColor,
        overflow: 'hidden',
        boxShadow: '0 6px 32px rgba(0,0,0,0.16)',
        flexShrink: 0,
      }}
    >
      {/* Big decorative number */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 0,
          fontFamily: 'var(--font-bebas, Arial Black)',
          fontSize: 120,
          lineHeight: 1,
          color: '#005F00',
          opacity: 0.14,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-4px',
        }}
      >
        26
      </div>

      {/* Top right FIFA badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(255,255,255,0.88)',
          borderRadius: 6,
          padding: '3px 6px',
          textAlign: 'center',
          lineHeight: 1.1,
          zIndex: 3,
        }}
      >
        <div style={{ fontSize: 7, fontWeight: 900, color: '#002776', letterSpacing: 0.5 }}>⚽ FIFA</div>
        <div style={{ fontSize: 9, fontWeight: 900, color: '#002776' }}>2026</div>
      </div>

      {/* Photo area */}
      <div
        style={{
          position: 'relative',
          margin: '10px 10px 0',
          height: 148,
          borderRadius: 8,
          overflow: 'hidden',
          background: photoUrl
            ? 'transparent'
            : 'linear-gradient(160deg, #FFDF00 0%, #009C3B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
        ) : (
          <span style={{ fontSize: 72, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
            {name === 'HELENA' ? '🧒' : name === 'ARTHUR' ? '👦' : '🧑'}
          </span>
        )}

        {/* Country flag */}
        <div style={{ position: 'absolute', right: 6, bottom: 6, fontSize: 20, zIndex: 2 }}>
          {countryFlag}
        </div>
      </div>

      {/* Right side BRA label */}
      <div
        style={{
          position: 'absolute',
          right: -2,
          top: 60,
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          color: '#fff',
          fontWeight: 900,
          fontSize: 10,
          letterSpacing: 2,
          background: 'rgba(0,39,118,0.7)',
          padding: '6px 3px',
          borderRadius: '4px 0 0 4px',
          zIndex: 2,
        }}
      >
        {country}
      </div>

      {/* Bottom info bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#001840',
          padding: '7px 9px 6px',
          borderRadius: '0 0 14px 14px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-bebas, Arial Black)',
            fontSize: 20,
            letterSpacing: 1.5,
            color: '#fff',
            lineHeight: 1.1,
          }}
        >
          {name.toUpperCase()}
        </div>
        <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
          {birthDate} | {height} | {weight} kg
        </div>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(255,223,0,0.14)',
            border: '1px solid rgba(255,223,0,0.3)',
            borderRadius: 4,
            padding: '1px 6px',
            fontSize: 8,
            fontWeight: 700,
            color: '#FFDF00',
            marginTop: 3,
          }}
        >
          {club.toUpperCase()}
        </div>
        <div style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: 2 }}>
          PANINI®
        </div>
      </div>

      {/* Watermark */}
      {watermark && (
        <div className="watermark">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="watermark-text"
              style={{ top: `${10 + i * 18}%` }}
            >
              MINHA FIGURINHA 2026 • MINHA FIGURINHA 2026 •
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
