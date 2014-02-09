$(document).ready(function() {

    mm.App.setDeviceType(DEVICE_IOS);
    
   function isKeyboardActive(xIn, yIn) {
    
        if (keyboardActive == false) {
            return false;
        } else {
            var active = false;
            var i = 0;
            while (i < keyboardActiveList.length && active == false) {
                    if (mm.Shapes.isInArea(xIn, yIn, keyboardActiveList[i].x,keyboardActiveList[i].y, keyboardActiveList[i].w, keyboardActiveList[i].h) == true) {
                        active = true;
                        mm.Inputs.setInputEditing(keyboardActiveList[i].input);
                    }
                    i = i + 1;
            }
            return active;
        }
    
    }
		
  		
    // ***** TOUCH EVENTS ********
    //When screen is touched
    document.ontouchstart = function(event) {
        var touchEvent = event.changedTouches[0];
        
        /*if (isKeyboardActive(touchEvent.pageX, touchEvent.pageY) == false) {
            event.preventDefault();
        }*/
	
        onDown(touchEvent.pageX, touchEvent.pageY);
	}

    //Similar to the mousemove event
    document.ontouchmove = function(event) {
    	
        event.preventDefault();
        var touchEvent = event.changedTouches[0];
	
        onMove(touchEvent.pageX, touchEvent.pageY);
			
    }
	
    document.ontouchend = function(event) {
        var touchEvent = event.changedTouches[0];
	
        onUp(touchEvent.pageX, touchEvent.pageY);
		
    }
	
    //Capture the touchend event.
    document.ontouchdown = function(event) {
    // DO NOTHING
    }
    // ***** END TOUCH EVENTS ********
	
    // ON UP TOUCH OR MOUSE
    function onUp(xIn, yIn) {
        
        var x = mm.FW.reCalculateXMouse(xIn);  // IF SCREEN RESCALED
        var y = mm.FW.reCalculateYMouse(yIn);  // IF SCREEN RESCALED
    
        x = x + mm.App.getRealScreenPosX();
        y = y + mm.App.getRealScreenPosY();
        
        if (isKeyboardActive(xIn, yIn) == false) {  // IF KEYBOARD ACTIVE WHOLE SCREEN LOCKED
            mm.FW.onUp(x, y);
        }
        
    }
		
    // ON MOVE TOUCH OR MOUSE
    function onMove(xIn, yIn) {
        var x = mm.FW.reCalculateXMouse(xIn);  // IF SCREEN RESCALED
        var y = mm.FW.reCalculateYMouse(yIn);  // IF SCREEN RESCALED
    
        x = x + mm.App.getRealScreenPosX();
        y = y + mm.App.getRealScreenPosY();
        
        if (isKeyboardActive(xIn, yIn) == false) { // IF KEYBOARD ACTIVE WHOLE SCREEN LOCKED
            mm.FW.onMove(x, y);
        }
    }
		
    // ON DOWN IF TOUCH OR MOUSE
    function onDown(xIn, yIn) {
    
        var x = mm.FW.reCalculateXMouse(xIn);  // IF SCREEN RESCALED
        var y = mm.FW.reCalculateYMouse(yIn);  // IF SCREEN RESCALED
        
        if (isKeyboardActive(x, y) == false) {
            event.preventDefault();
        }
    
        x = x + mm.App.getRealScreenPosX();
        y = y + mm.App.getRealScreenPosY();
    
         //d("on main down");
        if (isKeyboardActive(xIn, yIn) == false) {  // IF KEYBOARD ACTIVE WHOLE SCREEN LOCKED
            mm.FW.onDown(x, y);
        }
    }
});
