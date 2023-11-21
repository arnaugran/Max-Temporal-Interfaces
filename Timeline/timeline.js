mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var width;
var height; 
var diameter = 20;
var isPlaying = false;
var isInterpolated = false;
var playMode = true;
var cursor = 0;
var max_length = 60000;
var default_mark = false;
var markersArr = [];

var color1 = [0.2,0.2,0.2,1]
var color2 = [1,0.5,0.5,1]

g = new Global("max_timeline");

var itemArr = [];
function Item() {
	this.object = "";
	this.elements = [];
}
function ItemElement(t,v,i){
    this.times = t;
	this.values = v;	
	this.interpolation = i;
	this.isSelected = false;
	this.isMarked = false;
}
function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }
function linearInterpolation(arr,point){
    var initialPoint
	if(arr.length<1)
		return -1
    for(var i = 0;i<arr.length;i++){
        if(arr[i].times>point){
            initialPoint = i
            break
        }
    }
    var returned_value
    if(!initialPoint && initialPoint!=0)
        return arr[arr.length-1].values
    if(!arr[initialPoint-1])
		return -1
    var p0 = arr[initialPoint-1]
    var p1 = arr[initialPoint]
	if(!p0.interpolation){
		return p0.values
	}
	if(!isNumber(p0.values) || !isNumber(p1.values)){
		return p0.values
	}
	var returned_value = (p0.values*(p1.times-point)+p1.values*(point-p0.times))/(p1.times-p0.times)
    return returned_value
}

// Draw Play Button
function play(){
	//background
	mgraphics.set_source_rgb(color2);
	mgraphics.ellipse((width/2)-(diameter/2),20-(diameter/2),diameter,diameter);
	mgraphics.fill();
	
	//Play Symbol
	mgraphics.set_source_rgba(color1);
	mgraphics.move_to((width/2)-3.5,12)
	mgraphics.line_to((width/2)-3.5,28)
	mgraphics.line_to((width/2)+5.5,20)
	mgraphics.line_to((width/2)-3.5,12)
	mgraphics.close_path()
	mgraphics.fill();
}

// Draw Pause Button
function pause(){
	//background
	mgraphics.set_source_rgb(color2);
	mgraphics.ellipse((width/2)-(diameter/2),20-(diameter/2),diameter,diameter);
	mgraphics.fill();
	//Pause symbol
	mgraphics.set_source_rgba(color1);
	mgraphics.rectangle((width/2)-4.5,15,3,10);
	mgraphics.fill();
	mgraphics.set_source_rgba(color1);
	mgraphics.rectangle((width/2)+1.5,15,3,10);
	mgraphics.fill();
}

//Formatted time
function fancyTimeFormat(duration) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;
  const decs = (duration - Math.floor(duration))*1000

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  ret = ret + "" + (hrs ? hrs : 0) + ":" + (mins < 10 ? "0" : "");
  
  ret = ret+ "" + mins + ":" + (secs < 10 ? "0" : "");
  ret = ret+"" + secs;

  var a = new Array()

  a[0]=ret
  a[1]=decs

  return a;
}

function paint()
{
	width = this.box.rect[2] - this.box.rect[0];
	height = this.box.rect[3] - this.box.rect[1];
	
	with (mgraphics) {
		
		// Background
		set_source_rgba(color1);
		rectangle(0, 0, width, height);
		fill();
		
		// Inlet drawing
		set_source_rgba(color2);
		ellipse(2,-7.5,15,15);
		fill();
		set_source_rgba(color1);
		ellipse(4.5,-5,10,10);
		fill();
		
		if(!isPlaying)
			play()
		else
			pause()
		
		if(playMode){
			set_source_rgba(color2);
			rectangle(15,40,width-30,height-55);
			stroke();		
			set_source_rgba(color2);
			rectangle(15,40,(cursor/max_length)*(width-30),height-55);
			fill();	
			for(var i = 0; i<itemArr.length;i++){
				for(var j = 0; j<itemArr[i].elements.length;j++){
					if((itemArr[i].elements[j].times>cursor))
						set_source_rgba(color2);
					else
						set_source_rgba(color1);
					if((itemArr[i].elements[j].times>0)){
						rectangle((itemArr[i].elements[j].times/max_length)*(width-30)+15,40,1,(height-55)/2);
						fill();	
					}
				}
			}	
		}else{
			set_source_rgba(color2);
			rectangle(15,40,width-30,height-55);
			stroke();
			if(itemArr.length>1){
				for(var i = 0; i<itemArr.length -1;i++){
					rectangle(15,40+46*(i+1),width-30,1);
					fill();
				}
			}
			for(var i = 0; i<itemArr.length;i++){
				select_font_face("Arial");
				set_font_size(10);
				set_source_rgb(color2);
				move_to(18,50+46*(i))
				text_path(itemArr[i].object);
				fill();
				for(var j = 0; j<itemArr[i].elements.length;j++){
					set_source_rgba(color2);
					ellipse(15+(itemArr[i].elements[j].times/30000)*(width-35)-(cursor/30000)*(width-35),63+46*(i),5,5);
					if(!itemArr[i].elements[j].isSelected){
						stroke();						
					}else{
						fill();
					}
					if(itemArr[i].elements[j].interpolation && itemArr[i].elements[j+1]){
						rectangle(25+(itemArr[i].elements[j].times/30000)*(width-35)-(cursor/30000)*(width-35),65+46*(i),(itemArr[i].elements[j+1].times/30000)*(width-35)-(itemArr[i].elements[j].times/30000)*(width-35)-20,1)
						fill();
						move_to((itemArr[i].elements[j+1].times/30000)*(width-35)-(cursor/30000)*(width-35)+5,63+46*(i))
						line_to((itemArr[i].elements[j+1].times/30000)*(width-35)-(cursor/30000)*(width-35)+5,69+46*(i))
						line_to((itemArr[i].elements[j+1].times/30000)*(width-35)-(cursor/30000)*(width-35)+11,66+46*(i))
						mgraphics.close_path()
						fill()
					}
					if(itemArr[i].elements[j].isMarked){
						set_source_rgba(0.8,0.8,0.8,1);
						ellipse(14.5+(itemArr[i].elements[j].times/30000)*(width-35)-(cursor/30000)*(width-35),62.5+46*(i),6,6);
						stroke();						
					}
				}
			}	
		}
		//Time Numbers
		select_font_face("Arial Black");
		set_font_size(16);
		set_source_rgb(color2);
		move_to(15,25)
		text_path(fancyTimeFormat(cursor*0.001)[0]);
		fill();
	
		select_font_face("Arial");
		set_font_size(12);
		set_source_rgb(color2);
		move_to(15+68,25)
		text_path(Math.floor(fancyTimeFormat(cursor*0.001)[1]).toString());
		fill();
		
		if(!isInterpolated){
			set_source_rgba(color2);
			rectangle(width-100,10,85,20);
			stroke();
			select_font_face("Arial");
			set_font_size(14);
			set_source_rgb(color2);
			move_to(width-82,25)
			text_path("INTERP");
			fill();
		}else{
			set_source_rgba(color2);
			rectangle(width-100,10,85,20);
			fill();
			select_font_face("Arial");
			set_font_size(14);
			set_source_rgb(color1);
			move_to(width-82,25)
			text_path("INTERP");
			fill();
		}
		set_source_rgba(color1);
		rectangle(0,40,15,height-40);
		fill();	
		rectangle(width-15,40,15,height-40);
		fill();	
	}
}
function set_cursor(c){
	cursor = c;
	if(itemArr.length>0){
		for(var i = 0;i<itemArr.length;i++){
			send_val = linearInterpolation(itemArr[i].elements,cursor)
			g.value = send_val;
 			g.sendnamed(itemArr[i].object,"value");
		}
	}
	if(cursor>max_length)
		set_max_length(cursor)
	mgraphics.redraw();
}
function edit_mode(){
	if(itemArr.length<1){
		error("There's no data stored \n")
		return
	}
	playMode = false;
	this.box.size(width,55+46*itemArr.length)
	mgraphics.redraw();
}
function set_interpolation(condition)
{
	isInterpolated = condition==0 ? false : true;
	mgraphics.redraw();
}

function play_mode(){
	playMode = true;
	this.box.size(width,80)
	mgraphics.redraw();
}

function set_max_length(length){
	max_length = length;
	//if(max_length<cursor)
		//set_cursor(max_length);
	mgraphics.redraw();
}

function closePatcher(patch,subpatch,subpatch2,inletToDelete)
{
	var closeb = patch.newdefault(this.box.rect[0],this.box.rect[1],"button")
	var closezl = patch.newdefault(this.box.rect[0],this.box.rect[1],"zl.reg", "close")
	var closepcontrol = patch.newdefault(this.box.rect[0],this.box.rect[1],"pcontrol")
	patch.connect(closeb,0,closezl,0)
	patch.connect(closezl,0,closepcontrol,0)
	patch.connect(closepcontrol,0,subpatch,0)
	closeb.message("bang")
	var args = new Array(4)
	args[0]=patch
	args[1]=closeb
	args[2]=closezl
	args[3]=closepcontrol
	args[4]=subpatch2
	args[5]=inletToDelete
	var tsk2 = new Task(mytask, this,args);
	tsk2.schedule(10)
}

function mytask(args){
	args[0].remove(args[1])
	args[0].remove(args[2])
	args[0].remove(args[3])
	args[4].remove(args[5])
}

t = new Task(cursorRun,this)

function cursorRun(){
	
	if(cursor>=max_length){
		t.cancel()
		isPlaying=false
		return
	}
	set_cursor(cursor + 10);
}

var allowDrag = false;
var allowMove = false;
var init_curs;
var init_x;
function onclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	allowDrag = false;
	allowMove = false;
	if(y>(20-(diameter/2))&&y<(20+(diameter/2))&&x>((width/2)-(diameter/2))&&x<((width/2)+(diameter/2)))
	{
		if(!isPlaying){
			isPlaying=true
			t.interval = 10; // every 10 miliseconds
			t.repeat();
			mgraphics.redraw();
		}
		else{
			isPlaying=false
			t.cancel()
			mgraphics.redraw();
		}
	}else if(x>15&&x<width-15&&y>40&&y<height-15&&playMode){
		set_cursor(Math.max(Math.min(((x-7.5)*125*(max_length/60000)),max_length),0));
		allowDrag = true;
	}else if(y>10&&y<30&&x>width-100&&x<width-15){
		isInterpolated = isInterpolated ? false : true;
		for(var i=0;i<itemArr.length;i++){
			for(var j=0;j<itemArr[i].elements.length;j++){
				if(itemArr[i].elements[j].isSelected){
					itemArr[i].elements[j].interpolation = isInterpolated
					createMess(i,j);
				}
			}
		}
		mgraphics.redraw();
	}else if(!playMode&&y>40&&y<height-15&&x>15&&x<width-15){
		if(max.cmdkeydown){
						init_curs = cursor;
						init_x = x;
						allowMove = true;
		}
		for(var i=0;i<itemArr.length;i++){
			for(var j=0;j<itemArr[i].elements.length;j++){
				var x_min = 12.5+(itemArr[i].elements[j].times/30000)*(width-35)-(cursor/30000)*(width-35)
				var x_max = x_min+10
				var y_min = 61.5+46*(i)
				var y_max =y_min+10
				if(x>x_min&&x<x_max&&y>y_min&&y<y_max){
					if(max.ctrlkeydown){
						var this_time = markersArr.indexOf(itemArr[i].elements[j].times)
						if(this_time)
							markersArr.splice(this_time,1)
						itemArr[i].elements.splice(j,1);
						if(itemArr[i].elements.length==0){
							itemArr.splice(i,1);
							this.box.size(width,height-46)
							if(itemArr.length==0)
								play_mode();
							mgraphics.redraw();
							break
						}
					}else if(max.shiftkeydown){
						itemArr[i].elements[j].isMarked = itemArr[i].elements[j].isMarked ? false : true;
						if(itemArr[i].elements[j].isMarked){
							markersArr.push(itemArr[i].elements[j].times)
							markersArr.sort(
								function(a, b) {
       								return a - b
    							}
							)
						}
						else{
							var this_time = markersArr.indexOf(itemArr[i].elements[j].times)
							if(this_time)
								markersArr.splice(this_time,1)
						}		
					}
					else{
						isInterpolated = itemArr[i].elements[j].interpolation
						itemArr[i].elements[j].isSelected = true
						createMess(i,j);
					}
				}
				else
					itemArr[i].elements[j].isSelected = false
			}
		}
		mgraphics.redraw();
	}
}
function createMess(index1, index2){
	var editMsg = this.patcher.getnamed("editData")
	if(!editMsg){
		editMsg = this.patcher.newdefault(this.box.rect[2] + 20, this.box.rect[1]+40,"message");
		editMsg.varname = "editData";
		this.patcher.hiddenconnect(editMsg,0,this.box,0);
	}
	editMsg.message("set","edit")	
	editMsg.message("append","n_sendObject");
	editMsg.message("append",index1);
	editMsg.message("append","n_element");
	editMsg.message("append",index2);
	editMsg.message("append","time_position");
	editMsg.message("append",itemArr[index1].elements[index2].times);
	editMsg.message("append","interpolation");
	editMsg.message("append",itemArr[index1].elements[index2].interpolation);
	editMsg.message("append","is_marker");
	editMsg.message("append",itemArr[index1].elements[index2].isMarked);
	editMsg.message("append","data");
	editMsg.message("append",itemArr[index1].elements[index2].values);
	var rectangle = new Array();
	rectangle[0] = editMsg.rect[0];
	rectangle[1] = editMsg.rect[1];
	rectangle[2] = editMsg.rect[0]+200;
	rectangle[3] = editMsg.rect[1];
	editMsg.rect = rectangle;
	
}
function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
	if(allowDrag)
	{
		set_cursor(Math.max(Math.min(((x-7.5)*125*(max_length/60000)),max_length),0));
	}
	else if(allowMove){
		set_cursor(Math.max(Math.min(init_curs+((init_x-x)*30*(max_length/60000)),max_length),0));
	}
}	

function init()
{
	this.box.size(500,80)
}
function edit()
{
	var string = arrayfromargs(messagename,arguments)
	string.shift();
	var sendObj = string.shift();
	if(sendObj!="n_sendObject"){
		error("edit message with incorrect format \n");
		return
	}
	var index1 = string.shift();
	var sendElement = string.shift();
	if(sendElement!="n_element"){
		error("edit message with incorrect format \n");
		return
	}
	var index2 = string.shift();
	var a = string.shift();
	if(a!="time_position"){
		error("edit message with incorrect format \n");
		return
	}
	var this_time = string.shift();
	if(this_time>max_length)
		set_max_length(this_time)
	var a = string.shift();
	if(a!="interpolation"){
		error("edit message with incorrect format \n");
		return
	}
	var this_interpolation = string.shift();
	var a = string.shift();
	if(a!="is_marker"){
		error("edit message with incorrect format \n");
		return
	}
	var this_marker = string.shift();
	var a = string.shift();
	if(a!="data"){
		error("edit message with incorrect format \n");
		return
	}
	var this_values = string;
	itemArr[index1].elements[index2].times = this_time;
	itemArr[index1].elements[index2].interpolation = this_interpolation;
	itemArr[index1].elements[index2].values = this_values;
	itemArr[index1].elements[index2].isSelected = false;
	itemArr[index1].elements[index2].isMarked = this_marker;
	if(itemArr[index1].elements[index2].isMarked){
		markersArr.push(itemArr[index1].elements[index2].times)
		markersArr.sort(
			function(a, b) {
       			return a - b
    		}
		)
	}
	else{
		var this_time = markersArr.indexOf(itemArr[index1].elements[index2].times)
		if(this_time)
			markersArr.splice(this_time,1)
	}
	itemArr[index1].elements.sort(
		function(a, b) {
       		return a.times - b.times
    	}
	)
	var editMsg = this.patcher.getnamed("editData")
	this.patcher.remove(editMsg);
	mgraphics.redraw();
}
function writeData(){
	var savePatch = this.patcher.getnamed("savedData")
	if(!savePatch){
		savePatch = this.patcher.newdefault(this.box.rect[2] + 20, this.box.rect[1],"p","DO NOT DELETE");
		savePatch.varname = "savedData";
		var toremovein = savePatch.subpatcher().newdefault(20,20,"inlet");
		var this_outlet = savePatch.subpatcher().newdefault(300,20,"outlet");
		var loadbang = savePatch.subpatcher().newdefault(20,20,"loadbang");
		var del = savePatch.subpatcher().newdefault(20,70,"del",50);
		var messageBox = savePatch.subpatcher().newdefault(20,120,"message");
		savePatch.subpatcher().connect(loadbang,0,del,0);
		savePatch.subpatcher().connect(del,0,messageBox,0);
		savePatch.subpatcher().connect(messageBox,0,this_outlet,0);
		messageBox.varname = "dataMsg";
		closePatcher(this.patcher,savePatch,savePatch.subpatcher(),toremovein)
		this.patcher.hiddenconnect(savePatch,0,this.box,0);
	}
	var dataMsg = savePatch.subpatcher().getnamed("dataMsg")
	
	if(itemArr.length < 1)
		return;
	dataMsg.message("set","clear")	
	dataMsg.message("append",",");
	dataMsg.message("append","load")
	dataMsg.message("append",itemArr[0].object)
	for(var j=0;j<itemArr[0].elements.length;j++){
		dataMsg.message("append",itemArr[0].elements[j].times)
		dataMsg.message("append",itemArr[0].elements[j].values)
		dataMsg.message("append","!");
		dataMsg.message("append",itemArr[0].elements[j].interpolation)
		dataMsg.message("append",itemArr[0].elements[j].isMarked)
	}
	dataMsg.message("append",",");
	
	if(itemArr.length < 2)
		return;
		
	for(var i=1;i<itemArr.length;i++){
		dataMsg.message("append","load")
		dataMsg.message("append",itemArr[i].object)
		for(var j=0;j<itemArr[i].elements.length;j++){
			dataMsg.message("append",itemArr[i].elements[j].times)
			dataMsg.message("append",itemArr[i].elements[j].values)
			dataMsg.message("append","!");
			dataMsg.message("append",itemArr[i].elements[j].interpolation)
			dataMsg.message("append",itemArr[i].elements[j].isMarked)
		}
		dataMsg.message("append",",");
	}	
}

dataTask = new Task(writeData,this)

function save()
{
	dataTask.schedule(100);
}

function default_markers(cond)
{
	default_mark = cond;
}


function anything(){
	var value = arrayfromargs(messagename,arguments)
	var sendName = value.shift();
	var selector = -1;
	for(var i = 0; i< itemArr.length;i++){
		if(itemArr[i].object == sendName)
			selector = i;
	}
	if(selector == -1){
			this_item = new Item();
			this_item.object = sendName;
            this_item.elements.push(new ItemElement(cursor,value,isInterpolated));
			this_item.isMarked  = default_mark;
			if(this_item.isMarked){
				markersArr.push(this_element.times);
				markersArr.sort(
					function(a, b) {
       					return a - b
    				}
				)
			}
			itemArr.push(this_item);
	}else{
		for(var i = 0; i< itemArr[selector].elements.length;i++){
			if(itemArr[selector].elements[i].times == cursor){
				itemArr[selector].elements.splice(i, 1);
			}
		}
		this_item = new ItemElement(cursor,value,isInterpolated)
		this_item.isMarked  = default_mark;
		if(this_item.isMarked){
			markersArr.push(this_element.times);
			markersArr.sort(
				function(a, b) {
       				return a - b
    			}
			)
		}
        itemArr[selector].elements.push(this_item);
		itemArr[selector].elements.sort(
			function(a, b) {
       			return a.times - b.times
    		}
		)
	}
	if(!playMode){
		edit_mode();
	}
	mgraphics.redraw();
}

function clear(){
	itemArr = [];
}

function next_event(){
	for(var i = 0; i < markersArr.length; i++){
		if(markersArr[i] > cursor){
			set_cursor(markersArr[i])
			break
		}
	}
}

function prev_event(){
	for(var i = 0; i < markersArr.length; i++){
		if(markersArr[markersArr.length-i-1] < cursor){
			set_cursor(markersArr[markersArr.length-i-1])
			break
		}
	}
}

function msg_int(i){
	if(i<markersArr.length&&i>=0)
		set_cursor(markersArr[i])
}

function load(){
	var string = arrayfromargs(messagename,arguments)
	string.shift();
	var sendName = string.shift();
	var this_item = new Item();
	this_item.object = sendName;
	
	while(string.length>0){
		var times = string.shift();
		if(times>max_length)
			set_max_length(times)
		var valueArr = []
		var element = string.shift();
		while(element!="!"){
			valueArr.push(element);
			element = string.shift();
		}
		var values = valueArr
		var interpolation = string.shift();
        var this_element = new ItemElement(times,values,interpolation);
		this_element.isMarked = string.shift();
		if(this_element.isMarked)
			markersArr.push(this_element.times);
		markersArr.sort(
			function(a, b) {
       			return a - b
    		}
		)
		this_item.elements.push(this_element);
	}
	itemArr.push(this_item);
	mgraphics.redraw();	
}

init()
mgraphics.redraw();
