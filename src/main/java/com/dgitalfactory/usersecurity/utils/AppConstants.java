package com.dgitalfactory.usersecurity.utils;

public class AppConstants {

	public static final int MAX_LOGIN_ATTEMPTS = 5;
	public static final long BLOCK_DURATION = 1 * 60 * 1000; // 5 MIN
	public static final int DNI_MAX = 10;
	public static final int DNI_MIN = 7;
	public static final int CUIT_CUIL_MAX = 10 + 3;
	public static final int CUIT_CUIL_MIN = 7 + 3;
	public static final int TELPHONE_MAX = 15;
	public static final int TELEPHONE_MIN = 6;
	public static final int PASSWORD_MAX = 8;
	public static final int PASSWORD_MIN = 10;

	//---------PAGINATE--------------------------------
	public static final String PAGE_NUMBER_DEFAULT="0";
	public static final String PAGE_SIZE_DEFAULT="10";
	public static final String ORDER_BY_DEFAULT="id";
	public static final String ORDER_DIR_DEFAULT="asc";
	
}
