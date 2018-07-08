package com.common.vo;

/**
 * 返回操作结果
 */
public class RetMsg {

	/** 成功码 **/
	public static final int SUCCESS_CODE = 1;
	/** 失败码 **/
	public static final int FAIL_CODE = 2;
	/** 消息码，一般需要返回一段文本到前台进行展现 **/
	public static final int INFO_CODE = 3;

	/** 返回码 **/
	private int code;
	
	/** 消息文本 **/
	private String msg;
	
	public RetMsg() {
	}
	
	/**
	 * @param code 返回码
	 * @param msg 消息文本
	 */
	public RetMsg(int code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	/**
	 * 返回成功结果对象
	 * @return
	 */
	public static RetMsg success() {
		return new RetMsg(SUCCESS_CODE, null);
	}
	
	/**
	 * 返回失败结果对象
	 * @return
	 */
	public static RetMsg fail() {
		return new RetMsg(FAIL_CODE, null);
	}
	
	/**
	 * 返回消息结果对象
	 * @return
	 */
	public static RetMsg info() {
		return new RetMsg(INFO_CODE, null);
	}
	
	/**
	 * 返回失败结果对象
	 * @return
	 */
	public static RetMsg fail(String msg) {
		return new RetMsg(FAIL_CODE, msg);
	}
	
	/**
	 * 返回消息结果对象
	 * @return
	 */
	public static RetMsg info(String msg) {
		return new RetMsg(INFO_CODE, msg);
	}
	
	/**
	 * 返回成功结果JSON
	 * @return
	 */
	public static String successJSON() {
		return "{code:1}";
	}

    /**
     * 初始化消息
     */
    public static RetMsg init() {
        return new RetMsg(2, "");
    }

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
}
