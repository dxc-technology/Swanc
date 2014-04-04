listview = (function() {
       
      var module = {
      
       
        App: (function() {
        
        	
              var simpleVerticalListPage = null;
              var simpleVerticalList = null;
              var onSwitchImage = null;
              var offSwitchImage = null;
              
              var simpleHorizontalListPage = null;
              var simpleHorizontalList = null;
              var onHSwitchImage = null;
              var offHSwitchImage = null;
              
              
             return {
                init: function() {

                    // FOR SIMPLE VERTICAL LIST PAGE
                    listview.App.initSimpleVerticalList();
              
                    // FOR SIMPLE HORIZONTAL LIST PAGE
                    listview.App.initSimpleHorizontalList();
              
              
                },
                initSimpleVerticalList: function() {
              
                     // CALLED WHEN THE SIMPLE VERTICAL LIST PAGE IS CALLED
                    mm.App.addFunction("LISTS_SIMPLE_VERTICAL_PAGE_OPEN", function(pageIn) {
                        
                        // GET ALL THE VARIABLES AND STORE THEM IN THIS MODULE
                        // LATER ON IN THE CODE IT WILL NOT BE NECESSARY TO KEEP GETTING THEM.
                        if (simpleVerticalListPage == null) {
                            simpleVerticalListPage = pageIn;
                        
                            var simpleVerticalListHeader = mm.App.getWidget(simpleVerticalListPage, "SimpleVerticalListHeader");
                            onSwitchImage = mm.App.getWidget(simpleVerticalListHeader, "ListOnSwitchImage");
                            offSwitchImage = mm.App.getWidget(simpleVerticalListHeader, "ListOffSwitchImage");
                            simpleVerticalList = mm.App.getWidget(simpleVerticalListPage, "SimpleVerticalList");
                        }
                    });
              
                    mm.App.addFunction("LIST_SIMPLE_VERTICAL_ON_ACTION", function(imageIn, xIn, yIn) {
                        onSwitchImage.m.hidden = true;
                        offSwitchImage.m.hidden = false;
                        simpleVerticalList.showOutOfArea = false;
                    });
              
                    mm.App.addFunction("LIST_SIMPLE_VERTICAL_OFF_ACTION", function(imageIn, xIn, yIn) {
                        onSwitchImage.m.hidden = false;
                        offSwitchImage.m.hidden = true;
                        simpleVerticalList.showOutOfArea = true;
                    });
                },
                initSimpleHorizontalList: function() {
              
                     // CALLED WHEN THE SIMPLE HORIZONTAL LIST PAGE IS CALLED
                    mm.App.addFunction("LISTS_SIMPLE_HORIZONTAL_PAGE_OPEN", function(pageIn) {
                        
                        // GET ALL THE VARIABLES AND STORE THEM IN THIS MODULE
                        // LATER ON IN THE CODE IT WILL NOT BE NECESSARY TO KEEP GETTING THEM.
                        if (simpleHorizontalListPage == null) {
                            simpleHorizontalListPage = pageIn;
                        
                            var simpleHorizontalListHeader = mm.App.getWidget(simpleHorizontalListPage, "SimpleHorizontalListHeader");
                            onHSwitchImage = mm.App.getWidget(simpleHorizontalListHeader, "ListHOnSwitchImage");
                            offHSwitchImage = mm.App.getWidget(simpleHorizontalListHeader, "ListHOffSwitchImage");
                            simpleHorizontalList = mm.App.getWidget(simpleHorizontalListPage, "SimpleHorizontalList");
                        }
                    });
              
                    mm.App.addFunction("LIST_SIMPLE_HORIZONTAL_ON_ACTION", function(imageIn, xIn, yIn) {
                        onHSwitchImage.m.hidden = true;
                        offHSwitchImage.m.hidden = false;
                        simpleHorizontalList.showOutOfArea = false;
                    });
              
                    mm.App.addFunction("LIST_SIMPLE_HORIZONTAL_OFF_ACTION", function(imageIn, xIn, yIn) {
                        onHSwitchImage.m.hidden = false;
                        offHSwitchImage.m.hidden = true;
                        simpleHorizontalList.showOutOfArea = true;
                    });
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();