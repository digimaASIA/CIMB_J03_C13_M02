var GameMultichoice = function(){
  var $this = this;
}

GameMultichoice.prototype.init = function(current_settings){
  var $this= this;
  $this.indexBintang =0;
  $this.indexBintang2 =0;
  $this.current_settings = current_settings;
  $this.penampung_jawaban = $("#popupSoalMultichoice").find(".choice").first().clone();
  $this.feedback_place_slider = $(".places_slider").first().clone();
  //$this.penampung_bintang = $(".star-wrapper").first().clone();

  $.get("config/setting_quizmultichoice_slide_1.json",function(e){
    $this.background = e["background"];
    $this.backgroundModalAwalAkhir = e["backgroundModalAwalAkhir"];
    $this.mode = e["evaluasi"];
    // $this.bintang = e["bintang"];
    $this.listQuestion = e["list_question"];
    $this.total_question = e["list_question"].length;
    $this.question_data = e["list_question"];
    $this.createData(); 
  },'json');
};


GameMultichoice.prototype.createData = function(){
  var $this = this;
  var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);

  if(ldata == undefined || ldata["answer"]== undefined || ldata["answer"]== null || ldata["answer"].length < $this.listQuestion.length){
    var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion(),ldata);
    $this.list_question = sdata["list_question"];
    $this.list_answer = sdata["answer"];
    $this.curr_soal = sdata["answer"].length;
    $this.setTutorial();
  }
  else{
    game.nextSlide();
  }
};

GameMultichoice.prototype.getQuestion = function(){
  var $this = this;
  var arr_quest = [];
  var arr_rand = [];
  var returnQuest = [];

  for (var i = 0; i < $this.listQuestion.length; i++) {
    arr_quest.push(i);
  }
  if($this.isRandom == true ){
    do{
      var rand = Math.ceil(Math.random()*(arr_quest.length-1));
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


GameMultichoice.prototype.setTutorial = function(){
  var $this = this;
  
  // $(".talk-bubble").hide();
  $("#button").hide()
  // get current soal
  var $current_soal = $this.question_data[$this.list_question[$this.curr_soal]];

  if($this.curr_soal<$this.question_data.length){
    $("#tutorial .tutorial").removeClass("active");
    if(!$("#tutorial .tutorial.category").hasClass("done")){
      $("#tutorial .tutorial.category").addClass("done");
      $("#tutorial .tutorial.category").addClass("active");
      $("#tutorial").modal({backdrop: 'static',keyboard: true,show: true});
    }
    $("#tutorial .start-game").click(function(e){
      $(this).off();
      game.audio.audioButton.play();
      $("#tutorial").modal('hide');
      $this.setPage();
    });
  }
};

GameMultichoice.prototype.setPage = function(){
  var $this = this;
  $(".slider-content").css({"background":$this.background});
  $("#popupSoalMultichoice .list_question").show();
  $this.createQuiz();
};


GameMultichoice.prototype.createQuiz = function(){
  var $this=this;
  $this.type = $this.listQuestion[$this.list_question[$this.curr_soal]]["type"];
  if(!$(".star").length){
    if($this.listQuestion){
      for(x=0;x<$this.listQuestion.length;x++){
        $(".star-wrapper").append('<img class="star" src="assets/image/gameMultichoice/icon_empty.png"></img>');
      }
    }
    $(".star").each(function(){
      $(this).attr("index",$this.indexBintang++); 
    });
  }

  $("#popupSoalMultichoice .choice").remove();
  if($this.listQuestion[$this.list_question[$this.curr_soal]]["question"]){
    $("#popupSoalMultichoice .soal").html($this.listQuestion[$this.list_question[$this.curr_soal]]["question"]);
    if($this.listQuestion[$this.list_question[$this.curr_soal]]["css"]){
      $("#popupSoalMultichoice .soal").css($this.listQuestion[$this.list_question[$this.curr_soal]]["css"]);
    }else{
      $("#popupSoalMultichoice .soal").removeAttr("style");
    }
    $("#popupSoalMultichoice .choice").html($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"]);
    if($this.listQuestion[$this.list_question[$this.curr_soal]]["backgroundSoal"]){
      $("#popupSoalMultichoice .modalSoal").css("background",$this.listQuestion[$this.list_question[$this.curr_soal]]["backgroundSoal"]);
    }
  }

  if($this.listQuestion[$this.list_question[$this.curr_soal]]["image"]){
    $("#popupSoalMultichoice #image-soal").attr("src","assets/image/gameMultichoice/"+$this.listQuestion[$this.list_question[$this.curr_soal]]["image"]);
  }else{
    $("#popupSoalMultichoice #image-soal").hide();
  }

  $("#popupSoalMultichoice").modal({backdrop: 'static',keyboard: true,show: true});
  if($this.type == "mc"){
    if($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"]){
      for(i=0;i<$this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"].length;i++){
        var clone = $this.penampung_jawaban.clone();
        $(clone).html($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"][i]["text"]);
      $(clone).attr("index",$this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"][i]["index"]);
      $("#popupSoalMultichoice .choices").append(clone);
  }
 }
$("#popupSoalMultichoice").find(".choice").click(function(e){
  $(this).off();
  if(!$(this).hasClass("active")){
    $(this).addClass("active");
  }else{
    $(this).removeClass("active");
  }
  $this.checkJawaban();
    if($this.mode == false){
      setTimeout(function(){
      $("#popupSoalMultichoice").modal('hide');
    },200);
    }else{
      $("#popupSoalMultichoice").modal('hide');
    }
  });
}else if($this.type == "mmc"){
    $("#popupSoalMultichoice").find(".btn_next_submit").removeClass('hide');
    $("#popupSoalMultichoice").find(".btn_next_submit").show();
    if($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"]){
    for(j=0;j<$this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"].length;j++){
      var clone = $this.penampung_jawaban.clone();
      $(clone).html($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"][j]["text"]);
      $(clone).attr("index",$this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"][j]["index"]);
      $("#popupSoalMultichoice .choices").append(clone);
    }
  }
  $("#popupSoalMultichoice").find(".choice").click(function(e){
    if(!$(this).hasClass("active")){
      $(this).addClass("active");
    }
    else{
      $(this).removeClass("active");
    }

  })
  $("#popupSoalMultichoice").find(".btn_next_submit").click(function(e){ 
    $(this).off();
    $("#popupSoalMultichoice").find(".btn_next_submit").hide();
    $this.checkJawaban();
    if($this.mode == false){
      setTimeout(function(){
      $("#popupSoalMultichoice").modal('hide');
    },200);
    }else{
      $("#popupSoalMultichoice").modal('hide');
    }
  })
}else if($this.type == "tf"){
    $("#popupSoalMultichoice").find(".truefalse_wrapper").removeClass('hide');
    $("#popupSoalMultichoice").find(".truefalse_wrapper").show();
    var flagTrueFalseText = 1;
    if(flagTrueFalseText == 1){
      var clone = $this.penampung_jawaban.clone();
      $("#popupSoalMultichoice").find(".btn_true").html($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"][0]["text"]);
      $("#popupSoalMultichoice").find(".btn_false").html($this.listQuestion[$this.list_question[$this.curr_soal]]["pilihan"][1]["text"]);
    }
    $("#popupSoalMultichoice").find(".btn_true").click(function(e){ 
      $(this).addClass("active"); 
      $(this).off();
      $("#popupSoalMultichoice").find(".btn_false").off();
      $this.checkJawaban();
    if($this.mode == false){
      setTimeout(function(){
      $("#popupSoalMultichoice").modal('hide');
    },200);
    }else{
      $("#popupSoalMultichoice").modal('hide');
    }
    });
    $("#popupSoalMultichoice").find(".btn_false").click(function(e){   
      $(this).addClass("active"); 
      $(this).off(); 
      $("#popupSoalMultichoice").find(".btn_true").off();
      $this.checkJawaban();
    if($this.mode == false){
      setTimeout(function(){
      $("#popupSoalMultichoice").modal('hide');
    },200);
    }else{
      $("#popupSoalMultichoice").modal('hide');
    }
    });
}
};

GameMultichoice.prototype.checkJawaban = function(){
  var $this = this;
  var $count =0;

  $this.flagJawaban =0;

  //get current soal
   var $current_soal = $this.listQuestion[$this.list_question[$this.curr_soal]];

   //cek jawaban MMC
   if($this.type == "mmc"){
    $("#popupSoalMultichoice").find(".choice").each(function(){
      if($(this).hasClass("active")){
        $(this).removeClass("active");
        var $cek =0;
        for (var i = 0; i < $current_soal["jawaban"].length; i++) {
          if($current_soal["jawaban"][i] == $(this).attr("index")){
          $cek=1;
          break;
          }
        }
        if($this.mode == false){
          if($cek == 1){
          $count++;
          $(this).addClass("right");
        }else{
          $count = 0;
          $(this).addClass("wrong");
         }
        }else{
          if($cek == 1){
          $count++;
          //$(this).addClass("right");
        }else{
          $count = 0;
          // $(this).addClass("wrong");
         }          
        }
      }
    })

    if($count == $current_soal["jawaban"].length){

      $this.flagJawaban = 0;
    }else{
      $this.flagJawaban = 1;
    }
   }

   //cek jawaban TF
  if($this.type == "tf"){
    $("#popupSoalMultichoice .truefalse_wrapper").find(".button").each(function(){
    if($(this).hasClass("active")){
      $(this).removeClass("active");
      var $cek =0;
     for (var i = 0; i < $current_soal["jawaban"].length; i++) {
      if($current_soal["jawaban"][i] == $(this).attr("index")){
        $cek=1;
      }
     }   
     if($this.mode == false){
        if($cek == 1){
          $(this).addClass("right");
        }else{
          $this.flagJawaban = 1;
          $(this).addClass("wrong");
        }
      }else{
        if($cek == 1){
          $this.flagJawaban =0;
          //$(this).addClass("right");
        }else{
          $this.flagJawaban = 1;
          //$(this).addClass("wrong");
        }        
      }
     }
    })
  }

  //cek jawaban MC
 if($this.type =="mc"){
   $("#popupSoalMultichoice").find(".choice").each(function(index){
   if($(this).hasClass("active")){
      $(this).removeClass("active");
      var $cek =0;
      for (var i = 0; i < $current_soal["jawaban"].length; i++) {;
        if($current_soal["jawaban"][i] == $(this).attr("index")){
          $cek=1;
           break;
        }
     }

    if($this.mode == false){
      if($cek == 1){
       $(this).addClass("right");
      }else{
        $this.flagJawaban = 1;
        $(this).addClass("wrong");
      }
     }else{
      if($cek == 1){
        $this.flagJawaban =0;
       //$(this).addClass("right");
      }else{
        $this.flagJawaban = 1;
        //$(this).addClass("wrong");
      }      
     }
    }
   })
  }  

  //end check jawaban

  //feedback
  if($this.flagJawaban==0){
    if($this.mode == false){
      game.audio.audioBenar.play();
      $(".alert").addClass("benar");
    }
    $(".modal_feedback").addClass("benar");
    $(".star[index='"+$this.indexBintang2+"']").attr("src","assets/image/gameMultichoice/icon_active.png");
    $this.indexBintang2++;
    $this.feedback();
    game.scorm_helper.pushAnswer(1,$this.listQuestion[$this.list_question[$this.curr_soal]]["question"]["text"]);
  }else if($this.flagJawaban==1){
    if($this.mode == false){
      game.audio.audioSalah.play();
      $(".alert").addClass("salah");
    }
    $(".modal_feedback").addClass("salah");
    $this.feedback();
    game.scorm_helper.pushAnswer(0,$this.listQuestion[$this.list_question[$this.curr_soal]]["question"]["text"]);
  }
  setTimeout(function(){
    $(".alert").removeClass("benar");
    $(".alert").removeClass("salah");
  },100);
};

GameMultichoice.prototype.feedback = function(){
  var $this = this;
  var isFeedback = false;
  var $current_soal = $this.question_data[$this.list_question[$this.curr_soal]];

  //set feedback
  if($current_soal["feedback_benar"] && $current_soal["feedback_salah"]){
    isFeedback = true;
    $("#modal_feedback .description .description_wrapper").html("");
    if($this.flagJawaban == 0){
      $("#modal_feedback .description .description_wrapper").html("");
      var $clone_sliderwrapper = $this.feedback_place_slider.clone();
      $clone_sliderwrapper.find("p").html($current_soal["feedback_benar"][0]);
      $("#modal_feedback .description .description_wrapper").append($clone_sliderwrapper);
    }
    else{
      $("#modal_feedback .description .description_wrapper").html("");
        var $clone_sliderwrapper = $this.feedback_place_slider.clone();
        $clone_sliderwrapper.find("p").html($current_soal["feedback_salah"][0]);
        $("#modal_feedback .description .description_wrapper").append($clone_sliderwrapper);
    }
  }

  //show feedback
  if(isFeedback == true){
    $("#modal_feedback").modal({backdrop: 'static',keyboard: true,show: true});
    $("#modal_feedback .close_feedback").click(function(e){
      $(this).off();
      $("#modal_feedback").modal('hide');
      if($(".modal_feedback").hasClass("benar")){
        $(".modal_feedback").removeClass("benar");
      }
      else{
        $(".modal_feedback").removeClass("salah");
      }
      $(".curr_soal").html($this.curr_soal);
      $this.curr_soal +=1;
      if($this.curr_soal == $this.total_question){
        $(".modal-backdrop.in").css("display","none");
        game.nextSlide(); 
      }else{
        $this.setPage();
      }   
    });
  }
  else if(isFeedback == false){
    setTimeout(function(){
    if($(".modal_feedback").hasClass("benar")){
      $(".modal_feedback").removeClass("benar");
    }
    else{
      $(".modal_feedback").removeClass("salah");
    }
      $this.curr_soal +=1;
    if($this.curr_soal == $this.total_question){
      $(".modal-backdrop.in").css("display","none");
      game.nextSlide();          
    }else{      
        $this.setPage();
    }  
   },300); 
  }
};