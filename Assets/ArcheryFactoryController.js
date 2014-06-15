#pragma strict

var arrow : GameObject;
var HP : int = 10;

function NearestEnemy() {
	var detectedStructures = Physics.OverlapSphere(transform.position, 5);
	var dist : float = 2000000;
	var minGO : GameObject;
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
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

function ShootArrowRoutinely() {
	while (true) {
		var ne = NearestEnemy();
		if ( ne == -1 ) {
			yield WaitForSeconds(1);
			continue;
		}
		else {
			var structure : GameObject = ne;
			var arr : GameObject = Instantiate(arrow, transform.position, Quaternion.Euler(0, 0, 0));
			print("shooting lol");
			arr.transform.LookAt(structure.transform.position);
			arr.transform.Rotate(Vector3.right * 90);
			var force : Vector3 = structure.transform.position - transform.position;
			arr.rigidbody.AddForce(force.normalized * 1000);
		}
		yield WaitForSeconds(1);
	}
}

function Start () {
	ShootArrowRoutinely();
}

function Update() {
	if ( HP <= 0 ) Destroy(gameObject);
}