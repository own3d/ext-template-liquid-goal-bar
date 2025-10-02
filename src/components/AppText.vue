<template>
  <p :style="textStyle">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed, PropType, Ref } from 'vue';
import { FontValues, Glow } from '../types';
import { getTextStyle } from '../helper';

const props = defineProps({
  settings: {
    type: Object as PropType<FontValues>,
    required: true,
  },
  glow: {
    type: Object as PropType<Glow>,
    default: undefined,
  },
})

const textStyle: Ref<object> = computed(() => getTextStyle(props.settings, props.glow))

</script>

<style scoped>

</style>