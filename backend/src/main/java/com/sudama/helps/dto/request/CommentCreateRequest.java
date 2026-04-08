package com.sudama.helps.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for adding comments to bookings
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateRequest {
    @NotBlank(message = "Comment text is required")
    private String text;
    
    private String imageUrl; // Optional image attachment
}
