<template>
  <div
    class="w-full h-full"
    :style="{ clipPath: `url(#${id})` }"
  >
    <div
      v-if="svg"
      ref="svgElement"
      v-html="svg"
      class="absolute"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue';
import { uuid } from 'vue-uuid';
import { useSvg } from '../composables/useSvg';

const props = defineProps({
  clipSvgPath: {
    type: String,
    default: undefined,
  }
})

const path: Ref<string | undefined> = computed(() => {
  const path = props.clipSvgPath
  if(path) {
    const baseUrlRaw = import.meta.env.BASE_URL ?? ''
    const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw
    return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`
  }
  return undefined
})

const svg: Ref<string | undefined> = useSvg(path)
watch(svg, setSvgElementId, { flush: 'post' })

const id: string = uuid.v4()

const svgElement: Ref<HTMLElement | null> = ref(null)
watch(svgElement, setSvgElementId, { immediate: true })

function setSvgElementId(): void {
  if(svgElement.value) {
    const children = svgElement.value.getElementsByTagName('clipPath')
    if(children.length) {
      children[0].id = id
    }
  }
}

</script>

<style scoped>

</style>