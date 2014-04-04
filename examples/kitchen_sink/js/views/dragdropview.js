dragdropview = (function() {
       
      var module = {
      
       
        App: (function() {
        
        			
             return {
                init: function() {
                
                    // DROP_EMAIL_ON_BIN
                    mm.App.addFunction("DROP_EMAIL_ON_BIN", function(ctx, xIn, yIn, emailIn, binIn, moveOver) {
                        // REMOVE EMAIL
                        emailIn.m.hidden = true;
                        binIn.m.associatedObject = emailIn;
                    });
              
                    // ADD BIN CLICK ACTION
                    mm.App.addFunction("EMPTY_BIN_ACTION", function(binIn, xIn, yIn) {
                        if (binIn.m.associatedObject != null) {
                            binIn.m.associatedObject.m.hidden = false;
                        }
                    });
                
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();