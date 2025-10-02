import WebFont from 'webfontloader'
import type { CSSProperties } from 'vue'
import type { FontValues, Glow, OptionalValue } from './types'
import { defaultFontValues } from './types'

const cachedFonts: string[] = []

export function loadFont(fontFamily: string): void {
  if(cachedFonts.includes(fontFamily)) {
    return
  }

  WebFont.load({
    google: { families: [`${fontFamily}:100,200,300,400,500,600,700,800,900`], api: 'https://fonts.bunny.net/css' },
    fontloading: (familyName) => {
      cachedFonts.push(familyName)
    },
  })
}

export function getTextStyle(values: FontValues, glow?: Glow): CSSProperties {
  const modifiers = {
    color: { suffix: null, id: 'font-color' },
    fontFamily: { suffix: null, id: 'font-family' },
    fontWeight: { suffix: null, id: 'font-weight' },
    fontSize: { suffix: 'px', id: 'font-size' },
    textAlign: { suffix: null, id: 'text-align' },
    fontStyle: { suffix: null, id: 'font-style' },
    letterSpacing: { suffix: 'px', id: 'letter-spacing' },
    lineHeight: { suffix: null, id: 'line-height' },
    textIndent: { suffix: 'px', id: 'text-indent' },
    textTransform: { suffix: null, id: 'font-casing' },
  }

  return Object.assign({
    textShadow: glow && glow.intensity ? `0 0 ${glow.intensity}rem ${glow.color}` : undefined,
  }, ...Object.keys(modifiers).map(modifierKey => {
    const modifier = modifiers[modifierKey]
    const value = values?.[modifier.id] ?? defaultFontValues[modifier.id]
    if(modifier.id === 'font-family') {
      loadFont(value)
    }
    return {
      [modifierKey]: value + (modifier.suffix ?? ''),
    }
  }))
}

export function getOptional<T>(value: OptionalValue<T> | undefined, fallback: T): T | null {
  if(value === undefined || value === null) {
    return fallback
  }
  return value.toggled ? value.value : null
}

export function getGlow(color: string | undefined, intensity: number | undefined, fallback: Glow): Glow {
  return {
    color: color ?? fallback.color,
    intensity: intensity ? (intensity / 100) : fallback.intensity,
  }
}

export function getDateTime(datetime: string | null | undefined): Date | null {
  if(datetime) {
    return new Date(Date.parse(datetime))
  }
  return null
}

export function isGifAnimated(blob: Blob): Promise<number> {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(blob);
      fileReader.onload = (): void => {
        const arr = new Uint8Array(fileReader.result);
        let duration = 0;
        for(let i = 0; i < arr.length; i++) {
          if(arr[i] === 0x21
            && arr[i + 1] === 0xF9
            && arr[i + 2] === 0x04
            && arr[i + 7] === 0x00) {
            const delay = (arr[i + 5] << 8) | (arr[i + 4] & 0xFF)
            duration += delay < 2 ? 10 : delay;
          }
        }
        resolve(duration * 10);
      }

    } catch(e) {
      reject(e);
    }
  });
}
