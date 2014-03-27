$(document).ready(function() {


    mm.App.setDeviceType(DEVICE_ANDROID);
		
    // **** MOUSE EVENTS **********
    // MOUSE DOWN
    document.body.addEventListener("mousedown", function(evt) {
        onDown(evt.pageX, evt.pageY);
    }, false);
        
    // MOUSE MOVE
    document.body.addEventListener("mousemove", function(evt) {
        onMove(evt.pageX, evt.pageY);
    }, false);
        
    // MOUSE UP
    document.body.addEventListener("mouseup", function(evt) {
            
        onUp(evt.pageX, evt.pageY);
    }, false);
    // ***** END MOUSE EVENTS ********
    
    // ***** TOUCH EVENTS ********
    //When screen is touched
    document.ontouchstart = function(event) {
        if (keyboardActive == false) {
            event.preventDefault();
        } 
        //d("on touch start");
        var touchEvent = event.changedTouches[0];
	
        onDown(touchEvent.pageX, touchEvent.pageY);
	}

    //Similar to the mousemove event
    document.ontouchmove = function(event) {
    	
        //event.preventDefault();
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
    
        xIn = mm.FW.reCalculateXMouse(xIn);  // IF SCREEN RESCALED
        yIn = mm.FW.reCalculateYMouse(yIn);  // IF SCREEN RESCALED
    
        xIn = xIn + mm.App.getRealScreenPosX();
        yIn = yIn + mm.App.getRealScreenPosY();
        
        if (keyboardActive == false) {  // IF KEYBOARD ACTIVE WHOLE SCREEN LOCKED
            mm.FW.onUp(xIn, yIn);
        }
    }
		
    // ON MOVE TOUCH OR MOUSE
    function onMove(xIn, yIn) {
        xIn = mm.FW.reCalculateXMouse(xIn);  // IF SCREEN RESCALED
        yIn = mm.FW.reCalculateYMouse(yIn);  // IF SCREEN RESCALED
    
        xIn = xIn + mm.App.getRealScreenPosX();
        yIn = yIn + mm.App.getRealScreenPosY(); 
        
        if (keyboardActive == false) {  // IF KEYBOARD ACTIVE WHOLE SCREEN LOCKED
            mm.FW.onMove(xIn, yIn);
        }
    }
		
    // ON DOWN IF TOUCH OR MOUSE
    function onDown(xIn, yIn) {
    
        xIn = mm.FW.reCalculateXMouse(xIn);  // IF SCREEN RESCALED
        yIn = mm.FW.reCalculateYMouse(yIn);  // IF SCREEN RESCALED
    
        xIn = xIn + mm.App.getRealScreenPosX();
        yIn = yIn + mm.App.getRealScreenPosY();
    
        if (keyboardActive == false) {  // IF KEYBOARD ACTIVE WHOLE SCREEN LOCKED
            mm.FW.onDown(xIn, yIn);
        }
    }
});
