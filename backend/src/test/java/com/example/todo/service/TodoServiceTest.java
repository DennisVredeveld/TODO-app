package com.example.todo.service;

import com.example.todo.model.Todo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class TodoServiceTest {

    private final TodoService service = new TodoService();

    @AfterEach
    void tearDown() {
        service.clear();
    }

    @Test
    void createAndList() {
        service.create("Task 1");
        service.create("Task 2");
        List<Todo> all = service.findAll();
        assertEquals(2, all.size());
        assertEquals("Task 1", all.get(0).getTitle());
    }

    @Test
    void updateExisting() {
        Todo t = service.create("Task");
        Optional<Todo> updated = service.update(t.getId(), "New Title", true);
        assertTrue(updated.isPresent());
        assertEquals("New Title", updated.get().getTitle());
        assertTrue(updated.get().isCompleted());
    }

    @Test
    void updateMissingReturnsEmpty() {
        assertTrue(service.update(999, "X", true).isEmpty());
    }

    @Test
    void deleteRemovesItem() {
        Todo t = service.create("Task");
        assertTrue(service.delete(t.getId()));
        assertFalse(service.findById(t.getId()).isPresent());
    }
}
