package com.business.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.business.model.User;
import com.business.service.UserService;
import com.common.tools.JsonTool;
import com.common.tools.RequestParamUtil;
import com.common.vo.Pager;
import com.common.vo.RetMsg;

@Controller
@RequestMapping("/sys/")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping(value="listUser.do", method=RequestMethod.POST)
	@ResponseBody 
	public String listUser(HttpServletRequest request){
		String params = RequestParamUtil.parseRequestParams(request);
		User userFilter = JsonTool.parseObject(params, User.class);
		Pager pager = JsonTool.parseObject(params, Pager.class);
		List<User> userList = userService.listUser(pager.getPageNumber(), pager.getPageSize());
		return JsonTool.toJsonString("retMsg", RetMsg.success(), "list", userList, "total", 100);
	}
	
	 
}
