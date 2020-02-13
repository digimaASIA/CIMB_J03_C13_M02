/**
* this is a class for generate game results either star or score.
* @class
* @author     NejiElYahya
*/

var ResultGame = function(){

}


ResultGame.prototype.init = function(current_settings) {
	var $this = this;
	$this.current_settings = current_settings;
	$.get("config/setting_result_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.score = e["score"];
		$this.perfect = e["perfect"];
		$this.win = e["win"];
		$this.lose = e["lose"];
		$this.setResult();
	},'json');
};

ResultGame.prototype.setResult = function() {
	var $this = this;
	// remove jquery mobile
	$("html").removeClass("ui-mobile");
	/*comment by elim*/
	if(game.scorm_helper.getSingleData("score") == undefined){
		// var game_quiz = game.scorm_helper.getQuizResult(["game_slide_8","game_slide_9","game_slide_13","game_slide_15","game_slide_17","game_slide_19","game_slide_21","game_slide_23"]);
		var game_quiz = {"score":6,"total_soal":6};
		// count all game score range 0-5 for the star
		var score = parseInt(game_quiz["score"])/parseInt(game_quiz["total_soal"])*game.max_score;
		/*end comment by elim*/
		// count score range 0-100 for save to cmi.raw.score
		var count = score/game.max_score*100;
	}else{
		var score = game.scorm_helper.getSingleData("score");
		var count = game.scorm_helper.getSingleData("score");
	}
	// for score in text
	$(".result_score").html(Math.round(score));
	if($this.score){
		$(".star_wrapper").hide();
		$(".score_wrapper").show();
	}else{
		$(".star_wrapper").show();
		$(".score_wrapper").hide();
	}
	// save score to to cmi.raw.score
	game.scorm_helper.sendResult(Math.round(count));
	// set duration and save to scorm
	game.scorm_helper.setDuration();
	// if score larger than minimum grade
	if(Math.round(score) == game.max_score){
		// set to win
		// $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
		game.audio.audioMenang.play();
		game.scorm_helper.setStatus("passed");
		//$(".result_wrapper").css("background","url(assets/image/result/"+$this.win["background"]+") no-repeat center / cover");
		$(".result_wrapper").find("source").attr("src","assets/video/result/"+$this.perfect["background"]);
		$("#video")[0].load();
		$interval = setInterval(function(){
			if($("#video")[0].readyState == 4){
				clearInterval($interval);
				$("#video").show();
				$("#video")[0].play();
			}
			/*$("#video").on("canplay",function(){
				clearInterval($interval);
				$(this).off();
				$("#video").show();
				$("#video")[0].play();
			});*/
		},100);
		$(".result_wrapper").addClass("win");
		if($this.perfect["ribbon"]){
			$(".ribbon_result img").attr("src","assets/image/result/"+$this.perfect["ribbon"]);
		}else{
			$(".ribbon_result").hide();
		}
		if($this.perfect["score_css"]){
			$(".score_wrapper").css($this.perfect["score_css"]);
		}
		$(".text_wrapper").html($this.perfect["description"]["text"]);
		if($this.perfect["description"]["css"]){
			$(".text_wrapper").css($this.perfect["description"]["css"]);
		}
		/*$(".button").html($this.perfect["button"]["text"]);
		if($this.perfect["button"]["button_css"]){
			$(".button").css($this.perfect["button"]["button_css"]);
		}*/
		//$(".button").addClass("btn-next-result");
		// go to next slide
		$(".btn_restart").hide();
		$(".btn_quit").click(function(e){
			game.audio.audioButton.play();
			//$(this).off();
			try{
	            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
	            btn_back.click();
	        }
	        catch(e){
	            top.window.close();
	        }
		});
	}
	else if(Math.round(score) >= game.min_score){
		// set to win
		// $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
		game.audio.audioMenang.play();
		game.scorm_helper.setStatus("passed");
		game.scorm_helper.setSingleData("restart",true);
		//$(".result_wrapper").css("background","url(assets/image/result/"+$this.win["background"]+") no-repeat center / cover");
		$(".result_wrapper").find("source").attr("src","assets/video/result/"+$this.win["background"]);
		$("#video")[0].load();
		$interval = setInterval(function(){
			if($("#video")[0].readyState == 4){
				clearInterval($interval);
				$("#video").show();
				$("#video")[0].play();
			}
			/*$("#video").on("canplay",function(){
				clearInterval($interval);
				$(this).off();
				$("#video").show();
				$("#video")[0].play();
			});*/
		},100);
		$(".result_wrapper").addClass("win");
		if($this.win["ribbon"]){
			$(".ribbon_result img").attr("src","assets/image/result/"+$this.win["ribbon"]);
		}else{
			$(".ribbon_result").hide();
		}
		if($this.win["score_css"]){
			$(".score_wrapper").css($this.win["score_css"]);
		}
		$(".text_wrapper").html($this.win["description"]["text"]);
		if($this.win["description"]["css"]){
			$(".text_wrapper").css($this.win["description"]["css"]);
		}
		/*$(".button").html($this.win["button"]["text"]);
		if($this.win["button"]["button_css"]){
			$(".button").css($this.win["button"]["button_css"]);
		}*/
		//$(".button").addClass("btn-next-result");
		// go to next slide
		$(".btn_restart").hide();
		$(".btn_restart").click(function(e){
			game.audio.audioButton.play();
			$(this).off();
			game.setSlide(11);
		});
		$(".btn_quit").click(function(e){
			game.audio.audioButton.play();
			//$(this).off();
			try{
	            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
	            btn_back.click();
	        }
	        catch(e){
	            top.window.close();
	        }
		});
	}
	else{
		// set to lose
		// $(".slider-content").css({"background":"url('assets/image/result/bg-lose.png') no-repeat center","background-size":"cover"});
		game.scorm_helper.setStatus("failed");
		game.audio.audioKalah.play();
		game.scorm_helper.setSingleData("restart",true);
		//$(".result_wrapper").css("background","url(assets/image/result/"+$this.lose["background"]+") no-repeat center / cover");
		$(".result_wrapper").find("source").attr("src","assets/image/result/"+$this.lose["background"]);
		$("#video")[0].load();
		$interval = setInterval(function(){
			if($("#video")[0].readyState == 4){
				clearInterval($interval);
				$("#video").show();
				$("#video")[0].play();
			}
			/*$("#video").on("canplay",function(){
				clearInterval($interval);
				$(this).off();
				$("#video").show();
				$("#video")[0].play();
			});*/
		},100);
		$(".result_wrapper").addClass("lose");
		if($this.lose["ribbon"]){
			$(".ribbon_result img").attr("src","assets/image/result/"+$this.lose["ribbon"]);
		}else{
			$(".ribbon_result").hide();
		}
		if($this.lose["score_css"]){
			$(".score_wrapper").css($this.lose["score_css"]);
		}
		$(".text_wrapper").html($this.lose["description"]["text"]);
		if($this.lose["description"]["css"]){
			$(".text_wrapper").css($this.lose["description"]["css"]);
		}
		/*$(".button").html($this.lose["button"]["text"]);
		if($this.lose["button"]["button_css"]){
			$(".button").css($this.lose["button"]["button_css"]);
		}*/
		//$(".button").addClass("btn-tryagain");
		$(".btn_restart").click(function(e){
			game.audio.audioButton.play();
			$(this).off();
			game.setSlide(11);
		});
		// click try again button
		$(".btn_quit").click(function(e){
			game.audio.audioButton.play();
			//$(this).off();
			try{
	            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
	            btn_back.click();
	        }
	        catch(e){
	            top.window.close();
	        }
		});
	}

	// set star
	var flag=0;
	var count_star=0;

	var time_star = setInterval(function() {
		count_star++;
		if(count_star<=game.max_score){
			if(count_star<=score){
				$(".star_wrapper .star:nth-child("+count_star+")").addClass("active");
			}
			$(".star_wrapper .star:nth-child("+count_star+")").fadeIn(1000);
		}
		else{
			clearInterval(time_star);
		}
	},200);
};