#pragma strict

var HP : int;

function Start () {
	transform.position.x++;
	// HQ enhances all towers within 5 units' efficiency
	var range_objs = Physics.OverlapSphere(transform.position, 5);
	for ( var i : int = 0; i < range_objs.Length; i++ ) {
		// Find all towers within 5 units and reduces their spawning interval.
		if ( range_objs[i].gameObject.name == "Defence Tower (Clone)" ) {
			var s : TowerController = range_objs[i].gameObject.GetComponent(TowerController);
			s.interval = 10;
		}
	}
}

function Update () {
	if ( HP <= 0 ) {
		Destroy(gameObject);
		// If the HQ dies, all towers within 5 units return to their original efficiency.
		var range_objs = Physics.OverlapSphere(transform.position, 5);
		for ( var i : int = 0; i < range_objs.Length; i++ ) {
			if ( range_objs[i].gameObject.name == "Defence Tower (Clone)" ) {
				var s : TowerController = range_objs[i].gameObject.GetComponent(TowerController);
				s.interval = 20;
			}
		}
	}
}