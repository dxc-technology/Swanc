imageview = (function() {
       
      var module = {
      
       
        App: (function() {
        
            var pageFlow = null;
        			
             return {
                init: function() {


                    pageFlow = mm.App.getWidget(mm.App.getScreen(), "MainPageFlow");
              

                    // IMAGES
                    imageview.App.initImages();
              
              
              
                },
                initImages: function() {
              
              
              
                    // CHANGE TO BAD IMAGE
                    mm.App.addFunction("IMAGES_CHANGE_TO_BAD_RATING", function(imageIn, xIn, yIn) {
                        
                        var badImage = mm.App.getWidget(pageFlow.currentShownPage, "ImageBad");
                        
                        var goodImage = imageIn;
                        
                        badImage.m.hidden = false;
                        goodImage.m.hidden = true;
                    });
              
                    
                    // CHANGE TO GOOD IMAGE
                    mm.App.addFunction("IMAGES_CHANGE_TO_GOOD_RATING", function(imageIn, xIn, yIn) {
                        
                        var goodImage = mm.App.getWidget(pageFlow.currentShownPage, "ImageGood");
                        
                        var badImage = imageIn;
                        
                        badImage.m.hidden = true;
                        goodImage.m.hidden = false;
                    });
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();