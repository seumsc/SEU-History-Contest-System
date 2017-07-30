import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import $ from 'jquery';



$(function(){
  //  $("#app-root").css({"background":"url(./Images/background1.jpg)","height":"100"});
//  $("#app-root").css("height","100");
//   $("body").css({"background-image":"url(./Images/background1.jpg)","background-repeat":"no-repeat"});

/*	$("button").click(function(){
	window.open('index.html');
	});
	$.backstretch([
		'../../Images/background1.jpg',
		'../../Images/background2.jpg',
		'../../Images/background3.jpg',
    '../../Images/background4.jpg',
    '../../Images/background5.jpg',
    '../../Images/background6.jpg',
    '../../Images/background7.jpg',

	], {
		fade : 1000, // 动画时长
		duration : 2000 // 切换延时
	});
*/
	
});

@Component({
    components: {
        MenuComponent: require('../navmenu/navmenu.vue.html')
    }
})

export default class AppComponent extends Vue {
}
