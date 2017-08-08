import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import $ from 'jquery';
//import boolstrap from 'boolstrap';



@Component({
    components: {
        MenuComponent: require('../navmenu/navmenu.vue.html'),
        LoginComponent: require('../login/login.vue.html')
    }
})

export default class AppComponent extends Vue {
}
