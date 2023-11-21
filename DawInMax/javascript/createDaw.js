
t = new Task(setupDaw,this)
function setupDaw(){
	var dawBox = this.patcher.box
	var mainPatch = this.patcher.parentpatcher

	var daw = mainPatch.newdefault(dawBox.rect[0],dawBox.rect[1],"jsui","@filename","daw_object.js")
	mainPatch.remove(dawBox)
	daw.selected=1

}
t.schedule(10)

