export class Piece {
	constructor(colorid, shape) {
		this.x = 5 - Math.ceil(shape.length / 2);
		this.y = 0;
		this.colorid = colorid;
		this.shape = shape.map(row => [...row]);
		this.rotation = 0;
	}
	clone() {
		let newShape = new Piece(this.colorid, this.shape);
		newShape.x = this.x;
		newShape.y = this.y;
		return newShape;
	}
	intersect(board) {
		for (let y in this.shape)
		{
			for (let x in this.shape[y])
			{
				let cell = this.shape[y][x]
				if (!cell)
					continue ;

				let rx = this.x + +x;
				let ry = this.y + +y;
				if (
					rx < 0
					|| rx >= board[0].length
					|| ry >= board.length
					|| board?.[ry]?.[rx]
				)
					return (true);
			}
		}
		return (false);
	}
	rotateLeft(board) {
		let old_shape = this.shape.map(row => [...row]);
		for (let y in this.shape)
			for (let x in this.shape[y])
				this.shape[y][x] = old_shape[this.shape.length - 1 - x][y];
		
		const tests = [
			[[-1, 0], [-1,  1], [0, -2], [-1, -2]],
			[[ 1, 0], [ 1, -1], [0,  2], [ 1,  2]],
			[[ 1, 0], [ 1,  1], [0, -2], [ 1, -2]],
			[[-1, 0], [-1, -1], [0,  2], [-1,  2]],
		][this.rotation % 4]

		for (let [x, y] of tests)
		{
			if (!this.intersect(board))
			{
				++this.rotation;
				return ;
			}
			this.move(board, x, y);
		}
		this.shape = old_shape;
	}
	move(board, ox, oy) {
		this.x += ox;
		this.y += oy;
		if (this.intersect(board))
		{
			this.x -= ox;
			this.y -= oy;
			return (false)
		}
		return (true)
	}
	tick(board) {
		return this.move(board, 0, 1);
	}
	drawOn(board) {
		let copyBoard = board.map(row => [...row]);
		for (let y in this.shape)
		{
			for (let x in this.shape[y])
			{
				if (this.shape[y][x])
				{
					let py = this.y + +y;
					let px = this.x + +x;
					if (copyBoard[py]?.[px] !== undefined)
						copyBoard[py][px] = this.colorid;
				}
			}
		}
		return copyBoard;
	}
}

export class Tetriminos {
	constructor(colorid, y, shape) {
		this.colorid = colorid;
		this.y = y;
		this.shape = shape;
	}
	constructPiece() {
		let piece = new Piece(this.colorid, this.shape);
		piece.y = this.y;
		return (piece);
	}
}

export const TETRIMINOS = [
	new Tetriminos(
		1,
		-2,
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	),
	new Tetriminos(
		2,
		-1,
		[
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		3,
		-1,
		[
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		4,
		-1,
		[
			[1, 1],
			[1, 1]
		]
	),
	new Tetriminos(
		5,
		-1,
		[
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		6,
		-1,
		[
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		7,
		-1,
		[
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		]
	)
];