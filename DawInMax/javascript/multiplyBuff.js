

function coords(x,y,n) {
  this.x = x;
  this.y = y
  this.n = n
}

function recall(index){
	var this_main = (this.patcher.parentpatcher.parentpatcher)
	this_main =this_main.getnamed("processFilesPatch").subpatcher()
	var pointMainMess =this_main.getnamed("pointMainMess"+index)
	var funcObj = this.patcher.getnamed("functionObject")
	if(pointMainMess){
			var prob_arr = pointMainMess.getvalueof()
			//post("hola - "+prob_arr)
			for(var i = 0;i<prob_arr.length/3;i++){
				funcObj.message("setvalue",prob_arr[2+i*3]+1, prob_arr[i*3], prob_arr[1+i*3])
			}
			
	}
}
function calcBuff(index){
	var this_main = (this.patcher.parentpatcher.parentpatcher)
	this_main =this_main.getnamed("processFilesPatch").subpatcher()
	var pointMainMess =this_main.getnamed("pointMainMess"+index)
	var pointMainMessSave =this_main.getnamed("pointMainMessSave"+index)
	var pointMainMessLoad =this_main.getnamed("pointMainMessLoad"+index)
var funcObj = this.patcher.getnamed("functionObject")
var vArr = funcObj.getvalueof()
var buff = new Buffer("a"+index);
var buff2 = new Buffer("b"+index);
var k = buff.framecount() - 1
var nFunc
var makePitchshift = false
var makeLowpass = false
var arrFunction = []
var counterFunc
var this_is_active=true
var this_is_active2 = false
var gate1 = false
for(var i = 0;i<vArr.length;i++){
	if(vArr[i]=="linear")
		continue
	if(vArr[i]=="data"){	
		gate1 = true
		continue
	}
	if(gate1){
		nFunc = vArr[i]
		gate1 = false
		counterFunc = 0
		continue
	}
	counterFunc = 	counterFunc+1
	if(counterFunc<5){
		continue
	}	
		if(this_is_active&&!this_is_active2){
			arrFunction.push(new coords(vArr[i],vArr[i+1],nFunc))
			this_is_active=false
			this_is_active2 = true
		}else if(this_is_active2){
			this_is_active2=false
		}else
			this_is_active=true
	
}
		for (var i=0; i< k; i++) {
			tmp = buff.peek(0, i, 1);
			funcVal = linearFuncInterpolation(arrFunction,i/48,0)
			buff2.poke(0, i, tmp*funcVal);
		}
	if(pointMainMess){
		this_main.remove(pointMainMess)
		this_main.remove(pointMainMessSave)
		this_main.remove(pointMainMessLoad)
	}
	var concatenateArr = []
	pointMainMessLoad = this_main.newdefault(20,20,"loadbang")
	pointMainMessLoad.varname = "pointMainMessLoad"+index
	pointMainMessSave = this_main.newdefault(20,20,"message","@varname","pointMainMessSave"+index)
	pointMainMess = this_main.newdefault(20,20,"multislider","@varname","pointMainMess"+index,"@setminmax", 0, 600000)
	this_main.connect(pointMainMessSave,0,pointMainMess,0)
	this_main.connect(pointMainMessLoad,0,pointMainMessSave,0)
	makePitchshift = false
	makeLowpass = false
	for (var i=0; i< arrFunction.length; i++) {
		concatenateArr.push(arrFunction[i].x)
		concatenateArr.push(arrFunction[i].y)
		concatenateArr.push(arrFunction[i].n)
		pointMainMessSave.message("append",arrFunction[i].x)
		pointMainMessSave.message("append",arrFunction[i].y)
		pointMainMessSave.message("append",arrFunction[i].n)
		if(arrFunction[i].n==1)
			makePitchshift = true
		if(arrFunction[i].n==2)	
			makeLowpass = true
	}
	//post("adeu")
	pointMainMess.message("list",concatenateArr)
	if(makePitchshift){
		var thisadd = this.patcher.parentpatcher.getnamed("thisadd_"+index)
		var thismult = this.patcher.parentpatcher.getnamed("thislocalvol_"+index)
		if(!this.patcher.parentpatcher.getnamed("thispitchshift_"+index)){
			this.patcher.parentpatcher.disconnect(thisadd,0,thismult,0)
			var thispitchshift = this.patcher.parentpatcher.newdefault(20,20,"pfft~","gizmo_loadme",2048,4)
			var pitchfloat = this.patcher.parentpatcher.newdefault(20,20,"flonum","@varname","thispitchshift_"+index)
			this.patcher.parentpatcher.connect(thisadd,0,thispitchshift,0)
			this.patcher.parentpatcher.connect(pitchfloat,0,thispitchshift,1)
			this.patcher.parentpatcher.connect(thispitchshift,0,thismult,0)
		}
	}
	if(makeLowpass){
		var thisadd = this.patcher.parentpatcher.getnamed("thislocalvol_"+index)
		var thismult = this.patcher.parentpatcher.getnamed("thislocalvol2_"+index)
		if(!this.patcher.parentpatcher.getnamed("thislowpass_"+index)){
			this.patcher.parentpatcher.disconnect(thisadd,0,thismult,0)
			var thissvf = this.patcher.parentpatcher.newdefault(20,20,"svf~",0.,0.75)
			var lowfloat = this.patcher.parentpatcher.newdefault(20,20,"flonum","@varname","thislowpass_"+index)
			var lowpack = this.patcher.parentpatcher.newdefault(20,20,"pack","f",100)
			var lowline = this.patcher.parentpatcher.newdefault(20,20,"line","0.")
			this.patcher.parentpatcher.connect(thisadd,0,thissvf,0)
			this.patcher.parentpatcher.connect(lowfloat,0,thissvf,1)
			//this.patcher.parentpatcher.connect(lowpack,0,lowline,0)
			//this.patcher.parentpatcher.connect(lowline,0,thissvf,1)
			this.patcher.parentpatcher.connect(thissvf,1,thismult,0)
		}
	}
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