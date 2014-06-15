#pragma strict

var score : int = 0;
var wave : int = 0;
var time : int = 60;

// Keeps the time.
function TimeKeep() {
	while (true) {
		time--;
		yield WaitForSeconds(1);
	}
}

function Start() {
	DontDestroyOnLoad(gameObject);
	TimeKeep();
}

// Shows the score on the death screen.
function showScore() {
	yield WaitForSeconds(0.05);
	var s_final : int = score;
	var gm : GameObject = GameObject.FindWithTag("Final Score");
	gm.guiText.text = "Final Score: " + s_final.ToString();
	Destroy(gameObject);
}

function Update() {
	if ( Application.loadedLevel == 1 ) {
		// Find the three main components of the GUITexts and update them with the new information.
		var s : GameObject = GameObject.Find("Score");
		var w : GameObject = GameObject.Find("Level");
		var t : GameObject = GameObject.Find("Time");
		s.guiText.text = "Score: " + score.ToString();
		w.guiText.text = "Wave: " + wave.ToString();
		t.guiText.text = "(" + (time/60) + ":" + ((time%60<10)?"0":"") + (time%60).ToString() + ")";
		// If time = 0, spawn the next wave of enemies.
		if (time == 0) {
			time = 90;
			wave++;
			var s1 : GameObject = GameObject.Find("Spawner");
			var ss : Spawner = s1.GetComponent(Spawner);
			ss.StartLevel(wave - 1);
		}
		// Checks if there are no workers and towers left, if so, end the game.
		var scene_objs = Physics.OverlapSphere(transform.position, 100);
		var worker_cnt : int = 0;
		var tower_cnt : int = 0;
		for ( var i : int = 0; i < scene_objs.Length; i++ ) {
			if ( scene_objs[i].gameObject.tag == "Worker" ) worker_cnt++;
			if ( scene_objs[i].gameObject.tag == "tower" ) tower_cnt++;
		}
		if ( worker_cnt + tower_cnt == 0 ) {
			Application.LoadLevel("dead");
			showScore();
		}
	}
}