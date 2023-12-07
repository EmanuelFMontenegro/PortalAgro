package com.dgitalfactory.usersecurity.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 07/12/2023 - 11:50
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldsResPaginationDTO {

    private List<FieldDTO> fieldDTOList;
    private int pageNo;
    private int pageSize;
    private int pageTotal;
    private long itemsTotal;
    private boolean pageLast;
}
