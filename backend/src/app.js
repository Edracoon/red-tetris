// import { connect } from './mongodb.js'
import { Server } from "socket.io";
import { launchGame } from './game.js';

// import { gameRoom } from "./gameRoom.js"

// let db = await connect()
let rooms = new Map();

const io = new Server({
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {

	console.log("connection socket", socket.id)

	// Init game for user
	socket.removeAllListeners('initgame')
	socket.on('initgame', (roomname) => {
		console.log('test authorized', socket.room, roomname)
		if (roomname !== socket?.room?.name)
		{
			socket.emit(`notauthorized:${roomname}`)
			// console.log('notauthorized')
			return ;
		}
		// Launch game loop
		console.log(socket.room, 'launchGame');
		launchGame(io, socket);
	})

	socket.on('joinRoom', (room) => {

		// Make sure user as an username
		if (room.user === undefined || room.user === '') {
			console.log('here');
			return ;
		}

		console.log('joinRoom', room)

		if (!rooms.has(room.name))
		{
			rooms.set(room.name, {
				name: room.name,
				gameMode: 'earth',
				seed: Math.random()
			})
		}
		socket.username = room.user;
		socket.room = rooms.get(room.name)

		socket.join(room.name);

		// console.log(rooms.get(room.name))

		const sendUsersList = () => {
			let users = [...(io.sockets.adapter.rooms?.get?.(room.name) ?? [])]
					.map(id => io.sockets.sockets.get(id).username)

			io.in(room.name).emit(`join:${room.name}`, users);
		}

		sendUsersList()

		// Start the game on room
		socket.on(`start:${room.name}`, () => {
			io.in(room.name).emit(`start:${room.name}`);
		})

		// Change game mode
		socket.on(`gameMode:${room.name}`, (gameMode) => {
			let newGameMode = gameMode ?? rooms.get(room.name).gameMode
			// console.log('newGameMode', newGameMode)
			rooms.get(room.name).gameMode = newGameMode
			io.in(room.name).emit(`gameMode:${room.name}`, newGameMode);
		})

		// Disconnects
		socket.on('leaveRoom', () => {
			console.log('leaveRoom1', room);
			socket.leave(room.name)
			sendUsersList()
		})
		socket.on('disconnect', sendUsersList)
	})

});

io.listen(4000);