var SliderScoring = function(){

}
SliderScoring.prototype.init = function(current_settings) {
	var $this = this;
	game.temp = 1;
	$this.current_settings = current_settings;
	$this.list_slider = $(".list_slider").first().clone();
	$this.popupList = $("#popupList").find(".description").first().clone();
	$this.button = $(".button").first().clone();
	$this.ccButton = $(".click_and_show_wrapper .button_click_and_show").first().clone();
	$this.ccButton_image = $(".click_and_show_image .button_click_and_show").first().clone();
	$this.cloneList = $("#popupList .point_wrapper_block").first().clone();
	$this.cloneWrapper = $("#popupList .point_wrapper").first().clone();
	$this.total_slide;

	$this.game_data = game.scorm_helper.getSingleData("game_data");
	// console.log($this.game_data);
	$this.game_data = ($this.game_data != undefined ? $this.game_data : []);

	$("#ulasan").html("");
	$($this.list_slider).find(".button_wrapper").html("");
	$($this.list_slider).find(".click_and_show_wrapper").html("");
	$($this.list_slider).find(".click_and_show_image").html("");

	$.get("config/setting_slider_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.audio = e['audio'];
		$this.background = e["background"];
		$this.listSlider = e["list_slider"];
		$this.total_slide = e["list_slider"].length;
		$this.createSlider();
	  },'json');
};

SliderScoring.prototype.addVideoEvent = function(clone) {
	var $this = this;
	$(clone).find(".video").click(function(e){
	    $(this).off();
	    $("#video .btn-close").click(function(e){
	      $(this).off();
	      $this.stopVideo();
	      $this.addVideoEvent(clone);
	    });
	    $this.playVideo();
	});
};

SliderScoring.prototype.addVideoPotraitEvent = function(clone,param) {
	var $this = this;
	$(clone).find(".bg-video_popotrait").click(function(e){
		$(this).hide();
		$this.playVideoPotrait(clone,param);
	});
};

SliderScoring.prototype.playVideo = function() {
	$("#video").show();
	$("#video1").show();
	$("video").get(0).play();
};

SliderScoring.prototype.stopVideo = function() {
	$("#video").hide();
	$("#video1")[0].pause();
	$("#video1")[0].currentTime = 0;
}

SliderScoring.prototype.playVideoPotrait = function(clone,param) {
	var $this = this;

	$(clone).find(".button_wrapper").hide();
	// $(clone).find(".text_wrapper").hide();
	$(clone).find("#video_slider").show();
	$(clone).find("#video_slider").get(0).loop = true;
	$(clone).find("#video_slider").get(0).play();
	$(clone).find("#video_slider").on("ended",function(e){
		if(param){
			game.scorm_helper.setStatus("passed");
		}
		// $(clone).find(".text_wrapper").show();
		// $(clone).find(".bg-video_popotrait").show();
		$(clone).find(".button_wrapper").show();
		$this.stopVideoPotrait(clone);
	});
};

SliderScoring.prototype.stopVideoPotrait = function(clone) {
	var $this = this;
	$(clone).find("#video_slider").get(0).pause();
	$(clone).find("#video_slider").get(0).currentTime = 0;
	$(clone).find("#video_slider").hide();
}

SliderScoring.prototype.createSlider = function() {
	var $this = this;
	if($this.audio){
		game.audio.audioBackgroundSlider.src = "assets/audio/"+$this.audio;
		game.audio.audioBackgroundSlider.loop = true;
		game.audio.audioBackgroundSlider.play();
	}
	$(".slider-content").css({"background":$this.background});
	for (var i = 0; i < $this.listSlider.length; i++) {
		var clone = $this.list_slider.clone();
		
		//content image
		if($this.listSlider[i]["image"]){
			if($this.listSlider[i]["type"] == "video"){
				$(clone).find(".img_wrapper").find("source").attr("src","assets/video/slider_scoring/"+$this.listSlider[i]["image"]);
			}else if($this.listSlider[i]["image"]){
				$(clone).find(".img_wrapper").find("source").attr("src","assets/image/slider/"+$this.listSlider[i]["image"]);
			}
			/*if($this.listSlider[i]['image_background'] != undefined){
				$(clone).css("background",$this.listSlider[i]['image_background']);
			}*/
			if($this.listSlider[i]['image_click'] != undefined){
				$(clone).find(".img_wrapper").click(function(e){
					game.audio.audioBackgroundSlider.pause();
					game.nextSlide();
				});
			}
		}
		else{
			$(clone).find(".img_wrapper").remove();
		}
		if($this.listSlider[i]["hand"]){
			$(clone).find(".img_wrapper").append("<img class='hand' src='assets/image/slider/Hand-click-1.gif'>");
			$(clone).find(".img_wrapper").find(".hand").css($this.listSlider[i]["hand"]);
		}
		if($this.listSlider[i]["ribbon"]){
			$(clone).find(".ribbon-content").html($this.listSlider[i]["ribbon"]);
			if($this.listSlider[i]["ribbon_css"]){
				$(clone).find(".ribbon_header").css($this.listSlider[i]["ribbon_css"]);
			}
		}
		else{
			$(clone).find(".rb-wrap").remove();
		}

		//content text
		if($this.listSlider[i]["text"]){
			if($this.listSlider[i]["text"].indexOf("[first name]") != -1){
				var txt_name = $this.listSlider[i]["text"];
                var name = game.scorm_helper.getName();
                var firstname = name.split(", ");
                var real_name = txt_name.replace("[first name]",firstname[0]);
                $(clone).find(".keterangan").html(real_name);
			}else{
				$(clone).find(".keterangan").html($this.listSlider[i]["text"]);
			}
			$(clone).find(".button_wrapper").last().remove();
		}
		else{
			$(clone).find(".text_wrapper").remove();	
		}

		//content video
		if($this.listSlider[i]["video"]){
			$("#video").find("source").attr("src","assets/video/"+$this.listSlider[i]["video"]);
			$("#video1")[0].load();
			$this.addVideoEvent(clone);
		}
		else{
			$(clone).find(".bg-video").remove();
		}

		if($this.listSlider[i]["video_potrait"]){
			$(clone).find("#video_slider").find("source").attr("src","assets/video/slider_scoring/"+$this.listSlider[i]["video_potrait"]);
			$(clone).find(".video_potrait").attr("id","video_slider-"+i);
			$(clone).find("#video_slider")[0].load();
			// $(clone).find("bg-video_popotrait").hide();
			if(i == 0){
				// $(clone).find("bg-video_popotrait").hide();
				$this.playVideoPotrait(clone,$this.listSlider[i]["video_finish"]);
			}
		}else{
			$(clone).find(".video_potrait").remove();
		}

		$("#ulasan").append(clone);
		/*if($this.listSlider[i]["ribbon"]){
			var rb_height = $(clone).find(".ribbon_header").innerHeight();
			if($this.listSlider[i]["image"]){
				var pd_img_rb = $(clone).find(".ribbon_header").innerHeight()-20;
				$(clone).find(".col_md_two").css("margin-top",pd_img_rb+"px");
			}else{
				$(clone).find(".col_md_two").css("margin-top",rb_height+"px");
			}
		}*/

		if($this.listSlider[i]["button"]){
			for (var j = 0; j < $this.listSlider[i]["button"].length; j++) {
				var cloneBtn = $this.button.clone();
				var show_button = true;
				$(cloneBtn).html($this.listSlider[i]["button"][j]["text"]);
				if($this.listSlider[i]["button"][j]["css"]){
					$(cloneBtn).css($this.listSlider[i]["button"][j]["css"]);
				}
				$(clone).find(".button_wrapper").append(cloneBtn);
				if($this.listSlider[i]["click_and_show_image"]){
					var list_clone = $this.listSlider[i]["click_and_show_image"];
					for(var k = 0; k < list_clone.length; k++){
						if(list_clone[k]["rmpt"] == undefined){
							show_button = true;
							break;
						}else if(game.scorm_helper.getSingleData(list_clone[k]["text"]) == undefined){
							show_button = false;
							break;
						}
					}
					if(show_button){
						$(cloneBtn).show();
					}else{
						$(cloneBtn).hide();
					}
				}
				if($this.listSlider[i]["button"][j]["gotoSlide"]){
					$(cloneBtn).attr("gotoSlide",$this.listSlider[i]["button"][j]["gotoSlide"]);
					$(cloneBtn).click(function(e){
						$(this).off();
						game.audio.audioButton.play();
						game.scorm_helper.setSlide(parseInt($(this).attr("gotoSlide"))-1);
						game.audio.audioBackgroundSlider.pause();
						game.nextSlide();
					});
				}
				else{
					if($this.listSlider[i]["video_potrait"]){
						var video_finish = $this.listSlider[i]["video_finish"];
						$(clone).find(".button_wrapper").hide();
						$(cloneBtn).click(function(e){
							//$(this).off();
							game.audio.audioButton.play();
							if(video_finish){
								try{
						            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
						            btn_back.click();
						        }
						        catch(e){
						            top.window.close();
						        }
							}else{
								$("#popupAlertVideo").modal({backdrop: 'static',keyboard: true,show: true});
								$("#popupAlertVideo .popupalert-yes").click(function(e){
								    $(this).off();
								    $("#popupAlertVideo").modal("hide");
								    game.audio.audioButton.play();
								    game.audio.audioBackgroundSlider.pause();
								    game.nextSlide();
								});
								$("#popupAlertVideo .popupalert-no").click(function(e){
									$(this).off();
									$("#popupAlertVideo .popupalert-yes").off();
									game.audio.audioButton.play();
								    $("#popupAlertVideo").modal("hide");
								});
								$("#popupAlertVideo .img-popup").click(function(e){
									$(this).off();
									$("#popupAlertVideo .popupalert-yes").off();
									game.audio.audioButton.play();
								    $("#popupAlertVideo").modal("hide");
								});
							}
						});
					}
					else if($this.listSlider[i]["video"]){
						$(cloneBtn).click(function(e){
							e.preventDefault();
							$("#popupAlertVideo").modal({backdrop: 'static',keyboard: true,show: true});
							$("#popupAlertVideo .popupalert-yes").click(function(e){
							    $(this).off();
							    $("#popupAlertVideo").modal("hide");
							    game.audio.audioButton.play();
							    game.audio.audioBackgroundSlider.pause();
							    game.nextSlide();
							});
							$("#popupAlertVideo .popupalert-no").click(function(e){
								$(this).off();
								$("#popupAlertVideo .popupalert-yes").off();
								game.audio.audioButton.play();
							    $("#popupAlertVideo").modal("hide");
							});
							$("#popupAlertVideo .img-popup").click(function(e){
								$(this).off();
								$("#popupAlertVideo .popupalert-yes").off();
								game.audio.audioButton.play();
							    $("#popupAlertVideo").modal("hide");
							});
						});
					}
					else{
						if($this.listSlider[i]["button"][0]["popup"]){
							if($this.listSlider[i]["button"][0]["popupyes_gotoSlide"]){
								var popupyes_nextslide = $this.listSlider[i]["button"][0]["popupyes_gotoSlide"];
							}
							if($this.listSlider[i]["button"][0]["popupno_gotoSlide"]){
								var popupno_nextslide = $this.listSlider[i]["button"][0]["popupno_gotoSlide"];
							}
							var pop = $this.listSlider[i]["button"][0]["popup"];
							$(cloneBtn).click(function(e){
								$("#"+pop).modal({backdrop: 'static',keyboard: true,show: true});
								$("#"+pop+" .popupalert-yes").click(function(e){
								    $(this).off();
								    $("#"+pop).modal("hide");
								    game.audio.audioButton.play();
								    if(popupyes_nextslide){
								    	game.scorm_helper.setSlide(parseInt(popupyes_nextslide)-1);
								    	game.audio.audioBackgroundSlider.pause();
										game.nextSlide();
								    }else{
								    	game.audio.audioBackgroundSlider.pause();
								    	game.nextSlide();
									}
								});
								$("#"+pop+" .popupalert-no").click(function(e){
									$(this).off();
									$("#"+pop+" .popupalert-yes").off();
									game.audio.audioButton.play();
								    $("#"+pop).modal("hide");
								    if(popupno_nextslide){
								    	game.scorm_helper.setSlide(parseInt(popupno_nextslide)-1);
								    	game.audio.audioBackgroundSlider.pause();
										game.nextSlide();
								    }
								});
								$("#"+pop+" .img-popup").click(function(e){
									$(this).off();
									$("#"+pop+" .popupalert-yes").off();
									game.audio.audioButton.play();
								    $("#"+pop).modal("hide");
								});
							});
						}else{
							var tutorial = $this.listSlider[i]["button"][0]["tutorial"];
							var link = $this.listSlider[i]["button"][0]["link"];
							$(cloneBtn).click(function(e){
								if(tutorial){
									$("#tutorial .tutorial").removeClass("active");
									$("#tutorial .tutorial.link_web").addClass("done");
									$("#tutorial .tutorial.link_web").addClass("active");
									$("#tutorial").modal('show');
									$("#tutorial .start-game").click(function(e){
										$("#tutorial").modal('hide');
										$(this).off();
										game.audio.audioButton.play();
										window.open(link);
								    });
								}else{
									game.audio.audioButton.play();
									game.audio.audioBackgroundSlider.pause();
									game.nextSlide();
								}
							});
						}
					}
				}
			}
		}
		else{
			$(clone).find(".button_wrapper").remove();
		}

		//event click btn_scoring
		$(clone).find(".btn_scoring").unbind().click(function(){
			game.audio.audioGesture.play();
			let btn_scoring_wrapper = $(this).parent();
			let list_slider = $(this).parents().eq(2);
			let index_slider = parseInt($(list_slider).attr("data-slick-index"));
			let index = parseInt($(this).attr("index"));
			// console.log(btn_scoring_wrapper);
			// console.log(index);
			$(btn_scoring_wrapper).find(".btn_scoring").removeClass("active");
			$(this).addClass("active");
			$this.setScoring(index, index_slider);
		});
	}
	$('#ulasan').slick({
        dots: true,
        infinite: false,
        speed: 500,
        arrows: true,
        dragagble:false,
        swipe:false
    });

    $(".slick-arrow").hide();
    $(".slick-dots").hide();

    $("#ulasan").on("afterChange", function(event, slick, currentSlide, nextSlide){
    	console.log(currentSlide);
    	$("#video_slider").get(0).pause();

    	let clone = $("#video_slider-"+currentSlide);
    	$this.playVideoPotrait(clone, undefined);
    });
};

SliderScoring.prototype.sliderPopup = function() {
	var $this = this;
	$("#popupList").find(".slider_wrapper").slick({
		slidesToShow: 1,
		dots: true,
        infinite: false,
        speed: 500,
        arrows: false,
        variableWidth: true
	});
	$("#popupList").find(".slider_wrapper").on("afterChange", function(event, slick, currentSlide, nextSlide){
		if(currentSlide+1 == $this.countSlide){
			$("#popupList .button_wrapper").show();
		}else{
			$("#popupList .button_wrapper").hide();
		}
	});
};

SliderScoring.prototype.setScoring = function(index, index_slider) {
	var $this = this;

	let arr_digital_score = ($this.game_data["digital_score"] != undefined ? $this.game_data["digital_score"] : []);
	arr_digital_score.push(parseInt(index));
	$this.game_data["digital_score"] = arr_digital_score;
	// console.log($this.game_data);
	// console.log(index);
	// console.log($this.total_slide);
	if((index_slider+1) < $this.total_slide){
		$(".slick-next").click();
	}else{
		game.scorm_helper.setSingleData("game_data", $this.game_data);
		game.nextSlide();
	}
};