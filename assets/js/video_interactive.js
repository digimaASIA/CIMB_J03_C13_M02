var VideoInteractive = function(){
	
}

VideoInteractive.prototype.init = function(current_settings) {
	$this = this;
	$this.index = 0;
	$this.current_settings = current_settings;
	$this.gesture = $("#gesture").first().clone();
	$this.deg = $(".deg_wrapper img").first().clone();
	$("#gesture").remove();
	$.get("config/setting_video_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.video = e["video"];
		$this.background_video = e["background_video"];
		$this.list_gesture = e["list_gesture"];
		$this.setTutorial();
		$this.setGame();
	},"json");
};

VideoInteractive.prototype.setTutorial = function() {
	$this = this;
	$("#tutorial .tutorial.video_interactive").addClass("done");
  	$("#tutorial .tutorial.video_interactive").addClass("active");
  	$("#tutorial").modal({backdrop: 'static',keyboard: true,show: true});
  	$("#tutorial .tutorial.video_interactive").find("div").first().slick({
      	dots: true,
      	infinite: false,
      	speed: 500,
      	prevArrow: false,
      	nextArrow: false
  	});
  	$("#tutorial .tutorial.video_interactive").find(".start-game").click(function(e){
  		$(this).off();
    	$("#tutorial .tutorial.video_interactive").removeClass("active");
    	$("#tutorial").modal('hide');
  	});
};

VideoInteractive.prototype.setGame = function() {
	$this = this;
	$video = document.getElementById("video");
	$("#video").attr("poster","assets/image/slider/"+$this.background_video);
	$("#video").find('source').attr("src","assets/video/"+$this.video);
	$("#video")[0].load();
	$interval = setInterval(function(){
		if($("#video")[0].readyState == 4){
			clearInterval($interval);
			$("#video").show();
			$(".btn_play").show();
		}
		/*$video.addEventListener("canplay",function(){
			clearInterval($interval);
			$(this).off();
			$("#video").show();
			$(".btn_play").show();
		});*/
	},1000);
	$video.addEventListener("timeupdate",function(){
		if($this.list_gesture[$this.index] != undefined){
			if($video.currentTime >= $this.list_gesture[$this.index]["time"]-2){
				$("#video")[0].volume -= 0.1;
			}
			if($video.currentTime >= $this.list_gesture[$this.index]["time"]){
				$("#video")[0].pause();
				$("#gesture").remove();
				$clone = $this.gesture.clone();
				/*$clone.find(".deg_wrapper").html("");
				for(i = 1; i <= 200; i++){
					$clone_deg = $this.deg.clone();
					$clone_deg.addClass("deg-"+i);
					$clone_deg.attr("src","assets/image/video_interactive/deg/Deg_Deg"+i+".png");
					$clone.find(".deg_wrapper").append($clone_deg);
				}*/
				$clone.find(".hand").attr("src","assets/image/video_interactive/"+$this.list_gesture[$this.index]["image_gesture"]);
				$clone.css($this.list_gesture[$this.index]["position"]);
				$(".deg_wrapper").remove();
				$(".video_wrapper").append("<div class='deg_wrapper'></div>");
				$(".video_wrapper").append($clone);
				$gesture = new Hammer(document.getElementById('gesture'));
				$gesture.get('pinch').set({ enable: true });
				$gesture.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
				$gesture.on($this.list_gesture[$this.index]["gesture"],function(e){
					game.audio.audioGesture.play();
					$gesture.get('pinch').set({ enable: false });
					$clone.remove();
					$(".deg_wrapper").remove();
					$("#video")[0].volume = 1;
					$("#video")[0].play();
					$this.index++;
				});
			}
		}
	});
	$video.addEventListener("ended",function(){
		$(".button_wrapper").show();
		$(".btn_play").find("img").attr("src","assets/image/slider/replay.png");
		$(".btn_play").show();
		$("#video")[0].pause();
		$this.index = 0;
	});
	$(".nextgame").click(function(e){
		$(this).off();
		game.nextSlide();
	});
	$(".btn_play").click(function(e) {
		e.preventDefault();
		$(this).hide();
		$(".button_wrapper").hide();
		$("#video")[0].play();
	});
};