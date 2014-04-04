main = (function() {
       
      var module = {
      
       
        App: (function() {
        
					
             return {
                init: function() {
                
                    mm.App.initMessages("config/messages/messages_en.xml", "Main", function() {
                
                        mm.App.initCanvasXML("canvasFlax", "config/app/common.xml", "config/app/pageflow.xml", function() {
                
							main.App.initButtonAction();
				
                            // START THE APP
                            mm.App.start();
                            
                        });
                  
                    });
                
                },
				initButtonAction: function() {
					// ADD BUTTON ACTION
					mm.App.addFunction("BUTTON_ACTION", function(buttonIn, xIn, yIn) {
						// SHOW ID OF BUTTON
						alert(buttonIn.m.id);
                    });
				}
            };
        })()
        
       
       	};
    
    
    
	return module;
})();

$(document).ready(function() {

    main.App.init();

});

    





