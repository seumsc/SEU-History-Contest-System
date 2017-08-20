import Vue from 'vue';
import { Component } from 'vue-property-decorator';//不能被注释掉！
import $ from 'jquery';
import Chartist from 'chartist';
require('../../../Images/sidebar.png');
require('../../../Images/logo-including-name.png');

$(function () {
$("#statistic").click(function(){
    window.location.reload();
})

    var schoolInfo = {
        "DepartmentID": 711,
        "CounselorName": "郭佳",
        "MaxScore": 91,
        "AverageScore": 75.21,
        "ScoreBandCount": {
            "HigherThan90": 5,
            "HigherThan75": 36,
            "HigherThan60": 100,
            "Failed": 20
        }
    }
    var DepartmentNameMap = {
        "010": "建筑学院",
        "020": "机械工程学院",
        "030": "能源与环境学院",
        "040": "信息科学与工程学院",
        "050": "土木工程学院",
        "060": "电子科学与工程学院",
        "070": "数学学院",
        "080": "自动化学院",
        "090": "计算机科学与工程学院、软件学院",
        "711": "计算机科学与工程学院、软件学院"
    }

    var undo = {
        'students': [
            { "ID": "09016435", "Name": "***REMOVED***", "Score": 60, "CardID": "213161269" },
            { "ID": "09016423", "Name": "***REMOVED***", "Score": 100, "CardID": "213161299" },
            { "ID": "09016414", "Name": "***REMOVED***", "Score": 0, "CardID": "213163210" }

        ]
    };
    var done = {
        'students': [
            { "ID": "09016435", "Name": "***REMOVED***", "Score": 60, "CardID": "213161269" },
            { "ID": "09016423", "Name": "***REMOVED***", "Score": 100, "CardID": "213161299" },
            { "ID": "09016414", "Name": "***REMOVED***", "Score": 0, "CardID": "213163210" }
        ]
    };
    var config = {
        generalInfo: schoolInfo,
        doneNumber: done.students.length,
        undoNumber: undo.students.length,
        total: done.students.length + undo.students.length,
        comments: {
            dones: {
                perfect: "大家都很听话，全部完成作答了哦！",
                common: done.students.length + "人已完成答题,"
            },
            undos: {
                worst: "偌大的学院，到现在还没有一人完成，大家都去哪儿浪了呢？",
                common: "仍有" + undo.students.length + "人未完成。"
            }
        }

    }
    var by = function (name) {
        return function (o, p) {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? 1 : -1;
                }
                return typeof a < typeof b ? 1 : -1;
            }
            else {
                throw ("error");
            }
        }
    }

    function setUndo(UNDO) {
        var undoContent = ""
        for (var undoIteratorIndex = 0; undoIteratorIndex < UNDO.students.length; undoIteratorIndex++) {
            undoContent += '<tr><td>' + UNDO.students[undoIteratorIndex].ID
                + '</td><td>' + UNDO.students[undoIteratorIndex].Name
                + '</td><td>' + UNDO.students[undoIteratorIndex].CardID + '</td></tr>'
        }

        $("#table-undo").find("tbody").html(undoContent);

    }
    function setDone(DONE) {
        var doneContent = "";
        for (var doneIteratorIndex = 0; doneIteratorIndex < DONE.students.length; doneIteratorIndex++) {
            doneContent += '<tr><td>' + DONE.students[doneIteratorIndex].ID
                + '</td><td>' + DONE.students[doneIteratorIndex].Name
                + '</td><td>' + DONE.students[doneIteratorIndex].Score
                + '</td><td>' + DONE.students[doneIteratorIndex].CardID + '</td></tr>'
        }
        $("#table-done").find("tbody").html(doneContent);
    }
    function initChartist() {
        var labelForDone = Math.round(100 * (config.doneNumber / config.total)) + "%";
        var labelForUndo = Math.round(100 * (config.undoNumber / config.total)) + "%";
        //以下总人数还没有和上面的数据统一
        var labelA = Math.round(100 * (config.generalInfo.ScoreBandCount.HigherThan90 / 161)) + "%";
        var labelB = Math.round(100 * (config.generalInfo.ScoreBandCount.Failed / 161)) + "%";
        var labelC = Math.round(100 * (config.generalInfo.ScoreBandCount.HigherThan75 / 161)) + "%";
        var labelD = Math.round(100 * (config.generalInfo.ScoreBandCount.HigherThan60 / 161)) + "%";

        Chartist.Pie('#completion-chart', {

            labels: [labelForDone,
                (config.undoNumber == 0 ? '' : labelForUndo)],
            series: [config.doneNumber, config.undoNumber]
        });
        Chartist.Pie('#overall-chart', {
            labels: [labelA, labelB, labelC, labelD],
            series: [config.generalInfo.ScoreBandCount.HigherThan90,
            config.generalInfo.ScoreBandCount.Failed,
            config.generalInfo.ScoreBandCount.HigherThan75,
            config.generalInfo.ScoreBandCount.HigherThan60
            ]
        });
    }

    function commonSet() {
        $("#school-name").html(DepartmentNameMap[config.generalInfo.DepartmentID]);
        if (config.undoNumber == 0) {
            $("#done-info").html(config.comments.dones.perfect);
            $("#undo-info").hide();
            $("#empty-comment").show();
        }
        else if (config.doneNumber == 0) {
            $("#done-info").hide();
            $("#undo-info").html(config.comments.undos.worst);
            $("#empty-comment").hide();
        }
        else {
            $("#done-info").html(config.comments.dones.common);
            $("#undo-info").html(config.comments.undos.common);
            $("#empty-comment").hide();
        }
        $("#average-score").html(config.generalInfo.AverageScore);

    }
    var temp = $.extend(true, done);//深拷贝 !important
    var cnt = 0;
    $(function () {
        setUndo(undo);
        setDone(done);
        initChartist();
        commonSet();
        console.log(done);
        $("#table-done").find("th.score").click((function () {
            if (cnt % 3 == 0) {
                $("#sort").hide();
                $("#triangle-bottom").show();
                $("#triangle-top").hide();
                if (cnt == 0) {
                    temp.students.sort(by("Score"));
                    setDone(temp);
                    cnt++;
                    return;
                }
                temp.students.reverse();
                cnt++;
                setDone(temp);

            }
            else if (cnt % 3 == 1) {
                $("#sort").hide();
                $("#triangle-bottom").hide();
                $("#triangle-top").show();
                temp.students.reverse();
                cnt++;
                setDone(temp);

            }
            else if (cnt % 3 == 2) {
                $("#sort").show();
                $("#triangle-bottom").hide();
                $("#triangle-top").hide();
                cnt++;
                setDone(done);

            }
        }))
        //先隐藏再筛选
        $("#search-undo-text").keyup(function () {
            var $key = $('#search-undo-text').val();
            $('#table-undo table tbody tr').hide().filter(":contains('" + $key + "')").show();
        });
        $("#search-done-text").keyup(function () {
            var $key = $('#search-done-text').val();
            $('#table-done table tbody tr').hide().filter(":contains('" + $key + "')").show();
        });
        $.notify({
            icon: 'glyphicon glyphicon-heart-empty',
            message: "您好，" + schoolInfo.CounselorName + "，欢迎来到校史校情知识竞赛管理系统"

        }, {
                type: 'info',
                timer: 3000
            });
    });
    
})

$(function () {

    /* CHECKBOX PUBLIC CLASS DEFINITION
     * ============================== */

    var Checkbox = function (element, options) {
        this.init(element, options);
    }

    Checkbox.prototype = {

        constructor: Checkbox,
        init: function (element, options) {
            var $el = this.$element = $(element)

            this.options = $.extend({}, $.fn.checkbox.defaults, options);
            $el.before(this.options.template);
            this.setState();
        }

        , setState: function () {
            var $el = this.$element
                , $parent = $el.closest('.checkbox');

            $el.prop('disabled') && $parent.addClass('disabled');
            $el.prop('checked') && $parent.addClass('checked');
        }

        , toggle: function () {
            var ch = 'checked'
                , $el = this.$element
                , $parent = $el.closest('.checkbox')
                , checked = $el.prop(ch)
                , e = $.Event('toggle')

            if ($el.prop('disabled') == false) {
                $parent.toggleClass(ch) && checked ? $el.removeAttr(ch) : $el.prop(ch, ch);
                $el.trigger(e).trigger('change');
            }
        }

        , setCheck: function (option) {
            var d = 'disabled'
                , ch = 'checked'
                , $el = this.$element
                , $parent = $el.closest('.checkbox')
                , checkAction = option == 'check' ? true : false
                , e = $.Event(option)

            $parent[checkAction ? 'addClass' : 'removeClass'](ch) && checkAction ? $el.prop(ch, ch) : $el.removeAttr(ch);
            $el.trigger(e).trigger('change');
        }

    }


    /* CHECKBOX PLUGIN DEFINITION
     * ======================== */

    var old = $.fn.checkbox

    $.fn.checkbox = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('checkbox')
                , options = $.extend({}, $.fn.checkbox.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) $this.data('checkbox', (data = new Checkbox(this, options)));
            if (option == 'toggle') data.toggle()
            if (option == 'check' || option == 'uncheck') data.setCheck(option)
            else if (option) data.setState();
        });
    }

    $.fn.checkbox.defaults = {
        template: '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'
    }


    /* CHECKBOX NO CONFLICT
     * ================== */

    $.fn.checkbox.noConflict = function () {
        $.fn.checkbox = old;
        return this;
    }


    /* CHECKBOX DATA-API
     * =============== */

    $(document).on('click.checkbox.data-api', '[data-toggle^=checkbox], .checkbox', function (e) {
        var $checkbox = $(e.target);
        if (e.target.tagName != "A") {
            e && e.preventDefault() && e.stopPropagation();
            if (!$checkbox.hasClass('checkbox')) $checkbox = $checkbox.closest('.checkbox');
            $checkbox.find(':checkbox').checkbox('toggle');
        }
    });

    $(function () {
        $('[data-toggle="checkbox"]').each(function () {
            var $checkbox = $(this);
            $checkbox.checkbox();
        });
    });

});



/* =============================================================
 * flatui-radio v0.0.3
 * ============================================================ */

$(function () {

    /* RADIO PUBLIC CLASS DEFINITION
     * ============================== */

    var Radio = function (element, options) {
        this.init(element, options);
    }

    Radio.prototype = {

        constructor: Radio

        , init: function (element, options) {
            var $el = this.$element = $(element)

            this.options = $.extend({}, $.fn.radio.defaults, options);
            $el.before(this.options.template);
            this.setState();
        }

        , setState: function () {
            var $el = this.$element
                , $parent = $el.closest('.radio');

            $el.prop('disabled') && $parent.addClass('disabled');
            $el.prop('checked') && $parent.addClass('checked');
        }

        , toggle: function () {
            var d = 'disabled'
                , ch = 'checked'
                , $el = this.$element
                , checked = $el.prop(ch)
                , $parent = $el.closest('.radio')
                , $parentWrap = $el.closest('form').length ? $el.closest('form') : $el.closest('body')
                , $elemGroup = $parentWrap.find(':radio[name="' + $el.attr('name') + '"]')
                , e = $.Event('toggle')

            if ($el.prop(d) == false) {
                $elemGroup.not($el).each(function () {
                    var $el = $(this)
                        , $parent = $(this).closest('.radio');

                    if ($el.prop(d) == false) {
                        $parent.removeClass(ch) && $el.removeAttr(ch).trigger('change');
                    }
                });

                if (checked == false) $parent.addClass(ch) && $el.prop(ch, true);
                $el.trigger(e);

                if (checked !== $el.prop(ch)) {
                    $el.trigger('change');
                }
            }
        }

        , setCheck: function (option) {
            var ch = 'checked'
                , $el = this.$element
                , $parent = $el.closest('.radio')
                , checkAction = option == 'check' ? true : false
                , checked = $el.prop(ch)
                , $parentWrap = $el.closest('form').length ? $el.closest('form') : $el.closest('body')
                , $elemGroup = $parentWrap.find(':radio[name="' + $el['attr']('name') + '"]')
                , e = $.Event(option)

            $elemGroup.not($el).each(function () {
                var $el = $(this)
                    , $parent = $(this).closest('.radio');

                $parent.removeClass(ch) && $el.removeAttr(ch);
            });

            $parent[checkAction ? 'addClass' : 'removeClass'](ch) && checkAction ? $el.prop(ch, ch) : $el.removeAttr(ch);
            $el.trigger(e);

            if (checked !== $el.prop(ch)) {
                $el.trigger('change');
            }
        }

    }


    /* RADIO PLUGIN DEFINITION
     * ======================== */

    var old = $.fn.radio

    $.fn.radio = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('radio')
                , options = $.extend({}, $.fn.radio.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) $this.data('radio', (data = new Radio(this, options)));
            if (option == 'toggle') data.toggle()
            if (option == 'check' || option == 'uncheck') data.setCheck(option)
            else if (option) data.setState();
        });
    }

    $.fn.radio.defaults = {
        template: '<span class="icons"><span class="first-icon fa fa-circle-o"></span><span class="second-icon fa fa-dot-circle-o"></span></span>'
    }


    /* RADIO NO CONFLICT
     * ================== */

    $.fn.radio.noConflict = function () {
        $.fn.radio = old;
        return this;
    }


    /* RADIO DATA-API
     * =============== */

    $(document).on('click.radio.data-api', '[data-toggle^=radio], .radio', function (e) {
        var $radio = $(e.target);
        e && e.preventDefault() && e.stopPropagation();
        if (!$radio.hasClass('radio')) $radio = $radio.closest('.radio');
        $radio.find(':radio').radio('toggle');
    });

    $(function () {
        $('[data-toggle="radio"]').each(function () {
            var $radio = $(this);
            $radio.radio();
        });
    });

});


/* ============================================================
 * bootstrapSwitch v1.3 by Larentis Mattia @spiritualGuru
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */


$(function () {
    "use strict";

    $.fn['bootstrapSwitch'] = function (method) {
        var methods = {
            init: function () {
                return this.each(function () {
                    var $element = $(this)
                        , $div
                        , $switchLeft
                        , $switchRight
                        , $label
                        , myClasses = ""
                        , classes = $element.attr('class')
                        , color
                        , moving
                        , onLabel = "ON"
                        , offLabel = "OFF"
                        , icon = false;

                    $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
                        if (classes.indexOf(el) >= 0)
                            myClasses = el;
                    });

                    $element.addClass('has-switch');

                    if ($element.data('on') !== undefined)
                        color = "switch-" + $element.data('on');

                    if ($element.data('on-label') !== undefined)
                        onLabel = $element.data('on-label');

                    if ($element.data('off-label') !== undefined)
                        offLabel = $element.data('off-label');

                    if ($element.data('icon') !== undefined)
                        icon = $element.data('icon');

                    $switchLeft = $('<span>')
                        .addClass("switch-left")
                        .addClass(myClasses)
                        .addClass(color)
                        .html(onLabel);

                    color = '';
                    if ($element.data('off') !== undefined)
                        color = "switch-" + $element.data('off');

                    $switchRight = $('<span>')
                        .addClass("switch-right")
                        .addClass(myClasses)
                        .addClass(color)
                        .html(offLabel);

                    $label = $('<label>')
                        .html("&nbsp;")
                        .addClass(myClasses)
                        .attr('for', $element.find('input').attr('id'));

                    if (icon) {
                        $label.html('<i class="' + icon + '"></i>');
                    }

                    $div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);

                    if ($element.data('animated') !== false)
                        $div.addClass('switch-animate').data('animated', true);

                    $div
                        .append($switchLeft)
                        .append($label)
                        .append($switchRight);

                    $element.find('>div').addClass(
                        $element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
                    );

                    if ($element.find('input').is(':disabled'))
                        $(this).addClass('deactivate');

                    var changeStatus = function ($this) {
                        $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
                    };

                    $element.on('keydown', function (e) {
                        if (e.keyCode === 32) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            changeStatus($(e.target).find('span:first'));
                        }
                    });

                    $switchLeft.on('click', function (e) {
                        changeStatus($(this));
                    });

                    $switchRight.on('click', function (e) {
                        changeStatus($(this));
                    });

                    $element.find('input').on('change', function (e) {
                        var $this = $(this)
                            , $element = $this.parent()
                            , thisState = $this.is(':checked')
                            , state = $element.is('.switch-off');

                        e.preventDefault();

                        $element.css('left', '');

                        if (state === thisState) {

                            if (thisState)
                                $element.removeClass('switch-off').addClass('switch-on');
                            else $element.removeClass('switch-on').addClass('switch-off');

                            if ($element.data('animated') !== false)
                                $element.addClass("switch-animate");

                            $element.parent().trigger('switch-change', { 'el': $this, 'value': thisState })
                        }
                    });

                    $element.find('label').on('mousedown touchstart', function (e) {
                        var $this = $(this);
                        moving = false;

                        e.preventDefault();
                        e.stopImmediatePropagation();

                        $this.closest('div').removeClass('switch-animate');

                        if ($this.closest('.has-switch').is('.deactivate'))
                            $this.unbind('click');
                        else {
                            $this.on('mousemove touchmove', function (e) {
                                var $element = $(this).closest('.switch')
                                    , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
                                    , percent = (relativeX / $element.width()) * 100
                                    , left = 25
                                    , right = 75;

                                moving = true;

                                if (percent < left)
                                    percent = left;
                                else if (percent > right)
                                    percent = right;

                                $element.find('>div').css('left', (percent - right) + "%")
                            });

                            $this.on('click touchend', function (e) {
                                var $this = $(this)
                                    , $target = $(e.target)
                                    , $myCheckBox = $target.siblings('input');

                                e.stopImmediatePropagation();
                                e.preventDefault();

                                $this.unbind('mouseleave');

                                if (moving)
                                    $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                                else $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));

                                moving = false;
                                $myCheckBox.trigger('change');
                            });

                            $this.on('mouseleave', function (e) {
                                var $this = $(this)
                                    , $myCheckBox = $this.siblings('input');

                                e.preventDefault();
                                e.stopImmediatePropagation();

                                $this.unbind('mouseleave');
                                $this.trigger('mouseup');

                                $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                            });

                            $this.on('mouseup', function (e) {
                                e.stopImmediatePropagation();
                                e.preventDefault();

                                $(this).unbind('mousemove');
                            });
                        }
                    });
                }
                );
            },
            toggleActivation: function () {
                $(this).toggleClass('deactivate');
            },
            isActive: function () {
                return !$(this).hasClass('deactivate');
            },
            setActive: function (active) {
                if (active)
                    $(this).removeClass('deactivate');
                else $(this).addClass('deactivate');
            },
            toggleState: function (skipOnChange) {
                var $input = $(this).find('input:checkbox');
                $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
            },
            setState: function (value, skipOnChange) {
                $(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
            },
            status: function () {
                return $(this).find('input:checkbox').is(':checked');
            },
            destroy: function () {
                var $div = $(this).find('div')
                    , $checkbox;

                $div.find(':not(input:checkbox)').remove();

                $checkbox = $div.children();
                $checkbox.unwrap().unwrap();

                $checkbox.unbind('change');

                return $checkbox;
            }
        };

        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            $.error('Method ' + method + ' does not exist!');
    };
})

