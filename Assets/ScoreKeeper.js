#pragma strict

var score : int = 0;
var wave : int = 0;
var time : int = 60;

function TimeKeep() {
	while (true) {
		time--;
		yield WaitForSeconds(1);
	}
}

function Start() {
	TimeKeep();
}

function Update() {
	var s : GameObject = GameObject.Find("Score");
	var w : GameObject = GameObject.Find("Level");
	var t : GameObject = GameObject.Find("Time");
	s.guiText.text = "Score: " + score.ToString();
	w.guiText.text = "Wave: " + wave.ToString();
	t.guiText.text = "(" + (time/60) + ":" + ((time%60<10)?"0":"") + (time%60).ToString() + ")";
	if (time == 0) {
		time = 90;
		wave++;
		var s1 : GameObject = GameObject.Find("Spawner");
		var ss : Spawner = s1.GetComponent(Spawner);
		ss.StartLevel(wave - 1);
	}
}