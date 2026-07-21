
package com.labourproject.project.dto.response;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record ApiError(
        int status,
        String message,
        String error,
        String path,
        OffsetDateTime timestamp
) {
    public static ApiError of(int status, String message,
                              String error, String path) {
        return new ApiError(
                status, message, error, path,
                OffsetDateTime.now(ZoneOffset.UTC)
        );
    }
}