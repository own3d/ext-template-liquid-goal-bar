import { Context } from '@own3d/sdk/types'

export type Axis = 'vertical' | 'horizontal'

export type Media = _Media | string

interface _Media {
  path: string;
  isSvg?: boolean;
  glow?: boolean;
}

export interface FillPadding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Glow {
  color: string;
  intensity: number;
}


export interface GoalbarStyle {
  axis?: Axis,
  fillClipPath?: string;
  fillMedia?: Media;
  fillHeightMultiplier?: number;
  fillPadding?: FillPadding;
  particleMedia?: Media;
  particleClipPath?: string;
  particleForeground?: boolean;
  foregroundMedia?: Media;
  overlayMedia?: Media;
  completionMedia?: Media;
  replaceOverlayWithCompletion?: boolean;
  eventMedia?: Media;
}


export interface FontValues {
  'font-color': string;
  'font-family': string;
  'font-weight': number;
  'font-size': number;
  'text-align': 'left' | 'center' | 'right';
  'font-style': string;
  'letter-spacing': string;
  'line-height': number;
  'text-indent': number;
  'text-transform': string;
}

export const defaultFontValues: FontValues = {
  'font-color': '#FFFFFF',
  'font-family': 'Inter',
  'font-weight': 400,
  'font-size': 14,
  'text-align': 'center',
  'font-style': 'normal',
  'letter-spacing': 'normal',
  'line-height': 1.2,
  'text-indent': 0,
  'text-transform': 'none',
}

export interface OptionalValue<T> {
  value: T;
  toggled: boolean;
}

export interface ContextValues {
  'style': string;
  'aspect-ratio': OptionalValue<number>;

  'event': string;
  'platforms': string[];
  'goal-target': number;
  'goal-start': OptionalValue<number>;
  'goal-period': string;
  'goal-start-date': OptionalValue<string>;
  'goal-end-date': OptionalValue<string>;

  'fill-color': string;
  'particles': boolean;
  'fill-glow-color': string;
  'fill-glow-intensity': number;

  'foreground-color'?: string;
  'foreground-glow-color': string;
  'foreground-glow-intensity': number;
  'event-animation': boolean;

  'title': OptionalValue<string>;
  'title-font': FontValues;
  'title-glow-color': string;
  'title-glow-intensity': number;

  'target-font': FontValues;
  'target-glow-color': string;
  'target-glow-intensity': number;
  'target-prefix': OptionalValue<string>;
  'target-suffix': OptionalValue<string>;

  'dates-start-show': boolean;
  'dates-start-time-show': boolean;
  'dates-end-show': boolean;
  'dates-end-time-show': boolean;
  'dates-separator': string;
  'dates-font': FontValues;
  'dates-glow-color': string;
  'dates-glow-intensity': number;
}


export interface GoalbarSettings {
  style: string;
  aspectRatio: number | null;

  fillColor: string;
  particles: boolean;
  fillGlow: Glow;

  foregroundColor: string | null;
  foregroundGlow: Glow;
  eventAnimation: boolean;

  title: string | null;
  titleFont: FontValues;
  titleGlow: Glow;

  targetFont: FontValues;
  targetGlow: Glow;
  targetPrefix: string | null;
  targetSuffix: string | null;

  datesStartShow: boolean;
  datesStartTimeShow: boolean;
  datesEndShow: boolean;
  datesEndTimeShow: boolean;
  datesSeparator: string;
  datesFont: FontValues;
  datesGlow: Glow;
}

export interface GoalbarMetrics {
  initialized: boolean;
  event: string;
  platforms: string[];
  target: number;
  startAmount: number | null;
  period: string;
  startDate: Date | null;
  endDate: Date | null;
}


export interface ExtensionContext extends Context {
  sourceId: string;
  isMuted: boolean;
  extensionId: string;
}


export interface GoalbarUpdate {
  client_id: string;
  channel_id: string;
  user_id: string;
  event: string;
  data: {
    'source_id': string;
    'test-increase'?: number;
    'value': number;
  };
}
