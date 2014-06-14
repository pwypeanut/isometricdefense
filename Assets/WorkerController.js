#pragma strict
/*
var redcolor : Color;

private var currentPosition : GridCoordinate;
private var destinationPosition : GridCoordinate;
private var containingGrid : GridState;
private var route : List.<GridCoordinate> = List.<GridCoordinate>();

private var squareState = new int[12, 12];
private var squareGM = new GameObject[12, 12];

function Start () {
	renderer.material.color = redcolor;
	RandomMovement();
}

function Update () {
	transform.position.z = 7.34 - currentPosition.x;
	transform.position.x = 5.94 - currentPosition.y;
	
	var gridController : GameObject = GameObject.FindWithTag("GridController");
	var gridScript = gridController.GetComponent(GridController);
	for ( var i : int = 0; i < 12; i++ ) {
		for ( var j : int = 0; j < 12; j++ ) {
			squareState[i, j] = gridScript.squareState[i, j];
			squareGM[i, j] = gridScript.squareGM[i, j];
		}
	}
}

function RandomMovement() {
	var destx : int = Random.Range(0.0, 121.0);
	var desty : int = Random.Range(0.0, 121.0);
	var destxf : float = destx / 10.0;
	var destyf : float = desty / 10.0;
	ChangeDestination(destxf, destyf);
}

function ChangeDestination(x : float, y : float) {
	if ( currentPosition != destinationPosition )
		throw new System.Exception("Cannot change destination while worker is still walking.");
	destinationPosition = GridCoordinate(x, y);
	MoveToDestination();
}

function MoveToDestination() {
	this.FindRoute();
	var routeLength : int = route.Count;
	for ( var i = 0; i < routeLength - 1; i++ ) {
		for ( var j = 0; j < 5; j++ ) {
			currentPosition.x = route[i].x + (route[i + 1].x - route[i].x) * j * 0.2;
			currentPosition.y = route[i].y + (route[i + 1].y - route[i].y) * j * 0.2;
			yield;
		}
	}
	currentPosition = destinationPosition;
}

function FindRoute() {
	var priorityQueue : PriorityQueue = new PriorityQueue();
	var visitedStates : Hashtable = new Hashtable();
	priorityQueue.Push(DijkstraState(0.0, currentPosition, GridCoordinate(-1, -1)));
	while ( priorityQueue.Empty() == false ) {
		var state : DijkstraState = priorityQueue.Front();
		print(state.distance.ToString() + " " + state.position.x.ToString() + " " + state.position.y.ToString());
		priorityQueue.Pop();
		
		if ( visitedStates.ContainsKey(state.position) == true )
			continue;
		else
			visitedStates.Add(state.position, state.sourcePosition);
		if ( state.position == destinationPosition ) {
			route.Clear();
			var backtrackPosition : GridCoordinate = destinationPosition;
			while ( backtrackPosition != GridCoordinate(-1, -1) ) {
				route.Insert(route.Count, backtrackPosition);
				backtrackPosition = visitedStates[backtrackPosition];
			}
			route.Reverse();
			return;
		}
		for ( var dx : float = -0.1; dx <= 0.1; dx += 0.1 ) {
			for ( var dy : float = -0.1; dy <= 0.1; dy += 0.1 ) {
				var newCoordinate : GridCoordinate = state.position;
				var dist : float;
				newCoordinate.x += dx;
				newCoordinate.y += dy;
				if ( newCoordinate.x < 0.0 || newCoordinate.x >= 12.0 )
					continue;
				if ( newCoordinate.y < 0.0 || newCoordinate.y >= 12.0 )
					continue;
				if ( this.containingGrid.GetSquare(Mathf.Floor(newCoordinate.x), Mathf.Floor(newCoordinate.y)) )
					continue; 
				if ( visitedStates.ContainsKey(newCoordinate) )
					continue;
				if ( Mathf.Abs(dx) + Mathf.Abs(dy) == 0.2 )
					dist = 1.41;
				else if ( Mathf.Abs(dx) + Mathf.Abs(dy) == 0.1 )
					dist = 1.00;
				else
					dist = 0.00;
				priorityQueue.Push(DijkstraState(state.distance + dist, newCoordinate, state.position));
			}
		}
	}
}
*/

