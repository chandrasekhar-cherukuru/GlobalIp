package com.chakri.fundly.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String eventTitle;
    private String eventDescription;
    private String upiId;
    private String upiMsg;
    private int eventAmount; // Fixed amount for events
    private String createdByUsername;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageDataUrl;

    @ElementCollection
    private List<String> participants = new ArrayList<>();
}
