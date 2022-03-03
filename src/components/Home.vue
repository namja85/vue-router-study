<script setup>
import { ref } from 'vue';

defineProps(['waited']);
const toggle = ref(false);
const counter = ref(0);
const someData = ref(0);

function log(value) {
    console.log(value);
    return value;
}
</script>

<template>
    <div>
        <div>Home</div>
        <p>My Data is: {{ someData }}</p>
        <p v-if="waited !== undefined">I waited for {{ waited }}</p>
        toggle: {{ log(toggle) }}
        <button @click="counter++">{{ counter }}</button>
    </div>
</template>