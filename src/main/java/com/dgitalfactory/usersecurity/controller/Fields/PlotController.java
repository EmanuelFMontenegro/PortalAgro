package com.dgitalfactory.usersecurity.controller.Fields;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.DTO.Plot.PlotResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Plot.PlotResquestDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.service.FieldRelated.FieldService;
import com.dgitalfactory.usersecurity.service.FieldRelated.PlotService;
import com.dgitalfactory.usersecurity.utils.AppConstants;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/01/2024 - 11:51
 */
@RestController
@Validated
@RequestMapping("/api")
@CrossOrigin
@Tag(name = "Plots", description = "Administration plots of fields")
public class PlotController {

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private PlotService plotSRV;

    @Autowired
    private FieldService fieldSRV;


    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @GetMapping("/user/{user_id}/field/{field_id}/plot/{plot_id}")
    public ResponseEntity<PlotResponseDTO> getPlotById(
            @PathVariable("user_id") Long user_id,
            @PathVariable("field_id") Long field_id,
            @PathVariable("plot_id") Long plot_id) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        PlotResponseDTO plotDTO = this.plotSRV.getPlotDTOByPlotId(field_id, plot_id);
        return ResponseEntity.ok(plotDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{user_id}/field/{field_id}/plot/all")
    public ResponseEntity<ResponsePaginationDTO> getAllPlotsByFieldId(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir,
            @RequestParam(value = "isActive", defaultValue = "", required = false) String active,
            @PathVariable("user_id") Long user_id,
            @PathVariable("field_id") Long field_id) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        ResponsePaginationDTO listPlotDTO = this.plotSRV.getAll(pageNumber, pageSize, sortBy, sortDir,
                field_id, active);
        return ResponseEntity.ok(listPlotDTO);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @GetMapping("/user/{user_id}/field/{field_id}/plot")
    public ResponseEntity<ResponsePaginationDTO> getPlotsByFieldId(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.PAGE_NUMBER_DEFAULT, required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE_DEFAULT, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.ORDER_BY_DEFAULT, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.ORDER_DIR_DEFAULT, required = false) String sortDir,
            @PathVariable("user_id") Long user_id,
            @PathVariable("field_id") Long field_id) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        ResponsePaginationDTO listPlotDTO = this.plotSRV.getAll(pageNumber, pageSize, sortBy, sortDir,
                field_id, "true");
        return ResponseEntity.ok(listPlotDTO);
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PostMapping("/user/{user_id}/field/{field_id}/plot")
    public ResponseEntity<MessageDTO> addPlot(@PathVariable("user_id") Long user_id,
                                               @PathVariable("field_id") Long field_id,
                                               @Valid @RequestBody PlotResquestDTO plotDTO) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        this.plotSRV.addPlot(field_id,plotDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2001)
                        .message(utilsCommons.getStatusMessage(2001))
                        .details(utilsCommons.getMessage("field.name.field"))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @PutMapping("/user/{user_id}/field/{field_id}/plot/{plot_id}")
    public ResponseEntity<MessageDTO> updatePlot(@PathVariable("user_id") Long user_id,
                                               @PathVariable("field_id") Long field_id,
                                               @PathVariable("plot_id") Long plot_id,
                                               @Valid @RequestBody PlotResquestDTO plotDTO) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        this.plotSRV.updatePlot(field_id,plot_id, plotDTO);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2002)
                        .message(utilsCommons.getStatusMessage(2002))
                        .details(utilsCommons.getMessage("field.name.field.plot"))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN') or @conditionEvaluatorService.canPreAuthAdmin(#user_id)")
    @DeleteMapping("/user/{user_id}/field/{field_id}/plot/{plot_id}")
    public ResponseEntity<MessageDTO> deleteLogicalPlot(@PathVariable("user_id") Long user_id,
                                                  @PathVariable("field_id") Long field_id,
                                                  @PathVariable("plot_id") Long plot_id) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        this.plotSRV.updateActivePlot(field_id,plot_id, false);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2003)
                        .message(utilsCommons.getStatusMessage(2003))
                        .details(utilsCommons.getMessage("field.name.field.plot"))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/{user_id}/field/{field_id}/plot/{plot_id}/activate")
    public ResponseEntity<MessageDTO> activePlot(@PathVariable("user_id") Long user_id,
                                                        @PathVariable("field_id") Long field_id,
                                                        @PathVariable("plot_id") Long plot_id) {
        this.fieldSRV.verifyExistsFieldUser(field_id, user_id);
        this.plotSRV.updateActivePlot(field_id,plot_id, true);
        return ResponseEntity.ok(
                MessageDTO.builder().code(2009)
                        .message(utilsCommons.getStatusMessage(2009))
                        .details(utilsCommons.getMessage("field.name.field.plot"))
                        .build()
        );
    }

}
