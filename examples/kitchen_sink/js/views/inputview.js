inputview = (function() {
       
      var module = {
      
       
        App: (function() {
        
            var nameInput = null;
            var passwordInput = null;
            var multiLineInput = null;
        			
             return {
                init: function() {

                    inputview.App.initInputs();
              
                },
                initInputs: function() {
              
                    // CALLED ON OPEN AFTER INPUTS SIMPLE PAGE
                    mm.App.addFunction("INPUTS_SIMPLE_PAGE_AFTER_OPEN", function(pageIn) {
                    
                        // NECESSARY TO SET THIS HERE FOR iOS, BECAUSE NEED
                        // DOUBLE CLICK ON iOS TO BRING UP THE KEYBOARD.
                        // ON OTHER SYSTEMS THIS IS NOT NECESSARY
                    
                        // SET NAME INPUT TO EDITING
                        nameInput = mm.App.getWidget(pageIn, "NameInput");
                        nameInput.closeEditOnEnter = false;
                        mm.Inputs.editInput(nameInput, 0, 0);
                        
                        // SET PASSWORD INPUT TO EDITING
                        passwordInput = mm.App.getWidget(pageIn, "PasswordInput");
                        passwordInput.closeEditOnEnter = false;
                        mm.Inputs.editInput(passwordInput, 0, 0);
                        
                        // SET MULTILINE INPUT TO EDITING
                        multiLineInput  = mm.App.getWidget(pageIn, "MultiLineInput");
                        multiLineInput.closeEditOnEnter = false;
                        mm.Inputs.editInput(multiLineInput, 0, 0);

                        
                    });
                
        
                    // CALLED ON CLOSE INPUTS SIMPLE PAGE
                    mm.App.addFunction("INPUTS_SIMPLE_PAGE_CLOSE", function(pageIn) {
                        
                        // STOP NAME INPUT FROM BEING EDITED
                        mm.Inputs.closeInput(nameInput);
                        
                        // STOP PASSWORD INPUT FROM BEING EDITED
                        mm.Inputs.closeInput(passwordInput);
                        
                        // STOP MULTILINE INPUT FROM BEING EDITED
                        mm.Inputs.closeInput(multiLineInput);
                    });
              
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();