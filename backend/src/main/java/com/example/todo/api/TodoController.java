package com.example.todo.api;

import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin // Allow calls from frontend during development
public class TodoController {

    private record CreateTodoRequest(@NotBlank String title) {}
    private record UpdateTodoRequest(String title, Boolean completed) {}

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Todo> list() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<Todo> create(@Valid @RequestBody CreateTodoRequest req) {
        String title = req.title().trim();
        if (title.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Todo created = service.create(title);
        return ResponseEntity.created(URI.create("/api/todos/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(@PathVariable("id") long id, @RequestBody UpdateTodoRequest req) {
        Optional<Todo> updated = service.update(
                id,
                req == null || req.title() == null ? null : req.title().trim(),
                req == null ? null : req.completed()
        );
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        boolean removed = service.delete(id);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<Todo>> reorder(@RequestBody List<Long> ids) {
        service.reorder(ids);
        return ResponseEntity.ok(service.findAll());
    }

    @ExceptionHandler({org.springframework.web.bind.MethodArgumentNotValidException.class,
            org.springframework.http.converter.HttpMessageNotReadableException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(Exception ex) {
        return Map.of("error", "Bad Request",
                "message", ex.getMessage() == null ? "invalid input" : ex.getMessage());
    }
}
