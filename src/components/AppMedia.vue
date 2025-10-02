<template>
  <AppSvg
    v-if="path && isSvg"
    :path="path"
    :color="color"
    :style="glowStyle"
  />

  <template v-else-if="rawDataUrl || path">
    <video
      v-if="rawPath?.endsWith('.webm') === true"
      :key="rawDataUrl ?? path"
      autoplay
      :loop="isLooping"
      muted
      class="w-full h-full"
      v-bind="attrs"
      :style="glowStyle"
      @ended="$emit('ended')"
    >
      <source :src="rawDataUrl ?? path" type="video/webm" />
    </video>
    <img
      v-else
      :src="rawDataUrl ?? path"
      class="object-fill"
      v-bind="attrs"
      :style="glowStyle"
    >
  </template>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, PropType, Ref, useAttrs } from 'vue';
import { Glow, Media } from '../types';
import AppSvg from './AppSvg.vue';

const attrs = useAttrs()

const props = defineProps({
  media: {
    type: [String, Object as PropType<Media | undefined>],
    required: true,
  },
  color: {
    type: String,
    default: undefined,
  },
  glow: {
    type: Object as PropType<Glow | undefined>,
    default: undefined,
  },
  rawDataUrl: {
    type: String,
    default: undefined,
  },
  random: {
    type: String,
    default: undefined,
  },
})

defineEmits<{
  ended: []
}>()

const isLooping: Ref<boolean> = computed(() =>
  !getCurrentInstance()?.vnode.props.onEnded
)

const rawPath: Ref<string | undefined> = computed(() => {
  const path = typeof props.media === 'string' ? props.media : props.media?.path
  if(path) {
    const baseUrlRaw = import.meta.env.BASE_URL ?? ''
    const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw
    return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`
  }
  return path
})

const path: Ref<string | undefined> = computed(() => {
  if(rawPath.value) {
    if(props.random) {
      return `${rawPath.value}?id=${props.random}`
    } else {
      return rawPath.value
    }
  }
  return undefined
})

const isSvg: Ref<boolean> = computed(() => {
  if(props.media?.isSvg) {
    return true
  } else if(typeof props.media === 'string') {
    return props.media.endsWith('.svg')
  }
  return false
})

const glowStyle: Ref<object> = computed(() => {
  const glow = props.glow
  if(!glow || glow.intensity <= 0 || props.media?.glow === false) {
    return {}
  }
  return {
    filter: `drop-shadow(0 0 ${glow.intensity ?? 1}rem ${glow.color})`,
  }
})

</script>

<style scoped>

</style>