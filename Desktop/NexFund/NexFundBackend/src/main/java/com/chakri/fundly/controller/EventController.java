package com.chakri.fundly.controller;

import com.chakri.fundly.model.Events;
import com.chakri.fundly.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventService service;

    @RequestMapping("/")
    public String greet() {
        return "Hello World";
    }

    @GetMapping("/allEvents")
    public List<Events> getEvents() {
        return service.getEvents();
    }

    @PostMapping("/create")
    public ResponseEntity<Events> createEvent(@RequestBody Events event) {
        Events saved = service.saveEvent(event);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Events> getEventById(@PathVariable String id) {
        return service.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        service.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email")
    public ResponseEntity<Void> sendEmail(@RequestBody Events event) {
        System.out.println("Event: " + event);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/byCreator/{username}")
    public ResponseEntity<List<Events>> getEventsByCreator(@PathVariable String username) {
        List<Events> events = service.getEventsByCreator(username);
        return ResponseEntity.ok(events);
    }
}
