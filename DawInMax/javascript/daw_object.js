/*

Arnau Gran i Romero : Daw in Max

*/

//Mgraphics initialisation
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0 ;

// Global Variables declarations

var hZoom = 60
var hScroll = 0
var offset = 120
var counterScroll = 0
var cursor = 0

var backgroundColor = [0.8,0.8,0.8,1]
var color2 = [0.3,0.3,0.3,1]
var color3 = [1,0.5,0.5]
var width
var height
var isPlaying = false
var diameter = 20
var spacing = 40
var cursorY = 0
var initloopvalue = 0
var trackCount=0
var arraySoundFiles = new Array()

// Sound items definition

function Item(index,length,filename) {
  this.index = index;
  this.track = index
  this.pos = 0
  this.length = length
  this.filename = filename
  this.end = this.pos + this.length
  this.split = 1	
  this.splitOrder = 0	
  this.collisions=0
  this.volume=1
}

var mainBox
var commentBox
var thisPatch
function includes(str, char){
	var cond = false
	for(var j=0;j<str.length;j++){
		if(str[j]==char)
		{
			cond=true
		}
	}
	return cond
}	
function setTrackVarName(obj)
{	
	if(obj.selected){
		thisPatch = obj.patcher
		if(obj.getvalueof()){
			mainBox = obj
		}else{
			commentBox = obj
		}
			
	}
		//post("value: " + obj.getvalueof() + "\n-\n");
}

function objByName(named,obj) {
  this.named = named;
  this.obj = obj
}

// Track all the elements to be automated
automationCoordsArr =[]
objectsNameArr =[]
//var automatedArr = []
var automatedStrings = []
var autom_counter = 0
function getElementAutomate(obj){
	var scriptName = obj.varname
	var cond_autom = scriptName.slice(0,14)==("daw_automated_")
	if(cond_autom){
		var segment_string = scriptName.slice(14)
		automatedStrings[autom_counter] =(segment_string)
		objectsNameArr[autom_counter]= new objByName(segment_string,obj)
		autom_counter = autom_counter + 1
		if(!automationCoordsArr[segment_string]){
			automationCoordsArr[segment_string]=[]
			automationCoordsArr[segment_string].push(new coords(0,1))
		}
	}	
}

var previousValue
function applyToAll(){
	//automatedArr = []
	automatedStrings = []
	autom_counter = 0
	this.patcher.applydeep(getElementAutomate)
	if(automatedStrings.length!=previousValue)
	{
		mgraphics.redraw()
	}
	previousValue = automatedStrings.length
	//post(automatedArr.length)
}

var automTask = new Task(applyToAll,this)
automTask.interval = 50; // every milisecond
automTask.repeat();

function coords(x,y) {
  this.x = x;
  this.y = y
}




function drawAutomations(){
	for(var i = 0; i<automatedStrings.length;i++){
	
		this_colour =  [0.2,0.2,0.2,0.5];
		mgraphics.set_source_rgba(this_colour);
		mgraphics.rectangle(offset,cursorY+63+50*trackCount +50*i,width-offset,48);
		mgraphics.fill();
		mgraphics.set_source_rgba(0.3,0.3,0.3,1);
		mgraphics.rectangle(offset,cursorY+61+50*(trackCount),this.box.rect[2],2);
		mgraphics.fill();
		mgraphics.set_source_rgb(color3);
		mgraphics.rectangle(offset,cursorY+61+50*(trackCount+1)+50*i,this.box.rect[2],2);
		mgraphics.fill();


	
		
		var this_coords_arr
			this_coords_arr = automationCoordsArr[automatedStrings[i]]
			this_coords_arr.sort(
    			function(a, b) {
       				return a.x - b.x
    			}
			);

		if(this_coords_arr){
		for(var j=0;j<this_coords_arr.length;j++) {
			mgraphics.set_source_rgba(color2);
			//post(this_coords_arr[j].x)
			var point_max = i==0 ?45:50
			var point_min = i==0 ?2:6
			var pos_x_point = (Math.max(this_coords_arr[j].x,40)*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
			var pos_y_point = Math.min(Math.max(this_coords_arr[j].y*50,point_min),point_max) + cursorY+61+50*(trackCount)+46*i
			mgraphics.ellipse(pos_x_point-1,pos_y_point-1,7,7)
			mgraphics.fill();
			
			mgraphics.set_source_rgba(0.9,0.5,0.5,1);
			pos_x_point = (Math.max(this_coords_arr[j].x,40)*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
			pos_y_point =  Math.min(Math.max(this_coords_arr[j].y*50,point_min),point_max) + cursorY+61+50*(trackCount)+46*i
			mgraphics.ellipse(pos_x_point,pos_y_point,5,5)
			mgraphics.fill();
			
			
			mgraphics.set_source_rgba(0.8,0.5,0.5,1);
			mgraphics.move_to(pos_x_point+2.5,pos_y_point+2.5)
			if(this_coords_arr[j+1]){
				pos_x_point = (Math.max(this_coords_arr[j+1].x,40)*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				pos_y_point =  Math.min(Math.max(this_coords_arr[j+1].y*50,point_min),point_max)  + cursorY+61+50*(trackCount)+46*i
				mgraphics.set_line_width(1.1);
				mgraphics.line_to(pos_x_point+2.5,pos_y_point+2.5)	
				mgraphics.stroke();
			}
		}
		}
		
		var this_colour =  [0.2,0.2,0.2,1];
		mgraphics.set_source_rgba(this_colour);
		mgraphics.rectangle(3,cursorY+60+3+50*trackCount +50*i,offset-5,50-3+1);
		mgraphics.fill();
		
		var this_colour = [0.8,0.8,0.8,1];
		mgraphics.select_font_face("Arial");
		mgraphics.set_font_size(12);
		mgraphics.set_source_rgba(this_colour);
		mgraphics.move_to(10,cursorY+80+50*trackCount + 50*i)
		mgraphics.text_path("Autom_" +automatedStrings[i].split("_")[0]);
		mgraphics.fill();
		
		mgraphics.set_source_rgb(color3);
		mgraphics.rectangle(0,cursorY+61+50*(trackCount+1)+50*i,offset,2);
		mgraphics.fill();
		
		mgraphics.rectangle(offset-2,cursorY+61+50*(trackCount)+50*i,2,50);
		mgraphics.fill();
	}
}
var hiddenAutom = false
function hide_automations(){
	if(max.shiftkeydown){
		hiddenAutom = hiddenAutom ? false : true
		mgraphics.redraw()
	}else{
	
		thisPatch = null
		mainBox = null
		commentBox = null
		this.patcher.applydeep(setTrackVarName)
		
		if(mainBox &&commentBox){
		
		var atoi = thisPatch.newdefault(commentBox.rect[0],commentBox.rect[1]+50,"atoi")
		var multislider = thisPatch.newdefault(commentBox.rect[0],commentBox.rect[1]+100,"multislider","@setminmax",0,200)
		
		thisPatch.connect(commentBox,0,atoi,0)
		thisPatch.connect(atoi,0,multislider,0)
		commentBox.message("bang")
		
		var characters = multislider.getvalueof()
		
		var varnameTrack = new Array()
		var minTrack= new Array()
		var maxTrack= new Array()
		var counter = 0
		
		for(var i =0;i<characters.length;i++){
			if(characters[i]==32){
				counter=counter + 1
				continue
			}
			if(counter==0)
				varnameTrack.push(String.fromCharCode(characters[i]))
			if(counter==1)
				minTrack.push(String.fromCharCode(characters[i]))
			if(counter==2)
				maxTrack.push(String.fromCharCode(characters[i]))
		
		}
		
		varnameTrack = varnameTrack.toString()
		minTrack = minTrack.toString()
		maxTrack = maxTrack.toString()
		
		while(includes(varnameTrack,",")){
				varnameTrack = varnameTrack.replace(",","")
		}
		while(includes(minTrack,",")){
				minTrack = minTrack.replace(",","")
		}
		while(includes(maxTrack,",")){
				maxTrack = maxTrack.replace(",","")
		}
		var varnameString = "daw_automated_"+varnameTrack+"_"+minTrack+"_"+maxTrack
		mainBox.varname = varnameString
		thisPatch.remove(commentBox)
		thisPatch.remove(atoi)
		thisPatch.remove(multislider)
	}
	}
}

// Function to be executed when the daw is deleted (clean secundary objects)

function notifydeleted() {
	this.patcher.remove(dropfiles)
	this.patcher.remove(processFiles)
	var soundPatch = this.patcher.getnamed("DAWSoundManager")
	var mcLive = this.patcher.getnamed("DAW_Master")
	if(soundPatch)
		this.patcher.remove(soundPatch)
	if(mcLive)
		this.patcher.remove(mcLive)
		
	if(FxTracks)
		this.patcher.remove(FxTracks)
}

// Draw Play Button
function play(){
	//background
	mgraphics.set_source_rgb(color3);
	mgraphics.ellipse((width/2)-(diameter/2),20-(diameter/2),diameter,diameter);
	mgraphics.fill();
	
	//Play Symbol
	mgraphics.set_source_rgba(color2);
	mgraphics.move_to((width/2)-3.5,12)
	mgraphics.line_to((width/2)-3.5,28)
	mgraphics.line_to((width/2)+5.5,20)
	mgraphics.line_to((width/2)-3.5,12)
	mgraphics.close_path()
	mgraphics.fill();
}

// Draw go Backwards Button

function back(){
	//background
	mgraphics.set_source_rgb(0.8,0.4,0.4);
	mgraphics.ellipse((width/2)-30-(diameter/2),20-(diameter/2),diameter,diameter);
	mgraphics.fill();
	
	//Back Symbol
	mgraphics.set_source_rgba(color2);
	mgraphics.move_to((width/2)-30+3.5,12)
	mgraphics.line_to((width/2)-30+3.5,28)
	mgraphics.line_to((width/2)-30-5.5,20)
	mgraphics.line_to((width/2)-30+3.5,12)
	mgraphics.close_path()
	mgraphics.fill();
	
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle((width/2)-36.5,14,2,12);
	mgraphics.fill();
}

// Draw go Forwards Button

function forwards(){
	//background
	mgraphics.set_source_rgb(0.8,0.4,0.4);
	mgraphics.ellipse((width/2)+30-(diameter/2),20-(diameter/2),diameter,diameter);
	mgraphics.fill();
	
	//Play Symbol
	mgraphics.set_source_rgba(color2);
	mgraphics.move_to((width/2)-3.5+29,12)
	mgraphics.line_to((width/2)-3.5+29,28)
	mgraphics.line_to((width/2)+5.5+29,20)
	mgraphics.line_to((width/2)-3.5+29,12)
	mgraphics.close_path()
	mgraphics.fill();
	
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle((width/2)+33.5,14,2,12);
	mgraphics.fill();	
}

// Draw Pause Button

function pause(){
	//background
	mgraphics.set_source_rgb(color3);
	mgraphics.ellipse((width/2)-(diameter/2),20-(diameter/2),diameter,diameter);
	mgraphics.fill();
	//Pause symbol
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle((width/2)-4.5,15,3,10);
	mgraphics.fill();
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle((width/2)+1.5,15,3,10);
	mgraphics.fill();
}

// Draw the Grid (Main)

function timecode(){
	mgraphics.set_source_rgba(0.6,0.6,0.6,1);
	mgraphics.rectangle(offset,40,this.box.rect[2],20);
	mgraphics.fill();
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle(offset,60,this.box.rect[2],2);
	mgraphics.fill();
	var show_small = false
	if (spacing>= 40)
		show_small=true
	for(var i=0; i<(width/spacing);i++){
		this_space = (i*spacing) + offset - Math.max(hScroll,0) +counterScroll*spacing
		mgraphics.set_source_rgba(color2);
		mgraphics.rectangle(this_space,40,1.8,20);
		mgraphics.fill();
		
		if(show_small){
			var subdivisions = Math.floor(spacing/10)
			for(var j=0; j<subdivisions;j++){
				mgraphics.set_source_rgba(color2);
				mgraphics.rectangle(this_space+((spacing*j)/subdivisions),40,1.2,5);
				mgraphics.fill();
			}
		}
		
	}
}

// Draw the Grid (Background)

function timecode2(){

	var show_small = false
	if (spacing>= 40)
		show_small=true
	for(var i=0; i<(width/spacing);i++){
		this_space = (i*spacing) + offset - Math.max(hScroll,0) +counterScroll*spacing
		
		//post(this_space)	
		mgraphics.set_source_rgba(0.3,0.3,0.3,0.1);
		mgraphics.rectangle(this_space,40,1.8,this.box.rect[3]-40);
		mgraphics.fill();
		if(show_small){
			
			var subdivisions = Math.floor(spacing/10)
			for(var j=0; j<subdivisions;j++){
				mgraphics.set_source_rgba(0.3,0.3,0.3,0.1);
				mgraphics.rectangle(this_space+((spacing*j)/subdivisions),40,1.2,this.box.rect[3]-40);
				mgraphics.fill();
			}
		}
		
	}
}

// Paint function (Refresh the displayed content)

function paint(){
	width = this.box.rect[2]-this.box.rect[0]
	height = this.box.rect[3]-this.box.rect[1]
	
	// SET BACKGROUND
	mgraphics.set_source_rgba(backgroundColor);
	mgraphics.rectangle(0,0,this.box.rect[2],this.box.rect[3]);
	mgraphics.fill();
	
	//Timecode_background
	timecode2()
	
	//Sound Items
	if(arraySoundFiles){
		for(var i=0;i<arraySoundFiles.length;i++){
			newItem(arraySoundFiles[i])
		}
	}

	//Cursor
	
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle(Math.max(cursor,0)+offset- Math.max(hScroll,0),40,2,height-40);
	mgraphics.fill();
	
	
	//Tracks
	mgraphics.set_source_rgb(color3);
	mgraphics.rectangle(0,40,offset,this.box.rect[3]-40);
	mgraphics.fill();
	mgraphics.set_source_rgb(color2);
	mgraphics.rectangle(3,42,offset-5,height-45);
	mgraphics.fill();
	
	//Update the matrix for sound routing according to its track
	updateTrack()
	
	
	//Upadte mute and solo state and draw the tracks
	if(trackCount){
		for(var i=0;i<trackCount;i++){
			muteArrToggles[i].message("int",((mutebuttonArr[i]-1)*-1))
			volSlidersFloat[i].message("float",((volSliderArr[i]/95)==0)?0:(Math.pow(10,(((volSliderArr[i]*45/95)-25)/20))/10))
			newTrack(i)
		}
	}
	if(hiddenAutom)
		drawAutomations()
	
	//Timecode Main
	timecode()
	
	// Set Header
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle(0,0,this.box.rect[2],40);
	mgraphics.fill();
	
	//My Daw text
	mgraphics.select_font_face("Arial Black");
	mgraphics.set_font_size(10);
	mgraphics.set_source_rgb(color3);
	mgraphics.move_to(20,23)
	mgraphics.text_path("My DAW");
	mgraphics.fill();
	
	// Play Pause button state
	if(!isPlaying)
		play()
	else
		pause()
	
	//Draw back and forwards buttons
	back()
	forwards()

	//Horizontal Zoom
	mgraphics.set_source_rgba(0.5,0.5,0.5,1);
	mgraphics.rectangle(width-130,10,120,20);
	mgraphics.fill();
	
	mgraphics.set_source_rgb(color3);
	mgraphics.rectangle(width-130,10,hZoom,20);
	mgraphics.fill();
	
	//Time Numbers
	
	mgraphics.select_font_face("Arial Black");
	mgraphics.set_font_size(16);
	mgraphics.set_source_rgb(color3);
	mgraphics.move_to(offset,25)
	mgraphics.text_path(fancyTimeFormat(Math.max(cursor,0)/spacing)[0]);
	mgraphics.fill();
	
	mgraphics.select_font_face("Arial");
	mgraphics.set_font_size(12);
	mgraphics.set_source_rgb(color3);
	mgraphics.move_to(offset+68,25)
	mgraphics.text_path(Math.floor(fancyTimeFormat(Math.max(cursor,0)/spacing)[1]).toString());
	mgraphics.fill();
	
	// Front drawing to hide overflow
	mgraphics.set_source_rgb(color3);
	mgraphics.rectangle(0,60,offset,2);
	mgraphics.fill();
	
	mgraphics.rectangle(0,40,offset,2);
	mgraphics.fill();
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle(3,42,offset-5,18);
	mgraphics.fill();
	
	mgraphics.set_source_rgba(color2);
	mgraphics.set_line_width(2)
	mgraphics.move_to(offset+1,40)
	mgraphics.line_to(offset+1,height)
	mgraphics.stroke()
	
	mgraphics.set_source_rgb(color3);
	mgraphics.set_line_width(2)
	mgraphics.move_to(offset-1,40)
	mgraphics.line_to(offset-1,60)
	mgraphics.stroke()
	mgraphics.set_source_rgb(color3);
	mgraphics.set_line_width(2)
	mgraphics.move_to(0,40)
	mgraphics.line_to(0,60)
	mgraphics.stroke()
	
	if(show_coords_edit)
		show_coords()

}

function show_coords(){
	mgraphics.select_font_face("Arial");
	mgraphics.set_font_size(12);
	var point_col = ((trackCount+automatedStrings.length+0)*50+60)<height ? [0.3,0.3,0.3] : [0.8,0.8,0.8]
	mgraphics.set_source_rgb(point_col)
	mgraphics.move_to(width-105,height-9)
	mgraphics.text_path("x : " + drawCoordsX+ " y : " +drawCoordsY.toFixed(2));
	mgraphics.fill();
}

// Declaration of global variables that hold state for mouse interactions
var allowHZoom = false
var show_coords_edit = false
var allowHScroll = false
var cursorMove = false
var allowVScroll = false
var allowItemMove = false
var allowSliderMove = false
var allowVolumeMove = false
var allowPointsMove = false
var snapMove = false
var sliderSel = 0
var volumeSel = 0
var initialvolume
var init_x
var init_y
var init_scroll
var init_cursor
var init_cursorY
var init_space
var soundPosArr = []
function posAndIndex() {
  this.index = 0;
  this.pos = 0
}

var itemToggle = true
var x_coord = new Array()
var y_coord = new Array()

// Function for matrix updating

function updateTrack(){
	for(var i=0;i<arraySoundFiles.length;i++)
	{
		matrixctrl.message("list",arraySoundFiles[i].index-1,arraySoundFiles[i].track-1,1)
	}
}
// receive the cursor position on daw_tl
 g = new Global("daw");

function coords2(x,y,n) {
  this.x = x;
  this.y = y
  this.n = n
}

// Function for moving the cursor
var increaseValueonIteration = 0
function cursorRun(){
	cursor= Math.max(cursor,0)+40*0.01*spacing/40
	mgraphics.redraw();
	if((cursor-hScroll)>(width-offset)){
	 	hScroll = hScroll+(width-offset)
		counterScroll = Math.floor(hScroll/spacing)
	}
	//trigger soundfiles
	var checkPos = (cursor*1000/spacing)
	g.tl = checkPos;
 	g.sendnamed("daw_tl","tl");

	for(var i =0;i<automatedStrings.length;i++){
		var sString = automatedStrings[i].split("_")
		var valueString = sString[1]*1.+(-1*linearInterpolation(automationCoordsArr[automatedStrings[i]],checkPos)+1)*(sString[2]-sString[1])
		stringCheck = automatedStrings[i]
		var returnedObject
		for(var j=0;j<objectsNameArr.length;j++){
			if(objectsNameArr[j].named == stringCheck)
				returnedObject = objectsNameArr[j].obj
		}
		returnedObject.setvalueof(valueString)
	}
	if(soundPosArr[increaseValueonIteration]){
		if(soundPosArr[increaseValueonIteration].pos <= checkPos)
		{
			var thisPlayer = playerArr[soundPosArr[increaseValueonIteration].index-1]
			thisPlayer.message("start",0)
			increaseValueonIteration=increaseValueonIteration+1
		}
	}
	var arrFunction = []
	var soundPatch = this.patcher.getnamed("DAWSoundManager")
	
	for(var i =0;i<arraySoundFiles.length;i++){
		var thissubpatch = soundPatch.subpatcher().getnamed("buffer_a"+i)
		var funcObj = thissubpatch.subpatcher().getnamed("functionObject")
		var vArr = funcObj.getvalueof()
		var this_is_active=true
		var this_is_active2 = false
		var nFunc
		arrFunction = []
		var counterFunc
		var gate1 = false
		for(var j = 0;j<vArr.length;j++){
			if(vArr[j]=="linear")
				continue
			if(vArr[j]=="data"){	
				gate1 = true
				continue
			}
			if(gate1){
				nFunc = vArr[j]
				gate1 = false
				counterFunc = 0
				continue
			}
			counterFunc = counterFunc+1
			if(counterFunc<5){
				continue
			}	
			if(this_is_active&&!this_is_active2){
				arrFunction.push(new coords2(vArr[j],vArr[j+1],nFunc))
				this_is_active=false
				this_is_active2 = true
			}else if(this_is_active2){
				this_is_active2=false
			}else
				this_is_active=true
		}
		var sendPitchto = soundPatch.subpatcher().getnamed("thispitchshift_"+i)
		if(sendPitchto&&checkPos>=arraySoundFiles[i].pos&&checkPos<=arraySoundFiles[i].end){
			var funcVal = linearFuncInterpolation(arrFunction,checkPos-arraySoundFiles[i].pos,1)
			var funcVal2 = (funcVal<=0.5) ? (funcVal+0.5) : (((funcVal-0.5)*2)+1)
			sendPitchto.setvalueof(funcVal2)
		}
		var sendLowpassto = soundPatch.subpatcher().getnamed("thislowpass_"+i)
		if(sendLowpassto&&checkPos>=arraySoundFiles[i].pos&&checkPos<=arraySoundFiles[i].end){
			var funcVal = linearFuncInterpolation(arrFunction,checkPos-arraySoundFiles[i].pos,2)
			var funcVal2 = funcVal*2000
			sendLowpassto.setvalueof(funcVal2)
		}
	}
}
// function pour interpoler entre deux valeus x d'un array de coords
function linearInterpolation(arr,point){
    var initialPoint
    for(var i = 0;i<arr.length;i++){
        if(arr[i].x>point){
            initialPoint = i
            break
        }
    }
    var returned_value
    if(!initialPoint && initialPoint!=0)
        return arr[arr.length-1].y
    
    var p0 = arr[initialPoint-1]
    var p1 = arr[initialPoint]
    return returned_value = (p0.y*(p1.x-point)+p1.y*(point-p0.x))/(p1.x-p0.x)
}

// task that updates the cursor

t = new Task(cursorRun,this)

// function to be called with message daw_play

function daw_play(startPoint){
	if(!isPlaying){
			if(!startPoint)
				startPoint = 0
			cursor = startPoint*spacing/1000
			while((cursor-hScroll)<(0)){
	 			hScroll = hScroll-(width-offset)
				counterScroll = Math.floor(hScroll/spacing)
				if(hScroll<0){
					hScroll=0
					counterScroll = Math.floor(hScroll/spacing)
					break
				}			
			}
		 	soundPosArr = []
			increaseValueonIteration = 0
			var checkPos = (cursor*1000/spacing)
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				if(arraySoundFiles[i].pos<checkPos){
					if(arraySoundFiles[i].end>checkPos){
						var itemOffsetDur = checkPos - arraySoundFiles[i].pos
						var thisPlayer = playerArr[arraySoundFiles[i].index-1]
						thisPlayer.message("start",itemOffsetDur)
					}
					continue
				}
				else{
					var thissoundPos = new posAndIndex()
					thissoundPos.pos = arraySoundFiles[i].pos
					thissoundPos.index = arraySoundFiles[i].index
					soundPosArr.push(thissoundPos)
				}
			}
			soundPosArr.sort(
    			function(a, b) {
       				return a.pos - b.pos
    			}
			);
			
			isPlaying=true
			t.interval = 10; // every 10 miliseconds
			t.repeat();
			mgraphics.redraw();
		}
		else{
			isPlaying=false
			t.cancel()
			for(var i =0;i<playerArr.length;i++){
				playerArr[i].message("stop")
			}
			mgraphics.redraw();
		}

}
// Click functions

function onclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	// Initialise state
	allowHZoom = false
	allowHScroll = false
	cursorMove = false
	allowVScroll = false
	allowItemMove = false
	itemToggle = true
	allowSliderMove = false
	allowVolumeMove = false
	allowPointsMove = false
	snapMove = false
	
	// Play - Pause button
	
	if(y>(20-(diameter/2))&&y<(20+(diameter/2))&&x>((width/2)-(diameter/2))&&x<((width/2)+(diameter/2)))
	{
		if(!isPlaying){
		 	soundPosArr = []
			increaseValueonIteration = 0
			var checkPos = (cursor*1000/spacing)
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				if(arraySoundFiles[i].pos<checkPos){
					if(arraySoundFiles[i].end>checkPos){
						var itemOffsetDur = checkPos - arraySoundFiles[i].pos
						var thisPlayer = playerArr[arraySoundFiles[i].index-1]
						thisPlayer.message("start",itemOffsetDur)
					}
					continue
				}
				else{
					var thissoundPos = new posAndIndex()
					thissoundPos.pos = arraySoundFiles[i].pos
					thissoundPos.index = arraySoundFiles[i].index
					soundPosArr.push(thissoundPos)
				}
			}
			soundPosArr.sort(
    			function(a, b) {
       				return a.pos - b.pos
    			}
			);
			
			isPlaying=true
			t.interval = 10; // every 10 miliseconds
			t.repeat();
			mgraphics.redraw();
		}
		else{
			isPlaying=false
			t.cancel()
			for(var i =0;i<playerArr.length;i++){
				playerArr[i].message("stop")
			}
			mgraphics.redraw();
		}
	}
	
	// Click backwards button
	
	if(y>(20-(diameter/2))&&y<(20+(diameter/2))&&x>((width/2)-30-(diameter/2))&&x<((width/2)-30+(diameter/2)))
	{
		if(max.ctrlkeydown){
			cursor=0
			hScroll=0
			counterScroll = Math.floor(hScroll/spacing)
			soundPosArr = []
			increaseValueonIteration = 0
			var checkPos = (cursor*1000/spacing)
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				if(arraySoundFiles[i].pos<checkPos){
					if(arraySoundFiles[i].end>checkPos){
						if(isPlaying){
							var itemOffsetDur = checkPos - arraySoundFiles[i].pos
							var thisPlayer = playerArr[arraySoundFiles[i].index-1]
							thisPlayer.message("start",itemOffsetDur)
						}
					}
					continue
				}
				else{
					var thissoundPos = new posAndIndex()
					thissoundPos.pos = arraySoundFiles[i].pos
					thissoundPos.index = arraySoundFiles[i].index
					soundPosArr.push(thissoundPos)
				}
			}
			soundPosArr.sort(
    			function(a, b) {
       				return a.pos - b.pos
    			}
			);
		}else{
			var beginingandEnds = []
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				beginingandEnds.push(arraySoundFiles[i].pos)
				beginingandEnds.push(arraySoundFiles[i].end)
			}
			beginingandEnds.sort(
    			function(a, b) {
       				return b - a
    			}
			);
			var mult_val = (0.001*40*(spacing/40)) 
		//post(beginingandEnds)
			for(var i=0;i<beginingandEnds.length;i++)
			{
				if(beginingandEnds[i]*mult_val>=cursor)
				{
					continue
				}
				else{
					cursor = beginingandEnds[i]*mult_val
						while((cursor-hScroll)<(0)){
	 						hScroll = hScroll-(width-offset)
							counterScroll = Math.floor(hScroll/spacing)
							if(hScroll<0){
								hScroll=0
								counterScroll = Math.floor(hScroll/spacing)
								break
							}
							
						}
					break
				}
			}
			soundPosArr = []
			increaseValueonIteration = 0
			var checkPos = (cursor*1000/spacing)
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				if(arraySoundFiles[i].pos<checkPos){
					if(arraySoundFiles[i].end>checkPos){
						if(isPlaying){
							var itemOffsetDur = checkPos - arraySoundFiles[i].pos
							var thisPlayer = playerArr[arraySoundFiles[i].index-1]
							thisPlayer.message("start",itemOffsetDur)
						}
					}
					continue
				}
				else{
					var thissoundPos = new posAndIndex()
					thissoundPos.pos = arraySoundFiles[i].pos
					thissoundPos.index = arraySoundFiles[i].index
					soundPosArr.push(thissoundPos)
				}
			}
			soundPosArr.sort(
    			function(a, b) {
       				return a.pos - b.pos
    			}
			);
		}
		mgraphics.redraw();
	}
	
	// Click Forwards button
	
	if(y>(20-(diameter/2))&&y<(20+(diameter/2))&&x>((width/2)+29-(diameter/2))&&x<((width/2)+29+(diameter/2)))
	{
		if(max.ctrlkeydown){
			var beginingandEnds = []
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				beginingandEnds.push(arraySoundFiles[i].pos)
				beginingandEnds.push(arraySoundFiles[i].end)
			}
			beginingandEnds.sort(
    			function(a, b) {
       				return a - b
    			}
			);
			var mult_val = (0.001*40*(spacing/40)) 
			var lastPoint = beginingandEnds.slice(-1)[0]
			cursor = lastPoint*mult_val
			while((cursor-hScroll)>(width-offset)){
	 			hScroll = hScroll+(width-offset)
				counterScroll = Math.floor(hScroll/spacing)
			}
		}else{
			var beginingandEnds = []
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				beginingandEnds.push(arraySoundFiles[i].pos)
				beginingandEnds.push(arraySoundFiles[i].end)
			}
			beginingandEnds.sort(
    			function(a, b) {
       				return a - b
    			}
			);
			var mult_val = (0.001*40*(spacing/40)) 
			//post(beginingandEnds)
			for(var i=0;i<beginingandEnds.length;i++)
			{
				if(beginingandEnds[i]*mult_val<=cursor)
				{
					continue
				}
				else{
					cursor = beginingandEnds[i]*mult_val
						while((cursor-hScroll)>(width-offset)){
	 						hScroll = hScroll+(width-offset)
							counterScroll = Math.floor(hScroll/spacing)
						}
					break
				}
			}
		}
		mgraphics.redraw();
		//post("clicked")
	}
	
	// Allow drag for horizontal zoom
	
	if(y<30&&y>10&&x>width-130&&x<width-10)
	{
		allowHZoom = true
		init_space = spacing
		init_cursor = cursor
	}
	
	// Allow drag for horizontal scroll
	
	if(y<60&&y>40&&x>offset&&x<width)
	{
		init_scroll = Math.max(hScroll,0)
		allowHScroll = true
		init_x = x
	}
	
	//Allow drag for placing the cursor
	
	if(y>60&&y<height&&x>offset&&x<width)
	{
		if(!max.ctrlkeydown&&!max.shiftkeydown&&!max.cmdkeydown){
		cursorMove = true
		init_x = x
		cursor = x-offset+Math.max(hScroll,0)
		init_cursor = cursor
		mgraphics.redraw();
		for(var i =0;i<playerArr.length;i++){
			playerArr[i].message("stop")
		}
		soundPosArr = []
			increaseValueonIteration = 0
			var checkPos = (cursor*1000/spacing)
			for(var i=0;i<arraySoundFiles.length;i++)
			{
				if(arraySoundFiles[i].pos<checkPos){
					if(arraySoundFiles[i].end>checkPos){
						if(isPlaying){
							var itemOffsetDur = checkPos - arraySoundFiles[i].pos
							var thisPlayer = playerArr[arraySoundFiles[i].index-1]
							thisPlayer.message("start",itemOffsetDur)
						}
					}
					continue
				}
				else{
					var thissoundPos = new posAndIndex()
					thissoundPos.pos = arraySoundFiles[i].pos
					thissoundPos.index = arraySoundFiles[i].index
					soundPosArr.push(thissoundPos)
				}
			}
			soundPosArr.sort(
    			function(a, b) {
       				return a.pos - b.pos
    			}
			);
		
		}
	}
	
	//Allow drag for vertical scroll
	
	if(y>60&&y<height&&x>offset&&x<width)
	{
		if(max.ctrlkeydown){
			allowVScroll=true
			init_y=y
			init_cursorY=cursorY
		}
	}
	
	//Allow drag for moving items
	
	if(y>60&&y<height&&x>offset&&x<width)
	{
		if(max.shiftkeydown){
			itemToggle = true
			allowItemMove=true
			init_y=y
			init_cursorY=cursorY
			init_x=x
			init_cursor=cursor
			if(max.cmdkeydown)
				snapMove = true
		}
	}
	
	//ACheck the mute solo and volume for every track
	
	for(var i= 0 ;i<trackCount;i++){
			var initialpositionX = 65
			var endpositionX = 65+17
			var initialpositionY = cursorY+68+50*i
			var finalpositionY = initialpositionY + 17
			if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
			{
				var selmute = (mutebuttonArr[i]==0) ? 1 : 0
				mutebuttonArr[i]= selmute
				fixedmuteArr[i]= selmute
				if(selmute==0&&solobuttonArr.indexOf(1)>-1)
					solobuttonArr[i]=1
			}
			var initialpositionX = 90
			var endpositionX = 90+17
			var initialpositionY = cursorY+68+50*i
			var finalpositionY = initialpositionY + 17
			if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
			{
				var selsolo = (solobuttonArr[i]==0) ? 1 : 0
				solobuttonArr[i]= selsolo
				if(selsolo == 1)
				{
					for(var j= 0 ;j<trackCount;j++){
						if(j==i)
							mutebuttonArr[j] = 0
							
						if(solobuttonArr[j]==0)
							mutebuttonArr[j] = 1
					}
				}else{
					if(solobuttonArr.indexOf(1)>-1)
						mutebuttonArr[i]=1
					else{
						for(var j= 0 ;j<trackCount;j++){
							if(fixedmuteArr[j]==0)
							mutebuttonArr[j] = 0
						}
						
					}
				}
			}
			//mgraphics.rectangle(12,cursorY+91+50*(index),95,13);
			var initialpositionX = 12
			var endpositionX = 95+12
			var initialpositionY = cursorY+91+50*(i)
			var finalpositionY = initialpositionY + 13
			if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
			{
				
				sliderSel = i
				allowSliderMove = true
			}
	}
	
	// Allow drag for sound item volume
	
	if(max.cmdkeydown){
		for(var i= 0 ;i<arraySoundFiles.length;i++){
			var initialpositionX =  (arraySoundFiles[i].pos*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) + 6.5
			var endpositionX = initialpositionX+9
			var initialpositionY = ((arraySoundFiles[i].track-1)*50)+62+cursorY+4+(50/arraySoundFiles[i].split)*arraySoundFiles[i].splitOrder
			var finalpositionY = initialpositionY + 10
			if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
			{
				initialvolume = arraySoundFiles[i].volume
				volumeSel = i
				init_y=y
				allowVolumeMove = true
			}
		}
	}
	if(max.shiftkeydown && hiddenAutom){
		for(var i=0;i<automatedStrings.length;i++){
			var initialpositionX = offset
			var endpositionX = this.box.rect[2]
			var initialpositionY = cursorY+60+3+50*trackCount +50*i
			var finalpositionY  = initialpositionY+50
			if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
			{
				automationTrackSel = i
				allowPointsMove = true
				automationPointSel = null
				init_x = x
				init_y=y
				//this_coords_arr = automationCoordsArr[automatedStrings[i]]
				if(automationCoordsArr[automatedStrings[i]]){
				for(var j=0;j<automationCoordsArr[automatedStrings[i]].length;j++){
					var this_coords_arr = automationCoordsArr[automatedStrings[i]]
					var initialpositionX = (Math.max(this_coords_arr[j].x,40)*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) -3
					var endpositionX = initialpositionX+10
					var initialpositionY = this_coords_arr[j].y*50 + cursorY+61-2+50*(trackCount)+46*i
					var finalpositionY  = initialpositionY+5+6
					if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
					{
						provPointX = this_coords_arr[j].x
						provPointY = this_coords_arr[j].y
						automationPointSel = j
					}
				}
				}
				if(automationPointSel==null){
					allowPointsMove = false
					var temp_x = ((x- offset+ Math.max(hScroll,0))*1000/spacing)  
					var temp_y = (y - cursorY-68-50*(trackCount)-46*i)/48
					automationCoordsArr[automatedStrings[i]].push(new coords(temp_x,temp_y) )
					//post(temp_x)
					//automationCoordsArr.push
				}
				
			}
		}
	}
	mgraphics.redraw();
	

}
var provPointX
var provPointY
var automationTrackSel
var automationPointSel
var itemSelector= 0

// Double click functions

function ondblclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	
	//ouvrir l'editeur d'audio pour des sons individuels 
	if(max.shiftkeydown)
	{
		for(var i= 0 ;i<arraySoundFiles.length;i++){
				var initialpositionX = (arraySoundFiles[i].pos*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				var endpositionX = (arraySoundFiles[i].end*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				var initialpositionY = ((arraySoundFiles[i].track-1)*50)+62+cursorY+(50/arraySoundFiles[i].split)*arraySoundFiles[i].splitOrder
				var finalpositionY = initialpositionY + 49/arraySoundFiles[i].split

				if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
				{
					BuffPcontrol[i].message("open")
				}
			
		}
		mgraphics.redraw();
	}
	// Delete items on double click + ctrl
	if(max.ctrlkeydown){
		for(var i= 0 ;i<arraySoundFiles.length;i++){
				var initialpositionX = (arraySoundFiles[i].pos*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				var endpositionX = (arraySoundFiles[i].end*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				var initialpositionY = ((arraySoundFiles[i].track-1)*50)+62+cursorY+(50/arraySoundFiles[i].split)*arraySoundFiles[i].splitOrder
				var finalpositionY = initialpositionY + 49/arraySoundFiles[i].split
				if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
				{
					var deletedindex = arraySoundFiles[i].index
					var object_to_delete = processFiles.subpatcher().getnamed("pointMainMess"+i)
					processFiles.subpatcher().remove(object_to_delete)
					for(var j= 0 ;j<arraySoundFiles.length;j++){
						if(j>i){
							var object_to_modify = processFiles.subpatcher().getnamed("pointMainMess"+j)
							object_to_modify.varname ="pointMainMess"+(j-1)
							}
						
					}
					arraySoundFiles.splice(i,1)
					playerArr.splice(i,1)
					itemVolArr.splice(i,1)
					fileNamesArr.splice(i,1)
					for(var j= 0 ;j<arraySoundFiles.length;j++){
						if(arraySoundFiles[j].index>deletedindex)
							arraySoundFiles[j].index = arraySoundFiles[j].index-1
						
					}
					newBuffer()
				}
		}
		
		//Delete tracks if there are no sound items 
		
		for(var i= 0 ;i<trackCount;i++){
				var initialpositionX = 0
				var endpositionX = offset
				var initialpositionY = 62+cursorY + 50*i
				var finalpositionY = 62+cursorY + 50*(i+1)
				if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
				{
					var thistrackisoccupied = false
					for(var j= 0 ;j<arraySoundFiles.length;j++){
						if(arraySoundFiles[j].track==(i+1))
							thistrackisoccupied = true
							
					}
					if(!thistrackisoccupied){
						trackCount=trackCount-1
						var keeptrackofsolo = solobuttonArr[i]
						solobuttonArr.splice(i,1) 
						mutebuttonArr.splice(i,1) 
						fixedmuteArr.splice(i,1) 
						volSliderArr.splice(i,1) 
						FxTracks.subpatcher().remove(fxPatches[i])
						FxTracks.subpatcher().remove(fxPcontrol[i])
						
						fxPatches.splice(i,1) 
						fxPcontrol.splice(i,1)
												
						for(var j= 0 ;j<trackCount;j++){
							if(j>=i){
									var mTitre = fxPatches[j].subpatcher().newdefault(20,20,"message")
									
									mTitre.message("append","title")
									mTitre.message("append","Fx_Track_"+(j+1))
									var thisTitre = fxPatches[j].subpatcher().newdefault(20,20,"thispatcher")
									fxPatches[j].subpatcher().connect(mTitre,0,thisTitre,0)
									mTitre.message("bang")
									fxPatches[j].subpatcher().remove(mTitre)
									fxPatches[j].subpatcher().remove(thisTitre)
									fxPatches[j].varname = "Fx_Track_"+(j+1)
									fxPcontrol[j].varname = "Fx_Pcontrol_"+(j+1)
								}
								
						}
						
						for(var j= 0 ;j<arraySoundFiles.length;j++){
							if(arraySoundFiles[j].track>(i+1))
								arraySoundFiles[j].track = arraySoundFiles[j].track-1
						
						}
						if(keeptrackofsolo==1&&solobuttonArr.indexOf(1) == -1){
							for(var j= 0 ;j<trackCount;j++){
								if(fixedmuteArr[j]==0)
									mutebuttonArr[j]=0
						
							}
						}
						newBuffer()
					}	
				}
		}
		mgraphics.redraw();
	}
	else{
		
	// Double click for opening FX window	
		
		for(var i= 0 ;i<trackCount;i++){
				var initialpositionX = 0
				var endpositionX = offset
				var initialpositionY = 62+cursorY + 50*i
				var finalpositionY = 62+cursorY + 50*(i+1)
				if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
				{
					fxPcontrol[i].message("open")
				}
		}
	}
	if(max.shiftkeydown){
		for(var i=0;i<automatedStrings.length;i++){
			var initialpositionX = offset
			var endpositionX = this.box.rect[2]
			var initialpositionY = cursorY+60+3+50*trackCount +50*i
			var finalpositionY  = initialpositionY+50
			if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
			{
				//this_coords_arr = automationCoordsArr[automatedStrings[i]]
				if(automationCoordsArr[automatedStrings[i]]){
				for(var j=0;j<automationCoordsArr[automatedStrings[i]].length;j++){
					var this_coords_arr = automationCoordsArr[automatedStrings[i]]
					var initialpositionX = (Math.max(this_coords_arr[j].x,40)*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) -3
					var endpositionX = initialpositionX+10
					var initialpositionY = this_coords_arr[j].y*50 + cursorY+61-2+50*(trackCount)+46*i
					var finalpositionY  = initialpositionY+5+6

					if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY&&j>0)
					{
						//post("delete")
						this_coords_arr.splice(j,1)
						mgraphics.redraw();
						
					}
				}
				}
				
			}
		}
	}
	
}
function hNumb(){
	if(buttonPressed==0){
		show_coords_edit =false
		mgraphics.redraw();
	}
}
var hideNumbers = new Task(hNumb,this)
// Drag functions
var buttonPressed
var drawCoordsX
var drawCoordsY
function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
	if(allowPointsMove)
	{
			show_coords_edit =true
			var this_coords_arr = automationCoordsArr[automatedStrings[automationTrackSel]]
			
			if(this_coords_arr[automationPointSel+1]&&this_coords_arr[automationPointSel-1]){
				this_coords_arr[automationPointSel].x= Math.min(Math.max(((x-init_x)*1000/spacing) + provPointX,this_coords_arr[automationPointSel-1].x+1),this_coords_arr[automationPointSel+1].x-1)
				this_coords_arr[automationPointSel].y = Math.min(Math.max((y-init_y)/50 + provPointY,0),1)
			}
			else if(this_coords_arr[automationPointSel-1]){
				this_coords_arr[automationPointSel].x= Math.max(((x-init_x)*1000/spacing) + provPointX,this_coords_arr[automationPointSel-1].x+1)
				this_coords_arr[automationPointSel].y = Math.min(Math.max((y-init_y)/50 + provPointY,0),1)
			}
			else
				this_coords_arr[automationPointSel].y = Math.min(Math.max((y-init_y)/50 + provPointY,0),1)
				
			var sString = automatedStrings[automationTrackSel].split("_")
			var valueString = sString[1]*1.+(-1*this_coords_arr[automationPointSel].y+1)*(sString[2]-sString[1])
			drawCoordsX = this_coords_arr[automationPointSel].x
			drawCoordsY = valueString
			mgraphics.redraw();
			buttonPressed = but
			hideNumbers.schedule(150)
	}
	// Item volume change
	if(allowVolumeMove)
	{
		arraySoundFiles[volumeSel].volume = Math.min(Math.max((initialvolume-(y-init_y)*0.05),0),1)
		mgraphics.redraw();
	}
	// Track volume change
	if(allowSliderMove)
	{
		volSliderArr[sliderSel] = Math.min(Math.max(x-12,0),95)
		mgraphics.redraw();
	}
	
	// Horizontal zoom change
	
	if(allowHZoom)
	{
		var zoomPos = (Math.max((x-(width-130)),0)<120) ? Math.max((x-(width-130)),0) : 120
		hZoom = zoomPos
		var this_spacing
		if(hZoom<=60)
			this_spacing = scaleValue(hZoom, [0,60], [10,40]);
		else
			this_spacing = scaleValue(hZoom, [60,120], [40,100]);
		spacing = this_spacing
		counterScroll = Math.floor(hScroll/spacing)
		var spaceRatio = spacing/init_space
		cursor = init_cursor*spaceRatio
		mgraphics.redraw();
	}
	
	// Horizontal scroll change
	
	if(allowHScroll)
	{
		
		var scrolled_amount = x-init_x
		var this_scroll = init_scroll+scrolled_amount
		hScroll=Math.max(this_scroll,0)
		counterScroll = Math.floor(hScroll/spacing)
		mgraphics.redraw();
	}
	
	// Change cursor position 
	
	if(cursorMove)
	{
		var scrolled_cursor = x-init_x
		cursor = init_cursor + scrolled_cursor
		mgraphics.redraw();
	}
	
	// Change vertical scroll
	
	if(allowVScroll)
	{
		var scrolled_cursor = y-init_y
		var allowed_scroll = Math.max((trackCount*50+automatedStrings.length*50) - (height-60),0)
		cursorY = Math.max(Math.min(init_cursorY + scrolled_cursor,0),-allowed_scroll)
		mgraphics.redraw();
	}
	
	// Change sound items position
	
	if(allowItemMove)
	{
		for(var i= 0 ;i<arraySoundFiles.length;i++){
			if(itemToggle){
				var initialpositionX = (arraySoundFiles[i].pos*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				var endpositionX = (arraySoundFiles[i].end*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
				var initialpositionY = ((arraySoundFiles[i].track-1)*50)+62+cursorY+(50/arraySoundFiles[i].split)*arraySoundFiles[i].splitOrder
				var finalpositionY = initialpositionY + 49/arraySoundFiles[i].split
				x_coord[i] = arraySoundFiles[i].pos
				y_coord[i] =initialpositionY
				if(x>initialpositionX&&x<endpositionX&&y>initialpositionY&&y<finalpositionY)
				{
					itemSelector = i
					itemToggle = false
				}
			}
		}
		mgraphics.redraw();
	}
	
	// Change different items position -- overlapping in tracks
	//Snap items on move
	
	if(!itemToggle)
	{
		var nSubd = (spacing>=40) ? spacing/10 : 1
		//post(1000*Math.floor((x_coord[itemSelector] + (x - init_x)*1000/spacing)/(1000/nSubd))/nSubd)
		if(!snapMove)
			arraySoundFiles[itemSelector].pos = Math.max(x_coord[itemSelector] + (x - init_x)*1000/spacing,0)
		else
			arraySoundFiles[itemSelector].pos = Math.max(1000*Math.floor((x_coord[itemSelector] + (x - init_x)*1000/spacing)/(1000/nSubd))/nSubd,0)
		arraySoundFiles[itemSelector].end = arraySoundFiles[itemSelector].pos + arraySoundFiles[itemSelector].length
		
		var changeTrack =  Math.floor((y-60-cursorY)/50)+1
		arraySoundFiles[itemSelector].track = Math.min(Math.max(changeTrack,1),trackCount)
		// insert here
		
		// end insert here
		
		//second test
		
		for(var i = 0;i<trackCount;i++)
		{
			//tracks in each array
			var itemsinthistrack = new Array()
			for(var j = 0;j<arraySoundFiles.length;j++)
			{
				if(arraySoundFiles[j].track-1==i)
					itemsinthistrack.push(arraySoundFiles[j])
			}	
		
			
			//sort items in each track by their beggining
			itemsinthistrack.sort(
    			function(a, b) {
       				return a.pos - b.pos
    			}
			);
			//itemsinthistrack = itemsinthistrack.reverse()
			//check if the first item ends before next beggining
			var itemsPositions = new Array()
			for(var j = 0;j<itemsinthistrack.length;j++)
			{
				itemsPositions.push(itemsinthistrack[j].pos)
				itemsPositions.push(itemsinthistrack[j].end)
				itemsinthistrack[j].collisions=1
			}
			itemsPositions.sort()
			for(var j = 0;j<itemsPositions.length;j++)
			{
				var itemsCollide = new Array()
				var itemsColliding = 0
				for(var k = 0;k<itemsinthistrack.length;k++)
				{
					if(itemsPositions[j]>=itemsinthistrack[k].pos&&itemsPositions[j]<=itemsinthistrack[k].end)
					{
						itemsCollide.push(itemsinthistrack[k])
						itemsColliding = itemsColliding+1
					}
				}
				for(var k = 0;k<itemsCollide.length;k++)
				{
					itemsCollide[k].collisions=Math.max(itemsCollide[k].collisions,itemsColliding)
					itemsCollide[k].split = itemsCollide[k].collisions
					
				}
			}
			initloopvalue = 0
			for(var j = 0;j<itemsinthistrack.length;j++)
			{
				itemsinthistrack[j].splitOrder=initloopvalue
				myCounter(itemsinthistrack[j].collisions)
				
				
			}
			
		}
		mgraphics.redraw();
	}
}

// Looping counter

function myCounter(limit){
    initloopvalue = initloopvalue+1
    if(initloopvalue>=limit)
        initloopvalue=0
}

// Scale between ranges

function scaleValue(value, from, to) {
	var scale = (to[1] - to[0]) / (from[1] - from[0]);
	var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	return ~~(capped * scale + to[0]);
}

// Formatted time 

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

// New Sound Item Drawing

function newItem(currentItem){	
	var initialposition = (currentItem.pos*0.001*40*(spacing/40)) + offset - Math.max(hScroll,0) 
	var endposition = currentItem.length*0.001*40*(spacing/40)
	
	mgraphics.set_source_rgb(color3);
	mgraphics.rectangle(initialposition,((currentItem.track-1)*50)+62+cursorY+(50/currentItem.split)*currentItem.splitOrder,endposition,49/currentItem.split);
	mgraphics.fill();
	
	mgraphics.set_source_rgb(color2);
	mgraphics.rectangle(initialposition,((currentItem.track-1)*50)+62+cursorY+(50/currentItem.split)*currentItem.splitOrder,2,49/currentItem.split);
	mgraphics.fill();
	
	mgraphics.set_source_rgb(color2);
	mgraphics.rectangle(initialposition+endposition,((currentItem.track-1)*50)+62+cursorY+(50/currentItem.split)*currentItem.splitOrder,2,49/currentItem.split);
	mgraphics.fill();
	
	mgraphics.set_source_rgb(color2);
	mgraphics.rectangle(initialposition,((currentItem.track-1)*50+(50/currentItem.split)*currentItem.splitOrder+50/currentItem.split)+61+cursorY,endposition+1,2);
	mgraphics.fill();
		mgraphics.set_source_rgb(color2);
	mgraphics.rectangle(initialposition,((currentItem.track-1)*50+(50/currentItem.split)*currentItem.splitOrder)+61+cursorY,endposition+1,2);
	mgraphics.fill();
	
	mgraphics.select_font_face("Arial");
	mgraphics.set_font_size(10);
	mgraphics.set_source_rgb(0.2,0.2,0.2);
	mgraphics.move_to(initialposition +20,((currentItem.track-1)*50)+62+cursorY+11+(50/currentItem.split)*currentItem.splitOrder)
	mgraphics.text_path(currentItem.filename);
	mgraphics.fill();
	
	var thisItemVol = currentItem.volume
	itemVolArr[currentItem.index-1].message("float",(thisItemVol==0)?0:(Math.pow(10,(((thisItemVol*45)-25)/20))/10))
	mgraphics.arc(initialposition +11.3,((currentItem.track-1)*50)+62+cursorY+8.3+(50/currentItem.split)*currentItem.splitOrder,5,1.57,(6.28*thisItemVol)+1.57)
	mgraphics.line_to(initialposition +11.3,((currentItem.track-1)*50)+62+cursorY+8.3+(50/currentItem.split)*currentItem.splitOrder)
	mgraphics.fill();
	
	mgraphics.ellipse(initialposition +6.5,((currentItem.track-1)*50)+62+cursorY+4+(50/currentItem.split)*currentItem.splitOrder,9,9)
	mgraphics.stroke();
}

function initiateAutom(){
var a = arrayfromargs(messagename,arguments)
automationCoordsArr[a[1]]=[]
for(var i=0;i<(a.length-2)/2;i++){
	automationCoordsArr[a[1]].push(new coords(a[(i*2)+2],a[(i*2)+3]))
}
mgraphics.redraw()
}
// Initialise each track state

function setTrackState(index, s, m,fixed,vol){
	solobuttonArr[index] = s
	mutebuttonArr[index] = m
	fixedmuteArr[index] = fixed
	volSliderArr[index] = vol
	mgraphics.redraw();
}

var solobuttonArr =[]
var mutebuttonArr =[]
var fixedmuteArr =[]
var volSliderArr =[]

// Create new file by dragging

function newFile(length,fileName,pos,track,split,splitOrder,volume, maxtracks){

	trackCount = trackCount+1;
	var temporaryItem = new Item(arraySoundFiles.length+1,length,fileName);
	
	if(maxtracks)
		trackCount = maxtracks;
	if(pos || pos==0)
	{
		//post("hello")
		temporaryItem.pos = pos
		temporaryItem.end = pos+length
		temporaryItem.track = track
		temporaryItem.split = split
		temporaryItem.splitOrder = splitOrder
		temporaryItem.volume = volume
	}else
		temporaryItem.track = trackCount
	arraySoundFiles.push(temporaryItem)
	mgraphics.redraw();

	for(var i=0;i<trackCount;i++){
		solobuttonArr[i] = (solobuttonArr[i]) ? solobuttonArr[i] : 0
		mutebuttonArr[i] = (mutebuttonArr[i]) ? mutebuttonArr[i] : ((solobuttonArr.indexOf(1)>-1 && solobuttonArr[i] ==0) ? 1 : 0)
		fixedmuteArr[i] = (fixedmuteArr[i]) ? fixedmuteArr[i] : 0
		volSliderArr[i] = (volSliderArr[i]||volSliderArr[i]==0) ? volSliderArr[i] : 95
	}
	
}

// Draw on load
mgraphics.redraw();

// Create and draw a new track
function newTrack(index){
	
	var this_colour = (index % 2  == 0) ? [0.6,0.6,0.6,1] : [0.4,0.4,0.4,1];
	mgraphics.set_source_rgba(this_colour);
	var this_offset = (index==0) ? 2 :3
	mgraphics.rectangle(3,cursorY+60+this_offset+50*index,offset-5,50-this_offset+1);
	mgraphics.fill();
	
	this_colour = (index % 2  == 0) ? [0.6,0.6,0.6,0.5] : [0.4,0.4,0.4,0.5];
	mgraphics.set_source_rgba(this_colour);
	mgraphics.rectangle(offset,cursorY+61+50*index,width-offset,50);
	mgraphics.fill();
	mgraphics.set_source_rgba(color2);
	mgraphics.rectangle(offset,cursorY+61+50*(index+1),this.box.rect[2],2);
	mgraphics.fill();
	mgraphics.set_source_rgb(color3);
	mgraphics.rectangle(0,cursorY+61+50*(index+1),offset,2);
	mgraphics.fill();
	
	var this_colour = (index % 2  == 0) ? [0.3,0.3,0.3,1] : [0.8,0.8,0.8,1];
	mgraphics.select_font_face("Arial");
	mgraphics.set_font_size(12);
	mgraphics.set_source_rgba(this_colour);
	mgraphics.move_to(10,cursorY+80+50*index)
	mgraphics.text_path("Track" +(index+1));
	mgraphics.fill();
	
	//Volume slider 0-95
	var this_volume = volSliderArr[index]
	mgraphics.rectangle(12,cursorY+91+50*(index),95,13);
	mgraphics.stroke();
	
	mgraphics.rectangle(12,cursorY+91+50*(index),this_volume,13);
	mgraphics.fill();
	
	
	//mute and solo
	var this_solo = solobuttonArr[index]
	var this_mute = mutebuttonArr[index]
	//mgraphics.set_source_rgb(color3);
	if(this_mute == 0){
	mgraphics.rectangle(65,cursorY+68+50*index,17,17);
	mgraphics.set_line_width(1.2)
	mgraphics.stroke();
	
	mgraphics.select_font_face("Arial Black");
	mgraphics.move_to(68,cursorY+81+50*index)
	mgraphics.text_path("M");
	mgraphics.fill();
	}else{

	mgraphics.rectangle(65,cursorY+68+50*index,17,17);
	mgraphics.set_line_width(1.2)
	mgraphics.fill();
	
	var this_colour = (index % 2  == 0) ? [0.8,0.8,0.8,1] : [0.3,0.3,0.3,1];
	mgraphics.set_source_rgba(this_colour);
	mgraphics.select_font_face("Arial Black");
	mgraphics.move_to(68,cursorY+81+50*index)
	mgraphics.text_path("M");
	mgraphics.fill();	
		
	}
	if(this_solo == 0){
	var this_colour = (index % 2  == 0) ? [0.3,0.3,0.3,1] : [0.8,0.8,0.8,1];
	mgraphics.set_source_rgba(this_colour);
	//mgraphics.set_source_rgb(1,0.75,0);
	mgraphics.rectangle(90,cursorY+68+50*index,17,17);
	mgraphics.set_line_width(1.2)
	mgraphics.stroke();
	
	mgraphics.move_to(94,cursorY+80.5+50*index)
	mgraphics.text_path("S");
	mgraphics.fill();
	}else{
	var this_colour = (index % 2  == 0) ? [0.3,0.3,0.3,1] : [0.8,0.8,0.8,1];
	mgraphics.set_source_rgba(this_colour);
	//mgraphics.set_source_rgb(1,0.75,0);
	mgraphics.rectangle(90,cursorY+68+50*index,17,17);
	mgraphics.set_line_width(1.2)
	mgraphics.fill();
	
	var this_colour = (index % 2  == 0) ? [0.8,0.8,0.8,1] : [0.3,0.3,0.3,1];
	mgraphics.set_source_rgba(this_colour);
	
	mgraphics.move_to(94,cursorY+80.5+50*index)
	mgraphics.text_path("S");
	mgraphics.fill();
	}
	
}


var thisPatch
var fileNamesArr = []
var playerArr = []
var itemVolArr = []
var muteArrToggles = []
var volSlidersFloat = []
var fxPatches = []
var fxPcontrol = []
var BuffPcontrol = []
var matrixctrl
var FxTracks
var bufferPatchArrays = []
var bufferPcontrolsArrays = []
// Create a Max buffer for storing a Sound (and other required tools)

function newBuffer(fileName,doNotRecreate){
	
	var soundPatch
	if(fileName)
		fileNamesArr.push(fileName)
	soundPatch = this.patcher.getnamed("DAWSoundManager")
	if(!this.patcher.getnamed("FxTracks")){
		FxTracks = this.patcher.newdefault(this.box.rect[0]+120,this.box.rect[1]+60,"p","FxTracks")
		FxTracks.subpatcher().wind.visible = 0
		var toremovein = FxTracks.subpatcher().newdefault(20,20,"inlet")
		FxTracks.varname = "FxTracks"
		closePatcher2(this.patcher,FxTracks,FxTracks.subpatcher(),toremovein)
	}else
		FxTracks = this.patcher.getnamed("FxTracks")
		
	if(soundPatch)
		this.patcher.remove(soundPatch)
	
		soundPatch = this.patcher.newdefault(this.box.rect[0],this.box.rect[3]-21,"p","DAW_Tracks")
		soundPatch.subpatcher().wind.visible = 0
		var rectangle = new Array();
		rectangle[0] = soundPatch.rect[0];
		rectangle[1] = soundPatch.rect[1];
		rectangle[2] = this.box.rect[2];
		rectangle[3] = soundPatch.rect[1]+20;
		soundPatch.rect = rectangle;
		soundPatch.varname = "DAWSoundManager"
		 
	var matrix = soundPatch.subpatcher().newdefault(220,440,"matrix~",arraySoundFiles.length,trackCount)
	matrixctrl =soundPatch.subpatcher().newdefault(20,440,"matrixctrl","@rows",trackCount,"@columns",arraySoundFiles.length,"@one/column",1)
	var mcpack = soundPatch.subpatcher().newdefault(220,500,"mc.pack~",trackCount)
	var mcsend = soundPatch.subpatcher().newdefault(220,530,"mc.send~","untreated",trackCount)
	var mcreceive = soundPatch.subpatcher().newdefault(220,560,"mc.receive~","treated",trackCount)
	var thisoutlet = soundPatch.subpatcher().newdefault(220,560,"outlet")
	soundPatch.subpatcher().connect(matrixctrl,0,matrix,0)
	soundPatch.subpatcher().connect(mcpack,0,mcsend,0)
	soundPatch.subpatcher().connect(mcreceive,0,thisoutlet,0)
	
	if(FxTracks.subpatcher().getnamed("FxTracks_rec"))
		FxTracks.subpatcher().remove(FxTracks.subpatcher().getnamed("FxTracks_rec"))
		
	if(FxTracks.subpatcher().getnamed("FxTracks_send"))
		FxTracks.subpatcher().remove(FxTracks.subpatcher().getnamed("FxTracks_send"))
		
	if(FxTracks.subpatcher().getnamed("FxTracks_pack"))
		FxTracks.subpatcher().remove(FxTracks.subpatcher().getnamed("FxTracks_pack"))
		
	if(FxTracks.subpatcher().getnamed("FxTracks_unpack"))
		FxTracks.subpatcher().remove(FxTracks.subpatcher().getnamed("FxTracks_unpack"))
	
	var FxTracks_rec = FxTracks.subpatcher().newdefault(20,20,"mc.receive~","untreated",trackCount)
	var FxTracks_send = FxTracks.subpatcher().newdefault(20,300,"mc.send~","treated",trackCount)
	var FxTracks_unpack = FxTracks.subpatcher().newdefault(20,80,"mc.unpack~",trackCount)
	var FxTracks_pack = FxTracks.subpatcher().newdefault(20,240,"mc.pack~",trackCount)
	
	FxTracks_rec.varname = "FxTracks_rec"
	FxTracks_send.varname = "FxTracks_send"
	FxTracks_unpack.varname = "FxTracks_unpack"
	FxTracks_pack.varname = "FxTracks_pack"
	
	FxTracks.subpatcher().connect(FxTracks_rec,0,FxTracks_unpack,0)
	FxTracks.subpatcher().connect(FxTracks_pack,0,FxTracks_send,0)
	
	if(!doNotRecreate&&fileName){
		var pContr = FxTracks.subpatcher().newdefault(60+120*(trackCount-1),110,"pcontrol")
		pContr.varname = "Fx_Pcontrol_"+trackCount
		var FxP = FxTracks.subpatcher().newdefault(20+120*(trackCount-1),140,"p","Fx_Track_"+trackCount)
		FxP.varname = "Fx_Track_"+trackCount
		
		var mTitre = FxP.subpatcher().newdefault(20,20,"message")							
		mTitre.message("append","toolbarvisible")
		mTitre.message("append",0)
		var thisTitre = FxP.subpatcher().newdefault(20,20,"thispatcher")
		FxP.subpatcher().connect(mTitre,0,thisTitre,0)
		mTitre.message("bang")
		FxP.subpatcher().remove(mTitre)
		FxP.subpatcher().remove(thisTitre)
		
		var mTitre = FxTracks.subpatcher().newdefault(20,20,"message")							
		mTitre.message("append","script")
		mTitre.message("append","pastereplace")
		mTitre.message("append","Fx_Track_"+trackCount)
		mTitre.message("append","Fx_Track_"+trackCount)
		var thisTitre = FxTracks.subpatcher().newdefault(20,20,"thispatcher")
		FxTracks.subpatcher().connect(mTitre,0,thisTitre,0)
		mTitre.message("bang")
		FxTracks.subpatcher().remove(mTitre)
		FxTracks.subpatcher().remove(thisTitre)
		
		FxP = FxTracks.subpatcher().getnamed("Fx_Track_"+trackCount)
		var FxPIn = FxP.subpatcher().newdefault(30,30,"inlet")
		var FxPOut = FxP.subpatcher().newdefault(30,420,"outlet")
		FxTracks.subpatcher().connect(pContr,0,FxP,0)
		FxP.subpatcher().connect(FxPIn,0,FxPOut,0)
		closePatcher(FxTracks.subpatcher(),FxP)
		fxPatches.push(FxP)
		fxPcontrol.push(pContr)
	}
	if(doNotRecreate){
		for(var i =0;i<trackCount;i++){
			fxPcontrol.push(FxTracks.subpatcher().getnamed("Fx_Pcontrol_"+(i+1)))
			fxPatches.push(FxTracks.subpatcher().getnamed("Fx_Track_"+(i+1)))
		}
	}
	
	for(var i =0;i<trackCount;i++){
		FxTracks.subpatcher().connect(FxTracks_unpack,i,fxPatches[i],0)
		FxTracks.subpatcher().connect(fxPatches[i],0,FxTracks_pack,i)
		var mTitre = fxPatches[i].subpatcher().newdefault(20,20,"message")
									
		mTitre.message("append","title")
		mTitre.message("append","Fx_Track_"+(i+1))
		var thisTitre = fxPatches[i].subpatcher().newdefault(20,20,"thispatcher")
		fxPatches[i].subpatcher().connect(mTitre,0,thisTitre,0)
		mTitre.message("bang")
		fxPatches[i].subpatcher().remove(mTitre)
		fxPatches[i].subpatcher().remove(thisTitre)
	}
	var toremovein = soundPatch.subpatcher().newdefault(20+200*i,20,"inlet")
	playerArr = []
	itemVolArr = []
	BuffPcontrol = []
	//filename
	for(var i =0;i<arraySoundFiles.length;i++){
		var loadbang = soundPatch.subpatcher().newdefault(20+200*i,20,"loadbang")
		var listread = soundPatch.subpatcher().newdefault(20+200*i,80,"list","read",fileNamesArr[i])
		var thisbuffer = soundPatch.subpatcher().newdefault(20+200*i,260,"buffer~","a"+i)
		soundPatch.subpatcher().connect(loadbang,0,listread,0) 
		soundPatch.subpatcher().connect(listread,0,thisbuffer,0) 
		listread.message("bang")

		var bufferPatch = soundPatch.subpatcher().newdefault(20+200*i,260,"p",fileNamesArr[i])
		

		var bufferPcontrol = soundPatch.subpatcher().newdefault(20+200*i,260,"pcontrol")
		bufferPatch.varname = "buffer_a"+i
		var buffIn = bufferPatch.subpatcher().newdefault(20,20,"inlet")
		buffIn.background = 1
		
		var mcfunc = bufferPatch.subpatcher().newdefault(0,0,"mc.function", "@chans",3,"@linethickness",2,"@pointsize",3.5,"@bgcolor",0,0,0,0)
		mcfunc.varname = "functionObject"
		var rectangle = new Array();
		rectangle[0] = mcfunc.rect[0];
		rectangle[1] = mcfunc.rect[1];
		rectangle[2] = mcfunc.rect[0]+800;
		rectangle[3] = mcfunc.rect[1]+400;
		mcfunc.rect = rectangle;
		mcfunc.message("domain",arraySoundFiles[i].length)
		processFiles = this.patcher.getnamed("processFilesPatch")
		if(!processFiles.subpatcher().getnamed("pointMainMess"+i)){
			mcfunc.message("list",0,1)
			mcfunc.message("list",arraySoundFiles[i].length, 1)
		}

		var soundwave = bufferPatch.subpatcher().newdefault(0,0,"waveform~", "@waveformcolor",1,0.5,0.5,"@selectioncolor",0,0,0,"@vzoom",0.5)
		var bufferSecond = bufferPatch.subpatcher().newdefault(0,0,"buffer~", "b"+i,arraySoundFiles[i].length)
		var jsmess = bufferPatch.subpatcher().newdefault(0,0,"message")
		var jsmess2 = bufferPatch.subpatcher().newdefault(0,0,"message")
		var jsObj = bufferPatch.subpatcher().newdefault(0,0,"js","multiplyBuff.js")
		var jsLoad = bufferPatch.subpatcher().newdefault(0,0,"loadbang")
		var jsLoadDel = bufferPatch.subpatcher().newdefault(0,0,"del",100)
		var jsLoadDel2 = bufferPatch.subpatcher().newdefault(0,0,"del",0)
		jsLoad.background = 1
		jsLoadDel.background = 1
		bufferPatch.subpatcher().hiddenconnect(jsLoad,0,jsLoadDel,0)
		bufferPatch.subpatcher().hiddenconnect(jsLoad,0,jsLoadDel2,0)
		bufferPatch.subpatcher().hiddenconnect(jsLoadDel2,0,jsmess2,0)
		bufferPatch.subpatcher().hiddenconnect(jsLoadDel,0,jsmess,0)
		bufferPatch.subpatcher().hiddenconnect(mcfunc,3,jsmess,0)
		bufferPatch.subpatcher().hiddenconnect(jsmess,0,jsObj,0)
		bufferPatch.subpatcher().hiddenconnect(jsmess2,0,jsObj,0)
		jsmess.message("append","calcBuff")
		jsmess.message("append",i)
		jsmess.background = 1
		jsmess2.message("append","recall")
		jsmess2.message("append",i)
		jsmess2.background = 1
		jsObj.background = 1
		bufferSecond.background = 1
		soundwave.ignoreclick = 1
		var rectangle = new Array();
		rectangle[0] = soundwave.rect[0];
		rectangle[1] = soundwave.rect[1];
		rectangle[2] = soundwave.rect[0]+800;
		rectangle[3] = soundwave.rect[1]+400;
		soundwave.rect = rectangle;
		soundwave.message("set","b"+i)
		
		
		
		var bTitre = bufferPatch.subpatcher().newdefault(20,20,"message")
		closePatcher(soundPatch.subpatcher(),bufferPatch)							
		bTitre.message("append","title")
		bTitre.message("append",arraySoundFiles[i].filename)
		bTitre.message("append",",")
		bTitre.message("append","window")
		bTitre.message("append","size")
		bTitre.message("append",100)
		bTitre.message("append",200)
		bTitre.message("append",900)
		bTitre.message("append",600)
		bTitre.message("append",",")
		bTitre.message("append","window")
		bTitre.message("append","constrain")
		bTitre.message("append",800)
		bTitre.message("append",400)
		bTitre.message("append",800)
		bTitre.message("append",400)
		bTitre.message("append",",")
		bTitre.message("append","window")
		bTitre.message("append","exec")


		var bTitreThis = bufferPatch.subpatcher().newdefault(20,20,"thispatcher")
		bufferPatch.subpatcher().connect(bTitre,0,bTitreThis,0)
		bTitre.message("bang")

		bufferPatch.subpatcher().remove(bTitre)
		bufferPatch.subpatcher().remove(bTitreThis)
		
		
		var mTitre = bufferPatch.subpatcher().newdefault(20,20,"message")							
		mTitre.message("append","toolbarvisible")
		mTitre.message("append",0)
		var thisTitre = bufferPatch.subpatcher().newdefault(20,20,"thispatcher")
		bufferPatch.subpatcher().connect(mTitre,0,thisTitre,0)
		mTitre.message("bang")
		bufferPatch.subpatcher().remove(mTitre)
		bufferPatch.subpatcher().remove(thisTitre)
		
		var mTitre = soundPatch.subpatcher().newdefault(20,20,"message")							
		mTitre.message("append","script")
		mTitre.message("append","pastereplace")
		mTitre.message("append","buffer_a"+i)
		mTitre.message("append","buffer_a"+i)
		var thisTitre = soundPatch.subpatcher().newdefault(20,20,"thispatcher")
		soundPatch.subpatcher().connect(mTitre,0,thisTitre,0)
		mTitre.message("bang")
		soundPatch.subpatcher().remove(mTitre)
		soundPatch.subpatcher().remove(thisTitre)
		
		bufferPatch = soundPatch.subpatcher().getnamed("buffer_a"+i)
		soundPatch.subpatcher().connect(bufferPcontrol,0,bufferPatch,0)
		
		var bTitre = bufferPatch.subpatcher().newdefault(20,20,"message")
		bTitre.message("append","window")
		bTitre.message("append","flags")
		bTitre.message("append","nogrow")
		bTitre.message("append",",")
		bTitre.message("append","window")
		bTitre.message("append","exec")
		var bTitreThis = bufferPatch.subpatcher().newdefault(20,20,"thispatcher")
		bufferPatch.subpatcher().connect(bTitre,0,bTitreThis,0)
		bTitre.message("bang")

		bufferPatch.subpatcher().remove(bTitre)
		bufferPatch.subpatcher().remove(bTitreThis)
		BuffPcontrol.push(bufferPcontrol)


		var thisplay = soundPatch.subpatcher().newdefault(20+200*i,320,"play~","b"+i,2)
		var thisadd = soundPatch.subpatcher().newdefault(20+200*i,380,"+~")
		thisadd.varname = "thisadd_"+i
		var thislocalvol = soundPatch.subpatcher().newdefault(20+200*i,380,"*~")
		thislocalvol.varname = "thislocalvol_"+i
		var thislocalvol2 = soundPatch.subpatcher().newdefault(20+200*i,380,"*~",1)
		thislocalvol2.varname = "thislocalvol2_"+i
		var thislocalpack = soundPatch.subpatcher().newdefault(20+200*i,380,"pack","f",20)
		var thislocalline = soundPatch.subpatcher().newdefault(20+200*i,380,"line~")
		var thislocalflonum = soundPatch.subpatcher().newdefault(20+200*i,380,"flonum")
		
		
		
		playerArr.push(thisplay)
		itemVolArr.push(thislocalflonum)
		soundPatch.subpatcher().connect(thisplay,0,thisadd,0)
		soundPatch.subpatcher().connect(thisplay,1,thisadd,1)
		soundPatch.subpatcher().connect(thisadd,0,thislocalvol,0)
		soundPatch.subpatcher().connect(thislocalflonum,0,thislocalpack,0)
		soundPatch.subpatcher().connect(thislocalpack,0,thislocalline,0)
		soundPatch.subpatcher().connect(thislocalline,0,thislocalvol,1)
		soundPatch.subpatcher().connect(thislocalvol,0,thislocalvol2,0)
		soundPatch.subpatcher().connect(thislocalvol2,0,matrix,i)
		matrixctrl.message("list",i,i,1)

 	
	}
	//muteArr[i].message("int",((mutebuttonArr[i]-1)*-1))
	muteArrToggles = []
	volSlidersFloat = []
	for(var i =0;i<trackCount;i++){
		var muteObject = soundPatch.subpatcher().newdefault(20+200*i,500,"*~")
		var muteToggle = soundPatch.subpatcher().newdefault(60+200*i,500,"toggle")
		var volObject = soundPatch.subpatcher().newdefault(20+200*i,500,"*~")
		var volSl = soundPatch.subpatcher().newdefault(60+200*i,500,"flonum")
		var packvol = soundPatch.subpatcher().newdefault(60+200*i,500,"pack","f",20)
		var linevol = soundPatch.subpatcher().newdefault(60+200*i,500,"line~")
		muteArrToggles.push(muteToggle)
		volSlidersFloat.push(volSl)
		soundPatch.subpatcher().connect(matrix,i,muteObject,0)
		soundPatch.subpatcher().connect(muteToggle,0,muteObject,1)
		soundPatch.subpatcher().connect(volSl,0,packvol,0)
		soundPatch.subpatcher().connect(packvol,0,linevol,0)
		soundPatch.subpatcher().connect(linevol,0,volObject,1)
		soundPatch.subpatcher().connect(muteObject,0,volObject,0)
		soundPatch.subpatcher().connect(volObject,0,mcpack,i)
		muteArrToggles[i].message("int",((mutebuttonArr[i]-1)*-1))
		volSlidersFloat[i].message("float",((volSliderArr[i]/95)==0)?0:(Math.pow(10,(((volSliderArr[i]*45/95)-25)/20))/10))
		
 	}
	closePatcher2(this.patcher,soundPatch,soundPatch.subpatcher(),toremovein)
	var mcLive
	mcLive = this.patcher.getnamed("DAW_Master")
	if(!mcLive)
		mcLive = this.patcher.newdefault(this.box.rect[0],this.box.rect[3]+20,"mc.live.gain~","@orientation",1,"@varname","DAW_Master")
	
	this.patcher.connect(soundPatch,0,mcLive,0)

	
	
}


// Auxiliary functions

function closePatcher2(patch,subpatch,subpatch2,inletToDelete)
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
	var tsk2 = new Task(mytask2, this,args);
	tsk2.schedule(10)

}
function closePatcher(patch,subpatch)
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
	//post(patch)
	var tsk = new Task(mytask, this,args);
	tsk.schedule(10)

}

function linearFuncInterpolation(arr,point,n){
    var initialPoint
	var countPoint
	var countPoint0
	var incr = 0
	 for(var i = 0;i<arr.length;i++){
	if(arr[i].n==n){
		if(incr==0){
			countPoint0 = i
			incr = 1
		}
		countPoint = i
    }
	}
    for(var i = 0;i<arr.length;i++){
	if(arr[i].n==n){
        if(arr[i].x>point){
            initialPoint = i
            break
        }
    }
	}
    var returned_value
    if(!initialPoint && initialPoint!=0)
        return arr[countPoint].y
    

	if(!arr[initialPoint-1])
		return arr[countPoint0].y
    var p0 = arr[initialPoint-1]
    var p1 = arr[initialPoint]
    return returned_value = (p0.y*(p1.x-point)+p1.y*(point-p0.x))/(p1.x-p0.x)
}

function mytask(args){

	args[0].remove(args[1])
	args[0].remove(args[2])
	args[0].remove(args[3])

}

function mytask2(args){

	args[0].remove(args[1])
	args[0].remove(args[2])
	args[0].remove(args[3])
	
	args[4].remove(args[5])


}

// Recreate a save function
function writeSession(){
	var writem = this.patcher.newdefault(20,20,"message")
	writem.message("set","write")
	var thispatcher = this.patcher.newdefault(20,20,"thispatcher")
	this.patcher.connect(writem,0,thispatcher,0)
	writem.message("bang")
	this.patcher.remove(writem)
	this.patcher.remove(thispatcher)
	//writePatch.message("bang")
	//post("written")
}
var writetask = new Task(writeSession, this);
var savetask = new Task(saveSession, this);
function save(){
	if(max.cmdkeydown)
		savetask.schedule(10)// every milisecond
}

// Store the information in a message box

function saveSession(){
	var savedInfoLoadbang 
	var savedInfo
	var savedDel
	if(!processFiles.subpatcher().getnamed("savedInfoList")){
		savedInfo = processFiles.subpatcher().newdefault(400,100,"message","@varname","savedInfoList")
		savedInfoLoadbang = processFiles.subpatcher().newdefault(400,20,"loadbang")
		savedDel = processFiles.subpatcher().newdefault(400,60,"del",50)
		savedInfoLoadbang.varname = "loadbangSave"
		savedDel.varname = "delaySave"
	}
	else{
		savedInfo=	processFiles.subpatcher().getnamed("savedInfoList")
		processFiles.subpatcher().remove(savedInfo)
		savedInfo = processFiles.subpatcher().newdefault(400,100,"message","@varname","savedInfoList")
		
		savedInfoLoadbang=	processFiles.subpatcher().getnamed("loadbangSave")
		processFiles.subpatcher().remove(savedInfoLoadbang)
		savedInfoLoadbang = processFiles.subpatcher().newdefault(400,20,"loadbang")
		savedInfoLoadbang.varname = "loadbangSave"
		
		savedDel=	processFiles.subpatcher().getnamed("delaySave")
		processFiles.subpatcher().remove(savedDel)
		savedDel = processFiles.subpatcher().newdefault(400,60,"del",50)
		savedDel.varname = "delaySave"
	}
	
	processFiles.subpatcher().connect(savedInfoLoadbang,0,savedDel,0)
	processFiles.subpatcher().connect(savedDel,0,savedInfo,0)
	processFiles.subpatcher().connect(savedInfo,0,processFilesOutlet,0)
	
	for(var i =0;i<arraySoundFiles.length;i++){
		//pos,track,split,splitOrder
		savedInfo.message("append","newFile")
		savedInfo.message("append",arraySoundFiles[i].length)
		savedInfo.message("append",arraySoundFiles[i].filename)
		savedInfo.message("append",arraySoundFiles[i].pos)
		savedInfo.message("append",arraySoundFiles[i].track)
		savedInfo.message("append",arraySoundFiles[i].split)
		savedInfo.message("append",arraySoundFiles[i].splitOrder)
		savedInfo.message("append",arraySoundFiles[i].volume)
		savedInfo.message("append",trackCount)
		savedInfo.message("append",",")
		savedInfo.message("append","newBuffer")
		savedInfo.message("append",fileNamesArr[i])
		savedInfo.message("append",1)
		savedInfo.message("append",",")
	}
	for(var i =0;i<trackCount;i++){
		//pos,track,split,splitOrder
		savedInfo.message("append","setTrackState")
		savedInfo.message("append",i)
		savedInfo.message("append",solobuttonArr[i])
		savedInfo.message("append",mutebuttonArr[i])
		savedInfo.message("append",fixedmuteArr[i])
		savedInfo.message("append",volSliderArr[i])
		savedInfo.message("append",",")
	}
	//automationCoordsArr =[]
//var automatedArr = []
//var automatedStrings = []
	for(var i =0;i<automatedStrings.length;i++){
		//pos,track,split,splitOrder
		savedInfo.message("append","initiateAutom")
		savedInfo.message("append",automatedStrings[i])
		for(var j =0;j<automationCoordsArr[automatedStrings[i]].length;j++){
			savedInfo.message("append",automationCoordsArr[automatedStrings[i]][j].x)
			savedInfo.message("append",automationCoordsArr[automatedStrings[i]][j].y)
		}
		savedInfo.message("append",",")
	}

	writetask.schedule(1000)
	
	
}
var processFiles
var processFilesOutlet
var dropfiles
var writePatch

var inittask= new Task(initialisation, this);
inittask.schedule(100)

// initialise patch when created

function initialisation(){
	if(!this.patcher.getnamed("processFilesPatch")){
		processFiles = this.patcher.newdefault(this.box.rect[0]+120,this.box.rect[1]+60,"p","processFiles")
		processFiles.subpatcher().wind.visible = 0
		processFiles.varname = "processFilesPatch"
		var processInlet = processFiles.subpatcher().newdefault(20,20,"inlet")
		var processtll = processFiles.subpatcher().newdefault(20,80,"t","l","l")
		var processregexp = processFiles.subpatcher().newdefault(20,140,"regexp",".+\\.(?i:aiff?|wave?|mp3?)")
		var processzl = processFiles.subpatcher().newdefault(20,200,"zl.reg")
		var processtll2 = processFiles.subpatcher().newdefault(20,260,"t","l","l")
		var processprepend = processFiles.subpatcher().newdefault(20,320,"prepend","newBuffer")
		var processprepend2 = processFiles.subpatcher().newdefault(180,320,"prepend","open")
		var processsfinfo = processFiles.subpatcher().newdefault(180,380,"sfinfo~")
		var processsfpack = processFiles.subpatcher().newdefault(180,440,"pack","f","s")
		var processprepend3 = processFiles.subpatcher().newdefault(180,500,"prepend","newFile")
		var key = processFiles.subpatcher().newdefault(400,20,"key")
		var sel119 = processFiles.subpatcher().newdefault(400,80,"sel",119)
		var hidemess = processFiles.subpatcher().newdefault(400,160,"message")
		hidemess.message("set","hide_automations")
		processFilesOutlet = processFiles.subpatcher().newdefault(20,560,"outlet","@varname","processFilesOutlet")
		processFiles.subpatcher().connect(key,3,sel119,0)
		processFiles.subpatcher().connect(sel119,0,hidemess,0)
		processFiles.subpatcher().connect(hidemess,0,processFilesOutlet,0)
		processFiles.subpatcher().connect(processInlet,0,processtll,0)
		processFiles.subpatcher().connect(processtll,0,processregexp,0)
		processFiles.subpatcher().connect(processtll,1,processzl,1)
		processFiles.subpatcher().connect(processregexp,2,processzl,0)
		processFiles.subpatcher().connect(processzl,0,processtll2,0)
		processFiles.subpatcher().connect(processtll2,0,processprepend,0)
		processFiles.subpatcher().connect(processtll2,1,processprepend2,0)
		processFiles.subpatcher().connect(processprepend,0,processFilesOutlet,0)
		processFiles.subpatcher().connect(processprepend2,0,processsfinfo,0)
		processFiles.subpatcher().connect(processsfinfo,3,processsfpack,0)
		processFiles.subpatcher().connect(processsfinfo,5,processsfpack,1)
		processFiles.subpatcher().connect(processsfpack,0,processprepend3,0)
		processFiles.subpatcher().connect(processprepend3,0,processFilesOutlet,0)
		closePatcher(this.patcher,processFiles)
		this.patcher.hiddenconnect(processFiles,0,this.box,0)
	}
	else{
		processFiles = this.patcher.getnamed("processFilesPatch")
		processFilesOutlet = processFiles.subpatcher().getnamed("processFilesOutlet")
	}
	if(!this.patcher.getnamed("dropfilesBox")){
		dropfiles = this.patcher.newdefault(this.box.rect[0]+120,this.box.rect[1]+60,"dropfile","@varname","dropfilesBox")
		var rectangle = new Array();
		rectangle[0] = dropfiles.rect[0];
		rectangle[1] = dropfiles.rect[1];
		rectangle[2] = this.box.rect[2];
		rectangle[3] = this.box.rect[3];
		dropfiles.rect = rectangle;
		this.patcher.hiddenconnect(dropfiles,0,processFiles,0)
	}
	else{
		dropfiles = this.patcher.getnamed("dropfilesBox")
	}
}	

// Move all the secondary objects whit the main box
function handleMove()
{
	if(this.box.rect[2]-this.box.rect[0]<600)
	{
			box.size(600,this.box.rect[3]-this.box.rect[1])
	}
	if(this.box.rect[3]-this.box.rect[1]<300)
	{
		box.size(this.box.rect[2]-this.box.rect[0],300)
	}
	
	if(dropfiles){
	var rectangle = new Array();
		rectangle[0] = this.box.rect[0]+120;
		rectangle[1] = this.box.rect[1]+60;
		rectangle[2] = this.box.rect[2];
		rectangle[3] = this.box.rect[3];
		dropfiles.rect = rectangle;
	}
	var thissoundPatch = this.patcher.getnamed("DAWSoundManager")
	if(thissoundPatch){
	var rectangle = new Array();
		rectangle[0] = this.box.rect[0];
		rectangle[1] = this.box.rect[3]-21;
		rectangle[2] = this.box.rect[2];
		rectangle[3] = 20;
		thissoundPatch.rect = rectangle;
	}
	if(processFiles){
	var rectangle = new Array();
		rectangle[0] = this.box.rect[0]+120;
		rectangle[1] = this.box.rect[1]+60;
		rectangle[2] = this.box.rect[0]+120+100;
		rectangle[3] = this.box.rect[1]+60+20;
		processFiles.rect = rectangle;
	}
	if(FxTracks){
	var rectangle = new Array();
		rectangle[0] = this.box.rect[0]+120;
		rectangle[1] = this.box.rect[1]+60;
		rectangle[2] = this.box.rect[0]+220;
		rectangle[3] = this.box.rect[1]+80;
		FxTracks.rect = rectangle;
	}
	//FxTracks
}
handle = new Task(handleMove,this)
handle.interval = 1; // every milisecond
handle.repeat();
	
