exports.verify = function () {
    var form = document.getElementById('loginForm');
    var submit = document.getElementById('test');
        if (form.checkValidity() == true) {
            return true
        }
        else return false;
}   