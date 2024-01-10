package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.DTO.Location.LocationDTO;
import com.dgitalfactory.usersecurity.DTO.Location.LocationRequestDTO;
import com.dgitalfactory.usersecurity.DTO.Location.LocationResponsetDTO;
import com.dgitalfactory.usersecurity.entity.Location.Location;
import com.dgitalfactory.usersecurity.entity.Location.externalApi.LocationResponse;
import com.dgitalfactory.usersecurity.exception.GlobalMessageException;
import com.dgitalfactory.usersecurity.repository.LocationRepository;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 09/01/2024 - 08:50
 */
@Service
public class LocationService {

    private final static Logger log = LoggerFactory.getLogger(LocationService.class);

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private LocationRepository locationREPO;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Save all locations to list
     *
     * @param listLocationResDTO: type @{@link List<LocationResponsetDTO>}
     */
    public void addPullLocations(List<LocationResponsetDTO> listLocationResDTO) {
        if (!listLocationResDTO.isEmpty()) {
            List<Location> list = listLocationResDTO.stream().map(
                            locDTO ->
                                    Location.builder()
                                            .name(locDTO.getName())
                                            .build()
                    )
                    .filter(loc -> {
                        boolean exists = this.locationREPO.existsByName(loc.getName());
                        return !exists;
                    })
                    .toList();
            this.locationREPO.saveAll(list);
        }
    }

    /**
     * Add location
     *
     * @param locaresDTO: type {@link LocationResponsetDTO}
     */
    public void addLocation(LocationResponsetDTO locaresDTO) {
        if (this.locationREPO.existsByName(locaresDTO.getName()))
            throw new GlobalMessageException(
                    HttpStatus.NOT_FOUND,
                    4036,
                    utilsCommons.getFormatMessage(
                            utilsCommons.getStatusMessage(4036),
                            utilsCommons.getMessage("field.name.location"),
                            utilsCommons.getMessage("field.name.location.name")
                    ),
                    utilsCommons.getMessage("field.name.location")
            );
        this.locationREPO.save(
                Location.builder().name(locaresDTO.getName()).build()
        );
    }

    @Transactional
    public void updateLocation(Long location_id, LocationResponsetDTO locaresDTO) {
        Location locationOld = this.getLocationById(location_id);
        if (!locationOld.getName().equals(locaresDTO.getName())) {
            if (this.locationREPO.existsByName(locaresDTO.getName()))
                throw new GlobalMessageException(
                        HttpStatus.NOT_FOUND,
                        4036,
                        utilsCommons.getFormatMessage(
                                utilsCommons.getStatusMessage(4036),
                                utilsCommons.getMessage("field.name.location"),
                                utilsCommons.getMessage("field.name.location.name")
                        ),
                        utilsCommons.getMessage("field.name.location")
                );
        }
        locationOld.setName(locaresDTO.getName());
        this.locationREPO.save(locationOld);
    }

    /**
     * Get location by name
     *
     * @param name: type {@link String} name location
     * @return @{@link LocationRequestDTO}
     */
    public LocationRequestDTO getLocationDTOByName(String name) {
        return this.locationREPO.findLocalDTOByName(name)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.location"),
                        utilsCommons.getMessage("field.name.location.name"), name)
                );
    }

    /**
     * Find location by id
     *
     * @param id: type {@link Long} location id
     * @return @{@link Location}
     */
    public Location getLocationById(Long id) {
        return this.locationREPO.findById(id)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.location"),
                        utilsCommons.getMessage("field.name.id"), id)
                );
    }

    /**
     * Find location by id
     *
     * @param id: type {@link Long} location id
     * @return @{@link Location}
     */
    public LocationRequestDTO getLocationDTOById(Long id) {
        return this.locationREPO.findLocalDTOById(id)
                .orElseThrow(() -> errorSVC.getResourceNotFoundException(
                        utilsCommons.getMessage("field.name.location"),
                        utilsCommons.getMessage("field.name.id"), id)
                );
    }

    /**
     * Find all location with similar same names, but if name is null get all locations
     *
     * @param name:    type {@link String} name to search
     * @param orderBy: type {@link String} order ASC or DESC
     * @return @{@link List<LocationRequestDTO>}
     */
    public List<LocationRequestDTO> getAllLocationsParams(String name, String orderBy) {
        if (name.isEmpty()) {
            return this.locationREPO.findAllLocationDTO(orderBy);
        }
        return this.locationREPO.findLocationsLikeName(name, orderBy);
    }


}
