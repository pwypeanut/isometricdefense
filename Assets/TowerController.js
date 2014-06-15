#pragma strict

var worker : GameObject;
var worker_enabled : boolean;
var HP : int = 5;

function MakeWorkers() {
	while (true) {
		if (worker_enabled) Instantiate(worker, transform.position, Quaternion.Euler(0, 0, 0));
		yield WaitForSeconds(10);
	}
}

function Start () {
	MakeWorkers();
}

function Update () {
	if ( HP <= 0 ) {
	 	var g : GameObject = GameObject.FindWithTag("GridController");
	 	var s : GridController = g.GetComponent(GridController);
	 	s.UpdateSquareState(transform.position.x - 1, transform.position.z - 1, 0);
		Destroy(gameObject);
	}
}