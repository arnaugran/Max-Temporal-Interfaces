mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var max_dur = 10000;
var cursor = 0;
var width;
var height;
var data = [];
function t_value(t,v,i){
	this.t = t;
	this.v = v;
	this.i = i;
}

var mainPatcher = this.patcher;
while(mainPatcher.parentpatcher!=null){
	mainPatcher = this.patcher.parentpatcher;
}
var bpPatcher = mainPatcher.getnamed("breakpoints").subpatcher();
var objArray = [];

function refresh_data(){
	data = [];
	objArray = [];
	bpPatcher.apply(bangMessage);
	//sort data 
	for(var i = 0; i < objArray.length ; i++){
		data[objArray[i]].sort(function(a, b) {
    		return a.t - b.t;
		});
	}
}
function load_data(obj,t,value,interp){
	if(data[obj]==null){
		data[obj] = [];
		objArray.push(obj);
	}
	data[obj].push(new t_value(t,value,interp));
	
}

function set_max_dur(d){
	max_dur = d;
	set_cursor(Math.min(Math.max(cursor,0),max_dur));
	mgraphics.redraw();
}
var sendObject = null;
var sendObjectName = null;
function set_cursor(d){
	cursor = Math.min(Math.max(d,0),max_dur);
	mgraphics.redraw();
	var min = Math.floor(cursor/60000);
	var sec = Math.floor(cursor/1000) - Math.floor(cursor/60000)*60;
	var ms = cursor - Math.floor(cursor/1000)*1000;
	outlet(0, min,sec,ms);
	for(var i = 0; i < objArray.length ; i++){
		var sendValue = linearInterpolation(data[objArray[i]],cursor)
		sendObject = null;
		sendObjectName = objArray[i];
		mainPatcher.applydeep(searchObject);
		sendObject.setvalueof(sendValue);
	}
}
function searchObject(a) {
	if(a.varname == sendObjectName){
		sendObject = a;
	}
	return true;
}
var selectedNumberArray;

function clear_breakpoints(){
	selectedNumberArray = [];
	mainPatcher.applydeep(selectedObject);
	for(var i =0; i<selectedNumberArray.length;i++){
		selectedNumber = selectedNumberArray[i];
		if(selectedNumber.varname.slice(0,3)=="bp_"){
			var bpSubpatcher = bpPatcher.getnamed("patch_"+selectedNumber.varname)
			bpPatcher.remove(bpSubpatcher);
			selectedNumber.varname = "";
			selectedNumber.message("bgcolor",0.2,0.2,0.2);	
		}
	}
	refresh_data();
}
var tsk = new Task(wind_visib, this);
tsk.interval = 50; 
var openWindows = [];
function wind_visib(){
	var isvisible = 0;
	for(var i =0; i<openWindows.length;i++){
		if(openWindows[i].visible == 1){
			isvisible = 1;
		}
	}
	if(isvisible == 0){
		refresh_data();
		tsk.cancel();
	}
}
function edit_breakpoints(){
	selectedNumberArray = [];
	openWindows = [];
	mainPatcher.applydeep(selectedObject);
	for(var i =0; i<selectedNumberArray.length;i++){
		selectedNumber = selectedNumberArray[i];
		if(selectedNumber.varname.slice(0,3)=="bp_"){
			var bpSubpatcher = bpPatcher.getnamed("patch_"+selectedNumber.varname)
			var thispatcher = bpSubpatcher.subpatcher().getnamed("thispatcher");
			thispatcher.message("front");
			openWindows.push(bpSubpatcher.subpatcher().wind);
		}
	}
	tsk.repeat();
}

function add_breakpoint(){
	selectedNumberArray = [];
	mainPatcher.applydeep(selectedObject);
	for(var i =0; i<selectedNumberArray.length;i++){
	selectedNumber = selectedNumberArray[i];
	if(selectedNumber!=null){
		if(selectedNumber.varname.slice(0,3)!="bp_"){
			var namedString = "bp_"+Date.now();
			selectedNumber.varname = namedString;
			selectedNumber.message("bgcolor",0,0.1,1.);
			var bpSubpatcher = bpPatcher.newdefault(20,20,"p",namedString);
			bpSubpatcher.varname = "patch_"+namedString;
			bpSubpatcher.subpatcher().wind.visible = 0;
			var mess = bpSubpatcher.subpatcher().newdefault(20,20,"message");
			var prep = bpSubpatcher.subpatcher().newdefault(20,500,"prepend",namedString);
			var outl = bpSubpatcher.subpatcher().newdefault(20,550,"outlet");
			var thispatcher = bpSubpatcher.subpatcher().newdefault(100,550,"thispatcher");
			thispatcher.varname = "thispatcher";
			bpPatcher.connect(bpSubpatcher,0,bpPatcher.getnamed("prepend"),0);
			bpPatcher.connect(bpPatcher.getnamed("prepend"),0,bpPatcher.getnamed("outlet"),0);
			mess.varname = "message";
			bpSubpatcher.subpatcher().connect(mess,0,prep,0);
			bpSubpatcher.subpatcher().connect(prep,0,outl,0);
			mess.message("append", cursor)
			mess.message("append", selectedNumber.getvalueof())
			mess.message("append", 0)
			mess.message("append", ",")
		}else{
			var bpSubpatcher = bpPatcher.getnamed("patch_"+selectedNumber.varname)
			var mess = bpSubpatcher.subpatcher().getnamed("message");
			mess.message("append", cursor)
			mess.message("append", selectedNumber.getvalueof())
			mess.message("append", 0)
			mess.message("append", ",")
		}
	}
	}
	refresh_data()
}
function add_breakpoint_interpolated(){
	selectedNumberArray = [];
	mainPatcher.applydeep(selectedObject);
	for(var i =0; i<selectedNumberArray.length;i++){
	selectedNumber = selectedNumberArray[i];
	if(selectedNumber!=null){
		if(selectedNumber.varname.slice(0,3)!="bp_"){
			var namedString = "bp_"+Date.now();
			selectedNumber.varname = namedString;
			selectedNumber.message("bgcolor",0,0.1,1.);
			var bpSubpatcher = bpPatcher.newdefault(20,20,"p",namedString);
			bpSubpatcher.varname = "patch_"+namedString;
			bpSubpatcher.subpatcher().wind.visible = 0;
			var mess = bpSubpatcher.subpatcher().newdefault(20,20,"message");
			var prep = bpSubpatcher.subpatcher().newdefault(20,500,"prepend",namedString);
			var outl = bpSubpatcher.subpatcher().newdefault(20,550,"outlet");
			var thispatcher = bpSubpatcher.subpatcher().newdefault(100,550,"thispatcher");
			thispatcher.varname = "thispatcher";
			bpPatcher.connect(bpSubpatcher,0,bpPatcher.getnamed("prepend"),0);
			bpPatcher.connect(bpPatcher.getnamed("prepend"),0,bpPatcher.getnamed("outlet"),0);
			mess.varname = "message";
			bpSubpatcher.subpatcher().connect(mess,0,prep,0);
			bpSubpatcher.subpatcher().connect(prep,0,outl,0);
			mess.message("append", cursor)
			mess.message("append", selectedNumber.getvalueof())
			mess.message("append", 1)
			mess.message("append", ",")
		}else{
			var bpSubpatcher = bpPatcher.getnamed("patch_"+selectedNumber.varname)
			var mess = bpSubpatcher.subpatcher().getnamed("message");
			mess.message("append", cursor)
			mess.message("append", selectedNumber.getvalueof())
			mess.message("append", 1)
			mess.message("append", ",")
		}
	}
	}
	refresh_data()
}

function selectedObject(a) {
	if(a.selected == 1 && a.patcher.wind.visible==1 && a.maxclass == "number"){
		selectedNumberArray.push(a);
	}
	return true;
}

function bangMessage(a) {
	if(a.varname.slice(0,6)=="patch_"){
		a.subpatcher().getnamed("message").message("bang");
	}
	return true;
}

function linearInterpolation(arr,point){
    var initialPoint
	if(arr.length<1)
		return -1
    for(var i = 0;i<arr.length;i++){
        if(arr[i].t>point){
            initialPoint = i
            break
        }
    }
    var returned_value
    if(!initialPoint && initialPoint!=0)
        return arr[arr.length-1].v
    if(!arr[initialPoint-1])
		return arr[0].v
    var p0 = arr[initialPoint-1]
    var p1 = arr[initialPoint]
	if(p0.i==0){
		return p0.v
	}
	var returned_value = (p0.v*(p1.t-point)+p1.v*(point-p0.t))/(p1.t-p0.t)
    return returned_value
}

function paint()
{
	width = (box.rect[2] - box.rect[0]) ;
	height = (box.rect[3] - box.rect[1]) ;	
	
	with (mgraphics) {
		set_source_rgb(0.3,0.3,0.3);
		rectangle(0,0,width,height);
		fill();
		set_source_rgb(1,0.5,0.5);
		rectangle(4,4,(cursor/max_dur)*(width-8),height-8);
		fill();
	}
}

function onclick(x,y,but,cmd,shift,capslock,option,ctrl){
	set_cursor(Math.max(Math.min(((x-4)/(width-8))*max_dur,max_dur),0));
	
}
function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
	set_cursor(Math.max(Math.min(((x-4)/(width-8))*max_dur,max_dur),0));
}	

mgraphics.redraw();
var tsk2 = new Task(init, this);
tsk2.schedule(50);
function init(){
	refresh_data();
	set_cursor(0);
}