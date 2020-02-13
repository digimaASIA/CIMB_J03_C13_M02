/**
* this is a class for generate game results either star or score.
* @class
* @author     ELim Suhendra
*/

var ResultStage = function(){

}


ResultStage.prototype.init = function(current_settings) {
	var $this = this;
	$this.setting_global = new Setting();
	$this.game_data = game.scorm_helper.getSingleData("game_data");
	$this.current_settings = current_settings;
	$.get("config/setting_result_slide_"+$this.current_settings["slide"]+".json",function(e){
		console.log(e);
		$this.score = e["score"];
		$this.win = e["win"];
		$this.lose = e["lose"];
		$this.setResult();
	},'json');
};

ResultStage.prototype.setResult = function() {
	var $this = this;
	// remove jquery mobile
	$("html").removeClass("ui-mobile");
	$(".star_score_wrapper").hide();

	// setting star or score
	var isScore = ($this.score == true ? true : false);
	// get last game from scorm
	/*comment by elim*/
	// console.log($this.game_data);
	let slide = 8; //slide quiz swipe card
	if($this.game_data["selected_stage"] == 2){
		slide = 12; //slide quiz visnov
	}
	var game_quiz = game.scorm_helper.getQuizResult(["game_slide_"+slide]);
	console.log(game_quiz);
	// var game_quiz = {"score":4,"total_soal":5};
	// count all game score range 0-5 for the star
	var score = parseInt(game_quiz["score"])/parseInt(game_quiz["total_soal"])*game.max_score;
	/*end comment by elim*/
	// count score range 0-100 for save to cmi.raw.score
	var count = score/game.max_score*100;
	// for score in text
	$(".result_score").html(Math.round(score));
	console.log(isScore);
	if(isScore){
		$(".star_wrapper").hide();
		$(".score_wrapper").show();
	}else{
		$(".star_wrapper").show();
		$(".score_wrapper").hide();
	}
	//$(".img-result-wrapper").css("padding-top",$(".div_header").innerHeight()-20);
	setTimeout(function(){
		var ribbon = $(".div_header").outerHeight();
		var image = $(".img-result-wrapper").outerHeight();
		var button = $(".button-wrapper").outerHeight();
		var device = $(window).outerHeight();
		var height_text = device-(image+button)+20;
		$(".result_wrapper").css("height",height_text+"px");
	},1000);

	let min_score_per_stage = 80;

	console.log(score);
	if(score >= min_score_per_stage){
		// set to win
		// $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
		game.audio.audioNiceJob.play();
		// game.scorm_helper.setStatus("passed");

		//set video
		let src = $this.win["background"];
		$this.setVideo("",src);
		
		$(".result_wrapper").addClass("kurang_digital");

		if($this.win["header"]){
			$(".header_wrapper .header_text").html($this.win["header"]["text"]);
		}

		if($this.win["ribbon_text"]){
			$(".ribbon_result .ribbon_text").html($this.win["ribbon_text"]["text"]);
			// $(".ribbon_result .ribbon_win").attr("src","assets/image/result/"+$this.win["ribbon_image"]);
			// $(".ribbon_result .title-result").html($this.win["ribbon_text"]);
		}

		$(".text_wrapper").html($this.win["description"]["text"]);
		if($this.win["description"]["css"]){
			$(".text_wrapper").css($this.win["description"]["css"]);
		}

		$(".star_score_wrapper").show();

		// go to next slide
		$(".btn_restart").hide();
		$(".btn_quit").unbind().click(function(e){
			game.audio.audioButton.play();
			// game.nextSlide();
			game.setSlide($this.setting_global["slide_game_map"]);
		});
	}
	else{
		// set to lose
		// $(".slider-content").css({"background":"url('assets/image/result/bg-lose.png') no-repeat center","background-size":"cover"});
		game.scorm_helper.setStatus("failed");
		game.audio.audioKalah.play();
		game.scorm_helper.setSingleData("restart2",true);
		
		//set video
		let src = $this.lose["background"];
		$this.setVideo("",src);

		$(".result_wrapper").addClass("sangat_digital");
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

		$(".star_score_wrapper").show();

		/*$(".button").html($this.lose["button"]["text"]);
		if($this.lose["button"]["button_css"]){
			$(".button").css($this.lose["button"]["button_css"]);
		}*/
		//$(".button").addClass("btn-tryagain");
		$(".btn_restart").hide();
		$(".btn_restart").click(function(e){
			game.audio.audioButton.play();
			$(this).off();
			game.setSlide(11);
		});
		// click try again button
		$(".btn_quit").unbind().click(function(e){
			game.audio.audioButton.play();
			game.setSlide($this.setting_global["slide_game_map"]);
			//$(this).off();
			// try{
	  //           var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
	  //           btn_back.click();
	  //       }
	  //       catch(e){
	  //           top.window.close();
	  //       }
		});
	}

	// set star
	// var flag=0;
	// var count_star=0;

	// var time_star = setInterval(function() {
	// 	count_star++;
	// 	if(count_star<=game.max_score){
	// 		if(count_star<=score){
	// 			$(".star_wrapper .star:nth-child("+count_star+")").addClass("active");
	// 		}
	// 		$(".star_wrapper .star:nth-child("+count_star+")").fadeIn(1000);
	// 	}
	// 	else{
	// 		clearInterval(time_star);
	// 	}
	// },200);
};

ResultStage.prototype.setVideo = function($clone, src) {
    // console.log("setVideo");
    var $this = this;
    // console.log($("#video").find("source"));
    // console.log($this.video_path+src);
    $("#video").show();
    $("#video").find("source").attr("src","assets/video/result/"+src);
    // console.log($(".img_video"));
    $(".img_video").hide();
    $("#video")[0].load();

    // game.showLoading();
    $("#video").on("canplay",function(e){
        // game.hideLoading();
        $this.playVideo();

        $("#video").unbind().on("ended",function(e){
            $(this).off();
            // $this.pauseVideo();

            //call function set video, to call again this video
            // $this.play_video_interval_step = setInterval(function() {
            //     $this.playVideo();
            // },200);

            $this.playVideo_loop();
        });
    });
};

ResultStage.prototype.playVideo = function() {
    var $this = this;
    $("#video")[0].play();
};

ResultStage.prototype.playVideo_loop = function() {
    var $this = this;
    // console.log(/*$("#video")[0]*/);

    $("#video")[0].loop = true;
    $("#video")[0].play();
};

ResultStage.prototype.pauseVideo = function() {
    var $this = this;
    $("#video")[0].pause();
};

ResultStage.prototype.showModal = function($clone_modal_desc) {
    console.log('showModal');
    var $this = this;
    console.log($this.category_game);

    /*Setting header*/
    let src = $this.path_image+"/result/"+$this.popup_review_setting["bg_image_header"];
    let text_header = $this.popup_review_setting["text_header"];
    console.log($clone_modal_desc);
    console.log($(".modal_review"));
    console.log($(".modal_review .mr_header img"));
    console.log($(".modal_review .text_mr_header"));
    $(".modal_review .mr_header img").attr("src", src);
    $(".modal_review .text_mr_header").html(text_header);
    /*End setting header*/

    $(".modal_review .div_desc-2 .div_desc-3").html("");

    for (var i = 0; i < $this.popup_review.length; i++) {
        let $clone_modal_desc_2 = $clone_modal_desc.clone();

        $clone_modal_desc_2.find(".header_desc").html($this.popup_review[i]["title"]);
        $clone_modal_desc_2.find(".desc").html($this.popup_review[i]["description"]); 
        $clone_modal_desc_2.attr("index",i);

        $(".modal_review .div_desc-2 .div_desc-3").append($clone_modal_desc_2);
    }

    
    $('.modal_review').modal("show");
    $('.modal_review').addClass('active');
    $(".modal_review .button_wrapper").show();

    $(".modal_review .close_modal_review").unbind().click(function(){
        $('.modal_review').modal("hide");
        game.setSlide(2);
    });
};