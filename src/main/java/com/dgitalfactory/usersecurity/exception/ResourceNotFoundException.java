package com.dgitalfactory.usersecurity.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
@Getter
@Setter
public class ResourceNotFoundException extends RuntimeException {

	@Getter(value = AccessLevel.NONE)
	@Setter(value = AccessLevel.NONE)
	private static final long serialVersionUID = 1L;

	private String nameResource;
	private String fieldName;
	private Object fieldValue;

	/**
	 * Excpcion cuando buscamos un elemento de un objeto determinado y no lo encontramos
	 * informamos el error
	 *
	 * @param nameResource: nombre dle recurso no encontrado
	 * @param fieldName: campo que se utilizó para la búsqueda
	 * @param fieldValue: elemento que se utilizó para la búsqueda
	 */
	public ResourceNotFoundException(String nameResource, String fieldName, Object fieldValue) {
		super(String.format("%s no encontrada con : %s : '%s'", nameResource, fieldName, fieldValue));
		this.nameResource = nameResource;
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
	}

}
