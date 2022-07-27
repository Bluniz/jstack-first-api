const users = require("../mocks/users");

module.exports = {
  listUsers(request, response) {
    const { order } = request.query;

    const sortedUsers = users.sort((prevUser, nextUser) => {
      if (order === "desc") {
        return prevUser.id < nextUser.id ? 1 : -1;
      }

      return prevUser.id > nextUser.id ? 1 : -1;
    });

    response.send(200, sortedUsers);
  },
  getUserById(request, response) {
    const { id } = request.params;

    const user = users.find((user) => user.id === Number(id));

    if (!user) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    response.send(200, user);
  },

  createUser(request, response) {
    const { body } = request;

    const lastUserId = users[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name: body.name,
    };

    users.push(newUser);

    response.send(200, newUser);
  },

  updateUser(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    const usersExists = users.find((user) => user.id === Number(id));

    if (!usersExists) {
      response.send(400, { error: "User not found" });
      return;
    }

    const userIndex = users.findIndex((user) => user.id === usersExists.id);

    users[userIndex] = {
      id,
      name,
    };

    response.send(200, { id, name });
  },

  deleteUser(request, response) {
    const { id } = request.params;

    const usersExists = users.find((user) => user.id === Number(id));

    if (!usersExists) {
      response.send(400, { error: "User not found" });
      return;
    }

    const userIndex = users.findIndex((user) => user.id === usersExists.id);

    users.splice(userIndex, 1);

    response.send(200, { deleted: true });
  },
};
