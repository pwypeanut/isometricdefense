#pragma strict

var squareState = new int[12, 12];
var squareGM = new GameObject[12, 12];

function UpdateSquareState(x : int, y : int, n : int) {
	squareState[x, y] = n;
}

function UpdateSquareGM(x : int, y : int, gm : GameObject) {
	squareGM[x, y] = gm;
}