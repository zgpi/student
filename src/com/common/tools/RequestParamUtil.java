package com.common.tools;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

public class RequestParamUtil {
	
	/**
	 * 解析请求参数
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static String parseRequestParams(HttpServletRequest request){
		Map<String, String[]> paramMap = request.getParameterMap();		
		//处理请求参数
		Map<String, Object> paramMapNew = transformParameter(paramMap);

		//尝试从参数集合中获取特殊参数___p
		//备注：前台将复杂对象作为参数时，为了避免复杂对象序列化出现问题，统一使用___p=JSON.stringify(complexObject)
		Object ___p = paramMapNew.get("___p");
		String objectParams = "";
		if(___p!=null){
			objectParams = String.valueOf(___p);
			//将复杂参数剔除
			paramMapNew.remove("___p");
		}

		String params = JsonTool.toJson(paramMapNew);
		
		//如果存在复杂对象参数，则将普通参数进行合并
		if(!"".equals(objectParams)){
			if (!params.equals("{}")) {
				params = params.substring(0, params.lastIndexOf("}")) + "," + objectParams.substring(1);
			} else {
				params = objectParams;
			}
		}
		return params;
	}
	
	private static Map<String, Object> transformParameter(Map<String, String[]> paramMap) {
    	Map<String, Object> paramMapNew = new LinkedHashMap<String, Object>();
		for (Map.Entry<String, String[]> item : paramMap.entrySet()) {
			String[] value = item.getValue();
			String key = item.getKey();
			transformKey(paramMapNew, key, value);
		}
		return paramMapNew;
    }
 
	@SuppressWarnings("unchecked")
	private static void transformKey(Map<String, Object> paramMapNew, String key, String[] value) {
		int pos = key.indexOf(".");
		Pattern p = Pattern.compile("\\[\\w+\\].*?");
		Matcher matcher = p.matcher(key);
		boolean isFound = matcher.find(0);
		int startIndex = 0;
		if (isFound) {
			startIndex = matcher.start();
		}
		if (pos > 0 || startIndex > 0) {
			//嵌套对象
			String key1 = null;
			String key2 = null;
			if (isFound) {
				//a[b][c]
				int endIndex = matcher.end();
				key1 = key.substring(0, startIndex);
				key2 = key.substring(startIndex + 1, endIndex - 1) + key.substring(endIndex);
			} else {
				//a.b.c
				key1 = key.substring(0, pos);
				key2 = key.substring(pos + 1);
			}
	    	Map<String, Object> paramMapNew2 = new LinkedHashMap<String, Object>();
	    	Object oldMap = paramMapNew.get(key1);
	    	if (oldMap == null) {
	    		paramMapNew2 = new LinkedHashMap<String, Object>();
	    		paramMapNew.put(key1, paramMapNew2);
	    	} else {
	    		if (oldMap instanceof Map<?, ?>) {
	    			paramMapNew2 = (Map<String, Object>)oldMap;
	    		} else {
	    			//参数不一致
	    			return;
	    		}
	    	}
	    	transformKey(paramMapNew2, key2, value);
		} else {
	    	if (key.endsWith("[]")) {
	    		//数组
	    		paramMapNew.put(key.substring(0, key.length() - 2), value);
	    	} else {
    			if (value == null || value != null && value.length > 1) {
					paramMapNew.put(key, value);
				} else {
					//去除首尾空格
					paramMapNew.put(key, value[0].trim());
				}
	    	}
		}
	}
}
