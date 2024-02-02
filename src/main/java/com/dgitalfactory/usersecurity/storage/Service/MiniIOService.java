package com.dgitalfactory.usersecurity.storage.Service;

import com.dgitalfactory.usersecurity.storage.DTO.FileDownloadDTO;
import io.minio.messages.Bucket;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/01/2024 - 11:18
 */
public interface MiniIOService {

    FileDownloadDTO getFile(String key);
    boolean existsBucketByName(String bucketname);
    void deleteBucketByName(String bucketname);
    List<Bucket> getAllBuckets();
}
