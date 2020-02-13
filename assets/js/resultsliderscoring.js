/**
* this is a class for generate game results either star or score.
* @class
* @author     ELim Suhendra
*/

var ResultSliderScoring = function(){

}


ResultSliderScoring.prototype.init = function(current_settings) {
	var $this = this;

	$this.game_data = game.scorm_helper.getSingleData("game_data");

	/*Test*/
	// $this.game_data = [];
	// $this.game_data["digital_score"] = [2,2,2,2,2];
	/*End test*/

	$this.arr_digital_score = $this.game_data["digital_score"];
	console.log($this.arr_digital_score);
	// arr_digital_score = [2,2,2,2,2];

	$this.current_settings = current_settings;
	$.get("config/setting_result_slide_"+$this.current_settings["slide"]+".json",function(e){
		console.log(e);
		$this.score = e["score"];
		$this.kurang = e["kurang"];
		$this.cukup = e["cukup"];
		$this.sangat = e["sangat"];
		$this.setResult();
	},'json');
};

ResultSliderScoring.prototype.setResult = function() {
	var $this = this;
	// remove jquery mobile
	$("html").removeClass("ui-mobile");
	$(".star_score_wrapper").hide();

	let score = 0;
	for (var i = 0; i < $this.arr_digital_score.length; i++) {
		score += $this.arr_digital_score[i];
	}

	let average_score = score / 25 * $this.arr_digital_score.length; 

	// for score in text
	// $(".result_score").html(Math.round(score));
	// if($this.score){
	// 	$(".star_wrapper").hide();
	// 	$(".score_wrapper").show();
	// }else{
	// 	$(".star_wrapper").show();
	// 	$(".score_wrapper").hide();
	// }

	// save score to to cmi.raw.score
	// game.scorm_helper.sendResult(Math.round(count));
	// set duration and save to scorm
	// game.scorm_helper.setDuration();
	// if score larger than minimum grade

	//set kurang digital
	console.log(average_score);
	if(average_score <= 2){
		// set to win
		// $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
		// game.audio.audioMenang.play();
		// game.scorm_helper.setStatus("passed");

		//set video
		let src = $this.kurang["background"];
		$this.setVideo("",src);
		
		$(".result_wrapper").addClass("kurang_digital");

		if($this.kurang["header"]){
			$(".header_wrapper .header_text").html($this.kurang["header"]["text"]);
		}

		if($this.kurang["ribbon_text"]){
			$(".ribbon_result .ribbon_text").html($this.kurang["ribbon_text"]["text"]);
		}

		// go to next slide
		$(".btn_restart").hide();
		$(".btn_quit").unbind().click(function(e){
			game.audio.audioButton.play();
			game.nextSlide();
			// game.setSlide(6);
			//$(this).off();
		});
	}
	else if(average_score > 2 && average_score < 5){
		// set to win
		// $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
		// game.audio.audioMenang.play();

		//set video
		let src = $this.cukup["background"];
		$this.setVideo("",src);

		$(".result_wrapper").addClass("cukup_digital");
		
		if($this.cukup["header"]){
			$(".header_wrapper .header_text").html($this.cukup["header"]["text"]);
		}

		if($this.cukup["ribbon_text"]){
			$(".ribbon_result .ribbon_text").html($this.cukup["ribbon_text"]["text"]);
		}

		// go to next slide
		$(".btn_restart").hide();
		$(".btn_quit").unbind().click(function(e){
			game.audio.audioButton.play();
			game.nextSlide();
			// game.setSlide(6);
		});
	}
	else{
		// set to lose
		// $(".slider-content").css({"background":"url('assets/image/result/bg-lose.png') no-repeat center","background-size":"cover"});
		// game.scorm_helper.setStatus("failed");
		// game.audio.audioKalah.play();
		// game.scorm_helper.setSingleData("restart",true);
		
		//set video
		console.log($this.sangat);
		let src = $this.sangat["background"];
		$this.setVideo("",src);

		$(".result_wrapper").addClass("sangat_digital");
		
		if($this.sangat["header"]){
			$(".header_wrapper .header_text").html($this.sangat["header"]["text"]);
		}

		if($this.sangat["ribbon_text"]){
			$(".ribbon_result .ribbon_text").html($this.sangat["ribbon_text"]["text"]);
		}

		// go to next slide
		$(".btn_restart").hide();
		$(".btn_quit").unbind().click(function(e){
			game.audio.audioButton.play();
			// game.nextSlide();
			game.setSlide(6);
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

ResultSliderScoring.prototype.setVideo = function($clone, src) {
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

ResultSliderScoring.prototype.playVideo = function() {
    var $this = this;
    $("#video")[0].play();
};

ResultSliderScoring.prototype.playVideo_loop = function() {
    var $this = this;
    // console.log(/*$("#video")[0]*/);

    $("#video")[0].loop = true;
    $("#video")[0].play();
};

ResultSliderScoring.prototype.pauseVideo = function() {
    var $this = this;
    $("#video")[0].pause();
};

ResultSliderScoring.prototype.showModal = function($clone_modal_desc) {
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