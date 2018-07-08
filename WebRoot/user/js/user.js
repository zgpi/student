/**
 * 初始化表格信息
 */
function initDatagrid() {
	var opts = {
		columns : [ [
				{
					field : 'userid',
					title : '用户名',
					width : '12%',
					align : 'center'
				},
				{
					field : 'username',
					title : '姓名',
					width : '15%',
					align : 'center'
				},
				{
					field : 'usersex',
					title : '性别',
					width : '15%',
					align : 'center',
					formatter : function(value, row, index) {
						var sexMap = {
							'1' : '男',
							'2' : '女',
							'3' : '未知'
						};
						var text = sexMap[value];
						return text ? text : '';
					}
				},
				{
					field : 'userpwd',
					title : '密码',
					width : '7%',
					align : 'center'
				},
				{
					field : '_operate',
					title : '操作',
					width : '10%',
					align : 'center',
					formatter : function(value, row, index) {
						if (row.userid) {
							return '<a href="#" onclick="mod(\''
									+ row.userid
									+ '\')">修改</a>&nbsp;&nbsp;&nbsp;'
									+ '<a href="#" onclick="del(\''
									+ row.userid
									+ '\')">删除</a>';
						} else {
							return '';
						}
					}
				} ] ]
	};
	initTable("tb", opts, "/student/sys/listUser.do", function() {
		var param = $("#searchForm").serializeObject();
		return param;
	});
}

/**
 * 列表查询
 */
function query() {
	$("#tb").datagrid("reload");
}

// 页面参数重置
function reset() {
	$('#searchForm').form("reset");
}

function mod(userid){
	alert("修改"+userid);
}