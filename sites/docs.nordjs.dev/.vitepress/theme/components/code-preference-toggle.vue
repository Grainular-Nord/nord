<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useImportPreference } from '../composables/use-import-preference';

const { preference, toggle } = useImportPreference();
const isMounted = ref(false);

// Prevent hydration mismatch by waiting for mount
onMounted(() => {
    isMounted.value = true;
});
</script>

<template>
  <div class="sidebar-import-toggle">
    <span class="label">Import from</span>
    
    <div v-if="isMounted" class="toggle-wrapper" @click="toggle">
      <div class="toggle-track" :class="{ 'is-cdn': preference === 'cdn' }">
        <div class="toggle-thumb"></div>
      </div>
      <span class="status-text">{{ preference === 'package' ? 'NPM' : 'CDN' }}</span>
    </div>
    
    <div v-else class="toggle-wrapper">
      <div class="toggle-track"></div>
      <span class="status-text">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.sidebar-import-toggle {
  padding: 12px 20px; /* Matches default sidebar padding */
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle-track {
  width: 36px;
  height: 20px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.toggle-thumb {
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.toggle-track.is-cdn .toggle-thumb {
  transform: translateX(16px);
}

.status-text {
  min-width: 32px;
  color: var(--vp-c-text-2);
}
</style>