package com.common.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 防止用户重复提交。如果用户在前一个操作未返回前，又执行同一操作，系统将忽略后一操作，并且没有任何提示。
 * 可定义初始化参数：ignorePaths（以分号;分隔） 排除不需检测的路径
 * 在WEB集群下，只对粘性会话设置有效。
 * @author CFHUANG
 */
public class RepeatBlockFilter implements Filter {

	private Map<String, Boolean> sessionMap = null;
    private String[] ignorePathList = null;
    private String ctx = null;

	public void init(FilterConfig filterConfig) throws ServletException {
		sessionMap = new ConcurrentHashMap<String, Boolean>();
        ctx = filterConfig.getServletContext().getContextPath();
		String ignorePaths = filterConfig.getInitParameter("ignorePaths");
		if (ignorePaths != null && ignorePaths.trim().length() > 0) {
			ignorePathList = ignorePaths.split(";");
			for (int i = 0; i < ignorePathList.length; i++) {
				ignorePathList[i] = ignorePathList[i].trim();
				if (!ignorePathList[i].startsWith("/")) {
					ignorePathList[i] = "/" + ignorePathList[i];
				}
			}
		}
	}

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
			FilterChain filterChain) throws IOException, ServletException {

		if (servletRequest instanceof HttpServletRequest) {
			HttpServletRequest request = (HttpServletRequest) servletRequest;
			HttpServletResponse response = (HttpServletResponse) servletResponse;

			// 只检查特定的URL。
			boolean needBlock = false;
			String uri = request.getRequestURI();
			StringBuffer urlBuf = request.getRequestURL();
			String param = request.getQueryString();
			if (param != null && param.length() > 0) {
				urlBuf.append("?").append(param);
			}
			String url = urlBuf.toString();
			
			int uriStart = url.indexOf(uri);
	        String path0 = url.substring(uriStart + ctx.length());
	        String path1 = path0 + "/";
			boolean ignore = false;
			
			if (ignorePathList != null) {
				for (int i = 0; i < ignorePathList.length; i++) {
					if (path0.startsWith(ignorePathList[i]) || path1.startsWith(ignorePathList[i])) {
						ignore = true;
						break;
					}
				}
			}

			if (!ignore) {
				int pos = uri.lastIndexOf(".");
				if (pos > 0) {
					String ext = uri.substring(pos);
					if (ext.equals(".go") || ext.equals(".do") || ext.equals(".jsp")) {
						needBlock = true;
					}
				} else {
					needBlock = true;
				}
			}
			String sid = null;
			if (needBlock) {
				HttpSession session = request.getSession(false);
				if (session == null) {
					// 无会话则忽略
					needBlock = false;
				} else {
					sid = session.getId();
					if (sid == null) {
						needBlock = false;
					}
				}
			}
			if (needBlock) {
				String key = sid + url;
				Boolean value = sessionMap.get(key);
				if (value == null) {
					sessionMap.put(key, Boolean.TRUE);
					try {
						filterChain.doFilter(servletRequest, servletResponse);
					} finally {
						sessionMap.remove(key);
					}
				} else {
					// 重复提交，不响应
					response.setStatus(503);
					response.setCharacterEncoding("utf-8");
					PrintWriter out = response.getWriter();
					out.write("系统正在处理中，请铁勿重复操作！");
					out.close();
				}

			} else {
				// 忽略其他资源
				filterChain.doFilter(servletRequest, servletResponse);
			}
		}
	}

	public void destroy() {

	}
}

/*
 * 在项目的web.xml增加一个Filter配置如下。

注意：
 	该Filter配置须放在  LogFilter的后面。
	初始化参数：【ignorePaths】 
		用于排除不需检测重复提交的路径，路径按前导部分匹配，非完全匹配。
		ignorePaths 以/开头，但【不要包含】项目的上下根（例如/atm, /part）。
		多个路径请以分号;分隔。
	
    <filter>
		<filter-name>RepeatBlockFilter</filter-name>
   		<filter-class>com.zjft.common.filter.RepeatBlockFilter</filter-class>
   		<init-param>
   		<param-name>ignorePaths</param-name>
   		<param-value>/somePathsToIgnore/something</param-value>
   		</init-param>
    </filter>

    <filter-mapping>
   		<filter-name>RepeatBlockFilter</filter-name>
   		<url-pattern>/*</url-pattern>
    </filter-mapping>
 * 
 */
