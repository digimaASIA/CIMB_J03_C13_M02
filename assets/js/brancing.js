var Brancing = function(){
	
}

Brancing.prototype.init = function(current_settings) {
	var $this = this;
	$this.current_settings = current_settings;
	$this.choice = $(".choice").first().clone();
	$this.index = 0;
	$this.nilai = 100;
	$.get("config/setting_brancing_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.mode = e["mode"];
		$this.indicator = e["indicator"];
		$this.icon = e["icon"];
		$this.soal = e["soal"];
		$this.audio = e["audio"];
		$this.mulaiGame();
	},"json");
};

Brancing.prototype.mulaiGame = function() {
	var $this = this;
	if($this.mode == "visnov"){
		$this.nilai = 0;
	}else if($this.mode == "brancing"){
		$this.nilai = 100;
	}
	$this.setIndicatorFirst();
	if($this.soal[$this.index]["soal"]){		
		$this.setBacksound();
	}else{
		game.audio.audioBackground.pause();
		game.nextSlide();
	}
};

Brancing.prototype.setIndicatorFirst = function() {
	var $this = this;
	$(".indicator").css("width",$this.nilai+"%");
	if($this.indicator){
		$(".indicator_wrapper").addClass("text");
		$(".indicator_wrapper").find("p").html($this.indicator);
	}else{
		$(".image_indicator").css("left",$this.nilai+"%");
	}
	if($this.nilai == 100){
		$(".indicator").css("background","#1F8F6F");
	}else if($this.nilai >= 75){
		$(".indicator").css("background","#8FAE60");
	}else if($this.nilai >= 50){
		$(".indicator").css("background","#FFCC51");
	}else if($this.nilai >= 25){
		$(".indicator").css("background","#FA7E4C");
	}else{
		$(".indicator").css("background","#F53047");
	}
	if($this.nilai >= 75){
		$(".image_indicator").find("img").attr("src","assets/image/brancing/"+$this.icon[0]);
	}else if($this.nilai >= 25){
		$(".image_indicator").find("img").attr("src","assets/image/brancing/"+$this.icon[1]);
	}else{
		$(".image_indicator").find("img").attr("src","assets/image/brancing/"+$this.icon[2]);
	}
};

Brancing.prototype.setBacksound = function() {
	var $this = this;
	/*if($this.soal[$this.index]["audio"]){
		game.audio.audioBackground.src = "assets/audio/"+$this.soal[$this.index]["audio"];
		game.audio.audioBackground.loop = true;
		game.audio.audioBackground.play();
	}else{
		game.audio.audioBackground.pause();
	}*/
	game.audio.audioBackground.src = "assets/audio/"+$this.audio;
	game.audio.audioBackground.loop = true;
	game.audio.audioBackground.play();
	$this.setGame();
};

Brancing.prototype.setGame = function(index_video = 0) {
	var $this = this;
	$(".video_wrapper .img_soal").hide();
	if($this.soal[$this.index]["video"]){
		$(".bg_name_text_wrapper").hide();
	}else{
		$this.setEnd();
	}
	if($this.video != undefined){
		var video = $this.video;
	}else{
		var video = $this.soal[$this.index]["video"];	
	}
	if(index_video < video.length){
		$("#video").find("source").attr("src","assets/video/"+video[index_video]["video"]);
		if(video[index_video]["name"]){
			$(".video_wrapper .name_wrapper").show();
			$(".video_wrapper .name_wrapper").find(".name").html(video[index_video]["name"]["text"]);
			if(video[index_video]["name"]["position"] == "left"){
				$(".video_wrapper .name_wrapper").addClass("left");
			}else if(video[index_video]["name"]["position"] == "center"){
				$(".video_wrapper .name_wrapper").addClass("center");
			}else if(video[index_video]["name"]["position"] == "right"){
				$(".video_wrapper .name_wrapper").addClass("right");
			}
			if(video[index_video]["name"]["image"]){
				$(".video_wrapper .name_wrapper").find("img").attr("src","assets/image/brancing/"+video[index_video]["name"]["image"]);
				$(".video_wrapper .name_wrapper").find(".name").css("margin-right","1.0610079575596818vh");
			}else{
				$(".video_wrapper .name_wrapper").find("img").remove();
			}
			if(video[index_video]["name"]["css"]){
				$(".video_wrapper .name_wrapper").css(video[index_video]["name"]["css"]);
			}
			$(".video_wrapper .name_text_wrapper").show();
		}else{
			$(".video_wrapper .name_text_wrapper").hide();
		}
		if(video[index_video]["text"]["text"]){
			$(".video_wrapper .text_wrapper").html(video[index_video]["text"]["text"]);
			if(video[index_video]["text"]["css"]){
				$(".video_wrapper .text_wrapper").css(video[index_video]["text"]["css"]);
			}
			$(".video_wrapper .text_wrapper").show();
		}else{
			$(".video_wrapper .text_wrapper").hide();
		}
		$this.setVideo(index_video);
	}else{
		$this.setEnd();
	}
};

Brancing.prototype.setVideo = function(index_video) {
	var $this = this;
	$("#video").hide();
	$("#video")[0].load();
	$interval = setInterval(function(){
		if($("#video")[0].readyState == 4){
			clearInterval($interval);
			$("#video").show();
			$this.playVideo();
		}
		/*$("#video").on("canplay",function(e){
			clearInterval($interval);
			$(this).off();
			$("#video").show();
			$this.playVideo();
		});*/
	},100);
	$(".video_wrapper").click(function(e){
		$(this).off();
		index_video++;
		$this.setGame(index_video);
	});
};

Brancing.prototype.setEnd = function() {
	var $this = this;
	$this.pauseVideo();
	if($this.soal[$this.index]["soal"]){
		$(".bg_name_text_wrapper").show();
		$(".video_wrapper .name_text_wrapper").hide();
		$this.setQuestion();
	}else{
		game.audio.audioBackground.pause();
		game.nextSlide();
	}
};

Brancing.prototype.playVideo = function() {
	var $this = this;
	$("#video")[0].play();
};

Brancing.prototype.pauseVideo = function() {
	var $this = this;
	$("#video")[0].pause();
};

Brancing.prototype.setQuestion = function() {
	var $this = this;
	if($this.soal[$this.index]["soal"]["background"]){
		$(".video_wrapper .img_soal").attr("src","assets/image/brancing/"+$this.soal[$this.index]["soal"]["background"]);
		$(".video_wrapper .img_soal").show();
	}else{
		$(".video_wrapper .img_soal").hide();
	}
	if($this.soal[$this.index]["soal"]["name"]){
		$(".bg_name_text_wrapper .name_wrapper").show();
		$(".bg_name_text_wrapper .name_wrapper").find(".name").html($this.soal[$this.index]["soal"]["name"]["text"]);
		if($this.soal[$this.index]["soal"]["name"]["position"] == "left"){
			$(".bg_name_text_wrapper .name_wrapper").addClass("left");
		}else if($this.soal[$this.index]["soal"]["name"]["position"] == "center"){
			$(".bg_name_text_wrapper .name_wrapper").addClass("center");
		}else if($this.soal[$this.index]["soal"]["name"]["position"] == "right"){
			$(".bg_name_text_wrapper .name_wrapper").addClass("right");
		}
		if($this.soal[$this.index]["soal"]["name"]["image"]){
			$(".bg_name_text_wrapper .name_wrapper").find("img").attr("src","assets/image/brancing/"+$this.soal[$this.index]["soal"]["name"]["image"]);
			$(".bg_name_text_wrapper .name_wrapper").find(".name").css("margin-right","1.0610079575596818vh");
		}else{
			$(".bg_name_text_wrapper .name_wrapper").find("img").remove();
		}
		if($this.soal[$this.index]["soal"]["name"]["css"]){
			$(".bg_name_text_wrapper .name_wrapper").css($this.soal[$this.index]["soal"]["name"]["css"]);
		}
	}else{
		$(".bg_name_text_wrapper .name_wrapper").hide();
	}
	if($this.soal[$this.index]["soal"]["duration"]){
		$(".bg_name_text_wrapper .progress_wrapper").show();
		$this.setTimer();
	}else{
		$(".bg_name_text_wrapper .progress_wrapper").hide();
	}
	$(".bg_name_text_wrapper .text_wrapper").html($this.soal[$this.index]["soal"]["text"]["text"]);
	if($this.soal[$this.index]["soal"]["text"]["css"]){
		$(".bg_name_text_wrapper .text_wrapper").css($this.soal[$this.index]["soal"]["text"]["css"]);
	}
	$(".bg_name_text_wrapper .choice_wrapper").html("");
	var arr_temp = [];
	var arr_rand = [];
	for (var i = 0; i < $this.soal[$this.index]["soal"]["pilihan"].length; i++) {
		arr_temp.push(i);
	}
	for (var i = 0; i < $this.soal[$this.index]["soal"]["pilihan"].length; i++) {
		var rand = Math.floor((Math.random() * (arr_temp.length-1)));
		arr_rand.push(arr_temp[rand]);
		arr_temp.splice(rand, 1);
	}
	for(var i = 0; i < arr_rand.length; i++){
		var clone = $this.choice.clone();
		clone.attr("index",$this.soal[$this.index]["soal"]["pilihan"][arr_rand[i]]["index"]);
		clone.html($this.soal[$this.index]["soal"]["pilihan"][arr_rand[i]]["text"]);
		$(".bg_name_text_wrapper .choice_wrapper").append(clone);
	}
	$this.settingChoice();
};

Brancing.prototype.setTimer = function() {
	var $this = this;
	$(".bg_name_text_wrapper .progress_bar").css("width","100%");
	$(".bg_name_text_wrapper .progress_bar").animate({"width":"0"},{duration:$this.soal[$this.index]["soal"]["duration"],easing:"linear",complete:function(){
		$this.cekJawaban();
	}});
};

Brancing.prototype.settingChoice = function() {
	var $this = this;
	$(".choice").click(function(e){
		$(this).off();
		$(this).addClass("active");
		$this.cekJawaban();
	});
};

Brancing.prototype.cekJawaban = function() {
	var $this = this;
	var $flag = 1;
	$(".choice").each(function(e){
		if($(this).hasClass("active")){
			if(parseInt($(this).attr("index")) == $this.soal[$this.index]["soal"]["jawaban"]){
				$(this).addClass("benar");
				$flag = 0;
			}else{
				$(this).addClass("salah");
			}
			$this.video = $this.soal[$this.index]["soal"]["pilihan"][parseInt($(this).attr("index"))]["video"];
			$this.index = $this.soal[$this.index]["soal"]["pilihan"][parseInt($(this).attr("index"))]["nextsoal"];
		}
	});
	if($(".choice.active").length == 0){
		$this.video = $this.soal[$this.index+1]["video"];
		$this.index = $this.index+1;
	}
	if($this.mode == "brancing"){
		if($flag == 1){
			$this.nilai = $this.nilai - 15;
			if($this.nilai < 0){
				$this.nilai = 0;
			}
		}
	}else if($this.mode == "visnov"){
		if($flag == 0){
			game.audio.audioBenar.play();
			var valuequiz = 100 / ($this.soal.length-2);
			$this.nilai = $this.nilai + valuequiz;
			if($this.nilai > 100){
				$this.nilai = 100;
			}
		}else{
			game.audio.audioSalah.play();
		}
	}
	$(".indicator").animate({"width":$this.nilai+"%"},{duration:1000,easing:"linear",step:function(){
		if($this.nilai == 100){
			$(this).css("background","#1F8F6F");
		}else if($this.nilai >= 75){
			$(this).css("background","#8FAE60");
			$(".image_indicator").find("img").attr("src","assets/image/brancing/"+$this.icon[0]);
		}else if($this.nilai >= 50){
			$(this).css("background","#FFCC51");
		}else if($this.nilai >= 25){
			$(this).css("background","#FA7E4C");
			$(".image_indicator").find("img").attr("src","assets/image/brancing/"+$this.icon[1]);
		}else{
			$(this).css("background","#F53047");
			$(".image_indicator").find("img").attr("src","assets/image/brancing/"+$this.icon[2]);
		}
	}});
	if(!$this.indicator){
		$(".image_indicator").animate({"left":$this.nilai+"%"},{duration:1000,easing:"linear",step:function(){
			if($this.nilai >= 75){
				$(this).find("img").attr("src","assets/image/brancing/"+$this.icon[0]);
			}else if($this.nilai >= 25){
				$(this).find("img").attr("src","assets/image/brancing/"+$this.icon[1]);
			}else{
				$(this).find("img").attr("src","assets/image/brancing/"+$this.icon[2]);
			}
		}});
	}
	game.scorm_helper.setSingleData("score",$this.nilai);
	if($this.mode == "brancing"){
		$(".bg_name_text_wrapper").hide();
		$this.setGame();
	}else{
		setTimeout(function(){
			$(".bg_name_text_wrapper").hide();
			$this.setGame();
		},1000);
	}
};