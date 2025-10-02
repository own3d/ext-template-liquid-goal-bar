import { ref, Ref, watch, WatchSource } from 'vue';

export function useSvg(getPath: WatchSource<string | undefined>): Ref<string | undefined> {
  const svg: Ref<string | undefined> = ref()
  watch(getPath, async path => {
    if(!path) {
      return
    }
    try {
      const response = await fetch(path)
      if(response.ok) {
        svg.value = await response.text()
      }
    } catch(_) {
    }
  }, { immediate: true })

  return svg

}