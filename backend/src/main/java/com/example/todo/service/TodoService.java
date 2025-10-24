package com.example.todo.service;

import com.example.todo.model.Todo;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TodoService {
    private final Map<Long, Todo> store = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong(0);
    private final AtomicLong orderSeq = new AtomicLong(0);

    public List<Todo> findAll() {
        List<Todo> list = new ArrayList<>(store.values());
        list.sort(Comparator.comparingInt(Todo::getOrder).thenComparingLong(Todo::getId));
        return list;
    }

    public Optional<Todo> findById(long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Todo create(String title) {
        long id = seq.incrementAndGet();
        int ord = (int) orderSeq.getAndIncrement();
        Todo todo = new Todo(id, title, false, ord);
        store.put(id, todo);
        return todo;
    }

    public Optional<Todo> update(long id, String title, Boolean completed) {
        Todo existing = store.get(id);
        if (existing == null) return Optional.empty();
        if (title != null) existing.setTitle(title);
        if (completed != null) existing.setCompleted(completed);
        return Optional.of(existing);
    }

    public boolean delete(long id) {
        return store.remove(id) != null;
    }

    public void reorder(List<Long> ids) {
        // Set the order of todos to match the list index
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            Todo t = store.get(id);
            if (t != null) {
                t.setOrder(i);
            }
        }
        // bump orderSeq to avoid clashes when adding new items afterwards
        orderSeq.set(ids.size());
    }

    public void clear() {
        store.clear();
        seq.set(0);
        orderSeq.set(0);
    }
}
