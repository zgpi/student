package com.business.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.business.dao.UserMapper;
import com.business.model.User;
import com.business.service.UserService;

@Service("userService")
public class UserServiceImpl implements UserService{

	private UserMapper userMapper;
	
	public UserMapper getUserMapper() {
		return userMapper;
	}
	
	@Autowired
	public void setUserMapper(UserMapper userMapper) {
		this.userMapper = userMapper;
	}

	@Override
	public User getUser(String id) {
		return userMapper.selectByPrimaryKey(id);
	}

	@Override
	public User getUser(String username, String password) {
		return userMapper.selectByUsername(username);
	}

	@Override
	public int addUser(User user) {	
		return userMapper.insert(user);
	}

	@Override
	public boolean getUserIsExist(String username) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int delUser(String id) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateUser(User user) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List<User> getAllUsers() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<User> listUser(int page, int pageSize) {
		int firstResult = (page - 1) * pageSize;
		List<User> list = userMapper.listUser(firstResult, pageSize);
		return list;
	}

}
