var QuizSwipeCard = function(){
	
}

QuizSwipeCard.prototype.init = function(current_settings) {
	$this = this;
	$this.current_settings = current_settings;
	$this.heart = $(".heart_wrapper img").first().clone();
	$this.card = $(".cardparent .card").first().clone();
	$this.text_feedback = $("#popupFeedbackCard .text_parent div").first().clone();

	$this.game_data = game.scorm_helper.getSingleData("game_data")?game.scorm_helper.getSingleData("game_data"):{};
	$this.curr_step = $this.game_data["curr_step"]?$this.game_data["curr_step"]:1;
	if($this.game_data["slide"] == undefined){
		$this.right = 0;
	}else{
		$this.right = $this.game_data["right"]?$this.game_data["right"]:0;
	}

	$.get("config/setting_swipecard_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.settings = e["settings"];
		$this.list_card = e["list_card"];
		$this.setTutorial();
	},"json");
};

QuizSwipeCard.prototype.setTutorial = function() {
	$this = this;
	$("#tutorial .tutorial.swipe_card").addClass("done");
  	$("#tutorial .tutorial.swipe_card").addClass("active");
  	$("#tutorial").modal({backdrop: 'static',keyboard: true,show: true});
  	if(!$("#tutorial .tutorial.swipe_card").find("div").hasClass("slick-initialized")){
	  	$("#tutorial .tutorial.swipe_card").find("div").first().slick({
	      	dots: true,
	      	infinite: false,
	      	speed: 500,
	      	prevArrow: false,
	      	nextArrow: false
	  	});
  	}
  	$("#tutorial .tutorial.swipe_card").find(".start-game").click(function(e){
  		$("#tutorial .tutorial.swipe_card").removeClass("active");
    	$("#tutorial").modal('hide');
    	$this.setData();
  	});
};

QuizSwipeCard.prototype.getQuestion = function() {
	$this = this;
	arr_quest = [];
	arr_rand = [];
	returnQuest = [];

	for (i = 0; i < $this.list_card.length; i++) {
		arr_quest.push(i);
	}
	if($this.settings["random"]){
		do{
			rand = Math.ceil(Math.random()*(arr_quest.length-1));
			arr_rand.push(arr_quest[rand]);
			arr_quest.splice(rand,1);
		}while(arr_quest.length>0);

		returnQuest = arr_rand;
	}
	else{
		returnQuest = arr_quest;
	}
	return returnQuest;
};

QuizSwipeCard.prototype.setData = function() {
	$this = this;

	game.audio.audioCard.loop = true;
	game.audio.audioCard.play();

	$sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion());
	$this.list_question = $sdata["list_question"];
	$this.curr_soal = $sdata["answer"].length;
	if($sdata["answer"].length == 0){
		game.scorm_helper.setSingleData($this.current_settings["slide"]+"_lastlife",undefined);
	}
	$this.setGame();
};

QuizSwipeCard.prototype.setGame = function() {
	$this = this;
	$this.setLife();
	$this.setCard();
};

QuizSwipeCard.prototype.setLife = function() {
	$this = this;
	$(".heart_wrapper").html("");
	for(i = 1; i <= $this.settings["life"]; i++){
		$clone = $this.heart.clone();
		if((game.scorm_helper.getSingleData($this.current_settings+"_lastlife") != undefined && i <= game.scorm_helper.getSingleData($this.current_settings+"_lastlife")) || game.scorm_helper.getSingleData($this.current_settings+"_lastlife") == undefined){
			$clone.addClass("heart");
			$clone.attr("src","assets/image/swipe_card/heart_active.png");
		}else{
			$clone.attr("src","assets/image/swipe_card/heart_default.png");
		}
		$(".heart_wrapper").append($clone);
	}
};

QuizSwipeCard.prototype.setCard = function() {
	$this = this;
	arr_temp = [];
	arr_rand = [];
	$(".cardparent").html("");
	$(".level_live_wrapper p").html("Tahap "+($this.curr_soal+1));
	for (i = 0; i < $this.list_card[$this.list_question[$this.curr_soal]]["list_card"].length; i++) {
		arr_temp.push(i);
	}
	for (i = 0; i < $this.list_card[$this.list_question[$this.curr_soal]]["list_card"].length; i++) {
		rand = Math.floor((Math.random() * (arr_temp.length-1)));
		arr_rand.push(arr_temp[rand]);
		arr_temp.splice(rand, 1);
	}
	for(i = 0; i < arr_rand.length; i++){
		$clone = $this.card.clone();
		$clone.attr("index",$this.list_card[$this.list_question[$this.curr_soal]]["list_card"][arr_rand[i]]["index"]);
		$clone.find("img").attr("src","assets/image/swipe_card/"+$this.list_card[$this.list_question[$this.curr_soal]]["list_card"][arr_rand[i]]["image"]);
		$clone.find("p").html($this.list_card[$this.list_question[$this.curr_soal]]["list_card"][arr_rand[i]]["text"]);
		$(".cardparent").append($clone);
	}
	if($(".cardparent").hasClass("slick-initialized")){
		$(".cardparent").slick("unslick");
	}
	$(".cardparent").slick({
		dots: false,
        infinite: false,
        speed: 500,
        arrows: false,
        centerMode: true,
        centerPadding: "1em"
	});
	$(".card").each(function(){
		if($(this).hasClass("slick-current")){
			$(this).addClass("border_active");
		}else{
			$(this).removeClass("border_active");
		}
	});
	$(".cardparent").on("afterChange",function(event,slick,currentSlide){
		$(".card").each(function(){
			if($(this).hasClass("slick-current")){
				$(this).addClass("border_active");
			}else{
				$(this).removeClass("border_active");
			}
		});
	});
	if($this.settings["duration"]){
		$this.setTimer();
	}else{
		$(".progress_wrapper").css("visibility","hidden");
	}
	$(".btn_submit").click(function(){
		$(this).off();
		$this.cekJawaban();
	});
};

QuizSwipeCard.prototype.setTimer = function() {
	$this = this;
	$duration = $this.settings["duration"]*1000;
	$(".progressbar").css("width","100%");
	$(".progressbar").animate({"width":"0%"},$duration,"linear",function(){
		$this.cekJawaban();
	});
};

QuizSwipeCard.prototype.cekJawaban = function() {
	$this = this;
	$flag = 0;
	$(".cardparent").slick('slickSetOption', 'swipe', false);
	$(".progressbar").stop();
	$(".card").each(function(){
		if($(this).hasClass("border_active")){
			if($(this).attr("index") == $this.list_card[$this.list_question[$this.curr_soal]]["jawaban"][0]){
				$flag = 1;
				return false;
			}
		}
	});
	if($flag == 0){
		game.audio.audioSalah.play();
		game.scorm_helper.pushAnswer(0,$this.list_card[$this.list_question[$this.curr_soal]]["title_feedback"]);
		$(".alert").addClass("salah");
	}else{
		game.audio.audioBenar.play();
		game.scorm_helper.pushAnswer(1,$this.list_card[$this.list_question[$this.curr_soal]]["title_feedback"]);
		$this.right++;
		$this.game_data["right"] = $this.right;
		$(".alert").addClass("benar");
	}
	game.scorm_helper.setSingleData("game_data",$this.game_data);
	if(!$this.list_card[$this.list_question[$this.curr_soal]]["feedback"]){
		setTimeout(function() {
			$(".alert").removeClass("salah");
			$(".alert").removeClass("benar");
			if($flag == 0){
				$this.saveLife();
			}else{
				$this.curr_soal++;
				if($this.curr_soal != $this.list_card.length){
					$this.setCard();
				}else{
					$this.setCompleteData();
				}
			}
		},1000);
	}else{
		$(".alert").removeClass("salah");
		$(".alert").removeClass("benar");
		$this.setFeedback($flag);
	}
};

QuizSwipeCard.prototype.setFeedback = function() {
	$this = this;
	$currentSlide = 0;
	if($("#popupFeedbackCard .text_parent").hasClass("slick-initialized")){
		$("#popupFeedbackCard .text_parent").slick("unslick");
	}
	$("#popupFeedbackCard .tahap").html("Tahap "+($this.curr_soal+1));
	$("#popupFeedbackCard .title").html($this.list_card[$this.list_question[$this.curr_soal]]["title_feedback"]);
	$("#popupFeedbackCard .text_parent").html("");
	for(i = 0; i < $this.list_card[$this.list_question[$this.curr_soal]]["feedback"].length; i++){
		$clone = $this.text_feedback.clone();
		$clone.find("p").html($this.list_card[$this.list_question[$this.curr_soal]]["feedback"][i]["text"]);
		$("#popupFeedbackCard .text_parent").append($clone);
	}
	$("#popupFeedbackCard .text_parent").slick({
		dots: true,
        infinite: false,
        speed: 500,
        arrows: false,
        variableWidth: true
	});
	$("#popupFeedbackCard .text_parent")[0].slick.refresh();
	$("#popupFeedbackCard #video").find("source").attr("src","assets/image/swipe_card/"+$this.list_card[$this.list_question[$this.curr_soal]]["feedback"][0]["image"]);
	$("#popupFeedbackCard #video")[0].load();
	$("#popupFeedbackCard .text_parent").on("afterChange",function(event,slick,currentSlide,nextSlide){
		if($currentSlide != currentSlide){
			$currentSlide = currentSlide;
			$("#popupFeedbackCard #video").find("source").attr("src","assets/image/swipe_card/"+$this.list_card[$this.list_question[$this.curr_soal]]["feedback"][currentSlide]["image"]);
			$("#popupFeedbackCard #video")[0].load();
		}
	});
	$("#popupFeedbackCard").modal({backdrop: 'static',keyboard: true,show: true});
	$("#popupFeedbackCard .close_feedback").click(function(){
		$(this).off();
		$("#popupFeedbackCard").modal("hide");
		if($flag == 0){
			$this.saveLife();
		}else{
			$this.curr_soal++;
			if($this.curr_soal != $this.list_card.length){
				$this.setCard();
			}else{
				$this.setCompleteData();
			}
		}
	});
};

QuizSwipeCard.prototype.saveLife = function() {
	$(".heart_wrapper .heart").last().attr("src","assets/image/swipe_card/heart_default.png");
	$(".heart_wrapper .heart").last().removeClass("heart");
	game.scorm_helper.setSingleData($this.current_settings["slide"]+"_lastlife",$(".heart_wrapper .heart").length);
	$this.curr_soal++;
	if($(".heart_wrapper .heart").length == 0){
		$this.setCompleteData();
	}else if($this.curr_soal != $this.list_card.length){
		$this.setCard();
	}else{
		$this.setCompleteData();
	}
};

QuizSwipeCard.prototype.setCompleteData = function($flag) {
	$this = this;
	$("#popupFeedbackCard").modal("hide");
	game.audio.audioCard.pause();
	$this.game_data["complete_stage"] = $this.game_data["complete_stage"]?$this.game_data["complete_stage"]:[];
	$this.game_data["failed_stage"]  = $this.game_data["failed_stage"]?$this.game_data["failed_stage"]:[];
	if($this.right == $this.list_card.length){
		$this.game_data["complete_stage"].push($this.curr_step);
	}else{
		$this.game_data["failed_stage"].push($this.curr_step);
	}
	$this.game_data["right"] = 0;
	$this.game_data["slide"] = undefined;
	$this.game_data["curr_step"] = $this.curr_step;
	game.scorm_helper.setSingleData("game_data",$this.game_data);
	game.setSlide($this.settings["backslide"]);
};