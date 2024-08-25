import { createServer, Model, Response } from "miragejs";

export default function () {
  createServer({
    models: {
      users: Model,
      todos: Model,
    },

    seeds(server) {
      server.create("todo", {
        id: "1",
        text: "Create a portfolio website",
        isCompleted: false,
      });
      server.create("todo", {
        id: "2",
        text: "Complete Sprint tasks",
        isCompleted: false,
      });
      server.create("todo", {
        id: "3",
        text: "Lunch time",
        isCompleted: false,
      });
      server.create("todo", {
        id: "4",
        text: "Sleep",
        isCompleted: false,
      });
      server.create("todo", {
        id: "5",
        text: "Wake up",
        isCompleted: false,
      });
      server.create("todo", {
        id: "6",
        text: "Code",
        isCompleted: false,
      });
      server.create("todo", {
        id: "7",
        text: "Repeat cycle",
        isCompleted: false,
      });
    },

    routes() {
      this.namespace = "api"; // Prefix all routes with /api

      // Dummy user credentials
      const users = [
        {
          id: "1",
          name: "Chiefman Bernard",
          email: "chiefmanbernard@dasgehirn.com",
          password: "force",
        },
      ];

      // Login Route
      this.post("/user/login", (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Simulate a successful login
          return {
            token: "dummy-jwt-token",
            user,
          };
        } else {
          // Simulate failed login
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });

      // Account Route
      this.get("/user/account", (schema, request) => {
        const token = request.requestHeaders.Authorization;

        // Verify if token is correct (In real scenarios, you'd verify the token)
        if (token === "Bearer dummy-jwt-token") {
          // Send account details
          return {
            id: "1",
            name: "Bernard Arhia",
            email: "chiefmanbernard@dasgehirn.com",
          };
        } else {
          return new Response(401, {}, { message: "Unauthorized" });
        }
      });

      this.get("/todos", (schema) => {
        return schema.all("todos");
      });

      // Add a new todo
      this.post("/todos", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const newTodo = {
          id: Date.now().toString(),
          ...attrs,
        };
        return schema.create("todos", newTodo);
      });

      // Update an existing todo
      this.put("/todos/:id", (schema, request) => {
        let todo = schema.find("todos", request.params.id);
        let attrs = JSON.parse(request.requestBody);
        if (todo) {
          todo.update({
            text: attrs.text,
            isCompleted: attrs.isCompleted,
          });
        }
        return todo;
      });

      // Delete a todo
      this.delete("/todos/:id", (schema, request) => {
        let todo = schema.find("todos", request.params.id);
        if (todo) {
          todo.destroy();
        }
        return todo;
      });
    },
  });
}
