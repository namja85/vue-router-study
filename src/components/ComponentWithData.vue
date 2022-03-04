<script setup>
import { reactive, toRef } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { getData } from '../../api';

const data = reactive({
    other: 'old',
    fromApi: null
});


onBeforeRouteUpdate(async (to, from, next) => {
    data.fromApi = await getData();
    next();
});

data.fromApi = await getData();
</script>

<template>
    <div>
        <p>Here is the data: {{ data.fromApi }}</p>
        other {{ data.other }}
    </div>
</template>