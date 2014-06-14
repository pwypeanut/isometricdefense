#pragma strict

@script ExecuteInEditMode

function Start() {
	renderer.enabled = false;
	for ( var i : int = 0; i < 196; i++ ) {
		var x : int = i / 14;
		var y : int = i % 14;
		var obj : GameObject = GameObject.Find("Grid " + i.ToString());
		obj.transform.position = Vector3(x, 0, y);
	}
}