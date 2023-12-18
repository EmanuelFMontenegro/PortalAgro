package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.exception.ExplicitErrorAppException;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 12/12/2023 - 13:43
 */
@Service
public class CommonService {
    private static final Logger log = LoggerFactory.getLogger(CommonService.class);


    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Get image extension PNG in resource/static/public/img
     * @param imageName type @{@link String} name to file
     * @param extention type @{@link String} extension file
     * @return @{@link InputStreamResource}
     */
    public InputStreamResource getPublicImgageResource(String imageName, String extention)  {
        try {
            Resource imgFile = new ClassPathResource("static/public/img/" + imageName+"."+extention);
            if (!imgFile.exists() || !imgFile.isReadable()) {
                throw errorSVC.getResourceNotFoundException(utilsCommons.getMessage("field.name.image"),"imageName",imageName);
            }
            InputStreamResource imgInputStreamResource =new InputStreamResource(imgFile.getInputStream());
            return imgInputStreamResource;
        } catch (IOException ex) {
            String msgCodeErrror = String.format(utilsCommons.getStatusMessage(4031),utilsCommons.getMessage("field.name.image"),imageName);
            throw new ExplicitErrorAppException(HttpStatus.BAD_REQUEST,4031,msgCodeErrror,ex.getMessage());
        }
    }

}
