/* 解码参数
    var str = 'bbac';
    var sum = 0;
    for(var i = 0; i < str.length; i ++){
      sum = sum*10 + (str.charAt(i).charCodeAt() - 97);
    }
    console.log(sum);
*/


/*获取文件连接，文件属性参数*/
var fileStr = getUrlParms('fileStr');
var Mp3Time ;
var player ; 
//player = $('#ShareAudioBox')[0];


$.ajax({
   type: "GET",
   async :false,
   url: "http://119.28.7.115:8080/AreTalkFM/getChannelUrl.action",
   data: {fileStr:fileStr},
   success: function (data) {

        var ImgSrc = "http://119.28.7.115:8080"+data.imageUrl;
        var Mp3Src = "http://119.28.7.115:8080"+data.FmFilePendingUrl;
        $("#Mp3Img").attr("src",ImgSrc);

        $("title").html(data.fileTitle);
        $("#Mp3Name").html(data.fileTitle);
        
        $("#ShareAudio").attr("src",Mp3Src);
        Mp3Time = data.fileSize;

        var AudioDom = '<audio id="ShareAudioBox" controls><source  id="ShareAudio" src="'+Mp3Src+'"></audio>'
        $("#Mp3Box").append(AudioDom)

        player = $('#ShareAudioBox')[0]// document.getElementById('ShareAudioBox');

   },
   error: function (a,b,c) {
        
        }
   });




/*点击播放*/
/*倒计时,图片旋转*/

var timer =null;
var maxtime = Mp3Time; //按秒计算! 
//格式化时间，秒数 → 分：秒
var minutesText = Math.floor(maxtime / 60);
var secondsText = Math.floor(maxtime % 60);

minutesText = addPreZero(minutesText,2);//各位补0
secondsText = addPreZero(secondsText,2);//各位补0

msgText = minutesText +":"+secondsText;

$("#Mp3Time").text(msgText);


//旋转动画函数
var num = 0;
var zt = 0;
var flagzt = 0;
var flagks = 0;
var img = $("#Mp3Img")[0];

function change(){

  if (num>=1) {
    img.style.transform = "rotate("+num+"deg)";
    num = num + 1;
  }
}
//控制旋转开始
function kaishi(){
    if(flagks == 0){//从别的状态（页面开始或者暂停）而来
      if (num == 0 && flagzt == 0) {//flagzt等于0是从页面载入状态进入旋转
      num = 1;
    }else{
      num = zt;//把当前暂停时角度给num从num在开始旋转
      flagzt=0;//证明当前不是暂停状态了
    }
      flagks=num;
    }
}
//控制旋转暂停
function zanting(){

    if(flagzt!=0){//flagzt不等于0证明当前是暂停状态，再点击暂停还是设置当前状态
      img.style.transform = "rotate("+zt+"deg)";
    }else{
      zt = num;
      flagzt = num;
      num = 0;
      img.style.transform = "rotate("+zt+"deg)";
    }
      flagks=0;
}

setInterval('change()',25);



$("#Mp3ControlBtn").click(function(){


    if( $("#ControlBtn").hasClass('noPlay') ){
          player.play();console.log("play")
          kaishi();//开始旋转
          start();//开始的倒计时;
        $("#ControlBtn").attr("src","img/stop.png");
        $("#ControlBtn").removeClass('noPlay');
    }else{
          player.pause(); console.log("pause")
          zanting();//旋转暂停
          clearInterval(timer);
        $("#ControlBtn").attr("src","img/start.png");
        $("#ControlBtn").addClass('noPlay');
    }
    
    
});




      

function start(){
  console.info("开始计时")
	CountDown();//先调用一次，再开始计时，避免延迟一秒再计时
	timer = setInterval("CountDown()",1000); 
}


//倒计时
function CountDown() {
      if (maxtime > 0) {
          var minutes = Math.floor(maxtime / 60);
          var seconds = Math.floor(maxtime % 60);

          minutesPlay = addPreZero(minutes,2);
          secondsPlay = addPreZero(seconds,2);

          var msgPlay = minutesPlay +":"+secondsPlay;
          $("#Mp3Time").text(msgPlay);
              --maxtime;
      }else{
          clearInterval(timer);
          zanting();
          $("#ControlBtn").addClass('noPlay');
          
          $("#ControlBtn").attr("src","img/start.png");
          maxtime = Mp3Time;
          $("#Mp3Time").text(msgText);

          console.info("时间到，结束!");
      }
  }

//app下载
  $("#DownloadApp").click(function(){
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.aretalk";
  }); 


//个位补0
function addPreZero(num, n){
 return (Array(n).join(0) + num).slice(-n); 
}  
//获取地址栏参数
function getUrlParms(name){
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if(r!=null)
   return unescape(r[2]);
   return null;
}

