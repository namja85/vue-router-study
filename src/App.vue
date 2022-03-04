<script setup>
import { computed, inject, ref } from 'vue';
import { useLink, useRoute } from 'vue-router';
import AppLink from './components/AppLink.vue';
import LocationInfo from './components/LocationInfo.vue';
import { scrollWaiter } from './scrollWatier';

const route = useRoute();
const state = inject('state');
const viewName = ref('default');

// useLink({ to: '/' });
// useLink({ to: '/documents/hello' });
// useLink({ to: '/children' });

const currentLocation = computed(() => {
  const { matched, ...rest } = route;
  return rest;
});

function flushWaiter() {
  scrollWaiter.flush();
}
function setupWaiter() {
  scrollWaiter.add();
}

function toggleViewName() {
  viewName.value = viewName.value === 'default' ? 'other' : 'default';
}

const nextUserLink = computed(() => `/users/${Number(route.value.params.id || 0) + 1}`);
</script>

<template>
  <div>
    <pre>{{ currentLocation }}</pre>
    <LocationInfo
      v-for="(item, index) in Object.keys(currentLocation)"
      :key="index"
      :title="item"
      :data="currentLocation[item]"
    />

    <hr>

    <label>
      <input type="checkbox" v-model="state.cancelNextNavigation">Cancel Next Navigation
    </label>

    <ul>
      <li>
        <router-link to="/home">Home (redirects)</router-link>
      </li>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <AppLink to="/">AppLink Home</AppLink>
      </li>
      <li>
        <router-link to="/users/5">/users/5</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'user', params: { id: Number(currentLocation.params.id || 0) + 1 } }">/users/{{ Number(currentLocation.params.id || 0) + 1 }}</router-link>
      </li>
    </ul>
    <button @click="toggleViewName">Toggle view</button>

    <Suspense>
      <template #default>
        <router-view :name="viewName" v-slot="{ Component, route }">
          <Transition
            :name="route.meta.transition || 'fade'"
            mode="out-in"
            @before-enter="flushWaiter"
            @before-leave="setupWaiter"
          >
            <KeepAlive>
              <component :is="Component" :key="route.name === 'repeat' ? route.path : undefined"></component>
            </KeepAlive>
          </Transition>
        </router-view>
      </template>
      <template #fallback>Loading...</template>
    </Suspense>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  transform: scale(0.8);
}
</style>