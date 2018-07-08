package com.common.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HtmlFilter implements Filter {

    private String[] exclusivePathList = null;
    private String loginPage = "/app/login/index.html";
    private String errorPage = "/errors/error404.html";
    /**
     * 是否启用调试模式，在web.xml的HtmlFilter增加配置项，默认不启用
     */
    private int test = 0;
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException {
        if(test == 1){
            chain.doFilter(request, response);
            return;
        }
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response; 
        String ctx = req.getContextPath();
        String uri = req.getRequestURI();
        String path0 = uri.substring(ctx.length());
        String path1 = path0 + "/";
		boolean exclusive = false;
		
		if (exclusivePathList != null) {
			for (int i = 0; i < exclusivePathList.length; i++) {
				if (path0.startsWith(exclusivePathList[i]) || path1.startsWith(exclusivePathList[i])) {
					exclusive = true;
					break;
				}
			}
		}		
		//允许部分页面通过
		if (exclusive || uri.startsWith(loginPage) || path0.equals("/") || path0.startsWith(errorPage)) {
			chain.doFilter(request, response);
			return;
		}
		resp.sendRedirect(loginPage);
		return;
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
		String exclusivePaths = config.getInitParameter("exclusivePaths");
		if (exclusivePaths != null && exclusivePaths.trim().length() > 0) {
			exclusivePathList = exclusivePaths.split(";");
			for (int i = 0; i < exclusivePathList.length; i++) {
				exclusivePathList[i] = exclusivePathList[i].trim();
				if (!exclusivePathList[i].startsWith("/")) {
					exclusivePathList[i] = "/" + exclusivePathList[i];
				}
				if (!exclusivePathList[i].endsWith("/")) {
					exclusivePathList[i] = exclusivePathList[i] + "/";
				}
			}
		}
        //设置调试参数
        try {
            test = Integer.parseInt(config.getInitParameter("test"));
        } catch (NumberFormatException e) {
            test = 0;
        }
    }

	@Override
	public void destroy() {

	}

}
