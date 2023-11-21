package com.dgitalfactory.usersecurity.service;

import net.iharder.Base64;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EncoderDecorderBase64Service {

	/**
	 * Convierte un String común en un String con base64
	 * @param value valor a convertir
	 * @return string con base64
	 */
	public String encoder(String value) {
		return Base64.encodeBytes(value != null ? value.getBytes() : null);
	}

	/**
	 * Decodifica Sting con base64 y lo convierte en string
	 * @param valueBase64 string transformado en base64
	 * @return devuelve un string si se pudo convertir o un null sino
	 */
	public String decode(String valueBase64) {
		try {
			byte[] valueByte = Base64.decode(valueBase64);
			return new String(valueByte);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}
