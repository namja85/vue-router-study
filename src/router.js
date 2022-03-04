import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import User from './components/User.vue';
import ComponentWithData from './components/ComponentWithData.vue';
import Nested from './components/Nested.vue';
import Dynamic from './components/Dynamic.vue';
import NotFound from './components/NotFound.vue';
import GuardedWithLeave from './components/GuardedWithLeave.vue';
import { globalState } from './store';
import { scrollWaiter } from './scrollWatier';
const component = () => console.log('fetching component') || import('./components/Generic.vue');
let removeRoute;

const routes = [
    { path: '/home', redirect: '/' },
    {
        path: '/',
        components: { default: Home, other: component },
        props: { default: to => ({ waited: to.meta.waitedFor }) }
    },
    { path: '/users/:id', name: 'user', component: User, props: true },
    { path: '/with-data', name: 'WithData', component: ComponentWithData },
    {
        path: '/dynamic',
        name: 'dynamic',
        component: Nested,
        end: false,
        strict: true,
        beforeEnter(to, from, next) {
            if (!removeRoute) {
                removeRoute = router.addRoute('dynamic', {
                    path: 'child',
                    component: Dynamic
                })
                return next(to.fullPath);
            }
            return next();
        }
    },
    {
        path: '/nested',
        alias: '/anidado',
        component: Nested,
        name: 'Nested',
        children: [
            {
                path: 'nested',
                alias: 'a',
                name: 'NestedNested',
                component: Nested,
                children: [
                    {
                        path: 'nested',
                        name: 'NestedNestedNested',
                        component: Nested
                    }
                ]
            },
            {
                path: 'other',
                alias: 'otherAlias',
                component: Nested,
                name: 'NestedOther'
            },
            {
                path: 'also-as-absolute',
                alias: '/absolute',
                name: 'absolute-child',
                component: Nested
            }
        ]
    },
    { path: '/:data(.*)', component: NotFound, name: 'NotFound' },
    { path: '/cant-leave', component: GuardedWithLeave }
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