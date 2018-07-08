package com.common.vo;

public class AppException extends Exception{
	private static final long serialVersionUID = 1L;
	
	public AppException() {
		super();
	}
	
	public AppException(String message) {
		super(message);
	}
	
	public AppException(Throwable throwable) {
		super(throwable);
	}
	
	public AppException(String message, Throwable throwable) {
		super(message, throwable);
	}
}
