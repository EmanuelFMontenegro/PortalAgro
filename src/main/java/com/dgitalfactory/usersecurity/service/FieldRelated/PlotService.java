package com.dgitalfactory.usersecurity.service.FieldRelated;

import com.dgitalfactory.usersecurity.DTO.Plot.PlotResponseDTO;
import com.dgitalfactory.usersecurity.DTO.Plot.PlotResquestDTO;
import com.dgitalfactory.usersecurity.DTO.ResponsePaginationDTO;
import com.dgitalfactory.usersecurity.entity.Fields.Field;
import com.dgitalfactory.usersecurity.entity.Fields.Plot;
import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.exception.GlobalMessageException;
import com.dgitalfactory.usersecurity.repository.Fields.PlotRepository;
import com.dgitalfactory.usersecurity.service.CustomeErrorService;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 18/01/2024 - 11:55
 */
@Service
public class PlotService {

    private final static Logger log = LoggerFactory.getLogger(PlotService.class);

    @Autowired
    private UtilsCommons utilsCommons;

    @Autowired
    private PlotRepository plotRepo;

    @Autowired
    private TypePlantationService typePlantationSVC;

    @Autowired
    private FieldService fieldSVC;

    @Autowired
    private CustomeErrorService errorSVC;

    /**
     * Add new plot the field
     * @param field_id: type {@link Long}
     * @param plotRequestDTO: tupe {@link PlotResponseDTO}
     */
    @Transactional()
    public void addPlot(Long field_id, PlotResquestDTO plotRequestDTO) {
        if (this.plotRepo.existsPlotByName(field_id, plotRequestDTO.getName())) {
            throw new GlobalAppException(HttpStatus.NOT_FOUND, 4029, utilsCommons.getMessage("field.name.field.plot"));
        }
        Field field = this.fieldSVC.getFieldById(field_id);
        Plot plot = Plot.builder()
                .name(plotRequestDTO.getName())
                .dimensions(plotRequestDTO.getDimensions())
                .descriptions(plotRequestDTO.getDescriptions())
                .typePlantation(this.typePlantationSVC.findTypePlantationById(plotRequestDTO.getType_plantation_id()))
                .active(true)
                .field(field)
                .build();

        Plot newPlot = this.plotRepo.save(plot);
        log.info("Plot create: " + newPlot.toString());
    }

    /**
     * Find plot by id
     * @param plot_id: type {@link Long}
     * @return @{@link Plot}
     */
    public Plot findPlotById(Long plot_id){
        return this.plotRepo.findById(plot_id)
                .orElseThrow(
                        () -> errorSVC.getResourceNotFoundException("Plot ID", "plot_id", plot_id)
                );
    }

    /**
     * Get plot by field id and plot id
     * @param field_id: type {@link Long}
     * @param plot_id: type {@link Long}
     * @return @{@link PlotResponseDTO}
     */
    public PlotResponseDTO getPlotDTOByPlotId(Long field_id, Long plot_id) {
        if (!this.verifyExistsFieldAndPlotByIds(field_id, plot_id)) {
            throw new GlobalMessageException(
                    HttpStatus.NOT_FOUND, 4033,
                    utilsCommons.getFormatMessage(
                            utilsCommons.getStatusMessage(4033),
                            utilsCommons.getMessage("field.name.field.plot"),
                            "plot_id",
                            utilsCommons.getMessage("field.name.field"),
                            "field_id"
                    ),
                    utilsCommons.getMessage("field.name.field.plot"));
        }
        return this.plotRepo.getPlotResponseByPlot_id(plot_id);
    }

    /**
     * Check if field with that ID exists for that plot ID
     *
     * @param field_id: : type {@link Long} field ID
     * @param plot_id:  type {@link Long} user ID
     * @return @{@link Boolean}
     */
    private boolean verifyExistsFieldAndPlotByIds(Long field_id, Long plot_id) {
        return this.plotRepo.existsByFieldIdAndPlotId(field_id, plot_id);
    }

    /**
     * Find all fields by person/user id
     *
     * @param pageNo:   type {@link Integer}
     * @param pageSize: type {@link Integer}
     * @param sortBy:   type {@link String}
     * @param sortDir:  type {@link String}
     * @param field_id: Type {@link Long}
     * @param active:   Type {@link String}
     * @return @{@link ResponsePaginationDTO}
     */
    public ResponsePaginationDTO getAll(int pageNo, int pageSize, String sortBy, String sortDir,
                                        Long field_id, String active) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<PlotResponseDTO> listObject = this.getPagePlotDTOByActive(field_id, pageable, active);
        List<PlotResponseDTO> list = listObject.getContent();
        if (list.isEmpty()) {
            throw new GlobalAppException(HttpStatus.OK, 2006, utilsCommons.getMessage("field.name.field.plot"));
        }
        return ResponsePaginationDTO.builder()
                .list(Collections.singletonList(list))
                .pageNo(listObject.getNumber())
                .pageSize(listObject.getSize())
                .pageTotal(listObject.getTotalPages())
                .itemsTotal(listObject.getTotalPages())
                .pageLast(listObject.isLast())
                .build();
    }

    /**
     * Find plots by active or all plots and returning DTO class
     *
     * @param pageable: type {@link Pageable}
     * @param active:   type {@link String} : true or false
     * @return @{@link Page<PlotResponseDTO>}
     */
    private Page<PlotResponseDTO> getPagePlotDTOByActive(Long field_id, Pageable pageable, String active) {
        if (active.isEmpty()) {
            return this.plotRepo.findAllPlotResponseByFieldId(field_id, pageable);
        } else {
            if (active.equalsIgnoreCase("true") || active.equalsIgnoreCase("false")) {
                return this.plotRepo.findAllPlotResponseByFieldIdAndActive(field_id, (Boolean.parseBoolean(active)), pageable);
            }
        }
        return this.plotRepo.findAllPlotResponseByFieldIdAndActive(field_id, true, pageable);
    }

    /**
     * Update a user field
     *
     * @param field_id:        type @{@link Long}
     * @param plot_id:        type @{@link Long
     * @param fieldResponseDTO: type @{@link PlotResponseDTO}
     */
    @Transactional()
    public void updatePlot(Long field_id, Long plot_id, PlotResquestDTO plotResquestDTO) {
        this.verifyExistsFieldAndPlotByIds(field_id,plot_id);
        Plot plot = this.findPlotById(plot_id);
        if (!plot.getName().equals(plotResquestDTO.getName())) {
            if (this.plotRepo.findByName(plotResquestDTO.getName()).isPresent()) {
                throw new GlobalAppException(HttpStatus.NOT_FOUND, 4029, utilsCommons.getMessage("field.name.field.plot"));
            }
        }
        plot.setName(plotResquestDTO.getName());
        plot.setDimensions(plotResquestDTO.getDimensions());
        plot.setDescriptions(plotResquestDTO.getDescriptions());
        plot.setTypePlantation(this.typePlantationSVC.findTypePlantationById(plotResquestDTO.getType_plantation_id()));


        Plot newPlot = this.plotRepo.save(plot);
        log.info("PlotDTO: " + plotResquestDTO.toString());
        log.info("Plot update: " + plot.toString());
    }


    /**
     * logical delete plot by id
     * @param field_id: type {@link Long}
     * @param plot_id: type {@link Long}
     * @param active: type {@link Boolean}
     */
    public void updateActivePlot(Long field_id, Long plot_id, boolean active){
        if (this.verifyExistsFieldAndPlotByIds(field_id, plot_id)) {
            Plot plot = this.findPlotById(plot_id);
            plot.setActive(active);
            this.plotRepo.save(plot);
            return;
        }
        throw new GlobalMessageException(
                HttpStatus.NOT_FOUND, 4033,
                utilsCommons.getFormatMessage(
                        utilsCommons.getStatusMessage(4033),
                        utilsCommons.getMessage("field.name.field"),
                        "field_id",
                        utilsCommons.getMessage("field.name.field.plot"),
                        "plot_id"
                ),
                utilsCommons.getMessage("field.name.field.plot"));
    }
}
