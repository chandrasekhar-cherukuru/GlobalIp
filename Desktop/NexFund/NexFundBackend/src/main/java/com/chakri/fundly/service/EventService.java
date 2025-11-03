package com.chakri.fundly.service;

import com.chakri.fundly.model.Events;
import com.chakri.fundly.repo.EventRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepo repo;

    public List<Events> getEvents() {
        return repo.findAll();
    }

    public Events saveEvent(Events event) {
        return repo.save(event);
    }

    public Optional<Events> getEventById(String id) {
        return repo.findById(id);
    }

    public void deleteEvent(String id) {
        repo.deleteById(id);
    }

    public String getUpiId(String eventId) {
        Optional<Events> event = repo.findById(eventId);
        return event.map(Events::getUpiId).orElse(null);
    }

    public String getUpiMsg(String eventId) {
        Optional<Events> event = repo.findById(eventId);
        return event.map(Events::getUpiMsg).orElse(null);
    }

    public String getUserName(String eventId) {
        Optional<Events> event = repo.findById(eventId);
        return event.map(Events::getCreatedByUsername).orElse(null);
    }

    public String getEventTitle(String eventId) {
        Optional<Events> event = repo.findById(eventId);
        return event.map(Events::getEventTitle).orElse(null);
    }

    public String getEventDescription(String eventId) {
        Optional<Events> event = repo.findById(eventId);
        return event.map(Events::getEventDescription).orElse(null);
    }

    public int getEventAmount(String eventId) {
        Optional<Events> event = repo.findById(eventId);
        return event.map(Events::getEventAmount).orElse(0);
    }

    public List<Events> getEventsByCreator(String username) {
        return repo.findByCreatedByUsername(username);
    }
}
