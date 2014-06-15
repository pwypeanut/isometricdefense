#pragma strict

var HP : int;

function Start () {
	transform.position.x++;
	var range_objs = Physics.OverlapSphere(transform.position, 5);
	for ( var i : int = 0; i < range_objs.Length; i++ ) {
		if ( range_objs[i].gameObject.name == "Defence Tower (Clone)" ) {
			var s : TowerController = range_objs[i].gameObject.GetComponent(TowerController);
			s.interval = 10;
		}
	}
}

function Update () {
	if ( HP <= 0 ) {
		Destroy(gameObject);
		var range_objs = Physics.OverlapSphere(transform.position, 5);
		for ( var i : int = 0; i < range_objs.Length; i++ ) {
			if ( range_objs[i].gameObject.name == "Defence Tower (Clone)" ) {
				var s : TowerController = range_objs[i].gameObject.GetComponent(TowerController);
				s.interval = 20;
			}
		}
	}
}