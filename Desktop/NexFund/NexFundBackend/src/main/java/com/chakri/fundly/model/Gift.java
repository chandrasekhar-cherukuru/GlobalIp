package com.chakri.fundly.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Gift {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String description;
    private String upiId;
    private String upiMsg;
    private String creatorUsername;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageDataUrl;

    // No amount field - flexible amounts
}
