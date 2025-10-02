<template>
  <div class="relative w-full h-full">
    <AppClip
      v-if="particles && particleForeground"
      :clip-svg-path="particleClipPath"
      class="absolute w-full h-full"
    >
      <AppMedia
        :media="particleMedia"
        :color="fillColor"
        class="absolute w-full h-full aspect-square"
        :style="effectStyle"
      />
    </AppClip>
    <AppClip
      :clip-svg-path="fillClipPath"
      class="relative w-full h-full"
    >
      <AppMedia
        v-if="particles && !particleForeground"
        :media="particleMedia"
        :color="fillColor"
        class="absolute w-full h-full aspect-square"
        :style="effectStyle"
      />

      <AppMedia
        :media="fillMedia"
        :color="fillColor"
        :glow="fillGlow"
        class="absolute bg-cover w-full h-full transition-all duration-300"
        :style="{
          ...style,
          width: axis === 'horizontal' ? `${axisLength * 100}%` : '100%',
          height: axis === 'vertical' ? `${axisLength * 100}%` : '100%',
        }"
      />
    </AppClip>

  </div>
</template>

<script setup lang="ts">
import { computed, PropType, Ref } from 'vue';
import { Axis, Glow, Media } from '../types';
import Decimal from 'decimal.js';
import AppClip from './AppClip.vue';
import AppMedia from './AppMedia.vue';

const props = defineProps({
  axis: {
    type: String as PropType<Axis>,
    required: true,
  },
  fillMedia: {
    type: [String, Object as PropType<Media>],
    required: true,
  },
  fillClipPath: {
    type: String,
    default: undefined,
  },
  fillGlow: {
    type: Object as PropType<Glow>,
    default: undefined,
  },
  particleMedia: {
    type: [String, Object as PropType<Media>],
    default: undefined,
  },
  particleClipPath: {
    type: String,
    default: undefined,
  },
  particles: {
    type: Boolean,
    default: true,
  },
  particleForeground: {
    type: Boolean,
    default: false
  },
  svgHeightMultiplier: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Object as PropType<Decimal>,
    required: true,
  },
  fillColor: {
    type: String,
    required: true,
  },
})

const axisLength: Ref<number> = computed(() => new Decimal('1').add(props.svgHeightMultiplier))

const style: Ref<object> = computed(() => {
  const progress = getProgress()
  const inverseProgress = new Decimal('1').sub(progress)
  const p = inverseProgress.sub(new Decimal(props.svgHeightMultiplier).div(axisLength.value))
  const percent = p.mul('100')
  if(props.axis === 'vertical') {
    //return `translate(0, ${percent}%)`
    return { top: `${percent.toFixed()}%` }
  } else {
    return { right: `${percent.toFixed()}%` }
  }
})

const effectStyle: Ref<object> = computed(() => {
  const translate = new Decimal('1').sub(new Decimal('2').mul(props.svgHeightMultiplier))
  const percent = translate.mul('100')
  if(props.axis === 'vertical') {
    return {
      ...style.value,
      transform: `translate(0, -${percent.toFixed()}%)`
    }
  } else {
    return {
      ...style.value,
      transform: `translate(-${percent.toFixed()}%, 0)`
    }
  }
})

function getProgress(): Decimal {
  if(props.progress.lt('0')) {
    return new Decimal('0')
  } else if(props.progress.gt('1')) {
    return new Decimal('1')
  }
  return props.progress
}

</script>

<style scoped>

</style>