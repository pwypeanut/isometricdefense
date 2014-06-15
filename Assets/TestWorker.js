#pragma strict
import UnityEngine;
import System.Collections;
import Pathfinding;

var targetPosition : Vector3;
var seeker : Seeker;
var target_overwrite : boolean = false;
var walk_overwrite : boolean = false;
var HP : int = 1;
var dying : boolean = false;

// Give a random position on the grid for the worker to head toward
function GetRandomPosition() {
	var x : float = Random.Range(0, 140) / 10;
	var y : float = 0.4;
	var z : float = Random.Range(0, 140) / 10;
	return Vector3(x, y, z);
}

function NearestEnemy() {
	// Get all detected structures
	var detectedStructures = Physics.OverlapSphere(transform.position, 100);
	var dist : float = 2000000;
	var minGO : GameObject;
	// Loop through the detected structures and find the enemy worker with the minimum distance.
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
	// If no enemy worker found return -1.
	if ( dist == 2000000 ) return -1;
	else return minGO;
}

function RandomDerp() {
	while (true) {
		// If target overwritten, rerun the loop.
		if (target_overwrite) {
			yield WaitForSeconds(1);
			continue;
		}
		// Else try to find the nearest enemy to attack, if none, find a random position and head there.
		var x = NearestEnemy();
		if ( x == -1 ) targetPosition = GetRandomPosition();
		else {
			var y : GameObject = x;
			targetPosition = y.transform.position;
		}
		seeker.StartPath(transform.position, targetPosition, OnPathComplete);
		while (transform.position != targetPosition) yield;
		yield WaitForSeconds(1);
	}
}

// Makes the worker purposely move to a position
function MoveTo(x : Vector3) {
	// Overwrites both the move and the walking function.
	target_overwrite = true;
	walk_overwrite = true;
	// Sets the position to the destination and finds path.
	targetPosition = x;
	yield WaitForSeconds(0.2);
	walk_overwrite = false;
	seeker.StartPath(transform.position, targetPosition, OnPathComplete);
}

function Start() {
	targetPosition = GetRandomPosition();
	seeker = new GetComponent(Seeker);
	seeker.StartPath(transform.position, targetPosition, OnPathComplete);
	RandomDerp();
}

function Walk(p : Path) {
	// Each 0.01 second move the worker one node forward.
	for ( var p1 in p.vectorPath ) {
		transform.position = Vector3(p1.x, 0.4, p1.z);
		if (walk_overwrite) return;
		yield WaitForSeconds(0.01);
	}
}

function OnPathComplete(p : Path) {
	Walk(p);
}

function Update() {
	// If HP = 0, destroy the worker.
	if ( HP <= 0 ) Destroy(gameObject);
}