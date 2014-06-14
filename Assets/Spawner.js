#pragma strict

var enemy : GameObject;

function RandomSpawn() {
	while (true) {
		Instantiate(enemy, Vector3(0, 0, Random.Range(0, 14)), Quaternion.Euler(0, 0, 0));
		yield WaitForSeconds(3);
	}
}

function Start () {
	RandomSpawn();
}