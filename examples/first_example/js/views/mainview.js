main = (function() {
       
      var module = {
      
       
        App: (function() {
        
					
             return {
                init: function() {
                
                    mm.App.initMessages("config/messages/messages_en.xml", "Main", function() {
                
                        mm.App.initCanvasXML("canvasSwanc", "config/app/common.xml", "config/app/pageflow.xml", function() {
                
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

    





