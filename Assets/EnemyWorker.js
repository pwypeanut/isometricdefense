#pragma strict

function DetectNearbyStructures() {
	var detectedStructures = Physics.OverlapSphere(transform.position, 100);
	var dist : float = 2000000;
	var minGO : GameObject;
	for (var i = 0; i < detectedStructures.Length; i++) {
		var x : Collider = detectedStructures[i];
		if ( x.gameObject.tag == "tower" ) {
			// Detected nearby tower
			var curDist : float = Vector3.Distance(transform.position, x.transform.position);
			if ( curDist < dist ) {
				dist = curDist;
				minGO = x.gameObject;
			}
		}
	}
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

function DetectNearbyWorkers() {
	var detectedStructures = Physics.OverlapSphere(transform.position, 100);
	var dist : float = 2000000;
	var minGO : GameObject;
	for (var i = 0; i < detectedStructures.Length; i++) {
		var x : Collider = detectedStructures[i];
		if ( x.gameObject.tag == "Worker" ) {
			// Detected nearby worker
			var curDist : float = Vector3.Distance(transform.position, x.transform.position);
			if ( curDist < dist ) {
				dist = curDist;
				minGO = x.gameObject;
			}
		}
	}
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

function Start() {
	renderer.material.color = new Color(0, 1, 0);
	AttackRoutinely();
}

function Walk(p : Path) {
	for ( var p1 in p.vectorPath ) {
		transform.position = Vector3(p1.x, 0.4, p1.z);
		//print(p1);
		yield;
	}
}

function OnPathComplete(p : Path) {
	Walk(p);
}

function AttackRoutinely() {
	while (true) {
		AttackNearby();
		yield WaitForSeconds(2);
	}
}

function AttackNearby() {
	var nearestTower = DetectNearbyStructures();
	if ( nearestTower == -1 ) nearestTower = DetectNearbyWorkers();
	if ( nearestTower != -1 ) {
		var tower : GameObject = nearestTower;
		var seeker : Seeker = GetComponent(Seeker);
		var targetPosition : Vector3 = tower.transform.position;
		seeker.StartPath(transform.position, targetPosition, OnPathComplete);
	}
}

function Update() {
	
}

function OnTriggerEnter (c : Collider) {
	print("Woah an attack");
	var g : GameObject = c.gameObject;
	if ( g.tag == "tower" ) {
		var s1 : TowerController = g.GetComponent(TowerController);
		s1.HP--;
		Destroy(gameObject);
	}
	if ( g.tag == "Worker" ) {
		var s : TestWorker = g.GetComponent(TestWorker);
		s.HP--;
		Destroy(gameObject);
	}
}