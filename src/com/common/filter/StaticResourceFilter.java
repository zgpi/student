package com.common.filter;

import java.io.File;
import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.common.tools.StringTool;

public class StaticResourceFilter implements Filter {

    private Logger log = Logger.getLogger("Debug");

    @Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;

		String params = req.getQueryString();
		String url0 = null;
		if (StringTool.isBlank(params)) {
			url0 = req.getRequestURL().toString();
		} else {
			url0 = req.getRequestURL().append("?").append(params).toString();
		}
		log.debug(url0);
		String filePath = this.getFilePath(req);
		File file = new File(filePath);
		String ts;
		if (file.exists()) {
			ts = "_t=" + file.lastModified() + "." + file.length();
		} else {
			ts = "_t=0";
		}
		// 重定向
		if (params == null || !params.contains(ts)) {
			String newParams = "";
			if(params != null) {
				//如果已经有_t参数，表示文件有更新，则去掉老版本的_t参数
				String[] temp = params.split("&", 0);
				for(int i = 0;i<temp.length;i++){
					String s = temp[i];
					if(!s.startsWith("_t=")){
						newParams += s + "&";
					}
				}
				if(!StringTool.isBlank(newParams))
					newParams = newParams.substring(0, newParams.length() - 1);

			}
			String url = null;
			if (StringTool.isBlank(newParams)) {
				url = req.getRequestURL().append("?").append(ts).toString();
			} else {
				url = req.getRequestURL().append("?").append(newParams).append("&").append(ts).toString();
			}
			log.debug(url + " 重定向");
			resp.sendRedirect(url);
			return;
		} else {
			chain.doFilter(request, response);
			return;
		}
	}

	@Override
	public void init(FilterConfig config) throws ServletException {}

	@Override
	public void destroy() {

	}

	private String getFilePath(HttpServletRequest request) {
		String webRoot = request.getSession().getServletContext().getRealPath("/");
		if (webRoot == null) {
			webRoot = this.getClass().getClassLoader().getResource("/").getPath();
			webRoot = webRoot.substring(0, webRoot.lastIndexOf("WEB-INF"));
		}
		String filePath = request.getServletPath();
		String pathInfo = request.getPathInfo();
		if (pathInfo != null && pathInfo.length() > 0) {
			filePath = filePath + pathInfo;
		}
		filePath = webRoot + "/" + filePath;
	    return filePath.replaceAll("\\\\", "/").replaceAll("/+", "/");
	}
}
