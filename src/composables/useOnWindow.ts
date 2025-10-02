import { onMounted, onUnmounted } from 'vue';

export function useOnWindow(event: string, callback: (event: unknown) => void, options?: boolean | AddEventListenerOptions): void {
  onMounted(() => window.addEventListener(event, callback, options))
  onUnmounted(() => window.removeEventListener(event, callback, options))
}
