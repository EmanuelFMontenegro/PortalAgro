package com.dgitalfactory.usersecurity.repository.RequestServices;

import com.dgitalfactory.usersecurity.DTO.AppService.RequestServiceDTO;
import com.dgitalfactory.usersecurity.entity.AppServices.RequestService;
import com.dgitalfactory.usersecurity.utils.enums.StatusService;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 19/12/2023 - 09:11
 */
@Repository
public interface ServiceRepository extends JpaRepository<RequestService, Long> {
//
//    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
//            "FROM RequestService s WHERE s.field.id = :field_id AND s.status = :status AND s.field.person.id = :user_id")
//    boolean existsByFieldIdAndStatus(@Param("field_id") Long field_id,@Param("user_id") Long user_id ,@Param("status") StatusService status);
//
//    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
//            "FROM RequestService s WHERE s.field.id = :field_id AND s.id = :service_id")
//    boolean existsServiceIdWithFieldId(@Param("field_id") Long field_id, @Param("service_id") Long service_id);
//    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.AppService.RequestServiceDTO(" +
//            "s.id, s.dateOfService, s.observations, s.status, s.typeService.id, s.plot.id) " +
//            "FROM RequestService s WHERE s.status = :status")
//    Page<RequestServiceDTO> findAllServiceDTOByStatus(@Param("status") StatusService status, Pageable pageable);
//
//    @Query("SELECT COUNT(s) > 0 FROM RequestService s " +
//            " WHERE s.field.id= :field_id " +
//            " AND s.typeService.id= :type_id" +
//            " AND s.dateOfService= :date")
//    boolean checkDataService(@Param("field_id") Long field_id, @Param("type_id") Long type_id, @Param("date") LocalDate date);
//
//    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.AppService.RequestServiceDTO(" +
//            "s.id, s.dateOfService, s.observations, s.status, s.typeService.id, s.field.id) " +
//            "FROM RequestService s WHERE s.field.id = :field_id AND s.status = :status")
//    Page<RequestServiceDTO> findAllServiceDTOByFieldIdAndStatus(@Param("field_id") Long field_id, @Param("status") StatusService status, Pageable pageable);
//    @Query("SELECT NEW com.dgitalfactory.usersecurity.DTO.AppService.RequestServiceDTO(" +
//            "s.id, s.dateOfService, s.observations, s.status, s.typeService.id, s.field.id) " +
//            " FROM RequestService s WHERE s.id = :service_id")
//    Optional<RequestServiceDTO> findServiceDTOById(@Param("service_id") Long service_id);

    public @NotNull Optional<RequestService> findById(@NotNull Long id);

}
