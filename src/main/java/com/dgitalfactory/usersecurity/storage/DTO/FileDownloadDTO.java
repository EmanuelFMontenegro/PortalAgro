package com.dgitalfactory.usersecurity.storage.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/01/2024 - 13:08
 */
@AllArgsConstructor
@Data
@Builder
public class FileDownloadDTO {
    private byte[] data;
    private String fileName;

}
