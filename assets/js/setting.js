var Setting = function(){
   var $this = this;
   let mode_visual_novel = 'beats'; //['linear','beats','pkc']

   this.image_path = 'assets/image/';

   if(mode_visual_novel == 'linear'){
      /*Mode visual novel linear*/
         // this.linear_visual_novel = false;
         this.show_tutorial_ular_tangga = true; //show hide tutorial
         this.flag_tutorial_ular_tangga = 0; //flag tutorial_ular_tangga sudah muncul
         this.total_step = 2;
      /*End mode visual novel*/
   }else if(mode_visual_novel == 'beats'){
      this.show_tutorial_ular_tangga = true; //show hide tutorial pada stage ular tangga
      this.flag_tutorial_ular_tangga = 0; //flag tutorial_ular_tangga sudah muncul
   }

   /*Setting able variable*/
      /*Setting score*/
      this.max_score = 100;
      this.min_score = 75;
      this.percent_correct_answer_per_stage = 100; //[1,100]
      /*End setting score*/

      /*Setting life*/
      this.mode_life = false; //[true, false], bar nyawa akan muncul dan untuk menang harus mempertahankan life yang ada
      this.life_max = 5; //set max life
      /*End setting life*/

      this.auto_next_dialog = false; //[true, false], jika set true, maka dialog pada visual novel akan click otomatis dan pindah ke dialog berikutnya
      this.time_auto_next = 2000;
      this.tryagain_question_false_answer = false; //jika true, jika answer salah ulang soal terakhir
      //setting timer
      this.time_global = false; //jika true, maka time global pada stage atau map akan muncul dan alur game mengikuti waktu dari time global
      this.timer_global = 1000; //milisecond timer global
      this.pause_timer_global = false; //pause timer global default false
      this.hide_icon_complete_bar = false; //jika true, maka complete bar akan disembunyikan
      this.complete_bar_type = 1; //tipe complete bar [1,2]
      this.orientation_landscape = false; // *setting layar untuk orientasi landscape

      //setting start slide from oage
      this.slide_result_per_step = 9; //variabel untuk menentukan slide pertama result step
      this.slide_result = 14; //variabel untuk menentukan slide ke-n dari page result
      this.slide_game_map = 6; //variabel untuk menentukan slide ke-n dari page game map
      this.slide_slider_feedback_after_stage = 15;
      this.slide_stage_brankas = 12;
      this.arr_slide_quiz_n = [7,10]; //array slide quiz ke-n
      this.slide_quiz_visnov = 12;
      /*End setting able variable*/

   /*Setting page stage ular tangga*/
      this.hide_step_connector = false; //default false. jika true, maka map ular tangga step konektor akan disembunyikan
   /*End setting page stage ular tangga*/

   /*Setting page stage grid*/
      this.unlock_all_stage = true; //default false, jika true semua stage statusnya unlock atau active
   /*End setting page stage grid*/

   /*Setting page quiz*/
      // this.hide_result_step_page = true; //variabel hide page result_step
    /*End setting page quiz*/
}