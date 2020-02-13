var stageBrankas = function(){

}


stageBrankas.prototype.init = function(current_settings) {
	console.log("stageBrankas");
	var $this = this;
	$this.current_settings = current_settings;
	$this.game_data = (game.scorm_helper.getSingleData("game_data") != undefined ? game.scorm_helper.getSingleData("game_data") : []);
	$this.completed_stage = $this.game_data["completed_stage"];
	$this.failed_stage = $this.game_data["failed_stage"];
	let ldata = game.scorm_helper.getSingleData(["game_slide_13"]);
	// ldata = {
	// 	"index": "game_slide_13",
	// 	"answer": [1,0],
	// 	"list_question": [0, 1, 2],
	// 	"start_date": "12 Februari 2020 13:46:33",
	// 	"end_date": "",
	// 	"is_complete": false
	// };
	console.log(ldata);

	if(ldata){
		let arr_answer = ldata["answer"];
		for (var i = 0; i < arr_answer.length; i++) {
			if(arr_answer[i] == 1){
				$(".star:nth-child("+(i+1)+")").addClass("complete");
			}else if(arr_answer[i] == 0){
				$(".star:nth-child("+(i+1)+")").addClass("fail");
			}
		}
	}

	$(".stage_b").unbind().click(function(){
		game.audio.audioButton.play();
		let index = parseInt($(this).attr("index"));

		$this.game_data["curr_soal"] = (index-1);
		game.nextSlide();
	});
}