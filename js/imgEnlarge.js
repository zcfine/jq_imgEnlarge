/**
 * 2017-11-07
 * imgScale：控制缩放比例，默认为1
 * move：控制是否可以拖动，0为不可以（默认），1为可以
 * X1,Y1：鼠标x，y的位置
 */

(function($) {
	$.fn.imgEnlarge = function(options) {  
		this.append('<img class="imgEnlarge" src='+options+' >');
		
		var imgScale = 1;
		var move = 0;
        var X1,Y1;
        
        //点击图片,弹出
		$(".imgEnlarge").on( 'mouseup', function(event) {
			//判断鼠标左击
			if(event.button===0){
				var baseUrl = $(this).attr("src");
            	$(".img_mask").remove();
            	var infoImg =$( '<div class="img_mask">' +
            						'<div class="img_cont">' +
            							'<div id="img_info" class="img_info">' +
            								'<img src="' + baseUrl + '" />' +
            							'</div>' +
            							'<div class="img_off">' +
	            							'×' +
	            						'</div>' +
            						'</div>' +
            					'</div>').appendTo("body");
            	//监听滑动事件
            	if (document.addEventListener) {
            		document.getElementById("img_info").addEventListener('DOMMouseScroll',scrollFunc,false);
            	}
            	document.getElementById("img_info").onmousewheel = scrollFunc;
            	//判断图片尺寸。适应容器
            	var img = new Image();
            	img.src = baseUrl;
            	img.onload = function(){
            		if(img.height>500||img.width>800){
            			if((img.height/img.width)>(5/8)){
            				$(".img_info img").css({
            					"height":"100%",
            					"width":"auto"
            				});
            			}else{
            				$(".img_info img").css({
            					"height":"auto",
            					"width":"100%"
            				});
            			}
            		}
            	}
            	//关闭容器
            	$(".img_off").on("click",function(){
		        	$(".img_mask").remove();
		        	imgScale = 1;
		        });
		        mousemove();
				mousedown();
				mouseup();
				dragstart();
			}
			
        });
        
        //鼠标滚动事件
        var scrollFunc=function(e){
			var direct = 0;
			e = e || window.event;
			
			if(e.wheelDelta) { //IE/Opera/Chrome
				direction(e.wheelDelta);
			} else if(e.detail) { //Firefox
				direction(-e.detail);
			}
		}
        
        //滚动方向
        function direction(roll){
        	if(roll>0){
				//向上滚动
				imgScale+=0.2;
				var imgTransform = "translate(-50%,-50%) scale(" + imgScale + "," + imgScale + ")";
				$("#img_info img").css({
					"transform":imgTransform,
					"-moz-transform":imgTransform,
					"opacity":"1"
				});
			}else{
				//向下滚动
				if(imgScale>0.5){
					imgScale-=0.2;
					var imgTransform = "translate(-50%,-50%) scale(" + imgScale + "," + imgScale + ")";
					$("#img_info img").css({
						"transform":imgTransform,
						"-moz-transform":imgTransform,
						"opacity":"1"
					});
				}else{
					//alert("已经到最小了");
				}
			}
        }
 
        //鼠标移动事件
        function mousemove(){
        	$(".img_mask").on("mousemove",function(e){
        		e = window.event || e ;
        		if(move) {
            		var $img = $("#img_info img");
            		if(navigator.appName=='Netscape'){
            			var Tx=(e.pageX - X1);
	            		var Ty=(e.pageY - Y1);
            		}else{
            			var Tx=(window.event.x - X1);
	            		var Ty=(window.event.y - Y1);
            		}
	            	$(".img_info img").css({
						"top":Ty+"px",
						"left":Tx+'px'
					});
				}
        	});
        }
        
        //鼠标点击弹出图片时(未放开)
        function mousedown(){
        	$("#img_info img").on("mousedown",function(e){
        		e = window.event || e ;
        		if(navigator.appName=='Netscape'){
        			X1 = e.pageX-parseInt($(this).css('left'));
					Y1 = e.pageY-parseInt($(this).css('top'));
        		}else{
        			X1 = e.x-parseInt($(this).css('left'));
					Y1 = e.y-parseInt($(this).css('top'));
        		}
				move = 1;
//				console.log("111");
        	});
			
        }
        
        //鼠标点击弹出图片后(放开)
        function mouseup(){
        	$(".img_mask").on("mouseup",function(){
				move = 0;
        	});
        }
        
        //开始拖动元素或选择的文本时触发,为了关闭拖时引起的默认事件
        function dragstart() {
        	$("#img_info img").on("dragstart",function(e){
        		e = window.event || e;
        		if(window.event){
        			window.event.returnValue = false;
        		}else{
        			e.preventDefault();//for firefox
        		}
				
        	});
		}
	};   
}(jQuery));

//css样式表
$(document).ready(function(){
	$('<style>'
		+'*{padding: 0; margin: 0;}'
		+'ol, ul { list-style: none; }'
		+'.cl:after{ content: "."; display: block; height: 0; clear: both; visibility: hidden; }'
		+'.cl{ zoom: 1; }'
		+'.container {margin: 10px; border: 2px dashed #D2D7DD; }'
		+'.container ul li{ width: 120px; height: 120px; overflow: hidden; float: left;border: 1px solid #eee;margin: 5px;}'
		+'.container ul li img {width: 100%;}'
		+'.img_mask { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background-color: rgba(0, 0, 0, 0.8); z-index: 99; }'
		+'.img_cont { position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 800px; height: 500px; margin: auto; background-color: #EBF8FF; border-radius: 2px; }'
		+'.img_info { width: 100%; height: 100%; font-size: 0; overflow: hidden; }'
		+'.img_info img { position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%);        /* IE 9 */ -webkit-transform: translate(-50%, -50%);    /* Safari and Chrome */ -o-transform: translate(-50%, -50%);        /* Opera */ -moz-transform: translate(-50%, -50%); cursor:pointer; transition: -webkit-transform .3s ease-in-out ;transition: transform .3s ease-in-out ; }'
		+'.img_off { position: absolute; width: 18px; height: 18px; top: -22px; right: 0; color: #D2D7DD; font-size: 18px; line-height: 18px; cursor: pointer;}'
	+'</style>').appendTo('body');
});