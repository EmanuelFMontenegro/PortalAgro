package com.dgitalfactory.usersecurity.service;

import com.dgitalfactory.usersecurity.entity.Location.externalApi.LocationExternal;
import com.dgitalfactory.usersecurity.entity.Location.externalApi.LocationResponse;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 05/01/2024 - 11:07
 */
@Service
public class LocationExternalApiService {

    private static final Logger log = LoggerFactory.getLogger(LocationExternalApiService.class);

    @Autowired
    private WebClient webClient;

    /**
     * Get locations by Name Province
     * @param provinceName: type {@link String} province name
     * @param max: type {@link Integer} maximum number of result
     * @return @{@link List< LocationExternal >}
     */
    public List<LocationExternal> getLocationByNameID(String provinceName, int max) {
        Flux<LocationExternal> locationFlux=  webClient.get()
                .uri(String.format("localidades?provincia=%s&campos=nombre&max=%s",provinceName,String.valueOf(max)))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                        return getThrowableMono(errorBody, "Error 4xx occurred: ");
                    });
                })
                .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> {
                    return clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                        return getThrowableMono(errorBody, "Error 5xx occurred: ");
                    });
                })
                .bodyToMono(LocationResponse.class)
                .flatMapIterable(LocationResponse::getLocalidades)
//                .flatMapMany(response -> Flux.fromIterable(response.getLocalidades()))
                .onErrorResume(GlobalAppException.class, Flux::error)
                .onErrorResume(WebClientResponseException.class, LocationExternalApiService::getLocationFlux);
        return locationFlux.collectList().block();
    }

    /**
     * Get location with id
     * @param location_Id: type {@link Long} location id
     * @param order_By: type {@link String} order by field. id / name / ...
     * @param typeInfo: type {@link String} get type info. basico / estandar / completo
     * @return @{@link List< LocationExternal >}
     */
    public List<LocationExternal> getLocationQuery(Long location_Id, String order_By, String typeInfo) {
        Flux<LocationExternal> locationFlux=  webClient.get()
                .uri(String.format("localidades?localidad_censal=%s&orden=%s&campos=%s",location_Id,order_By,typeInfo))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                        return getThrowableMono(errorBody, "Error 4xx occurred: ");
                    });
                })
                .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> {
                    return clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                        return getThrowableMono(errorBody, "Error 5xx occurred: ");
                    });
                })
                .bodyToMono(LocationResponse.class)
                .flatMapIterable(LocationResponse::getLocalidades)
                .onErrorResume(WebClientResponseException.class, LocationExternalApiService::getLocationFlux);

        return locationFlux.collectList().block();
    }

    @NotNull
    private static Flux<LocationExternal> getLocationFlux(WebClientResponseException ex) {
        log.error("WebClient Error Status Code: " + ex.getStatusCode());
        log.error("WebClient Error Response Body: " + ex.getResponseBodyAsString());

        try {
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(ex.getResponseBodyAsString(), Object.class);
            String prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);

            log.error("WebClient Error Response Body (formatted JSON):");
            log.error(prettyJson);

            return Flux.error(new GlobalAppException(HttpStatus.NOT_FOUND, 4012, "Status: " + ex.getStatusCode() + ", WebClient error occurred: " + prettyJson));
        } catch (Exception e) {
            // Manejar cualquier error de parseo o de formato
            log.error("Error occurred while parsing JSON response: " + e.getMessage());
            return Flux.error(new GlobalAppException(HttpStatus.NOT_FOUND, 4012, "Status: " + ex.getStatusCode() + ", WebClient error occurred: " + ex.getResponseBodyAsString()));
        }
    }

    @NotNull
    private static Mono<Throwable> getThrowableMono(String errorBody, String typeError) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(errorBody, Object.class);
            String prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
            log.error(prettyJson);

            return Mono.error(new GlobalAppException(HttpStatus.NOT_FOUND, 4012, typeError + prettyJson));
        } catch (Exception e) {
            // Manejar cualquier error de parseo o de formato
            return Mono.error(e);
        }
    }
}
