const exceptions: Record<string, string> = {
  en: 'us',
}

export function getFlagEmoji(countryCode: string) {
  const code = exceptions[countryCode] || countryCode
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0)),
  )
}
