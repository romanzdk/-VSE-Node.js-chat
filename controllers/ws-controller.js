// array of users
const users = [];

// send method
const send = (ws, data) => {
    const d = JSON.stringify({
        jsonrpc: '2.0',
        ...data
    });
    ws.send(d);
}

// check if user already exists
const isUsernameTaken = (username) => {
    let taken = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            taken = true;
            break;
        }
    }
    return taken;
}

// export module
module.exports = (ws, req) => {

    // when gets a new message
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        // check if username or actual message
        switch (data.method) {
            case 'username':
                // username is already taken
                if (isUsernameTaken(data.params.username)) {
                    send(ws, { id: data.id, error: { message: 'Username is already taken' } })
                } else { // store user with selected username
                    users.push({
                        username: data.params.username,
                        ws: ws, //websocket of the particular user
                    });
                    send(ws, { id: data.id, result: { status: 'success' } })
                }
                break;

            case 'message':
                // get the sender by his ws
                const username = users.find(user => user.ws == ws).username;

                // send message to all users
                users.forEach(user => {
                    send(user.ws, { method: 'update', params: { message: data.params.message, username: username } })
                })
                break;
        }
    })
}