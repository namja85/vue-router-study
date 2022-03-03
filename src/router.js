import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import User from './components/User.vue';
import { globalState } from './store';
import { scrollWaiter } from './scrollWatier';
const component = () => console.log('fetching component') || import('./components/Generic.vue');

const routes = [
    { path: '/home', redirect: '/' },
    {
        path: '/',
        components: { default: Home, other: component },
        props: { default: to => ({ waited: to.meta.waitedFor }) }
    },
    { path: '/users/:id', name: 'user', component: User, props: true }
];

export const router = createRouter({
    history: createWebHistory(),
    strict: true,
    routes,
    async scrollBehavior(to, from, savedPosition) {
        await scrollWaiter.wait();

        if (savedPosition) {
            return savedPosition;
        }

        if (to.matched.every((record, index) => from.matched[index] !== record)) {
            return { top: 0, left: 0 };
        }

        return false;
    }
});

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

router.beforeEach(async (to, from, next) => {
    if (to.params.id === 'no-name') {
        return next(false);
    }

    const time = +to.query.delay;
    if (time > 0) {
        console.log(`⏳ waiting ${time}ms`);
        to.meta.waitedFor = time;
        await delay(time);
    }
    next();
});

router.beforeEach((to, from, next) => {
    if (globalState.cancelNextNavigation) {
        console.log('cancelNextNavigation');
        next(false);
    }
    next();
});