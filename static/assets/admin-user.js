/**
 * Created by dengqiuhua on 2015/10/26.
 */

$(function(){
    //用户列表
    getDataList(1, urls.url_api_user);
});//end jq


//搜索条件
var data_search={};
//搜索
function searchData(){
    var name = $.trim($("input[name=txtName]").val());
    data_search["name"] = name;
    getDataList(1, urls.url_api_user);
}

//获取数据分页列表
function getDataList(pageindex,url){
    var data2 = new pageData({url: url, callback: "getDataList",data:data_search, pageindex: pageindex}, function (msg) {
       fillDataList(msg,pageindex);
    });
}

//解析数据列表
function fillDataList(msg,pageindex){
     var html = "",
        photo = "/static/img/user-photo.jpg",
        sex = ["","男","女"];
    if (msg != null && msg != "") {
        html = "<table class=\"table table-striped table-hover\">";
        html += "<tr><th>姓名</th><th>用户名</th><th>性别</th><th>管理员</th><th>操作</th></tr>";
        $.each(msg, function (i, n) {
            //用户头像
            if (n.photo != null && n.photo != "") {
                photo = n.photo;
            }
            var name = n.name != null && n.name != "" ? n.name: n.username;
            html += "<tr>";
            html += "<td>";
            html += "<a>" + name + "</a>";
            html += "</td>";
            html += "<td>" + n.username + "</td>";
            html += "<td>" + (n.sex != null ? sex[n.sex] : "--") + "</td>";
            html += "<td>";
            html += n.is_super;
            html += "</td>";
            html += "<td>";
            html += "<a href=\"\" ><i class=\"glyphicon glyphicon-cog\"></i> 设置角色</a> | ";
            html += "<a href=\"javascript:;\" onclick=\"initResetPwd(" + n.id + ",'" + name + "');\"><i class=\"glyphicon glyphicon-lock\"></i> 重设密码</a> | ";
            html += "<a href=\"javascript:;\" onclick=\"deleteData('" + name + "'," + n.id + "," + pageindex + ");\"><i class=\"glyphicon glyphicon-trash\"></i> 删除</a>";
            html += "</td>";
            html += "</tr>";
         });
        html += "<table>";
    }else{
        html = "没有博客"
    }
    $("#datalist").html(html);
}

//重置密码弹框
function initResetPwd(userid,username){
    if ($("#password_modal").length > 0)$("#password_modal").remove();
    var html = "";
    html += "<div id=\"password_modal\" class=\"modal fade\">";
    html += "<div class=\"modal-dialog\" style=\"width:420px;\">";
    html += "<div class=\"modal-content\">";

    html += '<div class="modal-header">';
    html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    html += '<p style="margin: 0;">';
    html += "<h4>重置用户【"+username+"】的密码</h4>";
    html += '</p>';
    html += '</div>';//end header
    html += "<div class=\"modal-body\" style=\"overflow-y: inherit;\">";

    html += "<form class=\"form-horizontal\" onsubmit=\"return false\">";

    html += "<div class=\"control-group\">";
    html += "<label for=\"inputEmail\" class=\"control-label\">新密码</label><span class=\"text-require\">*</span>";
    html += "<div class=\"controls\">";
    html += "<input type=\"password\" class=\"form-control\" placeholder=\"请牢记您的密码\" id=\"inputEmail\" name=\"password\" onkeypress=\"if(event.keyCode==13||event.which==13){setUserPwd(" + userid + ");}\">";
    html += "</div>";
    html += "</div>";

    html += "</form>";
    html += "<div class=\"alert hide\" style=\"margin:2px;\"></div>";
    html += "</div>";
    html += "<div class=\"modal-footer\">";
    html += "<a href=\"javascript:;\" name=\"a_btn_submit\" class=\"btn btn-info\" onclick=\"setUserPwd(" + userid + ");\">保存修改</a>";
    html += "<a href=\"javascript:;\" class=\"btn btn-default\" data-dismiss=\"modal\" aria-hidden=\"true\" >关闭</a>";
    html += "</div>";

    html += "</div>";//end content
    html += "</div>";//end dialog
    html += "</div>";
    //填充
    $("body").append(html);
    //显示弹框
    $("#password_modal").modal('show');
    $("#password_modal input[name=password]").focus();
    $("#password_modal div.alert").text("").addClass("hide").removeClass("alert-success");
    return false;
}

//重置密码
function setUserPwd(userid){
    var password = $.trim($("#password_modal input[name=password]").val());
    if(password==""){
        $("#password_modal div.alert").text("请输入新密码").removeClass("hide").removeClass("alert-success").addClass("alert-warning");
        $("#password_modal input[name=password]").focus();
        return false;
    }
    //加密
    $.getScript("/static/js/md5.js", function () {
        password = hex_md5(password);
        Ajax(urls.url_api_user_detail.replace("0", userid), {data: {password: password},type:"put"}, function (msg) {
            if (msg.result) {
                $("#password_modal .alert").removeClass("hide").removeClass("alert-warning").addClass("alert-success").text("操作成功！请牢记您的密码。");
                setTimeout(function () {
                    $("#password_modal").modal('hide');
                }, 1700)
            } else {
                $("#password_modal .alert").removeClass("hide").addClass("alert-error").text(msg.error);
            }
        })
    });//md5
}

//删除
function deleteData(title,id,pageindex){
    if(confirm("您要删除【"+title+"】吗？")){
        Ajax(urls.url_api_user_detail.replace("0",id),{type:"delete"},function(msg){
            if (msg.result) {
                alert2("删除成功",1);
                getDataList(pageindex, urls.url_api_user);
            }else{
                alert2("删除失败", 2);
            }
            return false;
        });
    }
}
