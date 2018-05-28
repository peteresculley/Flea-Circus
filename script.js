const numCellsWide = 30;
const numCellsHigh = 30;

var width = 0;
var height = 0;
var cellWidth = 0;
var cellHeight = 0;

var ringCount = 0;
var fleaGrid = [];

var ctx;

window.onload = () => {
	var c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	
	width = c.width;
	height = c.height;
	cellWidth = width / numCellsWide;
	cellHeight = height / numCellsHigh;
	fleaWidth = cellWidth / 5;
	fleaHeight = cellHeight / 5;
	
	resetGrid(ctx);
}

function resetGrid() {
	ctx.clearRect(0, 0, width, height);
	
	fleaGrid = [];
	for(let i = 0; i < numCellsWide; i++) {
		let row = [];
		for(let j = 0; j < numCellsHigh; j++) {
			row.push(1);
		}
		fleaGrid.push(row);
	}
	
	drawGrid(ctx);
	drawFleas(ctx, fleaGrid);
	ringCount = 0;
	
	updateCount();
}

function drawGrid(ctx) {
	for(let i = 0; i < numCellsWide; i++) {
		ctx.beginPath();
		ctx.moveTo(i * cellWidth, 0);
		ctx.lineTo(i * cellWidth, height);
		ctx.stroke();
	}
	for(let i = 0; i < numCellsHigh; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * cellHeight);
		ctx.lineTo(width, i * cellHeight);
		ctx.stroke();
	}
}

function drawFleas(ctx, fleaGrid) {
	for(let i = 0; i < numCellsWide; i++) {
		for(let j = 0; j < numCellsHigh; j++) {
			let startX = i * cellWidth;
			let startY = j * cellHeight;
			let fleas = (fleaGrid[i])[j];
			let radius = Math.ceil(Math.sqrt(fleas));
			let placedCount = 0;
			for(let kx = 0; kx < radius; kx++) {
				for(let ky = 0; ky < radius; ky++) {
					if(placedCount < fleas) {
						ctx.fillRect(startX + (cellWidth/2) - (radius/2)*fleaWidth + kx*fleaWidth, startY + (cellHeight/2) - (radius/2)*fleaHeight + ky*fleaHeight, fleaWidth, fleaHeight);
						placedCount++;
					}
				}
			}
		}
	}
}

function ringBell() {
	ctx.clearRect(0, 0, width, height);
	let newFleaGrid = [];
	for(let i = 0; i < numCellsWide; i++) {
		let row = [];
		for(let j = 0; j < numCellsHigh; j++) {
			row.push(0);
		}
		newFleaGrid.push(row);
	}
	
	for(let i = 0; i < numCellsWide; i++) {
		for(let j = 0; j < numCellsHigh; j++) {
			for(let k = 0; k < fleaGrid[i][j]; k++) {
				let jumpOptions = [];
				if(i > 0) {
					jumpOptions.push({x: -1, y: 0});
				}
				if(i+1 < numCellsWide) {
					jumpOptions.push({x: 1, y: 0});
				}
				if(j > 0) {
					jumpOptions.push({x: 0, y: -1});
				}
				if(j+1 < numCellsHigh) {
					jumpOptions.push({x: 0, y: 1});
				}
				let jump = jumpOptions[Math.floor(Math.random() * jumpOptions.length)];
				newFleaGrid[i + jump.x][j + jump.y]++;
			}
		}
	}
	fleaGrid = newFleaGrid;
	
	drawGrid(ctx);
	drawFleas(ctx, fleaGrid);
	ringCount++;
	
	updateCount();
}

function updateCount() {
	let emptyCount = 0;
	for(let i = 0; i < numCellsWide; i++) {
		for(let j = 0; j < numCellsHigh; j++) {
			if(fleaGrid[i][j] == 0) {
				emptyCount++;
			}
		}
	}
	
	document.getElementById("emptyCount").innerHTML = "Number of empty squares: " + emptyCount;
	document.getElementById("ringCount").innerHTML = "Number of bell rings: " + ringCount;
}

function autoRingBell() {
	if(ringCount < 50) {
		ringBell();
		setTimeout(autoRingBell, 120);
	}
}
