main = (function() {
       
      var module = {
      
       
        MainApp: (function() {
        
            var pageFlow = null;
            
            var boxArray = new Array();
            
            var coverAnimation = null;
            
            var coverPage = null;
					
             return {
                init: function() {
                
                    mm.App.initMessages("config/messages/messages_en.xml", "Main", function() {
                
                        mm.App.initCanvasXML("canvasSwanc", "config/app/phone/common.xml", "config/app/phone/pageflow.xml", function() {
                
                            main.MainApp.initFunctions();
                            
                            // ADD THE COVER PAGE HERE
                            var coverAnimationWidgetClass = mm.App.getWidgetClass("CoverAnimation");
                            coverAnimation = mm.App.addWidgetX(null, coverAnimationWidgetClass);
                            mm.App.add(mm.App.getScreen(), coverAnimation);
                            
                            coverPage = mm.App.getWidget(coverAnimation, "CoverPage");
                            
                            // START THE APP
                            mm.App.start();
                            
                            // INIT DRAG DROP VIEW
                            dragdropview.App.init();
                            
                            // INIT THE PAGE VIEW
                            pageview.App.init();
                            
                            // INIT THE FRAGMENT VIEW
                            fragmentview.App.init();
                            
                            // IMAGES
                            imageview.App.init();
                            
                            // INPUT VIEW
                            inputview.App.init();
                            
                            // LIST VIEW
                            listview.App.init();
                            
                            // ANIMATION VIEW
                            animationview.App.init();
                            
                            
                           // var canvas = mm.App.getCanvas();
                           // console.log("canvas left " + canvas.position);
                           // console.log("canvas top " + canvas.top);
                            
                        });
                  
                    });
                
                },
                initFunctions: function() {
                    main.MainApp.coverPageAction();
                  
                },
                coverPageAction: function() {
                  
                    mm.App.addFunction("SWIPE_UP_COVER_PAGE", function(pageIn) {
                        mm.Animations.startAnimation(coverAnimation);
                    });
                  
                    mm.App.addFunction("ANIMATE_COVER_PAGE", function(ctxIn, xIn, yIn, animationIn) {
                    
                        if (coverPage.m.y > -480) {
                            coverPage.m.y = coverPage.m.y - 30;
                        } else {
                            mm.Animations.stopAnimation(coverAnimation);
                                
                            mm.App.deleteWidgetFromParent(coverAnimation);
                        }
                       
                    });
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();


    
function onDeviceReady() {

        main.MainApp.init();
    
}


$(document).ready(function() {

    onDeviceReady();

});


