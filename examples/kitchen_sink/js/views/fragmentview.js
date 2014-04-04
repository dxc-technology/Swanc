fragmentview = (function() {
       
      var module = {
      
       
        App: (function() {
        
            var pageFlow = null;
        			
             return {
                init: function() {


                     pageFlow = mm.App.getWidget(mm.App.getScreen(), "MainPageFlow");
              

                    // FRAGMENTS
                    fragmentview.App.initFragments();
              
              
              
                },
                initFragments: function() {
                    // CHANGE COLOUR OF FRAGMENT
                    mm.App.addFunction("FRAGMENT_CHANGE_COLOUR", function(fragmentIn, xIn, yIn) {
                    
                        if (fragmentIn.s.colour == "#000000") {
                            fragmentIn.s.colour = "#00C8FA";
                        } else {
                            fragmentIn.s.colour = "#000000";
                        }
                    });
              
                    // SHOW A POPUP
                    mm.App.addFunction("FRAGMENT_POPUP_ACTION", function(fragmentIn, xIn, yIn) {
                        
                        var fragmentPopup = mm.App.getWidget(pageFlow.currentShownPage, "FragmentPopup");
                        
                        fragmentPopup.m.hidden = false;
                    
                    });
              
              
                    // CLOSE POPUP
                    mm.App.addFunction("FRAGMENT_POPUP_CLOSE_ACTION", function(fragmentIn, xIn, yIn) {
                        
                        var fragmentPopup = mm.App.getWidget(pageFlow.currentShownPage, "FragmentPopup");
                        
                        fragmentPopup.m.hidden = true;
                    
                    });
              
              
                    // TAB 1
                    mm.App.addFunction("FRAGMENT_TAB1_ACTION", function(fragmentIn, xIn, yIn) {
                        
                        var fragmentTabExample = mm.App.getWidget(pageFlow.currentShownPage, "FragmentTabExample");
                        
                        var tab1 = mm.App.getWidget(fragmentTabExample, "FragmentTab1");
                        var tab2 = mm.App.getWidget(fragmentTabExample, "FragmentTab2");
                        var content1 = mm.App.getWidget(fragmentTabExample, "FragmentContent1");
                        var content2 = mm.App.getWidget(fragmentTabExample, "FragmentContent2");
                    
                        tab1.s.colour = "#EAEEF2";
                        tab2.s.colour = "#FFFFFF";
                        content1.m.hidden = false;
                        content2.m.hidden = true;
                    });
              
                    
                    // TAB 2
                    mm.App.addFunction("FRAGMENT_TAB2_ACTION", function(fragmentIn, xIn, yIn) {
                        
                        var fragmentTabExample = mm.App.getWidget(pageFlow.currentShownPage, "FragmentTabExample");
                        
                        var tab1 = mm.App.getWidget(fragmentTabExample, "FragmentTab1");
                        var tab2 = mm.App.getWidget(fragmentTabExample, "FragmentTab2");
                        var content1 = mm.App.getWidget(fragmentTabExample, "FragmentContent1");
                        var content2 = mm.App.getWidget(fragmentTabExample, "FragmentContent2");
                    
                        tab2.s.colour = "#EAEEF2";
                        tab1.s.colour = "#FFFFFF";
                        content2.m.hidden = false;
                        content1.m.hidden = true;
                    });
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();