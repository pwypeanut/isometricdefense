#pragma strict

var arrow : GameObject;
var HP : int = 10;

// Function to find the nearest enemy
function NearestEnemy() {
	// Get all detected objects within 5 game units.
	var detectedStructures = Physics.OverlapSphere(transform.position, 5);
	var dist : float = 2000000;
	var minGO : GameObject;
	// Loop through all the structures to find minimum distance
	for (var i = 0; i < detectedStructures.Length; i++) {
		var x : Collider = detectedStructures[i];
		if ( x.gameObject.tag == "EnemyWorker" ) {
			// Detected nearby worker
			var curDist : float = Vector3.Distance(transform.position, x.transform.position);
			if ( curDist < dist ) {
				dist = curDist;
				minGO = x.gameObject;
			}
		}
	}
	// If cannot find any enemy return -1.
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

function ShootArrowRoutinely() {
	while (true) {
		// Continually fires arrows every second if enemy spotted
		var ne = NearestEnemy();
		if ( ne == -1 ) {
			// If no enemy, wait another second
			yield WaitForSeconds(1);
			continue;
		}
		else {
			// If enemy, spawn an arrow, point it toward the enemy, and fire it.
			var structure : GameObject = ne;
			var arr : GameObject = Instantiate(arrow, transform.position, Quaternion.Euler(0, 0, 0));
			arr.transform.LookAt(structure.transform.position);
			arr.transform.Rotate(Vector3.right * 90);
			var force : Vector3 = structure.transform.position - transform.position;
			arr.rigidbody.AddForce(force.normalized * 1000);
			Destroy(arr, 5);
			audio.Play();
		}
		yield WaitForSeconds(1);
	}
}

function Start () {
	ShootArrowRoutinely();
}

function Update() {
	// If HP = 0, die.
	if ( HP <= 0 ) Destroy(gameObject);
}