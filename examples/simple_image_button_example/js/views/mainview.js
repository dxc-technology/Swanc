main = (function() {
       
      var module = {
      
       
        App: (function() {
        
					
             return {
                init: function() {
                
                    mm.App.initMessages("config/messages/messages_en.xml", "Main", function() {
                
                        mm.App.initCanvasXML("canvasSwanc", "config/app/common.xml", "config/app/pageflow.xml", function() {
                
							main.App.initPressMeButtonAction();
				
                            // START THE APP
                            mm.App.start();
                            
                        });
                  
                    });
                
                },
				initPressMeButtonAction: function() {
					// ADD PRESS ME BUTTON ACTION
					mm.App.addFunction("PRESS_ME_BUTTON_ACTION", function(buttonIn, xIn, yIn) {
						// SIMPLE HELLO WORLD ALERT
						alert(mm.App.getMessage("MSG_HELLO_WORLD"));
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

    





