package com.example.todo.api;

import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TodoControllerTest {

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate rest;

    @Autowired
    TodoService service;

    String baseUrl;

    @BeforeEach
    void setup() {
        service.clear();
        baseUrl = "http://localhost:" + port + "/api/todos";
    }

    @Test
    void createListUpdateDeleteFlow() {
        // Create
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"title\":\"Task A\"}";
        ResponseEntity<Todo> createResp = rest.postForEntity(baseUrl, new HttpEntity<>(body, headers), Todo.class);
        assertEquals(HttpStatus.CREATED, createResp.getStatusCode());
        assertNotNull(createResp.getBody());
        long id = createResp.getBody().getId();
        assertEquals("Task A", createResp.getBody().getTitle());
        assertFalse(createResp.getBody().isCompleted());

        // List
        ResponseEntity<Todo[]> listResp = rest.getForEntity(baseUrl, Todo[].class);
        assertEquals(HttpStatus.OK, listResp.getStatusCode());
        assertNotNull(listResp.getBody());
        assertEquals(1, listResp.getBody().length);

        // Update
        String updBody = "{\"title\":\"Task A+\",\"completed\":true}";
        ResponseEntity<Todo> updResp = rest.exchange(baseUrl + "/" + id, HttpMethod.PUT, new HttpEntity<>(updBody, headers), Todo.class);
        assertEquals(HttpStatus.OK, updResp.getStatusCode());
        assertNotNull(updResp.getBody());
        assertEquals("Task A+", updResp.getBody().getTitle());
        assertTrue(updResp.getBody().isCompleted());

        // Delete
        ResponseEntity<Void> delResp = rest.exchange(baseUrl + "/" + id, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
        assertEquals(HttpStatus.NO_CONTENT, delResp.getStatusCode());

        // Verify empty
        ResponseEntity<Todo[]> afterDel = rest.getForEntity(baseUrl, Todo[].class);
        assertEquals(0, afterDel.getBody().length);
    }

    @Test
    void createBadRequestWhenEmptyTitle() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"title\":\"   \"}";
        ResponseEntity<String> resp = rest.postForEntity(baseUrl, new HttpEntity<>(body, headers), String.class);
        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
    }

    @Test
    void updateMissingReturnsNotFound() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String updBody = "{\"title\":\"X\"}";
        ResponseEntity<String> resp = rest.exchange(baseUrl + "/9999", HttpMethod.PUT, new HttpEntity<>(updBody, headers), String.class);
        assertEquals(HttpStatus.NOT_FOUND, resp.getStatusCode());
    }
}
