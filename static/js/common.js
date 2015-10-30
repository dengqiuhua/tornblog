/**
 * Created by dengqiuhua on 2015/8/25.
 */

$(function () {

    //所有Ajax的post请求需要csrftoken，否则403
    var csrftoken = $.cookie('csrftoken');

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    //提示
    setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip();
    },1000);
});

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

//提示消息
function alert2(msg,type){
    var _type=["panel-primary","panel-success","panel-danger"];
    if(typeof type === "undefined" || type == null || type == "" || isNaN(type)){
        type = 0;
    }else if(type > 2 || type < 0){
        type = 0;
    }
    var margin = Math.random() * 10;
    var html_alert = "<div class=\"panel "+ _type[type] +"\" ";
        html_alert += "style=\"width: 360px;position: absolute;top:320px;box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);left:40%;right: 40%;display: block;padding: 0;margin-left:"+ margin +"px;\">";
        html_alert += "<div class=\"panel-heading\">提示消息";
        html_alert += "<button type=\"button\" class=\"close pull-right\" data-dismiss=\"alert\" aria-label=\"close\" style=\"right: 0;\"><span aria-hidden=\"true\">&times;</span></button>";
        html_alert += "</div>";
        html_alert += "<div class=\"panel-body\" style=\"background-color: #f5f5f5;\">";
        html_alert += msg;
        html_alert += "</div>";
        html_alert += "</div>";
    //移除提醒
    $(html_alert).appendTo("body").delay(3000).animate({top:"-100px",opacity: "1"},320,null,function(){
            $(this).remove();
        }).find("button.close").on("click",function(){
        $(this).parents(".panel").remove();
    });
}

function getalert(msg,type,content){
    var _type=["alert-info","alert-success","alert-warning"];
    type=type==null||type==""?0:type;
    var html_alert="";
    html_alert += "<div class=\"alert alert-dismissible "+_type[type]+" myalert\"  role=\"alert\">";
    html_alert += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";
    html_alert += "<strong>"+msg+"</strong>\t";
    if(typeof content !== "undefined" && content !== "")
        html_alert += content;
    html_alert += "</div>";
    return html_alert;
}


//获取分页数据
var pageData = function (option, callback) {
    var op = {
        pageindex: 1,
        pagesize: 10,
        ispage: true,
        pagecontainer: $(".pagination"),
        pagecounts: 10,
        url: "",
        type: "get",
        callback: "",
        islogin: true,
        data: {}
    };
    $.extend(op, option);
    op.data['pageindex'] = op.pageindex;
    op.data['pagesize'] = op.pagesize;
    var _this = this;
    var ajax = null;
    //从URL地址获取页码
    setTimeout(function () {
        //从地址栏获取页码
        var hash_page = document.location.hash;
        if (hash_page != null && hash_page != "" && hash_page.indexOf("#page=") > -1) {
            var regx = /#page=\d+/;
            var page_hash = regx.exec(hash_page);
            page_hash = page_hash.toString().replace("#page=", "");
            if (page_hash != null && page_hash != "" && !isNaN(page_hash)) {
                op.data['pageindex'] = op.pageindex = parseInt(page_hash);
            }
        }
        //Ajax请求参数
        var param = {
            url: op.url,
            data: op.data,
            type: op.type,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (msg) {
                if (msg != null && msg != "") {
                    if (msg.code == -1 && op.islogin) {
                        showLogin();
                        return false;
                    }
                    //分页
                    var html_page = "";
                    if (msg.counts > op.pagesize)
                        html_page = _this.getPage(op, msg.counts);
                    if (op.pagecontainer != null && op.ispage && op.pagecontainer.length > 0) {
                        op.pagecontainer.html(html_page);
                    }
                    return callback(msg.data, msg.counts, html_page);
                } else {
                    return callback(msg, 0, "");
                }
            }
        };
        ajax = $.ajax(param);
    }, 300);

    //取消请求
    this.abort = function () {
        if (ajax != null) {
            ajax.abort();
        }
    }
};

//获取分页
pageData.prototype.getPage = function (op, counts) {
    var pagesize = op.pagesize;
    var pageindex = op.pageindex;
    var callback = op.callback;
    var pagecount = 0;
    var hash_othors = "";//链接的其他标识
    if (document.location.hash != null && document.location.hash != "") {
        var regx = /#page=\d+/;
        var page_hash = regx.exec(document.location.hash);
        hash_othors = document.location.hash.toString().replace(page_hash, "");
    }

    //计算总页数
    if (counts % pagesize == 0) {
        pagecount = Math.floor(counts / pagesize);
        pagecount = pagecount == 0 ? 1 : pagecount;//至少一页
    } else {
        pagecount = Math.floor(counts / pagesize + 1);
    }
    var html = '<nav>';
    html += '<ul class="pagination">';
    //上一页
    if (pageindex > 1) {
        html += '<li><a href="#page=' + (pageindex - 1) + hash_othors + '" onclick="' + callback + '(' + (pageindex - 1) + ',\'' + op.url + '\')"  aria-label="Previous">上一页</a></li>';
    } else {
        html += '<li class="disabled"><a href="javascript:;" aria-label="Previous">上一页</a></li>';
    }
    //页码
    if (pagecount < op.pagecounts) {
        for (var i = 1; i <= pagecount; i++) {
            html += '<li ' + (i == pageindex ? "class=\"active\"" : "") + '><a href="#page=' + i + hash_othors + '"  onclick="' + callback + '(' + i + ',\'' + op.url + '\')">' + i + '</a></li>';
        }
    } else {
        //断点页码
        var pagelist = [1, 2, 3, 4, 0, pagecount - 3, pagecount - 2, pagecount - 1, pagecount];
        if ($.inArray(pageindex, pagelist) < 0 || pageindex == 4 || pageindex == pagecount - 3) {
            if (pageindex == 4) {
                pagelist = [1, 2, pageindex - 1, pageindex, pageindex + 1, 0, pagecount - 1, pagecount];
            } else if (pageindex == pagecount - 3) {
                pagelist = [1, 2, 0, pageindex - 1, pageindex, pageindex + 1, pagecount - 1, pagecount];
            }
            else {
                pagelist = [1, 2, 0, pageindex - 1, pageindex, pageindex + 1, 0, pagecount - 1, pagecount];
            }
        }
        var pagelength = pagelist.length;
        for (var i = 0; i < pagelength; i++) {
            if (pagelist[i] == 0) {
                html += '<li><span>...</span></li>';
            } else {
                html += '<li ' + (pagelist[i] == pageindex ? "class=\"active\"" : "") + '><a href="#page=' + pagelist[i] + hash_othors + '"  onclick="' + callback + '(' + pagelist[i] + ',\'' + op.url + '\')">' + pagelist[i] + '</a></li>';
            }
        }
    }
    //下一页
    if (pageindex < pagecount) {
        html += '<li><a href="#page=' + (pageindex + 1) + hash_othors + '" onclick="' + callback + '(' + (pageindex + 1) + ',\'' + op.url + '\')" aria-label="Next">下一页</a></li>';
    } else {
        html += '<li class="disabled"><a href="javascript:;" aria-label="Next">下一页</a></li>';
    }
    html += '</ul>';
    html += '</nav>';
    return html;
};

//搜索时，页码初始第一页
function initSearchPage() {
    if (document.location.hash != null && document.location.hash != "" && document.location.hash.indexOf("#page") > -1) {
        var regx = /#page=\d+/;
        var page_hash = regx.exec(document.location.hash);
        document.location.hash = document.location.hash.toString().replace(page_hash, "#page=1");
    }
}

//ajax请求数据,rest
var Ajax = function (url, option, callback) {
    var op = {
        url: url,
        type: "post",
        data: {},
        islogin: true
    };
    $.extend(op, option);
    //Ajax请求参数
    var param = {
        url: op.url,
        data: op.data,
        type: op.type,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            }
        },
        success: function (msg) {
            if (msg != null && msg != "") {
                if (msg.code == -1 && op.islogin) {
                    showLogin();
                    return false;
                }
                return callback(msg);
            } else {
                return callback(null);
            }
        }
    };
    $.ajax(param);
};

//获取网络请求结果
function getResult(msg, action) {
    if (msg != null && msg != "") {
        if (action == null)action = "操作";
        if (msg == -1) {
            showLogin();//登录
            return false;
        } else {
            msg = eval("(" + msg + ")");
            if (msg.result > 0) {
                alert2(action + "成功！", 1);
                return true;
            } else {
                alert2(action + "失败！" + getErrorMsg(msg.error_code), 2);
            }
        }
    } else {
        alert2('网络请求失败，请检查网络。')
    }
    return false;
}

//指定日期转换时间戳
function js_strto_time(str_time) {
    var new_str = str_time.replace(/:/g, '-');
    new_str = new_str.replace(/\//g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    if (arr.length < 4) {
        arr[3] = arr[4] = arr[5] = "00";
    } else if (arr.length == 4) {
        arr[5] = "00";
    }
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return datum.getTime() / 1000;
}

//时间戳转换日期
function getLocalTime(timestamp) {
    if (timestamp != null && timestamp != "") {
        return new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }
    return "";
}

//时间戳转换标准日期
function formateTime(timestamp, isShhort) {
    if (timestamp != null && timestamp != "") {
        var date = new Date(parseInt(timestamp) * 1000);
        if (typeof isShhort != "undefined" && isShhort != "" && isShhort) {
            return date.toLocaleDateString();
        } else {
            var time = "";
            if (date.getHours() > 0) {
                var hours = date.getHours(),
                    minutes = date.getMinutes(),
                    seconds = date.getSeconds();
                hours = hours > 9 ? hours : "0" + hours;
                minutes = minutes > 9 ? minutes : "0" + minutes;
                seconds = seconds > 9 ? seconds : "0" + seconds;
                time = hours + ":" + minutes + ":" + seconds;
            }
            return date.toLocaleDateString() + " " + time;
        }
    }
    return "";
}

//社交时间
function getGamTime(timestamp) {
    var myDate = new Date();
    var now = myDate.getTime();//当前时间戳
    var today = new Date(myDate.toLocaleDateString()).getTime();//今天的时间戳
    var tomorrow = today + 3600 * 24 * 1000;
    //var today = js_strto_time("2015/03/18 01:00:00");
    var yesterday = today - 3600 * 24 * 1000;
    var timestampJS = new Date(parseInt(timestamp) * 1000).getTime();
    //alert(timestamp);
    //var thisYear
    var date = new Date(parseInt(timestamp) * 1000);
    var day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes();
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (timestampJS >= today && timestampJS < tomorrow) {
        //今天
        return "今天" + hours + ":" + minutes;
    } else if (timestampJS >= yesterday  && timestampJS < today) {
        //昨天
        return "昨天" + hours + ":" + minutes;
    } else {
        //今年
        return (date.getMonth() + 1) + "月" + day + "日\t" + hours + ":" + minutes;
    }
}

//文件大小格式化
function formatFileSize(fileseze) {
    if (!isNaN(fileseze)) {
        if (fileseze >= 1024 * 1024) {
            return toDecimal(fileseze / (1024 * 1024)) + "\tMB";
        }else if (fileseze >= 1024) {
            return toDecimal(fileseze / 1024) + "\tKB";
        }else {
            return fileseze + "\t字节";
        }
    }
    return "--";
}

//保留两位小数点
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x*100)/100;
    return f;
}

//判断登录
function checkLogin(isopenLogin) {
    var islogin = false;
    $.ajax({
        url: "/api/user/checklogin/",
        async: false,
        success: function (msg) {
            if (msg != null && msg != "") {
                if (msg == "True") {
                    islogin = true;
                } else {
                    islogin = false;
                    if (isopenLogin != null && isopenLogin) {
                        //打开登录对话框
                        showLogin();
                    }
                }
            }
        }
    });
    return islogin;
}

//打开登录对话框
function showLogin() {
    if ($("#login_modal").length < 1) {
        var username = "";
        if ($.cookie("username") != null && $.cookie("username") != "")username = $.cookie("username");
        var html = "";
        html += "<div id=\"login_modal\" class=\"modal fade\" style=\"z-index:1052;\">";
        html += "<div class=\"modal-dialog\" style=\"width:360px;\">";
        html += "<div class=\"modal-content\">";

        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
        html += '<p style="margin: 0;">';
        html += "<h3>登录</h3>";
        html += '</p>';
        html += '</div>';
        html += "<div class=\"modal-body\" style=\"overflow-y: inherit;\">";
        html += "<form class=\"form-horizontal\">";
        html += "<div class=\"control-group\">";
        html += "<label for=\"inputEmail\" class=\"control-label\">用户名</label>";
        html += "<div class=\"controls\">";
        html += "<input type=\"text\" placeholder=\"用户名\" value=\"" + username + "\" id=\"inputEmail\" class=\"form-control ime\" name=\"username\">";
        html += "</div>";
        html += "</div>";
        html += "<div class=\"control-group\">";
        html += "<label for=\"inputPassword\" class=\"control-label\">密码</label>";
        html += "<div class=\"controls\">";
        html += "<input type=\"password\" value=\"\" placeholder=\"密码\" class=\"form-control ime\" id=\"inputPassword\" name=\"password\" onkeyup=\"if(event.keyCode ==13)login();\">";
        html += "</div>";
        html += "</div>";
        html += "</form>";
        html += "<div class=\"alert hide\" style=\"margin:2px;\"></div>";
        html += "</div>";
        html += "<div class=\"modal-footer\">";
        html += "<a href=\"javascript:;\" name=\"a_btn_submit\" class=\"btn btn-info\" onclick=\"login();\">登录</a>";
        html += "<a href=\"javascript:;\" class=\"btn btn-default\" data-dismiss=\"modal\" aria-hidden=\"true\">取消</a>";
        html += "</div>";

        html += "</div>";//end content
        html += "</div>";//end dialog
        html += "</div>";
        //填充
        $("body").append(html);
    }
    $("#login_modal input[name=password]").val("");
    //显示弹框
    $("#login_modal").modal('show');
    //初始化弹框
    if ($("#login_modal input[name=username]").val() == "") {
        $("#login_modal input[name=username]").focus();
        return false;
    }
    if ($("#login_modal input[name=password]").val() == "") {
        $("#login_modal input[name=password]").focus();
        return false;
    }
    $("#login_modal div.alert").text("").addClass("hide").removeClass("alert-success");
    return false;
}

//登录
function login() {
    var username = $.trim($("#login_modal input[name=username]").val());
    var password = $.trim($("#login_modal input[name=password]").val());
    if (username == "") {
        $("#login_modal input[name=username]").focus();
        return false;
    }
    if (password == "") {
        $("#login_modal input[name=password]").focus();
        return false;
    }
    var csrftoken = $.cookie('csrftoken');
    //加密
    $.getScript("/static/js/md5.js", function () {
        password = hex_md5(password);
        //login
        $.post("/api/user/login/", {username: username, password: password, csrftoken: csrftoken}, function (msg) {
            if (msg != null && msg != "") {
                if (msg.result) {
                    $("#login_modal div.alert").text("登录成功。").removeClass("hide").addClass("alert-success");
                    setTimeout(function(){
                        $("#login_modal div.alert").text("").addClass("hide").removeClass("alert-success");
                        $("#login_modal").modal('hide');
                    }, 720);
                } else {
                    $("#login_modal div.alert").text("登录失败，请检查用户名或密码。").removeClass("hide");
                }
            }
        });
    })

}

//确认提示框
var confirm2 = function(option, callback){
    var op = {
        title: "确认",
        msg: "确认提示",
        textConfirm: "确认",
        textClose: "关闭"
    };
    $.extend(op, option);
    var html = "";
        html += "<div class=\"modal fade\"  id=\"confirmModal\" tabindex=\"-1\" role=\"dialog\">";
        html += "<div class=\"modal-dialog\">";
        html += "<div class=\"modal-content\">";
        html += "<div class=\"modal-header\">";
        html += "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button>";
        html += "<h4 class=\"modal-title\">"+ op.title +"</h4>";
        html += "</div>";
        html += "<div class=\"modal-body\">";
        html += "<p>"+ op.msg +"</p>";
        html += "</div>";
        html += "<div class=\"modal-footer\">";
        html += "<button id=\"btn-confirm\" type=\"button\" class=\"btn btn-primary\">"+ op.textConfirm +"</button>";
        html += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"aria-hidden=\"true\" aria-label=\"Close\">"+ op.textClose +"</button>";
        html += "</div>";
        html += "</div><!-- /.modal-content -->";
        html += "</div><!-- /.modal-dialog -->";
        html += "</div><!-- /.modal -->";
    $(html).appendTo("body");
    $("#confirmModal").modal("show");
    //确认后的回调
    $("#confirmModal").find("#btn-confirm").on("click", function(){
        $("#confirmModal").modal("hide");
        return callback();
    })

};


//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function identityCodeValid(code) {
    var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var pass = true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        // "身份证号格式错误";
        pass = false;
    }else if(!city[code.substr(0,2)]){
        //"地址编码错误";
        pass = false;
    }else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++){
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                //"校验位错误";
                pass = false;
            }
        }
    }
    return pass;
}

//根据身份证获取生日
function getBirthByIdentify(val){
    var birthdayValue;
    if (15 == val.length) { //15位身份证号码
        birthdayValue = val.charAt(6) + val.charAt(7);
        if (parseInt(birthdayValue) < 10) {
            birthdayValue = '20' + birthdayValue;
        }else {
            birthdayValue = '19' + birthdayValue;
        }
        birthdayValue = birthdayValue + '-' + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11);
    }
    if (18 == val.length) { //18位身份证号码
        birthdayValue = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11) + '-' + val.charAt(12) + val.charAt(13);
    }
    return birthdayValue;
}


//根据身份证获取性别
function getSexByIdentify(val){
    var sex;
    if (15 == val.length) { //15位身份证号码
        if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14))
            sex = '男';
        else
            sex = '女';
    }
    if (18 == val.length) { //18位身份证号码
        if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16))
            sex = '男';
        else
            sex = '女';
    }
    return sex;
}
