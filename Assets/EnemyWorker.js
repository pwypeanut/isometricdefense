#pragma strict

// Function to detect nearby towers
function DetectNearbyStructures() {
	// Get all objects within the game.
	var detectedStructures = Physics.OverlapSphere(transform.position, 100);
	var dist : float = 2000000;
	var minGO : GameObject;
	// Loop through all the towers to get the minimum distance structure
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
	// If no structure found return -1.
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

// Function to detect nearby workers.
function DetectNearbyWorkers() {
	// Find all objects within the game.
	var detectedStructures = Physics.OverlapSphere(transform.position, 100);
	var dist : float = 2000000;
	var minGO : GameObject;
	// Loop through to find worker with minimum distance.
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
	// If cannot find return -1.
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

function Start() {
	AttackRoutinely();
}

// Function to move worker along a path.
function Walk(p : Path) {
	// Every 0.05 seconds move the worker one node forward.
	for ( var p1 in p.vectorPath ) {
		transform.position = Vector3(p1.x, 0.4, p1.z);
		//print(p1);
		yield WaitForSeconds(0.05);
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
	// Find the nearest attackable source to attack, first choice towers, then workers.
	var nearestTower = DetectNearbyStructures();
	if ( nearestTower == -1 ) nearestTower = DetectNearbyWorkers();
	if ( nearestTower != -1 ) {
		var tower : GameObject = nearestTower;
		var seeker : Seeker = GetComponent(Seeker);
		var targetPosition : Vector3 = tower.transform.position;
		// Find a path.
		seeker.StartPath(transform.position, targetPosition, OnPathComplete);
	}
}

var killed : boolean = false;

function OnTriggerEnter (c : Collider) {
	// If the enemy worker hits something
	var g : GameObject = c.gameObject;
	if (killed) return;
	if ( g.tag == "tower" ) {
		// If it hits a tower, it destroys itself and reduces the towers' HP.
		killed = true;
		var s1 : TowerController = g.GetComponent(TowerController);
		var s1a : ArcheryFactoryController = g.GetComponent(ArcheryFactoryController);
		var s1b : HQController = g.GetComponent(HQController);
		if ( s1 != null ) s1.HP--;
		if ( s1a != null ) s1a.HP--;
		if ( s1b != null ) s1b.HP--;
		Destroy(gameObject);
	}
	if ( g.tag == "Worker" ) {
		// If it hits a worker, it destroys the worker as well as itself.
		killed = true;
		var s : TestWorker = g.GetComponent(TestWorker);
		s.HP--;
		var s2 : GameObject = GameObject.FindWithTag("GridController");
		var g1 : ScoreKeeper = s2.GetComponent(ScoreKeeper);
		g1.score++;
		Destroy(gameObject);
	}
	if ( g.tag == "arrow" ) {
		// If it hits an arrow, the enemy dies.
		killed = true;
		var s3 : GameObject = GameObject.FindWithTag("GridController");
		var g2 : ScoreKeeper = s3.GetComponent(ScoreKeeper);
		g2.score++;
		Destroy(gameObject);
	}
	
}