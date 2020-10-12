function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
      indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}


/**
 * 获取系统的url
 * @returns fullUrl：系统访问路径，例如：http://localhost:8080/amudraya/amudraya
 */
function getURL(){
    var fullUrl = window.location.href;
    var a=fullUrl.lastIndexOf('/');
    fullUrl=fullUrl.substring(0,a);
    var b=fullUrl.lastIndexOf('/');
    fullUrl=fullUrl.substring(0,b);
    var c=fullUrl.lastIndexOf('/');
    fullUrl=fullUrl.substring(0,c);
	console.log(fullUrl);
    return fullUrl;
}

function MySubmit(formName,url,callback) {
	var formdate = getFormData($('#'+formName));
	$.ajax({
		//几个参数需要注意一下
		type: "POST",//方法类型
		dataType: "json",//预期服务器返回的数据类型
		url: "http://localhost:9090/"+url+".do" ,//url
		xhrFields: {
			withCredentials: true,
		},
		async:false,
		data: {
			message:JSON.stringify(formdate)
		},
		success: function (result) {
			console.log(result);//打印服务端返回的数据(调试用)
			callback(result);
		},
		error : function(error) {
			console.log(error);
			alert("我去,网咋还断了！");
		}
	});
}

function MySubmitString(str,url,callback) {
	$.ajax({
		//几个参数需要注意一下
		type: "POST",//方法类型
		dataType: "json",//预期服务器返回的数据类型
		url: "http://localhost:9090/"+url+".do" ,//url
		xhrFields: {
			withCredentials: true,
		},
		data: {
			message:str
		},
		async:false,
		success: function (result) {
			console.log(result);//打印服务端返回的数据(调试用)
			callback(result);
		},
		error : function(error) {
			console.log(error);
			alert("我去,网咋还断了！");
		}
	});
}

function PaySubmitString(str,url,callback) {
	$.ajax({
		//几个参数需要注意一下
		type: "POST",//方法类型
		url: "http://localhost:9090/"+url+".do" ,//url
		xhrFields: {
			withCredentials: true,
		},
		data: {
			message:str
		},
		async:false,
		success: function (result) {
			console.log(result);//打印服务端返回的数据(调试用)
			callback(result);
		},
		error : function(error) {
			console.log(error);
			alert("我去,网咋还断了！");
		}
	});
}