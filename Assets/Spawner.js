#pragma strict

var enemy : GameObject;
var worker : GameObject;

// Spawns the enemy at a random edge along the side of the grid.
function SpawnEnemy() {
	var side : int = Random.Range(0, 4);
	var a : int = Random.Range(0, 14);
	if (side == 0) {
		Instantiate(enemy, Vector3(0, 0.4, Random.Range(0, 14)), Quaternion.Euler(0, 0, 0));
	}
	else if (side == 1) {
		Instantiate(enemy, Vector3(Random.Range(0, 14), 0.4, 0), Quaternion.Euler(0, 0, 0));
	}
	else if (side == 2) {
		Instantiate(enemy, Vector3(13, 0.4, Random.Range(0, 14)), Quaternion.Euler(0, 0, 0));
	}
	else {
		Instantiate(enemy, Vector3(Random.Range(0, 14), 0.4, 13), Quaternion.Euler(0, 0, 0));
	}
}

function StartLevel(x : int) {
	for ( var i : int = 0; i < (5 + x * 3); i++ ) {
		SpawnEnemy();
		yield WaitForSeconds(10/(5+x*3));
	}
}

function Start () {
	// Spawn 5 workers automatically at the start of the game.
	for ( var i : int = 0; i < 5; i++ ) {
		Instantiate(worker, Vector3(Random.Range(0, 14), 0.4, Random.Range(0, 14)), Quaternion.Euler(0, 0, 0));
	}
}