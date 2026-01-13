<script setup lang="ts">
import { useImportPreference } from '../composables/use-import-preference';
const { preference } = useImportPreference();
</script>

<template>
    <ClientOnly>
        <div class="code-preference-switch">
            <div v-show="preference === 'package'" class="code-block-wrapper">
                <slot name="package" />
            </div>
            <div v-show="preference === 'cdn'" class="code-block-wrapper">
                <slot name="cdn" />
            </div>
        </div>
    </ClientOnly>
</template>

<style scoped>
    .code-preference-switch {
        margin: 16px 0;
    }
</style>