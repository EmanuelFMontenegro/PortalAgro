package com.dgitalfactory.usersecurity.DTO.AppService;

import com.dgitalfactory.usersecurity.DTO.Field.FieldDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.ServiceApp;
import org.modelmapper.PropertyMap;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 20/12/2023 - 12:42
 */
public class ServiceAppDTOMap extends PropertyMap<ServiceApp, ServiceAppDTO> {

    @Override
    protected void configure() {
        map().setField_id(source.getField().getId());
        map().setTypeService_id(source.getTypeService().getId());
    }
}
