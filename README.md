# To-Do Application – Requirements Specification

## Overview

This project is a simple task management application (To-Do App) that allows users to create, view, update, and delete personal tasks. The application consists of a client and a server, with the client interface interacting with the server exclusively through a REST API. Data persistence may be handled in any fashion suited for development purposes.

---

## Functional Requirements

### 1. To-Do Item Data Model

Each to-do item must contain the following fields:

- `id` (integer, unique): A server-generated ID
- `title` (string): The task title
- `completed` (boolean): Indicates whether the task is finished

### 2. REST API Endpoints

All endpoints follow RESTful conventions and exchange data in JSON format. The base URL for the API is: `/api/todos`

#### `GET /api/todos`
- **Description**: Retrieve a list of all to-do items
- **Response**: JSON array of task objects
- **Example Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false
    },
    {
      "id": 2,
      "title": "Complete assignment",
      "completed": true
    }
  ]
  ```

#### `POST /api/todos`
- **Description**: Creates a new to-do item
- **Request Body**:
  ```json
  {
    "title": "Feed the cat"
  }
  ```
- **Response**: The newly created task object
  ```json
  {
    "id": 4,
    "title": "Feed the cat",
    "completed": false
  }
  ```
- **Errors**:
  - `400 Bad Request`: If the title field is missing or empty

#### `PUT /api/todos/:id`
- **Description**: Updates the title and/or completion status of an existing to-do item
- **Request Body**:
  ```json
  {
    "title": "Feed the cat and dog",
    "completed": true
  }
  ```
- **Response**: The updated task object
  ```json
  {
    "id": 4,
    "title": "Feed the cat and dog",
    "completed": true
  }
  ```
- **Errors**:
  - `404 Not Found`: If the task with the given ID does not exist
  - `400 Bad Request`: If required fields are missing or malformed

#### `DELETE /api/todos/:id`
- **Description**: Deletes a to-do item by ID
- **Response**: `204 No Content` on successful deletion (no response body)
- **Errors**:
  - `404 Not Found`: If the task with the given ID does not exist

## Front-End Behavior

The client interface must, at a minimum:

- Display a list of all current tasks on page load
- Provide a form to create new tasks
- Provide a way to:
  - Edit the task title
  - Toggle a task's completed status
  - Delete a task
- Visually indicate completed tasks (e.g., strike-through text or fade-out)
- Show a summary:
  - Total number of tasks
  - Number of tasks completed
- Automatically update the interface after changes without a full page reload

## Non-Functional Requirements

- The application must operate correctly in a modern desktop web browser
- All server responses must include appropriate HTTP status codes
- To-do data must persist for the duration of the server's execution session

## Bonus Features (Optional)

The following enhancements are not required, but are encouraged to provide a more sophisticated user experience and coding challenge:

### UI Enhancements

- Proper styling
- Task filters: Display only "All", "Completed", or "Pending" tasks
- Confirmation dialogs before deleting tasks
- Reorder tasks using drag-and-drop functionality
- Responsive design to support different screen sizes and devices
- Dark/light theme toggle
- Support for keyboard shortcuts:
  - New task
  - Save
  - Delete

### Advanced Features

- Make the list of tasks prioritized and use drag-and-drop to reorder them
- Set due dates with visual deadline indicators
- Incorporate categories or tags to label tasks
- Implement a search function for quick filtering by title
- Support inline editing of task title (e.g., double-click to edit)
- Implement pagination or lazy loading for large to-do lists
- Track `createdAt` and `updatedAt` timestamps for each task
- Allow task persistence per user (e.g., session-local storage)
- Use browser `localStorage` to automatically save tasks on the client
- Provide undo/redo functionality for actions such as delete or edit
- Visual task progress chart (e.g., pie or bar chart)
