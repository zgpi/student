package com.common.dao;

import java.io.Serializable;
import java.util.List;

/**
 * DAO 基类接口
 *
 * @param <E>  E pojo
 * @param <PK> PK 主键
 */
public interface IBaseDao<E, PK extends Serializable> {

    /**
     * 获取当前对象的所有记录
     *
     * @return 所有记录
     */
    List<E> findAll();

    /**
     * 查找所有，并分页
     *
     * @param page     要返回的页数
     * @param pageSize 没有记录数
     * @return
     */
    List<E> pageAll(int page, int pageSize);

    /**
     * 保存对象
     *
     * @param e 对象
     */
    Serializable save(E e);

    /**
     * 删除对象
     *
     * @param e 对象
     */
    void delete(E e);

    /**
     * 与findByProperty相似，当properyName == value 时把相应的记录删除
     */
    void deleteByProperty(String propertyName, Object value);

    /**
     * 通过属性查找
     *
     * @param propertyName 属性名称
     * @param value        属性的值
     * @return
     */
    List<E> findByProperty(String propertyName, Object value);

    /**
     * 通过多个属性查找
     *
     * @param propertyNames 属性名称数组
     * @param values        属性值数组
     * @return
     */
    List<E> findByPropertys(String[] propertyNames, Object[] values);

    /**
     * 通过多个属性查找，并分页， 属性名称数组和属性值数组的序列要对应
     *
     * @param propertyNames 属性名称数组
     * @param values        属性值数组
     * @param page          页码
     * @param pageSize      每页内容条数
     * @return 分页后的结果
     */
    List<E> pageByPropertys(String[] propertyNames, Object[] values, int page, int pageSize);

    /**
     * 通过属性查找，并分页， 属性名称数组和属性值数组的序列要对应
     *
     * @param propertyName 属性名称
     * @param value        属性值
     * @param page         页码
     * @param pageSize     每页内容条数
     * @return
     */
    List<E> pageByProperty(String propertyName, Object value, int page, int pageSize);

    /**
     * 通过SQL进行分页查询
     * @param sql SQL语句
     * @param t		返回的列表中的对象类型
     * @param pageNum	页数
     * @param pageSize	每页条数，小于1时不分页
     * @param 参数
     * @return
     */
    <T> List<T>  pageBySql(String sql, Class<T> t, int pageNum, int pageSize, Object... params);

    /**
     * 统计所有记录的总数
     *
     * @return 总数
     */
    long countAll();

    /**
     * 统计数据库中当propertyName=value时的记录总数
     *
     * @param propertyName
     * @param value
     * @return
     */
    long countByProperty(String propertyName, Object value);

    /**
     * 统计数据库中当多个propertyName=value时的记录总数
     *
     * @param propertyNames
     * @param values
     * @return
     */
    long countByPropertys(String[] propertyNames, Object[] values);

    /**
     * 保存或更新
     *
     * @param e
     */
    void saveOrUpdate(E e);

    /**
     * 通过ID查询对象
     *
     * @param id 主键编号
     * @return
     */
    E findById(PK id);

    /**
     * 更新对象
     *
     * @param e
     */
    void update(E e);

    /**
     * 获得持久化对象的类型
     *
     * @return
     */
    Class<E> getClazz();

    /**
     * 查找并通过某一属性排序
     *
     * @param propertyName 排序依据的顺序
     * @param isSequence   是否顺序排序
     */
    List<E> findAndOrderByProperty(int firstResult, int fetchSize, String propertyName, boolean isSequence);

    /**
     * 查找并通过某一属性排序
     *
     * @param propertyName 排序依据的顺序
     * @param isSequence   是否顺序排序
     */
    List<E> findAllAndOrderByProperty(String propertyName, boolean isSequence);

    /**
     * 根据唯一性键查询对象
     * @param propertyNames
     * @param values
     * @return 如果查询结果有多个值则抛出错误;如果查询结果有且只有一个值,返回一个object;如果没值,返回null
     */
    E uniqueObject(String[] propertyNames, Object[] values);

    /**
     * 根据唯一性键查询对象
     * @param propertyNames
     * @param values
     * @return
     */
    E uniqueObject(String propertyNames, Object values);
    
    /**
     * 通过条件过滤对象查询，并分页
     * @param filter 	条件过滤对象
     * @param pageNum        页码
     * @param pageSize      每页内容条数
     * @return 分页后的结果
     */
    List<E> queryByFilter(Object filter, int pageNum,int pageSize);
    
    /**
     * 通过条件过滤对象查询，并分页
     * @param filter 	条件过滤对象
     * @param orderFields   排序字段，不要含有order by字样。
     * @param pageNum        页码
     * @param pageSize      每页内容条数
     * @return 分页后的结果
     */
	List<E> queryByFilter(Object filter, String orderFields, int pageNum, int pageSize);

    /**
     * 通过条件过滤对象查询记录数
     * @param filter 	条件过滤对象
     * @return 记录数
     */
    long countByFilter(Object filter);
    
    /**
     * 执行HQL查询
     * @param hql
     * @param params
     * @return
     */
    List<E> findByHql(String hql, Object... params);
    
    /**
     * 执行HQL更新
     * @param hql
     * @param params
     * @return
     */
    int executeHql(String hql, Object... params);

    /**
     * 通过普通SQL查询
     *
     * @param sql
     * @return Object数组
     */
    @SuppressWarnings("rawtypes")
	List findBySql(String sql, Object... params);

    /**
     * 通过普通SQL查询
     * @param <T>
     * @param sql
     * @return T数组
     */
	<T> List<T> findBySql(String sql, Class<T> t, Object... params);
	
	public <T> T loadBySql(String sql, Class<T> t, Object... params);
	
	/**
	 * 通过普通SQL获取符合查询条件的总数
	 * @param <T>
	 * @param sql
	 * @return T数组
	 */
	long countBySql(final String sql, Object... params);

    /**
     * 解析filter的WhereSql注解获取查询条件
     * @param filter
     * @return
     */
	String getWhereBySqlFilter(Object filter);

	/**
     * 执行SQL更新
     * @param sql
     * @param params
     * @return
     */
	int executeSql(String sql, Object... params);
}
