// import $ from './event.js'
import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
import '../node_modules/font-awesome/css/font-awesome.css';
import 'chartist';
var onClose = require('./event.js').onClose;
var onLoad = require('./event.js').onLoad;
// import 'bootstrap-validator';
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            // redirect:'/ans',
            component: require('./components/login/login.vue.html')
        },
        {
            path: '/ans',
            component: require('./components/ans/ans.vue.html'),
            children: [
                {
                    path: 'sheet',
                    component: require('./components/ans/sheet/ans_sheet.vue.html')
                }
            ]
        },
        {
            path: '/dashboard',
            component: require('./components/dashboard/dashboard.vue.html'),
            children: [
                {
                    path: 'statistics',
                    component: require('./components/dashboard/statistics/statistics.vue.html')
                },
                {
                    path: 'general',
                    component: require('./components/dashboard/general/general.vue.html')
                }
            ]
        }
    ]
})
// alert(user.role);
if((<any>window).user.isLoggedIn==false){
    router.push('/login');    
}else if((<any>window).user.role== "Student"){
    router.push('/ans/sheet')
}else router.push('/dashboard/statistics')
// router.push('./dashboard/statistics');
// import dashboard from './dashboard/dashboard.ts'
onClose();
// onLoad();
new Vue({
    el: '#app-root',
    router,
    render: h => h(require('./components/app/app.vue.html'))
});
