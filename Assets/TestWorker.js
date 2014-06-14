#pragma strict
import UnityEngine;
import System.Collections;
import Pathfinding;

var targetPosition : Vector3;
var seeker : Seeker;
var HP : int = 1;

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

function Start() {
	renderer.material.color = new Color(1, 0, 0, 1);
	targetPosition = GetRandomPosition();
	seeker = new GetComponent(Seeker);
	seeker.StartPath(transform.position, targetPosition, OnPathComplete);
	print(transform.position);
	print(targetPosition);
	RandomDerp();
}

function Walk(p : Path) {
	for ( var p1 in p.vectorPath ) {
		transform.position = Vector3(p1.x, 0.4, p1.z);
		//print(p1);
		yield;
	}
}

function OnPathComplete(p : Path) {
	Debug.Log("Got error?" + p.error);
	Walk(p);
}

function Update() {
	if ( HP <= 0 ) Destroy(gameObject);
}