#pragma strict

var enemy : GameObject;
var worker : GameObject;

function RandomSpawn() {
	while (true) {
		Instantiate(enemy, Vector3(0, 0.4, Random.Range(0, 14)), Quaternion.Euler(0, 0, 0));
		yield WaitForSeconds(3);
	}
}

function Start () {
	for ( var i : int = 0; i < 5; i++ ) {
		Instantiate(worker, Vector3(Random.Range(0, 14), 0.4, Random.Range(0, 14)), Quaternion.Euler(0, 0, 0));
	}
	RandomSpawn();
}