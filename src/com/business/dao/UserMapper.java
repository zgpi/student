package com.business.dao;

import java.util.List;

import com.business.model.User;

public interface UserMapper {

    int insert(User user);

    int insertSelective(User user);

    User selectByUsername(String username);

    User selectByPrimaryKey(String id);
    
    List<User> listUser(int start, int pageNum);
}