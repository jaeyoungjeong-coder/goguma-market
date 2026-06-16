'use client'

import { useEffect, useState } from 'react'

type WeatherKind = 'clear-day' | 'clear-night' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunder'

const THEME: Record<WeatherKind, { gradient: string; emoji: string }> = {
  'clear-day':   { gradient: 'linear-gradient(160deg, #FFF6E0 0%, #FFE0B0 45%, #FFC9D6 100%)', emoji: '☀️' },
  'clear-night': { gradient: 'linear-gradient(160deg, #FFEFE0 0%, #FFD8C2 45%, #E8C7E0 100%)', emoji: '🌙' },
  cloudy:        { gradient: 'linear-gradient(160deg, #F3F0EA 0%, #E3DCE6 50%, #D8D6E8 100%)', emoji: '☁️' },
  fog:           { gradient: 'linear-gradient(160deg, #F0EFEC 0%, #E6E2DC 50%, #DCD7CE 100%)', emoji: '🌫️' },
  rain:          { gradient: 'linear-gradient(160deg, #EAF1F5 0%, #D8E6EE 50%, #C9D8E8 100%)', emoji: '🌧️' },
  snow:          { gradient: 'linear-gradient(160deg, #F5FAFF 0%, #E6F2FA 50%, #D9ECFA 100%)', emoji: '❄️' },
  thunder:       { gradient: 'linear-gradient(160deg, #E9E6F0 0%, #D6CEE0 50%, #C2B6D6 100%)', emoji: '⛈️' },
}

// 위치 권한이 없을 때 쓸 기본 좌표 (서울)
const FALLBACK_LOCATION = { latitude: 37.5665, longitude: 126.978 }

function codeToKind(code: number, isDay: boolean): WeatherKind {
  if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night'
  if (code === 2 || code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([95, 96, 99].includes(code)) return 'thunder'
  return 'cloudy'
}

export default function WeatherBackground() {
  const [kind, setKind] = useState<WeatherKind>('clear-day')

  useEffect(() => {
    let cancelled = false

    async function loadWeather(lat: number, lon: number) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,is_day`
        )
        const data = await res.json()
        if (cancelled) return
        const code = data?.current?.weather_code
        const isDay = data?.current?.is_day === 1
        if (typeof code === 'number') setKind(codeToKind(code, isDay))
      } catch {
        // 날씨 정보를 못 가져오면 기본 배경을 그대로 둠
      }
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        () => loadWeather(FALLBACK_LOCATION.latitude, FALLBACK_LOCATION.longitude),
        { timeout: 5000 }
      )
    } else {
      loadWeather(FALLBACK_LOCATION.latitude, FALLBACK_LOCATION.longitude)
    }

    return () => {
      cancelled = true
    }
  }, [])

  const theme = THEME[kind]

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 transition-colors duration-700"
      style={{ background: theme.gradient }}
    >
      <span className="select-none" style={{ position: 'absolute', top: '6%', right: '8%', fontSize: '2.4rem', opacity: 0.5 }}>
        {theme.emoji}
      </span>
    </div>
  )
}
