var managerjson = window.sessionStorage.getItem("managerjson");
if(managerjson!=null&&managerjson!=''){
	var data = $.parseJSON(managerjson);
	$("#managername").html(data.manager.name);
}
else{
	if ("http://127.0.0.1:8848/MovingCompanyHome-Ui/login.html" != window.location.href) {
		alert("请先登录！");
		window.location.href = "login.html";
	}
}

function loginout(){
	var json = {};
	json['msg'] = "no";
	window.sessionStorage.setItem("managerjson",JSON.stringify(json));
}

function queryManager(index) {
	var json = {};
	json['pageIndex'] = index;
	window.sessionStorage.setItem("managerindex", index);
	if ($("#start").val() != undefined) {
		json['startTime'] = $("#start").val();
	} else {
		json['startTime'] = "";
	}
	if ($('#end').val() != undefined) {
		json['endTime'] = $('#end').val();
	} else {
		json['endTime'] = "";
	}
	if ($('#name').val() != undefined) {
		json['username'] = $('#name').val();
	} else {
		json['username'] = "";
	}
	url = "managerquery";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryManager(data['index']);
			}
			// alert("未查询到任何信息！");
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("managerlist", JSON.stringify(data));
		getManager();
	})
}

function getManager() {
	var my = window.sessionStorage.getItem("managerlist");
	if (my != null && my != '') {
		var data = $.parseJSON(my);
		var array = data.jsonarray;
		//将数据显示在页面上
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"  <tr>" +
			"<th>" +
			"  <div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"</th>" +
			"<th>编号</th>" +
			"<th>登录名</th>" +
			"<th>手机</th>" +
			"<th>邮箱</th>" +
			"<th>角色</th>" +
			"<th>创建时间</th>" +
			"<th>状态</th>" +
			"<th>操作</th>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			//遍历数据
			$.each(array, function(index, element) {
				var iconname = "";
				var mini = "";
				var title = "";
				if (element['status'] == "4") {
					iconname = "&#xe62f;";
					mini = "<span class='layui-btn layui-btn-normal layui-btn-mini layui-btn-disabled'>已停用</span>";
					title = "停用";
				} else {
					iconname = "&#xe601;";
					mini = "<span class=\"layui-btn layui-btn-normal layui-btn-mini\">已启用</span>";
					title = "启用";
				}
				str += "<tr>" +
					"<td>" +
					"  <div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + element['managerid'] +
					";" + element['name'] + "'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"</td>" +
					"<td>" + (index + 1) + "</td>" +
					"<td>" + element['name'] + "</td>" +
					"<td>" + element['tel'] + "</td>" +
					"<td>" + element['email'] + "</td>" +
					"<td>" + element['rose'] + "</td>" +
					"<td>" + ChangeDateFormat(element['createtime'].time) + "</td>" +
					"<td class=\"td-status\">" + mini +
					"</td>" +
					"<td class=\"td-manage\">" +
					"  <a onclick=\"member_stop(this," + element['managerid'] + ")\" href=\"javascript:;\"  title=\"" +
					title + "\">" +
					"<i class=\"layui-icon\">" + iconname +
					"  </i></a>" +
					"  <a title=\"编辑\"  onclick=\"x_admin_show('管理员编辑','admin-edit.html',530,500," + (index + 1) +
					")\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe642;</i>" +
					"  </a>" +
					"  <a title=\"删除\" onclick=\"member_del(this,'" + element['managerid'] + "')\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe640;</i>" +
					"  </a>" +
					"</td>" +
					"  </tr>"
			})
		}
		str += "</tbody></table>";
		//将表格添加到body中
		$('#myAdminTable').html(str);
		$("#allNumber").html(data.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (data.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryAllMemberList(" + (data.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < data.allPageNumber; i++) {
			str += "<span ";
			if (data.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryAllMemberList(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (data.index < data.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryAllMemberList(" + (data.index + 1) + ")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	} else {
		// alert("未查询到任何信息！");
		layer.msg('未查询到任何信息！', {
			icon: 7,
			time: 1000
		});
	}

}

/**
 * 添加管理员
 */
function insertManager() {
	if ($("#username").val() != '' && $("#phone").val() != '' && $("#L_email").val() != '' && $("#L_pass").val() != '' &&
		$(
			"#L_repass").val() != '') {
		var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
		if (reg1.test($("#L_email").val())) {
			if ($("#L_repass").val() == $("#L_pass").val()) {
				var json = {};
				var rolemanagerids = "";
				$("input:checkbox[name='like2[write]']:checked").each(function() {
					rolemanagerids += $(this).val() + ";";
				});
				json['rolemanagerids'] = rolemanagerids;
				json['name'] = $("#username").val();
				json['tel'] = $("#phone").val();
				json['email'] = $("#L_email").val();
				json['password'] = $("#L_pass").val();
				var url = "insertManager";
				MySubmitString(JSON.stringify(json), url, function(data) {
					if (data != null && data.msg == 'ok') {
						layer.msg('添加成功！', {
							icon: 1,
							time: 1000
						});
						setTimeout(function() {
							x_admin_close();
						}, 1000);
					} else if (data != null && data.msg == 'no_1') {
						layer.msg('手机号已存在！', {
							icon: 7,
							time: 1000
						});
					} else if (data != null && data.msg == 'no_9') {
						layer.msg('登录名已存在！', {
							icon: 7,
							time: 1000
						});
					} else {
						layer.msg('添加失败！', {
							icon: 5,
							time: 1000
						});
					}
				})
			} else {
				layer.msg('两次密码不一致！', {
					icon: 7,
					time: 1000
				});
			}
		}
	}
}

/**
 * 修改管理员
 */
function updateManager() {
	var managerNo = window.sessionStorage.getItem("managerNo");
	var my = window.sessionStorage.getItem("managerlist");
	if (my != null && my != '' && managerNo != null && managerNo != '') {
		var data = $.parseJSON(my);
		var array = data.jsonarray[managerNo - 1];
		if ($("#username").val() != '' && $("#phone").val() != '' && $("#L_email").val() != '' && $("#L_pass").val() != '' &&
			$(
				"#L_repass").val() != '') {
			var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
			if (reg1.test($("#L_email").val())) {
				if ($("#L_repass").val() == $("#L_pass").val()) {
					var json = {};
					var rolemanagerids = "";
					$("input:checkbox[name='like2[write]']:checked").each(function() {
						rolemanagerids += $(this).val() + ";";
					});
					json['rolemanagerids'] = rolemanagerids;
					if (array.name != $("#username").val()) {
						json['name'] = $("#username").val();
					} else {
						json['name'] = "";
					}
					if (array.tel != $("#phone").val()) {
						json['tel'] = $("#phone").val();
					} else {
						json['tel'] = "";
					}
					json['email'] = $("#L_email").val();
					if(array.password!=$("#L_pass").val()){
						json['password'] = $("#L_pass").val();
					}
					else{
						json['password'] = "";
					}
					json['status'] = "";
					json['managerid'] = array.managerid;
					var url = "updateManager";
					MySubmitString(JSON.stringify(json), url, function(data) {
						if (data != null && data.msg == 'ok') {
							layer.msg('修改成功！', {
								icon: 1,
								time: 1000
							});
							setTimeout(function() {
								x_admin_close();
							}, 1000);
						} else if (data != null && data.msg == 'no_1') {
							layer.msg('手机号已存在！', {
								icon: 7,
								time: 1000
							});
						} else if (data != null && data.msg == 'no_9') {
							layer.msg('登录名已存在！', {
								icon: 7,
								time: 1000
							});
						} else {
							layer.msg('修改失败！', {
								icon: 5,
								time: 1000
							});
						}
					})
				} else {
					layer.msg('两次密码不一致！', {
						icon: 7,
						time: 1000
					});
				}
			}
		}
	}
}

//处理时间
function ChangeDateFormat(time) {
	var birthdayMilliseconds = parseInt(time);
	//实例化一个新的日期格式，使用1970 年 1 月 1 日至今的毫秒数为参数
	var datetime = new Date(birthdayMilliseconds);
	datetime.setTime(time);
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
//调用：ChangeDateFormat(data[i].arrDate)

/**
 * 查询所有未删除用户
 * @param {Object} index
 */
function queryAllMemberList(index) {
	var json = {};
	json['pageIndex'] = index;
	if ($("#start").val() != undefined && $("#start").val() != null) {
		json['startTime'] = $("#start").val();
	} else {
		json['startTime'] = "";
	}
	if ($('#end').val() != undefined && $('#end').val() != null) {
		json['endTime'] = $('#end').val();
	} else {
		json['endTime'] = "";
	}
	if ($('#username').val() != undefined && $('#username').val() != null) {
		json['username'] = $('#username').val();
	} else {
		json['username'] = "";
	}
	window.sessionStorage.setItem("index", index);
	var url = "queryAllNotDelUserList";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryAllMemberList(data['index']);
			}
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("usernotdellist", JSON.stringify(data));
		getAllMemberList();
	})
}

/**
 * 查询渲染未删除用户列表
 */
function getAllMemberList() {
	var my = window.sessionStorage.getItem("usernotdellist");
	if (my != null && my != "") {
		var data = $.parseJSON(my);
		var array = data.usernotdellist;
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"  <tr>" +
			"<th>" +
			"  <div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"</th>" +
			"<th>编号</th>" +
			"<th>用户名</th>" +
			"<th>性别</th>" +
			"<th>手机</th>" +
			"<th>邮箱</th>" +
			"<th>地址</th>" +
			"<th>加入时间</th>" +
			"<th>状态</th>" +
			"<th>操作</th></tr>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			$.each(array, function(index, element) {
				var iconname = "";
				var mini = "";
				var title = "";
				if (element['userstate'] == "4") {
					iconname = "&#xe62f;";
					mini = "<span class='layui-btn layui-btn-normal layui-btn-mini layui-btn-disabled'>已停用</span>";
					title = "停用";
				} else {
					iconname = "&#xe601;";
					mini = "<span class=\"layui-btn layui-btn-normal layui-btn-mini\">已启用</span>";
					title = "启用";
				}
				str += "  <tr>" +
					"<td>" +
					"  <div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + element['name'] + ";" +
					element['userid'] + "'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"</td>" +
					"<td>" + (index + 1) + "</td>" +
					"<td>" + element['name'] + "</td>" +
					"<td>" + element['sex'] + "</td>" +
					"<td>" + element['usertel'] + "</td>" +
					"<td>" + element['email'] + "</td>" +
					"<td>" + element['address'] + "</td>" +
					"<td>" + ChangeDateFormat(element['createtime'].time) + "</td>" +
					"<td class=\"td-status\">" + mini +
					"</td>" +
					"<td class=\"td-manage\">" +
					"  <a onclick=\"member_stop(this,'" + element['userid'] + "')\" href=\"javascript:;\"  title=\"" + title +
					"\">" +
					"<i class=\"layui-icon\">" + iconname +
					"</i>" +
					"  </a>" +
					"  <a title=\"编辑\"  onclick=\"x_admin_show('编辑','member-edit.html',600,400," + (index + 1) +
					")\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe642;</i>" +
					"  </a>" +
					"  <a onclick=\"x_admin_show('修改密码','member-password.html',600,400," + (index + 1) +
					")\" title=\"修改密码\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe631;</i>" +
					"  </a>" +
					"  <a title=\"删除\" onclick=\"member_del(this,'" + element['userid'] + "')\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe640;</i>" +
					"  </a>" +
					"</td>" +
					"  </tr>";
			})
		}
		str += "</tbody>" +
			"  </table>";
		$("#memberlist").html(str);

		$("#allNumber").html(data.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (data.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryAllMemberList(" + (data.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < data.allPageNumber; i++) {
			str += "<span ";
			if (data.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryAllMemberList(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (data.index < data.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryAllMemberList(" + (data.index + 1) + ")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	}
}

/**
 * 查询所有已删除用户
 * @param {Object} index
 */
function queryAllDelMemberList(index) {
	var json = {};
	json['pageIndex'] = index;
	if ($("#start").val() != undefined) {
		json['startTime'] = $("#start").val();
	} else {
		json['startTime'] = "";
	}
	if ($('#end').val() != undefined) {
		json['endTime'] = $('#end').val();
	} else {
		json['endTime'] = "";
	}
	if ($('#username').val() != undefined) {
		json['username'] = $('#username').val();
	} else {
		json['username'] = "";
	}
	window.sessionStorage.setItem("index", index);
	var url = "queryAllDelUserList";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryAllDelMemberList(data['index']);
			}
			// console.log("未查询到任何用户信息！");
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("userdellist", JSON.stringify(data));
		getAllDelMemberList();
	})
}

/**
 * 查询渲染已删除用户列表
 */
function getAllDelMemberList() {
	var my = window.sessionStorage.getItem("userdellist");
	if (my != null && my != "") {
		var data = $.parseJSON(my);
		var array = data.userdellist;
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"  <tr>" +
			"<th>" +
			"  <div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"</th>" +
			"<th>编号</th>" +
			"<th>用户名</th>" +
			"<th>性别</th>" +
			"<th>手机</th>" +
			"<th>邮箱</th>" +
			"<th>地址</th>" +
			"<th>加入时间</th>" +
			"<th>状态</th>" +
			"<th>操作</th></tr>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			$.each(array, function(index, element) {
				var iconname = "";
				var mini = "";
				var title = "";
				if (element['delstate'] == "0") {
					iconname = "&#xe62f;";
					mini = "已删除";
					title = "恢复";
				} else {
					iconname = "&#xe601;";
					mini = "已启用";
					title = "启用";
				}
				str += "  <tr>" +
					"<td>" +
					"  <div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + element['name'] + ";" +
					element['userid'] + "'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"</td>" +
					"<td>" + (index + 1) + "</td>" +
					"<td>" + element['name'] + "</td>" +
					"<td>" + element['sex'] + "</td>" +
					"<td>" + element['usertel'] + "</td>" +
					"<td>" + element['email'] + "</td>" +
					"<td>" + element['address'] + "</td>" +
					"<td>" + ChangeDateFormat(element['createtime'].time) + "</td>" +
					"<td class=\"td-status\">" +
					"  <span class=\"layui-btn layui-btn-normal layui-btn-mini\">" + mini + "</span></td>" +
					"<td class=\"td-manage\">" +
					"  <a onclick=\"member_recover(this,'" + element['userid'] + "')\" href=\"javascript:;\"  title=\"" + title +
					"\">" +
					"<i class=\"layui-icon\">" + iconname +
					"</i>" +
					"  </a>" +
					"  <a title=\"彻底删除\" onclick=\"member_del(this,'" + element['userid'] + "')\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe640;</i>" +
					"  </a>" +
					"</td>" +
					"  </tr>";
			})
		}
		str += "</tbody>" +
			"  </table>";
		$("#memberlist").html(str);
		$("#allNumber").html(data.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (data.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryAllDelMemberList(" + (data.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < data.allPageNumber; i++) {
			str += "<span ";
			if (data.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryAllDelMemberList(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (data.index < data.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryAllDelMemberList(" + (data.index + 1) +
				")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	}
}

/**
 * 修改用户信息 显示用户详情
 */
function getUserDetailMessage() {
	var userNo = window.sessionStorage.getItem("userNo");
	var my = window.sessionStorage.getItem("usernotdellist");
	if (userNo != null && userNo != '' && my != null && my != '') {
		var data = $.parseJSON(my);
		var mydata = data.usernotdellist[userNo - 1];
		$("#name").attr("value", mydata.name);
		$("#sex").attr("value", mydata.sex);
		$("#userTel").attr("value", mydata.usertel);
		$("#email").attr("value", mydata.email);
		$("#idnumber").attr("value", mydata.idnumber);
		var address = mydata.address.split("-");
		$("#distpicker").distpicker({
			province: address[0],
			city: address[1],
			district: address[2]
		});
	}
}

/**
 * 修改用户信息
 */
function updateUserMessage() {
	if ($("#email").val() != '' && $("#name").val() != '' && $("#userTel").val() != '') {
		var userNo = window.sessionStorage.getItem("userNo");
		var my = window.sessionStorage.getItem("usernotdellist");
		if (userNo != null && userNo != '' && my != null && my != '') {
			var data = $.parseJSON(my);
			var mydata = data.usernotdellist[userNo - 1];
			var json = {};
			json['userid'] = mydata.userid;
			json['disId'] = $("#district1").find('option:selected').attr("data-code");
			json['idnumber'] = $("#idnumber").val();
			json['email'] = $("#email").val();
			json['name'] = $("#name").val();
			json['password'] = "";
			json['usertel'] = $("#userTel").val();
			var url = "updateUserMessage";
			MySubmitString(JSON.stringify(json), url, function(data) {
				if (data != null && data.msg == 'ok') {
					var i = window.sessionStorage.getItem("index");
					queryAllMemberList(i);
					layer.msg('修改成功！', {
						icon: 1,
						time: 1000
					});
					setTimeout(function() {
						x_admin_close();
					}, 1000);
				} else {
					layer.msg('修改失败！', {
						icon: 5,
						time: 1000
					});
				}
			})
		}
	}
}

/**
 * 修改用户密码
 */
function updateUserPassword() {
	if ($("#L_pass").val() != '' && $("#L_repass").val() != '') {
		if ($("#L_pass").val() == $("#L_repass").val()) {
			var userNo = window.sessionStorage.getItem("userNo");
			var my = window.sessionStorage.getItem("usernotdellist");
			if (userNo != null && userNo != '' && my != null && my != '') {
				var data = $.parseJSON(my);
				var mydata = data.usernotdellist[userNo - 1];
				var json = {};
				json['userid'] = mydata.userid;
				json['disId'] = "";
				json['idnumber'] = "";
				json['email'] = "";
				json['name'] = "";
				json['password'] = $("#L_pass").val();
				json['usertel'] = "";
				var url = "updateUserMessage";
				MySubmitString(JSON.stringify(json), url, function(data) {
					if (data != null && data.msg == 'ok') {
						var i = window.sessionStorage.getItem("index");
						queryAllMemberList(i);
						layer.msg('修改成功！', {
							icon: 1,
							time: 1000
						});
						setTimeout(function() {
							x_admin_close();
						}, 1000);
					} else {
						layer.msg('修改失败！', {
							icon: 5,
							time: 1000
						});
					}
				})
			}
		} else {
			layer.msg('两次密码不一致！', {
				icon: 5,
				time: 1000
			});
		}
	}
}

/**
 * 添加用户
 */
function insertUserMessage() {
	if ($("#email").val() != '' && $("#name").val() != '' && $("#userTel").val() != '' && $("#idnumber").val() != '' && $(
			"#password").val() != '') {
		var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
		if (reg1.test($("#email").val())) {
			var json = {};
			json['disId'] = $("#district1").find('option:selected').attr("data-code");
			json['idnumber'] = $("#idnumber").val();
			json['email'] = $("#email").val();
			json['name'] = $("#name").val();
			json['password'] = $("#password").val();
			json['usertel'] = $("#userTel").val();
			json['address'] = $("#myaddress").val();
			var url = "userRegister";
			MySubmitString(JSON.stringify(json), url, function(data) {
				if (data != null && data.msg == 'ok') {
					var i = window.sessionStorage.getItem("index");
					queryAllMemberList(i);
					layer.msg('添加成功！', {
						icon: 1,
						time: 1000
					});
					setTimeout(function() {
						x_admin_close();
					}, 1000);
				} else if (data != null && data.msg == 'no_12') {
					layer.msg('用户名已存在！', {
						icon: 7,
						time: 1000
					});
				} else {
					layer.msg('添加失败！', {
						icon: 5,
						time: 1000
					});
				}
			})
		}
	}
}

/**
 * 
 * @param {Object} index
 */
function queryAllOrderForm(index) {
	var json = {};
	json['pageIndex'] = index;
	window.sessionStorage.setItem("orderindex", index);
	if ($("#start").val() != undefined) {
		json['startTime'] = $("#start").val();
	} else {
		json['startTime'] = "";
	}
	if ($("#end").val() != undefined) {
		json['endTime'] = $("#end").val();
	} else {
		json['endTime'] = "";
	}
	if ($("#startsite").val() != undefined) {
		json['startsite'] = $("#startsite").val();
	} else {
		json['startsite'] = "";
	}
	if ($("#endsite").val() != undefined) {
		json['endsite'] = $("#endsite").val();
	} else {
		json['endsite'] = "";
	}
	var url = "queryAllOrderForm";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryAllOrderForm(data['index']);
			}
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("allorderform", JSON.stringify(data))
		getAllOrderForm();
	})
}

/**
 * 查询渲染所有订单
 */
function getAllOrderForm() {
	var my = window.sessionStorage.getItem("allorderform");
	if (my != null && my != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.allOrderFormList;
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"  <tr>" +
			"<th>" +
			"  <div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"</th>" +
			"<th>编号</th>" +
			"<th>搬家公司</th>" +
			"<th>用户名</th>" +
			"<th>起始地</th>" +
			"<th>目的地</th>" +
			"<th>联系人</th>" +
			"<th>联系电话</th>" +
			"<th>备注</th>" +
			"<th>搬家时间</th>" +
			"<th>下单时间</th>" +
			"<th >操作</th>" +
			"</tr>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			for (var i = 0; i < array.length; i++) {
				str += "  <tr>" +
					"<td>" +
					"  <div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + array[i].orderformid +
					"'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"</td>" +
					"<td>" + (i + 1) + "</td>" +
					"<td>" + array[i].companyMessage.name + "</td>" +
					"<td>" + array[i].user.name + "</td>" +
					"<td>" + array[i].startsite + "</td>" +
					"<td>" + array[i].endsite + "</td>" +
					"<td>" + array[i].name + "</td>" +
					"<td>" + array[i].tel + "</td>" +
					"<td>" + array[i].remark.split(";")[1] + "</td>" +
					"<td>" + ChangeDateFormat(array[i].movingtime.time) + "</td>" +
					"	<td>" + ChangeDateFormat(array[i].createtime.time) + "</td>" +
					"<td class=\"td-manage\">" +
					"  <a title=\"删除\" onclick=\"member_del(this,'" + array[i].orderformid + "')\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe640;</i>" +
					"  </a>" +
					"</td>" +
					"  </tr>";
			}
		}
		str += "</tbody>" +
			"</table>";
		$("#orderlist").html(str);
		$("#allNumber").html(mydata.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (mydata.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryAllOrderForm(" + (mydata.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < mydata.allPageNumber; i++) {
			str += "<span ";
			if (mydata.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryAllOrderForm(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (mydata.index < mydata.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryAllOrderForm(" + (mydata.index + 1) +
				")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	}
}

/**
 * 通过管理员编号ManagerNo渲染数据
 */
function getManagerByManagerNo() {
	var managerNo = window.sessionStorage.getItem("managerNo");
	var my = window.sessionStorage.getItem("managerlist");
	if (my != null && my != '' && managerNo != null && managerNo != '') {
		var mydata = $.parseJSON(my);
		var data = mydata.jsonarray[managerNo - 1];
		$("#username").attr("value", data.name);
		$("#phone").attr("value", data.tel);
		$("#L_email").attr("value", data.email);
		$("#L_pass").attr("value", data.password);
		$("#L_repass").attr("value", data.password);
		var likes = data.rose.split(",");
		if (likes != undefined&&likes.length>0) {
			for (var i = 0; i < likes.length; i++) {
				$("input:checkbox[name='like2[write]']").each(function() {
					if ($(this).attr("title") == likes[i]) {
						$(this).attr("checked", true);
					}
				});
			}
		}
	}
}

/**
 * 查询权限分类并存到sessionStorage中
 * @param {Object} index
 */
function queryAuthorityType(index) {
	var json = {};
	json['pageIndex'] = index;
	json['authoritytypename'] = "";
	window.sessionStorage.setItem("authorityTypeindex", index);
	var url = "queryallauthoritytype";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryAuthorityType(data['index']);
			}
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("allauthoritytype", JSON.stringify(data))
		getAuthorityType();
	})
}

/**
 * 查询渲染权限分类页面
 */
function getAuthorityType() {
	var my = window.sessionStorage.getItem("allauthoritytype");
	if (my != null && my != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.authoritytype;
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"  <tr>" +
			"<th>" +
			"  <div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"</th>" +
			"<th>编号</th>" +
			"<th>分类名称</th>" +
			" <th>创建人</th>" +
			" <th>修改人</th>" +
			" <th>创建时间</th>" +
			" <th>修改时间</th>" +
			"<th>操作</th>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			for (var i = 0; i < array.length; i++) {
				var updatetime = "";
				if (array[i].updatetime == undefined) {
					updatetime = "";
				} else {
					updatetime = ChangeDateFormat(array[i].updatetime.time);
				}
				str += "<tr>" +
					"<td>" +
					"  <div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + array[i].authoritytypeid +
					";" + array[i].authorityname + "'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"</td>" +
					"<td>" + (i + 1) + "</td>" +
					"<td>" + array[i].authorityname + "</td>" +
					"<td>" + array[i].creatorname + "</td>" +
					"<td>" + array[i].modifiername + "</td>" +
					"<td>" + ChangeDateFormat(array[i].createtime.time) + "</td>" +
					"<td>" + updatetime + "</td>" +
					"<td class=\"td-manage\">" +
					"  <a title=\"编辑\"  onclick=\"x_admin_show('权限分类编辑','admin-cate-edit.html',400,200," + (i + 1) +
					")\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe642;</i>" +
					"  </a>" +
					"  <a title=\"删除\" onclick=\"member_del(this,'" + array[i].authoritytypeid + "')\" href=\"javascript:;\">" +
					"<i class=\"layui-icon\">&#xe640;</i>" +
					"  </a>" +
					"</td>" +
					"  </tr>";
			}
		}
		str += "</tbody>" +
			"  </table>";
		$("#myAdminCate").html(str);
		$("#allNumber").html(mydata.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (mydata.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryAuthorityType(" + (mydata.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < mydata.allPageNumber; i++) {
			str += "<span ";
			if (mydata.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryAuthorityType(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (mydata.index < mydata.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryAuthorityType(" + (mydata.index + 1) +
				")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	}
}

/**
 * 添加权限分类
 */
function insertAuthorityType() {
	if ($("#cate_name").val() != '') {
		var json = {};
		json['authorityname'] = $("#cate_name").val();
		var url = "insertauthoritytype";
		MySubmitString(JSON.stringify(json), url, function(data) {
			if (data != null && data.msg == 'ok') {
				var i = window.sessionStorage.getItem("authorityTypeindex");
				queryAuthorityType(i);
				$("#cate_name").attr("value", "");
				layer.msg('添加成功！', {
					icon: 1,
					time: 1000
				});
			} else if (data != null && data.msg == 'no_6') {
				layer.msg('该分类名称已存在！', {
					icon: 5,
					time: 1000
				});
			} else {
				layer.msg('添加失败！', {
					icon: 5,
					time: 1000
				});
			}
		})
	}
}

/**
 * 获取权限分类编号，并存到渲染权限分类编辑页面
 */
function getAuthorityTypeByTypeNo() {
	var typeNo = window.sessionStorage.getItem("typeNo");
	var my = window.sessionStorage.getItem("allauthoritytype");
	if (my != null && my != '' && typeNo != null && typeNo != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.authoritytype;
		$("#authorityname").attr("value", array[typeNo - 1].authorityname);
	}
}

/**
 * 修改权限分类
 */
function updateAuthorityType() {
	var typeNo = window.sessionStorage.getItem("typeNo");
	var my = window.sessionStorage.getItem("allauthoritytype");
	if (my != null && my != '' && typeNo != null && typeNo != '') {
		if ($("#authorityname").val() != null && $("#authorityname").val() != '') {
			var mydata = $.parseJSON(my);
			var array = mydata.authoritytype;
			var json = {};
			json['authorityname'] = $("#authorityname").val();
			json['authoritytypestatus'] = "";
			json['authoritytypeid'] = array[typeNo - 1].authoritytypeid;
			var url = "updateauthoritytype";
			MySubmitString(JSON.stringify(json), url, function(data) {
				if (data != null && data.msg == 'ok') {
					var i = window.sessionStorage.getItem("authorityTypeindex");
					queryAuthorityType(i);
					layer.msg('修改成功！', {
						icon: 1,
						time: 1000
					});
					setTimeout(function() {
						x_admin_close();
					}, 1000);
				} else {
					layer.msg('修改失败！', {
						icon: 5,
						time: 1000
					});
				}
			})
		}
	}
}

/**
 * 查询渲染权限分类下拉框
 */
function getAuthorityTypeSelect() {
	var json = {};
	json['pageIndex'] = 1;
	json['authoritytypename'] = "";
	var url = "queryallauthoritytype1";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			var array = data.authoritytype;
			if (array != undefined) {
				var str = "<option selected hidden disabled value='' id='opt'>所属分类</option>";
				for (var i = 0; i < array.length; i++) {
					str += "<option value='" + array[i].authoritytypeid + "'>" + array[i].authorityname + "</option>";
				}
				$("#cateid").html(str);
			}
		} else {
			layer.msg('未查询到任何权限分类！', {
				icon: 7,
				time: 1000
			});
		}
	})
}

/**
 * 查询权限并存到sessionStorage里
 * @param {Object} index
 */
function queryAuthorityManager(index) {
	var json = {};
	json['pageIndex'] = index;
	json['authorityname'] = "";
	json['authorityrule'] = "";
	window.sessionStorage.setItem("authorityindex", index);
	var url = "queryauthority";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryAuthorityManager(data['index']);
			}
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("allauthority", JSON.stringify(data))
		getAuthorityManager();
	})
}

/**
 * 查询渲染到权限管理界面
 */
function getAuthorityManager() {
	var my = window.sessionStorage.getItem("allauthority");
	if (my != null && my != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.authority;
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"	<tr>" +
			"		<th>" +
			"			<div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"		</th>" +
			"		<th>ID</th>" +
			"		<th>权限规则</th>" +
			"		<th>权限名称</th>" +
			"		<th>所属分类</th>" +
			"		<th>创建人</th>" +
			"		<th>修改人</th>" +
			"		<th>创建时间</th>" +
			"		<th>修改时间</th>" +
			"		<th>操作</th>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			for (var i = 0; i < array.length; i++) {
				var updatetime = "";
				if (array[i].updatetime == undefined) {
					updatetime = "";
				} else {
					updatetime = ChangeDateFormat(array[i].updatetime.time);
				}
				str += "	<tr>" +
					"		<td>" +
					"			<div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + array[i].authoritymanagerid +
					";" + array[i].authorityname + "'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"		</td>" +
					"		<td>" + (i + 1) + "</td>" +
					"		<td>" + array[i].authorityrule + "</td>" +
					"		<td>" + array[i].authorityname + "</td>" +
					"		<td>" + array[i].authoritytypename + "</td>" +
					"		<td>" + array[i].creatorname + "</td>" +
					"		<td>" + array[i].modifiername + "</td>" +
					"<td>" + ChangeDateFormat(array[i].createtime.time) + "</td>" +
					"<td>" + updatetime + "</td>" +
					"		<td class=\"td-manage\">" +
					"			<a title=\"编辑\" onclick=\"x_admin_show('权限管理编辑','admin-rule-edit.html',450,330," + (i + 1) +
					")\" href=\"javascript:;\">" +
					"				<i class=\"layui-icon\">&#xe642;</i>" +
					"			</a>" +
					"			<a title=\"删除\" onclick=\"member_del(this,'" + array[i].authoritymanagerid + "')\" href=\"javascript:;\">" +
					"				<i class=\"layui-icon\">&#xe640;</i>" +
					"			</a>" +
					"		</td>" +
					"	</tr>";
			}
		}
		str += "</tbody>" +
			"</table>";
		$("#myAuthority").html(str);
		$("#allNumber").html(mydata.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (mydata.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryAuthorityManager(" + (mydata.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < mydata.allPageNumber; i++) {
			str += "<span ";
			if (mydata.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryAuthorityManager(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (mydata.index < mydata.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryAuthorityManager(" + (mydata.index + 1) +
				")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	}
}

/**
 * 新增权限
 */
function insertAuthorityManager() {
	if ($("#cateid").val() == null) {
		layer.msg('请选择所属分类！', {
			icon: 7,
			time: 1000
		});
	}
	if ($("#cateid").val() != null && $("#cateid").val() != '' && $("#cate_rule").val() != null && $("#cate_rule").val() !=
		'' && $("#cate_name").val() != null && $("#cate_name").val() != '') {
		var json = {};
		json['authorityrule'] = $("#cate_rule").val();
		json['authorityname'] = $("#cate_name").val();
		json['authoritytypeid'] = $("#cateid").val();
		var url = "insertauthority";
		MySubmitString(JSON.stringify(json), url, function(data) {
			if (data != null && data.msg == 'ok') {
				var i = window.sessionStorage.getItem("authorityindex");
				queryAuthorityManager(i);
				layer.msg('添加成功！', {
					icon: 1,
					time: 1000
				});
				$("#cate_rule").val("");
				$("#cate_name").val("");
			} else if (data != null && data.msg == 'no_7') {
				layer.msg('权限名称已存在！', {
					icon: 7,
					time: 1000
				});
			} else if (data != null && data.msg == 'no_8') {
				layer.msg('权限规则已存在！', {
					icon: 7,
					time: 1000
				});
			} else {
				layer.msg('添加失败！', {
					icon: 5,
					time: 1000
				});
			}
		})
	}
}

/**
 * 根据编号回显权限管理信息
 */
function getAuthorityManagerByAuthorityNo() {
	var my = window.sessionStorage.getItem("allauthority");
	var authorityNo = window.sessionStorage.getItem("authorityNo");
	if (my != null && my != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.authority[authorityNo - 1];
		$("#authorityrule").attr("value", array.authorityrule);
		$("#authorityname").attr("value", array.authorityname);
		$("#cateid").find('option[value="' + array.authoritytypeid + '"]').attr('selected', 'selected');
	}
}

/**
 * 修改权限管理信息
 */
function updateAuthorityManager() {
	var my = window.sessionStorage.getItem("allauthority");
	var authorityNo = window.sessionStorage.getItem("authorityNo");
	if (my != null && my != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.authority[authorityNo - 1];
		if ($("#cateid").val() == null) {
			layer.msg('请选择所属分类！', {
				icon: 7,
				time: 1000
			});
		}
		if ($("#authorityrule").val() != '' && $("#authorityname").val() != '' && $("#cateid").val() != '') {
			var json = {};
			if ($("#authorityrule").val() != array.authorityrule) {
				json['authorityrule'] = $("#authorityrule").val();
			} else {
				json['authorityrule'] = "";
			}
			if ($("#authorityname").val() != array.authorityname) {
				json['authorityname'] = $("#authorityname").val();
			} else {
				json['authorityname'] = "";
			}
			if ($("#cateid").val() != array.authoritytypeid) {
				json['authoritytypeid'] = $("#cateid").val();
			} else {
				json['authoritytypeid'] = "";
			}
			json['authoritymanagerstatus'] = "";
			json['authoritymanagerid'] = array.authoritymanagerid;
			var url = "updateauthority";
			MySubmitString(JSON.stringify(json), url, function(data) {
				if (data != null && data.msg == 'ok') {
					var i = window.sessionStorage.getItem("authorityindex");
					queryAuthorityManager(i);
					layer.msg('修改成功！', {
						icon: 1,
						time: 1000
					});
					setTimeout(function() {
						x_admin_close();
					}, 1000);
				} else if (data != null && data.msg == 'no_7') {
					layer.msg('权限名称已存在！', {
						icon: 7,
						time: 1000
					});
				} else if (data != null && data.msg == 'no_8') {
					layer.msg('权限规则已存在！', {
						icon: 7,
						time: 1000
					});
				} else {
					layer.msg('修改失败！', {
						icon: 5,
						time: 1000
					});
				}
			})
		}
	}
}

/**
 * 查询并将全部角色存放到sessionStorage
 * @param {Object} index
 */
function queryRoleManager(index) {
	var json = {};
	json['pageIndex'] = index;
	if ($("#start").val() != undefined) {
		json['startTime'] = $("#start").val();
	} else {
		json['startTime'] = "";
	}
	if ($("#end").val() != undefined) {
		json['endTime'] = $("#end").val();
	} else {
		json['endTime'] = "";
	}
	if ($("#rolename").val() != undefined) {
		json['rolename'] = $("#rolename").val();
	} else {
		json['rolename'] = "";
	}
	window.sessionStorage.setItem("roleindex", index);
	var url = "queryrole";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			data['index'] = index;
		} else {
			if (index > 1) {
				data['index'] = index - 1;
				queryRoleManager(data['index']);
			}
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
		window.sessionStorage.setItem("allrolelist", JSON.stringify(data))
		getRoleManager();
	})
}

/**
 * 查询渲染角色页面
 */
function getRoleManager() {
	var my = window.sessionStorage.getItem("allrolelist");
	if (my != null && my != '') {
		var mydata = $.parseJSON(my);
		var array = mydata.rolelist;
		var str = "<table class=\"layui-table\">" +
			"<thead>" +
			"	<tr>" +
			"		<th>" +
			"			<div class=\"layui-unselect header layui-form-checkbox\" lay-skin=\"primary\"><i class=\"layui-icon\">&#xe605;</i></div>" +
			"		</th>" +
			"		<th>编号</th>" +
			"		<th>角色名</th>" +
			"		<th>拥有权限规则</th>" +
			"		<th>描述</th>" +
			"		<th>创建人</th>" +
			"		<th>修改人</th>" +
			"		<th>创建时间</th>" +
			"		<th>修改时间</th>" +
			"		<th>状态</th>" +
			"		<th>操作</th>" +
			"</thead>" +
			"<tbody>";
		if (array != undefined) {
			for (var i = 0; i < array.length; i++) {
				var updatetime = "";
				var iconname = "";
				var mini = "";
				var title = "";
				if (array[i].updatetime == undefined) {
					updatetime = "";
				} else {
					updatetime = ChangeDateFormat(array[i].updatetime.time);
				}
				if (array[i].rolestatus == "4") {
					iconname = "&#xe62f;";
					mini = "<span class='layui-btn layui-btn-normal layui-btn-mini layui-btn-disabled'>已停用</span>";
					title = "停用";
				} else {
					iconname = "&#xe601;";
					mini = "<span class=\"layui-btn layui-btn-normal layui-btn-mini\">已启用</span>";
					title = "启用";
				}
				str += "	<tr>" +
					"		<td>" +
					"			<div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\" data-id='" + array[i].rolemanagerid +
					";" + array[i].rolename + "'><i class=\"layui-icon\">&#xe605;</i></div>" +
					"		</td>" +
					"		<td>" + (i + 1) + "</td>" +
					"		<td>" + array[i].rolename + "</td>" +
					"		<td>" + array[i].authoritynames + "</td>" +
					"		<td>" + array[i].roledescribe + "</td>" +
					"		<td>" + array[i].creatorname + "</td>" +
					"		<td>" + array[i].modifiername + "</td>" +
					"<td>" + ChangeDateFormat(array[i].createtime.time) + "</td>" +
					"<td>" + updatetime + "</td>" +
					"<td class=\"td-status\">" + mini + "</td>" +
					"		<td class=\"td-manage\">" +
					"  <a onclick=\"member_stop(this,'" + array[i].rolemanagerid + "')\" href=\"javascript:;\"  title=\"" + title +
					"\">" +
					"<i class=\"layui-icon\">" + iconname +
					"</i>" +
					"  </a>" +
					"			<a title=\"编辑\" onclick=\"x_admin_show('角色管理编辑','admin-role-edit.html',1000,620," + (i + 1) +
					")\" href=\"javascript:;\">" +
					"				<i class=\"layui-icon\">&#xe642;</i>" +
					"			</a>" +
					"			<a title=\"删除\" onclick=\"member_del(this,'" + array[i].rolemanagerid + "')\" href=\"javascript:;\">" +
					"				<i class=\"layui-icon\">&#xe640;</i>" +
					"			</a>" +
					"		</td>" +
					"	</tr>";
			}
		}
		str += "</tbody>" +
			"</table>";
		$("#myRole").html(str);
		$("#allNumber").html(mydata.allNumber);
		var up = 0;
		var down = 0;
		str = "<div>";
		if (mydata.index > 1) {
			str += "<a class=\"prev\" href=\"javascript:;\" onclick='queryRoleManager(" + (mydata.index - 1) +
				")'\">&lt;&lt;</a>";
		} else {
			str += "<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		}
		for (var i = 0; i < mydata.allPageNumber; i++) {
			str += "<span ";
			if (mydata.index - 1 == i) {
				str += "class=\"current\"";
			}
			str += "  href=\"javascript:;\" onclick='queryRoleManager(" + (i + 1) + ")'>" + (i + 1) + "</span>";
		}
		if (mydata.index < mydata.allPageNumber) {
			str += "<a class=\"next\"href=\"javascript:;\" onclick='queryRoleManager(" + (mydata.index + 1) +
				")'>&gt;&gt;</a>";
		} else {
			str += "<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
		}
		str += "</div>";
		$(".page").html(str);
	}
}

/**
 * 查询渲染拥有权限表单
 */
function getRoleManagerTable() {
	var json = {};
	json['pageIndex'] = 1;
	json['authoritytypename'] = "";
	var url = "queryallauthoritytype1";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			var str = "<table  class=\"layui-table layui-input-block\">" +
				"<tbody>";
			var array = data.authoritytype;
			if (array != undefined) {
				for (var i = 0; i < array.length; i++) {
					if (array[i].authorityManager.length > 0) {
						str += "<tr>" +
							"<td>" +
							array[i].authorityname +
							"</td>" +
							"<td>" +
							"<div class=\"layui-input-block\">";
						for (var j = 0; j < array[i].authorityManager.length; j++) {
							str += "<input name=\"id[]\" type=\"checkbox\" data-value='" + array[i].authorityManager[j].authorityname +
								"' value=\"" + array[i].authorityManager[j].authoritymanagerid + "\">" + array[i].authorityManager[j].authorityname;
						}
						str += "</div>" +
							"</td>" +
							"</tr>";
					}
				}
			}
			str += "</tbody>" +
				"</table>";
			$("#roleManagerTable").html(str);
		} else {
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
	})
}

/**
 * 添加角色
 */
function insertRoleManager() {
	var json = {};
	json['roledescribe'] = $("#roledescribe").val();
	json['rolename'] = $("#rolename").val();
	var authoritymanagerids = "";
	$("input:checkbox[name='id[]']:checked").each(function() {
		authoritymanagerids += $(this).val() + ";";
	});
	json['authoritymanagerids'] = authoritymanagerids;
	var url = "insertrole";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			var i = window.sessionStorage.getItem("roleindex");
			getRoleManager(i);
			layer.msg('添加成功！', {
				icon: 1,
				time: 1000
			});
			setTimeout(function() {
				x_admin_close();
			}, 1000);
		} else if (data != null && data.msg == 'no_5') {
			layer.msg('角色名称已存在！', {
				icon: 7,
				time: 1000
			});
		} else {
			layer.msg('添加失败！', {
				icon: 5,
				time: 1000
			});
		}
	})
}

/**
 * 根据roleNo查询渲染角色详情
 */
function getRoleManagerByRoleNo() {
	var roleNo = window.sessionStorage.getItem("roleNo");
	var my = window.sessionStorage.getItem("allrolelist");
	if (my != null && my != '' && roleNo != null && roleNo != '') {
		var mydata = $.parseJSON(my);
		var data = mydata.rolelist[roleNo - 1];
		var authoritynames = data.authoritynames.split(",");
		$("input:checkbox[name='id[]']").each(function() {
			if (authoritynames.length > 0) {
				for (var i = 0; i < authoritynames.length; i++) {
					if (authoritynames[i] == $(this).data("value")) {
						$(this).attr("checked", true);
					}
				}
			}
		});
		$("#rolename").attr("value", data.rolename);
		$("#roledescribe").val(data.roledescribe)
	}
}

/**
 * 修改角色信息
 */
function updataRoleManager() {
	var roleNo = window.sessionStorage.getItem("roleNo");
	var my = window.sessionStorage.getItem("allrolelist");
	if (my != null && my != '' && roleNo != null && roleNo != '') {
		var mydata = $.parseJSON(my);
		var data = mydata.rolelist[roleNo - 1];
		var json = {};
		json['roledescribe'] = $("#roledescribe").val();
		if (data.rolename != $("#rolename").val()) {
			json['rolename'] = $("#rolename").val();
		} else {
			json['rolename'] = "";
		}
		json['rolestatus'] = "";
		var authoritymanagerids = "";
		$("input:checkbox[name='id[]']:checked").each(function() {
			authoritymanagerids += $(this).val() + ";";
		});
		json['authoritymanagerids'] = authoritymanagerids;
		json['rolemanagerid'] = data.rolemanagerid;
		var url = "updaterole";
		MySubmitString(JSON.stringify(json), url, function(data) {
			if (data != null && data.msg == 'ok') {
				var i = window.sessionStorage.getItem("roleindex");
				getRoleManager(i);
				layer.msg('修改成功！', {
					icon: 1,
					time: 1000
				});
				setTimeout(function() {
					x_admin_close();
				}, 1000);
			} else if (data != null && data.msg == 'no_5') {
				layer.msg('角色名称已存在！', {
					icon: 7,
					time: 1000
				});
			} else {
				layer.msg('修改失败！', {
					icon: 5,
					time: 1000
				});
			}
		})
	}
}

function queryRoleManagerInput() {
	var json = {};
	json['pageIndex'] = 1;
	json['startTime'] = "";
	json['endTime'] = "";
	json['rolename'] = "";
	var url = "queryrole1";
	MySubmitString(JSON.stringify(json), url, function(data) {
		if (data != null && data.msg == 'ok') {
			var str = "";
			var mydata = data.rolelist;
			if (mydata != undefined && mydata.length > 0) {
				for (var i = 0; i < mydata.length; i++) {
					str += " <input type='checkbox' name='like2[write]' lay-skin='primary' value='" + mydata[i].rolemanagerid +
						"' title='" + mydata[i].rolename + "'>";
				}
			}
			$("#roleinput").html(str);
		} else {
			layer.msg('未查询到任何信息！', {
				icon: 7,
				time: 1000
			});
		}
	})
}
