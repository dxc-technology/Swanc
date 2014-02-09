main = (function() {
       
      var module = {
      
       
        App: (function() {
        
					
             return {
                init: function() {
                
                    mm.App.initMessages("config/messages/messages_en.xml", "Main", function() {
                
                        mm.App.initCanvasXML("canvasFlax", "config/app/common.xml", "config/app/pageflow.xml", function() {
                
                            // START THE APP
                            mm.App.start();
                            
                        });
                  
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

    





