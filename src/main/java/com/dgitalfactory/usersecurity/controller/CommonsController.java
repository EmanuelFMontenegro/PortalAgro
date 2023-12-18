package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.service.CommonService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 12/12/2023 - 13:36
 */
@RestController
@RequestMapping("/api/img/")
@CrossOrigin
@Tag(name = "Common", description = "Icons, images, etc...")
public class CommonsController {

    @Autowired
    private CommonService commonSVC;

//    @GetMapping("/public/{imageName}")
//    public ResponseEntity<InputStreamResource> getImage(@PathVariable("imageName") String imageName) {
//        // Lógica para cargar la imagen desde el directorio
//        InputStreamResource imgInputSR  = this.commonSVC.getPublicImgageResource(imageName,"png");
//        return ResponseEntity.ok()
//                .contentType(MediaType.IMAGE_PNG) // Tipo de contenido de la imagen
//                .body(imgInputSR);
//    }
}
