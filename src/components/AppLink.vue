<script setup>
import { computed } from 'vue';
import { RouterLink, useLink, START_LOCATION } from 'vue-router';

const props = defineProps({
    ...RouterLink.props,
    disabled: Boolean
})

const { route, href, navigate, isActive, isExactActive } = useLink(props);
const isExternalLink = computed(() => typeof props.to === 'string' && props.to.startsWith('http'));
const classes = computed(() => ({ 'router-link-active': isActive.value, 'router-link-exact-active': isExactActive.value }));

</script>

<template>
    <a
        v-if="isExternalLink"
        v-bind="$attrs"
        class="router-link"
        :class="classes"
        target="_blank"
        rel="noopener noreferrer"
        :href="to"
        :tabindex="disabled ? -1 : undefined"
        :aria-disabled="disabled"
    >
        <slot></slot>
    </a>
    <a
        v-else
        v-bind="$attrs"
        class="router-link"
        :class="classes"
        :href="href"
        :tabindex="disabled ? -1 : undefined"
        :aria-disabled="disabled"
        @click="navigate"
    >
        <slot></slot>
    </a>
</template>