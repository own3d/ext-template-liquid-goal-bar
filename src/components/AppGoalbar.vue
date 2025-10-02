<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="w-full px-4 pt-4"
      :style="viewStyle"
    >
      <div
        ref="mediaContainer"
        class="mx-auto relative"
        :class="{
          'w-full h-full': !settings.aspectRatio,
          'max-w-full max-h-full': settings.aspectRatio,
        }"
        :style="{ aspectRatio: settings.aspectRatio }"
      >
        <AppFill
          :progress="percentProgress"
          :fill-color="settings.fillColor"

          class="absolute w-full h-full"
          :style="fillPaddingStyle"

          :axis="style.axis ?? 'vertical'"
          :fill-media="style.fillMedia ?? '/liquid.svg'"
          :fill-clip-path="style.fillClipPath"
          :fill-glow="settings.fillGlow"
          :particle-media="style.particleMedia ?? '/particles.svg'"
          :particle-clip-path="style.particleClipPath"
          :particles="settings.particles"
          :particle-foreground="style.particleForeground ?? false"
          :svg-height-multiplier="style.fillHeightMultiplier ?? 0.1"
        />

        <AppMedia
          :media="style.foregroundMedia"
          :color="settings.foregroundColor"
          :glow="settings.foregroundGlow"
          class="absolute top-0 left-0 w-full h-full"
        />

        <AppMedia
          v-if="!style.replaceOverlayWithCompletion || progress < target"
          :media="style.overlayMedia"
          :color="settings.foregroundColor"
          :glow="settings.foregroundGlow"
          class="absolute top-0 left-0 w-full h-full"
        />

        <AppMedia
          v-if="style.completionMedia"
          :media="style.completionMedia"
          :color="settings.foregroundColor"
          :glow="settings.foregroundGlow"
          class="absolute top-0 left-0 w-full h-full"
          :class="{
            'hidden': progress < target
          }"
        />

        <AppEventMedia
          v-if="settings.eventAnimation && style.eventMedia"
          :progress="progress"
          :media="style.eventMedia"
        />

      </div>
    </div>
    <div
      ref="textContainerElement"
      class="w-full p-4 flex flex-col gap-2"
    >
      <AppText
        v-if="settings.title"
        :settings="settings.titleFont"
        :glow="settings.titleGlow"
      >
        {{ settings.title }}
      </AppText>
      <AppText
        :settings="settings.targetFont"
        :glow="settings.targetGlow"
      >
        {{ `${displayProgress} / ${displayTarget}`}}
      </AppText>
      <AppText
        v-if="(startDate && (settings.datesStartShow || settings.datesStartTimeShow)) || (endDate && (settings.datesEndShow || settings.datesEndTimeShow))"
        :settings="settings.datesFont"
        :glow="settings.datesGlow"
      >
        <template v-if="startDate">
          <span v-if="settings.datesStartShow">
            {{ startDate.toLocaleDateString() + (settings.datesStartTimeShow ? ' ' : '') }}
          </span>
          <span v-if="settings.datesStartTimeShow">
            {{ startDate.toLocaleTimeString() }}
          </span>
        </template>
        {{ settings.datesSeparator }}
        <template v-if="endDate">
          <span v-if="settings.datesEndShow">
            {{ endDate.toLocaleDateString() + (settings.datesEndTimeShow ? ' ' : '') }}
          </span>
          <span v-if="settings.datesEndTimeShow">
            {{ endDate.toLocaleTimeString() }}
          </span>
        </template>
      </AppText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, Ref } from 'vue';
import { GoalbarSettings, GoalbarStyle } from '../types';
import Decimal from 'decimal.js';
import AppFill from './AppFill.vue';
import AppMedia from './AppMedia.vue';
import AppText from './AppText.vue';
import { useOnWindow } from '../composables/useOnWindow';
import AppEventMedia from './AppEventMedia.vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Object as PropType<Date | null | undefined>,
    default: undefined,
  },
  endDate: {
    type: Object as PropType<Date | null | undefined>,
    default: undefined,
  },
  style: {
    type: Object as PropType<GoalbarStyle>,
    required: true,
  },
  settings: {
    type: Object as PropType<GoalbarSettings>,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
})

const displayProgress: Ref<string> = computed(() => {
  if(props.event.includes('donation')) {
    return `${props.settings.targetPrefix ?? ''}${props.progress.toFixed(2)}${props.settings.targetSuffix ?? ''}`
  }

  return `${props.settings.targetPrefix ?? ''}${props.progress.toFixed(0)}${props.settings.targetSuffix ?? ''}`
})

const displayTarget: Ref<string> = computed(() => {
  if(props.event.includes('donation')) {
    return `${props.settings.targetPrefix ?? ''}${(props.target / 100).toFixed(2)}${props.settings.targetSuffix ?? ''}`
  }
  
  return `${props.settings.targetPrefix ?? ''}${props.target.toFixed(0)}${props.settings.targetSuffix ?? ''}`
})

const percentProgress: Ref<Decimal> = computed(() => {
  if(props.event.includes('donation')) {
    return new Decimal(props.progress).div(props.target / 100)
  }

  return new Decimal(props.progress).div(props.target)
})

const fillPaddingStyle: Ref<object> = computed(() => {
  const padding = props.style.fillPadding
  const percent = (n: number | undefined): number => n !== undefined ? Math.min(1, Math.max(0, n)) * 100 : 0
  return {
    left: `${percent(padding?.left)}%`,
    top: `${percent(padding?.top)}%`,
    width: `${100 - percent(padding?.left) - percent(padding?.right)}%`,
    height: `${100 - percent(padding?.top) - percent(padding?.bottom)}%`
  }
})

const viewStyle: Ref<object> = ref({})
const textContainerElement: Ref<HTMLElement | null> = ref(null)

useOnWindow('resize', calculateViewStyle)
onMounted(calculateViewStyle)
function calculateViewStyle(): void {
  if(!textContainerElement.value) {
    return
  }

  const textContainer = textContainerElement.value.getBoundingClientRect()
  viewStyle.value = {
    maxWidth: `${window.innerWidth}px`,
    maxHeight: `${window.innerHeight - textContainer.height}px`
  }
}

</script>
