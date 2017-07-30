import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import $ from 'jquery';
$(function(){
  //  $(this).css("background-color","#aaa");
    $("#list2").click(function(){
        alert("确认开始答题吗？（答题过程中不能关闭窗口）");
        window.open('../href/index.html');
    }); 
});
/*
@Component
export default class CounterComponent extends Vue {
    currentcount: number = 0;

    incrementCounter() {
        this.currentcount++;
    }
}
*/
export default class CounterComponent extends Vue {
}