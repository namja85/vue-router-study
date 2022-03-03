<script setup>
import { onBeforeRouteUpdate } from 'vue-router';

defineProps(['id']);

onBeforeRouteUpdate((to, from, next) => {
    console.log('in beforeRouteUpdate User component');
    next(vm => console.log('in next callback', vm));
});
</script>

<template>
    <div>User: {{ id }}</div>
</template>