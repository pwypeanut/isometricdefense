#pragma strict

//@script ExecuteInEditMode()

var grid : GameObject;
var num : int = 0;

function Start () {
	for ( var i : int = -6; i >= -19; i-- ) {
		for ( var j : int = -6; j >= -19; j-- ) {
			var gm : GameObject = Instantiate(grid, Vector3(i, 0, j), Quaternion.Euler(90, 0, 0));
			gm.transform.name = ("Grid " + num);
			num++;
		}
	}
}