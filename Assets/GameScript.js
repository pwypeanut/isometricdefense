#pragma strict

import System.Collections;
import System.Collections.Generic;

class DijkstraState {
	var distance : float;
	var position : GridCoordinate;
	var sourcePosition : GridCoordinate;
	function DijkstraState(dist : float, pos : GridCoordinate, sourcePos : GridCoordinate) {
		this.distance = dist;
		this.position = pos;
		this.sourcePosition = sourcePos;
	}
}

class PriorityQueue {
	private var list : List.<DijkstraState> = List.<DijkstraState>();
	function Front() {
		return list[0];
	}
	function Pop() {
		this.list.RemoveAt(0);
	}
	function Empty() {
		return (this.list.Count == 0);
	}
	function Push(x : DijkstraState) {
		var listSize : int = this.list.Count;
		for ( var i : int = 0; i < listSize; i++ ) {
			if ( this.list[i].distance > x.distance ) {
				this.list.Insert(i, x);
				return;
			}
		}
	}
}

class GridCoordinate {
	var x : float;
	var y : float;
	function GridCoordinate(x : float, y : float) {
		this.x = x;
		this.y = y;
	}
}

class BuildingConfigurations {
	static var configurations : List.<BuildingConfiguration> = new List.<BuildingConfiguration>();
}

class BuildingType {
	static var EMPTY : int = 0;
	static var FACTORY : int = 1;
	static var ACTIVATION_TOWER : int = 2;
}

class BuildingConfiguration {
	var configState = new int[3, 3];
	var endState = new int[3, 3];
	function BuildingConfiguration() {
		for ( var i : int = 0; i < 3; i++ )
			for ( var j : int = 0; j < 3; j++ )
				this.configState[i, j] = BuildingType.EMPTY;
		this.configState[1, 1] = BuildingType.ACTIVATION_TOWER;
	}
	function ModifyConfigState(x : int, y : int, type : int) {
		if ( x == 1 && y == 1 && type != BuildingType.ACTIVATION_TOWER )
			throw new System.Exception("Cannot remove activation tower from configuration.");
		if ( x != 1 && y != 1 && type == BuildingType.ACTIVATION_TOWER )
			throw new System.Exception("Cannot have more than 1 activation tower in a configuration.");
		this.configState[x, y] = type;
	}
	function ModifyEndState(x : int, y : int, type : int) {
		if ( type == BuildingType.ACTIVATION_TOWER )
			throw new System.Exception("End state cannot have an activation tower.");
		this.endState[x, y] = type;
	}
}

class GridState {
	private var squareState = new int[12, 12];
	
	function GetSquare(x : int, y : int) {
		return this.squareState[x, y];
	}
	function SetSquare(x : int, y : int, v : int) {
		this.squareState[x, y] = v;
	}
	function GridState() {
		for ( var i : int = 0; i < 12; i++ )
			for ( var j : int = 0; j < 12; j++ )
				this.SetSquare(i, j, BuildingType.EMPTY);
	}
	function GetTowerType(x : int, y : int) {
		if ( x == 0 || x == 11 ) return -1;
		if ( y == 0 || y == 11 ) return -1;
		for ( var config : BuildingConfiguration in BuildingConfigurations.configurations ) {
			var match_correct : boolean = true;
			for ( var i : int = 0; i < 3; i++ ) 
				for ( var j : int = 0; j < 3; j++ )
					if ( config.configState[i, j] != this.squareState[x + i - 1, y + j - 1] )
						match_correct = false;
			if ( match_correct ) return config;
		}
		return -1;
	}
	function ReplaceConfiguration(x : int, y : int, config : BuildingConfiguration) {
		for ( var i : int = 0; i < 3; i++ ) 
			for ( var j : int = 0; j < 3; j++ )
				this.squareState[x + i - 1, y + j - 1] = config.configState[x, y];
	}
	
	function PlaceFactory(x : int, y : int) {
		if ( this.GetSquare(x, y) != BuildingType.EMPTY )
			throw new System.Exception("Factory cannot be placed in non-empty spot.");
		this.SetSquare(x, y, BuildingType.FACTORY);
	}
	function PlaceActivationTower(x : int, y : int) {
		if ( this.GetSquare(x, y) != BuildingType.EMPTY )
			throw new System.Exception("Activation tower cannot be placed in non-empty spot.");
		var towerType = GetTowerType(x, y);
		if ( towerType == -1 )
			throw new System.Exception("No proper configuration detected around activation tower.");
		else
			this.ReplaceConfiguration(x, y, towerType);
	}
}

class Worker {
	var currentPosition : GridCoordinate;
	var destinationPosition : GridCoordinate;
	var containingGrid : GridState;
	var route : List.<GridCoordinate> = List.<GridCoordinate>();
	function Worker(x : float, y : float, scene : GridState) {
		this.containingGrid = scene;
		this.currentPosition = GridCoordinate(x, y);
		var destx : int = Random.Range(0.0, 121.0);
		var desty : int = Random.Range(0.0, 121.0);
		var destxf : float = destx / 10.0;
		var destyf : float = desty / 10.0;
		this.destinationPosition = GridCoordinate(destxf, destyf);
		this.MoveToDestination();
	}
	
	function RandomMovement() {
		var destx : int = Random.Range(0.0, 121.0);
		var desty : int = Random.Range(0.0, 121.0);
		var destxf : float = destx / 10.0;
		var destyf : float = desty / 10.0;
		this.ChangeDestination(destxf, destyf);
	}
	
	function ChangeDestination(x : float, y : float) {
		if ( currentPosition != destinationPosition )
			throw new System.Exception("Cannot change destination while worker is still walking.");
		this.destinationPosition = GridCoordinate(x, y);
		this.MoveToDestination();
	}
	
	function MoveToDestination() {
		this.FindRoute();
		var routeLength : int = this.route.Count;
		for ( var i = 0; i < routeLength - 1; i++ ) {
			for ( var j = 0; j < 5; j++ ) {
				this.currentPosition.x = this.route[i].x + (this.route[i + 1].x - this.route[i].x) * j * 0.2;
				this.currentPosition.y = this.route[i].y + (this.route[i + 1].y - this.route[i].y) * j * 0.2;
				yield;
			}
		}
		this.currentPosition = this.destinationPosition;
	}
	
	function FindRoute() {
		var priorityQueue : PriorityQueue;
		var visitedStates : Hashtable = new Hashtable();
		priorityQueue.Push(DijkstraState(0.0, currentPosition, GridCoordinate(-1, -1)));
		while ( priorityQueue.Empty() == false ) {
			var state : DijkstraState = priorityQueue.Front();
			priorityQueue.Pop();
			if ( visitedStates.ContainsKey(state.position) == true )
				continue;
			else
				visitedStates.Add(state.position, state.sourcePosition);
			if ( state.position == this.destinationPosition ) {
				this.route.Clear();
				var backtrackPosition : GridCoordinate = this.destinationPosition;
				while ( backtrackPosition != GridCoordinate(-1, -1) ) {
					this.route.Insert(this.route.Count, backtrackPosition);
					backtrackPosition = visitedStates[backtrackPosition];
				}
				this.route.Reverse();
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
}