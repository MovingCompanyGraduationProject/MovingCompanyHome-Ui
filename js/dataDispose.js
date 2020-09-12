function getManager(){
	var json = {};
	json['startTime'] = '';
	json['endTime'] = '';
	json['username'] = '';
	json['pageIndex'] = 1;
	url = "managerquery";
	MySubmitString(JSON.stringify(json) ,url,function(data){
		if(data!=null){
			if(data.msg=="ok"){
				//将数据显示在页面上
				var str = "";
				str +="<table class=\"layui-table\">" + 
				"        <thead>" + 
				"          <tr>" + 
				"            <th>" + 
				"              <div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" + 
				"            </th>" + 
				"            <th>ID</th>" + 
				"            <th>登录名</th>" + 
				"            <th>手机</th>n" + 
				"            <th>邮箱</th>" + 
				"            <th>角色</th>" + 
				"            <th>加入时间</th>" + 
				"            <th>状态</th>" + 
				"            <th>操作</th>" + 
				"        </thead>" + 
				"        <tbody>";
				//遍历数据
				var array = data.jsonarray;
				$.each(array,function(index,element){
					str+="<tr>" + 
				"            <td>" + 
				"              <div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='2'><i class=\"layui-icon\">&#xe605;</i></div>" + 
				"            </td>" + 
				"            <td>"+(index+1)+"</td>" + 
				"            <td>"+element['name']+"</td>" + 
				"            <td>"+element['name']+"</td>" + 
				"            <td>"+element['name']+"</td>" + 
				"            <td>"+element['name']+"</td>" + 
				"            <td>"+element['name']+"</td>" + 
				"            <td class=\"td-status\">" + 
				"              <span class=\"layui-btn layui-btn-normal layui-btn-mini\">已启用</span></td>" + 
				"            <td class=\"td-manage\">" + 
				"              <a onclick=\"member_stop(this,'10001')\" href=\"javascript:;\"  title=\"启用\">" + 
				"                <i class=\"layui-icon\">&#xe601;</i>" + 
				"              </a>" + 
				"              <a title=\"编辑\"  onclick=\"x_admin_show('编辑','admin-edit.html')\" href=\"javascript:;\">" + 
				"                <i class=\"layui-icon\">&#xe642;</i>" + 
				"              </a>" + 
				"              <a title=\"删除\" onclick=\"member_del(this,'要删除的id')\" href=\"javascript:;\">" + 
				"                <i class=\"layui-icon\">&#xe640;</i>" + 
				"              </a>" + 
				"            </td>" + 
				"          </tr>"
				})
				str +="</tbody></table>";
				//将表格添加到body中
				$('#myAdminTable').append(str);
				// document.getElementById("myAdminTable").innerHTML = str;
			}
			else{
				alert("未查询到任何信息！");
			}
		}
		else{
			alert("未查询到任何信息！");
		}
	})
}