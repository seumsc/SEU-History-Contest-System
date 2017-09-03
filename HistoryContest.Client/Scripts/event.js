var $ = require("../node_modules/jquery/dist/jquery.min.js");
// var jQuery = require("../../node_modules/jquery/dist/jquery.min.js");
// var $ = jQuery.noConflict();

function onbeforeunload_handler() {
    var warning="closing...";
    $.ajax({
        url: '/api/Account/Logout',
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "POST",
        success: function (req) {
            console.log(req);
            alert("closing...")
        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
    });
    // alert("closing");
    return;
    // return warning;
}
exports.onClose=function(){
    window.onbeforeunload = onbeforeunload_handler;    
}
