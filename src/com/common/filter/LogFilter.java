package com.common.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;

public class LogFilter implements Filter {
	private Logger loggerWebUrl = Logger.getLogger("WebUrl");
	private Logger loggerWebTime1 = Logger.getLogger("WebTime1");
	private Logger loggerWebTime2 = Logger.getLogger("WebTime2");

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		
		String path0 = req.getRequestURI();
		int pos = path0.lastIndexOf("/");

		int extPos = path0.indexOf(".", pos);
		String userId = "";
		
		
		String url = req.getRequestURL().toString();
		StringBuilder sb = new StringBuilder().append("[").append(req.getRemoteAddr()).append("] ")
				.append("[").append(userId).append("] ").append(url);
		loggerWebUrl.debug(sb);
		
		long t = System.currentTimeMillis();
		chain.doFilter(request, response);
		long t2 = System.currentTimeMillis() - t;
		String tStr = "";
		if (t2 >= 1000) {
			tStr = String.valueOf(t2 / 1000) + "," + (t2 % 1000);
		} else {
			tStr = String.valueOf(t2);
		}
		
		StringBuilder sb2 = new StringBuilder().append("[").append(req.getRemoteAddr()).append("] ")
				.append("[").append(userId).append("] ").append(tStr).append(" ms ")
				.append(url);
		if (extPos >= 0) {
			// 有后缀的（静态资源）
			loggerWebTime1.debug(sb2);
		} else {
			loggerWebTime2.debug(sb2);
		}
		return;
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
	}

	@Override
	public void destroy() {

	}

}
