<template>
  <AppMedia
    v-for="id in events"
    :key="id"
    :media="media"
    :random="id"
    class="absolute top-0 left-0 w-full h-full"
    @ended="events.delete(id)"
  />
</template>

<script setup lang="ts">

import { computed, PropType, ref, Ref, watch } from 'vue';
import { Media } from '../types';
import { isGifAnimated } from '../helper';
import { uuid } from 'vue-uuid';
import AppMedia from './AppMedia.vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  media: {
    type: [String, Object as PropType<Media>],
    required: true,
  },
})

const events: Ref<Set<string>> = ref(new Set())

const path: Ref<string | undefined> = computed(() =>
  typeof props.media === 'string' ? props.media : props.media?.path
)

const mediaBlob: Ref<Blob | undefined> = ref()
watch(
  path,
  async path => mediaBlob.value = await getMediaRaw(path),
  { immediate: true }
)
async function getMediaRaw(path?: string): Promise<Blob | undefined> {
  if(!path || path.endsWith('.webm')) {
    return undefined
  }
  const response = await fetch(path)
  return await response.blob()
}


/*const mediaDataUrl: Ref<string | undefined> = ref()
watch(
  mediaBlob,
  async mediaBlob => mediaDataUrl.value = await getMediaDataUrl(mediaBlob),
  { immediate: true }
)
async function getMediaDataUrl(mediaBlob?: Blob): Promise<string | undefined> {
  return new Promise<string>(async (resolve, reject) => {
    if(!mediaBlob) {
      return
    }
    try {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(mediaBlob);
    } catch(e) {
      reject(e)
    }
  })
}*/

const mediaDuration: Ref<number | undefined> = ref(3000)
watch(
  mediaBlob,
  async mediaBlob => mediaDuration.value = await getMediaDuration(mediaBlob),
  { immediate: true }
)
async function getMediaDuration(mediaBlob?: Blob): Promise<number | undefined> {
  if(path.value?.endsWith('.webm')) {
    return undefined
  }
  if(mediaBlob) {
    try {
      return await isGifAnimated(mediaBlob)
    } catch(_) {
      return 3000
    }
  }
  return 3000
}



watch(() => props.progress, (progress, oldProgress) => {
  if(progress > oldProgress) {
    showEventMedia()
  }
})

function showEventMedia(): void {
  const id = uuid.v4()
  events.value.add(id)
  if(mediaDuration.value) {
    setTimeout(() => events.value.delete(id), mediaDuration.value)
  }
}

</script>
