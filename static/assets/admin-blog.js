/**
 * Created by dengqiuhua on 2015/10/26.
 */

$(function(){
    getDataList(1, urls.url_api_blog);
});//end jq


//搜索
var data_search={};
//搜索
function searchData(){
    var name = $.trim($("input[name=txtName]").val());
    data_search["name"] = name;
    getDataList(1, urls.url_api_blog);
}

//获取博客
function getDataList(pageindex,url){
    var data2 = new pageData({url: url, callback: "getDataList",data:data_search, pageindex: pageindex}, function (msg) {
        fillDataList(msg,pageindex);
    });
}

//解析博客
function fillDataList(msg,pageindex){
    var html = "";
    if (msg != null && msg != "") {
        html = "<table class=\"table table-striped table-hover\">";
        html += "<tr><th>标题</th><th>作者</th><th>时间</th><th>阅读量</th><th>操作</th></tr>";
        $.each(msg, function (i, n) {
            html += "<tr>";
            html += "<td>";
            html += "<a>" + n.title + "</a>";
            html += "</td>";
            html += "<td>" + n.user + "</td>";
            html += "<td>" + (n.createtime != null ? formateTime(n.createtime) : "--") + "</td>";
            html += "<td>";
            html += n.view_count;
            html += "</td>";
            html += "<td>";
            html += "<a href=\"javascript:;\" onclick=\"deleteData('" + n.title + "'," + n.id + "," + pageindex + ");\"><i class=\"glyphicon glyphicon-trash\"></i> 删除</a>";
            html += "</td>";
            html += "</tr>";
         });
        html += "<table>";
    }else{
        html = "没有博客"
    }
    $("#datalist").html(html);
}

//删除
function deleteData(title,id,pageindex){
    if(confirm("您确定要删除【"+title+"】吗")){
        Ajax(urls.url_api_blog_detail.replace("0",id),{type:"delete"},function(msg){
            if (msg.result) {
                alert2("已删除",1);
                getDataList(pageindex, urls.url_api_blog);
            }else{
                alert2("删除失败", 2);
            }
            return false;
        });
    }
}
