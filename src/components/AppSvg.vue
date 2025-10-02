<template>
  <svg
    v-if="gradientTag"
    width="0"
    height="0"
  >
    <component
      :id="gradientId"
      :is="gradientTag"
      v-bind="getGradientAttributes(color)"
    >
      <stop
        v-for="(stop, index) in getGradientStops(color)"
        :key="index"
        :offset="`${stop.stop}%`"
        :stop-color="stop.color"
      />
    </component>
  </svg>

  <div
    v-if="path && svg"
    ref="svgElement"
    v-html="svg"
    v-bind="attrs"
    class="bg-cover w-full h-full"
    :style="colorStyle"
  />
</template>

<script setup lang="ts">
import { computed, Ref, useAttrs } from 'vue';
import { useSvg } from '../composables/useSvg';
import { uuid } from 'vue-uuid';
import Decimal from 'decimal.js';

const attrs = useAttrs()

const props = defineProps({
  path: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
})

const svg: Ref<string | undefined> = useSvg(() => props.path)

const colorStyle: Ref<string | undefined> = computed(() => {
  if(props.color?.includes('gradient')) {
    return {
      fill: `url(#${gradientId})`,
    }
  }
  return {
    color: props.color,
    fill: props.color,
  }
})


const gradientId: string = uuid.v4()

const gradientTag: Ref<string | undefined> = computed(() => {
  if(props.color.startsWith('linear-gradient')) {
    return 'linearGradient'
  } else if(props.color.startsWith('radial-gradient')) {
    return 'radialGradient'
  }
  return undefined
})

function getGradientAttributes(gradient: string): Record<string, string> {
  if(gradient.startsWith('linear-gradient')) {
    return getLinearGradientAttributes(gradient)
  } else if(gradient.startsWith('radial-gradient')) {
    return getRadialGradientAttributes(gradient)
  }
  return {}
}


function getLinearGradientAttributes(gradient: string): Record<string, string> {
  const res = new RegExp(/^linear-gradient\(([0-9]+)deg/).exec(gradient)
  if(res.length >= 2) {
    const degrees = new Decimal(res[1])
    const radians = degrees.mul(Math.PI).div('180')
    return {
      x1: new Decimal('0.5').sub(radians.sin().mul('0.5')).mul('100').toFixed(2) + '%',
      x2: new Decimal('0.5').add(radians.sin().mul('0.5')).mul('100').toFixed(2) + '%',
      y1: new Decimal('0.5').add(radians.cos().mul('0.5')).mul('100').toFixed(2) + '%',
      y2: new Decimal('0.5').sub(radians.cos().mul('0.5')).mul('100').toFixed(2) + '%',
    }
  }
}

function getRadialGradientAttributes(_: string): Record<string, string> {
  return {
    cx: '50%',
    cy: '50%',
    r: '50%',
    fx: '50%',
    fy: '50%',
  }
}

function getGradientStops(gradient: string): { color: string, stop: string }[] {
  const matches = gradient.matchAll(/(#[a-fA-F0-9]+)\s+([0-9]+)%/g)
  return Array.from(matches)
    .filter(match => match.length >= 2)
    .map(match => ({ color: match[1], stop: match[2] }))
}

</script>

<style scoped>

</style>