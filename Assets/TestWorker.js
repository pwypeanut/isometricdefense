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

function GetRandomPosition() {
	var x : float = Random.Range(0, 140) / 10;
	var y : float = 0.4;
	var z : float = Random.Range(0, 140) / 10;
	return Vector3(x, y, z);
}

function NearestEnemy() {
	var detectedStructures = Physics.OverlapSphere(transform.position, 100);
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

function RandomDerp() {
	while (true) {
		if (target_overwrite) {
			yield WaitForSeconds(1);
			continue;
		}
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

function MoveTo(x : Vector3) {
	print("moving");
	target_overwrite = true;
	walk_overwrite = true;
	targetPosition = x;
	yield WaitForSeconds(0.2);
	walk_overwrite = false;
	seeker.StartPath(transform.position, targetPosition, OnPathComplete);
}

function Start() {
	targetPosition = GetRandomPosition();
	seeker = new GetComponent(Seeker);
	seeker.StartPath(transform.position, targetPosition, OnPathComplete);
	//print(transform.position);
	//print(targetPosition);
	RandomDerp();
}

function Walk(p : Path) {
	for ( var p1 in p.vectorPath ) {
		transform.position = Vector3(p1.x, 0.4, p1.z);
		//print(p1);
		if (walk_overwrite) return;
		yield WaitForSeconds(0.01);
	}
}

function OnPathComplete(p : Path) {
	Debug.Log("Got error?" + p.error);
	Walk(p);
}

function Update() {
	if ( HP <= 0 ) Destroy(gameObject);
}