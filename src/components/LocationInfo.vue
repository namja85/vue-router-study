<script setup>
const props = defineProps(['title', 'data']);
const capitalTitle = props.title.charAt(0).toUpperCase() + props.title.slice(1);
</script>

<template>
    <section class="info">
      {{ capitalTitle }}:
      <pre :id="title">{{ data }}</pre>
    </section>
</template>