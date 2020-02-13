var Game = function(){
	var $this = this;
	this.audio = new Audio();
    this.setting_global = new  Setting();
	this.max_score = 100;
	this.min_score = 80;
	this.attemp=0;
	this.isDebug = true;
	this.temp = 1;
	this.startDate = this.getCurrDateTimestamp();

    this.show_tutorial_visnov = 0;
    this.audio_global;

	$.get("config/templete_content.json",function(e){
		$this.arr_content = e["list_slide"];
		$this.curr_module = e["module"];
		$this.curr_course = e["course"];
		$this.mode = e["mode"];
		$this.environment = e["environment"];
		$this.scorm_helper = new ScormHelper();
		$this.create_slide();
	},'json');
}

Game.prototype.create_slide = function() {

	var $this = this;
	var current = $this.scorm_helper.getCurrSlide();

	var str = $this.arr_content[current]["file"];
    console.log(current);
    console.log(str);
	var arr = str.split("/");

    if(current >= 1 && current <= 4){
        if($this.audio_global == undefined){
            let src = "assets/audio/BGM1_opening.mp3";
            $this.audio_global = game.audio.audio_dynamic(src);
            $this.audio_global.loop = true;
            $this.audio_global.play();
        }
    }else if(current >= 7 && current <= 10){
        if($this.audio_global == undefined){
            let src = "assets/audio/BGM2_quiz_swipe_card.mp3";
            $this.audio_global = game.audio.audio_dynamic(src);
            $this.audio_global.loop = true;
            $this.audio_global.play();
        }
    }else if(current >= 11 && current <= 14){
        if($this.audio_global == undefined){
            let src = "assets/audio/BGM3_quiz_visnov.mp3";
            $this.audio_global = game.audio.audio_dynamic(src);
            $this.audio_global.loop = true;
            $this.audio_global.play();
        }
    }else{
        if($this.audio_global != undefined){
            $this.audio_global.pause();
        }
    }

	 if(current >= 13 && current <= 20){
        /*Funtion set text complete bar*/
            console.log($this.arr_content[current]["text_complete_bar"]);
            if($this.arr_content[current]["text_complete_bar"] != undefined){
                $this.text_complete_bar = $this.arr_content[current]["text_complete_bar"];
            }
        /*End funtion set text complete bar*/

        $this.setProgresBar();
    }

	if($this.environment == "game"){
		$(".body-wrapper").addClass("col-xs-12 col-sm-10 col-md-10 col-lg-4");
		$(".body-wrapper").css({"width":"","left":"50%","transform":"translateX(-50%)"});
	}else{
		$(".body-wrapper").css({"width":"100%"});
	}
	if(arr[0] == "muse"){
		window.location = $this.arr_content[current]["file"];
	}
	else{
		$.get($this.arr_content[current]["file"],function(e){
			$this.curr_slide = $(e).clone();
			$this.curr_slide.find(".title-course").html($this.curr_course);
			$this.curr_slide.find(".title-module").html($this.curr_module);
			$("#content").html($this.curr_slide);

			if($this.arr_content[current]["class"]){
				$this.curr_class = new window[$this.arr_content[current]["class"]];
				$this.curr_class.init($this.arr_content[current]);
			}

			$(".next_page").click(function(e){
				$this.audio.audioButton.play();
				$this.nextSlide();
			});

			$(".prev_page").click(function(e){
				$this.audio.audioButton.play();
				$this.prevSlide();
			});
		});
	}
};

Game.prototype.setSlide = function(idx_slide) {
    console.log("setSlide");
    this.audio.audioButton.play();
    this.scorm_helper.setSlide(parseInt(idx_slide)-1);
    this.nextSlide();
};

Game.prototype.nextSlide = function() {
	if(this.scorm_helper.getCurrSlide()<this.arr_content.length-1){
		this.scorm_helper.nextSlide();
		this.create_slide();
	}
};
Game.prototype.prevSlide = function() {
	if(this.scorm_helper.getCurrSlide()<this.arr_content.length-1){
		this.scorm_helper.setSlide(this.scorm_helper.getCurrSlide()-2);
		this.scorm_helper.nextSlide();
		this.create_slide();
	}
};

Game.prototype.prev = function(prev) {
	var $this = this;
	if(prev){
        $( ":mobile-pagecontainer" ).pagecontainer( "change", prev, {
            transition: "slide",
            reverse: true
        });
    }
};

Game.prototype.next = function(next) {
	var $this = this;
	if(next){
        $( ":mobile-pagecontainer" ).pagecontainer( "change", next, {
            transition: "slide"
        });
    }
};

Game.prototype.getDate = function() {
	var months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember" ];
	var dateString = "";
	var newDate = new Date();  
	dateString += newDate.getDate() + " "; 
	dateString += (months[newDate.getMonth()]) + " "; 
	dateString += newDate.getFullYear();

	return dateString;
};
Game.prototype.getFullDate = function() {
	var months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember" ];
	var dateString = "";
	var newDate = new Date();  
	dateString += newDate.getDate() + " "; 
	dateString += (months[newDate.getMonth()]) + " "; 
	dateString += newDate.getFullYear() + " ";
	dateString += newDate.getHours()+":";
	dateString += newDate.getMinutes()+":";
	dateString += newDate.getSeconds();
	return dateString;
};

Game.prototype.StringToDate = function(str) {
	var arr = str.split(" ");
	var months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember" ];
	
	var get_month=0;
	for (var i = 0; i < months.length; i++) {
		if(months[i] == arr[1]){
			get_month = i+1;
			break;
		}
	}

	game.debug(get_month+"/"+arr[0]+"/"+arr[2]+" "+arr[3]);
	var date = new Date(get_month+"/"+arr[0]+"/"+arr[2]+" "+arr[3]);
	return date;
};

Game.prototype.getCurrDateTimestamp = function() {
	var date =  new Date();
	return date.getTime();
};

Game.prototype.parseTime = function(deff) {
	var str="";
	var diffHours = Math.floor(deff / (1000 * 3600))%24;
	var diffMunites = Math.floor(deff / (1000 * 60))%60;
	var diffSec = Math.floor(deff / 1000)%60;
	var diffMill = deff % 1000;

	if(diffHours<10){
		str=str+"0"+diffHours+":";
	}
	else{
		str=str+diffHours+":";
	}

	if(diffMunites<10){
		str=str+"0"+diffMunites+":";
	}
	else if(diffMunites>=10){
		str=str+diffMunites+":";
	}

	if(diffSec<10){
		str=str+"0"+diffSec;
	}
	else if(diffSec>=10){
		str=str+diffSec+".00";
	}

	this.debug(str);
	return str;
};

Game.prototype.debug = function(string) {
	if(this.isDebug){
		//alert(string);
		console.log(string);
	}
};

Game.prototype.playBacksound = function(src_audio, looping = true) {
    var $this = this;
   
    //play sound 2
    var src_audio_2 = "assets/audio/"+src_audio;
    console.log('src_audio_2: '+src_audio_2);
    $this.audio_backsound_per_stage = game.audio.audio_dynamic(src_audio_2);
    var promise = $this.audio_backsound_per_stage.play();

    if (promise !== undefined) {
         promise.then(_ => {
         // Autoplay started!
    }).catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
      });
    }

    if(looping == true){
        $this.time_backsound_per_stage = setInterval(function() {
            var duration = $this.audio_backsound_per_stage.duration;
            var currentTime = $this.audio_backsound_per_stage.currentTime;
            // console.log(duration);
            // console.log(currentTime);
            if(duration <= currentTime){
                // clearInterval($this.time_backsound);

                // var contentTimeout = duration * 1000;
                //stop backsound
                // $this.stopBackSound();
                $this.audio_backsound_per_stage.pause();
                $this.audio_backsound_per_stage.currentTime = 0;

                setTimeout(function(){
                   
                    $this.audio_backsound_per_stage.play();
                    // $this.time_backsound = 800;
                },1000);
            }
        },800);    
     }else{
       
    }
};

Game.prototype.stopBacksound = function(){
    var $this = this;
    $this.audio_backsound_per_stage.pause();
    $this.audio_backsound_per_stage.currentTime = 0;
};


Game.prototype.showLoading = function (){
  $(".loader_image_index").show();
  $(".modal-backdrop in").show();
}

Game.prototype.hideLoading = function (){
  $(".loader_image_index").hide();
  $(".modal-backdrop in").hide();
}

Game.prototype.setProgresBar = function() {
    console.log("setProgresBar");
    var $this = this;

    let var_a;
    let var_b;
    $this.game_data = (game.scorm_helper.getSingleData("game_data") != undefined ? game.scorm_helper.getSingleData("game_data") : []);
    console.log($this.game_data);
    console.log(game.total_soal);
    // console.log(mode);

    var game_quiz = game.scorm_helper.getQuizResult(["game_slide_"+$this.setting_global["slide_quiz_visnov"]]);
    console.log(game_quiz);
    // $this.game_data["total_answer_true"] = game_quiz[""];

    let mode = 2; //mode 1 berdasarkan total step; mode 2 berdasarkan total soal
    if(mode == 2){
        // var_a = ($this.game_data["last_score"] != undefined ? $this.game_data["last_score"] : 0);
        // var_b = game.total_soal;

        var_a = game_quiz['score'];
        var_b = game_quiz['total_soal'];
    }else{
        var_a = ($this.game_data["curr_step"] != undefined ? $this.game_data["curr_step"] : 0);
        var_b = game.total_step;
    }
    
    console.log(var_a);
    console.log(var_b);
    var percent = (var_a / var_b * 100);
    console.log(percent);
    if(isNaN(percent)){
        percent = 0;
    }
    // percent = 100;
    $(".progress-bar").css("width",percent+"%");

    // game.complete_bar_type = 1;
    if(game.complete_bar_type == 2){
        $(".progress").hide();
        $(".progress_2").show();

        //hide icon complete bar
        if($this.hide_icon_complete_bar == true){
            $(".progress_2 .progress-value .fa").hide();
        }else{
            $(".progress_2 .progress-value .fa").hide();
            $(".progress_2 .progress-title").html($this.text_complete_bar);
            // console.log(percent);
            if(percent <= 69){
              $(".progress_2 .progress-value #icon-2").css("display","table");
              $(".progress_2 .progress-bar").css("background-color","#FFBC3E");
            }else if(percent > 69 && percent <= 99){
              $(".progress_2 .progress-bar").css("background-color","#FFBC3E");
              $(".progress_2 .progress-value #icon-3").css("display","table");
            }else{
              $(".progress_2 .progress-bar").css("background-color","#8AEA2A");
              $(".progress_2 .progress-value #icon-3").css("display","table");
            }
        }

        //setting css life
        $(".header .life").css("padding-left","19.2%");
    }else{
        /*Function setting css progress-bar*/
            if(percent == 0){
                $(".complete_bar .progress-value").css("right", "-3vh");
            }
        /*End function setting css progress-bar*/

        //hide icon complete bar
        if($this.hide_icon_complete_bar == true){
            $(".progress-value .fa").hide();
        }else{
            $(".progress-value .fa").hide();
            if(percent <= 69){
              $(".progress-value #icon-2").css("display","table");
            }else if(percent > 69 && percent <= 99){
              $(".progress-bar").css("background-color","#FFBC3E");
              $(".progress-value #icon-3").css("display","table");
            }else{
              $(".progress-bar").css("background-color","#8AEA2A");
              $(".progress-value #icon-3").css("display","table");
            }
        }
    }
}