<template>
  <AppGoalbar
    :progress="progress"
    :target="metrics.target"
    :start-date="metrics.startDate"
    :end-date="metrics.endDate"
    :style="style"
    :settings="settings"
    :event="metrics.event"
    class="w-full h-full"
  />
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import AppGoalbar from './components/AppGoalbar.vue';
import { ContextValues, defaultFontValues, ExtensionContext, GoalbarMetrics, GoalbarSettings, GoalbarStyle, GoalbarUpdate } from './types';
import { goalbarStyles } from './goalbar.styles';
import { getDateTime, getGlow, getOptional } from './helper';
import { initializeExtension } from '@own3d/sdk/extension';
import { useAuth } from '@own3d/sdk/auth';
import { useContext } from '@own3d/sdk/context';
import { usePubSub } from '@own3d/sdk/pubsub';

const extension = initializeExtension()


const progress: Ref<number> = ref(0)

const metrics: Ref<GoalbarMetrics> = ref({
  initialized: false,
  event: 'like',
  platforms: [],
  target: 100,
  startAmount: null,
  period: 'session',
  endDate: null,
  startDate: null,
})
const style: Ref<GoalbarStyle> = ref(goalbarStyles.default)
const settings: Ref<GoalbarSettings> = ref({
  style: '',
  aspectRatio: 1,

  fillColor: '#FFFFFF',
  particles: true,
  fillGlow: {
    color: '#FFFFFF',
    intensity: 0
  },

  foregroundColor: '#FFFFFF',
  foregroundGlow: {
    color: '#FFFFFF',
    intensity: 0
  },
  eventAnimation: !!style.value.eventMedia,

  title: 'My Goalbar',
  titleFont: defaultFontValues,
  titleGlow: {
    color: '#FFFFFF',
    intensity: 0
  },

  targetFont: defaultFontValues,
  targetGlow: {
    color: '#FFFFFF',
    intensity: 0
  },
  targetPrefix: null,
  targetSuffix: null,

  datesStartShow: true,
  datesStartTimeShow: true,
  datesEndShow: true,
  datesEndTimeShow: true,
  datesSeparator: '-',
  datesFont: defaultFontValues,
  datesGlow: {
    color: '#FFFFFF',
    intensity: 0
  },
})

function updateConfig(config: ContextValues): void {
  const newMetrics: GoalbarMetrics = {
    initialized: !!config.event,
    event: config.event ?? metrics.value.event,
    platforms: config.platforms ?? metrics.value.platforms,
    target: config['goal-target'] ?? metrics.value.target,
    startAmount: getOptional(config['goal-start'], metrics.value.startAmount),
    period: config['goal-period'] ?? metrics.value.period,
    startDate: getDateTime(getOptional(config['goal-start-date'], metrics.value.startDate?.toISOString())),
    endDate: getDateTime(getOptional(config['goal-end-date'], metrics.value.endDate?.toISOString())),
  }

  if(JSON.stringify(newMetrics) !== JSON.stringify(metrics.value)) {
    metrics.value = newMetrics
  }

  const newStyle: GoalbarStyle = goalbarStyles.default
  if(newStyle && JSON.stringify(newStyle) !== JSON.stringify(style.value)) {
    style.value = newStyle
  }

  const newSettings: GoalbarSettings = {
    style: goalbarStyles.default ?? settings.value.style,
    aspectRatio: getOptional(config['aspect-ratio'], settings.value.aspectRatio),

    fillColor: config['fill-color'] ?? settings.value.fillColor,
    particles: config.particles ?? settings.value.particles,
    fillGlow: getGlow(config['fill-glow-color'], config['fill-glow-intensity'], settings.value.fillGlow),

    foregroundColor: config['foreground-color'] ?? settings.value.foregroundColor,
    foregroundGlow: getGlow(config['foreground-glow-color'], config['foreground-glow-intensity'], settings.value.foregroundGlow),
    eventAnimation: config['event-animation'] ?? settings.value.eventAnimation,

    title: getOptional(config.title, settings.value.title),
    titleFont: config['title-font'] ?? settings.value.titleFont,
    titleGlow: getGlow(config['title-glow-color'], config['title-glow-intensity'], settings.value.titleGlow),

    targetFont: config['target-font'] ?? settings.value.targetFont,
    targetGlow: getGlow(config['target-glow-color'], config['target-glow-intensity'], settings.value.targetGlow),
    targetPrefix: getOptional(config['target-prefix'], settings.value.targetPrefix),
    targetSuffix: getOptional(config['target-suffix'], settings.value.targetSuffix),

    datesStartShow: config['dates-start-show'] ?? settings.value.datesStartShow,
    datesStartTimeShow: config['dates-start-time-show'] ?? settings.value.datesStartTimeShow,
    datesEndShow: config['dates-end-show'] ?? settings.value.datesEndShow,
    datesEndTimeShow: config['dates-end-time-show'] ?? settings.value.datesEndTimeShow,
    datesSeparator: config['dates-separator'] ?? settings.value.datesSeparator,
    datesFont: config['dates-font'] ?? settings.value.datesFont,
    datesGlow: getGlow(config['dates-glow-color'], config['dates-glow-intensity'], settings.value.datesGlow),
  }

  if(JSON.stringify(newSettings) !== JSON.stringify(settings.value)) {
    settings.value = newSettings
  }
}

const ctx: Ref<ExtensionContext | undefined> = ref()
const authorized: Ref<Authorized | undefined> = ref()

watch([metrics, authorized, ctx], d => syncData(d[0], d[1], d[2]))
async function syncData(metrics?: GoalbarMetrics, authorized?: Authorized, ctx?: ExtensionContext): Promise<void> {
  if(!authorized || !ctx || !metrics.initialized) {
    return
  }

  const baseUrlRaw: string = import.meta.env.VITE_OWN3D_PRO_API_URL
  const baseUrl: string = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw
  const res = await fetch(`${baseUrl}/v1/goalbars/sync`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authorized.client_token}`,
    },
    body: JSON.stringify({
      source_id: ctx.sourceId,
      extension_id: ctx.extensionId,
      event: metrics.event,
      platforms: metrics.platforms,
      start_value: metrics.startAmount ?? 0,
      goal: metrics.target,
      start_at: metrics.startDate?.toISOString() ?? null,
      end_at: metrics.endDate?.toISOString() ?? null,
    })
  })

  if(res.ok) {
    progress.value = (await res.json())?.value ?? 0
  }
}

const { onAuthorized } = useAuth(extension)
onAuthorized(data => authorized.value = data)

const { onContext } = useContext(extension)
onContext(({ values, ...context }: ExtensionContext & { values: unknown }, changed) => {
  if(!ctx.value) {
    ctx.value = {
      ...context,
      extensionId: values.extension.id
    }
  } else {
    for(const key of changed) {
      if(key in context) {
        ctx.value[key] = context[key]
      }
    }
  }
  if(changed.includes('values') && values) {
    ctx.value.extensionId = values.extension?.id ?? ctx.value.extensionId
    updateConfig(values)
  }
})


const { subscribe } = usePubSub(extension)
subscribe('goalbar-update', (data: GoalbarUpdate) => {
  if(data.client_id === ctx.value.extensionId
    && data.event === 'goalbar-update'
    && data.data.source_id === ctx.value.sourceId
  ) {
    if(data.data['test-increase']) {
      progress.value += data.data['test-increase']
    } else {
      progress.value = data.data.value
    }
  }
})

</script>
