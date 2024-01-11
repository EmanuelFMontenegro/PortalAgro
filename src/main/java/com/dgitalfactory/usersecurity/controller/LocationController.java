package com.dgitalfactory.usersecurity.controller;

import com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO;
import com.dgitalfactory.usersecurity.DTO.Location.LocationResponsetDTO;
import com.dgitalfactory.usersecurity.DTO.MessageDTO;

import com.dgitalfactory.usersecurity.service.LocationService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/01/2024 - 11:44
 */
@RestController
@RequestMapping("/api/location")
@CrossOrigin
@Validated
@Tag(name = "Location", description = "External api for location service.")
public class LocationController {

    private final static Logger log = LoggerFactory.getLogger(LocationController.class);

//    @Autowired
//    private LocationExternalApiService locationExternalApiService;

    @Autowired
    private LocationService locationSVC;

    @Autowired
    private UtilsCommons utilsCommons;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/all")
    public ResponseEntity<MessageDTO> addLocationPull(@Valid @RequestBody List<LocationResponsetDTO> listLocaDTO) {
        this.locationSVC.addPullLocations(listLocaDTO);
        return ResponseEntity.ok(MessageDTO.builder()
                .code(2001)
                .message(utilsCommons.getStatusMessage(2001))
                .details(utilsCommons.getMessage("field.name.location"))
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MessageDTO> addLocation(@Valid @RequestBody LocationResponsetDTO locaDTO) {
        this.locationSVC.addLocation(locaDTO);
        return ResponseEntity.ok(MessageDTO.builder()
                .code(2001)
                .message(utilsCommons.getStatusMessage(2001))
                .details(utilsCommons.getMessage("field.name.location"))
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MessageDTO> updateLocation(
            @Valid @RequestBody LocationResponsetDTO locaDTO,
            @PathVariable("id") Long id) {
        this.locationSVC.updateLocation(id, locaDTO);
        return ResponseEntity.ok(MessageDTO.builder()
                .code(2002)
                .message(utilsCommons.getStatusMessage(2002))
                .details(utilsCommons.getMessage("field.name.location"))
                .build());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<LocationRequestDTO> getLocationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.locationSVC.getLocationDTOById(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<?> getAllLocationDTO(
            @RequestParam(value = "name", defaultValue = "", required = false) String name,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir
    ) {
        List<LocationRequestDTO> locations = locationSVC.getAllLocationsParams(name, sortDir);
        return ResponseEntity.ok(locations);
    }


//    @PreAuthorize("isAuthenticated()")
//    @GetMapping("/{name}")
//    public ResponseEntity<List<LocationExternal>> getLocation(@PathVariable("name") String name,
//                                                              @RequestParam(value = "max", defaultValue = "200", required = false) int max) {
//        List<LocationExternal> locationExternals = locationService.getLocationByNameID(name, max);
//        return ResponseEntity.ok(
//                locationExternals
//        );
//    }
//
//    @PreAuthorize("isAuthenticated()")
//    @GetMapping("/id/{location_Id}")
//    public ResponseEntity<List<LocationExternal>> getLocationByNameAndId(@PathVariable("location_Id") Long location_Id,
//                                                                         @RequestParam(value = "order_By", defaultValue = "nombre", required = false) String order_By,
//                                                                         @RequestParam(value = "typeInfo", defaultValue = "basico", required = false) String typeInfo
//                                                                 ) {
//        List<LocationExternal> locationExternals = locationService.getLocationQuery(location_Id, order_By, typeInfo);
//        return ResponseEntity.ok(
//                locationExternals
//        );
//    }
}
