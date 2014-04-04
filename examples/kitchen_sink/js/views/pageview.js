pageview = (function() {
       
      var module = {
      
       
        App: (function() {
        
            var pageFlow = null;
            var simplePage = null;
            var sidePage = null;
        
        			
             return {
                init: function() {


                    pageFlow = mm.App.getWidget(mm.App.getScreen(), "MainPageFlow");
                    simplePage = mm.Pages.getPageInPageFlow(pageFlow, "SimplePage");
                    sidePage = mm.Pages.getPageInPageFlow(pageFlow, "SidePage");
              
                    // FULL PAGE TRANSFORMATION
                    pageview.App.initFullPageTransformation();
              
                    // PARTIAL PAGE TRANSFORMATION
                    pageview.App.initPartialPageTransformation();
              
                    // FOR SWIPE FUNCTIONS
                    pageview.App.initSwipe();
              
              
              
                },
                initFullPageTransformation: function() {
                    mm.App.addFunction("PAGE_FLOW_UP_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_UP", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_FLOW_DOWN_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_DOWN", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_FLOW_LEFT_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_LEFT", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_FLOW_RIGHT_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_RIGHT", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_SLIDE_UP_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_UP", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_SLIDE_DOWN_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_DOWN", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_SLIDE_LEFT_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_LEFT", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_SLIDE_RIGHT_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_RIGHT", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
              
                    mm.App.addFunction("PAGE_FADE_IN_ACTION", function(buttonIn, xIn, yIn) {
                    
                        simplePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FADE_IN", null, null);
                    
                        mm.Pages.openPageByPageId(pageFlow, "SimplePage", null);
                    });
                },
                initPartialPageTransformation: function() {
              
              
                    mm.App.addFunction("PARTIAL_PAGE_FLOW_RIGHT_ACTION", function(buttonIn, xIn, yIn) {
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_RIGHT", null, null);
                    
                            // SET IT FINAL X and Y POS TO 0
                            sidePage.m.x = 0;
                            sidePage.m.y = 0;
                            
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w * 0.2);
                            
                            console.log("SIDE PAGE " + sidePage.m.x );
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_FLOW_LEFT_ACTION", function(buttonIn, xIn, yIn) {
                    
                
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_LEFT", null, null);
                    
                            // SET X TO 80% of the screen width
                            sidePage.m.x = Math.floor(mm.App.getScreen().m.w * 0.8);
                            
                            console.log("SIDE PAGE " + sidePage.m.x );
                            
                            // SET Y to 0
                            sidePage.m.y = 0;
                            
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w * 0.2);
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_FLOW_UP_ACTION", function(buttonIn, xIn, yIn) {
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_UP", null, null);
                    
                            // SET X TO 80% of the screen height
                            sidePage.m.y = Math.floor(mm.App.getScreen().m.h * 0.8);
                            sidePage.m.x = 0;
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h * 0.2);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w);
                            
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_FLOW_DOWN_ACTION", function(buttonIn, xIn, yIn) {
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_FLOW_DOWN", null, null);
                    
                            // SET IT FINAL X and Y POS TO 0
                            sidePage.m.x = 0;
                            sidePage.m.y = 0;
                            
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h * 0.2);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w);
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_SLIDE_RIGHT_ACTION", function(buttonIn, xIn, yIn) {
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_RIGHT", null, null);
                    
                            // SET IT FINAL X and Y POS TO 0
                            sidePage.m.x = 0;
                            sidePage.m.y = 0;
                            
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w * 0.2);
                            
                            console.log("SIDE PAGE " + sidePage.m.x );
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_SLIDE_LEFT_ACTION", function(buttonIn, xIn, yIn) {
                    
                
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_LEFT", null, null);
                    
                            // SET X TO 80% of the screen width
                            sidePage.m.x = Math.floor(mm.App.getScreen().m.w * 0.8);
                            
                            console.log("SIDE PAGE " + sidePage.m.x );
                            
                            // SET Y to 0
                            sidePage.m.y = 0;
                            
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w * 0.2);
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_SLIDE_UP_ACTION", function(buttonIn, xIn, yIn) {
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_UP", null, null);
                    
                            // SET X TO 80% of the screen height
                            sidePage.m.y = Math.floor(mm.App.getScreen().m.h * 0.8);
                            sidePage.m.x = 0;
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h * 0.2);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w);
                            
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                    mm.App.addFunction("PARTIAL_PAGE_SLIDE_DOWN_ACTION", function(buttonIn, xIn, yIn) {
                    
                        // BEFORE WE OPEN THE PAGE, CHECK THAT IT IS CLOSED
                        if (sidePage.pageFullyOpen == false) {
                            sidePage.pageFlowController = mm.Pages.getPageFlowController("PAGE_SLIDE_DOWN", null, null);
                    
                            // SET IT FINAL X and Y POS TO 0
                            sidePage.m.x = 0;
                            sidePage.m.y = 0;
                            
                            sidePage.m.h = Math.floor(mm.App.getScreen().m.h * 0.2);
                            sidePage.m.w = Math.floor(mm.App.getScreen().m.w);
                        
                            mm.Pages.openPageByPageId(pageFlow, "SidePage", null);
                        
                        }
                    });
              
                },
                initSwipe: function() {
              
              
                    mm.App.addFunction("CLOSE_SWIPE_INFO_BOX", function(widgetIn, xIn, yIn) {
                        mm.App.deleteWidgetFromParent(widgetIn);
                    });
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();