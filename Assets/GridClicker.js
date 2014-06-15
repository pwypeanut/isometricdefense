#pragma strict

import System.Collections.Generic;

var tower : GameObject;
var ghosttower : GameObject;
var actcube : GameObject;
var ghostactcube : GameObject;
var greencolor : Color;
var redcolor : Color;
var pinkcolor : Color;
var emptyObject : GameObject;
var archTowerPrefab : GameObject;
var HQPrefab : GameObject;
private var gridScript : GridController;
private var defaultcolor : Color;
private var id : int = -1;
private var x : int = -1;
private var y : int = -1;
private var squareState = new int[12, 12];
private var ghostState : int;
private var squareGM = new GameObject[12, 12];
private var towers : List.<Tower> = List.<Tower>();

class Tower {
	var configState = new int[3, 3];
	var endID : int;
	var endObject : GameObject;
}

// Setup the configurations for archer tower.
function SetupArcherTower() {
	// Two different rotations for the tower formation.
	var archTower : Tower = new Tower();
	archTower.configState[0, 0] = 0;
	archTower.configState[0, 1] = 1;
	archTower.configState[0, 2] = 0;
	archTower.configState[1, 0] = 0;
	archTower.configState[1, 1] = 2;
	archTower.configState[1, 2] = 0;
	archTower.configState[2, 0] = 0;
	archTower.configState[2, 1] = 1;
	archTower.configState[2, 2] = 0;
	archTower.endID = 3;
	archTower.endObject = archTowerPrefab;
	towers.Add(archTower);
	var archTower2 : Tower = new Tower();
	archTower2.configState[0, 0] = 0;
	archTower2.configState[0, 1] = 0;
	archTower2.configState[0, 2] = 0;
	archTower2.configState[1, 0] = 1;
	archTower2.configState[1, 1] = 2;
	archTower2.configState[1, 2] = 1;
	archTower2.configState[2, 0] = 0;
	archTower2.configState[2, 1] = 0;
	archTower2.configState[2, 2] = 0;
	archTower2.endID = 4;
	archTower2.endObject = archTowerPrefab;
	towers.Add(archTower2);
}

// Setup the configuration for the HQ Building
function SetupHQBuilding() {
	var HQ : Tower = new Tower();
	HQ.configState[0, 0] = 0;
	HQ.configState[0, 1] = 0;
	HQ.configState[0, 2] = 0;
	HQ.configState[1, 0] = 1;
	HQ.configState[1, 1] = 2;
	HQ.configState[1, 2] = 0;
	HQ.configState[2, 0] = 1;
	HQ.configState[2, 1] = 1;
	HQ.configState[2, 2] = 0;
	HQ.endID = 5;
	HQ.endObject = HQPrefab;
	towers.Add(HQ);
}

// Returns the intended rotation of the tower.
function rotOf(t : int) {
	if ( t == 4 ) return Quaternion.Euler(0, -90, 0);
	else return Quaternion.Euler(0, 0, 0);
}

// Returns if the current configuration can be turned into tower t.
function canTurn(t : Tower, x : int, y : int) {
	// Loop through each node to see whether it has the correct tower.
	for ( var i : int = 0; i < 3; i++ ) {
		for ( var j : int = 0; j < 3; j++ ) {
			if ( i == 1 && j == 1 )
				continue;
			if ( t.configState[i, j] == 0 )
				continue;
			if ( x + i - 1 < 0 || x + i - 1 > 11 )
				return false;
			if ( y + j - 1 < 0 || y + j - 1 > 11 )
				return false;
			if ( t.configState[i, j] != squareState[x + i - 1, y + j - 1] ) 
				return false;
		}
	}
	return true;
}

// Attempts to change tower centered at (x, y) to tower id.
function change(x : int, y : int, id : int) {
	var t : Tower = towers[id];
	// Loop through each node to change the specific tower type on that node.
	for ( var i : int = 0; i < 3; i++ ) {
		for ( var j : int = 0; j < 3; j++ ) {
			if ( t.configState[i, j] == 0 )
				continue;
			// Destroy the current tower and add the new one.
			Destroy(squareGM[x + i - 1, y + j - 1]);
			squareGM[x + i - 1, y + j - 1] = emptyObject;
			// Update the square state on the main controller.
			gridScript.UpdateSquareGM(x + i - 1, y + j - 1, squareGM[x + i - 1, y + j - 1]);
			if ( squareState[x + i - 1, y + j - 1] != 0 )
				squareState[x + i - 1, y + j - 1] = -1;
			gridScript.UpdateSquareState(x + i - 1, y + j - 1, squareState[x + i - 1, y + j - 1]);
		}
	}
	// Set the state of the new tower.
	squareState[x, y] = t.endID;
	gridScript.UpdateSquareState(x, y, t.endID);
	squareGM[x, y] = Instantiate(t.endObject, transform.position, rotOf(t.endID));
	gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
}


function Start () {
	Update();
	// Set the activation cube to pink in color
	actcube.renderer.material.color = pinkcolor;
	defaultcolor = renderer.material.color;
	id = parseInt((name.Split(" "[0]))[1]);
	// Find the x, y coordinates of this node
	x = id / 14;
	y = id % 14;
	x--;
	y--;
	// Setup the configurations for archer tower and HQ building.
	SetupArcherTower();
	SetupHQBuilding();
}

// On mouse enter, check if a building is placeable, if so, highlight it green and put a ghost tower above it.
function OnMouseEnter () {
	if ( x >= 0 && x < 12 && y >= 0 && y < 12 ) {
		if ( squareState[x, y] == 0 ) {
			renderer.material.color = greencolor;
			squareGM[x, y] = Instantiate(ghosttower, transform.position + Vector3(0, 0.5, 0), Quaternion.Euler(0, 0, 0));
			gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
			ghostState = 1;
		}
	}
	else {
		renderer.material.color = redcolor;
	}
}

// On mouse exit, remove the ghost tower and the coloring.
function OnMouseExit () {
	renderer.material.color = defaultcolor;
	if ( x >= 0 && x < 12 && y >= 0 && y < 12 ) {
		if ( typeof(squareGM[x ,y]) == GameObject && squareState[x, y] == 0 ) {
			Destroy(squareGM[x, y]);
			squareGM[x, y] = emptyObject;
			gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
		}
	}
	ghostState = 0;
}

function OnMouseOver () {
	if ( x >= 0 && x < 12 && y >= 0 && y < 12 ) {
		if ( squareState[x, y] == 0 ) {
			if ( Input.GetKey(KeyCode.LeftShift) ) {
				// On mouse over, if the shift key is pressed down, check if an activation cube
				// is placeable at that position, if so highlight it green and put a ghost cube.
				Destroy(squareGM[x, y]);
				squareGM[x, y] = Instantiate(ghostactcube, transform.position + Vector3(0, 1, 0), Quaternion.Euler(0, 0, 0));
				gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
				ghostState = 2;
				if ( canActivate(x, y) == -1 )
					renderer.material.color = redcolor;
			}
			else if ( ghostState == 2 ) {
				// On mouse over, if the shift key is not pressed, check if a tower is placeable
				// there. if so add the ghost tower and highlight it green.
				Destroy(squareGM[x, y]);
				squareGM[x, y] = Instantiate(ghosttower, transform.position + Vector3(0, 0.5, 0), Quaternion.Euler(0, 0, 0));
				gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
				ghostState = 1;
				if ( canActivate(x, y) == -1 )
					renderer.material.color = defaultcolor;
			}
		}
	}
}

function canActivate(x : int, y : int) {
	for ( var i = 0; i < towers.Count; i++ ) {
		if ( canTurn(towers[i], x, y) ) return i;
	}
	return -1;
}

function OnMouseDown () {
	if ( x >= 0 && x < 12 && y >= 0 && y < 12 ) {
		if ( Input.GetKey(KeyCode.LeftShift) ) {
			// Place Activation Cube
			var ca : int = canActivate(x, y);
			if ( squareState[x, y] == 0 && ca != -1 ) {
				Destroy(squareGM[x, y]);
				squareGM[x, y] = Instantiate(actcube, transform.position + Vector3(0, 0.5, 0), Quaternion.Euler(0, 0, 0));
				gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
				squareState[x, y] = 2;
				gridScript.UpdateSquareState(x, y, 2);
				yield WaitForSeconds(0.5);
				change(x, y, ca);
			}
		}
		else {
			// Place Basic Tower
			if ( squareState[x, y] == 0 ) {
				// Find 5 Workers To Build
				var w = Physics.OverlapSphere(transform.position, 100);
				var workers : List.<GameObject> = List.<GameObject>();
				for ( var i : int = 0; i < w.Length; i++ ) {
					if ( w[i].gameObject.tag == "Worker" ) {
						if ( w[i].GetComponent(TestWorker).dying == false ) workers.Add(w[i].gameObject);
					}
				}
				// If too little workers, dont build tower.
				if ( workers.Count < 5 ) return;
				for ( i = 0; i < 5; i++ ) {
					var s : TestWorker = workers[i].GetComponent(TestWorker);
					s.dying = true;
					s.MoveTo(Vector3(x + 1, 0.4, y + 1));
					Destroy(workers[i], 5);
				}
				// Update the square state and play the putting tower audio.
				Destroy(squareGM[x, y]);
				squareGM[x, y] = Instantiate(tower, transform.position, Quaternion.Euler(0, 0, 0));
				gridScript.UpdateSquareGM(x, y, squareGM[x, y]);
				squareState[x, y] = 1;
				gridScript.UpdateSquareState(x, y, 1);
				audio.Play();
			}
		}
	}
}

function Update() {
	var gridController : GameObject = GameObject.FindWithTag("GridController");
	gridScript = gridController.GetComponent(GridController);
	for ( var i : int = 0; i < 12; i++ ) {
		for ( var j : int = 0; j < 12; j++ ) {
			squareState[i, j] = gridScript.squareState[i, j];
			squareGM[i, j] = gridScript.squareGM[i, j];
		}
	}
}