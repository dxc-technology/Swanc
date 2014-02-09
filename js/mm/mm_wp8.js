$(document).ready(function() {

    mm.App.setDeviceType(DEVICE_WP8);
		
    // **** MOUSE EVENTS **********
    // FOR WINDOWS PHONE 8
    // MOUSE DOWN
    document.body.addEventListener("mousedown", function (evt) {
        onDown(evt.pageX, evt.pageY);
        return false;
    }, false);
    
    // MOUSE UP
    document.body.addEventListener("mouseup", function (evt) {
        onUp(evt.pageX, evt.pageY);
        return false;
    }, false);

    document.body.addEventListener("mousemove", function (evt) {
        onMove(evt.pageX, evt.pageY);
        return false;
    }, false);
    // ***** END MOUSE EVENTS ********
	
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
