//**************************************************************
//* SWANC - Main API
//*
//* Developed by Marcus Mascord
//* Contact: mmascord2@csc.com or mmascord@hotmail.com
//*
//* Swanc - Copyright (C) 2014 Computer Sciences Corporation
//*
//* Computer Sciences Corporation can be contacted at: info@csc.com
//*
//* Licensed under the Apache License, Version 2.0 (the "License"); you may not
//* use or distribute Project Swanc except in compliance with the License.
//* You may obtain a copy of the License at
//*
//*    http://www.apache.org/licenses/LICENSE-2.0
//*
//* Unless required by applicable law or agreed to in writing, software
//* distributed under the License is distributed on an "AS IS" BASIS,
//* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//* See the License for the specific language governing permissions and
//* limitations under the License.
//*
//**************************************************************

//**************************************************************
//* GLOBAL CONSTANTS AND VARIABLES
//**************************************************************
     
// Constants used to specify the OS Type or Phone Type
var DEVICE_WP8 = 6;    // Microsoft Windows Phone 8.
var DEVICE_FIREFOX = 5;  // Firefox phone.
var DEVICE_ANDROID = 2;   // Google Android Phones.
var DEVICE_BLACKBERRY = 3;  // Blackberry BB10 OS or PlayBook OS.
var DEVICE_OTHER = 4;    // Any other OS, normally a browser.
var DEVICE_IOS = 1;  // Apple iOS including iPhone and iPad.

// This is set to true when the keyboard is active.  The keyboard can be active on an Input widget being edited.
var keyboardActive = false;
// This stores a list of positions and sizes where a keyboard is active and the associated Input widget is being edited. 
var keyboardActiveList = new Array();  // Array of KeyboardPos class.

//**************************************************************
//* END GLOBAL CONSTANTS AND VARIABLES
//**************************************************************

//**************************************************************
//* GLOBAL FUNCTIONS
//**************************************************************

// Array Remove - OVERIDE
// Very useful functions that adds remove to arrays, so it is possible to remove elements
Array.prototype.remove = function(fromIn, toIn) {
    var rest = this.slice((toIn || fromIn) + 1 || this.length);
    if (fromIn < 0) {
        this.length = this.length + fromIn;
    } else {
        this.length = fromIn;
    }
    return this.push.apply(this, rest);
};

/*
++
This function tests for null values in JavaScript.
JavaScript does not automatically default a value to null, but to undefined,
so this tests for both conditions.  This can be used anywhere and is useful.
*/
function isNull(testIn) {
    return testIn == undefined || testIn == null;
}

//**************************************************************
//* END GLOBAL FUNCTIONS
//**************************************************************

//**************************************************************
//* mm is the main package for Swanc
//**************************************************************
mm = (function() {

    var module = {

        //**************************************************************
		//* MOVEMENT TYPES
		//* Movement types are used by the drag and drop functionality,
		//* they define what happens to a widget when an onDrop occurs.
		//* A widget is dragged from one container widget to another
		//* container widget.
		//**************************************************************
		
		/*
		++
		When a onDrop occurs nothing happends.
		*/
        NOTHING: function() {
            return "NOTHING";
        },
		
		/*
		++
		When a onDrop occurs the widget is copied, so we will have 2 widgets.
		The original widget stays in the original container widget and a new widget with
		the same values is added to the container widget under the drop.
		*/
        COPY: function() {
            return "COPY";
        },
		
		/*
		++
		When a onDrop occurs the widget is moved.
		The widget is moved from the original container widget to the container widget under the drop.
		*/
        MOVE: function() {
            return "MOVE";
        },
		
		/*
		TODO
		*/
        STICK: function() {
            return "STICK";
        },
		//**************************************************************
		//* END MOVEMENT TYPES
		//**************************************************************
        		
        //**************************************************************
		//* POSITION TYPES
		//* This are used to align the widget on the screen or within
		//* a container widget.
		//**************************************************************
		
		/*
		++
		Align the widget's bottom to its parent widget's bottom.
		*/
        BOTTOM: function() {
            return "BOTTOM";
        },
		
		/*
		++
		Align the widget's top to its parent widget's top. 
		*/
        TOP: function() {
            return "TOP";
        },
		
		/*
		++
		Align the widget's left side to its parent widget's left side. 
		*/
        LEFT: function() {
            return "LEFT";
        },
		
		/*
		++
		Align the widget's right side to its parent widget's right side. 
		*/
        RIGHT: function() {
            return "RIGHT";
        },
		
		/*
		++
		Align the widget in the center of its parent widget.
		*/
        CENTER: function() {
            return "CENTER";
        },
		//**************************************************************
		//* END POSITION TYPES
		//**************************************************************
			
		/*
		++
		
		TODO
		
		*/
        MoveOver: function() {
				         
            var self = {
                sourceType: null,
                moveDropAction: null,  // move drop action (ctx, x, y, widget source, widget target, movementType)
                moveOverAction: null,  // USE STANDARD IF this null standardOverAction
                moveOutOverAction: null,  // USE STANDARD IF this null standardOutOverAction
                movementType: mm.NOTHING()  // "NOTHING", "COPY", "MOVE", "STICK" 
            };
						 
            return self;
        },

        /*
        ++
        This Class is used when a widget is set to movable.  I.e the widget can be dragged
        by the user and moves around the screen.  Almost any widget can be set to movable.
        This Movable Class is used in the Widget.move attribute.
        */
        Movable: function() {
				  
            var self = {
                moving: false,  // Set to true when the widget is moving i.e being moved by the user.
                x: 0,
                y: 0,
                moveX: true,  // If set to false the widget cannot be moved along the x axis.
                moveY: true,  // If set to false the widget cannot be moved along the y axis.
                minX: null, // The x min limit, x value cannot be below this. If null, no limit.
                maxX: null, // The X max limit, y value cannot be above this.  If null, no limit.
                minY: null,  // The Y min limit, y value cannot be below this.  If null, no limit.
                maxY: null, // The Y max limit, y cannot be above this. If null, no limit.
                movable: false
            };

            return self;
        },
		
        //**************************************************************
        //* Collision Detection, used by the Animation widget.
        //**************************************************************
		
		/*
		++
		This is a collision circle zone.
		It is common to use a number of circle overlays on a sprite to
		represent the collision zone for that sprite.  Any widget can be
		considered a sprite.
		This is a circle collision overlay. 
 		*/
        CollisionCircleZone: function(xIn, yIn, radiusIn) {
            var self = {
                x: xIn,  // The x position in px, relative to the widget.
                y: yIn,  // The y position in px, relative to the widget.
                radius: radiusIn  // The radius of the circle.
            };
						
            return self;
        },
				
		/*
		++
		This is a collision rectangle zone.
		It is common to use a number of rectangle overlays on a sprite to
		represent the collision zone for that sprite.  Any widget can be
		considered a sprite.
		This is a rectangle collision overlay. 
 		*/
        CollisionRectangleZone: function(xIn, yIn, widthIn, heightIn) {
            var self = {
                x: xIn,  // The x position in px, relative to the widget.
                y: yIn,  // The y position in px, relative to the widget.
                w: widthIn,  // This is the width in px of the collision rectangle.
                h: heightIn  // This is the height in px of the collision rectangle.
            };
						
            return self;
        },
				  
		/*
		++
		This is the collision type.
		Stores an array of either CollisionRectangleZone or CollisionCircleZone,
		cannot have a mix of CollisionRectangleZone and CollisionCircleZone for the same CollisionType.
		However, a sprite (widget) can have any number of CollisionType objects.
		*/
        CollisionType: function(typeIn, shapeTypeIn, collisionZonesIn) {
            var self = {
                type: typeIn,  // Type
                shapeType: shapeTypeIn,  // This can be either "RECTANGLE" or "CIRCLE".
                collisionZones: collisionZonesIn, // Array of CollisionRectangleZone or CollisionCircleZone.
                id: null  // This is only used when the collision type is loaded from XML and not from JavaScript.
            };
						
            return self;
        },
	
		/*
		++
		This sets up what setup what happends when a collision is detected between
		two CollisionTypes.
		*/
        Collision: function(collisionTypeAIn, collisionTypeBIn, collisionActionIn) {
            var self = {
                collisionTypeA: collisionTypeAIn,  // CollisionType A  
                collisionTypeB: collisionTypeBIn,  // CollisionType B
                collisionAction: collisionActionIn  // Function called when collision detected.  Signature:  function(animationWidget, widgetA, widgetsB)
            };
						
            return self;
        },
      
		/*
		++
		This is used by each Animation widget.
		It stores all the CollisionType and Collision that can happen within this Animation.
		*/
        CollisionDetection: function() {
            var self = {
                collisionTypes: null,  // Array of CollisionType.
                collisions: null    // Array of Collision.
            };
      
            return self;
        },
        //**************************************************************
        //* END Collision Detection, used for Animation widget.
        //**************************************************************
      
        
        /*
        ++
        The WidgetClass corresponds to the <Widget> XML tag in the XML files.
        This class describes the widget.
        It is temporarily used to store the Widgets that are defined in XML.
        The WidgetClass is then converted into the appropriate Widget using the 
        function mm.App.addWidgetX.
        A Widget defined in the common.xml file, can be used in JavaScript.  To
        obtain the WidgetClass in JavaScript use the function mm.App.getWidgetClass, then
        use the function mm.App.addWidgetX to create an instance of the actual Widget.
        The WidgetClass is used internally extensively when reading the XML files.
        */
        WidgetClass: function(idIn) {
      
            var self = {
                id: idIn,  // This is the id of widget, if this is not to null then the id will be generated automatically.
                className: null,  // This is the standard class name for this widget, the name must correspond to the names in mm.FW.STANDARD_CLASSES
                properties: {},  // Stores the attributes of the widgets as in a property. i.e properties['name'] = value.
                widgets: null,  // If this is a container widget, then it will have child widgets.  This is a list of child widgets of the class WidgetClass.  For a WidgetClass that is not a container, this will be null.
                preLoad: true,  // If this is set to true, then the WidgetClass will be converted to an actual widget when the application is loaded.  If this is set to false, the WidgetClass will only be converted to a widget when needed (LazyLoading).
                texts: null,  // The Text Widget can be assigned to any widget, even widgets that are not container widgets.  Such as a Label for an Input.  More than one text can be assigned to a widget.  The texts are stored in this list.
                image: null, // This is only used for a WidgetClass that contains an image file.  This is used for pre-loading the image in memory.  On some OS such as FireFox or Android, it is not necessary to preload an image on loading.  For iOS it is necessary to pre-load the images to solve refresh problems.
                collisionDetection: null // This is only used for Animation widget.
            };
      
            return self;
        },
      
        /*
        ++
        This stores the style of a widget i.e the colour, transparency etc.
        If a widget needs this style class, then the widget has the attribute
        "s" that points to this style class.  Some of the attributes in this style class are not used in all of the
        widgets, and some attributes have different meanings depending on the widget.  Please refer to the individual
        widget API, for a description of each style attribute.  For example for a fragment widget; colour is the background
        colour of the widget and for a text widget it is the colour of the font.
        */
        WidgetStyle: function() {
      
            var self = {
                colour: null,  // Colour in hex i.e white = #FFFFFF
                borderW: null, // BorderWidth (Integer value)
                borderColour: null,  // BorderColour in hex i.e black = #000000
                rounded: false,  // Set to true if the widget has rounded corners.
                roundedAngle: 5,  // If rounded set to true, then this sets the rounded angle as an integer.
                transparency: -1, // Transparency, set how transparent a widget is.  -1 == no transparency.  The value is from 0 to 255.
                gradient: null  // This attribute associates to the Gradient class.  To set colour gradience for the widget.
            };
      
            return self;
        },
      
        /*
        ++
        The WidgetClick is used to specify a tap/click action on a widget.
        Not all widgets have a tap/click action, however if the widget specifies the
        attribute "clickAction", then it can have a WidgetClick instance.
        Depending on which attributes are set, the WidgetClick can specify if a function is called or
        a page navigation is performed.  It is possible to set an action function and page navigation,
        for the same click.  The action is performed before the page navigation occurs.
        */
        WidgetClick: function() {
      
            var self = {
                action: null,  // This links to the WidgetFunction and stores the function that is called when the widget clicked/tapped.
                navigation: null,  // This is the id of the page that is called when the widget clicked/tapped.  For this to work the Page must be in the current PageFlow.
                closePage: false,  // If this is set to true and navigation set to false, when the widget clicked/tapped the current page will close.
                navigationPartialX: null,
                navigationPartialY: null
            };
      
            return self;
        },
      
		/*
		++
		This is used to store a Input widget that is being edited,
		and the position of the screen the keyboard is being used.
		*/
        KeyboardPos: function(inputIn, xIn, yIn, wIn, hIn) {
      
            var self = {
                input: inputIn,  // Input widget
                x: xIn,  // x position in px on the screen the Input widget is being edited by the keyboard.
                y: yIn,  // y position in px on the screen the Input widget is being edited by the keyboard.
                w: wIn,  // width in px on the screen the Input widget is being edited by the keyboard.
                h: hIn   // height in px on the screen the Input widget is being edited by the keyboard.
            };
      
            return self;
        },
      
        /*
		++
        WidgetStages are used in conjunction with page flows.
        This allows an external function to be called at different page life cycle stages of the widget.
        */
        WidgetStages: function() {
      
           var self = {
                init: null,  // Function called when the widget is first created.  Signature: function(widgetIn)
                openPage: null,  // Function called just before a page is opened, not called on every redraw.  Signature: function(widgetIn)
                redraw: null,  //  Function called on each redraw of the widget.  Signature: function(widgetIn)
                afterOpen: null, // Function called after the page has been shown.  Signature: function(widgetIn)
                close: null,  // Function called once just before the page is being closed:  Signature: function(widgetIn)
                afterClose: null  // Function called after page is fully closed.
            };
      
            return self;
        },
      
        /*
        ++
        The UI widgets call different functions.  These functions
        are standard JavaScript functions.
        In the XML file it is not possible, to specify the JavaScript function directly.
        Therefore it is necessary to specify a name for a function.  The name has to be associated
        to a function in JavaScript code.  Lets say we need a function to add 1 to a variable count
        inside a JavaScript file.  We will set the name of the function to "ADD_ONE".
        On initialisation code in JavaScript for our application we have to link this name to the function
        using this code as follows:
        
        mm.App.addFunction("ADD_ONE", function() {
            count = count + 1;
        )}
        
        Then in XML code we refer to the function as >ADD_ONE<.  The framework will then now that this
        refers to the function specified in JavaScript.
        
        The WigetFunction class, stores the name of the function on its executable.
        
        This can be used by different types of functions, with different parameters and signatures.
        */
        WidgetFunction: function(nameIn, executableIn) {
            var self = {
                name: nameIn,  // The name of the function to be used in XML.
                executable: executableIn  // The actual executable function.
            }
      
            return self;
        },
      
        /*
        GradientColour is the colour used by Gradient.colours.
        */
        GradientColour: function() {
            
            var self = {
                pos: null, // INT position of colour in the list
                colour: null  // colour style tipe "#000000"
            };
            
            return self;
        },
      
        /*
        This is used by WidgetStyle.gradient attribute.  This specifies the gradient colour of a 
        widget and can be applied to many different widgets.
        */
        Gradient: function() {
            
            var self = {
                startX: null,
                startY: null,
                endX: null,
                endY: null,
                colours: null  // ARRAY OF GradientColour
            };
            
            return self;
        },
      
        // POINT USED BY KINETIC SCROLLING TO STORE POINT
        KSPoint: function(xIn, yIn) {
            
            var self = {
                x: xIn,
                y: yIn
            };
            
            return self;
        },
				  
		/*
		++
		This is the main widget class.
		
		All widgets have an association to this widget class in the attribute "m"
		This holds the values that are used within all widgets.  Association is used
		as inheritance is not supported or overly complicated with JavaScript.
		*/
        Widget: function(idIn, typeNameIn, classNameIn, xIn, yIn, widthIn, heightIn, layerIn) {

            var self = {
                id: idIn,  // String: this is ID of the widget
                type: typeNameIn,  // This is a type the developer can associate to any widget. This can help group widgets that are of the same class.
                className: classNameIn, // Internal use.  This is the className of the widget i.e Fragment, Text, Circle, Input etc.
                parent: null,   // Internal use.  All widgets except for the Screen widget belong to a parent widget.  This points to that parent widget.
                x: xIn,  // This is the x position of the widget within its parent.  This can be a px or % value.
                y: yIn,  // This is the y position of the widget within its parent.  This can be a px or % value.
                w: widthIn,  // This is the width of the widget.  It can be a px or % value.  If it is a % value it is the percentage of the width of its parent.
                h: heightIn,  // This is the height of the widget.  It can be a px or % value.  If it is a % value it is the percentage of the height of its parent.
                area: null,  // TODO
                l: layerIn,  // An integer value of the layer of the widget.  A widget with a higher layer number is drawn over a widget with a lower layer number.
                stages: null,  // WidgetStages class.
                moveOver: null,  // array of move over sources for move over and drop over...
                clickable: false,  // If this is set to true the widget is clickable by the user, on a click it will call the function clickAction on the widget.
                enabled: true,  // If enabled is set to false then the click action, even if clickable is set to true will not excecuted
                holdable: false,  // If this is set to true, a widget is holdable.  Holdable widgets are used for drag and drop and for other features such as lists.
                holdAction: null,  // Called when the widget is being held and holdAction = true.
                unholdAction: null,  // Called when the widget is unheld and holdAction = true.
                holdMovingAction: null, // Called when widget is held and being moved and holdAction = true.
                clearHoldingAction: null,  // Called when mouse down, to guarentee the move mouse is cancelled.  Not always performed.
                movable: false,  // Set if movable.
                move: null,  // Links to Movable object, if this is movable.
                isStandardMoveover: false,  
                standardMoveOver: null, // CALLED WHEN STANDARDMoveOver is true.   (Called when target over). PARAMS (ctx, xIn, yIn, movingWidgetIn, targetIn)
                standardMoveOutOver: null,  // CALLED WHEN STANDARDMoveOver is true. (Called when target not over). PARAMS (ctx, xIn, yIn, movingWidgetIn, targetIn)
                selectableArea: null,
                container: false,  // True or false. This shows if this has widgets.  Container widgets can have child widgets.  For example a Fragment widget can have child widgets.
                widgets: null,  // Only set if container == true, stores the child widgets of this widget.
                calculateWidgetsPosFromScreen: false, // If true calculates the widgets position from the screen and not from the parent widget
                center: null, // function that calculates the center pass in x, y.  If not selected then standard function used.
                widgetsUnder: null,
                hidden: false,  // If hidden is set to true, then the widget will not be visible on the screen.
                copy: null,  // If available runs a deep copy on a widget returning a new copy of that widget. param (idIn, widgetIn)
                realX: 0,  // Stores the real x value in px from the parent widget so actual pos is realX + x
                realY: 0,  // Stores the real y value in px from the parent widget so actual pos is realY + y
                associatedObject: null, // Can be used by the developer to attach an object/function to this widget.  This could be a data transfer object, a database row or an id etc.
                other: null,  // May be necessary by some widgets, no specific use.
                onHoldMovingRedrawPartial: false, // When set to true will only draw this widget that is on hold moving, otherwise will redraw all widgets.
                onActionRedrawPartial: false, // When set to true on action only draws this widget, if set to false will redraw all
                beingHeld: false, // If set to true then this widget is being held.  Even not holdable widgets can flag as being held.  Used for menu lists.
                drawOrder: 0,  // Integer draw order, as an integer value.  The lowest value is drawn first.  The highest value is drawn last.
                propagateClick: false,  // If propagate click is true, then the click will be sent to widgets that are under this widget on the screen.  If set to false only the top click is accepted, others below are ignored.
                propagateHold: true, // If propagate hold is true, then the hold under this widget is propagated.
                propagateOnDrop: true,  // IF propgate on drop is true, then the drop will propagate down
                isKineticScrolling: false, // Sets true/false if this is a kinetic scrolling widget
                invisible: false,  // This makes the widget invisible but it still is 100% functional.  At the moment only used for buttons but could work across different widgets.
                shown: false, // Currently only used by ListWidget (If true this is being shown on the screen)
                texts: null,  // List of text widgets, any widget can have one or more text widgets.
                alignVert: null,   // TOP, BOTTOM, CENTER : This aligns the widget vertically based on its parent.  This will overide the y value.
                alignHoz: null,   // LEFT, RIGHT, CENTER : This aligns the widget horizontally based on its parent.  This will overide the x value.
                alignSpacingVert: 0,  // Spacing in px, to adjust alignVert.
                alignSpacingHoz: 0,  // Spacing in px, to adjust alignHoz.
                alignIn: true  // IF true, widget is drawn inside parent widget.  If false widget is drawn outside parent widget.
                
            };

            return self;
        },

				  
                 
        // *******************************************************************************************
        // * STANDARD UI Widgets
        // * All the standard UI Widgets are specified here
        // *******************************************************************************************
      
        /*
        ++
        The Screen is the root UI widget and contains information about the screen.  All applications
        only have one Screen widget.  It is the top parent for all the other widgets.
        To obtain the Screen widget in JavaScript use the function:
        
        var screen = mm.App.getScreen();
        
        The screen widget is automatically created when the framework is initialised.
        */
        Screen: function(widgetIn) {
            var self = {
                m: widgetIn,
                originalWidth: null,   // This is the size of the screen the application was initialy developed for.  If this is not set to null, all the other widgets will scale to this 100%.
                originalHeight: null,   // same as comment above!
                scaleX: null,  // The scale currently being used for x.  Only if originalWidth not == null.
                scaleY: null  // The scale currently being used for y.  Only if originalHeight not == null.
            };
            
            return self;
        },
      
      
        /*
        ++
        The image widget is an image that is drawn to the screen.  A png, jpg file.
        It is necessary to see if the image specified can be used on that particular OS.
        Problems with jpegs on WP8 devices.
        */
        Image: function(widgetIn, imageSrcIn, drawIn) {
					
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the image. (Internal use only).
                imageSrc: imageSrcIn,  // The filename of the image
                image: null, // The actual image
                onLoad: null,  // This is a callback function, when the image has been loaded into memory.  This is called if not null.
                clickAction: null  // Called when the widget is clicked.
            };
            return self;
        },
      
        /*
        ++
        The Fragment widget is a rectangle area that is drawn.  It is a container
        widget so that other widgets can be drawn on to it.
        No Button widget exists in this framework, because the Fragment widget can
        be used just like a Button also.  It allows for a click action.
        */
        Fragment: function(widgetIn, drawIn) {
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the fragment.  (Internal use only).
                s: null,  // Links to WidgetStyle that specifies the style of this fragment.
                clickAction: null,  // Links to WidgetClick, this is called when the fragment is clicked/tapped.
                selectWidget: null  // If this widget is not null, it allows the fragment to be selected instead on selecting the whole fragment.  When this is selected, this widget is not returned but the fragment.
            };
            return self;
        },
      
        /*
        ++
        The Circle widget is almost the same as a fragment, except that it draws a circle
        instead of a rectangle.
        */
        Circle: function(widgetIn, drawIn, radiusIn) {
				 
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the circle. (Internal use only).
                radius: radiusIn,  // Sets the radius of the circle, can be percentage or px.
                s: null, // Links to WidgetStyle that specifies the style of this circle.
                clickAction: null,  // Links to WidgetClick, this is called when the circle is clicked/tapped.
                selectWidget: null  // If this widget is not null, it allows the circle to be selected instead on selecting the whole circle.  When this is selected, this widget is not returned but the circle.
      
            };
            return self;
        },
      
        /*
        ++
        The Polygon widget is almost the same as a fragment, except that it draws a polygon
        instead of a rectangle.
        */
        Polygon: function(widgetIn, drawIn, polygonIn, polygonStringIn) {
				 
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the polygon. (Internal use only).
                polygon: polygonIn,  // Internal use.  Internal representation of the polygon in an array of point.x and point.y.
                polygonString: polygonStringIn,  // This contains the co-ordinates of the polygon format example: "{10,10};{100,10},{100,100},{10,100}"
                s: null, // Links to WidgetStyle that specifies the style of this polygon.
                selectWidget: null,  // If this widget is not null, it allows the polygon to be selected instead on selecting the whole polygon.  When this is selected, this widget is not returned but the polygon.
                clickAction: null,  // Links to WidgetClick, this is called when the polygon is clicked/tapped.
                xLow: 0,
                yLow: 0
            };
            return self;
        },
      
        /*
        ++
        Text widget, is responsible for display text.
        */
        Text: function(widgetIn, textIn, styleIn, fontIn, fontSizeIn, drawIn) {
				 
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the polygon. (Internal use only).
                text: textIn,  // This is the actual text that is to be displayed.
                s: styleIn,  // The colour of the font is specified in s.colour.  Other style atributes are ignored.
                font: fontIn,  // This is the font typeface like 'Arial'.  Depending on the OS, this may be ignored and the best fit may be found.
                fontType: "normal",  // This can be 'bold', 'italic' and 'normal'
                textBaseLine: "top",  // This is the baseline for the font can be 'hanging', 'middle', 'top', 'alphabetic', 'ideographic', 'bottom'.
                vertical: false, // If this is true, the text will be drawn vertically and not horizontally.
                fontSize: fontSizeIn  // Stores the size of the font.
            };
					  
            return self;
        },
      
        /*
        ++
        This is a rectangle that can display animations.  The animation
        might be a simple ticker or scroll, or it could be a 2d game.
        
        All the objects being animated, sprites, are contained within this widget.  This
        is a container widget.  Any other widget can be animated.
        */
        Animation: function(widgetIn, drawIn, animateIn) {
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the animation. (Internal use only).
                animate: animateIn,  // This is a function that is called on each animation loop.  This is for external use.
                playAnimation: false,  // When true the animation is being played, when false the animation is not played.
                animationTimeout: 33,  // This sets the amimation interval, in miliseconds (Integer).  Set as default to 33 miliseconds, standard to trick eye for smooth animation.  This is only a reference, if each screen takes longer than 33 miliseconds to draw than the value will actually be higher.
                s: null,  // Links to WidgetStyle that specifies the style of this animation.  If this is set to null, no background rectangle is drawn.
                clickAction: null,  // Links to WidgetClick, this is called when the animation is clicked/tapped.
                redrawAll: false,  // When true the whole screen is drawn on the animation (not just animation area.)
                animationLoop: null,  // This is called on each animation loop, checks for collisions etc.  (This is generally used only for internal use).
                timeOutRunning: null,  // Stores the animate time out.  (Internal use only)
                collisions: null // CollisionDetection class: Stores the possible collisions within this animation.
            };
            return self;
        },
      
	    /*
		++
		This is the input widget.  This allows the user to enter text on
		the screen.
		*/
        Input: function(widgetIn, textIn, drawIn, multilineIn, divIn) {
				 
            var self = {
                m: widgetIn, 
                text: textIn,  // This is the text widget.  This contains the font and the actual text.
                draw: drawIn,  // function that is responsible for drawing the input widget. (Internal use only).
                multiline: multilineIn,  // If set to true the text input is multiline input, otherwise it is single line input.
                div: divIn,  // This is the div id that has to be specified on the html5 page as "<div id="main" style="top: 0px, left: 0px"/>".  In this case set to "main".
                numberCharacterLimit: null,  // If null, no limit exists.  Maximum number of characters that are allowed in the input.
                clickAction: null,  // A function that is called when the object is clicked.  (Internal Use: Opens the keyboard)
                action: null,  // Function that is called when the user selects enter.  (Signature: funtion(Input Widget, textValue)
                validation: null,  // Function called on enter to perform text validations.  TODO: NOT YET IMPLEMENTED
                edit: null,  // Function called on enter to perform text edits.  TODO: NOT YET IMPLEMENTED
                scrollLeftRight: false,  // If true it is possible to scroll the text left/right
                scrollUpDown: true, // If true it is possible to scroll the text up/down
                maxWidth: 0,  // If scroll left right true, set max width.  If this is 0 then width same as m.w
                s: null, // Links to WidgetStyle that specifies the style of this Input.
                textArray: null,  // holds text for multiline input.
                offsetX: 0,  // Internal use only.  Stores the x offset in px of the text.
                offsetY: 0,  // Internal use only.  Stores the y offset in px of the text.
                label: null,  // This is the text widget and adds a label to the input widget.  This is hidden when clicked to be edited.
				editable: true,  // If this is set to true, then the Input widget is editable otherwiser it is not editable.		
                password: false,  // If this is set to true then this is password input field (Shows * instead of characters)               
                passwordText: null, // Stores the actual text of the password.  The text attribute will contain *****.
                kineticScrollingEnabled: true, // Sets to true if kinetic scrolling is enabled.
                calculateHeightAuto: false, // If set to true this will automatically calculate the height of the input text.
                closeEditOnEnter: true,  // If set to true, the edit will be closed on enter.
                editMode: false // When set to true, the input is currently being edited by the user.
             };
					  
            return self;
        },
      
      
        /*
		++
        WidgetList is used to draw lists to the screen.
        A list can be vertical or horizontal.
        It is possible to mix any other widget with a list widget.
        */
        WidgetList: function(widgetIn, drawIn) {
                         
            var self = {
                m: widgetIn,
                draw: drawIn, // function that is responsible for drawing the widgetlist widget. (Internal use only).
                widgetsCanBeMoved: false,  // If true the user can move the objects within this list.
                vertical: true, // Specifies if this is a vertical list or horizontal list.  false = horizontal
                showOutOfArea: false,  // Still shows the widgets if out of x,y area of the list.  for example if on border shows them half on screen.
                gapWidget: null,  // Set the gap marker that is widget such as an image, is shown when mouse passed over it.  If nothing uses standard gap widget.  
                gapSize: null,	// Set the gap between the widgets
                currentOffset: 0,  // This stores the offset of the widget list for drawing
                s: null, // Links to WidgetStyle that specifies the style of this List.
                newOffset: 0,  // Stores the offset in px of the list.
                numberOfPixelsMovedToDraw: 1, //  Specifies how many pixels need to move for the list to be redrawn. Can improve performance on low end devices.  When == 1, 1 pixel move == 1 redraw.  When 2 only every 2 pixel moves == redraw.
                pixelsMoved: 1,  // Specifies how many pixels move for each 1 pixel move by the user.  This can make the lists scroll quicker.
                kineticScrollingEnabled: true, // Sets if kinetic scrolling enabled true or false.
                widgetSize: 0,  // Used for onHold
                listPositionMarker: null // Connects to any listPositionMarker to show list position.  TODO. To be implemented in this version.
            };
            return self;
        },
        
  

        /*
		++
        Page is widget that is a rectangle that refers to a single page.
        The Page can be the size of the screen, or just a partial size of the screen.
        Page is assigned within a PageFlow so it can have page transformations associated to it.
        */
        Page: function(widgetIn, drawIn) {
            var self = {
                m: widgetIn,
                draw: drawIn,  // function that is responsible for drawing the page widget. (Internal use only).
                s: null,  // Links to WidgetStyle that specifies the style of this Page.
                shownX: 0,  // Internal use, to store page shown x position.
                shownY: 0,  // Internal use, to store page shown y position.
                fullPageX: null,  // Internal use.
                fullPageY: null,  // Internal use.
                previousPage: null,  // Stores a link to the previous page, to be used by the page flow.
                pageFullyOpen: false,  // Set to true when the page is full open.
                transparency: -1,  // Sets the transparency, used for fade in and fade out.  255 is max transparency.
                pageFlowController: null,  // On open page stores the IPageFlowController, so it can be stored.  If this is null, then this is stored at PageFlow level and the page flow is the same for all pages.
                partialShownX: null,  // Show partial page x position.
                partialShownY: null,  // Show partial page y position.
                partialNowShown: false,  // Internal use only.
                swipeLeftAction: null,  // function called when a swipe left by the user is detected.  (Signature: function(page))
                swipeRightAction: null,  // function called when a swipe right by the user is detected.  (Signature: function(page))
                swipeDownAction: null,  // function called when a swipe down by the user is detected.  (Signature: function(page))
                swipeUpAction: null  // function called when a swipe up by the user is detected.  (Signature: function(page))
            };
            return self;
        },
      
        /*
		++
        PageFlow stores the pages that are shown to the user.
        It handles the page transformation between pages, and records the navigation so it is possible to use the back button.
        Many of the features of PageFlow are controlled here, making page transformation easier for the developer.
        */
        PageFlow: function(widgetIn, drawIn) {
            var self = {
                m: widgetIn,
                draw: drawIn,  // Function responsible for drawing the page flow to the screen.
                currentShownPage: null,  // This is the page that is currently being shown to the user.  On top of the stack.
                pageFlow: null,  // Array of Page widget.  
                pageFlowController: null  // This stores the IPageFlowController, if it is not stored at page level.  
            };
            return self;
	
	    },
      
        // *******************************************************************************************
        // * END STANDARD UI Widgets
        // *******************************************************************************************
      
      
      
        /*
		++
		Used by the Page functionality to open and close the pages.  Controls the page flow transformation.
		Generally used for internal use only.  The page flow controllers have been predefined in these modules:
			- PageFlowJump
			- PageFlowUp
			- PageFlowDown
			- PageFlowLeft
			- PageFlowRight
			- PageSlideUp
			- PageSlideDown
			- PageSlideRight
			- PageSlideLeft
			- PageFadeIn
		It is possible to create different page flow transformation as long as they keep to this interface.
			
		*/
        IPageFlowController: function(openPageIn, closePageIn) {
        
            var self = {
                openPage: openPageIn,  // function called when page is opened.  (Signature: function(pageFlowIn, previousPageIn, newPageIn))
                closePage: closePageIn  // function called when page is closed.  (Signature: function(pageFlowIn, previousPageIn, currentPageIn))
            };
            return self;
        },
        
        IPageMoveAction: function(actionIn) {
        
            var self = {
                action: actionIn
            };
            return self;
        },
		
        /*
		++
		This class is used to save the current state of the widgets.
		Once a state is saved, it is possible to then reload the widgets state to exactly how it was previously.
		
		*/
        SavedState: function(idIn, widgetsIn) {
            var self = {
                id: idIn,
                widgets: widgetsIn
            };
			
            return self;
        },
      
      
      
        /*
        ++
        This module contains the main app functions that will be used by the developer.
        These functions have been grouped together in the module app, because they are commonly called
        by the application developer.
        This is the main interface to the   Swanc APIs.
        This module is aimed at external use.
        This can be considered the Facade to Swanc.
        */
        App: (function() {
            
            // The actual HTML5 Canvas
            var canvas = null;
            
            // All the external functions, that can be called from the XML files.
            var externalFunctions = {};
            
            // Stores which device type this is running on.  An integer value.
            var deviceType = DEVICE_OTHER;
            
            // These are the real values for where the canvas is on the screen. If not in 0,0 position.  Mouse position os by screen pos, not canvas pos.
            // This is necessary because for a desktop browser app, the canvas might not be all of the screen, but only part of a screen.
            // For a mobile device, normally the full screen is used for the canvas.
            var realScreenPosX = 0;
            var realScreenPosY = 0;
            
            // Saves the current state of the Screen.  
            var savedStates = new Array();  // THIS WILL STORE ALL OF THE SAVED CANVAS, FOR QUICK REUSE IN SAME STATE Array of widgets array.
            // FOR THIS TO PROPERLY WORK NEED DEEP COPY WORKING!!!
            
            return {
                /*
                ++
                This initialises the Canvas API.
                
                Input:
                    canvasNameIn: is the name of the HTML5 Canvas tag id as specified in the body of HTML page.  (index.html).
                
                This initalise does not use the XML files.  It is possible to use this framework using only JavaScript 
                code, however that is not recommended.
                
                However it does allow for a pre-init that may be necessary before loading the XML files if required.
                */
                initCanvas: function(canvasNameIn) {
              
                    if (canvas == null) {
                        canvas = $("#" + canvasNameIn);
                        var ctx = canvas.get(0).getContext("2d");
                        mm.FW.setCtx(ctx);
					
                        // INIT SCREEN WIDGET
                        var m = mm.Widgets.add(canvasNameIn, "SCREEN", "Screen", 0, 0, canvas.width(), canvas.height(), 0);
                        var screen = new mm.Screen(m);
                        screen.m.container = true;
                        screen.m.widgets = new Array();
                        mm.FW.setScreen(screen);
              
                    }
				
                },
                /*
                ++
                This initialises the Canvas API with the XML files.
                
                Input:
                    canvasNameIn: is the name of the HTML5 Canvas tag id as specified in the body of HTML page.  (index.html).
                    commonFileIn: this is the path + filename of the common.xml file.
                    pageFlowFileIn: this is the path + filename of the pageflow.xml file.
                Output:
                    callback: This is a function that is called once the Canvas API has been initialised.
                
                */
                initCanvasXML: function(canvasNameIn, commonFileIn, pageFlowFileIn, callback) {
              
                    // This inits the canvas and the canvas.xml file.  Loads to memory.
                    mm.App.initCanvas(canvasNameIn);
              
                    mm.XML.initXML(commonFileIn, function() {  // LOADS COMMON XML FILE
                        mm.XML.initPageFlowXML(pageFlowFileIn, function(pageFlowArray) {  // LOADS PAGE FLOWS + PAGES etc.
                            
                            var widgets = new Array();
                            
                            // ADD THE PAGE FLOWS TO THE SCREEN
                            for (var i=0;i<pageFlowArray.length;i++) {
                                mm.Widgets.addWidgetClass(widgets, pageFlowArray[i]);
                            }
                            
                            // ADD THEM TO THE ACTUAL SCREEN
                            for (var i=0;i<widgets.length;i++) {
                                mm.App.add(mm.FW.getScreen(), widgets[i]);
                            }
                            
                            callback();
                       });
                    });
              	
                },
                /*
                ++
                This initialises the Canvas API and scales it to this canvas size.  This is used when this canvas does not have
                the size that the application was originally developed for.  It will automatically setup the canvas to scale to
                this new canvas size.
                
                Input:
                    canvasNameIn: the name of the HTML5 Canvas tag id as specified in the body of HTML page.  (index.html).
                    originalWidthIn: the width in px the application was originally developed for.
                    originalHeightIn: the heigth in px the application was originally developed for.
                
                This initalise does not use the XML files.  It is possible to use this framework using only JavaScript 
                code, however that is not recommended.
                
                However it does allow for a pre-init that may be necessary before loading the XML files if required.
                */
                initCanvasScale: function(canvasNameIn, originalWidthIn, originalHeightIn) {
              
              		if (canvas == null) {
              		    canvas = $("#" + canvasNameIn);
                        var ctx = canvas.get(0).getContext("2d");
                        mm.FW.setCtx(ctx);
                        
                        // CALCULATE SCALE
                   		var scaleX = canvas.width() / originalWidthIn;
                   		var scaleY = canvas.height() / originalHeightIn;
                    
                    	// SET THE NEW SCALE
                   		ctx.scale(scaleX, scaleY);
					
                        // INIT SCREEN WIDGET
                    	var m = mm.Widgets.add(canvasNameIn, "SCREEN", "Screen", 0, 0, originalWidthIn, originalHeightIn, 0);
                    	var screen = new mm.Screen(m);
                   	 	screen.originalWidth = originalWidthIn;
                    	screen.originalHeight = originalHeightIn;
                    	screen.scaleX = scaleX;
                    	screen.scaleY = scaleY;
                    	screen.m.container = true;
                    	screen.m.widgets = new Array();
                    	mm.FW.setScreen(screen);
                  
                    }
				
                },
                /*
                ++
                This initialises the Canvas API with the XML files and scales it to this canvas size.  This is used when this canvas does not have
                the size that the application was originally developed for.  It will automatically setup the canvas to scale to
                this new canvas size.
                
                Input:
                    canvasNameIn:String: is the name of the HTML5 Canvas tag id as specified in the body of HTML page.  (index.html).
                    commonFileIn:String: this is the path + filename of the common.xml file.
                    pageFlowFileIn:String: this is the path + filename of the pageflow.xml file.
                    originalWidthIn:Int: the width in px the application was originally developed for.
                    originalHeightIn:Int: the heigth in px the application was originally developed for.
                Output:
                    callback:Function: This is a function that is called once the Canvas API has been initialised.
                
                */
                initCanvasXMLScale: function(canvasNameIn, commonFileIn, pageFlowFileIn, originalWidthIn, originalHeightIn, callback) {
              
                    // This inits the canvas and the canvas.xml file.  Loads to memory.
                    mm.App.initCanvasScale(canvasNameIn, originalWidthIn, originalHeightIn);
              
                    mm.XML.initXML(commonFileIn, function() {  // LOADS COMMON XML FILE
                        mm.XML.initPageFlowXML(pageFlowFileIn, function(pageFlowArray) {  // LOADS PAGE FLOWS + PAGES etc.
                            
                            var widgets = new Array();
                            
                            // ADD THE PAGE FLOWS TO THE SCREEN
                            for (var i=0;i<pageFlowArray.length;i++) {
                                mm.Widgets.addWidgetClass(widgets, pageFlowArray[i]);
                            }
                            
                            // ADD THEM TO THE ACTUAL SCREEN
                            for (var i=0;i<widgets.length;i++) {
                                mm.App.add(mm.FW.getScreen(), widgets[i]);
                            }
                            
                            callback();
                       });
                    });
				
                },
                /*
                ++
                This method starts the framework, and should be called after the canvas init method has been called above.
                */
                start: function() {
                    mm.FW.start();
                },
                /*
                ++
                If the app uses different languages, it is a good idea to put them in the messages.xml file.
                A message.xml file, will be different for each language the application supports. i.e English = messages_en.xml, French = messages_fr.xml.
                You should place logic in your JavaScript code to select the correct language based on the user's preference.
                
                The initMessages function, loads this file into memory.  This should be called before calling any of the initCanvas
                methods.
                
                Input:
                    xmlNameIn:String: path + filename of the messages.xml file.
                    messageSection:String: The message section to be loaded, this is set in the tag <Id> in the tag <MessageSection>
                Output:
                    callback: Function: Called once the messages.xml file has been loaded.
                */
                initMessages: function(xmlNameIn, messageSection, callback) {
              
                    mm.XML.loadMessageXML(xmlNameIn, messageSection, function() {
                    
                        callback(); // CALLBACK ONLY WHEN PROCESSING IS COMPLETE
                    });
                
                },
                /*
                ++
                Returns the actual HTML5 canvas.
                */
                getCanvas: function() {
                    return canvas;
                },
                /*
                ++
                Returns the screen widget for this app.
                */
                getScreen: function() {
                    return mm.FW.getScreen();
                },
                /*
                ++
                Use this to add an external function.  This function can then be used by the XML files.
                The name must be unique each time.
                
                Input:
                    nameIn: String: name of the function i.e "myFunction".
                    functionIn: Function: the actual function i.e myFunction() { .... }
                */
                addFunction: function(nameIn, functionIn) {
                    externalFunctions[nameIn] = functionIn;
                },
                /*
                ++
                Returns the actual function, that was added in the method mm.App.addFunction.
                    
                Input:
                    functionWidgetIn:WigetFunction:  This must have either the name or executable set.
                Output:
                    Function
                */
                getFunction: function(functionWidgetIn) {
                    if (functionWidgetIn.executable != null) {
                        // If this already has the executable set, just return it.
                        return functionWidgetIn.executable;
                    } else {
                        // Otherwise it is necessary to search for the executable by its name.
                        // Once the executable is found, add it to functionWidgetIn so the text time it will not have to be searched.
                        functionWidgetIn.executable = externalFunctions[functionWidgetIn.name];
                        return functionWidgetIn.executable;
                    }
                },
                /*
                ++
                Sets the device type.
                
                Input:
                    deviceTypeIn:Int: Device type in defined by constants at the top of this file i.e DEVICE_IOS, DEVICE_ANDROID etc.
                */
                setDeviceType: function(deviceTypeIn) {
                    deviceType = deviceTypeIn;
                },
                /*
                ++
                Returns the device type as an integer.
                */
                getDeviceType: function() {
                    return deviceType;
                },
                /*
                ++
                Returns a WidgetClass that is configured in the commons.xml file.
                
                Input:
                    idIn:String: This is the id of the widget class, as configured in the tag <Id> in commons.xml file.
                Output:
                    WidgetClass
                */
                getWidgetClass: function(idIn) {
                    return mm.XML.findCommonWidgetClass(idIn);
                },
                /*
                ++
                This converts a WidgetClass into an actual widget instance.
                A WidgetClass is stored in the common.xml file or pages files.
                
                For a JavaScript developer it is only possible to get a WidgetClass that is stored in the common.xml file.
                To get the WidgetClass from the common.xml file use this code:
                
                mm.App.getWidget
                
                This class actually creates the actual widget instance.  The WidgetClass could contain a big structure, for example
                a Fragment with many child widgets.  The whole structure will be instanciated.
                
                Input:
                    idIn:String: This will be the id for this new instance, as stored in widget.m.id.  If this is null, the id will be generated.
                    widgetClassIn:WidgetClass: This is the actual widget class to be converted.
                Output:
                    The new widget instance.
                
                */
                addWidgetX: function(idIn, widgetClassIn) {
                  
                    if (isNull(idIn)) {
                        // Calculate id, based on class name + generated id.
                        idIn = widgetClassIn.className + mm.FW.getNextId();
                    }
                
                    // TODO : SEE IF IT IS POSSIBLE JUST TO COPY; STYLE ETC!!!!
                    // deepCopy could produce performance problems!
                    var widgetClass = mm.XML.deepCopyWidgetClass(idIn, widgetClassIn);
                  
                    var tempArray = new Array();
                  
                    mm.Widgets.addWidgetClass(tempArray, widgetClass);
                  
                    if (tempArray.length > 0) {
                        return tempArray[0];
                    } else {
                        console.log("ERROR: ADDING WIDGET ID " + idIn + " : " + widgetClassIn.id);
                        return null;
                    }
                },
                /*
                ++
                This method can be used to either add a widget to the screen, or add a widget to a container widget.
                
                To add a widget to the screen widget use as:
                
                mm.App.add(widget);
                
                To add a widget to a container widget use:
                
                mm.App.add(containerWidget, widget);
                
                Input:
                    containerIn:"ContainerWidget"
                    widgetIn:"Widget": The widget to be added to the container.  If this is null, then the containerIn is added to the screen.
                
                */
                add: function(containerIn, widgetIn) {  // NOTE: SHOULD ALWAYS USE THIS METHOD TO ADD WIDGETS TO COMPOSITES
              
                    if (isNull(widgetIn)) {
                        // THEN ADD TO THE SCREEN, NO CONTAINER
              
                        // SWAP AROUND TO ADD TO THE SCREEN
                        // MAKE THE SCREEN THE CONTAINER
                        // MAKE WIDGET IN, WHAT HAS BEEN PASSED IN.
                        widgetIn = containerIn;
                        containerIn = mm.App.getScreen();
              
                    }
              
                    if (containerIn.m.container == true) {  // MAKE SURE THIS IS A COMPOSITE.
                    
                        if (containerIn.m.widgets == null) {
                            containerIn.m.widgets = new Array();
                        }
			
                        widgetIn.m.parent = containerIn;
                        containerIn.m.widgets.push(widgetIn);
                  
                        // RECALCULATE SIZE OF WIDGET, COMPARED TO PARENT.
                        if (widgetIn.m.calculateWidgetsPosFromScreen == false) {
                            mm.FW.convertWidgetPercentToPixels(widgetIn, containerIn.m.w, containerIn.m.h);
                        } else {
                            mm.FW.convertWidgetPercentToPixels(widgetIn, mm.FW.getScreen().m.w, mm.FW.getScreen().m.h);
                        }
                    
                        if (widgetIn.m.container == true) {
                            if (widgetIn.m.calculateWidgetsPosFromScreen == false) {
                                    mm.FW.listConvertWidgetPercentToPixels(widgetIn.m.widgets, widgetIn.m.w, widgetIn.m.h);
                            } else {
                                mm.FW.listConvertWidgetPercentToPixels(widgetIn.m.widgets, mm.FW.getScreen().m.w, mm.FW.getScreen().m.h);
                            }
                        }
              
                        // FOR TEXT
                        if (widgetIn.m.texts != null && widgetIn.m.texts.length > 0) {
                            if (widgetIn.m.calculateWidgetsPosFromScreen == false) {
                                mm.FW.listConvertWidgetPercentToPixels(widgetIn.m.texts, widgetIn.m.w, widgetIn.m.h);
                            } else {
                                mm.FW.listConvertWidgetPercentToPixels(widgetIn.m.texts, mm.FW.getScreen().m.w, mm.FW.getScreen().m.h);
                            }
                        }
                        // END FOR TEXT
              
                        // SORT WIDGETS BY LAYER
                        containerIn.m.widgets.sort(mm.FW.sortByLayers);
                    }
                   // }
                },
                /*
                ++
                This sets the real screen pos x, see attribute above for full description.
                
                Input:
                    xIn: Int
                */
                setRealScreenPosX: function(xIn) {
                    realScreenPosX = xIn;
                },
                /*
                ++
                This sets the real screen pos y, see attribute above for full description.
                
                
                Input:
                    yIn: Int
                */
                setRealScreenPosY: function(yIn) {
                    realScreenPosY = yIn;
                },
                /*
                ++
                This returns the real screen pos x (Int), see attribute above for full description.
                */
                getRealScreenPosX: function() {
                    return realScreenPosX;
                },
                /*
                ++
                This returns the real screen pos y (Int), see attribute above for full description.
                */
                getRealScreenPosY: function(yIn) {
                    return realScreenPosY;
                },
                /*
                ++
                This forces a repaint of the whole screen.
                
                This should not need to be called very often, for example on an action etc this is called automatically.
                Should only be used for very specific cases.
                */
                repaint: function() {
                    mm.FW.setSettingDrawOrder(true);
                    mm.FW.drawOrder = 0;
                    mm.FW.getCtx().clearRect(0, 0, canvas.width, canvas.height);
                    mm.FW.draw();
                    mm.FW.setSettingDrawOrder(false);
                },
                /*
                ++
                This forces a repaint of a specific widget not the whole screen.  To repaint the whole screen use:
                mm.App.repaint
                
                This should be used with caution, as it may sometimes give undesirable results.
                
                This should not need to be called very often, for example on an action etc a repaint is called automatically.
                Should only be used for very specific cases.
                
                Input:
                
                    widgetIn: "Widget", The widget to be repainted.
                */
                repaintWidget: function(widgetIn) {
                    mm.FW.getCtx().clearRect(mm.FW.getOffsetX() + widgetIn.m.realX + widgetIn.m.x, mm.FW.getOffsetY() + widgetIn.m.realY + widgetIn.m.y, widgetIn.m.w, widgetIn.m.h);
                    
                    mm.FW.drawWidget(widgetIn);
                },
                /*
                This deletes a widget from it is parent widget.  If no parent exists, then this does nothing.
                This does not actually remove the widget from memory, it just disconnects it from its parent.
                Input:
                    widgetIn:"Widget" to disconnect from its parent.
                */
                deleteWidgetFromParent: function(widgetIn) {
                    // DELETE THIS WIDGET FROM ITS PARENT COMPOSITE.
                    if (widgetIn.m.parent != null) {
                        mm.Container.deleteWidget(widgetIn.m.parent, widgetIn);
                    }
                },
                /*
                This deletes all the child widgets from the container widget.  It does not actually remove the child
                widgets from memory, it just disconnects them from the parent widget.
                Input:
                    containerIn: "ContainerWidget"
                */
                deleteAllChildWidgets: function(containerIn) {
                     containerIn.m.widgets = new Array();
                },
                /*
                This returns a widget within its container widget by the id of the widget as in widget.m.id.
                Input:
                    containerIn:"ContainerWidget": The container widget.
                    idIn:String: The id of the child widget that has to be found.
                Output:
                    "Widget" or null if the widget has not been found.
                */
                getWidget: function(containerIn, idIn) {
                
                    // GETS THE WIDGET IN THE CONTAINER BY ITS ID
                    var foundComp = null;
                                   
                    if (!isNull(containerIn.m.widgets)) {
                        var i = 0;
                        while (foundComp == null && i < containerIn.m.widgets.length) {
                            if (containerIn.m.widgets[i].m.id == idIn) {
                                foundComp = containerIn.m.widgets[i];     
                            }
                            i = i + 1;
                        }
                    }
                                   
                    return foundComp;
                },
                /*
                ++
                Text messages are stored in the messages.xml file.  This gets the text
                from the name of the message.  Each message is stored in the tag <M>, the id attribute
                in this tag refers to the message name.  The <M> tag value is the actual text to be displayed to the user.
                Input:
                    idIn:String:Id of the message:
                Output:
                    returns actual text:String
                
                */
                getMessage: function(idIn) {
                    return mm.XML.getMessage(idIn);
                },
                /*
                ++
                Returns the page widget, that this widget belongs to.  If this widget is not on a page, null is returned.
                */
                getPageForWidget: function(widgetIn) {
              
                    var page = null;
                    var parent = widgetIn.m.parent;
                    while (page == null && parent != null) {
                        if (parent.m.className == "Page") {
                            page = parent;
                        }
                        parent = parent.m.parent;
                    }
              
                    return page;
              
                },
                /*
                ++
                Returns the pageflow widget, that this widget belongs to.
                */
                getPageFlowForWidget: function(widgetIn) {
                    var page = null;
                    if (widgetIn.m.className == "Page") {
                        page = widgetIn;
                    } else {
                        page = mm.App.getPageForWidget(widgetIn);
                    }
                    var pageFlow = null;
                    if (page != null) {
                        pageFlow = page.m.parent;  // PARENT OF A PAGE FLOW IS ALWAYS THE PAGE
                    }
                
                    return pageFlow;
                },
				 /*
                ++
                This saves the current screen state of the widgets.  Then clears all the widgets from the screen.
				
                Input:
                    idIn:String: This will be the id that can be used to restore the state.
                 
                */
                saveStateAndClear: function(idIn) {
                    mm.App.saveState(idIn);
                    
                    // SET ALL THE PARENTS TO NULL
                    for(var eachWidget = 0; eachWidget<mm.FW.getScreen().m.widgets.length; eachWidget++) {
                        mm.FW.getScreen().m.widgets[eachWidget].m.parent = null;
                    }
                    mm.FW.removeAllWidgets();
                },
				 /*
                ++
                This saves the current screen state of the widgets.  
				
                Input:
                    idIn:String: This will be the id that can be used to restore the state.
                 
                */
                saveState: function(idIn) {
                    var saveState = new mm.SavedState(idIn, mm.FW.getScreen().m.widgets);
                    savedStates.push(saveState);
                },
				/*
                ++
                TODO 
				
                Input:
                    idIn:String: This will be the id of the state.
                 
                */
                clearScreen: function(idIn) {
                    var found = false;
                    var eachState = 0;
                    while (found == false && eachState<savedStates.length) {
                        if (savedStates[eachState].id == idIn) {
                            found = true;
                            // SET ALL THE PARENTS TO NULL
                            for(var eachWidget = 0; eachWidget<savedStates[eachState].widgets.length; eachWidget++) {
                                mm.App.deleteWidgetFromParent(savedStates[eachState].widgets[eachWidget]);
                            }
                        }
                        eachState = eachState + 1;
                    }
                },
				/*
                ++
                This gets screen state.  
				
                Input:
                    idIn:String: This will be the id saved state.
                 
                */
                getSavedState: function(idIn) {
                    var savedState = null;
                    var eachState = 0;
                    while (savedState == null && eachState<savedStates.length) {
                        if (savedStates[eachState].id == idIn) {
                            savedState = savedStates[eachState];
                        }
                        eachState = eachState + 1;
                    }
                    return savedState;
                },
				
				/*
                ++
                This reloads a screen state.  
				
                Input:
                    idIn:String: This will be the id saved state.
                 
                */
                reloadState: function(idIn) {
                    var found = false;
                    var eachState = 0;
                    while (found == false && eachState<savedStates.length) {
                        if (savedStates[eachState].id == idIn) {
                            found = true;
                            mm.FW.getScreen().m.widgets = savedStates[eachState].widgets;
                            // SET PARENT TO THE SCREEN
							
                            for(var eachWidget = 0; eachWidget< mm.FW.getScreen().m.widgets.length; eachWidget++) {
                                mm.FW.getScreen().m.widgets[eachWidget].m.parent = mm.FW.getScreen();
                            }
                        }
						
                        eachState = eachState + 1;
                    }
                    if (found == true) {
                        savedStates.remove(eachState-1);
                    }
                    return found;
                }

            };
    
        })(),
      
		
        /*
        ++
        This module contains all the main functions for the framework.
        
        Although sometimes, it may be necessary to use this module externally.  Generally it is only
        used for internal use.
        
        This module is basically the work horse of the framework.
        
        */
        FW: (function() {
    
            // This is the screen widget instance.  Only one per application.
            var screen = null;
            
            // This is the context for the HTML5 canvas tag.
            var ctx = null;
            
            var offsetX = 0;
            var offsetY = 0;
            var lastDownTime = 0;
			
            var LIMIT_MILISECONDS_FOR_CLICK = 1500;
            var MIN_MOVE_RATE = 15;
			
            // FOR HOLD
            var downX = 0;
            var downY = 0;
			
            var heldWidgets = new Array();
			
            var id = 0;
			
            var dpi = 0;
			
            // STORE LAST TOUCH X AND Y, if onDown, onMove, onUp
            var lastTouchX = 0;
            var lastTouchY = 0;
			
            var onDownTimer = null;  // STORES THE ON DOWN TIMER SO CAN LATER BE REMOVED
            
            var onHoldMoveRedraw = true;  // THIS STORES IF ON EVERY HOLD MOVE THE SCREEN SHOULD BE REDRAWN, IN SOME CASES THIS IS NOT REQUIRED
            
            // This is a counter used for setting the draw order for each widget.
            // The widgets are sorted by their layers, this counter calculates the
            // next draw order that is stored on the widget.m.drawOrder for each widget.
            // This is used for internal use.
            // The settingDrawOrder specifies if the drawOrder for each widget is currently being calculated when set to true.
            var drawOrder = 0;
            var settingDrawOrder = false;
            
            // THESE ATTRIBUTES ARE USED FOR KINETIC SCROLLING
            var KINETIC_SCROLLING_HISTORY_LENGTH = 5;
            var KINETIC_SCROLLING_DAMPENING = 0.8;
            var KINETIC_SCROLLING_MIN_MOVE_RATE = 2;
            var KINETIC_SCROLLING_FPS = 30;  // SHOULD FIND A WAY TO SET FRAMERATE PER SECOND TO CURRENT DEVICE (THINK ABOUT)
            var KINETIC_SCROLLING_ANIMATION_RATE = 33;
            var KINETIC_X_SCROLL_MULTIPLIER = 3;
            var KINETIC_Y_SCROLL_MULTIPLIER = 3;
            var ksPreviousPoints = null;
            var ksPreviousTimes = null;
            var ksVelocityX = null;
            var ksVelocityY = null;
            var ksCurrentComp = null;
            var ksXDirectionForward = null;
            var ksYDirectionForward = null;
            var ksXIn = null;
            var ksYIn = null;
            var ksBlockOnEvent = false;  // WHEN KINETIC SCROLLING ALL ONUP, ONDOWN, ONMOVE BLOCKED
            var ksMovingX = null;
            var ksMovingY = null;
            var ksWidgets = null;
            var ksAnimationTimeout = null;
            var KS_FLICK_DETECTION_PIXELS_MOVED = 10;
            // END KINETIC SCROLLING ATTRIBUTES
             
            // This is used for transparency, this sets the current globalAlpha for the application.
            var globalAlpha = -1;
            
            var onHoldCalled = false;
            
            // Stores a list of standard classes used in the API, these are the current standard widgets that are available.
            // It is possible to create new widget classes in the commons.xml file, but these must inherit from these standard widget classes.
            var STANDARD_CLASSES = ["Screen", "Circle", "Polygon", "PageFlow", "Page", "Fragment", "Text", "List", "Image", "Input", "Animation"];
            
            return {
                /*
                ++
                Removes all the widgets from the screen.  This is normally called on a save state, to load in
                a new screen state.
                */
                removeAllWidgets: function() {
                    heldWidgets = new Array();  // CLEAR HELD WIDGETS
                    screen.m.widgets = new Array(); // CLEAR ALL WIDGETS
                },
                /*
                ++
                This sorts all of the layers again, to make sure they are in the correct order.
                NOT SURE IF USED, COMMENT OUT - simplify.
                */
                /*refreshLayers: function() {
                    if (screen != null && screen.m.widgets != null) {
                        screen.m.widgets.sort(mm.FW.sortByLayers);
                    }
                },*/
                /*
                ++
                Returns true if the classIn is a standard widget class.
                */
                isStandardClass: function(classIn) {  
             
                    var i = 0;
                    var found = false;
                    while (found == false && i < STANDARD_CLASSES.length) {
                        if (STANDARD_CLASSES[i] == classIn) {
                            found = true;
                        }
                        i = i + 1;
                    }
                    return found;
                },
                /*
                This returns the next available id (Integer).
                Used to automatically calculate the id of widgets, if they have not been specified.
                */
                getNextId: function() {
                    id = id + 1;
                    return id;
                },
                setOffsetY: function(offsetYIn) {
                    offsetY = offsetYIn;
                },
                getOffsetY: function() {
                    return offsetY;
                },
                getOffsetX: function() {
                    return offsetX;
                },
                /*
                ++
                Returns the current DPI of the screen.  Useful for calculating text size etc.
                */
                getDPI: function() {
                    if (dpi == 0) {
                        dpi = document.getElementById("dpi").offsetHeight;  // CALCULATES THE DPI OF THE SCREEN
                    }
					
                    return dpi;
                },
                /*
                ++
                This is used to convert values that have been set as percentages on the widget to pixels for lists.
                */
                listConvertWidgetPercentToPixels: function(widgetListIn, widthIn, heightIn) {
					
                    // CONVERT WIDGETS x and y - O, 0 is top left of box and not top left of canvas.
                    if (widgetListIn != null) {
			            for(var eachWidget = 0; eachWidget<widgetListIn.length; eachWidget++) {
                            // Convert this widget
                            if (widgetListIn[eachWidget].m.calculateWidgetsPosFromScreen == false) {
                                mm.FW.convertWidgetPercentToPixels(widgetListIn[eachWidget], widthIn, heightIn);
                            } else {
                                mm.FW.convertWidgetPercentToPixels(widgetListIn[eachWidget], screen.m.w, screen.m.h);
                            }
              
                            // FOR TEXT
                            if (widgetListIn[eachWidget].m.texts != null && widgetListIn[eachWidget].m.texts.length > 0) {
                                mm.FW.listConvertWidgetPercentToPixels(widgetListIn[eachWidget].m.texts, widgetListIn[eachWidget].m.w, widgetListIn[eachWidget].m.h);
                            }
                            // END FOR TEXT
			             
                            if (widgetListIn[eachWidget].m.container == true) {
                                mm.FW.listConvertWidgetPercentToPixels(widgetListIn[eachWidget].m.widgets, widgetListIn[eachWidget].m.w, widgetListIn[eachWidget].m.h);
                            }
                        }
                        widgetListIn.sort(mm.FW.sortByLayers);
                    }
                },
                /*
                Returns the current screen widget.
                For external use, please use:
                mm.App.getScreen();
                */
                getScreen: function() {
                    return screen;
                },
                /*
                Sets the current screen widget.
                */
                setScreen: function(screenIn) {
                    screen = screenIn;
                },
                /*
                This is used to start the application.  Should be called once.  For external use, please use:
                mm.App.start();
                */
                start: function() {  // Add all of the widgets, then run start.  To draw them, add listeners etc for buttons.
                    settingDrawOrder = true;
                    drawOrder = 0;
                    mm.FW.draw();
                    settingDrawOrder = false;
                },
                /*
                Returns true if any widgets are currently being moved by the user.
                */
                areAnyWidgetsBeingMoved: function() {
                    var moving = false;
                    var eachWidget=0;
                    while (moving == false && eachWidget<heldWidgets.length) {
                        // CHECK IF ANY WIDGET IS BEING MOVED
                        if (heldWidgets[eachWidget].m.movable == true && heldWidgets[eachWidget].m.move.moving == true) {
                            moving = true;
                        }
                        eachWidget = eachWidget + 1;
                    }
                    return moving;
                },
                /*
                This is used to convert values that have been set on the widget as percentages to pixels.
                Used for x,y and width and height.
                */
                convertWidgetPercentToPixels: function(widgetIn, widthIn, heightIn) {
             
                    if (widthIn == null) {
                        widthIn = screen.m.w;
                    }
              
                    if (heightIn == null) {
                        heightIn = screen.m.h;
                    }
              
                    // X
                    widgetIn.m.x = mm.FW.convertToPixel(widgetIn.m.x, widthIn);
              
                    // Y
                    widgetIn.m.y = mm.FW.convertToPixel(widgetIn.m.y, heightIn);
              
                    // WIDTH
                    widgetIn.m.w = mm.FW.convertToPixel(widgetIn.m.w, widthIn);
              
                    // HEIGHT
                    widgetIn.m.h = mm.FW.convertToPixel(widgetIn.m.h, heightIn);
              
                },
                /*
                Converts an individual percent to a pixel.
                */
                convertToPixel: function(numberIn, sizeIn) {
                    var a = typeof numberIn;  // FIX BUG ON iPHONE very strange.
                    var num = numberIn.toString();
                    if (num.indexOf("%") != -1) {
                        // CALCULATE PIXEL POS OF PERCENTAGE
                        var percRaw = num.replace("%","");
                        var perc = 0;
                        if (percRaw != 0) {
                            perc = percRaw / 100;
                        }
                        return Math.round(sizeIn * perc);
              
                    } else {
                        return parseInt(num);  // CONVERT TO INTEGER BECAUSE ALREADY IN PIXEL FORMAT
                    }
                },
                /*
                This is used to draw all of the widgets on the screen.
                The screen is the root widget.
                */
                draw: function() {
                
                    // NEED TO LOOP THROUGH THE LAYERS BUILDING ONE ON TOP OF ANOTHER.
                    // AS WIDGETS ARE SORTED THIS IS AUTOMATICALLY TAKEN CARE OF...
					
                    // GET THE X and Y of the widget.
                    for (var eachWidget=0;eachWidget<screen.m.widgets.length;eachWidget++) {
                    
                        if (screen.m.widgets[eachWidget].m.movable == true && screen.m.widgets[eachWidget].m.move.moving == true) {
                        // DO NOTHING
                        } else {
                            mm.FW.drawWidget(screen.m.widgets[eachWidget]);
                        }
                    }
                  
                    // DRAW MOVING WIDGETS, NEED TO CALCULATE THE OFFSET FROM ORIGINAL POINT
                    if (heldWidgets.length > 0) {
                        for (var eachWidget=0;eachWidget<heldWidgets.length;eachWidget++) {
                            // HELD WIDGETS ARE THOSE BEING MOVED !!
                            if (heldWidgets[eachWidget].m.movable == true && heldWidgets[eachWidget].m.move.moving == true) {
                                mm.FW.drawMovingWidget(heldWidgets[eachWidget], heldWidgets[eachWidget].m.move.x, heldWidgets[eachWidget].m.move.y);
                            }
                        }
                    }
                    
                 },
				 /*
				 ++
				 Sets the settingDrawOrder. The settingDrawOrder specifies if the drawOrder for each widget is currently being calculated when set to true.
				 */
                 setSettingDrawOrder: function(settingDrawOrderIn) {
                    settingDrawOrder = settingDrawOrderIn;
                 },
				 /*
				 ++
				 Returns the settingDrawOrder. The settingDrawOrder specifies if the drawOrder for each widget is currently being calculated when set to true.
				 */
                 getSettingDrawOrder: function() {
                    return settingDrawOrder;
                 },
                 /*
                 ++
                 Draws an individual widget.
                 */
                 drawWidget: function(widgetIn) {
                    mm.FW.drawWid(widgetIn, offsetX + widgetIn.m.realX + widgetIn.m.x, offsetY + widgetIn.m.realY + widgetIn.m.y);  // Draw each widget in the array list.  List is already correctly ordered, to draw each layer correctly.
                 },
                 /*
                 ++
                 Draws a widget, that is inside a container.
                 */
                 drawWidgetInContainer: function(widgetIn, parentXIn, parentYIn) {
                    widgetIn.m.realX = parentXIn;
                    widgetIn.m.realY = parentYIn;
                    mm.FW.drawWid(widgetIn, parentXIn + widgetIn.m.x, parentYIn + widgetIn.m.y);	
                 },
                /*
                ++
                Draws all of the widgets in a container.
                */
                drawWidgetsInContainer: function(containerIn, widgetsIn, xIn, yIn) {
              
                    if (widgetsIn != null) {
                        // NO RECURSIVE DRAWING - EACH WIDGET TAKES CARE OF THAT.
                        for (var i=0; i < widgetsIn.length; i++) {
                
                            var eachWidget = widgetsIn[i];

                            if (eachWidget.m.movable == true && eachWidget.m.move.moving == true) {
                                // DO NOTHING
                            } else {
              
                                mm.FW.calculateEachWidgetPos(containerIn, eachWidget, xIn, yIn);
              
                                mm.FW.drawWidgetInContainer(eachWidget, xIn, yIn);
                            }
                        }
                    }
                },
                /*
                This is used to calculate the widgets x,y position if the widget's position
                has been set using AlignVert, AlignHoz positions.
                */
                calculateEachWidgetPos: function(containerIn, widgetIn, xIn, yIn) {
              
                    if (widgetIn.m.alignIn == true) {
                
                            // CALCULATE VERTICAL POSITION
                            if (widgetIn.m.alignVert != null) {
                                if (widgetIn.m.alignVert == mm.TOP()) {
                                    widgetIn.m.y = widgetIn.m.alignSpacingVert;
                                } else if (widgetIn.m.alignVert == mm.BOTTOM()) {
                                    widgetIn.m.y = containerIn.m.h - widgetIn.m.h - widgetIn.m.alignSpacingVert;
                                } else {  // MUST BE CENTER
                                    var spaceAround = containerIn.m.h - widgetIn.m.h;
                                    widgetIn.m.y = Math.floor(spaceAround / 2);
                                }
                            }
                
                            // CALCULATE HORIZONTAL POSITION
                            if (widgetIn.m.alignHoz != null) {
                                if (widgetIn.m.alignHoz == mm.LEFT()) {
                                    widgetIn.m.x = widgetIn.m.alignSpacingHoz;
                                } else if (widgetIn.m.alignHoz == mm.RIGHT()) {
                                    widgetIn.m.x = containerIn.m.w - widgetIn.m.w - widgetIn.m.alignSpacingHoz;
                                } else {  // MUST BE CENTER
                                    var spaceAround = containerIn.m.w - widgetIn.m.w;
                                    widgetIn.m.x = Math.floor(spaceAround / 2);
                                }
                            }
                
                    } else {  // ALIGN IN == FALSE
              
                            // CALCULATE Vertical POSITION
                            if (widgetIn.m.alignVert != null) {
                                if (widgetIn.m.alignVert == mm.TOP()) {
                                    widgetIn.m.y = -(widgetIn.m.alignSpacingVert + widgetIn.m.h);
                                } else if (widgetIn.m.alignVert == mm.BOTTOM()) {
                                    widgetIn.m.y = containerIn.m.h + widgetIn.m.alignSpacingVert;
                                } else {  // MUST BE CENTER
                                    var spaceAround = containerIn.m.h - widgetIn.m.h;
                                    widgetIn.m.y = Math.floor(spaceAround / 2);
                                }
                            }
              
                
                            // CALCULATE HORIZONTAL POSITION
                            if (widgetIn.m.alignHoz != null) {
                                if (widgetIn.m.alignHoz == mm.LEFT()) {
                                    widgetIn.m.x = -(widgetIn.m.alignSpacingHoz + widgetIn.m.w);
                                } else if (widgetIn.m.alignHoz == mm.RIGHT()) {
                                    widgetIn.m.x = containerIn.m.w + widgetIn.m.alignSpacingHoz;
                                } else {  // MUST BE CENTER
                                    var spaceAround = containerIn.m.w - widgetIn.m.w;
                                    widgetIn.m.x = Math.floor(spaceAround / 2);
                                }
                            }
              
                    }

              
                },
                /*
                ++
                This calculates the mouse/finger actual x position if the screen has been scaled.
                Returns new x position.
                */
                reCalculateXMouse: function(xIn) {
                    var x = xIn;
                    // RECALCULATES THE MOUSE X IN OUT IF THE SCREEN IS SCALED
                    if (screen != null) {
                        if (screen.scaleX != null) {
                            x = parseInt(xIn / screen.scaleX);
                        }
                    }
                    return x;
                },
                /*
                ++
                This calculates the mouse/finger actual y position if the screen has been scaled.
                Returns new y position.
                */
                reCalculateYMouse: function(yIn) {
                    var y = yIn;
                    // RECALCULATES THE MOUSE Y IN OUT IF THE SCREEN IS SCALED
                    if (screen != null) {
                        if (screen.scaleY != null) {
                            y = parseInt(yIn / screen.scaleY);
                        }
                    }
                    return y;
                },
                /*
                Draws the widget that is currently being moved by the user.
                */
                drawMovingWidget: function(widgetIn, moveOffsetXIn, moveOffsetYIn) {
                
                    var x = offsetX + widgetIn.m.realX + moveOffsetXIn + widgetIn.m.x;
                    var y = offsetY + widgetIn.m.realY + moveOffsetYIn + widgetIn.m.y;
                    
                    
                    if (!isNull(widgetIn.m.move.minX)) {
                        if (x < widgetIn.m.move.minX) {
                            x = widgetIn.m.move.minX;
                        }
                    }
                    
                                    
                    if (!isNull(widgetIn.m.move.maxX)) {
                        if (x > widgetIn.m.move.maxX) {
                            x = widgetIn.m.move.maxX;
                        }
                    }
                    
                    if (!isNull(widgetIn.m.move.minY)) {
                        if (y < widgetIn.m.move.minY) {
                            y = widgetIn.m.move.minY;
                        }
                    } 
                                    
                    if (!isNull(widgetIn.m.move.maxY)) {
                        if (y > widgetIn.m.move.maxY) {
                            y = widgetIn.m.move.maxY;
                        }
                    }
					 
                    mm.FW.drawWid(widgetIn, x, y);
                    
                },
                /*
                ++
                Draws a widget, at the xIn an yIn position specified.
                */
                drawWid: function(widgetIn, xIn, yIn) {
              
                    // ALL DRAW WIDGETS SHOULD CALL THIS AS THIS PERFORMS GENERIC FUNCTIONS ETC.
					
                    // CHECK IF THE WIDGET IS HIDDEN
                    // DO NOT DRAW IF THE WIDGET IS COMPLETELY OUTSIDE AREA OF THE CANVAS
                    var drawThisWidget = true;
              
                    if (widgetIn.m.hidden == true) {
                        drawThisWidget = false;
                    } else if (yIn + widgetIn.m.h < 0) { // CHECK OUTSIDE OF TOP
                        drawThisWidget = false;
                    } else if (yIn > screen.m.h) {  // CHECK OUTSIDE OF BOTTOM
                        drawThisWidget = false;
                    } else if (xIn + widgetIn.m.w < 0) {  // CHECK OUTSIDE OF LEFT
                          drawThisWidget = false;
                    } else if (xIn > screen.m.w) {  // CHECK OUTSIDE OF RIGHT
                        drawThisWidget = false;
                    }
                    
                    // CHECK IF PARENT IS HIDDEN, THEN THIS IS HIDDEN
                    var parent = widgetIn.m.parent;
                    while (!isNull(parent) && drawThisWidget == true) {
                        if (parent.m.hidden == true) {
                            drawThisWidget = false;
                        }
                        parent = parent.m.parent;
                    }
              
                    // SET THE DRAW ORDER
                    if (settingDrawOrder == true) {
                        drawOrder = drawOrder + 1;
                        widgetIn.m.drawOrder = drawOrder;
                    }
             
                    // DRAW THE ACTUAL WIDGET
                    if (drawThisWidget == true) {
                        widgetIn.draw(ctx, xIn, yIn);  
                    }
                    
                },
                /*
                ++
                This sorts the widgets by their layers.
                */
                sortByLayers: function(mAIn, mBIn) {
                    if (mAIn.m.l > mBIn.m.l) {
                        return 1;
                    } else if (mAIn.m.l < mBIn.m.l) {
                        return -1;
                    } else {  // MUST BE THE SAME LAYER
                        return 0;
                    }
                },
                /*
                Sorts the widgets by their draw order.
                */
                sortByDrawOrder: function(mAIn, mBIn) {
                    if (mAIn.m.drawOrder > mBIn.m.drawOrder) {
                        return -1;
                    } else if (mAIn.m.drawOrder < mBIn.m.drawOrder) {
                        return 1;
                    } else {  // MUST BE THE SAME DRAW ORDER
                        return 0;
                    }
                },
                /*
                This is called when a mouse/finger up event is detected.
                */
                onUp: function(xIn, yIn) {
             
                    // NO EVENTS ALLOWED IF BLOCKING BY KINETIC SCROLLING
                    if (ksBlockOnEvent == true) {
                        return;
                    }
             
                    lastTouchX = xIn;
                    lastTouchY = yIn;
              
                    if (onDownTimer != null) {
                        // CLEAR TIMER
                        clearTimeout(onDownTimer);
                        onDownTimer = null;
                    }
             
                    // DOWN WAS PRESSED BEFORE
                    if (lastDownTime != 0) {
              
                        var redrawPartial = true;
             
                        var currentDate = new Date();
                        var downMouseDiff = currentDate-lastDownTime;
             
                        var widgetsOverList = mm.FW.widgetsUnder(xIn, yIn);
             
                        // BEFORE CHECKING IF THIS IS A CLICK, CHECK IF A FLICK WAS PERFORMED
                        mm.FW.calculateKineticScrolling(xIn, yIn, currentDate);
             
                        if (downMouseDiff <= LIMIT_MILISECONDS_FOR_CLICK && onHoldCalled == false) {  // TODO: TO THINK ABOUT THIS BEING MORE RESPONSIVE?????
                            // BEFORE PERFORMING CLICK, CHECK IF IT WAS A VERY QUICK FLICK
                            if (Math.abs(ksVelocityX) > KINETIC_SCROLLING_MIN_MOVE_RATE || Math.abs(ksVelocityY) > KINETIC_SCROLLING_MIN_MOVE_RATE) {
                                if (mm.Animations.isMouseOverPlayingAnimation(downX, downY, offsetX, offsetY) == false) {
                                    // PERFORM HOLD ON FIRST DOWN
                                    mm.FW.onHold(downX, downY);
                                
                                    // DO I ALSO NEED TO CALL ON MOVE?
                                   
                                    // CODE HERE TO ANIMATE AFTER PUSH FOR SCROLL LIST ETC...
                                    mm.FW.onUpKineticScrollingOrSwipe(xIn, yIn, widgetsOverList);  
                                }
                            } else if (widgetsOverList != null) { // PERFORM NORMAL CLICK PROCESSING
                                // CHECK THAT IT IS NOT A MOVE PRESS
                                if (!(Math.abs(downX - xIn) > MIN_MOVE_RATE || Math.abs(downY - yIn) > MIN_MOVE_RATE)) { 
                                var found = false;
                                var foundComp = null;
                                // CALL ACTION
                                // ONLY GET FIRST CLICKABLE, IGNORE THE REST IF propagate click = false
                                // TO CHECK for (var eachWidget=0;eachWidget<widgetsOverList.length;eachWidget++) {
                                var eachWidget = 0;
                                var propagateClick = true;
              
                                while (eachWidget<widgetsOverList.length && propagateClick == true) {
                                    propagateClick = widgetsOverList[eachWidget].m.propagateClick;
             
                                    if (widgetsOverList[eachWidget].m.hidden == true) {
                                        propagateClick = true;
                                    }
                     
                                    if (widgetsOverList[eachWidget].m.clickable == true) {
              
                                        // CALL THE ACTION
                                        if (widgetsOverList[eachWidget].m.enabled == true) {  // ONLY CALLED IF WIDGET IS NOT DISABLED
              
                                            if (widgetsOverList[eachWidget].clickAction != null && widgetsOverList[eachWidget].clickAction.action != null) {
                                                var clickAction = mm.App.getFunction(widgetsOverList[eachWidget].clickAction.action);
                                                if (clickAction != null) {
                                                    clickAction(widgetsOverList[eachWidget], xIn, yIn); 
                                                }
                                            }
              
                                             // AFTER THE CLICK IS PERFORMED, SEE IF WE HAVE TO NAVIGATE TO ANOTHER PAGE
                                            mm.Pages.navigatePageByClickAction(widgetsOverList[eachWidget], widgetsOverList[eachWidget].clickAction);
              
                                            found = true;
                                            if (widgetsOverList[eachWidget].m.onActionRedrawPartial == false) {
                                                redrawPartial = false;
                                            }
                                            foundComp = widgetsOverList[eachWidget];
              
                                         }
                                    }
                                    eachWidget = eachWidget + 1;
                                }
                                // ONLY CLEAR DRAW IF THE CLICK ACTION HAS BEEN CALLED
                                 if (found == true) {
                                	if (redrawPartial == false) {
                                    	mm.App.repaint();
                                	} else {
                                    	mm.App.repaintWidget(foundComp);
                                	}
                                }
                                } 
                            }
                        } else {
              
                            // CODE HERE TO ANIMATE AFTER PUSH FOR SCROLL LIST ETC...
                            mm.FW.onUpKineticScrollingOrSwipe(xIn, yIn, widgetsOverList);  
                        
                            //mm.FW.unHoldHeldWidgets(xIn, yIn);
                        }
                    }
					
                    lastDownTime = 0;
             
                },
                /*
                Any kind of lists will have kinetic scrolling, if it has been enabled.
                This is called on each kinetic scrolling animation loop.
                */
                animateKinetic: function() {
              
                    ksAnimationTimeout = null;
                
                    ksBlockOnEvent = true;
                
                    if (ksVelocityX > 0.1) {
                        ksVelocityX = ksVelocityX * KINETIC_SCROLLING_DAMPENING;
                        if (ksXDirectionForward == true) {
                            ksMovingX = Math.round(ksMovingX + (ksVelocityX * KINETIC_X_SCROLL_MULTIPLIER));
                        } else {
                            ksMovingX = Math.round(ksMovingX - (ksVelocityX * KINETIC_X_SCROLL_MULTIPLIER));
                        }
                    }
                     
                    if (ksVelocityY > 0.1) {
                        ksVelocityY = ksVelocityY * KINETIC_SCROLLING_DAMPENING;
                        if (ksYDirectionForward == true) {
                            ksMovingY = Math.round(ksMovingY + (ksVelocityY * KINETIC_Y_SCROLL_MULTIPLIER));
                        } else {
                            ksMovingY = Math.round(ksMovingY - (ksVelocityY * KINETIC_Y_SCROLL_MULTIPLIER));
                        }
                    }
                                
                    for(var i=0;i<ksWidgets.length;i++) {
                        ksCurrentComp = ksWidgets[i];
                        var f = mm.App.getFunction(ksCurrentComp.m.holdMovingAction);
                        if (f != null) {
                            f(ksMovingX, ksMovingY, ksCurrentComp);
                        } else {
                            console.log("ERROR: holdMovingAction Function not found: " + ksCurrentComp.m.holdMovingAction);
                        }
                        
                    }            
                                                                                       
                    mm.App.repaint();
                        
                    if (ksVelocityX > 0.1 || ksVelocityY > 0.1) {
                        ksAnimationTimeout = setTimeout("mm.FW.animateKinetic()", KINETIC_SCROLLING_ANIMATION_RATE);  // RECURSIVE CALL
                    } else {
                        // CALL END TO ON UP
                        mm.FW.unHoldHeldWidgets(ksMovingX, ksMovingY); // xIn / yIn ?
                        ksBlockOnEvent = false;
                    }
                       
                },
                /*
                This calculates if the user has invoked kinetic scrolling.
                */
                calculateKineticScrolling: function(xIn, yIn, currentTime) {
              
              
                    ksVelocityX = 0;
                    ksVelocityY = 0;
                    if (ksPreviousPoints != null) {
                        
                        if (currentTime - ksPreviousTimes[0] < KINETIC_SCROLLING_MIN_MOVE_RATE) {
                            // DO NOTHING (KINETIC SCROLLING NOT INVOKED)
                        } else {
                            var difX = xIn - ksPreviousPoints[0].x;
                            var difY = yIn - ksPreviousPoints[0].y;
                            var time = (currentTime - ksPreviousTimes[0]) / (1000 / KINETIC_SCROLLING_FPS);
                            ksVelocityX = difX / time;
                            ksVelocityY = difY / time;
              
                        }
                    }
              
                },
                /*
                On a mouse/touch up event this is used to see if kinetic scrolling or swipe is required.
                */
                onUpKineticScrollingOrSwipe: function(xIn, yIn, widgetsUnderIn) {
              
                
                    ksXIn = xIn;
                    ksYIn = yIn;
                    ksMovingX = xIn;
                    ksMovingY = yIn;
                    
                        
                        if (Math.abs(ksVelocityX) > KINETIC_SCROLLING_MIN_MOVE_RATE || Math.abs(ksVelocityY) > KINETIC_SCROLLING_MIN_MOVE_RATE) {
                        
                            ksXDirectionForward = true;
                            if (ksVelocityX < 0) {
                                ksXDirectionForward  = false;
                            }
                            
                            ksVelocityX = Math.abs(ksVelocityX);
                            
                            ksYDirectionForward = true;
                            if (ksVelocityY < 0) {
                                ksYDirectionForward = false;
                            }
                            
                            ksVelocityY = Math.abs(ksVelocityY);
                        
                            ksWidgets = new Array();
                            
                            // NEED TO ANIMATE IF NECESSARY THE HELD WIDGET
                            if (heldWidgets.length > 0) {
                                for (var eachWidget=0;eachWidget<heldWidgets.length;eachWidget++) {
                            
                                    if (heldWidgets[eachWidget].m.isKineticScrolling == true) {
                                
                                        if (heldWidgets[eachWidget].kineticScrollingEnabled == true) {
                                            
                                            ksWidgets.push(heldWidgets[eachWidget]);
                                        }
                                    }
                                }
                            }
                            if (ksWidgets.length > 0) {
                                // PERFORM ACTUAL ANIMATION
                                mm.FW.animateKinetic();
                            } else {
                                // NO HELD WIDGETS WHICH ARE KINETIC SCROLLING, SO THIS COULD BE A SWIPE
                                // CHECK IF CURRENT PAGE IS LINKED TO SWIPE ACTIVITY
                                var beingHeld = false;
                                var eachWidget = 0;
                                while (beingHeld == false && eachWidget<heldWidgets.length) {
                                    if (heldWidgets[eachWidget].m.beingHeld == true && (heldWidgets[eachWidget].m.holdable == true || heldWidgets[eachWidget].m.movable == true)) {
                                        beingHeld = true;
                                    }
                                    eachWidget = eachWidget + 1;
                                }
                                if (beingHeld == false) {
                                    mm.FW.swipeAction(xIn, yIn, widgetsUnderIn);
                                }
             
                                mm.FW.unHoldHeldWidgets(xIn, yIn);
                            }
                        } else {
                            mm.FW.unHoldHeldWidgets(xIn, yIn);
                        }
                   // }
                    
                    ksPreviousPoints = null;
                    ksPreviousTimes = null;
                    // END KINETIC SCROLLING
                },
                /*
                ++
                This is used to call an actual swipe action.
                */
                swipeAction: function(xIn, yIn, widgetsUnderIn) {
             
                    if (widgetsUnderIn != null && widgetsUnderIn.length > 0) {
             
                        // FIND THE FIRST PAGE, BEING SHOWN
                        var eachWidget = 0;
                        var page = null;
             
                        if (ksVelocityX > 0.1 || ksVelocityY > 0.1) {
                            // FIND THE PAGE
                            while (eachWidget<widgetsUnderIn.length && page == null) {
             
                                if (widgetsUnderIn[eachWidget].m.className == "Page") {
                                    page = widgetsUnderIn[eachWidget];
                                }
             
                                eachWidget = eachWidget + 1;
                            }
                        }
             
                        // IF PAGE != NULL THEN PERFORM THE SWIPE
                        if (page != null) {
             
                            // WORK OUT WHICH SWIPE MOVE IS STRONGEST
                            // IGNORE DIAGIONAL SWIPING FOR THIS CURRENT VERSION.
                            // TO REDESIGN AND THINK ABOUT.
                            if (ksVelocityX > 0.1 && ksVelocityY > 0.1) {
             
                                var difX = Math.abs(xIn - ksPreviousPoints[0].x);
                                var difY = Math.abs(yIn - ksPreviousPoints[0].y);
             
                                if (difX >= difY) {
                                    // GIVE PROIRITY TO X
                                    ksVelocityY = 0;
                                } else {
                                    // GIVE PRIORITY TO Y
                                    ksVelocityX = 0;
                                }
                            }
             
                            if (ksVelocityX > 0.1) {
             
                                if (ksXDirectionForward == true) {
                                    // SWIPE RIGHT
                                    // AT THE MOMENT SWIPE, IS ONLY AVAILABLE FOR PAGES
                                    mm.Pages.swipeRight(page);
                                } else {
                                    // SWIPE RIGHT
                                    // AT THE MOMENT SWIPE, IS ONLY AVAILABLE FOR PAGES
                                    mm.Pages.swipeLeft(page);
                                }
             
                            } else if (ksVelocityY > 0.1) {
                                if (ksYDirectionForward == true) {
                                    // SWIPE DOWN
                                    // AT THE MOMENT SWIPE, IS ONLY AVAILABLE FOR PAGES
                                    mm.Pages.swipeDown(page);
                                } else {
                                    // SWIPE UP
                                    // AT THE MOMENT SWIPE, IS ONLY AVAILABLE FOR PAGES
                                    mm.Pages.swipeUp(page);
                                }
                            }
                        }
                    }
             
                },
				/*
				Method that is called to un hold held widgets.
				*/
                unHoldHeldWidgets: function(xIn, yIn) {
              
                    var redrawPartial = true;
                
                    if (heldWidgets.length > 0) {
                        // CALL ACTION
                        for (var eachWidget=0;eachWidget<heldWidgets.length;eachWidget++) {
                        
                            // ORDER IMPORTANT: Must call this first.
                            if (heldWidgets[eachWidget].m.holdable == true) {
              
                                if (heldWidgets[eachWidget].m.unholdAction != null) {
                                    var f = mm.App.getFunction(heldWidgets[eachWidget].m.unholdAction);
                                    if (f != null) {
              
                                        f(xIn, yIn, heldWidgets[eachWidget]);
                                
                                        if (heldWidgets[eachWidget].m.onActionRedrawPartial == false) {
                                            redrawPartial = false;
                                        }
                                    } else {
                                        console.log("ERROR: unHoldAction Function not found: " + heldWidgets[eachWidget].m.unholdAction);
                                    }
                                    
                                }
                            }
                            
                            if (heldWidgets[eachWidget].m.movable == true) {
										
                                // SEE IF OVER TARGET AND WHAT CAN BE DONE
                                mm.MovingTargets.onUp(ctx, xIn, yIn, heldWidgets[eachWidget]);
									
                                // RESET HELD WIDGET
                                heldWidgets[eachWidget].m.move.moving = false;
                                heldWidgets[eachWidget].m.move.x = 0;
                                heldWidgets[eachWidget].m.move.y = 0;
                                
                                if (heldWidgets[eachWidget].m.onHoldMovingRedrawPartial == false) {  
                                    redrawPartial = false; 
                                }
										
                            }
							
                            // SET beingHold to false
                            heldWidgets[eachWidget].m.beingHeld = false;
                        }
							
                        redrawPartial = false;
                        
                        if (redrawPartial == false) {
                            mm.App.repaint();
                         } else {
                            // ONLY REDRAW HELD WIDGETS
                            for (var eachWidget1=0;eachWidget1<heldWidgets.length;eachWidget1++) {
                                if (heldWidgets[eachWidget1].m.holdable == true) {
                                    mm.App.repaintWidget(heldWidgets[eachWidget1]);
                                }
                            }
                        }
                        heldWidgets = new Array();
                        
                    }
              
                },
                /*
                ++ 
                Called on a mouse/touch down event.
                */
                onDown: function(xIn, yIn) {
             
                    // ON DOWNSTOP ANY KINETIC TIMEOUT
                    if (ksAnimationTimeout != null) {
              
                        clearTimeout(ksAnimationTimeout);
                        ksAnimationTimeout = null;
              
                        mm.FW.unHoldHeldWidgets(ksMovingX, ksMovingY); // xIn / yIn ?
                        ksBlockOnEvent = false;
                    }
              
                    lastTouchX = xIn;
                    lastTouchY = yIn;
					
                    // UNHOLD HELD WIDGETS....  BUG WE NEED TO RESOLVE
                    // (DO NOT KNOW IF REMOVING THIS WILL CAUSE OTHER PROBLEMS) mm.FW.unHoldHeldWidgets(xIn, yIn);
                    downX = xIn;
                    downY = yIn;
              
                    lastDownTime = new Date(); // GETS NEW DOWN
                    
              
                    // USED FOR KINETIC SCROLLING
                    ksPreviousPoints = new Array();
                    ksPreviousTimes = new Array();
                    
                    ksPreviousPoints.push(new mm.KSPoint(xIn, yIn));
                    ksPreviousTimes.push(lastDownTime);
              
                    // LETS PUT A HOLD ON, SO WE KNOW WHEN BEING HOLD DOWN ACTION
                    // IF xIn, yIn over playing animation zone, then disiable on hold.  On hold not possible in
                    // animation zone.
                    if (mm.Animations.isMouseOverPlayingAnimation(xIn, yIn, offsetX, offsetY) == false) {
                        onHoldCalled = false;
                        onDownTimer = setTimeout("mm.FW.onHold(" + xIn + "," + yIn + ")", LIMIT_MILISECONDS_FOR_CLICK+1);
                    }
                },
				/*
				Call this method on move hold operation if you do not want a full redraw.
				*/
                setOnHoldMoveRedraw: function() {  
                    onHoldMoveRedraw = false;
                },
                /*
                ++
                Called on mouse/touch move event.
                */
                onMove: function(xIn, yIn) {
                
                    // NO EVENTS ALLOWED IF BLOCKING BY KINETIC SCROLLING
                    if (ksBlockOnEvent == true) {
                        return;
                    }
                    
                    if (onDownTimer != null) {
              
                        if (lastTouchX > KS_FLICK_DETECTION_PIXELS_MOVED || lastTouchY > KS_FLICK_DETECTION_PIXELS_MOVED) {
                     
                            // CLEAR TIMER
                            clearTimeout(onDownTimer);
                            onDownTimer = null;
                     
                            mm.FW.onHold(lastTouchX, lastTouchY);
                        }
                        
                    }
                
                    onHoldMoveRedrawPartial = true;  // VARIABLE USED FOR WHEN NOT NECESSARY TO REDRAW ON HOLDING MOVE
                
                    lastTouchX = xIn;
                    lastTouchY = yIn;
                    
                    // FOR KINETIC SCROLLING 
                    if (ksPreviousPoints != null) {
                        ksPreviousPoints.push(new mm.KSPoint(xIn, yIn));
                        ksPreviousTimes.push(new Date());
                        if (ksPreviousPoints.length > KINETIC_SCROLLING_HISTORY_LENGTH) {
                            ksPreviousPoints.shift();  // REMOVES FIRST ELEMENT OF THE ARRAY
                            ksPreviousTimes.shift();  // REMOVES FIRST ELEMENT OF THE ARRAY
                        }
                    }
                    // END KINETIC SCROLLING
              
                   if (heldWidgets.length > 0) {
                        for (var eachWidget=0;eachWidget<heldWidgets.length;eachWidget++) {
                     
                            if (heldWidgets[eachWidget].m.movable == true) {
             
                                // CALCULATE THE DIFFERENCE
                                if (heldWidgets[eachWidget].m.move.moveX == true) {
                                    var xDif = xIn - heldWidgets[eachWidget].m.x;
                                    heldWidgets[eachWidget].m.move.x = xDif;
                     
                                 } else {
                                    heldWidgets[eachWidget].m.move.x = 0; //heldWidgets[eachWidget].m.x;
                                }
                     
                                if (heldWidgets[eachWidget].m.move.moveY == true) {
                                    var yDif = yIn - heldWidgets[eachWidget].m.y;
                                    heldWidgets[eachWidget].m.move.y = yDif;
                                    
                                    
                                } else {
                                    heldWidgets[eachWidget].m.move.y = 0; //heldWidgets[eachWidget].m.y;
                                }
             
                                // RESET the widgets real X and Y because this is set on hold.
                                heldWidgets[eachWidget].m.realX = 0;
                                heldWidgets[eachWidget].m.realY = 0;
								
                                // SEE IF OVER ANY TARGETS
                                mm.MovingTargets.onMove(ctx, xIn, yIn, heldWidgets[eachWidget]);
                                
                                onHoldMoveRedrawPartial = false;
                            }
							
                            // ON HOLD MOVE ACTION
                            if (heldWidgets[eachWidget].m.holdMovingAction != null) {
              
                                var f = mm.App.getFunction(heldWidgets[eachWidget].m.holdMovingAction);
                                if (f != null) {
                                    f(xIn, yIn, heldWidgets[eachWidget]);
                     
                                    if (heldWidgets[eachWidget].m.onHoldMovingRedrawPartial == false) {
                                        onHoldMoveRedrawPartial = false;
                                    }
                                } else {
                                    console.log("ERROR: holdMovingAction Function not found: " + heldWidgets[eachWidget].m.holdMovingAction);
                                }
                                   
                            }
							
                        }
                        mm.Animations.animateAllOnce();  // ON EACH HOLD IF NOT THE ANIMATION STOPS.  TO FIX CAN CAUSE PROBLEMS..
                        // SPECIFY IF CLEAR DRAW ON EVERY MOVE, CAN CHANGE FOR PERFORMANCE
                        if (onHoldMoveRedraw == true) {
                           if (onHoldMoveRedrawPartial == false) {
                                // REDRAW THE WHOLE SCREEN
                                mm.App.repaint();
                            } else {
                                // JUST REDRAW HELD WIDGET  (JUST IN THINGS LIKE SCROLLING LISTS ETC)
                                if (heldWidgets.length > 0) {
                                    for (var eachWidget=0;eachWidget<heldWidgets.length;eachWidget++) {
                                        if (heldWidgets[eachWidget].m.holdMovingAction != null) {
                                            mm.App.repaintWidget(heldWidgets[eachWidget]);
                                        }
                                    }
                                }
                            }
                        } else {
                            onHoldMoveRedraw = true;  // RESET REDRAW
                        }
                    }
                },
				/*
				Called when on hold is triggered.
				*/
                onHold: function(xIn, yIn) {
              
                    onHoldCalled = true;
                
                    if (onDownTimer != null) {
                        // CLEAR TIMER
                        clearTimeout(onDownTimer);
                        onDownTimer = null;  // MAKE SURE TIMER IS NULL
                    }
                    
                    heldWidgets = new Array();
              
                    if (lastDownTime != 0) {  // If not 0, then up has not been pressed so on hold
                        var widgetsOverList = mm.FW.widgetsUnder(downX, downY);  // IS THIS STALLING THE BLACKBERRY ???
                        if (widgetsOverList != null) {
                            // CALL ACTION
                            var eachWidget = 0;
                            var propagateHold = true;
                            while (eachWidget<widgetsOverList.length && propagateHold == true) {
                     
                                propagateHold = widgetsOverList[eachWidget].m.propagateHold;
                     
                                if (widgetsOverList[eachWidget].m.holdable == true && widgetsOverList[eachWidget].m.enabled == true ) {
                                    // CALL THE ACTION
                                    var f = mm.App.getFunction(widgetsOverList[eachWidget].m.holdAction);
                                    if (f != null) {
                                        f(downX, downY, widgetsOverList[eachWidget]);
                                    } else {
                                        console.log("ERROR: holdAction Function not found: " + widgetsOverList[eachWidget].m.holdAction);
                                    }
                                    
                                    
                                }
                                if (widgetsOverList[eachWidget].m.movable == true && widgetsOverList[eachWidget].m.enabled == true ) {
                                    widgetsOverList[eachWidget].m.move.moving = true;
                                }
								
					           // TO SEE IF DOES DIFFERENCE
                                if (widgetsOverList[eachWidget].m.enabled == true) {
                                    widgetsOverList[eachWidget].m.beingHeld = true;
                                    heldWidgets.push(widgetsOverList[eachWidget]);
                                }
                                eachWidget = eachWidget + 1;
                            }
							
                            if (heldWidgets != null && heldWidgets.length > 0) {
                                heldWidgets.sort(mm.FW.sortByDrawOrder);
                            }
             
                            mm.Animations.animateAllOnce();  // ON EACH HOLD IF NOT THE ANIMATION STOPS.
                            mm.App.repaint();
                        }
                    }
              
                },
                /*
                ++
                Returns a list of widgets which are currently under the xIn an yIn.
                This is the standard widgets under function, individual widgets may have specific methods to perform this.
                This function is set on the widget.m.widgetsUnder for each widget, unless a none standard function specified.
                */
                standardWidgetsUnder: function(xIn, yIn, offsetXIn, offsetYIn, widgetToCheckIn) {
              
                    var widgetsUnder = new Array;
                    if (widgetToCheckIn.selectableArea != null) {
                        if (widgetToCheckIn.selectableArea(canvasOffsetXIn, canvasOffsetYIn, xIn,yIn) == true) {
                            widgetsUnder.push(widgetToCheckIn);
                        }
                    } else {
                        // IS STANDARD xIn, yIn, width and height
                        if (mm.Shapes.isInArea(xIn, yIn, offsetXIn + widgetToCheckIn.m.x, offsetYIn + widgetToCheckIn.m.y, widgetToCheckIn.m.w, widgetToCheckIn.m.h) == true) {
                             widgetsUnder.push(widgetToCheckIn);
                        }
                    }
                    if (widgetsUnder.length <= 0) {
                        return null;
                    } else {
                        return widgetsUnder;
                    }
                },
                /*
                ++
                Lists the widgets that are currently under the xIn and yIn position.
                If no widgets are under than this returns null.
                */ 
                widgetsUnder: function(xIn, yIn) {
                    var widgetsOverList = new Array();
              
                    // LOOP THROUGH ALL OF THE WIDGETS
                    for (var eachWidget=0;eachWidget<screen.m.widgets.length;eachWidget++) {
                        if (screen.m.widgets[eachWidget].m.widgetsUnder != null) {
                            // DO NOT CHECK HIDDEN WIDGETS
                            if (screen.m.widgets[eachWidget].m.hidden == false) {
                                var widgetsSelected = screen.m.widgets[eachWidget].m.widgetsUnder(xIn, yIn, offsetX, offsetY, screen.m.widgets[eachWidget]);  // RETURNS A LIST OF SELECTED WIDGETS
                                if (widgetsSelected != null) {
                                    for(var i=0;i<widgetsSelected.length;i++) {
                                        widgetsOverList.push(widgetsSelected[i]);
                                    }
                                }
                            }
                        } 
                    }
              
                    // SEE IF THE SCREEN IS UNDER THE POINTER
                    if (mm.Shapes.isInArea(xIn, yIn, screen.m.x + offsetX, screen.m.y + offsetY, screen.m.w, screen.m.h)) {
                        widgetsOverList.push(screen);
                    }
              
                    if (widgetsOverList.length <= 0) {
                        return null;
                    } else {
                        widgetsOverList.sort(mm.FW.sortByDrawOrder);
                        return widgetsOverList;
                    }
              
                },
                /*
                Sets the globalAlpha variable.
                */
                setGlobalAlpha: function(alphaIn) {
                    globalAlpha = alphaIn;
                },
                /*
                Returns the globalAlpha variable.
                */
                getGlobalAlpha: function() {
                    return globalAlpha;
                },
                copyWidget: function(newIdIn, widgetIn) {
                    // PERFOMS A DEEP COPY ON WIDGET, RETURNING A NEW WIDGET INSTANCE.
					
                    var mNew = new Widget(newIdIn, widgetIn.type, widgetIn.className, widgetIn.x, widgetIn.y, widgetIn.w, widgetIn.h, widgetIn.areaIn, widgetIn.lIn);
                    mNew.standardMoveOver = widgetIn.standardMoveOver;
                    mNew.standardMoveOutOver = widgetIn.standardMoveOutOver;
                    mNew.clickable = widgetIn.clickable;
                    mNew.holdable = widgetIn.holdable;
                    mNew.holdAction = widgetIn.holdAction;
                    mNew.unholdAction = widgetIn.unholdAction;
                    mNew.holdMovingAction = widgetIn.holdMovingAction;
                    mNew.clearHoldingAction = widgetIn.clearHoldingAction;
                    mNew.movable = widgetIn.movable;
                    mNew.isStandardMoveover = widgetIn.isStandardMoveover;
                    mNew.selectableArea = widgetIn.selectableArea;
                    mNew.container = widgetIn.container;
                    mNew.center = widgetIn.center;
                    mNew.widgetsUnder = widgetIn.widgetsUnder;
                    mNew.hidden = widgetIn.hidden;
                    mNew.copy = widgetIn.copy;
                    mNew.moveOver = widgetIn.moveOver; 
                    mNew.moveOutOver = widgetIn.moveOutOver;
                    mNew.move = widgetIn.move;
                    mNew.parent = widgetIn.parent;
                    // TODO : THINK IF THIS IS DEEP ENOUGH
                    mNew.widgets = widgetIn.widgets;
                    mNew.realX = widgetIn.realX;
                    mNew.realY = widgetIn.realY;
                          
                    return mNew;
                },
                /*
                Returns the HTML5 canvas context.
                */
                getCtx: function() {
                    return ctx;
                },
                /*
                Sets the HTML5 canvas context.
                */
                setCtx: function(ctxIn) {
                    ctx = ctxIn;
                },
				/*
				Returns the last touch x position.
				*/
                getLastTouchX: function() {
                    return lastTouchX;
                },
				/*
				Returns the last touch y position.
				*/
                getLastTouchY: function() {
                    return lastTouchY;
                }
            };
    
        })(),

		
        /*
        ++
        This module is specifically used for moving targets, used for drag and drop.
        */
        MovingTargets: (function() {
		
            var onMoveTargets = new Array();
            
              
            return {
                // ADD A TARGET.  moveDropActionIn, moveOverActionIn and moveOutOverActionIn may be null.
                /* MWM TODO addMovingTarget: function(sourceTypeIn, targetWidgetIn, moveDropActionIn, moveOverActionIn, moveOutOverActionIn, movementTypeIn) {
                    if (targetWidgetIn.m.moveOver == null) {
                        targetWidgetIn.m.moveOver = new Array();
                    }
					
                    if (movementTypeIn == null) {
                        movementTypeIn = mm.NOTHING();
                    }
					var moveOver = new mm.MoveOver();
                    moveOver.sourceType = sourceTypeIn;
                    moveOver.moveDropAction = moveDropActionIn;
                    moveOver.moveOverAction = moveOverActionIn;
                    moveOver.moveOutOverAction = moveOutOverActionIn;
                    moveOver.movementType = movementTypeIn;
                    
                    targetWidgetIn.m.moveOver.push(moveOver);
                },*/
                doesTypeAlreadyExistForTarget: function(targetWidgetIn, typeIn) {
                    // Returns true if this type already exists for this target
                    var exists = false;
					
                    if (targetWidgetIn.m.moveOver != null) {
                        var iEachType = 0;
                        while (exists == false && iEachType<targetWidgetIn.m.moveOver.length) {
                            if (targetWidgetIn.m.moveOver[iEachType].sourceType == typeIn) {
                                exists = true;
                            }
						
                            iEachType = iEachType + 1;
                        }
					
                    }
					
                    return exists;
                },
				/*
				This clears all the moving targets.
				*/
                clearMovingTargets: function(ctx, xIn, yIn, movingWidgetIn) {
                    for (var eachWidget=0;eachWidget<onMoveTargets.length;eachWidget++) {
                        if (onMoveTargets[eachWidget].m.moveOver != null) {
                            for (var eachMoveOver=0; eachMoveOver < onMoveTargets[eachWidget].m.moveOver.length; eachMoveOver++) {
                                if (onMoveTargets[eachWidget].m.moveOver[eachMoveOver].sourceType == movingWidgetIn.m.type) {
					
                                    if (onMoveTargets[eachWidget].m.moveOver[eachMoveOver].moveOutOverAction != null) {
                                            var moveOutOverFunction = mm.App.getFunction(onMoveTargets[eachWidget].m.moveOver[eachMoveOver].moveOutOverAction);
                                           if (moveOutOverFunction != null) {
                                                moveOutOverFunction(ctx, xIn, yIn, movingWidgetIn, onMoveTargets[eachWidget], onMoveTargets[eachWidget].m.moveOver[eachMoveOver]);
                                            } else {
                                                console.log("ERROR: moveOutOver Function not found: " + onMoveTargets[eachWidget].m.moveOver[eachMoveOver].moveOutOverAction);
                                            }
                                    } else {
                                        if (onMoveTargets[eachWidget].m.isStandardMoveover == true) {
                                            onMoveTargets[eachWidget].m.standardMoveOutOver(ctx, xIn, yIn, movingWidgetIn, onMoveTargets[eachWidget]);
                                        }
                                    }
                                }
                            }
                        }
                    }
						
                    onMoveTargets = new Array();
                },
				/*
				This removes a list of widgets under x and y position.
				It will remove the moving target from the list.
				*/
                widgetsUnder: function(xIn, yIn, movingWidgetIn) {
                    var widgetsUnder = mm.FW.widgetsUnder(xIn, yIn);  // TO EXCLUDE MOVING WIDGET
					
                    if (widgetsUnder != null) {
                        var eachWidget = 0;
                        var found = false;
                        while (eachWidget < widgetsUnder.length && found == false) {
                            if (widgetsUnder[eachWidget].m.id == movingWidgetIn.m.id) {
                                found = true;
                            }
							
                            eachWidget = eachWidget + 1;
                        }					
                        if (found == true) {
                            widgetsUnder.remove(eachWidget - 1);
                        }
                        if (widgetsUnder.length <= 0) {
                            widgetsUnder = null;
                        }
                    }
                    
                    // SORT WIDGETS BY DRAW ORDER
                     if (widgetsUnder == null || widgetsUnder.length <= 0) {
                        return null;
                    } else {
                        widgetsUnder.sort(mm.FW.sortByDrawOrder);
                        return widgetsUnder;
                    }

					
                    return widgetsUnder;
                },
				/*
				Called when a moving target is being moved.
				*/
                onMove: function(ctx, xIn, yIn, movingWidgetIn) {
                
                    mm.MovingTargets.clearMovingTargets(ctx, xIn, yIn, movingWidgetIn);
				
                    var widgetsUnder = mm.MovingTargets.widgetsUnder(xIn, yIn, movingWidgetIn);  // HAVE TO EXCLUDE MOVING WIDGET
                    if (widgetsUnder != null) {
                        // LOOP THROUGH ALL OF THE WIDGETS
                        for (var eachWidget=0;eachWidget<widgetsUnder.length;eachWidget++) {
                            if (widgetsUnder[eachWidget].m.moveOver != null) {
                                for (var eachMoveOver=0; eachMoveOver < widgetsUnder[eachWidget].m.moveOver.length; eachMoveOver++) {
                                    if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].sourceType == movingWidgetIn.m.type) {
                        
                                        if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].moveOverAction != null) {
                        
                                            var moveOverFunction = mm.App.getFunction(widgetsUnder[eachWidget].m.moveOver[eachMoveOver].moveOverAction);
                                            if (moveOverFunction != null) {
                                                moveOverFunction(ctx, xIn, yIn, movingWidgetIn, widgetsUnder[eachWidget], widgetsUnder[eachWidget].m.moveOver[eachMoveOver]);
                                            } else {
                                                console.log("ERROR: moveOver Function not found: " +widgetsUnder[eachWidget].m.moveOver[eachMoveOver].moveOverAction);
                                            }
                                            
                                            onMoveTargets.push(widgetsUnder[eachWidget]);
                                        } else {
                                            if (widgetsUnder[eachWidget].m.isStandardMoveover == true) {
                                                widgetsUnder[eachWidget].m.standardMoveOver(ctx, xIn, yIn, movingWidgetIn, widgetsUnder[eachWidget]);
                                                onMoveTargets.push(widgetsUnder[eachWidget]);
                                            }
                                        }
										
                                    }
                                }
                            }
                        }
                    }
				
                },
				/*
				Called when an on up is triggered for a moving target.
				*/
                onUp: function(ctx, xIn, yIn, movingWidgetIn) {
                
                    mm.MovingTargets.clearMovingTargets(ctx, xIn, yIn, movingWidgetIn);
                    
                    var widgetsUnder = mm.MovingTargets.widgetsUnder(xIn, yIn, movingWidgetIn);  // I GUESS WIDGETS SHOULD BE SORTED BY DRAW ORDER ???
                     
                    if (widgetsUnder != null) {
                        // LOOP THROUGH ALL OF THE WIDGETS
                        var propagateOnDrop = true;
                        var eachWidget = 0;
                        while (eachWidget<widgetsUnder.length  && propagateOnDrop == true) {
                             propagateOnDrop = widgetsUnder[eachWidget].m.propagateOnDrop;
                             if (widgetsUnder[eachWidget].m.moveOver != null) {
                        
                                for (var eachMoveOver=0; eachMoveOver < widgetsUnder[eachWidget].m.moveOver.length; eachMoveOver++) {
                                    if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].sourceType == movingWidgetIn.m.type) {
										
                                        // SEE IF COPY OR NOTHING OR MOVE
                                        // IF MOVE DELETE FROM PARENT
                                        var m = movingWidgetIn;
                                        if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].movementType == mm.MOVE()) {
                                            // DELETE FROM PARENT WIDGET
                                            mm.App.deleteWidgetFromParent(movingWidgetIn);
                        
                                            // ADD THE WIDGET TO THE NEW WIDGET
                                            movingWidgetIn.m.x = xIn - widgetsUnder[eachWidget].m.x;
                                            movingWidgetIn.m.y = yIn - widgetsUnder[eachWidget].m.y;
                                            mm.App.add(widgetsUnder[eachWidget], movingWidgetIn);
                                        } else if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].movementType == mm.COPY()) {
                                            m = movingWidgetIn.copy();  // PERFORM A DEEP COPY....
                                            // CREATE A NEW ID RANDOMLY
                                            m.m.id  = m.m.id + "_" + mm.FW.getNextId(); 
                                        } else if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].movementType == mm.STICK()) {
                                            // STICK ONLY WORKS IF PARENT IS THE SAME AS WIDGETS UNDER???
                                            if (m.m.parent.m.id == widgetsUnder[eachWidget].m.id) {
                                                // THEN THIS IS THE PARENT (SO JUST MOVE IT)
                                                if (m.m.move.moveX == true) {
                                                    m.m.x = xIn - widgetsUnder[eachWidget].m.x;
                                                    
                                                    if (!isNull(m.m.move.minX)) {
                                                        if (m.m.x < m.m.move.minX) {
                                                            m.m.x = m.m.move.minX;
                                                        }
                                                    } 
                                    
                                                    if (!isNull(m.m.move.maxX)) {
                                                        if (m.m.x > m.m.move.maxX) {
                                                            m.m.x = m.m.move.maxX;
                                                        }
                                                    }
                                                }
                                                if (m.m.move.moveY == true) {
                                                    m.m.y = yIn - widgetsUnder[eachWidget].m.y;
                                                    
                                                    if (!isNull(m.m.move.minY)) {
                                                        if (m.m.y < m.m.move.minY) {
                                                            m.m.y = m.m.move.minY;
                                                        }
                                                    } 
                                    
                                                    if (!isNull(m.m.move.maxY)) {
                                                        if (m.m.y > m.m.move.maxY) {
                                                            m.m.y = m.m.move.maxY;
                                                        }
                                                    }
                                                }
                                            }
                                        }
										
                                        // MUST RUN ACTION IF NOT NULL
                                        if (widgetsUnder[eachWidget].m.moveOver[eachMoveOver].moveDropAction != null) {
                                            var moveDropFunction = mm.App.getFunction(widgetsUnder[eachWidget].m.moveOver[eachMoveOver].moveDropAction);
                                            if (moveDropFunction != null) {
                                                moveDropFunction(ctx, xIn, yIn, m, widgetsUnder[eachWidget], widgetsUnder[eachWidget].m.moveOver[eachMoveOver]);
                                            } else {
                                                console.log("ERROR: moveDrop Function not found: " + widgetsUnder[eachWidget].m.moveOver[eachMoveOver].moveDropAction);
                                            }
                                        }
                                    }
                                    
                                }
                            }
                            eachWidget = eachWidget + 1;
                        }
                        
                       
                    }
					
                }
            };
    
        })(),
		
        /*
		++
        Methods that are specific to the container widgets.
        
        Generally used for internal use only.
        */
        Container: (function() {
		
            return {
                /*
                This adds a widget to a container widget.  For external use, please use:
                
                mm.App.add(containerIn, widgetIn)
                
                */
                adds: function(containerIn, widgetsIn) {
                    if (containerIn.m.container == true && widgetsIn != null) {  // MAKE SURE THIS IS A COMPOSITE.
                        if (containerIn.m.widgets == null) {
                            containerIn.m.widgets = new Array();
                        }
						
                        for(var eachWidget = 0; eachWidget<widgetsIn.length; eachWidget++) {
                           widgetsIn[eachWidget].m.parent = containerIn;
                           containerIn.m.widgets.push(widgetsIn[eachWidget]);  // MUST BE HERE
                        }
                        
                        // SORT WIDGETS BY LAYER
                        containerIn.m.widgets.sort(mm.FW.sortByLayers);
						
                    }
                },
                /*
                This deletes a widget from its container widget.
                It disconnects the widget from its parent, but does not actually remove the widget from memory.
                */
                deleteWidget: function(containerIn, widgetIn) {
                    if (containerIn.m.container == true && containerIn.m.widgets != null) {  // MAKE SURE THIS IS A COMPOSITE.
                        var pos = mm.Container.findPositionInWidgets(containerIn, widgetIn);
                        if (pos != -1) {
                            containerIn.m.widgets.remove(pos);
                        }
                        widgetIn.m.parent = null;
                    }
                },
                /*
                ++
                Returns the position (Integer) of the widget in its container.  If not found returns -1.
                */
                findPositionInWidgets: function(containerIn, widgetIn) {
                    // IF -1 then not found, SEARCH USES ID....
                    var found = false;
                    if (containerIn.m.container == true && containerIn.m.widgets != null) {  // MAKE SURE THIS IS A CONTAINER.
                        var eachWidget = 0;
                        while (eachWidget<containerIn.m.widgets.length && found == false) {
                            if (widgetIn.m.id == containerIn.m.widgets[eachWidget].m.id) {
                                found = true;
                            }
                            eachWidget = eachWidget + 1;
                        }
                    }
					
                    if (found == true) {
                        return eachWidget - 1;
                    } else {
                        return -1;
                    }
                },
                moveInsertWidget: function(containerIn, widgetIn, posIn) {
                    // IF this widget already exists in the widgets list then it is moved.
                    // IF this widget is new, then it is inserted.

                    if (containerIn.m.container != false) {
                        if (containerIn.m.widgets == null) {
                            // CAN ONLY BE NEW WIDGET
                            mm.App.add(containerIn, widgetIn);
							
                            mm.FW.listConvertWidgetPercentToPixels(widgetIn, containerIn.m.w, containerIn.m.h);
                        } else {
                            var eachWidget = 0;
                            var tempArray = containerIn.m.widgets;
                            containerIn.m.widgets = new Array();
							
                            var foundPos = mm.Container.findPositionInWidgets(containerIn, widgetIn);
						
                            // FIRST PART OF LIST
                            for (var eachWidget = 0; eachWidget<posIn; eachWidget++) {
                                if (tempArray[eachWidget].m.id == widgetIn.m.id) {
                                // Do nothing
                                } else {
                                    mm.App.add(containerIn, tempArray[eachWidget]);  
                                }
                            }
							
                            // Push moving widget
                            mm.App.add(containerIn, widgetIn);
                            if (foundPos == -1) {
                                mm.FW.listConvertWidgetPercentToPixels(containerIn.m.widgets, containerIn.m.w, containerIn.m.h);
                            }
							
                            // Last part of array
                            for (var eachWidget = posIn; eachWidget<tempArray.length; eachWidget++) {
                                if (tempArray[eachWidget].m.id == widgetIn.m.id) {
                                // Do nothing
                                } else {
                                    mm.App.add(containerIn, tempArray[eachWidget]); 
                                }
                            }		
                        }							
                    }
                },
                /*
                ++
                Set all widgets belonging to the container, and the container to the enabled flag passed in.
                */
                setEnabled: function(containerIn, enabledIn) {
                    // SETS THIS WIDGET AND ALL OF THE COMPOSITES WITHIN COMPOSITES TO enabledIn
                    containerIn.m.enabled = enabledIn;
                    if (containerIn.m.widgets != null) {
                        for(var eachComp=0;eachComp<containerIn.m.widgets.length;eachComp++) {
                            if (containerIn.m.widgets[eachComp].m.container == true) {
                                mm.Container.setEnabled(containerIn.m.widgets[eachComp], enabledIn);
                            } else {
                                containerIn.m.widgets[eachComp].m.enabled = enabledIn;
                            }
                        }
                    }
                },
                /*
                ++
                Set all widgets belonging to the container, and the container to hidden flag passed in.
                TODO: SEE IF THIS IS NECESSARY - Difference between hidden and invisible.
                */
                setHidden: function(containerIn, hiddenIn) {
                    // SETS THIS WIDGET AND ALL OF THE COMPOSITES WITHIN COMPOSITES TO hiddenIn
                    containerIn.m.hidden = hiddenIn;
                    if (containerIn.m.widgets != null) {
                        for(var eachComp=0;eachComp<containerIn.m.widgets.length;eachComp++) {
                            if (containerIn.m.widgets[eachComp].m.container == true) {
                                mm.Container.setHidden(containerIn.m.widgets[eachComp], hiddenIn);
                            } else {
                                containerIn.m.widgets[eachComp].m.hidden = hiddenIn;
                            }
                        }
                    }
                },
				/*
				Set the widget and its children to the value of the shownIn boolean value.
				*/
                setIsShown: function(widgetIn, shownIn) {
                
                    widgetIn.m.shown = shownIn;
                    if (widgetIn.m.container == true) {
                        if (widgetIn.m.widgets != null) {
                            for(var eachComp=0;eachComp<widgetIn.m.widgets.length;eachComp++) {
                                mm.Container.setIsShown(widgetIn.m.widgets[eachComp], shownIn);  // RECURSIVE
                            }
                        }
                    }
                
                }
            };
    
        })(),
		
        /*
        ++
        Functions specific to each widget, generic functions.
        
        Generally for internal use only.
        */
        Widgets: (function() {
		
              
            return {
                /*
                Used when adding a new widget.  
                
                Sets up the standard attributes in widget.m
                */
                add: function(idIn, typeNameIn, classNameIn, xIn, yIn, widthIn, heightIn, layerIn) {
				
                    if (isNull(idIn)) {
                        // Calculate id, based on class name + generated id.
                        idIn = classNameIn + mm.FW.getNextId();
                    }
					
                    if (isNull(typeNameIn)) {
                        // Set it to the same as the id.
                        typeNameIn = idIn;
                    }
					
                    if (isNull(xIn)) {
                        xIn = "0";
                    }
					
                    if (isNull(yIn)) {
                        yIn = "0";
                    }
					
                    if (isNull(widthIn)) {
                        widthIn = "0";
                    }
					
                    if (isNull(heightIn)) {
                        heightIn = "0";
                    }
					
                    if (isNull(layerIn)) {
                        layerIn = 1;
                    }
				
                    var m = new mm.Widget(idIn, typeNameIn, classNameIn, xIn, yIn, widthIn, heightIn, layerIn);
				
                    return m;  // RETURN THE NEWLY CREATED WIDGET M.
                },
				/*
				Converts a widget class to its widgets then adds the widgets to it.
				*/
                addC: function(classIn, widgetsIn) {
                
                    var widget = null;
                
                    var widgetClass = mm.XML.findCommonWidgetClass(classIn);
                  
                    if (widgetClass != null) {
                  
                        var containerArray = new Array();
                  
                        mm.Widgets.addWidgetClass(containerArray, widgetClass);  // CONTAINER ARRAY CAN ONLY HAVE 1 ELEMENT
                  
                        if (containerArray.length > 0) {
                            widget = containerArray[0];
                  
                            // ADD WIDGETS TO THE CONTAINER WIDGET
                            if (widget.m.container == true && !isNull(widgetsIn) && widgetsIn.length > 0) {
                                mm.Container.adds(widget, widgetsIn);
                            }
                        }
                  
                    }
                  
                  
                    return widget;
                
                },
                /*
                This converts a widget class into actual widgets.
                
                Internal use only. For external use please use:
                    mm.App.addWidgetX
                
                */
                addWidgetClass: function(containerArray, widgetClass) { // INTERNAL USE
                
                    // IF PRE-LOAD == FALSE THEN WE DO NOT LOAD IT
                    if (widgetClass.preLoad == true) {
                  
                        var widgets = new Array();
                  
                        // ADD THE OTHER WIDGETS THAT ARE PART OF THIS CONTAINER WIDGET
                        if (widgetClass.widgets != null) {
                            for (var i=0;i<widgetClass.widgets.length;i++) {
                                mm.Widgets.addWidgetClass(widgets, widgetClass.widgets[i]);
                            }
                        }
                  
                        // ADD THE WIDGET
                        var widget = null;
                  
                        // CALL THE CORRECT CODE TO CONVERT WIDGETCLASS TO WIDGET BY CLASS NAME
                        if (widgetClass.className == "PageFlow") {
                            widget = mm.Pages.addPageFlowWidgetClass(widgetClass, widgets);
                        } else if (widgetClass.className == "Page") {
                            widget = mm.Pages.addWidgetClass(widgetClass, widgets);
                        } else if (widgetClass.className == "Fragment") {
                            widget = mm.Fragments.addWidgetClass(widgetClass, widgets);
                        } else if (widgetClass.className == "Text") {
                             widget = mm.Texts.addWidgetClass(widgetClass);
                        } else if (widgetClass.className == "List") {
                            widget = mm.Lists.addWidgetClass(widgetClass, widgets);
                        } else if (widgetClass.className == "Image") {
                            widget = mm.Images.addWidgetClass(widgetClass);
                        } else if (widgetClass.className == "Input") {
                            widget = mm.Inputs.addWidgetClass(widgetClass);
                        } else if (widgetClass.className == "Animation") {
                            widget = mm.Animations.addWidgetClass(widgetClass, widgets);
                        } else if (widgetClass.className == "Circle") {
                            widget = mm.Circles.addWidgetClass(widgetClass, widgets);
                        } else if (widgetClass.className == "Polygon") {
                            widget = mm.Polygons.addWidgetClass(widgetClass, widgets);
                        }
                  
                        // CALL FOR TEXTS
                        if (widgetClass.texts != null && widgetClass.texts.length > 0) {
                            widget.m.texts = new Array();
                  
                            for (var i=0;i<widgetClass.texts.length;i++) {
                                mm.Widgets.addWidgetClass(widget.m.texts, widgetClass.texts[i]);
                            }
                        }
                  
                        // CALL INITIALISE IF IT EXISTS
                        if (widget.m.stages != null && widget.m.stages.init != null) {
                            var initFunction = mm.App.getFunction(widget.m.stages.init);
                            if (initFunction != null) {
                                initFunction(widget);
                            } else {
                                console.log("ERROR: Function not found: " + widget.m.stages.init);
                            }
                        }
                  
                        // ADD THE WIDGET TO THE CONTAINER
                        containerArray.push(widget);
                  
                    }
                  
                },
                /*
                This function gets the widget.m attributes from the WidgetClass.
                It is used by all widgets, when converting widgetclass to widget.
                */
                updateWidgetXML: function(widgetClassIn, widgetIn) {
                    // THIS FUNCTION IS USED TO GET M attributes from the XML
                    // for enabled/hidden/propagateClick/propagateHold
                    // so it is not necessary to use JavaScript on add.
                    var enabled = mm.XML.getBoolean(widgetClassIn, "Enabled");
                    var hidden = mm.XML.getBoolean(widgetClassIn, "Hidden");
                    var propagateClick = mm.XML.getBoolean(widgetClassIn, "PropagateClick");
                    var propagateHold = mm.XML.getBoolean(widgetClassIn, "PropagateHold");
                    var onHoldMovingRedrawPartial = mm.XML.getBoolean(widgetClassIn, "OnHoldMovingRedrawPartial");
                    var onActionRedrawPartial = mm.XML.getBoolean(widgetClassIn, "OnActionRedrawPartial");
                    var propagateOnDrop = mm.XML.getBoolean(widgetClassIn, "PropagateOnDrop");
                    var stages = mm.XML.getClass(widgetClassIn, "Stages");
                  
                    var invisible = mm.XML.getBoolean(widgetClassIn, "Invisible");
                    if (!isNull(invisible)) {
                        widgetIn.m.invisible = invisible;
                    }
                  
                    if (!isNull(enabled)) {
                        widgetIn.m.enabled = enabled;
                    }
                    
                    if (!isNull(hidden)) {
                        widgetIn.m.hidden = hidden;
                    }
                    
                    if (!isNull(propagateClick)) {
                        widgetIn.m.propagateClick = propagateClick;
                    }
                    
                    if (!isNull(propagateHold)) {
                        widgetIn.m.propagateHold = propagateHold;
                    }
                    
                    if (!isNull(onHoldMovingRedrawPartial)) {
                        widgetIn.m.onHoldMovingRedrawPartial = onHoldMovingRedrawPartial;
                    }
                    
                    if (!isNull(onActionRedrawPartial)) {
                        widgetIn.m.onActionRedrawPartial = onActionRedrawPartial;
                    }
                    
                    if (!isNull(propagateOnDrop)) {
                        widgetIn.m.propagateOnDrop = propagateOnDrop;
                    }
                  
                    if (!isNull(stages)) {
                        widgetIn.m.stages = stages;
                    }
                  
                    var alignVert = mm.XML.getString(widgetClassIn, "AlignVert");
                    var alignSpacingVert = mm.XML.getInt(widgetClassIn, "AlignSpacingVert");
                    var alignHoz = mm.XML.getString(widgetClassIn, "AlignHoz");
                    var alignSpacingHoz = mm.XML.getInt(widgetClassIn, "AlignSpacingHoz");
                    var alignIn = mm.XML.getBoolean(widgetClassIn, "AlignIn");
                  
                    widgetIn.m.alignVert = alignVert;
                    widgetIn.m.alignHoz = alignHoz;
                    if (!isNull(alignSpacingHoz)) {
                        widgetIn.m.alignSpacingHoz = alignSpacingHoz;
                    }
                    if (!isNull(alignSpacingVert)) {
                        widgetIn.m.alignSpacingVert = alignSpacingVert;
                    }
                    if (!isNull(alignIn)) {
                        widgetIn.m.alignIn = alignIn;
                    }
                  
                    // FOR MOVE OVER
                    var moveOverArray = mm.XML.getArray(widgetClassIn, "MoveOver");
                    if (moveOverArray != null && moveOverArray.length > 0) {
                        widgetIn.m.moveOver = moveOverArray;
                    }
                  
                }
            };
    
        })(),
      
        /*
        ++
        This module is specific to the Text widget.
        */
        Texts: (function() {
		
            return {
                /*
                This converts a WidgetClass to a new instance of the Text widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                   
                    var font = mm.XML.getString(widgetClassIn, "Font");
                    var fontSize = mm.XML.getInt(widgetClassIn, "FontSize");
                    var fontType = mm.XML.getString(widgetClassIn, "FontType");
                
                    var message = mm.XML.getString(widgetClassIn, "Message");
    
                    var text = "";
                    if (message != null && message.length > 0) {
                        text = mm.XML.getMessage(message);
                
                    } else {
                        text = mm.XML.getString(widgetClassIn, "Text");
                    }
                
                
                    var vertical = mm.XML.getBoolean(widgetClassIn, "Vertical");
                    
                    var text = mm.Texts.add(id, type, x, y, l, text, style, font, fontSize, fontType, vertical);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, text);
                    
                    return text;
                
                },
                /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Text widget
                using pure JavaScript.
                This method can be used to add a Text widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    layerIn: Int: This is layer for the text widget.
                    textIn: String: This is the text to be displayed to the user.
                    styleIn: WidgetStyle: This is the style for the text. s.colour = colour of the font.
                    fontIn: String: This is the font to be used such as "Arial"
                    fontSizeIn: Int: This is the font size.
                    fontTypeIn: String: This is the font type in such as "bold"
                    verticalIn: Boolean: If set to true the font is displayed vertically, otherwise display horizontally.
                Output:
                    New Text widget instance.
                
                */
                add: function(idIn, typeNameIn, xIn, yIn, layerIn, textIn, styleIn, fontIn, fontSizeIn, fontTypeIn, verticalIn)  {
				
                    if (isNull(fontSizeIn)) {
                        // SET DEFAULT fontsize
                        fontSizeIn = 12;
                    }
                
                    if (isNull(fontTypeIn)) {
                        // SET DEFAULT fontType
                        fontTypeIn = "normal";
                    }
					
                     var m = mm.Widgets.add(idIn, typeNameIn, "Text", xIn, yIn, "0", "0", layerIn);
                
                    m.widgetsUnder = mm.FW.standardWidgetsUnder;
                
                    var font = fontIn;
                    if (isNull(font)) {
                        // SET DEFAULT FONT
                        font = "Arial";
                    }
                
                    var text = new mm.Text(m, textIn, styleIn, font, fontSizeIn, mm.Texts.draw);
                
                    text.fontType = fontTypeIn;
					
                    // TEXT IS NOT CLICKABLE OR MOVABLE, SO SET TO FALSE
                    text.m.enabled = false;
                    text.m.movable = false;
                
                    if (isNull(verticalIn)) {
                        verticalIn = false;
                    }
                    text.vertical = verticalIn;
                
                    // Calculate text height and width
                    mm.Texts.calculateTextWidth(text);
                    mm.Texts.calculateTextHeight(text);
							
                    return text;  // RETURN THE NEWLY CREATED TEXT TO THE DEVELOPER.
                },
				/*
                ++
                Draws all of the widgets in its container.
                */
                drawInWidget: function(xIn, yIn, widgetIn) {
                
                    mm.FW.drawWidgetsInContainer(widgetIn, widgetIn.m.texts, xIn, yIn);
                },
                /*
                ++
				
                Draws the actual text on the screen the HTML5 Canvas.
                */
                draw: function(ctx, xIn, yIn) {
                
                    ctx.fillStyle = this.s.colour;
                    ctx.font = this.fontType + " " + this.fontSize + "px " + this.font; 
                    ctx.textBaseline = this.textBaseLine;
                
                    if (mm.FW.getGlobalAlpha() != -1) {
                        var trans = mm.FW.getGlobalAlpha();
                        if (trans > 255) {
                            trans = 255;
                        }
                        ctx.save();
                        ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                    }   
                    
                    if (this.vertical == false) {
                        ctx.fillText(this.text, xIn, yIn);
                    } else {
                        var yPos = 0;
                        // VERTICAL
                        for(var i=0;i<this.text.length;i++) {
                            var x = 0;
                            var measureResult = ctx.measureText(this.text[i]);
                            if (measureResult.width >= this.fontSize) {
                                x = 0;
                            } else {
                                // CENTER THE WIDGET
                                var tempWidth = this.fontSize - measureResult.width;
                                x = parseInt(Math.abs(tempWidth / 2));
                            }
							
                            ctx.fillText(this.text[i], xIn + x, yIn + yPos);
                            yPos = yPos + 1 + parseInt(this.fontSize);
                        }
                    }
                
                    if (mm.FW.getGlobalAlpha() != -1) {
                        ctx.restore();
                    }
                   
                },
                /*
                ++
                This calculates the width of the text to be drawn on the screen.
                */
                calculateTextWidth: function(textInOut) {
                    var ctx = mm.FW.getCtx();
                    ctx.font = textInOut.fontSize + "px " + textInOut.font;
						
                    if (textInOut.vertical == false) {
                        var measureResult = ctx.measureText(textInOut.text);
                        textInOut.m.w = measureResult.width.toString();
                    } else {
                        // VERTICAL TEXT
                        textInOut.m.w = textInOut.fontSize;
                    }
                },
                /*
                ++
                This calculates the height of the text to be drawn on the screen.
                */
                calculateTextHeight: function(textInOut) {
                    if (textInOut.vertical == false) {
                        textInOut.m.h = textInOut.fontSize;
                    } else {
                        // VERTICAL TEXT
                        var textLength = textInOut.text.length;
                        textInOut.m.h = (textLength * textInOut.fontSize) + textLength;  // ADD gap of one between each character
                    }
                }
            };
    
        })(),
      
        /*
        ++
        This is specific for the Input widget.
        
        */
        Inputs: (function() {
            
            var holdX = 0;
            var holdY = 0;
            
            // PROPERTY LIST OF CURRENT INPUTS THAT ARE BEING EDITED
            var editingInputs = {};
			
           return {
                /*
                ++
                This converts a WidgetClass to a new instance of the Input widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var w = mm.XML.getString(widgetClassIn, "W");
                    var h = mm.XML.getString(widgetClassIn, "H");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                    var textWC = mm.XML.getClass(widgetClassIn, "InputText");
                    var text = mm.Texts.addWidgetClass(textWC);
                    var enterAction = mm.XML.getString(widgetClassIn, "EnterAction");
                    var div = mm.XML.getString(widgetClassIn, "Div");
                    var multiline = mm.XML.getBoolean(widgetClassIn, "MultiLine");
                    if (multiline == null) {
                        multiline = false;
                    }
                 
                    if (enterAction != null) {
                        enterAction = new mm.WidgetFunction(enterAction, null);
                    }
                 
                    var input = mm.Inputs.add(id, type, x, y, w, h, l, text, style, multiline, div, enterAction);
                 
                    var editable = mm.XML.getBoolean(widgetClassIn, "Editable");
                    if (editable != null) {
                        input.editable = editable;
                    }
                 
                    var calculateHeightAuto = mm.XML.getBoolean(widgetClassIn, "CalculateHeightAuto");
                    if (calculateHeightAuto != null) {
                        input.calculateHeightAuto = calculateHeightAuto;
                    }
                 
                    var scrollUpDown = mm.XML.getBoolean(widgetClassIn, "ScrollUpDown");
                    if (scrollUpDown != null) {
                        input.scrollUpDown= scrollUpDown;
                    }
                 
                    var scrollLeftRight = mm.XML.getBoolean(widgetClassIn, "ScrollLeftRight");
                    if (scrollLeftRight != null) {
                        input.scrollLeftRight= scrollLeftRight;
                    }
                 
                    var password = mm.XML.getBoolean(widgetClassIn, "Password");
                    if (password != null) {
                        input.password = password;
                    }
                 
                    mm.Widgets.updateWidgetXML(widgetClassIn, input);
                    return input;
                
                },
               /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add an Input widget
                using pure JavaScript.
                This method can be used to add a Input widget.
                Input:
                    idIn: String: The id for the input widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    widthIn: String: Can be a px or percent value of width of the widget.
                    heightIn: String: Can be a px or percent value of height of the widget.
                    layerIn: Int: This is layer for the widget.
                    textIn: Text widget: This is the text widget that will be used in the Input widget.
                    styleIn: WidgetStyle: This is the style for the text. s.colour = colour of the font.
                    multilineIn: Boolean: If set to true, the Input is multiline, if set to false this is a single line input.
                    divIn: String: This is the div name set up in the html page specific for the input.
                    enterActionIn: Function: A function that is called when the user presses enter.
                Output:
                    New Input widget instance.
                
                */
                add: function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, textIn, styleIn, multilineIn, divIn, enterActionIn)  {
		
                     var m = mm.Widgets.add(idIn, typeNameIn, "Input", xIn, yIn, widthIn, heightIn, layerIn);
				  
                    m.widgetsUnder = mm.FW.standardWidgetsUnder;   // STANDARD EXCELLENT
				    m.isKineticScrolling = true;  // SET KINETIC SCROLLING TO TRUE FOR THIS WIDGET
                 
                    var input = new mm.Input(m, textIn, mm.Inputs.draw, multilineIn, divIn);
                 
                    input.s = styleIn;
                   
                    // OPEN KEYBOARD ON CLICK
                    m.clickable = true;
                    var clickAction = new mm.WidgetClick();
                    clickAction.action = new mm.WidgetFunction(null, mm.Inputs.editInput);
                    input.clickAction = clickAction;
                 
                    if (enterActionIn != null) {
                        input.action = enterActionIn;
                    }
                	
                    // INPUT IS NOT MOVEABLE UNLESS INSIDE OTHER WIDGET
                    m.movable = false;
				
                    // ON HOLD CAN MOVE TEXT UP/DOWN AROUND ETC!
                    m.holdable = true;
                    m.holdAction = new mm.WidgetFunction(null, mm.Inputs.textHold);
                    m.unholdAction = new mm.WidgetFunction(null, mm.Inputs.textUnhold);
                    m.holdMovingAction = new mm.WidgetFunction(null, mm.Inputs.textMoving);
		
                    // SET STANDARD MOVE OVER
                    m.standardMoveover = false;  // MOVE OVER IS NOTHING
					
                    return input;
                },
                textHold: function(xIn, yIn, inputIn) {
                    holdX = xIn;
                    holdY = yIn;
                },
                textUnhold: function(xIn, yIn, inputIn) {
                    mm.Inputs.textMoving(xIn,yIn,inputIn);
					
                    holdX = 0;
                    holdY = 0;
					
                },
                textMoving: function(xIn, yIn, inputIn) {
					
                    // ONLY RECALCULATE IF WE ARE IN THE INPUT
                    if (mm.Shapes.isInArea(xIn, yIn, inputIn.m.x + inputIn.m.realX, inputIn.m.y + inputIn.m.realY, inputIn.m.w, inputIn.m.h)) {
                        if (inputIn.scrollLeftRight == true) {
                            inputIn.offsetX = inputIn.offsetX + (holdX - xIn);
                            holdX = xIn;
                        }
                        if (inputIn.offsetX < 0) {
                            inputIn.offsetX = 0;
                        }
					
                        if (inputIn.multiline == true && inputIn.scrollUpDown == true) {
                 
                            inputIn.offsetY = inputIn.offsetY + (holdY - yIn);
                            holdY = yIn;
                        }
                        if (inputIn.offsetY < 0) {
                            inputIn.offsetY = 0;
                        }
					
                        mm.Inputs.calculateTextArray(inputIn, inputIn.text);
                    }
                },
				/*
				This method allows the text to be edited.  An HTML5 input tag is placed
				over the HTML5 canvas to allow for normal HTML5 text editing.
				This is called when the user selects an input widget to be edited.
				*/
                editInput: function(inputIn, xIn, yIn) {
                
                  // ONLY OPEN KEYBOARD IF TEXT IS EDITABLE
                  if (inputIn.editable == true && inputIn.editMode == false) {
                 
                    inputIn.editMode = true;
                 
                    var width = inputIn.m.w;
                    if (inputIn.scrollLeftRight == true) {
                        if (inputIn.maxWidth != 0) {
                            width = inputIn.maxWidth;
                        }
                    }
                    if ((inputIn.m.x + width) > mm.FW.getScreen().m.w) {
                        width = mm.FW.getScreen().m.w - inputIn.m.x - 6;
                    }					
					
                    // DRAW INPUT BOX
                    var textArea = "";
                    var y = inputIn.m.y + inputIn.m.realY + Math.abs(mm.App.getRealScreenPosY());
                    var x = inputIn.m.x + inputIn.m.realX + Math.abs(mm.App.getRealScreenPosX());
                 
                    var height = inputIn.m.h;
                    
                    // IF WE NEED TO SCALE THE TEXT BOX
                    if (mm.FW.getScreen().scaleX != null) {
                        x = parseInt(x * mm.FW.getScreen().scaleX);
                        width = parseInt(width * mm.FW.getScreen().scaleX);
                    }
                    if (mm.FW.getScreen().scaleY != null) {
                        y = parseInt(y * mm.FW.getScreen().scaleY);
                        height = parseInt(height * mm.FW.getScreen().scaleY);
                    }
                 
                     // FIREFOX FIX
                    if (mm.App.getDeviceType() == DEVICE_FIREFOX) {
                        var canvasTopPos = $("#SwancBody").css('margin-top');  // TODO: HARDCODED TO FIX
                        var canvasLeftPos = $("#SwancBody").css('margin-left'); // TODO: HARDCODED TO FIX
                        canvasTopPos = canvasTopPos.replace("px", "");
                        canvasLeftPos = canvasLeftPos.replace("px", "");
                        y = y - parseInt(canvasTopPos);
                        x = x - parseInt(canvasLeftPos);
                    }
                    // END FIREFOX FIX
                 
                    var inputType = "'text'";
                    if (inputIn.password == true) {
                        inputType = "'password'";
                    }
                    	
                    if (inputIn.multiline == true) {
                        textArea = "<div id='" + inputIn.m.id + "' style='position:absolute;top:"+ y +"px;left:"+ x +"px;'><textarea id='textareaEditNote" + inputIn.m.id + "' style='width:" + width + "px;height:" + height + "px;font-family:" + inputIn.text.font + ";font-size:" + Math.round((inputIn.text.fontSize) * 72/mm.FW.getDPI()) + "pt'></textarea></div>";
                    } else {
                        textArea = "<div style='position:absolute;top:"+ y + "px;left:" + x + "px;'><input id='textareaEditNote" + inputIn.m.id + "' type=" + inputType + " style='width:" + width +"px;height:" + height + "px;font-family:" + inputIn.text.font + ";font-size:" + Math.round((inputIn.text.fontSize) * 72/mm.FW.getDPI()) + "pt'></input></div>";
                    }
                 
                    // ADD THIS TEXT AREA TO BEING EDITED
                    editingInputs['textareaEditNote' + inputIn.m.id] = inputIn;
                 
					// STORES THE KEYBOARD POSITION WHEN INPUT TEXT BEING EDITED
                    var keyboardPos = new mm.KeyboardPos(inputIn, x, y, width, height);
                    keyboardActiveList.push(keyboardPos);
                 
                    $("#" + inputIn.div).append(textArea);
                 
                    // ADD THE TEXT IF IT EXISTS
                    if (!isNull(inputIn.text.text)) {
                        mm.Inputs.addNewValueText(inputIn, inputIn.text.text);
                    }
					
					
                    keyboardActive = true;
                 
                    if (inputIn.multiline == true) {
                        // iPHONE
                        // FOR IPHONE DONE BUTTON 
                        // ON IPAD MUST SELECT CLOSE KEYBOARD BUTTON, WORKS DIFFERENT TO iPhone
                        if (mm.App.getDeviceType() == DEVICE_IOS) {
                            $('textarea#textareaEditNote'+ inputIn.m.id).blur(function() {
                                event.preventDefault();
                                mm.Inputs.onEnter(this.id);
                                setTimeout(scrollTo, 0, 0, 1); // ADDED TO SOLVE PROBLEM OF SCROLLING UP ON iPhone
                            });
                        }
                        // END FOR IPHONE DONE BUTTON
                        
                        // TO SEE DBL CLICK DOES NOT WORK ON iPhone
                        $("textarea#textareaEditNote" + inputIn.m.id).dblclick(function(event) {
                            event.preventDefault();
                            mm.Inputs.onEnter(this.id);
                        });
                        
                    } else {
                        // FOR IPHONE DONE BUTTON 
                        if (mm.App.getDeviceType() == DEVICE_IOS) {
                            $('#textareaEditNote' + inputIn.m.id).blur(function() {
                                event.preventDefault();
                                mm.Inputs.onEnter(this.id);
                                setTimeout(scrollTo, 0, 0, 1); // ADDED TO SOLVE PROBLEM OF SCROLLING UP ON iPhone
                            });
                        }
                        // END FOR IPHONE DONE BUTTON
                        $("#textareaEditNote" + inputIn.m.id).keypress(function(event) {
                        
                            if ( event.which == 13 ) {  // if enter key run on enter
                                event.preventDefault();
                                mm.Inputs.onEnter(this.id);
                                setTimeout(scrollTo, 0, 0, 1); // ADDED TO SOLVE PROBLEM OF SCROLLING UP ON iPhone
                            }
                        });
                        
                        // DOUBLE CLICK CRASHES ON iPHONE
                        $("#textareaEditNote" + inputIn.m.id).dblclick(function(event) {
                        
                            event.preventDefault();
                            mm.Inputs.onEnter(this.id);
                            
                        });
                        
                        
                    }
					
                    }
                },
                removeKeyboardActivePos: function(idIn) {
                    var i=0;
                    var pos = -1;
                    while (i < keyboardActiveList.length && pos == -1) {
                        if (keyboardActiveList[i].input.m.id == idIn) {
                            pos = i;
                        }
                        i = i + 1;
                    }
                 
                    if (pos != -1) {
                        keyboardActiveList.remove(pos);
                    }
                 
                },
				/*
				Obtains the value that the user entered on the HTML5 input field, and
				places it on to this widget.
				*/
                setValueFromHTMLInput: function(inputIn) {
                        var valueTemp = mm.Inputs.getTextValueFromHTMLInput(inputIn);
                 
                        if (inputIn.password == true) {
                            inputIn.passwordText = valueTemp;
                        
                            inputIn.text.text = "";
                            for(var i=0;i<valueTemp.length;i++) {
                                inputIn.text.text = inputIn.text.text + "*";
                            }
                        
                        } else {
                            inputIn.text.text = valueTemp;
                        }
					
                        // RECALCULATE THE TEXT ARRAY
                        mm.Inputs.calculateTextArray(inputIn, inputIn.text);
                
                },
				/*
				Called when user performs an on enter or done on the HTML5 input field.
				*/
                onEnter: function(inputHTMLIdIn) {
                
                    var input = editingInputs[inputHTMLIdIn];
                    if (!isNull(input)) {
                 
                        mm.Inputs.setValueFromHTMLInput(input);
                 
                        if (input.closeEditOnEnter == true) {
                            mm.Inputs.closeInput(input);
                        }
                 
                        if (!isNull(input.action)) {
                            // CALL THE ACTION ON ENTER
                            input.action(input, valueTemp);
                        }
					
                    }
                    
                    // HAVE TO FORCE A REDRAW OF ALL SCREEN
                    mm.App.repaint();
                
                    // TODO EDIT/VALIDATION AND ON ENTER onEnterCallback(ctx, valueTemp);
                },
				/*
				This closes the HTML5 input field, so the keyboard is closed and the input widget
				cannot be edited.
				*/
                closeInput: function(inputIn) {
                
                    mm.Inputs.setValueFromHTMLInput(inputIn);
                
                    if (inputIn.multiline == true) {
                        $('textarea#textareaEditNote' + inputIn.m.id).remove();
                 
                        delete editingInputs['textarea#textareaEditNote' + inputIn.m.id];
                    } else {
                        $('input#textareaEditNote' + inputIn.m.id).remove();
                 
                        delete editingInputs['input#textareaEditNote' + inputIn.m.id];
                    }
                    mm.Inputs.removeKeyboardActivePos(inputIn.m.id);
                    if (keyboardActiveList.length <= 0) {
                        keyboardActive = false;
                    }
                    inputIn.editMode = false;
                },
				/*
				Calculates the text array.  The text array stores each line for
				a multiline input.
				*/
                calculateTextArray: function(inputIn, textIn) {
                
                    var ctx = mm.FW.getCtx();
                    ctx.font = textIn.fontSize + "px " + textIn.font;
                 
                    if (!isNull(textIn.text) && inputIn.multiline == true) {
						
                        // SEE IF WE NEED TO REMOVE LINES
                        var textArrayStart = 0;
                        if (inputIn.offsetY != 0) {
                            textArrayStart = Math.round(inputIn.offsetY / inputIn.text.fontSize);
                            if (textArrayStart < 0) {
                                textArrayStart = 0;
                            }
                        }
						
                        // TODO calculate left right scroll
                        if (inputIn.scrollLeftRight == false) {  // comp.w is the width we are using...  (no x movement.
                            // calculate phrase array
                            var textArray = inputIn.textArray = mm.Inputs.splitPhrase(textIn.text, inputIn.m.w - 10, textIn.fontSize + "px " + textIn.font);
                            inputIn.textArray = new Array();
                            for(var eachLine=textArrayStart; eachLine<textArray.length; eachLine++) {
                                inputIn.textArray.push(textArray[eachLine]);
                            }
                            if (inputIn.calculateHeightAuto == true) {
                                var gap = 2;
                                var height = (inputIn.textArray.length * (gap + textIn.fontSize)) + gap;
                                inputIn.m.h = height;
                    
                            }
                        } else if (inputIn.scrollLeftRight == true) {
                            if (inputIn.maxWidth == 0) {
                                inputIn.maxWidth = inputIn.m.w;
                            }
                            var textArray = mm.Inputs.splitPhrase(textIn.text, inputIn.maxWidth - 10, textIn.fontSize + "px " + textIn.font);
                            inputIn.textArray = new Array();
							
                            // HAVE TO SPLIT BY xOffset and real width
                            for(var eachLine=textArrayStart; eachLine<textArray.length; eachLine++) {
                                var line = textArray[eachLine];
                                var text = "";
                                var xPos = 0;
                                for (var i = 0; i<line.length;i++) {
                                    // MEASURE EACH CHARACTER
                                    var charWidth = ctx.measureText(line[i]).w;
                                    if (xPos >= inputIn.offsetX) {
                                        // We can add it
                                        if ((xPos + charWidth) < (inputIn.offsetX + inputIn.m.w - 2)) {
                                            text = text + line[i];
                                        }
                                    }
                                    xPos = xPos + charWidth;
                                }
                                inputIn.textArray.push(text);
                            }
                    
                        if (inputIn.calculateHeightAuto == true) {
                            var gap = 2;
                            var height = (inputIn.textArray.length * (gap + textIn.fontSize)) + gap;
                            inputIn.m.h = height;
                    
                        }
                        }
                       
						
                    } else if (!isNull(textIn.text) && inputIn.multiline == false) {
                        var textArray = new Array();
                        // SINGLE LINE
                        if (inputIn.scrollLeftRight == false) {
                            textArray.push(textIn.text);
                        } else {  // CAN SCROLL X AND Y
                            var line = textIn.text;
                            var text = "";
                            var xPos = 0;
                            for (var i = 0; i<line.length;i++) {
                                // MEASURE EACH CHARACTER
                                var charWidth = ctx.measureText(line[i]).w;
                                if (xPos >= inputIn.offsetX) {
                                    // We can add it
                                    if ((xPos + charWidth) < (inputIn.offsetX + inputIn.m.w - 2)) {
                                        text = text + line[i];
                                    }
                                }
                                xPos = xPos + charWidth;
                            }
                            textArray.push(text);
                        }
                        inputIn.textArray = textArray;
                    }
                 
                },
				/*
				Sets the text string to be displayed in an input widget.
				*/
                setText: function(inputIn, textIn) {
                    inputIn.text.text = textIn;
                    if (!isNull(inputIn.text.text)) {
                        mm.Inputs.calculateTextArray(inputIn, inputIn.text);
                    } else if (!isNull(inputIn.label)) {
                        mm.Inputs.calculateTextArray(inputIn, inputIn.label);
                    }
                },
                /*
                ++
                This draws the actual input widget to the HTML5 canvas.
                */
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                
                    // IF THE INPUT IS INVISIBLE OR IF THIS IS BEING EDITED IN HTML5 TAG DO NOT DRAW IT
                    if (this.m.invisible == false && this.editMode == false) {
                 
                        // CALCULATE THE TEXT ARRAY, WILL ONLY CALCULATE IF NOT ALREADY CALCULATED
                        if (isNull(this.textArray)) {
                            // CALCULATE FOR LABEL
                            if (isNull(this.text.text) && !(isNull(this.label))) {
                                mm.Inputs.calculateTextArray(this, this.label);
                            } else if (!isNull(this.text.text) && (this.text.text.length <= 0) && !(isNull(this.label))) {
                                mm.Inputs.calculateTextArray(this, this.label);
                            } else {
                                mm.Inputs.calculateTextArray(this, this.text);
                            }
                        }
                 
                        // DRAW THE RECTANGLE FIRST, BACKGROUND FIRST.
                        mm.Shapes.drawRect(ctx, xIn, yIn, this.m.w, this.m.h, this.s);
                 
                        // DRAW THE TEXT
                        if (!isNull(this.text.text)) {
                            if (!isNull(this.textArray)) {   // WILL NOT GO OVER WIDTH!!!!!!!!
                                // IF MULTI-LINE FIRST  (SEE IF OUTSIDE OF BOX, IF OUTSIDE DO NOT DRAW)
                                var gap = 2;
                                var y = gap;
						
                                ctx.fillStyle = this.text.s.colour;
                                ctx.font = this.text.fontType + " " + this.text.fontSize + "px " + this.text.font;  
                                ctx.textBaseline = this.text.textBaseLine;
                                var i=0;
                                outside = false;
                                while(i<this.textArray.length && outside == false) {
                                    if ((y + yIn + this.text.fontSize) > (yIn + this.m.h)) {
                                        // OUTSIDE OF AREA
                                        outside = true;
                                    } else {  // DRAW THE TEXT
                                        ctx.fillText(this.textArray[i], xIn + gap, yIn + y);
                                    }
                                    y = y + gap + this.text.fontSize;
                                    i = i + 1;
                                }
                            }
                        } else {  // FUNCTIONALITY FOR LABEL
                            if (!isNull(this.label) && !isNull(this.label.text)) {
                                if (!isNull(this.textArray)) {   // WILL NOT GO OVER WIDTH.
                                    // IF MULTI-LINE FIRST  (SEE IF OUTSIDE OF RECTANGLE, IF OUTSIDE DO NOT DRAW)
                                    var gap = 2;
                                    var y = gap;
                    
                                    ctx.fillStyle = this.label.style;
                                    ctx.font = this.label.fontType + " " + this.label.fontSize + "px " + this.label.font; 
                                    ctx.textBaseline = this.label.textBaseLine;
                                    var i=0;
                                    outside = false;
                                    while(i<this.textArray.length && outside == false) {
                                        if ((y + yIn + this.label.fontSize) > (yIn + this.m.h)) {
                                            // OUTSIDE OF AREA
                                            outside = true;
                                        } else {  // DRAW THE TEXT
                                            ctx.fillText(this.textArray[i], xIn + gap, yIn + y);
                                        }
                                        y = y + gap + this.text.fontSize;
                                        i = i + 1;
                                    }
                                }
                            }
                        }
                    }
                 
                    if (this.m.invisible == false) {
                        mm.Texts.drawInWidget(xIn, yIn, this);  // DRAW TEXT IN WIDGET IF SPECIFIED
                    }
              		
                },
				/*
				Gets the text value entered into the HTLM5 input field.
				*/
                getTextValueFromHTMLInput: function(inputIn) {
                    if (inputIn.multiline == true) {
                        var value = $('textarea#textareaEditNote' + inputIn.m.id).val();
                        if (value == null || value == "null" || value == "undefined" || value == undefined) {
                            return "";
                        }
                        return $('textarea#textareaEditNote' + inputIn.m.id).val();
                    } else {
                        var value = $('input#textareaEditNote' + inputIn.m.id).val();
                        if (value == null || value == "null" || value == "undefined" || value == undefined) {
                            return "";
                        }
                        return $('input#textareaEditNote' + inputIn.m.id).val();
                    }
                },
                addNewValueText: function(inputIn, textIn) {
                    if (inputIn.multiline == true) {
                        $('textarea#textareaEditNote' + inputIn.m.id).val(textIn);
                    } else {
                        $('input#textareaEditNote' + inputIn.m.id).val(textIn);
                    }
                }, 
                /*
                ++
                Splits phrases over for multiline input box.
                example: (ctx, phrase, input-width - 4, font)
                */
                splitPhrase: function(phrase, maxPxLength, textStyle) {
                    var ctx = mm.FW.getCtx();
                 
                    var wordArray = phrase.split(" ");
                    var phraseArray=[];
                    var lastPhrase="";
                    var l=maxPxLength;
                    var measure=0;
                 
                    ctx.font = textStyle;
                 
                    for (var i=0;i<wordArray.length;i++) {
                        var word=wordArray[i];
                        var sWordArray = word.split("\n");
						
                        for (var sWordArrayI=0;sWordArrayI<sWordArray.length;sWordArrayI++) {
                            measure=ctx.measureText(lastPhrase+sWordArray[sWordArrayI]).width;
                            if (sWordArrayI > 0) {
                                phraseArray.push(lastPhrase);
                                lastPhrase = "";
                            }
                            if (measure<l) {
                                if (lastPhrase == "") {
                                    lastPhrase = sWordArray[sWordArrayI];
                                } else {
                                    lastPhrase+=(" "+sWordArray[sWordArrayI]);
                                }
                            } else {
						
                                phraseArray.push(lastPhrase);
                                lastPhrase=sWordArray[sWordArrayI];
                            }
                            if (i===wordArray.length-1) {
						
                                phraseArray.push(lastPhrase);
                                break;
                            }
                        }
                    }
                    return phraseArray;
                }
            };
    
        })(),

      
        /*
        ++
        This module is specific to the Animation widget.
        */
        Animations: (function() {
            
            // This is a list of animations that are currently playing
            var playingAnimations = new Array();
            
			
            return {
                /*
                ++
                This converts a WidgetClass to a new instance of the Animation widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn, widgetsIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var w = mm.XML.getString(widgetClassIn, "W");
                    var h = mm.XML.getString(widgetClassIn, "H");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                    var clickAction = mm.XML.getClass(widgetClassIn, "Click");
                    var animate = mm.XML.getString(widgetClassIn, "Animate");
                    
                    if (animate != null) {
                        animate = mm.WidgetFunction(animate, null);
                    }
                
                    var animation = mm.Animations.add(id, type, x, y, w, h, l, clickAction, widgetsIn, style, animate);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, animation);
                    
                    var redrawAll = mm.XML.getBoolean(widgetClassIn, "RedrawAll");
                    if (redrawAll != null) {
                        animation.redrawAll = redrawAll;
                    }
                    var animationTimeout = mm.XML.getInt(widgetClassIn, "AnimationTimeout");
                    if (animationTimeout != null) {
                        animation.animationTimeout = animationTimeout;
                    }
                    
                    if (widgetClassIn.collisionDetection != null) {
                        mm.Animations.addCollisionDetectionX(animation, widgetClassIn.collisionDetection);
                    }
                    
                    return animation;
                
                },
                 /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Animation widget
                using pure JavaScript.
                This method can be used to add a Animation widget.
                Input:
                    idIn: String: The id for the animation widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    layerIn: Int: This is layer for the text widget.
                    actionIn: Function: This is a function if the animation is clicked/tapped.
                    widgetsIn: Array<Widget>: A list of child widgets to add to this animation.
                    styleIn: WidgetStyle: The style of the animation background.
                    animateIn: Function: This is the function called on each animation loop.
                Output:
                    New Text animation instance.
                
                */
                add: function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, actionIn, widgetsIn, styleIn, animateIn) {
                
                     var m = mm.Widgets.add(idIn, typeNameIn, "Animation", xIn, yIn, widthIn, heightIn, layerIn);
                    m.container = true;
                
                    var animation = new mm.Animation(m, mm.Animations.draw, animateIn);
                    
                    animation.s = styleIn;
                     
                    mm.Container.adds(animation, widgetsIn);
                  	
                    m.widgetsUnder = mm.Animations.under;
				
                    // ON CLICK CALL THE ACTION PASSED IN
                    if (actionIn != null) {
                        m.clickable = true;
                        animation.clickAction = actionIn;
                    }
                     
                    animation.animationLoop = mm.Animations.animationLoop;
					
                    // NOT MOVABLE
                    m.movable = false;
                    
                    return animation;  // RETURN THE NEWLY CREATED ANIMATION TO THE DEVELOPER.
                },
				/*
				Adds collision detection to the animation.
				*/
                addCollisionDetectionX: function(animationIn, collisionDetectionIn) {
                
                    if (animationIn.collisions == null) {
                        animationIn.collisions = new Array();
                    }
                    
                    if (collisionDetectionIn.collisions != null && collisionDetectionIn.collisionTypes != null) {
                    
                        for (var i=0;i<collisionDetectionIn.collisions.length;i++) {
                    
                            var collision = collisionDetectionIn.collisions[i];
                            collision.collisionTypeA = mm.Animations.findCollisionType(collisionDetectionIn.collisionTypes, collision.collisionTypeA );
                            collision.collisionTypeB = mm.Animations.findCollisionType(collisionDetectionIn.collisionTypes, collision.collisionTypeB );
                     
                            if (collision.collisionTypeA != null && collision.collisionTypeB != null && collision.collisionAction != null) {
                                animationIn.collisions.push(collision);
                            }
                        }
                     
                    }
                
                
                },
				/*
				Returns a collision type by its idIn, within the list
				of collisionTypesIn.
				*/
                findCollisionType: function(collisionTypesIn, idIn) {
                    var collisionType = null;
                    
                    var i=0;
                    while(i < collisionTypesIn.length && collisionType == null) {
                        // TODO : PERHAPS NEES A COPY HERE
                        if (collisionTypesIn[i].id == idIn) {
                            collisionType = collisionTypesIn[i];
                        }
                        i = i + 1;
                    }
                    return collisionType;
                },
                /*
                This is called on every iteration of the animation loop.
                */
                animationLoop: function(idIn, recursive) {
                
                    if (isNull(recursive)) {
                        recursive = true;
                    }
                  
                    var animation = mm.Animations.getPlayingAnimation(idIn);
                  	
                    animation.timeOutRunning = null;
                  
                    if (animation != null) {
                  
                        var x = -1;
                        var y = -1;
                        if (mm.Shapes.isInArea(mm.FW.getLastTouchX(), mm.FW.getLastTouchY(), animation.m.x + animation.m.realX, animation.m.y + animation.m.realY, animation.m.w, animation.m.h)) {
                            x = mm.FW.getLastTouchX() - (animation.m.x + animation.m.realX);
                            y = mm.FW.getLastTouchY() - (animation.m.y + animation.m.realY);
                        }	
			   
                        if (animation.animate != null) {
                            var animate = mm.App.getFunction(animation.animate);
                            if (animate != null) {
                                animate(mm.FW.getCtx(), x, y, animation);
                            } else {
                                console.log("ERROR: animate Function not found" + animation.animate.name);
                            }
                        }
                     
                    
                        // CHECK FOR COLLISIONS HERE AUTOMATIC.
                        // TODO: PERFORMANCE NEEDS TO BE IMPROVED HERE...
                        if (!isNull(animation.collisions)) {
                            for(var iCol=0;iCol<animation.collisions.length;iCol++) {
                                var collision = animation.collisions[iCol];
                                var widgetsA = mm.Animations.getWidgetsByType(animation.collisions[iCol].collisionTypeA.type, animation);
                                var widgetsB = mm.Animations.getWidgetsByType(animation.collisions[iCol].collisionTypeB.type, animation);
                                for(var a=0;a<widgetsA.length;a++) {
                                    for(var b=0;b<widgetsB.length;b++) {
                                        if (mm.Animations.isCollision(animation.collisions[iCol].collisionTypeA, animation.collisions[iCol].collisionTypeB, widgetsA[a], widgetsB[b])) {
                                            // CALL COLLISION ACTION
                                            var collisionAction = mm.App.getFunction(animation.collisions[iCol].collisionAction);
                                            if (collisionAction != null) {
                                                collisionAction(animation, widgetsA[a], widgetsB[b]);
                                            } else {
                                                console.log("ERROR: Collision function not found " +  animation.collisions[iCol].collisionAction.name);
                                            }
                                        }
                                    }
                                }
                            }
                        }
					
                        // DRAW
                        if (animation.redrawAll == true) {
                            if (recursive == true) {  // IF RECURSIVE NULL, THE NON RECURSIVE WILL ALWAYS CALL REPAINT
                                mm.App.repaint();  // REDRAW ALL WIDGETS
                            }
                        } else {
                            mm.App.repaintWidget(animation);
                        }
                     
                        if (animation.playAnimation == true && recursive == true) {
                            animation.timeOutRunning = setTimeout("mm.Animations.animationLoop('" + animation.m.id + "')", animation.animationTimeout);
                        }
                     }
                    
                },
                /*
                This will call the animation loop, once only.  This may be required on start up.
                */
                animateAllOnce: function() {
                    for (var i=0;i < playingAnimations.length;i++) {
                        if (playingAnimations[i].playAnimation == true) {
                            mm.Animations.animationLoop(playingAnimations[i].m.id, false);
                        }
                    }
                },
                /*
                Returns true if a collision has occurred between the 2 widgets
                */
                isCollision: function(collisionTypeA, collisionTypeB, widgetA, widgetB) {
                
                    var collide = false;	
                    if ((collisionTypeA.shapeType ==  "RECTANGLE" && collisionTypeB.shapeType ==  "CIRCLE") || (collisionTypeB.shapeType ==  "RECTANGLE" && collisionTypeA.shapeType ==  "CIRCLE")) {
                        collide = mm.Animations.isCollisionCircleRectangle(collisionTypeA, collisionTypeB, widgetA, widgetB);
                    } else if (collisionTypeA.shapeType ==  "CIRCLE" && collisionTypeB.shapeType ==  "CIRCLE") {
                        collide = mm.Animations.isCollisionCircleCircle(collisionTypeA, collisionTypeB, widgetA, widgetB);
                    } else if (collisionTypeA.shapeType ==  "RECTANGLE" && collisionTypeB.shapeType ==  "RECTANGLE") {
                        collide = mm.Animations.isCollisionRectangleRectangle(collisionTypeA, collisionTypeB, widgetA, widgetB);
                    }
                    return collide;
                },
                /*
                Returns true if a circle to circle collision has occured between these two widgets.
                */
                isCollisionCircleCircle: function(collisionTypeA, collisionTypeB, widgetA, widgetB) {
                    var collide = false;
                    var colA = 0;
                    while (colA < collisionTypeA.collisionZones.length && collide == false) {
                        var colB = 0;
                        while (colB < collisionTypeB.collisionZones.length && collide == false) {
                            collide = mm.Animations.circleWithCircleCollision(widgetA.m.x + collisionTypeA.collisionZones[colA].x, widgetA.m.y + collisionTypeA.collisionZones[colA].y, collisionTypeA.collisionZones[colA].radius, widgetB.m.x + collisionTypeB.collisionZones[colB].x, widgetB.m.y + collisionTypeB.collisionZones[colB].y, collisionTypeB.collisionZones[colB].radius);
                            colB = colB + 1;
                        }
							
                        colA = colA + 1;
                    }
					
                    return collide;
                },
                /*
                Returns true if a rectangle to rectangle collision has occured between two widgets.
                */
                isCollisionRectangleRectangle: function(collisionTypeA, collisionTypeB, widgetA, widgetB) {
                    var collide = false;
                    var colA = 0;
                    while (colA < collisionTypeA.collisionZones.length && collide == false) {
                        var colB = 0;
                        while (colB < collisionTypeB.collisionZones.length && collide == false) {
                            collide = mm.Animations.rectangleWithRectangleCollision(widgetA.m.x + collisionTypeA.collisionZones[colA].x, widgetA.m.y + collisionTypeA.collisionZones[colA].y, collisionTypeA.collisionZones[colA].w, collisionTypeA.collisionZones[colA].m.h, widgetB.m.x + collisionTypeB.collisionZones[colB].x, widgetB.m.y + collisionTypeB.collisionZones[colB].y, collisionTypeB.collisionZones[colB].w, collisionTypeB.collisionZones[colB].h);
                            colB = colB + 1;
                        }
							
                        colA = colA + 1;
                    }
					
                    return collide;
                },
                /*
                Returns true if a circle to rectangle collision has occured between 2 widgets.
                */
                isCollisionCircleRectangle: function(collisionTypeA, collisionTypeB, widgetA, widgetB) {
                    var collide = false;
                    if (collisionTypeB.shapeType == "RECTANGLE" && collisionTypeA.shapeType == "CIRCLE") {
                        var colA = 0;
                        while (colA < collisionTypeA.collisionZones.length && collide == false) {
                            var colB = 0;
                            while (colB < collisionTypeB.collisionZones.length && collide == false) {
                                collide = mm.Animations.rectangleWithCircleCollision(widgetA.m.x + collisionTypeA.collisionZones[colA].x, widgetA.m.y + collisionTypeA.collisionZones[colA].y, collisionTypeA.collisionZones[colA].radius, widgetB.m.x + collisionTypeB.collisionZones[colB].x, widgetB.m.y + collisionTypeB.collisionZones[colB].y, widgetB.m.w, widgetB.m.h);
                                colB = colB +1;
                            }
							
                            colA = colA + 1;
                        }
                    } else if (collisionTypeA.shapeType == "RECTANGLE" && collisionTypeB.shapeType == "CIRCLE") {
                        var colB = 0;
                        while (colB < collisionTypeB.collisionZones.length && collide == false) {
                            var colA = 0;
                            while (colA < collisionTypeA.collisionZones.length && collide == false) {
                                collide = mm.Animations.rectangleWithCircleCollision(widgetB.m.x + collisionTypeB.collisionZones[colB].x, widgetB.m.y + collisionTypeB.collisionZones[colB].y, collisionTypeB.collisionZones[colB].radius, widgetA.m.x + collisionTypeA.collisionZones[colA].x, widgetA.m.y + collisionTypeA.collisionZones[colA].y, widgetA.m.w, widgetA.m.h);
                                colA = colA +1;
                            }
							
                            colB = colB + 1;
                        }
                    }
                    return collide;
                },
                /*
                Return a list of widgets by the specified type.
                */
                getWidgetsByType: function(typeIn, animationIn) {
                    var widgets = new Array();
                    for (var i=0;i<animationIn.m.widgets.length;i++) {
                        if (animationIn.m.widgets[i].m.type == typeIn && animationIn.m.widgets[i].m.hidden == false) {
                            widgets.push(animationIn.m.widgets[i]);
                        }
                    }
                    return widgets;
                },
                /*
                External Use.
                This starts the animation.
                Input:
                    animationIn: Animation widget to be started.
                */
                startAnimation: function(animationIn) {
                    animationIn.playAnimation = true;
                    playingAnimations.push(animationIn);
                    animationIn.animationLoop(animationIn.m.id);  // Call animation loop
                },
                /*
                External Use.
                This stops the animation playing.
                Input:
                    animationIn: Animation widget to be stopped.
                */
                stopAnimation: function(animationIn) {
                    animationIn.playAnimation = false;  // Will pause animation in current state
                    var animation = mm.Animations.getPlayingAnimation(animationIn.m.id);
					
                    var found = false;
                    var i = 0;
                    while(found == false && i < playingAnimations.length) {
                        if (animation.m.id = playingAnimations[i].m.id) {
                            found = true;
                        }
                        i = i + 1;
                    }
					
                    if (found) {
                        playingAnimations.remove(i - 1);
                    }
					
                    
                    if (animation != null && animation.timeOutRunning != null) {
                        clearTimeout(animation.timeOutRunning);
						
                        animation.timeOutRunning = null;
                    }
                },
                /*
                Returns the animation playing if the animation id as in m.id is currently playing.
                Otherwise it returns null.
                */
                getPlayingAnimation: function(idIn) {
                    var found = false;
                    var i = 0;
                    while (found == false && i < playingAnimations.length) {
                        if (playingAnimations[i].m.id == idIn) {
                            found = true;
                        }
                        i = i + 1;
                    }
					
                    if (found == true) {
                        return playingAnimations[i - 1];
                    } else {
                        return null;
                    }
                },
                /*
                Returns true, if the animation widget specified is currently playing.
                */
                isAnimationPlaying: function(animationIn) {
                    var found = false;
                    var i = 0;
                    while (found == false && i < playingAnimations.length) {
                        if (playingAnimations[i].m.id == animationIn.m.id) {
                            found = true;
                        }
                        i = i + 1;
                    }
					
                    return found;
                },
                /*
                This will stop all playing animations.
                */
                stopAllPlayingAnimations: function() {
                    var playAnimationsId = new Array();
                    for (var i=0; i<playingAnimations.length; i++) {
                        playAnimationsId.push(playingAnimations[i]);
                    }
                    for (var i=0; i<playAnimationsId.length; i++) {
                        mm.Animations.stopAnimation(playAnimationsId[i]);
                    }
                },
                /*
                Returns true if the x and pos is currently over a playing animation.
                */
                isMouseOverPlayingAnimation: function(xIn, yIn, offsetXIn, offsetYIn) {
                    var found = false;
                    var i = 0;
                    while (found == false && i<playingAnimations.length) {
                        if (playingAnimations[i].m.parent != null) {
                            var widgetsUnder = mm.FW.standardWidgetsUnder(xIn, yIn, offsetXIn, offsetYIn, playingAnimations[i]);
                            if (widgetsUnder != null) {
                                found = true;
                            }
                        }
                        i = i + 1;
                    }
                    return found;
                },
                /*
                Returns a list of all the widgets under the x and y position.
				
				This will return the animation widget and the animation widget children that are under the x and y position.
                */
                under: function(xIn, yIn, offsetXIn, offsetYIn, animationIn) {
                
                    // LOOP THROUGH ALL OF THE OTHER WIDGETS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                    var widgetsUnderPointerList = new Array();
                    if (animationIn.m.widgets != null) {
                        for(var eachWidget = 0; eachWidget < animationIn.m.widgets.length; eachWidget++) {
                            var tempWidgets = animationIn.m.widgets[eachWidget].m.widgetsUnder(xIn, yIn, animationIn.m.x + offsetXIn, animationIn.m.y + offsetYIn, animationIn.m.widgets[eachWidget]);
                            if (tempWidgets != null) {
                                for(var i = 0; i< tempWidgets.length; i++) {
								
                                    // DO NOT ADD SELECT WIDGET
                                    if (animationIn.selectWidget != null) {
                                        if (tempWidgets[i] != animationIn.selectWidget) {
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        }
                                    } else {
                                        widgetsUnderPointerList.push(tempWidgets[i]);
                                    }
                                }
                            }
                        }
                    }

                    var tempWidgetsUnderPointerList = mm.FW.standardWidgetsUnder(xIn, yIn, offsetXIn, offsetYIn, animationIn);
					
                    if (tempWidgetsUnderPointerList != null) {
                        for(var i=0;i<tempWidgetsUnderPointerList.length;i++) {
                            widgetsUnderPointerList.push(tempWidgetsUnderPointerList[i]);
                        }
                    }
                    
                    return widgetsUnderPointerList;
                },
                /* 
                Responsible for drawing the animation widget to the HTML5 canvas.
                */
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                
                    if (this.m.invisible == false) {
                  
                        if (this.s != null) {
                            mm.Shapes.drawRect(ctx, xIn, yIn, this.m.w, this.m.h, this.s);
                        }
                    
                        mm.Texts.drawInWidget(xIn, yIn, this);  // DRAW TEXT IN WIDGET IF SPECIFIED
                    
                        // NOW DRAW THE WIDGETS BASED ON THE X and Y in.
                        mm.FW.drawWidgetsInContainer(this, this.m.widgets, xIn, yIn);
                    }
                	
                },
                /*
                Returns true if the two rectangles collide.
                */
                rectangleWithRectangleCollision: function(rectAx, rectAy, rectAw, rectAh, rectBx, rectBy, rectBw, rectBh) {
                    if (!(rectBx+rectBw < rectAx) &&
                        !(rectAx+rectAw < rectBx) &&
                        !(rectBy+rectBh < rectAy) &&
                        !(rectAy+rectAh < rectBy)) {
                        return true;
                    } else {
                        return false;
                    }
                },
                /*
                Returns true if two circles collide.
                */
                circleWithCircleCollision: function(circAx, circAy, circAr, circBx, circBy, circBr) {  // RETURNS TRUE IF THE 2 CIRCLES are in collision
                    var dx = circBx - circAx;
                    var dy = circBy - circAy;
                    var distance = Math.sqrt((dx*dx)+(dy*dy));
                    if (distance < circAr + circBr) {
                        return true;
                    } else {
                        return false;
                    }
                },
                /*
                Returns true if a rectangle with a circle collision occurs.
                */
                rectangleWithCircleCollision: function(circX, circY, circR, rectX, rectY, rectW, rectH) {

                    var rectCenterX = rectX +  rectW / 2;
                    var rectCenterY = rectY + rectH / 2;

                    var w = rectW  / 2;
                    var h = rectH / 2;

                    var dx = Math.abs(circX - rectCenterX);
                    var dy = Math.abs(circY - rectCenterY);

                    if (dx > (circR + w) || dy > (circR + h)) return false;


                    var circleDistanceX = Math.abs(circX - rectX - w);
                    var circleDistanceY = Math.abs(circY - rectY - h);
                                 
                    if (circleDistanceX <= (w))
                    {
                        return true;
                    }

                    if (circleDistanceY <= (h))
                    {
                        return true;
                    }

                    var cornerDistanceSq = Math.pow(circleDistanceX - w, 2) + Math.pow(circleDistanceY - h, 2);

                    return (cornerDistanceSq <= (Math.pow(circR, 2)));
                },
				/*
				Returns a collision type for a circle collision.
				*/
                addCirclesCollisionType: function(typeIn, collisionZonesIn) {
                    return new mm.CollisionType(typeIn, "CIRCLE", collisionZonesIn);
                },
				/*
				Returns a collision type for a rectangular collision.
				*/
                addRectanglesCollisionType: function(typeIn, collisionZonesIn) {
                    return new mm.CollisionType(typeIn, "RECTANGLE", collisionZonesIn);
                },
				/*
				Returns a collision circle zone.
				*/
                addCollisionCircleZone: function(xIn, yIn, radiusIn) {
                    return new mm.CollisionCircleZone(xIn, yIn, radiusIn);
                },
				/*
				Returns a collision rectangle zone.
				*/
                addCollisionRectangleZone: function(xIn, yIn, widthIn, heightIn) {
                    return new mm.CollisionRectangleZone(xIn, yIn, widthIn, heightIn);
                },
				/*
				Adds a collision between two sprites to the animation.
				*/
                addCollision: function(animationIn, collisionTypeAIn, collisionTypeBIn, collisionActionIn) {
                    var collision = new mm.Collision(collisionTypeAIn, collisionTypeBIn, collisionActionIn);
                    if (animationIn.collisions == null) {
                        animationIn.collisions = new Array();
                    }
                    
                    animationIn.collisions.push(collision);
                }
            };
    
        })(),
		
		
      
        /*
        ++
        This module is specific to the Fragment widget.
        
        Fragment can also be used like a button.
        */
        Fragments: (function() {
            
              
            return {
				/*
                ++
                This converts a WidgetClass to a new instance of the Fragment widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn, widgetsIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var w = mm.XML.getString(widgetClassIn, "W");
                    var h = mm.XML.getString(widgetClassIn, "H");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                    var movable = mm.XML.getClass(widgetClassIn, "Movable");
                    //var text = mm.XML.getBoolean(widgetClassIn, "Text");
                    var clickAction = mm.XML.getClass(widgetClassIn, "Click");
                    var selectableWidget = mm.XML.getString(widgetClassIn, "SelectWidget");
                
                    var fragment = mm.Fragments.add(id, type, x, y, w, h, l, movable, clickAction, widgetsIn, selectableWidget, style);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, fragment);
                    
                    return fragment;
                
                },
				 /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Fragment widget
                using pure JavaScript.
                This method can be used to add a Fragment widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
					widthIn: String: Can be a px or percent value of the width of widget.
                    heightIn: String: Can be a px or percent value of height of widget.
					layerIn: Int: This is layer for the widget.
					movableIn: Boolean: If this is true then the widget can be moved.
					actionIn: function: This is the click action when the user presses this widget.
					widgetsIn: Array of widgets: These are the child widgets that will be drawn within this fragment.
					selectableWidgetIn: Widget: This can be used with click action or hold, defines a widget that can be used as the selectable point of the fragment.
					styleIn: WidgetStyle: The style of the fragment background.  Fragments are rectangular.
				Output:
                    New Fragment widget instance.
                
                */
                add: function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, movableIn, actionIn, widgetsIn, selectableWidgetIn, styleIn) {
                    
                    var m = mm.Widgets.add(idIn, typeNameIn, "Fragment", xIn, yIn, widthIn, heightIn, layerIn);
                    m.container = true;
			   
                    var widget = new mm.Fragment(m, mm.Fragments.draw);  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                    
                    widget.s = styleIn;
                    
                    mm.Container.adds(widget, widgetsIn);
                    
                    // HANDLE SELECT WIDGET
                    if (selectableWidgetIn != null && widgetsIn != null) {
                        // NEED TO FIND THE SELECTABLE WIDGET BY THE ID, MUST BE CONTAINED IN THE widgetsIn
                    
                        var selectableWidget = null;
                        var i = 0;
                        while (i < widgetsIn.length && selectableWidget == null) {
                            if (widgetsIn[i].m.id == selectableWidget) {
                                selectableWidget = widgetsIn[i];
                            }
                            i = i + 1;
                        }
                    
                        widget.selectWidget = selectableWidget;
                    
                    }
                    
					
                    m.widgetsUnder = mm.Fragments.under;
				
                
                    // ON CLICK CALL THE ACTION PASSED IN
                    if (actionIn != null) {
                        m.clickable = true;
                        widget.clickAction = actionIn;
                    }	
					
                    // IS THIS A MOVABLE
                    if (movableIn != null) {
                        if (movableIn.movable == true) {
                            m.move = movableIn;
                            m.movable = true;
                        }
                    }
					
                    return widget;
                },
				/*
                Returns a list of all the widgets under the x and y position.
				
				This will return the fragment widget and the fragment widget children that are under the x and y position.
                */
                under: function(xIn, yIn, offsetXIn, offsetYIn, widgetIn) {
                
                    // LOOP THROUGH ALL OF THE OTHER WIDGETS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                    var widgetsUnderPointerList = new Array();
                    if (widgetIn.m.widgets != null) {
                        for(var eachWidget = 0; eachWidget< widgetIn.m.widgets.length; eachWidget++) {
                            var tempWidgets = widgetIn.m.widgets[eachWidget].m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, widgetIn.m.widgets[eachWidget]);
                            if (tempWidgets != null) {
                                for(var i = 0; i< tempWidgets.length; i++) {
                
                                    // DO NOT ADD SELECT WIDGET
                                    if (widgetIn.selectWidget != null) {
                                        if (tempWidgets[i] != widgetIn.selectWidget) {
                                            if (tempWidgets[i].m.enabled == true || tempWidgets[i].m.movable == true || tempWidgets[i].m.holdable == true) {
                                                widgetsUnderPointerList.push(tempWidgets[i]);
                                            }
                                        }
                                    } else {
                                        if (tempWidgets[i].m.enabled == true || tempWidgets[i].m.movable == true || tempWidgets[i].m.holdable == true) {
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }

			   
                    // SEE IF WE HAVE A SELECTABLE WIDGET
                    if (widgetIn.selectWidget != null) {
                        var tempWidgets = widgetIn.selectWidget.m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, widgetIn.selectWidget);
                        if (tempWidgets != null && tempWidgets.length > 0) {
                            var tempBoxWidget = new Array();
                            tempBoxWidget.push(widgetIn);
                            return tempBoxWidget;
                        } else {
                            return widgetsUnderPointerList;
                        }
                    }
			   
                    var tempWidgetsUnderPointerList = mm.FW.standardWidgetsUnder(xIn, yIn, offsetXIn, offsetYIn, widgetIn);
					
                    if (tempWidgetsUnderPointerList != null) {
                        for(var i=0;i<tempWidgetsUnderPointerList.length;i++) {
                            widgetsUnderPointerList.push(tempWidgetsUnderPointerList[i]);
                        }
                    }
                
                    return widgetsUnderPointerList;
                },
				/*
				Responsible for drawing the fragment to the HTML5 canvas.
				*/
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                
                    // IF IS CURRENTLY MOVING DRAW FROM SELCET WIDGET
                    if (this.m.movable == true && this.m.move.moving == true) {
                        if (!isNull(this.selectWidget)) {
                            
                            if (this.m.move.moveX == true) {
                                xIn = xIn - this.selectWidget.m.x;
                            }
                            if (this.m.move.moveY == true) {
                                yIn = yIn - this.selectWidget.m.y;
                            }
                        }
                    }
                    
                    if (this.m.invisible == false) {
                  
                        mm.Shapes.drawRect(ctx, xIn, yIn, this.m.w, this.m.h, this.s);
                    
                        mm.Texts.drawInWidget(xIn, yIn, this);  // DRAW TEXT IN WIDGET IF SPECIFIED
                    
                        // NOW DRAW THE WIDGETS BASED ON THE X and Y in.
                        mm.FW.drawWidgetsInContainer(this, this.m.widgets, xIn, yIn);
                    }
					
                }
                
                
            };
    
        })(),
      
      
      /*
       ++
       This module is specific to the Circles widget.
       
       Circles are similar to fragments, except instead of being retangular they are circle.
      */
      Circles: (function() {
            
              
            return {
				/*
                ++
                This converts a WidgetClass to a new instance of the Circles widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn, widgetsIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var radius = mm.XML.getString(widgetClassIn, "Radius");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                    var movable = mm.XML.getClass(widgetClassIn, "Movable");
                    var clickAction = mm.XML.getClass(widgetClassIn, "Click");
                    var selectableWidget = mm.XML.getString(widgetClassIn, "SelectWidget");
                
                    var circle = mm.Circles.add(id, type, x, y, radius, l, movable, clickAction, widgetsIn, selectableWidget, style);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, circle);
                
                    return circle;
                },
				 /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Circle widget
                using pure JavaScript.
                This method can be used to add a Circle widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
					radiusIn: String: Can be a px or percent value of the radius of widget.
					layerIn: Int: This is layer for the widget.
                    movableIn: Boolean: If this is true then the widget can be moved.
					actionIn: function: This is the click action when the user presses this widget.
					widgetsIn: Array of widgets: These are the child widgets that will be drawn within this circle.
					selectableWidgetIn: Widget: This can be used with click action or hold, defines a widget that can be used as the selectable point of the circle.
					styleIn: WidgetStyle: The style of the circle background.  
				Output:
                    New Circle widget instance.
                
                */
                add: function(idIn, typeNameIn, xIn, yIn, radiusIn, layerIn, movableIn, actionIn, widgetsIn, selectableWidgetIn, styleIn) {
				
                    var width = "0";
                    // NEEDS TO BE CALCULATED (IN CIRCLES THE WIDTH IS THE SAME AS THE HEIGHT
                    if (radiusIn.indexOf("%") != -1) {
                        // CALCULATE PIXEL POS OF PERCENTAGE
                        var percRaw = radiusIn.replace("%","");
                        var perc = parseInt(percRaw) * 2;
                        width = percRaw.toString() + "%";
						
                    } else {
                        width = (parseInt(radiusIn) * 2).toString();
                    }
               	
                    var m = mm.Widgets.add(idIn, typeNameIn, "Circle", xIn, yIn, width, width, layerIn);
                    m.container = true;
               
                    var circle = new mm.Circle(m, mm.Circles.draw, radiusIn);  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                    circle.selectWidget = selectableWidgetIn;
                    circle.s = styleIn;
                
                    circle.radius = radiusIn;  // could be a percentage.
                    mm.Container.adds(circle, widgetsIn);
					
                    // HANDLE SELECT WIDGET
                    if (selectableWidgetIn != null && widgetsIn != null) {
                        // NEED TO FIND THE SELECTABLE WIDGET BY THE ID, MUST BE CONTAINED IN THE widgetsIn
                        var selectableWidget = null;
                        var i = 0;
                        while (i < widgetsIn.length && selectableWidget == null) {
                            if (widgetsIn[i].m.id == selectableWidget) {
                                selectableWidget = widgetsIn[i];
                            }
                            i = i + 1;
                        }
                
                        circle.selectWidget = selectableWidget;
                    
                    }
                
                    m.widgetsUnder = mm.Circles.under;
				
                    // ON CLICK CALL THE ACTION PASSED IN
                    if (actionIn != null) {
                        m.clickable = true;
                        circle.clickAction = actionIn;
                    }
                
                    if (movableIn != null) {
                        if (movableIn.movable == true) {
                            m.move = movableIn;
                            m.movable = true;
                        }
                    }
                
                    return circle;  // RETURN THE NEWLY CREATED CIRCLE BOX TO THE DEVELOPER.
                },
				/*
                Returns a list of all the widgets under the x and y position.
				
				This will return the circle widget and the circle widget children that are under the x and y position.
                */
                under: function(xIn, yIn, offsetXIn, offsetYIn, widgetIn) {
                
                
                    // LOOP THROUGH ALL OF THE OTHER WIDGETS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                    var widgetsUnderPointerList = new Array();
                    if (widgetIn.m.widgets != null) {
                        for(var eachWidget = 0; eachWidget< widgetIn.m.widgets.length; eachWidget++) {
                            var tempWidgets = widgetIn.m.widgets[eachWidget].m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, widgetIn.m.widgets[eachWidget]);
                            if (tempWidgets != null) {
                                for(var i = 0; i< tempWidgets.length; i++) {
								
                                    // DO NOT ADD SELECT WIDGET
                                    if (widgetIn.selectWidget != null) {
                                        if (tempWidgets[i] != widgetIn.selectWidget) {
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        }
                                    } else {
                                        if (tempWidgets[i].m.enabled == true || tempWidgets[i].m.movable == true || tempWidgets[i].m.holdable == true) {
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
			   
                    // SEE IF WE HAVE A SELECTABLE WIDGET
                    if (widgetIn.selectWidget != null) {
                        var tempWidgets = widgetIn.selectWidget.m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, widgetIn.selectWidget);
                        if (tempWidgets != null && tempWidgets.length > 0) {
                            var tempBoxWidget = new Array();
                            tempBoxWidget.push(widgetIn);
                            return tempBoxWidget;
                        } else {
                            return widgetsUnderPointerList;
                        }
                    }
                
                    // ELSE THE WHOLE CIRCLE IS SELECTABLE
                    var radius =  Math.abs(widgetIn.m.w / 2);
                    if (mm.Shapes.isInCircle(xIn, yIn, widgetIn.m.x + radius + offsetXIn, widgetIn.m.y + radius + offsetYIn, radius) == true) {
                        widgetsUnderPointerList.push(widgetIn);
                    }
               	
                    if (widgetsUnderPointerList.length < 1) {
                        return null;
                    } else {
                        return widgetsUnderPointerList;
                    }

                },
				/*
				Responsible for drawing the circle to the HTML5 canvas.
				*/
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
               
                    // IF IS CURRENTLY MOVING DRAW FROM SELCET WIDGET
                    if (this.m.movable == true && this.m.move.moving == true) {
                        if (!isNull(this.selectWidget)) {
                            if (this.m.move.moveX == true) {
                                xIn = xIn - this.selectWidget.m.x;
                            }
                            if (this.m.move.moveY == true) {
                                yIn = yIn - this.selectWidget.m.y;
                            }
                        }
                    }
                
                    if (this.m.invisible == false) {
				         var radius = Math.abs(this.m.w / 2);
				        // DRAW THE CIRCLE, BACKGROUND FIRST.
                        if (this.s.colour != null) {
                            // WITH FILL
                            mm.Shapes.drawCircle(ctx, xIn, yIn, radius, this.s.colour, true, 1, this.s.transparency, this.s.gradient);
                        }
                
                        // DRAW THE BORDER
                        if (this.s.borderColour != null) {
                            // WITH STROKE
                            mm.Shapes.drawCircle(ctx, xIn, yIn, radius, this.s.borderColour, false, this.s.borderW, this.s.transparency, null);
                        }
					
                        mm.Texts.drawInWidget(xIn, yIn, this);  // DRAW TEXT IN WIDGET IF SPECIFIED
                
  				
                        // NOW DRAW THE WIDGETS BASED ON THE X and Y in.
                        mm.FW.drawWidgetsInContainer(this, this.m.widgets, xIn, yIn);
                
                    }
					
                }
            };
    
        })(),
      
	  
		/*
        ++
        This module contains the functions for the Polygon widget.
        */
        Polygons: (function() {
            
            return {
				/*
                ++
                This converts a WidgetClass to a new instance of the Polygons widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn, widgetsIn) {
                 
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var offsetX = mm.XML.getInt(widgetClassIn, "OffsetX");
                    var offsetY = mm.XML.getInt(widgetClassIn, "OffsetY");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                    var movable = mm.XML.getClass(widgetClassIn, "Movable");
                   
                    var clickAction = mm.XML.getClass(widgetClassIn, "Click");
                    var selectableWidget = mm.XML.getString(widgetClassIn, "SelectWidget");
                    var polygonS = mm.XML.getString(widgetClassIn, "Polygon");
                
                    var polygon = mm.Polygons.add(id, type, polygonS, l, movable, clickAction, widgetsIn, selectableWidget, style, offsetX, offsetY);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, polygon);
                   
                    return polygon;
                
                },
				 /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Polygon widget
                using pure JavaScript.
                This method can be used to add a Polygon widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    polygonIn: String: This contains the co-ordinates of the polygon format example: "{10,10};{100,10},{100,100},{10,100}"
					layerIn: Int: This is layer for the widget.
                    movableIn: Boolean: If this is true then the widget can be moved.
					actionIn: function: This is the click action when the user presses this widget.
					widgetsIn: Array of widgets: These are the child widgets that will be drawn within this circle.
					selectableWidgetIn: Widget: This can be used with click action or hold, defines a widget that can be used as the selectable point of the circle.
					styleIn: WidgetStyle: The style of the circle background.  
					offsetXIn: The adds an x offset in px to each polygon x position.
					offsetYIn: The adds an y offset in px to each polygon y position.
				Output:
                    New Polygon widget instance.
                
                */
                add: function(idIn, typeNameIn, polygonIn, layerIn, movableIn, actionIn, widgetsIn, selectableWidgetIn, styleIn, offsetXIn, offsetYIn) {
                    var width = 0;
                    var height = 0;
                   
                    if (isNull(offsetXIn)) {
                        offsetXIn = 0;
                    }
                   
                    if (isNull(offsetYIn)) {
                        offsetYIn = 0;
                    }
                	
                    // CALCULATE WIDTH AND HEIGHT OF POLYGON
                    var poly = mm.Shapes.convertPolygonStringToArray(polygonIn, offsetXIn, offsetYIn);
                    var xLow = 99999;
                    var xHigh = -99999;
                    var yLow = 99999;
                    var yHigh = -99999;
                		
                    if (poly.length > 0) {
					
                        for (var i=0;i<poly.length;i++) {
                            if (poly[i].x > xHigh) {
                                xHigh = poly[i].x;
                            }
                            if (poly[i].x < xLow) {
                                xLow = poly[i].x;
                            }
                            if (poly[i].y > yHigh) {
                                yHigh = poly[i].y;
                            }
                            if (poly[i].y < yLow) {
                                yLow = poly[i].y;
                            }
                        }
						
                        width = xHigh - xLow;
                        height = yHigh - yLow;
                    }
                   
                    var m = mm.Widgets.add(idIn, typeNameIn, "Polygon", xLow.toString(), yLow.toString(), width, height, layerIn);
                    m.container = true;
                   
                    var polygon = new mm.Polygon(m, mm.Polygons.draw, poly, polygonIn);  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                    polygon.selectWidget = selectableWidgetIn;
                    polygon.s = styleIn;
                    polygon.xLow = xLow;
                    polygon.yLow = yLow;
                   
                    mm.Container.adds(polygon, widgetsIn);
                   
                    // HANDLE SELECT WIDGET
                    if (selectableWidgetIn != null && widgetsIn != null) {
                        // NEED TO FIND THE SELECTABLE WIDGET BY THE ID, MUST BE CONTAINED IN THE widgetsIn
                    
                        var selectableWidget = null;
                        var i = 0;
                        while (i < widgetsIn.length && selectableWidget == null) {
                            if (widgetsIn[i].m.id == selectableWidget) {
                                selectableWidget = widgetsIn[i];
                            }
                            i = i + 1;
                        }
                    
                        polygon.selectWidget = selectableWidget;
                   
                    }
                   
                    m.widgetsUnder = mm.Polygons.under;
                
                    // ON CLICK CALL THE ACTION PASSED IN
                    if (actionIn != null) {
                        m.clickable = true;
                        polygon.clickAction = actionIn;
                
                    }
                   
                    // IS THIS A MOVABLE
                    if (movableIn != null) {
                        if (movableIn.movable == true) {
                            m.move = movableIn;
                            m.movable = true;
                        }
                    }
                   
                    return polygon; 
                },
				/*
				Responsible for drawing the polygon to the HTML5 canvas.
				*/
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                
                    // IF IS CURRENTLY MOVING DRAW FROM SELCET WIDGET
                    if (this.m.movable == true && this.m.move.moving == true) {
                        if (!isNull(this.selectWidget)) {
                            if (this.m.move.moveX == true) {
                                xIn = xIn - this.selectWidget.m.x;
                            }
                            if (this.m.move.moveY == true) {
                                yIn = yIn - this.selectWidget.m.y;
                            }
                        }
                    }
                   
                   if (this.m.invisible == false) {
					
                        // DRAW THE BOX FIRST, BACKGROUND FIRST.
                        if (this.s.colour != null) {
                            // WITH FILL
                             mm.Shapes.drawPolygon(ctx, this.polygon, xIn - this.xLow, yIn - this.yLow, this.s.colour, true, 1, this.s.transparency, this.s.gradient);
                        }
					
                        // DRAW THE BORDER
                        if (this.s.borderColour != null && this.s.borderW != null && this.s.borderW > 0) { // POLYGON_BUG_1 ++
                            // WITH STROKE
                            mm.Shapes.drawPolygon(ctx, this.polygon, xIn - this.xLow, yIn - this.yLow, this.s.borderColour, false, this.s.borderW, this.s.transparency, null); 
                        }
                   
                        mm.Texts.drawInWidget(xIn, yIn, this);  // DRAW TEXT IN WIDGET IF SPECIFIED
                
  				
                        // NOW DRAW THE WIDGETS BASED ON THE X and Y in.
                        mm.FW.drawWidgetsInContainer(this, this.m.widgets, xIn, yIn);

                   
                   
                    }
                   
                },
				/*
                Returns a list of all the widgets under the x and y position.
				
				This will return the polygon widget and the polygon widget children that are under the x and y position.
                */
                under: function(xIn, yIn, offsetXIn, offsetYIn, widgetIn) {
                
                    // LOOP THROUGH ALL OF THE OTHER WIDGETS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                    var widgetsUnderPointerList = new Array();
                    if (widgetIn.m.widgets != null) {
                        for(var eachWidget = 0; eachWidget< widgetIn.m.widgets.length; eachWidget++) {
                            var tempWidgets = widgetIn.m.widgets[eachWidget].m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, widgetIn.m.widgets[eachWidget]);
                            if (tempWidgets != null) {
                                for(var i = 0; i< tempWidgets.length; i++) {
								
                                    // DO NOT ADD SELECT WIDGET
                                    if (widgetIn.selectWidget != null) {
                                        if (tempWidgets[i] != widgetIn.selectWidget) {
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        }
                                    } else {
                                        if (tempWidgets[i].m.enabled == true || tempWidgets[i].m.movable == true || tempWidgets[i].m.holdable == true) {
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
			   
                    // SEE IF WE HAVE A SELECTABLE WIDGET
                    if (widgetIn.selectWidget != null) {
                        var tempWidgets = widgetIn.selectWidget.m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, widgetIn.selectWidget);
                        if (tempWidgets != null && tempWidgets.length > 0) {
                            var tempBoxWidget = new Array();
                            tempBoxWidget.push(widgetIn);
                            return tempBoxWidget;
                        } else {
                            return widgetsUnderPointerList;
                        }
                    }
			   
                    // ELSE THE WHOLE POLYGON IS SELECTABLE
                    if (mm.Shapes.isPointInPolygon(widgetIn.polygon, xIn, yIn, (widgetIn.m.x - widgetIn.xLow) + offsetXIn, (widgetIn.m.y - widgetIn.yLow) + offsetYIn)) {  // TO THINK ABOUT!!
                        widgetsUnderPointerList.push(widgetIn);
                    }
					
                    if (widgetsUnderPointerList.length < 1) {
                        return null;
                    } else {
                        return widgetsUnderPointerList;
                    }

                }
            };
    
        })(),
      
      
      
        /*
        ++
        Specific to the WidgetList widget.
        
        Lists can be vertical or horizontal and can contain a mix of any other widget.
        */
        Lists: (function() {
            
            return {
                /*
                ++
                Converts a WidgetClass to a new instance of the WidgetList widget.
                Internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn, widgetsIn) {
               
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var w = mm.XML.getString(widgetClassIn, "W");
                    var h = mm.XML.getString(widgetClassIn, "H");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                    var gapWidget = mm.XML.getString(widgetClassIn, "GapWidget");
                    var gapSize = mm.XML.getInt(widgetClassIn, "GapSize");
                    var widgetsCanBeMoved = mm.XML.getBoolean(widgetClassIn, "WidgetsCanBeMoved");
                    var vertical = mm.XML.getBoolean(widgetClassIn, "Vertical");
                    var showOutOfArea = mm.XML.getBoolean(widgetClassIn, "ShowOutOfArea");
               
                    var widgetList = mm.Lists.add(id, type, x, y, w, h, l, widgetsIn, style, gapWidget, gapSize, widgetsCanBeMoved, vertical, showOutOfArea);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, widgetList);
                    
                    return widgetList;
                
                },
                /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add an WidgetList widget
                using pure JavaScript.
                This method can be used to add a WidgetList widget.
                Input:
                    idIn: String: The id for the WidgetList widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    widthIn: String: Can be a px or percent value of width of the widget.
                    heightIn: String: Can be a px or percent value of height of the widget.
                    layerIn: Int: This is layer for the widget.
                    widgetsIn: Array<Widget>: A list of child widgets to add to this List.  (NOTE: Order is important. Shown as order in the list)
                    styleIn: WidgetStyle: The .s attribute that contains the style information.
                    gapWidgetIn: Widget: A widget that is shown between the gaps of the list when widgets can be moved list.
                    gapSizeIn: Int: The size of the gap in pixels between each widget in the list.
                    widgetsCanBeMovedIn: Boolean:  If this is true, the widgets can be moved to other position within the list.
                    verticalIn: Boolean: If true this is a vertical list if false the is a horizontal list.
                    showOutOfAreaIn: Boolean: If this is true, will show the widgets outside of the list area.  If false will only show full widgets within list area.
                Output:
                    New List widget instance.
                
                */
                add: function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, widgetsIn, styleIn, gapWidgetIn, gapSizeIn, widgetsCanBeMovedIn, verticalIn, showOutOfAreaIn) {
				
                    // LISTS ARE NOT MOVEABLE
				
                    var m = mm.Widgets.add(idIn, typeNameIn, "WidgetList", xIn, yIn, widthIn, heightIn, layerIn);
              	
                    m.isKineticScrolling = true;  // SET KINETIC SCROLLING TO TRUE FOR THIS WIDGET AUTOMATICALLY
               
                    var widgetList = new mm.WidgetList(m, mm.Lists.draw);
               
                    m.holdable = true;
                    m.container = true;
               
                    m.holdAction = new mm.WidgetFunction(null, mm.Lists.holdAction);
                    m.unholdAction = new mm.WidgetFunction(null, mm.Lists.unholdAction);
                    m.holdMovingAction = new mm.WidgetFunction(null, mm.Lists.holdMovingAction);
               
                    mm.Container.adds(widgetList, widgetsIn);
                    widgetList.widgetsCanBeMoved = widgetsCanBeMovedIn;
                    widgetList.vertical = verticalIn;
                    widgetList.showOutOfArea = showOutOfAreaIn;
                    widgetList.gapWidget = gapWidgetIn;  // When null no gap is shown
                    widgetList.gapSize = gapSizeIn;
                    widgetList.s = styleIn;
               
                    // SET DEFAULT GAP SIZE
                    if (widgetList.gapSize == null) {
                        widgetList.gapSize = 10;
                    }
				
                    if (widgetsCanBeMovedIn == true && gapWidgetIn == null) {
                        // SET DEFAULT GAP IS A FRAGMENT, IS THIS NECESSARY?
            
                        var style = new mm.WidgetStyle;
                        style.colour = MEDIUM_BLUE_COLOUR;
                        style.rounded = true;
               
                        widgetList.gapWidget = new mm.Fragments.add(idIn + "GAP" + mm.FW.getNextId(), "Gap", "0", "0", "80%", "80%", 1, false, null, null, style);
                   }
               
                    // ADD MOVING LOGIC FOR EACH TYPE
                    if (widgetList.widgetsCanBeMoved == true) {
               
                        // ADD GAPS
                        if (widgetList.gapWidget != null) {
                            widgetList.gapWidget.m.hidden = true;  // SET TO HIDDEN, IMPORTANT.
                        }
               
                        // ADD MOVE OVER LOGIC FOR GAPS
                        if (widgetList.m.widgets != null) {
                            for(var eachWidget = 0; eachWidget<widgetList.m.widgets.length; eachWidget++) {
                                if (mm.MovingTargets.doesTypeAlreadyExistForTarget(widgetList, widgetList.m.widgets[eachWidget].m.type) == false) {
                                    // ADD THIS TYPE
                                    mm.MovingTargets.addMovingTarget(widgetList.m.widgets[eachWidget].m.type, widgetList, mm.Lists.moveDropAction, null, null, null);
                                }
                                // MUST SET THE WIDGET TO MOVABLE IF NOT ALREADY SET!
                                // IS THIS A MOVABLE BUTTON
                                if (widgetList.m.widgets[eachWidget].m.movable == false) {
                                    var movingComp = new mm.MovableType(0, 0);
                                    // USE STANDARD
                                    widgetList.m.widgets[eachWidget].m.move = movingComp;
                                    widgetList.m.widgets[eachWidget].m.movable = true;
                                }
                                
                                // MUST SET THE WIDGETS TO PROPOGATE HOLD, OTHERWISE UNPREDICTED BEHAVIOUR
                                widgetList.m.widgets[eachWidget].m.propagateHold = false;
                            }
							
                            // ADD STANDARD MOVE OVER PARAMETERS
                            m.isStandardMoveover = true;
                            m.standardMoveOver = mm.Lists.moveOver;
                            m.standardMoveOutOver = mm.Lists.moveOutOver;
                            
                        }
                    }
               
                    m.widgetsUnder = mm.Lists.under;
              	
                    return widgetList;
                },
                addExternalMovableTypeToList: function(listIn, sourceTypeIn, movementTypeIn) {
			   
                    // MOVEMENT TYPE CAN ONLY BE COPY OR MOVE (NEED TO CHECK VALIDATION)
                    mm.MovingTargets.addMovingTarget(sourceTypeIn, listIn, mm.Lists.moveDropAction, null, null, movementTypeIn);
                },
                addConfigurableMovableTypeToList: function(listIn, sourceTypeIn, movementTypeIn, moveDropActionIn) {
                    // FOR THE MOVE DROP TO WORK 
                    // The moveDropActionIn must include this at the end otherwise will not work:-
                    //		mm.Lists.moveDropAction(ctx, xIn, yIn, movingWidgetIn, listIn, movementTypeIn)
			   
                    // MOVEMENT TYPE CAN ONLY BE COPY OR MOVE (NEED TO CHECK VALIDATION)
                    mm.MovingTargets.addMovingTarget(sourceTypeIn, listIn, moveDropActionIn, null, null, movementTypeIn);
                },
                moveOverGapGetPosition: function(xIn, yIn, listIn) {  // IF THE POSITION IS -2 then nothing found, if not gap found under mouse.
					
                    // RESET X AND Y IF LIST IS IN PARENTS
                    var parent = listIn.m.parent;
                    var x = 0;
                    var y = 0;
                    while (parent.m.type != "SCREEN") {
                        if (parent.m.type == "SCREEN") {
                        // DO NOTHING
                        } else {
                            x = x + parent.m.x;
                            y = y + parent.m.y;
                        }
                        parent = parent.m.parent;
                    }
                                        
                    xIn = xIn - x;
                    yIn = yIn - y;
                                        
                    var found = false;
                    var position = -2;
                    if (listIn.m.widgets != null) {
                        var eachWidget = 0;
                        var yTop = listIn.m.y + listIn.currentOffset; 
                        var yLeft = listIn.m.x + listIn.currentOffset;
						
                        while (eachWidget<listIn.m.widgets.length && found == false) {
                            // DEPENDS IF LIST VERTICAL OR HORIZONTAL
                            if (listIn.vertical == true) {
                                // VERTICAL LIST
                                // CHECK IF WE ARE OVER THE GAP
						        var yBottomWidget = listIn.m.h;
                                var yTopWidget = (listIn.m.y + listIn.m.widgets[eachWidget].m.y) + listIn.m.widgets[eachWidget].m.h;
                                position = eachWidget;
								
                                if ((eachWidget + 1) < listIn.m.widgets.length) {
                                    yBottomWidget = (listIn.m.y + listIn.m.widgets[eachWidget + 1].m.y);
                                } else {
                                    yBottomWidget = yTopWidget + listIn.gapSize;
                                }
							
                                if (eachWidget == 0) {
                                    if (yIn < (listIn.m.y + listIn.m.widgets[eachWidget].m.y)) {
                                        yBottomWidget = (listIn.m.y + listIn.m.widgets[eachWidget].m.y);
                                        yTopWidget = yTop;
                                        position = -1;
                                    }
                                }
							
						        if (yIn < yBottomWidget && yIn > yTopWidget) {
                                    found = true;
                                    listIn.gapWidget.m.x = 0;//listIn.m.x;  // SET UP TOP LEFT OF GAP, DRAW WILL WORK OUT ITS POSITION
                                    listIn.gapWidget.m.y = yTopWidget - listIn.m.y;
                                }
                            } else {
                                // HORIZONTAL LIST
                                var yRightWidget = listIn.m.w;
                                var yLeftWidget = (listIn.m.x + listIn.m.widgets[eachWidget].m.x) + listIn.m.widgets[eachWidget].m.w;
                                position = eachWidget;
								
                                if ((eachWidget + 1) < listIn.m.widgets.length) {
                                    yRightWidget = (listIn.m.x + listIn.m.widgets[eachWidget + 1].m.x);
                                } else {
                                    yRightWidget = yLeftWidget + listIn.gapSize;
                                }
							
                                if (eachWidget == 0) {
                                    if (xIn < (listIn.m.x + listIn.m.widgets[eachWidget].m.x)) {
                                        yRightWidget = (listIn.m.x + listIn.m.widgets[eachWidget].m.x);
                                        yLeftWidget = yLeft;
                                        position = -1;
                                    }
                                }
							
                                if (xIn < yRightWidget && xIn > yLeftWidget) {
								
                                    found = true;
                                    if (!isNull(listIn.gapWidget)) {
                                        listIn.gapWidget.m.x = yLeftWidget;  // SET UP TOP LEFT OF GAP, DRAW WILL WORK OUT ITS POSITION
										
                                        listIn.gapWidget.m.y = 0;  // OFFSET ??????
                                    }
                                }
                            }						
							
                            eachWidget = eachWidget + 1;
                        }
						
                    }
                    if (!found) {
                        return -2;
                    } else {
                        return position;
                    }
                },
                moveOver: function(ctx, xIn, yIn, movingWidgetIn, listIn) {
                    // STANDARD USED TO SHOW GAP, IF MOVE OVER CURRENT POSITION
                    var pos = mm.Lists.moveOverGapGetPosition(xIn, yIn, listIn);
                    if (pos != -2) {
                        // IF THE POSITION IS ONE ABOVE OR BELOW THE MOVING WIDGET IN THEN IGNORE
                        var foundPos = mm.containers.findPositionInWidgets(listIn, movingWidgetIn);
                        if (foundPos != -1 && (foundPos == pos || ((foundPos - 1) == pos))) {
                            if (!isNull(listIn.gapWidget)) {		
                                listIn.gapWidget.m.hidden = true;
                            }
                        } else {
                            // ONLY THEN CAN WE UN HIDE THE GAP.
                            if (!isNull(listIn.gapWidget)) {
                                listIn.gapWidget.m.hidden = false;
                            }
                        }
                    } else {
                        if (!isNull(listIn.gapWidget)) {
                            listIn.gapWidget.m.hidden = true;
                        }
                    }
                },
                moveOutOver: function(ctx, xIn, yIn, movingWidgetIn, listIn) {
                    // STANDARD USED TO HIDE GAP
                    if (!isNull(listIn.gapWidget)) {
                        listIn.gapWidget.m.hidden = true;
                    }
                },
                moveDropAction: function(ctx, xIn, yIn, movingWidgetIn, listIn, movementTypeIn) {
                    if (!isNull(listIn.gapWidget)) {
                        listIn.gapWidget.m.hidden = true;  // MAKE SURE THE GAP REMAINS HIDDEN AFTER DROP
                    }
                    // STANDARD WHEN DROP ACTION PERFORMED OVER THE GAP
                    var pos = mm.Lists.moveOverGapGetPosition(xIn, yIn, listIn);
                    var foundPos = mm.containers.findPositionInWidgets(listIn, movingWidgetIn);
                    if (pos != -2) {
                        // IF THE POSITION IS ONE ABOVE OR BELOW THE MOVING WIDGET IN THEN IGNORE
						
                        if (foundPos != -1 && (foundPos == pos || ((foundPos - 1) == pos))) {
                        // DO NOTHING
                        } else {
                            var realPos = pos + 1;
                            if (foundPos == -1) {
                                // THEN INSERT THIS NEW WIDGET INTO THE LIST
                                // SO COPIED FROM SOMEWHERE ELSE, MUST HAVE A MOVE OR A COPY, OTHERWISE WE IGNORE IT
                                if ((movementTypeIn == mm.COPY()) || (movementTypeIn == mm.MOVE())) {
                                    mm.Container.moveInsertWidget(listIn, movingWidgetIn, realPos);
									
                                    if (mm.MovingTargets.doesTypeAlreadyExistForTarget(listIn, movingWidgetIn.m.type) == false) {
                                        // ADD THIS TYPE
                                        mm.MovingTargets.addMovingTarget(movingWidgetIn.m.type, listIn, mm.Lists.moveDropAction, null, null, null);
                                    }
                                } else {
                                // DO NOTING: SHOULD ARRIVE HERE
                                }
                            } else {
                                // MOVE OBJECT INTO NEW POSITION WITH IN THE LIST
                                mm.Container.moveInsertWidget(listIn, movingWidgetIn, realPos);
                            }
                        }
                    } else {
                        // IF THIS IS OUTSIDE THE LIST AND JUST DRAGED ON TO THE LIST ADD IT AT THE END
                        if (foundPos == -1) {
                            if ((movementTypeIn == mm.COPY()) || (movementTypeIn == mm.MOVE())) {
                                mm.containers.addWidget(listIn, movingWidgetIn);
									
                                if (mm.MovingTargets.doesTypeAlreadyExistForTarget(listIn, movingWidgetIn.m.type) == false) {
                                    // ADD THIS TYPE
                                    mm.MovingTargets.addMovingTarget(movingWidgetIn.m.type, listIn, mm.Lists.moveDropAction, null, null, null);
                                }
                            }
                        }
                    }
                },
				/*
                Returns a list of all the widgets under the x and y position.
				
				This will return the list widget and the list widget children that are under the x and y position.
                */
                under: function(xIn, yIn, offsetXIn, offsetYIn, listIn) {
                
                    var widgetsUnderPointerList = new Array();
                    var standardList = mm.FW.standardWidgetsUnder(xIn, yIn, offsetXIn, offsetYIn, listIn);
                
                    var doTest = false;
                    if (standardList != null) {
                        doTest = true;
                        for(var i = 0; i< standardList.length; i++) {
                            widgetsUnderPointerList.push(standardList[i]);
                        }
                    }
                
                    if (doTest == true || listIn.showOutOfArea == true) {
                
                        // LOOP THROUGH ALL OF THE OTHER WIDGETSS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                        if (listIn.m.widgets != null) {
                            for(var eachWidget = 0; eachWidget< listIn.m.widgets.length; eachWidget++) {
                                var tempWidgets = listIn.m.widgets[eachWidget].m.widgetsUnder(xIn, yIn, listIn.m.x + offsetXIn, listIn.m.y + offsetYIn, listIn.m.widgets[eachWidget]);
                                if (tempWidgets != null) {
                                    for(var i = 0; i< tempWidgets.length; i++) {
                                        if (tempWidgets[i].m.shown == true) {  
                                            widgetsUnderPointerList.push(tempWidgets[i]);
                                        } 
                                    }
                                }
                            }
                        }
                    }
                
                    if (widgetsUnderPointerList.length <= 0) {
                        return null;
                    } else {
                        return widgetsUnderPointerList;
                    }
                },
                drawMarkerPos: function(ctx, xIn, yIn, listIn) {
                
                    if (!isNull(listIn.listPositionMarker)) {
                
                        if  (listIn.m.widgets.length > 0) {
                            if (listIn.listPositionMarker.converted == false) {
                                mm.FW.convertWidgetPercentToPixels(listIn.listPositionMarker, listIn.m.w, listIn.m.h);
                
                                if (!isNull(listIn.listPositionMarker.widget)) {
                                    mm.FW.convertWidgetPercentToPixels(listIn.listPositionMarker.widget, listIn.m.w, listIn.m.h);
                                }
                                listIn.listPositionMarker.converted = true;
                            }
                
                            if (listIn.listPositionMarker.lengthsSet == false) {
                                var listLength = 0;
                                if (listIn.m.widgets != null && listIn.m.widgets.length > 0) {
                                    for (var i=0; i < listIn.m.widgets.length;i++) {
                                        if (listIn.vertical == true) {
                                            listLength = listLength + listIn.m.widgets[i].m.h;
                                        } else {
                                            listLength = listLength + listIn.m.widgets[i].m.w;
                                        }
                                    }
                                    if (!isNull(listIn.gapSize)) {
                                        listLength = listLength + (listIn.gapSize * (listIn.m.widgets.length - 1));
                                    }
                                }
                                mm.ListPositionMarkers.setListLength(listIn.listPositionMarker, listIn.m.h, listLength);
                                listIn.listPositionMarker.lengthsSet = true;
                            }
                
                            var currentPercentage = 0;
                            if (Math.abs(listIn.currentOffset) != 0) {
                                currentPercentage = Math.abs(listIn.currentOffset) / listIn.listPositionMarker.listWidgetsLength;
                            }
                            mm.ListPositionMarkers.setMarkerPos(listIn.listPositionMarker, currentPercentage);
                            listIn.listPositionMarker.draw(ctx, xIn, yIn);
                        }
                    }
                },
				/*
				Responsible for drawing the list to the HTML5 canvas.
				*/
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
               
                    // DRAW LIST BACKGROUND
                    if (this.s != null) {
                        mm.Shapes.drawRect(ctx, xIn, yIn, this.m.w, this.m.h, this.s);
                    }
                
                    // ALWAYS LEAVE A GAP BETWEEN THE TOP/LEFT AND FIRST OBJECT
                    var currentPos = this.gapSize;
			
                    // DRAW EACH WIDGET, IF THE WIDGET IS COMPLETELY OFF THE SCREEN DO NOT DRAW IT..
                    for (var eachWidget=0;eachWidget<this.m.widgets.length;eachWidget++) {
               
                        if (this.vertical == true) {
                            // CENTER THE WIDGET
                            // IF WIDGET IS BIGGER THEN THE LIST, THEN DO NOT CENTER IT.
                            if (this.m.widgets[eachWidget].m.w >= this.m.w) {
                                this.m.widgets[eachWidget].m.x = 0;
                            } else {
                                // CENTER THE WIDGET
                                var tempWidth = this.m.w - this.m.widgets[eachWidget].m.w;
                                this.m.widgets[eachWidget].m.x = Math.abs(tempWidth / 2);
                            }
							
                            this.m.widgets[eachWidget].m.y = currentPos + this.currentOffset;
               
                         } else {

                            // must be horizontal
                            // CENTER THE WIDGET
                            // IF WIDGET IS BIGGER THEN THE LIST, THEN DO NOT CENTER IT.
                            if (this.m.widgets[eachWidget].m.h >= this.m.h) {
                                this.m.widgets[eachWidget].m.y = 0;
                            } else {
                                // CENTER THE WIDGET
                                var tempHeight = this.m.h - this.m.widgets[eachWidget].m.h;
                                this.m.widgets[eachWidget].m.y = Math.abs(tempHeight / 2);
                            }
                            this.m.widgets[eachWidget].m.x = currentPos + this.currentOffset;
                        }
                        // NEED TO CALCULATE IF ON SCREEN PARTIAL/COMPLETELY OFF
                        var showWidget = true;
                        if (this.vertical == true) {
               
                            // CHECK ABOVE
                            if ((yIn + this.m.widgets[eachWidget].m.y) < yIn) {
                                if (this.showOutOfArea == false) {
                                    showWidget = false;
                                }
                                else { //(this.showOutOfArea == true) {
                                    if ((yIn + this.m.widgets[eachWidget].m.y + this.m.widgets[eachWidget].m.h) < yIn) {
                                        showWidget = false;
                                    }
                                }
                            }
                            // CHECK BELOW
                            if (showWidget == true) {
                                if ((yIn + this.m.widgets[eachWidget].m.y)  > (yIn + this.m.h)){
                                    // COMPLETELY OFF THE SCREEN
                                    showWidget = false;
                                }	
                                else if ((yIn + this.m.widgets[eachWidget].m.y + this.m.widgets[eachWidget].m.h)  > (yIn + this.m.h)) {  //) {//(this.showOutOfArea == true) {
                                    // PARTIALY OF THE SCREEN
                                    if (this.showOutOfArea == false) {
                                        showWidget = false;
                                    }
                                }
                            }
                        } else {
                            // CHECK HORIZONTAL
                            // CHECK LEFT 
                            if ((xIn + this.m.widgets[eachWidget].m.x) < xIn) {
                                if (this.showOutOfArea == false) {
                                    showWidget = false;
                                }
                                else { //(this.showOutOfArea == true) {
                                    if (((xIn + this.m.widgets[eachWidget].m.x) + this.m.widgets[eachWidget].m.w) < xIn) {
                                        showWidget = false;
                                    }
                                }
                            }
                            // CHECK RIGHT
                            if (showWidget == true) {
                                if ((xIn + this.m.widgets[eachWidget].m.x)  > (xIn + this.m.w)){
                                    // COMPLETELY OFF THE SCREEN
                                    showWidget = false;
                                }	
                                else if ((xIn + this.m.widgets[eachWidget].m.x + this.m.widgets[eachWidget].m.w)  > (xIn + this.m.w)) {  //) {//(this.showOutOfArea == true) {
                                    // PARTIALY OF THE SCREEN
                                    if (this.showOutOfArea == false) {
                                        showWidget = false;
                                    }
                                }
                            }
                        }
                        
                        if (showWidget == true) {
               
                            mm.Container.setIsShown(this.m.widgets[eachWidget], true); // LIST_BUG_2 ++
                            // DO NOT DRAW IF THE WIDGET IS MOVING
               
                            if (this.m.widgets[eachWidget].m.movable == true && this.m.widgets[eachWidget].m.move.moving == true) {
                                // DO NOTHING
                            } else {
                                mm.FW.drawWidgetInContainer(this.m.widgets[eachWidget], xIn, yIn);
                
                            }
                        } else {
                           mm.Container.setIsShown( this.m.widgets[eachWidget], false);  // LIST_BUG_2 ++
                        }
                        if (this.vertical == true) {
                            currentPos = currentPos + this.m.widgets[eachWidget].m.h + this.gapSize; 
                        } else {
                            currentPos = currentPos + this.m.widgets[eachWidget].m.w + this.gapSize;
                        }
                    }
                    // DRAW GAP IF CONDITIONS ARE CORRECT
                    if (this.vertical == true  && !isNull(this.gapWidget)) {
									
                        mm.FW.convertWidgetPercentToPixels(this.gapWidget, this.m.w, this.gapSize);  // PERHAPS CAN BE DONE SOMEWHERE ELSE??
					
                        // VERTICAL
                        if (this.widgetsCanBeMoved == true) {
                            if (this.gapWidget != null && this.gapWidget.m.hidden == false) {
                                // SHOW GAP WIDGET AND CENTER IT
                                if (this.gapWidget.m.w >= this.m.w) {
                                // DO NOTHING
                                } else {
                                    // CENTER THE WIDGET
                                    var tempWidthGAP = this.m.w - this.gapWidget.m.w;
                                    this.gapWidget.m.x = this.gapWidget.m.x + Math.abs(tempWidthGAP / 2);
                                }
							
                                // CALCULATE Y NOW
                                if (this.gapWidget.m.h >= this.gapSize) {
                                    // DO NOTHING, PERHAPS WE SHOULD NOT EVEN DRAW IT ????
                                } else {
                                    var tempHeight = this.gapSize - this.gapWidget.m.h;
                                    this.gapWidget.m.y = this.gapWidget.m.y + Math.abs(tempHeight / 2);
                                }
                                mm.FW.drawWidgetInContainer(this.gapWidget, xIn, yIn);
                                
                            }
                        }
                    } else {
                        if (!isNull(this.gapWidget)) {
                            // HORIZONTAL
                            mm.FW.convertWidgetPercentToPixels(this.gapWidget, this.gapSize, this.m.h);  // PERHAPS CAN BE DONE SOMEWHERE ELSE??
					
                                                        
                            if (this.widgetsCanBeMoved == true) {
                                if (this.gapWidget != null && this.gapWidget.m.hidden == false) {
                                    // SHOW GAP WIDGET AND CENTER IT
                                    if (this.gapWidget.m.h >= this.m.h) {
                                        // DO NOTHING
                                    } else {
                                        // CENTER THE WIDGET
                                        var tempHeight = this.m.h - this.gapWidget.m.h;
                                        this.gapWidget.m.y = this.gapWidget.m.y + Math.abs(tempHeight / 2);
                                    }
							
                                    // CALCULATE X NOW
                                    if (this.gapWidget.m.w >= this.gapSize) {
                                        // DO NOTHING, PERHAPS WE SHOULD NOT EVEN DRAW IT ????
                                    } else {
                                        var tempWidth = this.gapSize - this.gapWidget.m.w;
                                        this.gapWidget.m.x = (this.gapWidget.m.x - this.m.x) + Math.abs(tempWidth / 2);
                                    }
                                    mm.FW.drawWidgetInContainer(this.gapWidget, xIn, yIn);
                                    
                                }
                            }
                        }
                    }
               
                    mm.Lists.drawMarkerPos(ctx, xIn, yIn, this);
                },
				/*
				Called when the list is being held.
				*/
                holdAction: function(xIn, yIn, listIn) {
			   
                    if (mm.FW.areAnyWidgetsBeingMoved() == false) {
                    
                        // RESET THE x or y offset
                        if (listIn.vertical == true) {
                            listIn.newOffset = yIn;
                        } else {
                            listIn.newOffset = xIn;
                        }
               
                        mm.Lists.setWidgetsSize(listIn);
                        
                        
                    }
                },
				/*
				This calculates the size of all the widgets + the gaps.
				*/
                setWidgetsSize: function(listIn) {
                
                        listIn.widgetsize = 0;
                        var gapSize = 0;
                        if (listIn.gapSize != null) {
                            gapSize = listIn.gapSize;
                        }
                        if (listIn.m.widgets != null) {
                            for (var i=0;i<(listIn.m.widgets.length - 1); i++) {  // WHY - 1 here ??????
                                if (listIn.vertical == true) {
                                    listIn.widgetsize = listIn.widgetsize + gapSize + listIn.m.widgets[i].m.h;
                                } else {
                                    listIn.widgetsize = listIn.widgetsize + gapSize + listIn.m.widgets[i].m.w;
                                }
                            }
                
                            if (listIn.m.widgets.length == 1) {
                                if (listIn.vertical == true) {
                                    listIn.widgetsize = listIn.m.widgets[0].m.h;
                                } else {
                                    listIn.widgetsize = listIn.m.widgets[0].m.w;
                                }
                            }
                        }
                },
				/*
				This is called when the list is un hold.
				*/
                unholdAction: function(xIn, yIn, listIn) {
                
                    // ONLY MOVE LIST IF NO WIDGET INSIDE THE LIST ARE MOVING
                    if (mm.FW.areAnyWidgetsBeingMoved() == false) {
                    
                        // STORE CURRENT OFFSET
                        if (listIn.vertical == true) {
                            listIn.currentOffset = listIn.currentOffset + (yIn - listIn.newOffset);
						
                        } else {
                            listIn.currentOffset = listIn.currentOffset + (xIn - listIn.newOffset);
                        }
					
                        // RESET NEW OFFSET
                        listIn.newOffset = 0;
                
                        mm.Lists.stopWidgetsRunningOffEdge(listIn);
                    }
                
                    
                },
				/*
				This stops the widgets from running off the edge of the screen.
				*/
                stopWidgetsRunningOffEdge: function(listIn) {
                
                        // STOPS THE WIDGETS RUNNING OFF THE EDGE RIGHT/BOTTOM (OTHERWISE LOOKS BAD FOR USER)
                        var firstWidgetSize = 0;
                        if (listIn.gapSize != null) {
                            firstWidgetSize = listIn.gapSize;
                        }
                        if (listIn.m.widgets != null && listIn.m.widgets.length > 0) {
                            if (listIn.vertical == true) {
                                firstWidgetSize = firstWidgetSize + listIn.m.widgets[0].m.h;
                            } else {
                                firstWidgetSize = firstWidgetSize + listIn.m.widgets[0].m.w;
                            }
                        }
                        var maxMove = 0;
                        if (listIn.vertical == true) {    
                            maxMove = listIn.m.h - firstWidgetSize;
                        } else {
                            if (firstWidgetSize > listIn.m.w) {
                                maxMove = firstWidgetSize;
                            } else {
                                maxMove = listIn.m.w - firstWidgetSize;
                            }
                        }
                        if (listIn.currentOffset > maxMove) {
                            listIn.currentOffset = maxMove;
                        } else if (listIn.currentOffset < -listIn.widgetsize) {
                            // STOPS THE WIDGETS RUNNING OFF THE EDGE LEFT/TOP (OTHERWISE LOOKS BAD FOR USER)
                            listIn.currentOffset = -listIn.widgetsize;
                        }

                },
				/*
				Could when the hold is moving.
				*/
                holdMovingAction: function(xIn, yIn, listIn) {
                
                    // ONLY MOVE LIST IF NO WIDGETS INSIDE THE LIST ARE MOVING
                    if (mm.FW.areAnyWidgetsBeingMoved() == false) {
                        var oldOffset = listIn.newOffset;
                        
                        var move = 0;
                        if (listIn.vertical == true) {
                        
                            listIn.currentOffset = listIn.currentOffset + ((yIn - listIn.newOffset) * listIn.pixelsMoved);
                            // Reset the offset
                            listIn.newOffset = yIn;
                            move = yIn; 
                        } else {
                            listIn.currentOffset = listIn.currentOffset + ((xIn - listIn.newOffset) * listIn.pixelsMoved);
                            // Reset the offset
                            listIn.newOffset = xIn;
                            move = xIn;
                        }
                
                        mm.Lists.stopWidgetsRunningOffEdge(listIn);
                
                        if (listIn.currentOffset > 0) {
                            listIn.currentOffset = 0;
                        }
                
                        // MAX LENGTH
                        var listLength = 0;
                        var maxOffset = 0;
                        if (listIn.m.widgets != null && listIn.m.widgets.length > 0) {
                            for (var i=0; i < listIn.m.widgets.length;i++) {
                                if (listIn.vertical == true) {
                                    listLength = listLength + listIn.m.widgets[i].m.h;
                                } else {
                                    listLength = listLength + listIn.m.widgets[i].m.w;
                                }
                            }
                            if (!isNull(listIn.gapSize)) {
                                listLength = listLength + (listIn.gapSize * (listIn.m.widgets.length));
                            }
                        }
                
                        if (listLength > 0) {
                            if (listIn.vertical == true) {
                                maxOffset = listLength - listIn.m.h;
                            } else {
                                maxOffset = listLength - listIn.m.w;
                            }
                
                            if ((listIn.currentOffset < -maxOffset) && (-maxOffset < 0)) {
                                listIn.currentOffset = -maxOffset;
                            }
                        }
                
                
                        // (THE REDRAW ALSO HAPPENDS ON UP/DOWN NO CHANGES IF LEFT RIGHT- TO IMPROVE)
                        // USED TO CONTROL NUMBER OF PIXELS MOVED
                        var dif = move%listIn.numberOfPixelsMovedToDraw;
                        if ((oldOffset == listIn.newOffset) || (dif > 0)) {
                            mm.FW.setOnHoldMoveRedraw();
                        } 
                    }
                }
			   
            };
    
        })(),
		
		/*
        ++
        This module contains the functions for handling shapes.
		This is for internal use only.
		It specifically handles the drawing of shapes to the HTML5 canvas.
        */
        Shapes: (function() {
		
            return {
				/*
				This method draws a rectangle with rounded corners to the HTML5 canvas.
				*/
                 roundRect: function(ctx, x, y, width, height, radius, fillIn, style, lineWidthIn, gradientIn, transparentIn) {
                
                    if (isNull(transparentIn)) {
                        transparentIn = -1;
                    }
                
                    if (typeof radius === "undefined") {
                        radius = 5;
                    }
                    ctx.beginPath();
                    ctx.lineWidth = lineWidthIn;
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + width - radius, y);
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                    ctx.lineTo(x + width, y + height - radius);
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                    ctx.lineTo(x + radius, y + height);
                    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                    ctx.lineTo(x, y + radius);
                    ctx.quadraticCurveTo(x, y, x + radius, y);
                    ctx.closePath();
                 
                    var transparent = -1;
                    if (mm.FW.getGlobalAlpha() != -1) {
                        var trans = transparentIn + mm.FW.getGlobalAlpha() + 1;
                        if (trans > 255) {
                            trans = 255;
                        }
                        transparent = trans;
                    } else {
                        transparent = transparentIn;
                    }
                 
                    if (transparent != -1) {
                        ctx.save();
                        ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(transparent);
                    }
                 
                    if (fillIn == false) {
                        ctx.strokeStyle = style;
                        ctx.stroke();
                    } else {
                        if (!isNull(gradientIn)) {
                 
                            var grd=ctx.createLinearGradient(x + gradientIn.startX, y + gradientIn.startY, x + gradientIn.endX, y + gradientIn.endY);
                            for (var i=0;i<gradientIn.colours.length;i++) {
                                grd.addColorStop(gradientIn.colours[i].pos, gradientIn.colours[i].colour);
                            }
                            ctx.fillStyle = grd;
                        } else {
                            ctx.fillStyle = style;
                        }
                        ctx.fill();
                    }
                 
                    if (transparent != -1) {
                        ctx.restore();
                    }
                },
				/*
				This method draws a rectangle to the HTML5 canvas.
				*/
                rect: function(ctx, x, y, width, height, fillIn, style, lineWidthIn, gradientIn, transparentIn) {
               
                    if (isNull(transparentIn)) {
                        transparentIn = -1;
                    }
                    ctx.beginPath();
                    ctx.lineWidth = lineWidthIn;
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + width, y);
                    ctx.lineTo(x + width, y + height);
                    ctx.lineTo(x, y + height);
                    ctx.lineTo(x, y);
                    ctx.closePath();
                    var transparent = -1;
                 
                    if (mm.FW.getGlobalAlpha() != -1) {
                        var trans = transparentIn + mm.FW.getGlobalAlpha() + 1;
                        if (trans > 255) {
                            trans = 255;
                        }
                        transparent = trans;
                    } else {
                        transparent = transparentIn;
                    }
                 
                    if (transparent != -1) {
                        ctx.save();
                        ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(transparent);
                    }
                 
                    if (fillIn == false) {
                        ctx.strokeStyle = style;
                        ctx.stroke();
                    } else {
                        if (!isNull(gradientIn)) {
                 
                            var grd=ctx.createLinearGradient(x + gradientIn.startX, y + gradientIn.startY, x + gradientIn.endX, y + gradientIn.endY);
                            for (var i=0;i<gradientIn.colours.length;i++) {
                                grd.addColorStop(gradientIn.colours[i].pos, gradientIn.colours[i].colour);
                            }
                            ctx.fillStyle = grd;
                        } else {
                            ctx.fillStyle = style;
                        }
                        ctx.fill();
                    }
                 
                    if (transparent != -1) {
                        ctx.restore();
                    }
                 
                },
				/*
				This method draws a rectangle to the HTML5 canvas as specified by the style.
				*/
                drawRect: function(ctx, xIn, yIn, wIn, hIn, styleIn) {
                
                    if (styleIn != null) {
                        if (styleIn.rounded == true) {
                            if (!isNull(styleIn.colour) || !isNull(styleIn.gradient)) {
                                mm.Shapes.roundRect(ctx, xIn, yIn, wIn, hIn, styleIn.roundedAngle, true, styleIn.colour, styleIn.borderW, styleIn.gradient, styleIn.transparency);
                            }
                            if (!isNull(styleIn.borderColour) && (styleIn.borderW > 0)) {
                                mm.Shapes.roundRect(ctx, xIn, yIn, wIn, hIn, styleIn.roundedAngle, false, styleIn.borderColour, styleIn.borderW, null, styleIn.transparency);
                            }
                        } else {
                            // ROUNDED CORNERS MUST BE FALSE
                            if (!isNull(styleIn.colour) || !isNull(styleIn.gradient)) {
                                mm.Shapes.rect(ctx, xIn, yIn, wIn, hIn, true, styleIn.colour, styleIn.borderW, styleIn.gradient, styleIn.transparency);
                            } 
                            if (!isNull(styleIn.borderColour) && (styleIn.borderW > 0)) {
                                mm.Shapes.rect(ctx, xIn, yIn, wIn, hIn, false, styleIn.borderColour, styleIn.borderW, null, styleIn.transparency);
                            } 
                        }
                    
                    }
                },
				/*
				This method draws a circle to the HTML5 canvas.
				*/
                drawCircle: function(ctx, xIn, yIn, radiusIn, colourIn, fillIn, lineWidthIn, transparentIn, gradientIn) {
                
                    if (isNull(transparentIn)) {
                        transparentIn = -1;
                    }
                 
                    ctx.beginPath();
                 
                    ctx.lineWidth = lineWidthIn;
                 
                    ctx.arc(xIn + radiusIn, yIn + radiusIn, radiusIn, 0, Math.PI*2, false);
                    
                    var transparent = -1;
                    if (mm.FW.getGlobalAlpha() != -1) {
                        var trans = transparentIn + mm.FW.getGlobalAlpha() + 1;
                        if (trans > 255) {
                            trans = 255;
                        }
                        transparent = trans;
                    } else {
                        transparent = transparentIn;
                    }
                    if (transparent != -1) {
                        ctx.save();
                        ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(transparent);
                    }
                 
                    if (fillIn == true) {
                        if (gradientIn != null) {
                            var grd=ctx.createLinearGradient(xIn + gradientIn.startX, yIn + gradientIn.startY, xIn + gradientIn.endX, yIn + gradientIn.endY);
                            for (var i=0;i<gradientIn.colours.length;i++) {
                                grd.addColorStop(gradientIn.colours[i].pos,gradientIn.colours[i].colour);
                            }
                            ctx.fillStyle=grd;
                        } else {
                            ctx.fillStyle = colourIn;
                        }
                    }
					
                    if (fillIn == false) {
                        ctx.closePath();
                        ctx.strokeStyle = colourIn;
                        ctx.stroke();
                    } else {
                        ctx.closePath();
							
                        ctx.fill();
                    }
                 
                    if (transparent != -1) {
                        ctx.restore();
                    }
                
                },
				/*
				This method draws a polygon to the HTML5 canvas.
				*/
                drawPolygon: function(ctx, polyIn, offsetXIn, offsetYIn, styleIn, fillIn, lineWidthIn, transparentIn, gradientIn) {  
                
                    if (isNull(transparentIn)) {
                        transparentIn = -1;
                    }
              
                    ctx.beginPath();
                    ctx.lineWidth = lineWidthIn;
						
                    if (fillIn == true) {
                        if (gradientIn != null) {
                            var grd=ctx.createLinearGradient(offsetXIn + polyIn[0].x + gradientIn.startX, offsetYIn + polyIn[0].y + gradientIn.startY, offsetXIn +  polyIn[0].x + gradientIn.endX, offsetYIn +  polyIn[0].y + gradientIn.endY);
                            for (var i=0;i<gradientIn.colours.length;i++) {
                                grd.addColorStop(gradientIn.colours[i].pos,gradientIn.colours[i].colour);
                            }
                            ctx.fillStyle=grd;
                        } else {
                            ctx.fillStyle = styleIn;
                        }
                    }
                 
                    ctx.moveTo(offsetXIn + polyIn[0].x, offsetYIn + polyIn[0].y);
						
                    for (var iPoly=1;iPoly<polyIn.length;iPoly++) {
					
                        if (iPoly < (polyIn.length)) {
                            ctx.lineTo(offsetXIn + polyIn[iPoly].x, offsetYIn + polyIn[iPoly].y);
                        }
                    }
                 
                    var transparent = -1;
                    if (mm.FW.getGlobalAlpha() != -1) {
                        var trans = transparentIn + mm.FW.getGlobalAlpha() + 1;
                        if (trans > 255) {
                            trans = 255;
                        }
                        transparent = trans;
                    } else {
                        transparent = transparentIn;
                    }
                    if (transparent != -1) {
                        ctx.save();
                        ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(transparent);
                    }
                 
                    if (fillIn == false) {
                        ctx.closePath();
                        ctx.strokeStyle = styleIn;
                        ctx.stroke();
                    } else {
                        ctx.closePath();
							
                        ctx.fill();
                    }
                 
                    if (transparent != -1) {
                        ctx.restore();
                    }
                 
                },
				/*
				This method converts a polygon string of "{10,10};{100,100}" to an array of point[x], point[y].
				*/
                convertPolygonStringToArray: function(polygonIn, xOffsetIn, yOffsetIn) {
                    var pointsS = polygonIn.split(";");
                    var points = new Array();
                    for (var iPoint=0; iPoint<pointsS.length; iPoint++) {
                        var point = {};
                        var str = pointsS[iPoint].replace("{","");
                        var str = str.replace("}","");
                        var xy = str.split(",");
            
                        point['x'] = xOffsetIn + parseInt(xy[0]);
                        point['y'] = yOffsetIn + parseInt(xy[1]);
            
                        points[iPoint] = point;
                    }
                    return points;
                },
				/*
				This converts an hex colour value to an rgb transparent equivalent.
				*/
                convertHexToRGBTransparent: function(hexIn) {
                    var cutHex = (hexIn.charAt(0)=="#") ? hexIn.substring(1,7):hexIn;
                    var r = parseInt(cutHex.substring(0,2),16);
                    var g = parseInt(cutHex.substring(2,4),16);
                    var b = parseInt(cutHex.substring(4,6),16);
                    return "rgba(" + r + "," + g + "," + b + ",0.5)";
                },
				/*
				Converts a transparent value to its global alpha value..
				*/
                convertTransparentValueToGlobalAlpha: function(transparentIn) {
                    if (transparentIn == -1) {
                        return -1;
                    } else if (transparentIn == 0) {
                        return 0;
                    } else {
                        return transparentIn / 255;  // THIS IS THE ANDROID REFERENCE - 255 no transparency, 0 = fully transparent
                        // IN HTML5 Canvas globalAlpha 0 = fully transparent, 1 = no transparency.
                    }
                },
                /*
				Returns true if this xIn, yIn is in the area defined.
				*/
                isInArea: function(xIn, yIn, xObjIn, yObjIn, objWidthIn, objHeightIn) {
				
                    var yBottom = yObjIn + objHeightIn;
                    var xRight = xObjIn + objWidthIn;
				
                    if (xIn <= xRight && xIn >= xObjIn && yIn <= yBottom && yIn >= yObjIn) {
                        return true;
                    } else {
                        return false;
                    }
				
                },
				/*
				Returns true if this xIn and yIn are in this circle.
				*/
                isInCircle: function(xIn, yIn, cxIn, cyIn, radiusIn) {
                    var dx = xIn - cxIn;
                    var dy = yIn - cyIn;
                    return dx*dx+dy*dy <= radiusIn*radiusIn;
                },
				/*
				Retruns true if this xIn and yIn are in the polygon defined.
				*/
                isPointInPolygon: function(polyIn, xIn, yIn, offsetXIn, offsetYIn) {
                    var pt = {
                        x: xIn, 
                        y: yIn
                    };
					
                    var poly = polyIn;
					
                    if (offsetXIn != 0 && offsetYIn != 0) {
                        poly = new Array();
                        for(var i = 0; i<polyIn.length; i++) {
                            var point = {};
                            point['x'] = polyIn[i].x + offsetXIn;
                            point['y'] = polyIn[i].y + offsetYIn;
                            poly.push(point);
                        }
                    }
					
                    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
                        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                        && (c = !c);
                    return c;
                }
            };
    
        })(),
		
        /*
        ++
        This module contains the functionality used for the Image widget.
		
		Images can be png, jpg, gif etc.  
		
		An image widget can be used for many different purposes including an image button.
        */
        Images: (function() {
		
            return {
				/*
                ++
                This converts a WidgetClass to a new instance of the Image widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var w = mm.XML.getString(widgetClassIn, "W");
                    var h = mm.XML.getString(widgetClassIn, "H");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var imageSrc = mm.XML.getString(widgetClassIn, "Src");
                    var movable = mm.XML.getClass(widgetClassIn, "Movable");
                    var clickAction = mm.XML.getClass(widgetClassIn, "Click");
                    var preLoadImage = mm.XML.getBoolean(widgetClassIn, "PreLoadImage");
                  
                    var image = mm.Images.add(id, type, x, y, w, h, l, movable, imageSrc, clickAction, preLoadImage);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, image);
                
                    return image;
                
                },
                 /*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Image widget
                using pure JavaScript.
                This method can be used to add a Image widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    widthIn: String: Can be a px or percent value of width of widget.
                    heightIn: String: Can be a px or percent value of height of widget.
                    layerIn: Int: This is layer for the widget.
					movableIn: Boolean: If this is true then the widget can be moved.
					imageSrcIn: String: This is the location of the image file.
					actionIn: function: This is the click action when the user presses this widget.
					preLoadImageIn: Boolean: If this is set to true the image is loaded into memory when the application is initialised.
				
				Output:
                    New Image widget instance.
                
                */
                add:  function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, movableIn, imageSrcIn, actionIn, preLoadImageIn) {
                
                    if (preLoadImageIn == null) {
                        preLoadImageIn = false;
                    }
                 
                     var m = mm.Widgets.add(idIn, typeNameIn, "Image", xIn, yIn, widthIn, heightIn, layerIn);
              	
                    m.widgetsUnder = mm.FW.standardWidgetsUnder;
              	
                    var img = new mm.Image(m, imageSrcIn, mm.Images.draw);  // THIS X AND Y IS CALCULATED BY OTHER CONTROLLER DRAW
                 
                    // IF THE IMAGE IS PRE-LOADED, THEN GET IT
                    if (preLoadImageIn == true) {
                        img.image = mm.XML.getPreLoadedImageById(idIn);
                    }
			
                    // // ON CLICK CALL THE ACTION PASSED IN
                    if (actionIn != null) {
                        m.clickable = true;
                        img.clickAction = actionIn;
                    }
                 
                    // IMAGES DO NOT HAVE TEXT
	
                    // IS THIS A MOVABLE, PERHAPS IMAGES ARE MOVABLE (AT LEAST IN LISTS) ?????????
                 
                    // IS THIS A MOVABLE
                    if (movableIn != null) {
                        if (movableIn.movable == true) {
                            m.move = movableIn;
                            m.movable = true;
                        }
                    }
                 
                    return img;  // RETURN THE NEWLY CREATED IMAGE TO THE DEVELOPER.
                },
				/*
				Responsible for drawing the image to the HTML5 canvas.
				*/
                draw: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                 
                    if (this.m.invisible == false) {
                 
                        if (this.onLoad != null) {
                            this.image = mm.Images.drawImageScaleCallback(ctx, xIn, yIn, this.image, this.imageSrc, this.m.w, this.m.h, this.onLoad);
                        } else {
                            this.image = mm.Images.drawImageScale(ctx, xIn, yIn, this.image, this.imageSrc, this.m.w, this.m.h);
                        }
                 
                 
                        mm.Texts.drawInWidget(xIn, yIn, this);  // DRAW TEXT IN WIDGET IF SPECIFIED
                 
                 
                    }
                },
				/*
				Performs a deep copy and creates a new image from this image.
				*/
                copyImage: function(idIn, imageIn) {
                    var m = mm.FW.copyWidget(idIn, imageIn.m);
					
                    // PERFORMS A DEEP COPY AND CREATES A NEW IMAGE FROM THIS IMAGE.
                    var newImage = new Image(m, imageIn.imageSrc, imageIn.draw);
                    //newImage.move = imageIn.move;
                    newImage.imageSrc = imageIn.imageSrc;
                    newImage.image = imageIn.image;
			   
                    return newImage;
                },
				/*
				Draws the image to the scale specified.
				*/
                drawImageScale: function(ctx, xIn, yIn, imageIn, imageSrcIn, widthIn, heightIn) {
                
                     // Draw Image
                    if (imageIn == null) {
                        imageIn = new Image();
                        imageIn.src = imageSrcIn;
                    }
					
                    // Display Image
                    if (imageIn.complete) {
                        if (mm.FW.getGlobalAlpha() != -1) {
                            var trans = mm.FW.getGlobalAlpha();
                            if (trans > 255) {
                                trans = 255;
                            }
                            ctx.save();
                            ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                 
                            ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                            ctx.restore();
                        } else {
                                ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                        }
                    } else {
                        if (imageIn.complete == false || imageIn.complete == null || imageIn.complete == "null" || imageIn.complete == undefined || imageIn.complete == "undefined") { 
                            imageIn.onload = function() {
                                if (mm.FW.getGlobalAlpha() != -1) {
                                    var trans = mm.FW.getGlobalAlpha();
                                    if (trans > 255) {
                                        trans = 255;
                                    }
                                    ctx.save();
                                    ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                 
                                    ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                                    ctx.restore();
                                } else {
                                     ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                                }
                            }
                            imageIn.src = imageSrcIn;
                        }
                    }
                 
                 
                 
                 
                    return imageIn;
                },
				/*
				Draws the image to HTML5 canvas with the scale specified.  When completed the callback is called.
				*/
                drawImageScaleCallback: function(ctx, xIn, yIn, imageIn, imageSrcIn, widthIn, heightIn, callbackIn) {
                 
                    // Draw Image
                    if (imageIn == null) {
                        imageIn = new Image();
                        imageIn.src = imageSrcIn;
                    }
					
                    // Display Image
                    if (imageIn.complete) {
                        if (mm.FW.getGlobalAlpha() != -1) {
                            var trans = mm.FW.getGlobalAlpha();
                            if (trans > 255) {
                                trans = 255;
                            }
                            ctx.save();
                            ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                 
                            ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                            ctx.restore();
                        } else {
                                ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                        }  
                    } else {
                        if (imageIn.complete == false || imageIn.complete == null || imageIn.complete == "null" || imageIn.complete == undefined || imageIn.complete == "undefined") { 
                            
                            imageIn.onload = function() {
                                if (mm.FW.getGlobalAlpha() != -1) {
                                    var trans = mm.FW.getGlobalAlpha();
                                    if (trans > 255) {
                                        trans = 255;
                                    }
                                    ctx.save();
                                    ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                 
                                    ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                                    ctx.restore();
                                } else {
                                    ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                                }  
                                callbackIn();
                            }
                            imageIn.src = imageSrcIn;
                        }
                    }
                 
                 
                 
                 
                 
                    return imageIn;
                },
				/*
				Draws the image to the HTML5 canvas.
				*/
                drawImage: function(ctx, xIn, yIn, imageIn, imageSrcIn) {
                
                    // Draw Image
                    if (imageIn == null) {
                        imageIn = new Image();
                        imageIn.src = imageSrcIn;
                    }
					
                    // Display Image
                    if (imageIn.complete) {
                        if (mm.FW.getGlobalAlpha() != -1) {
                            var trans = mm.FW.getGlobalAlpha();
                            if (trans > 255) {
                                trans = 255;
                            }
                            ctx.save();
                            ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                 
                            ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                            ctx.restore();
                        } else {
                                ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                        }  
                    } else {
                        if (imageIn.complete == false || imageIn.complete == null || imageIn.complete == "null" || imageIn.complete == undefined || imageIn.complete == "undefined") { 
                            imageIn.onload = function() {
                                if (mm.FW.getGlobalAlpha() != -1) {
                                    var trans = mm.FW.getGlobalAlpha();
                                    if (trans > 255) {
                                        trans = 255;
                                    }
                                    ctx.save();
                                    ctx.globalAlpha = mm.Shapes.convertTransparentValueToGlobalAlpha(trans);
                 
                                    ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                                    ctx.restore();
                                } else {
                                    ctx.drawImage(imageIn, xIn, yIn, widthIn, heightIn);
                                }  
                            }
                            imageIn.src = imageSrcIn;
                        }
                    }
                 
                 
                 
                    return imageIn;
                },
				/*
				Returns trus of the image has been completely loaded into memory.
				*/
                isImageComplete: function(imageIn) {
                    return !(imageIn.complete == false || imageIn.complete == null || imageIn.complete == "null" || imageIn.complete == undefined || imageIn.complete == "undefined");
                },
				/*
				Preloads all the images into memory from the widget classes.  This is important for iOS.  Not an issue with Android.
				*/
                preLoadImagesFromWidgetClasses: function(imagesIn, callbackIn) {
                
                    var numberImagesToPreLoad = 0;
                    var imagesLoaded = 0;
                
                    if (!isNull(imagesIn)) {
                     // Work out how many preloaded images exist
                        for (var i=0; i < imagesIn.length; i++) {
                 
                            var imageSrc = mm.XML.getString(imagesIn[i], "Src");
                 
                            if (!isNull(imageSrc)) {
                 
                                if ((isNull(imagesIn[i].image)) || (!mm.Images.isImageComplete(imagesIn[i].image))) {
                                    numberImagesToPreLoad = numberImagesToPreLoad + 1;
                                }
                            }
                        }
                 
                        for (var i=0; i < imagesIn.length; i++) {
                 
                            var imageSrc = mm.XML.getString(imagesIn[i], "Src");
                  
                            if (!isNull(imageSrc)) {
                                if (isNull(imagesIn[i].image)) {
                                    imagesIn[i].image = new Image();
                                    imagesIn[i].image.src = imageSrc;
                                }
                  
                                if (!mm.Images.isImageComplete(imagesIn[i].image)) {
                                    imagesIn[i].image.onload = function() {
                                        imagesLoaded = imagesLoaded + 1;
                                        if (imagesLoaded == numberImagesToPreLoad) {
                                            callbackIn();
                                        }
                                    }
                                    imagesIn[i].image.src = imageSrc;
                                } else {
                                    imagesLoaded = imagesLoaded + 1;
                                    if (imagesLoaded == numberImagesToPreLoad) {
                                        callbackIn();
                                    }
                                }
                            }
                        }

                    }
                 
                },
				/*
				Preloads all the images into memory.  This is important for iOS.  Not an issue with Android.
				*/
                preloadImages: function(imagesIn, callbackIn) {
                
                    var numberImagesToPreLoad = 0;
                    var imagesLoaded = 0;
            
                    if (!isNull(imagesIn)) {
                  
                        // Work out how many preloaded images exist
                        for (var i=0; i < imagesIn.length; i++) {
                  
                            if (!isNull(imagesIn[i].imageSrc)) {
                  
                                if ((isNull(imagesIn[i].image)) || (!mm.Images.isImageComplete(imagesIn[i].image))) {
                                    numberImagesToPreLoad = numberImagesToPreLoad + 1;
                                }
                            }
                 
                        }
                  
                        for (var i=0; i < imagesIn.length; i++) {
                  
                            if (!isNull(imagesIn[i].imageSrc)) {
                                if (isNull(imagesIn[i].image)) {
                                    imagesIn[i].image = new Image();
                                    imagesIn[i].image.src = imagesIn[i].imageSrc;
                                }
                  
                                if (!mm.Images.isImageComplete(imagesIn[i].image)) {
                                    imagesIn[i].image.onload = function() {
                                        imagesLoaded = imagesLoaded + 1;
                                        if (imagesLoaded == numberImagesToPreLoad) {
                                            callbackIn();
                                        }
                                    }
                                    imagesIn[i].image.src = imagesIn[i].imageSrc;
                                }
                            }
                        }
                    }
                
                }
            };
    
        })(),

		
		/*
        ++
        This module contains the functionalities for the Page and PageFlow widget.
		
		Most applications will have more than one page.  This handles page transformation and going to previous pages etc.
		*/
        Pages: (function() {
            
              
            return {
				/*
                ++
                This converts a WidgetClass to a new instance of the Page widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addWidgetClass: function(widgetClassIn, widgetsIn) {
                
                    var id = widgetClassIn.id;
                    var type = mm.XML.getString(widgetClassIn, "Type");
                    var x = mm.XML.getString(widgetClassIn, "X");
                    var y = mm.XML.getString(widgetClassIn, "Y");
                    var w = mm.XML.getString(widgetClassIn, "W");
                    var h = mm.XML.getString(widgetClassIn, "H");
                    var l =  mm.XML.getInt(widgetClassIn, "L");
                    var style = mm.XML.getClass(widgetClassIn, "Style");
                
                
                
                    var page = mm.Pages.addPage(id, type, x, y, w, h, l, widgetsIn, style);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, page);
                
                
                    var transformationName = mm.XML.getString(widgetClassIn, "TransformationName");
                    if (transformationName != null) {
                        var timeout = mm.XML.getInt(widgetClassIn, "TransformationTimeout");
                        var amount = mm.XML.getInt(widgetClassIn, "TransformationAmount");
                
                        page.pageFlowController = mm.Pages.getPageFlowController(transformationName, timeout, amount);
                    }
                
                    var swipeRightAction = mm.XML.getClass(widgetClassIn, "SwipeRight");
                    if (swipeRightAction != null) {
                        page.swipeRightAction = swipeRightAction;
                    }
                    var swipeLeftAction = mm.XML.getClass(widgetClassIn, "SwipeLeft");
                    if (swipeLeftAction != null) {
                        page.swipeLeftAction = swipeLeftAction;
                    }
                    var swipeUpAction = mm.XML.getClass(widgetClassIn, "SwipeUp");
                    if (swipeUpAction != null) {
                        page.swipeUpAction = swipeUpAction;
                    }
                    var swipeDownAction = mm.XML.getClass(widgetClassIn, "SwipeDown");
                    if (swipeDownAction != null) {
                        page.swipeDownAction = swipeDownAction;
                    }
                
                    return page;
                
                },
				/*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a Page widget
                using pure JavaScript.
                This method can be used to add a Page widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    widthIn: String: Can be a px or percent value of width of widget.
                    heightIn: String: Can be a px or percent value of height of widget.
                    layerIn: Int: This is layer for the widget.
					widgetsIn: Array of widgets: These are the child widgets that will be drawn within this page.
					styleIn: WidgetStyle: The style of the page.  Pages are rectangular.
					
				Output:
                    New Page widget instance.
                
                */
                addPage: function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, widgetsIn, styleIn) {

                    var m = mm.Widgets.add(idIn, typeNameIn, "Page", xIn, yIn, widthIn, heightIn, layerIn);
                
                    m.container = true;
                
                    var page = new mm.Page(m, mm.Pages.drawPage);  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                
                    if (styleIn != null) {
                        page.s = styleIn;
                
                        if (page.s.borderW == null) {
                            page.s.borderW = 1;
                        }
                        if (page.s.rounded == null) {
                            page.s.rounded = false;
                        }
                    }
                
                    mm.Container.adds(page, widgetsIn);
                
                    m.widgetsUnder = mm.Pages.widgetsUnderPointerPage;  
                    m.clickable = false;

                    m.movable = false;

                    m.propagateClick = false;
                    m.propagateHold = false;
                
                    return page;
                },
				/*
				Responsible for drawing the page to the HTML5 canvas.
				*/
                drawPage: function(ctx, xIn, yIn) {
                
                    if (this.s != null) {
                        if (this.s.transparency != -1) {
                            mm.FW.setGlobalAlpha(this.s.transparency);
                        }
                
                        mm.Shapes.drawRect(ctx, xIn, yIn, this.m.w, this.m.h, this.s);
                    }
                
                    mm.FW.drawWidgetsInContainer(this, this.m.widgets, xIn, yIn);

                    if (this.s != null) {
                        mm.FW.setGlobalAlpha(-1);  // RESET THE GLOBAL ALPHA
                    }
                

                },
				/*
                ++
                This converts a WidgetClass to a new instance of the PageFlow widget.
                This is for internal use only.  For external use, please use:
                mm.App.addWidgetX
                */
                addPageFlowWidgetClass: function(widgetClassIn, widgetsIn) {
                
                    // GET THE START PAGE, MUST BE IN THE widgetsIn
                    var startPage = null;
                    var i=0;
                    var startPageName = mm.XML.getString(widgetClassIn, "StartPage");
                    while (i<widgetsIn.length && startPage == null) {
                        if (startPageName == widgetsIn[i].m.id) {
                            startPage = widgetsIn[i];
                        }
                        i = i + 1;
                    }
                
                    var pageFlow = mm.Pages.addPageFlow(widgetClassIn.id, mm.XML.getString(widgetClassIn, "Type"), mm.XML.getString(widgetClassIn, "X"), mm.XML.getString(widgetClassIn, "Y"), mm.XML.getString(widgetClassIn, "W"), mm.XML.getString(widgetClassIn, "H"), mm.XML.getInt(widgetClassIn, "L"), widgetsIn, startPage);
                
                    mm.Widgets.updateWidgetXML(widgetClassIn, pageFlow);
                
                    var transformationName = mm.XML.getString(widgetClassIn, "TransformationName");
                    var timeout = mm.XML.getInt(widgetClassIn, "TransformationTimeout");
                    var amount = mm.XML.getInt(widgetClassIn, "TransformationAmount");
                
                    pageFlow.pageFlowController = mm.Pages.getPageFlowController(transformationName, timeout, amount);
                
                    return pageFlow;
                
                },
				/*
                External Use.
                If the commons.xml or page.xmls files are not used, or the developer wants to add a PageFlow widget
                using pure JavaScript.
                This method can be used to add a PageFlow widget.
                Input:
                    idIn: String: The id for the text widget.  If this is null it will be automatically generated.
                    typeNameIn: String: The m.type attribute.
                    xIn: String: Can be a px or percent value of position of widget.
                    yIn: String: Can be a px or percent value of position of widget.
                    widthIn: String: Can be a px or percent value of width of widget.
                    heightIn: String: Can be a px or percent value of height of widget.
                    layerIn: Int: This is layer for the widget.
					pagesIn: Array of pages: These are the pages that belong to this pageflow.
					startPageIn: Page: This is the first page that is shown on the pageflow.
					
				Output:
                    New Page widget instance.
                
                */
                addPageFlow: function(idIn, typeNameIn, xIn, yIn, widthIn, heightIn, layerIn, pagesIn, startPageIn) {

                     var m = mm.Widgets.add(idIn, typeNameIn, "PageFlow", xIn, yIn, widthIn, heightIn, layerIn);
      
                    m.container = true;
                
                    if (startPageIn != null) {
                        startPageIn.m.enabled = true;
                        startPageIn.m.hidden = false;
                        startPageIn.m.l = 2;
                    }
                
                    for (var i=0; i < pagesIn; i++) {
                
                        var page = pagesIn[i];
                        page.m.enabled = false;
                        page.m.hidden = true;
                        page.m.l = 1;
                    }

                    if (startPageIn != null) {
                        pagesIn.push(startPageIn);
                    }

                    var pageFlow = new mm.PageFlow(m, mm.Pages.drawPageFlow);  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW

                    pageFlow.pageFlow = new Array();

                    if (startPageIn != null) {
                        pageFlow.currentShownPage = startPageIn;
                        pageFlow.pageFlow.push(startPageIn);
                    }

                    mm.Container.adds(pageFlow, pagesIn);

                    m.widgetsUnder = mm.Pages.widgetsUnderPointerPageFlow;   // STANDARD EXCELLENT
                    m.clickable = false;
                    m.movable = false;

                    m.propagateClick = true;
                    m.propagateHold = true;

                    return pageFlow;  // RETURN THE NEWLY CREATED BOX TO THE DEVELOPER.
                },
				/*
				Responsible for drawing the page flow to the HTML5 canvas.
				*/
                drawPageFlow: function(ctx, xIn, yIn) {  // THIS X AN Y IS CALCULATED BY OTHER CONTROLLER DRAW
                
                    // NOW DRAW THE WIDGETS BASED ON THE X and Y in.
                    if (this.pageFlow != null) {
                
                        // NO RECURSIVE DRAWING - EACH WIDGET TAKES CARE OF THAT :-)
                        for (var i=0;i < this.pageFlow.length; i++) {   // PAGE FLOW WILL BE CORRECTLY ORDER ALREADY

                            var eachWidget = this.pageFlow[i];
            
                            if (eachWidget.m.hidden == false) {

                                mm.FW.drawWidgetInContainer(eachWidget, xIn, yIn);
					
                            }
                        }
                    }
                
                
                },
				/*
				Performs the page navigation based on a click action.
				*/
                navigatePageByClickAction: function(widgetIn, clickActionIn) {
                    var navigation = clickActionIn.navigation;
                    var closePage = clickActionIn.closePage;
                
                    if (navigation != null || closePage == true) {
                
                            var pageFlow = mm.App.getPageFlowForWidget(widgetIn);
                
                            if (pageFlow != null) {
                                if (closePage == false) {  // OPEN NEXT PAGE
                                    // MOVE TO THE NEXT PAGE
                                    mm.Pages.openPageByPageId(pageFlow, navigation, null);
                                } else if (closePage == true) {
                                    if (navigation == null || navigation.length <= 0) {
                                        // CLOSE TO THE PREVIOUS PAGE
                                        mm.Pages.closePage(pageFlow.currentShownPage, null);  // WILL GET PAGE FLOW CONTROLLER FROM THE PAGE
                                      } else {
                                        var page = null;
                                        var i = 0;
                                        while (i < pageFlow.pageFlow.length && page == null) {
                                            if (pageFlow.pageFlow[i].m.id == navigation) {
                                                page = pageFlow.pageFlow[i];
                                            }
                                            i = i + 1;
                                        }
                                        if (page == null) {
                                            // CLOSE TO THE PREVIOUS PAGE
                                            mm.Pages.closePage(pageFlow.currentShownPage, null);  // WILL GET PAGE FLOW CONTROLLER FROM THE PAGE
                                        } else {
                                            mm.Pages.closePageOther(pageFlow.currentShownPage, page, null);
                                        }
                                    }
                                }
                            } 
                    }
                
                },
				/*
				Returns a page that is stored in the page flow by its id.
				*/
                getPageInPageFlow: function(pageFlowIn, pageIdIn) {
                    var page = null;
                    // SEARCH FOR THE PAGE, IN THE PAGE FLOW WIDGETS
                    if (pageFlowIn.m.widgets != null) {
                        var i=0;
                        while (i<pageFlowIn.m.widgets.length && page == null) {
                            if (pageFlowIn.m.widgets[i].m.id == pageIdIn) {
                                page = pageFlowIn.m.widgets[i];
                            }
                            i = i + 1;
                        }
                    }
                    return page;
                },
				/*
				Opens a page that belong to the page flow by its page id.
				*/
                openPageByPageId: function(pageFlowIn, pageIdIn, argsIn) {
                
                    var page = mm.Pages.getPageInPageFlow(pageFlowIn, pageIdIn);
                
                    if (page == null) {
                        // IT COULD BE THAT THE PAGE WAS NOT PRELOADED, SO WE WILL HAVE TO LOAD THE PAGE HERE...
                        var pageWidgetClass = mm.XML.getPage(pageFlowIn.m.id, pageIdIn);
                        if (pageWidgetClass != null) {
                            // CONVERT WIDGET CLASS TO WIDGETS
                            var pages = new Array();
                            mm.Widgets.addWidgetClass(pages, pageWidgetClass);
                            if (pages.length > 0) { // CAN ONLY BE ONE
                                page = pages[0];
                                mm.App.add(pageFlowIn, page);
                            }
                        }
                    }
                
                    if (page == null) {
                        console.log("ERROR: Page " + pageIdIn + " not found.");
                    } else {
                
                        // PROCEED AND OPEN THE PAGE
                        var pageFlowController = page.pageFlowController;
                        if (pageFlowController == null) {
                            pageFlowController = pageFlowIn.pageFlowController;
                        }
                        mm.Pages.openPage(page, pageFlowController, argsIn);
                    }
                
                },
				/*
				Calls the m.stages.openPage method when a page is opened.
				*/
                callOpenPageFunction: function(widgetIn) {
                    // THIS IS ONLY CURRENTLY FOR PAGE
                    // IF THIS WAS DONE FOR ALL WIDGETS ON THE PAGE
                    // IT COULD CREATE PERFORMANCE PROBLEMS.
                
                    // CALL SHOW IF IT EXISTS
                    if (widgetIn.m.stages != null && widgetIn.m.stages.openPage != null) {
                        var f = mm.App.getFunction(widgetIn.m.stages.openPage);
                        if (f != null) {
                            f(widgetIn);
                        } else {
                            console.log("ERROR: Function not found (openPage) : " + widgetIn.m.stages.openPage);
                        }
                    }
                },
				/*
				Calls the m.stages.afterMethod method after a page is opened.
				*/
                callAfterOpenPageFunction: function(widgetIn) {
                    // THIS IS ONLY CURRENTLY FOR PAGE
                    // IF THIS WAS DONE FOR ALL WIDGETS ON THE PAGE
                    // IT COULD CREATE PERFORMANCE PROBLEMS.
                
                    // CALL SHOW IF IT EXISTS
                    if (widgetIn.m.stages != null && widgetIn.m.stages.afterOpen != null) {
                        var f = mm.App.getFunction(widgetIn.m.stages.afterOpen);
                        if (f != null) {
                            f(widgetIn);
                        } else {
                            console.log("ERROR: Function not found (afterOpen): " + widgetIn.m.stages.afterOpen);
                        }
                    }
                
                },
				/*
				Calls the m.stages.close method when a page is closed.
				*/
                callClosePageFunction: function(widgetIn) {
                    // THIS IS ONLY CURRENTLY FOR PAGE
                    // IF THIS WAS DONE FOR ALL WIDGETS ON THE PAGE
                    // IT COULD CREATE PERFORMANCE PROBLEMS ???? to test
                
                
                    // CALL SHOW IF IT EXISTS
                    if (widgetIn.m.stages != null && widgetIn.m.stages.close != null) {
                        var f = mm.App.getFunction(widgetIn.m.stages.close);
                        if (f != null) {
                            f(widgetIn);
                        } else {
                            console.log("ERROR: Function not found: " + widgetIn.m.stages.close);
                        }
                    }
                
                },
				/*
				Calls the m.stages.afterClose method after a page is closed.
				*/
                callAfterClosePageFunction: function(widgetIn) {
                    // THIS IS ONLY CURRENTLY FOR PAGE
                    // IF THIS WAS DONE FOR ALL WIDGETS ON THE PAGE
                    // IT COULD CREATE PERFORMANCE PROBLEMS ???? to test
                
                    // CALL SHOW IF IT EXISTS
                    if (widgetIn.m.stages != null && widgetIn.m.stages.afterClose != null) {
                        var f = mm.App.getFunction(widgetIn.m.stages.afterClose);
                        if (f != null) {
                            f(widgetIn);
                        } else {
                            console.log("ERROR: Function not found: " + widgetIn.m.stages.afterClose);
                        }
                    }
                
                },
				/*
				Opens the newPageIn.
				*/
                openPage: function(newPageIn, pageFlowControllerIn, argsIn) {
                
                    newPageIn.pageFlowController = pageFlowControllerIn;
                
                    var pageFlowIn = newPageIn.m.parent;

                
                        if (pageFlowIn.pageFlow.length > 0) {
                            var previousPage = pageFlowIn.pageFlow[pageFlowIn.pageFlow.length - 1];
                

                            newPageIn.previousPage = previousPage;
                        }
                
                    if (newPageIn.fullPageX == null) {
                        newPageIn.fullPageX = newPageIn.m.x;
                    }
                

                    if (newPageIn.fullPageY == null) {
                        newPageIn.fullPageY = newPageIn.m.y;
                    }
                
                    newPageIn.shownX = newPageIn.fullPageX;
                    newPageIn.shownY = newPageIn.fullPageY;
                
                
                    for (var i=0;i < pageFlowIn.m.widgets.length; i++) {
                            pageFlowIn.m.widgets[i].m.l = 1;
                    }
                    newPageIn.m.l = 2;
                
                    mm.Pages.callOpenPageFunction(newPageIn); 
               
                    newPageIn.m.enabled = true;
                    newPageIn.m.hidden = false;

                    pageFlowIn.pageFlow.push(newPageIn);
                
                    newPageIn.pageFullyOpen = true;
 		
                    pageFlowControllerIn.openPage(pageFlowIn, newPageIn.previousPage, newPageIn);
              
                },
				/*
				Called after the page is fully open.
				*/
                afterOpenPage: function(pageFlowIn, previousPage, newPageIn) {

                    if (previousPage != null) {
                        if (mm.Pages.isPageFullyUnderOther(previousPage)) {
                            previousPage.m.enabled = false;
                            previousPage.m.hidden = true;
                        }

                    }
                    pageFlowIn.currentShownPage = newPageIn;

                    if (newPageIn.partialShownX != null || newPageIn.partialShownY != null) {
                        newPageIn.partialNowShown = true;
                    }
                    mm.Pages.callAfterOpenPageFunction(newPageIn);
                    
                    mm.App.repaint();
                },
				/*
				Closes the currentPageIn and shows the previous page in the page flow.
				*/
                closePage: function(currentPageIn, pageFlowControllerIn) {
                
                
                    if (isNull(pageFlowControllerIn)) {
                        pageFlowControllerIn = currentPageIn.pageFlowController;
                    }
                
                    var previousPage = currentPageIn.previousPage;

                    var pageFlowIn = currentPageIn.m.parent;
                    for (var i = 0; i < pageFlowIn.m.widgets; i++) {
                        pageFlowIn.m.widgets[i].m.l = 1;
                    }

                    if (previousPage != null) {
                        previousPage.m.hidden = false;
                        previousPage.m.enabled = true;
                        previousPage.m.l = 2;
                    }

                    pageFlowIn.currentShownPage.m.enabled = false;
                
                    mm.Pages.callClosePageFunction(currentPageIn); 

                    pageFlowControllerIn.closePage(pageFlowIn, previousPage, currentPageIn);
                
                },
                closePageOther: function(currentPageIn, previousPageIn, pageFlowControllerIn) {
                
                     if (isNull(pageFlowControllerIn)) {
                        pageFlowControllerIn = currentPageIn.pageFlowController;
                    }

                    var previousPage = previousPageIn;

                    var pageFlowIn = currentPageIn.m.parent;

                    for (var i = 0; i<pageFlowIn.m.widgets.length; i++) {
                        pageFlowIn.m.widgets[i].m.l = 1;
                    }
                    if (previousPage != null) {
                        previousPage.m.hidden = false;
                        previousPage.m.enabled = true;
                        previousPage.m.l = 2;
                    }
                    pageFlowIn.currentShownPage.m.enabled = false;
                
                    mm.Pages.callClosePageFunction(currentPageIn); 
		
                    pageFlowControllerIn.closePage(pageFlowIn, previousPage, currentPageIn);
                
                
                },
				/*
				Called after the page is closed.
				*/
                afterClosePage: function(pageFlowIn, previousPageIn, currentPageIn) {

                    if (previousPageIn != null) {
                        previousPageIn.m.enabled = true;
                    }

                    mm.Pages.callAfterClosePageFunction(currentPageIn);
         
                    currentPageIn.pageFullyOpen = false;
                    if (currentPageIn.partialShownX == null && currentPageIn.partialShownY == null) {
		
                        if (previousPageIn != null) {
                            var removeI = -1;
                            var i = 0;
                            while (removeI == -1 && i < pageFlowIn.pageFlow.length) {
                                if (previousPageIn.m.id == pageFlowIn.pageFlow[i].m.id) { 
                                      removeI = i;
                                }
                                i = i + 1;
                            }
                            if (removeI != i) {
                                var endI = pageFlowIn.pageFlow.length - 1;
                                for (var x = endI; x > removeI; x--) {  
                                    pageFlowIn.pageFlow[x].m.x =  pageFlowIn.pageFlow[x].shownX;
                                    pageFlowIn.pageFlow[x].m.y = pageFlowIn.pageFlow[x].shownY;
            
                                    pageFlowIn.pageFlow.remove(x, x+1);  
                                }
                            }
                        }

                        pageFlowIn.currentShownPage = previousPageIn;

                        currentPageIn.previousPage = null;
                    }
                
                    currentPageIn.fullPageX = null;
                    currentPageIn.fullPageY = null;
                
                
                
                },
				/*
				Returns a list of widgets that are under the xIn and yIn position.
				*/
                widgetsUnderPointerPage: function(xIn, yIn, offsetXIn, offsetYIn, pageIn) {
       
                    // LOOP THROUGH ALL OF THE OTHER WIDGETS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                   var widgetsUnderPointerList = new Array();
                    if (pageIn.m.widgets != null) {
                        for (var i=0; i < pageIn.m.widgets.length; i++) {
                            var eachWidget = pageIn.m.widgets[i];
                            var tempWidgets = eachWidget.m.widgetsUnder(xIn, yIn, pageIn.m.x + offsetXIn, pageIn.m.y + offsetYIn, eachWidget);
                            if (tempWidgets != null) {
                                for (var x=0; x < tempWidgets.length; x++) {
                
                                    var tempWidget = tempWidgets[x];

                                    if (tempWidget.m.enabled == true || tempWidget.m.movable == true || tempWidget.m.holdable == true) {
                                        widgetsUnderPointerList.push(tempWidget);
                                    }
                                }
                            }
                        }
                    }

                    var tempWidgetsUnderPointerList = mm.FW.standardWidgetsUnder(xIn, yIn, offsetXIn, offsetYIn, pageIn);

                    if (tempWidgetsUnderPointerList != null) {
                        for (var i = 0; i < tempWidgetsUnderPointerList.length; i++) {
                            widgetsUnderPointerList.push(tempWidgetsUnderPointerList[i]);
                        }
                    }

                    return widgetsUnderPointerList;
                },
				/*
				Returns a list of widgets that are under the xIn and yIn position.
				*/
                widgetsUnderPointerPageFlow: function(xIn, yIn, offsetXIn, offsetYIn, widgetIn) {
                
                    // LOOP THROUGH ALL OF THE OTHER WIDGETS INSIDE OF THIS ONE AND SEE IF THEY WERE SELECTED FIRST
                    var pageFlow = widgetIn;
                
                    var widgetsUnderPointerList = new Array();
                
                    if (pageFlow.pageFlow != null) {
                        for (var i=0; i < pageFlow.pageFlow.length; i++) {
                            var eachWidget = pageFlow.pageFlow[i];
                            if (eachWidget.m.enabled == true || eachWidget.m.movable == true || eachWidget.m.holdable == true) {
                                var tempWidgets = eachWidget.m.widgetsUnder(xIn, yIn, widgetIn.m.x + offsetXIn, widgetIn.m.y + offsetYIn, eachWidget);
                                if (tempWidgets != null) {
                                    for (var x = 0; x < tempWidgets.length; x++) {
                                        var tempWidget = tempWidgets[x];
                                        if (tempWidget.m.enabled == true || tempWidget.m.movable == true || tempWidget.m.holdable == true) {
                                               widgetsUnderPointerList.push(tempWidget);
                                            //mm.FW.addBySortOrderPos(widgetsUnderPointerList, tempWidget);
                                        }

                                    }
                                    widgetsUnderPointerList.sort(mm.FW.sortByDrawOrder);
                                }
                            }
                        }

                    }
               
                    return widgetsUnderPointerList;
                },
                /*
				TODO : check if this works.
				returns true if page is fully under another page.
				*/
                isPageFullyUnderOther: function(pageIn) {

                    // FIRST CHECK IF OUTSIDE OF PAGE FLOW
                    // DO ALL PAGES HAVE PAGE FLOW ??????
                    var outsideBox = false;
                    if (pageIn.m.parent != null) {

                    // COULD BE CONTAINED IN OTHER PARENT, SUCH AS SCREEN OR THE BOX
                    if ((pageIn.m.y + pageIn.m.h) < pageIn.m.parent.m.y) { // CHECK OUTSIDE OF TOP
                        outsideBox = true;
                    } else if (pageIn.m.y > (pageIn.m.parent.m.y + pageIn.m.parent.m.h)) {  // CHECK OUTSIDE OF BOTTOM
                        outsideBox = true;
                    } else if ((pageIn.m.x + pageIn.m.w) < pageIn.m.parent.m.x) {  // CHECK OUTSIDE OF LEFT
                        outsideBox = true;
                    } else if (pageIn.m.x > (pageIn.m.parent.m.x + pageIn.m.parent.m.w)) {  // CHECK OUTSIDE OF RIGHT
                        outsideBox = true;
                    }

                    if (outsideBox != true) {
                        if (pageIn.m.parent.m.type == "PageFlow") {
                            var pageFlow = pageIn.m.parent;

                            if (pageFlow.pageFlow != null && pageFlow.pageFlow.length > 0) {
                                var i = 0;
                                var iFound = -1;
                                while (iFound == -1 && i < pageFlow.pageFlow.length) {
                                    if (pageFlow.pageFlow[i].m.id == pageIn.m.id) {
                                        iFound = i;
                                    }
                                    i = i + 1;
                                }

                                if (iFound != -1 && iFound < (pageFlow.pageFlow.length - 1)) {

                                    var x = pageIn.m.x;
                                    var width = pageIn.m.w;
                                    if (pageIn.m.x < pageFlow.m.x) {
                                        x = pageFlow.m.x;
                                        width = pageFlow.m.w; //pageIn.m.w - (pageIn.m.x - pageFlow.m.x);
                                    }
                                    var y = pageIn.m.y;
                                    var height = pageIn.m.h;
                                    if (pageIn.m.y < pageFlow.m.y) {
                                        y = pageFlow.m.y;
                                        height = pageFlow.m.h; //pageIn.m.h - (pageIn.m.y - pageFlow.m.y);
                                    }

                                    // CHECK AGAINST EACH BOX
                                    for (var i1 = (iFound + 1); i1 < pageFlow.pageFlow.length; i1++) {
                                        var x1 = pageFlow.pageFlow[i1].m.x;
                                        var y1 = pageFlow.pageFlow[i1].m.y;
                                        var w1 = pageFlow.pageFlow[i1].m.w;
                                        var h1 = pageFlow.pageFlow[i1].m.h;

								
                                        if ((y1 <= y) && (x1 <= x) && ((y1 + h1) >= (y + height)) && ((x1 + w1) >= (x + width))) {
                                            outsideBox = true;
                                        }
                                    }
                                }
                            }

                        }
                    }
                }

                return outsideBox;
            },
			/*
			Opens a page partially.
			*/
            openShowPartial: function(newPageIn, pageFlowControllerIn, partialShownXIn, partialShownYIn, argsIn) {

                newPageIn.pageFlowController = pageFlowControllerIn;

                if (newPageIn.fullPageX == null) {
                    newPageIn.fullPageX = newPageIn.m.x;
                }
                if (newPageIn.fullPageY == null) {
                    newPageIn.fullPageY = newPageIn.m.y;
                }

                newPageIn.partialShownX = partialShownXIn;
                newPageIn.partialShownY = partialShownYIn;

                var pageFlowIn = newPageIn.m.parent;

                var previousPage = null;

                var hasPreviousPage = true;

                if (newPageIn.previousPage == null) {
                    hasPreviousPage = false;
                    if (pageFlowIn.pageFlow != null && pageFlowIn.pageFlow.length > 0) {
                        previousPage = pageFlowIn.pageFlow[pageFlowIn.pageFlow.length - 1];
                    }
                } else {
                    previousPage = newPageIn.previousPage;
                }

                newPageIn.previousPage = previousPage;

                newPageIn.shownX = newPageIn.partialShownX;
                newPageIn.shownY = newPageIn.partialShownY;

                for (var i = 0; i < pageFlowIn.m.widgets; i++) {
                   pageFlowIn.m.widgets[i].m.l = 1;
                }
                newPageIn.m.l = 2;

                mm.Pages.callOpenPageFunction(newPageIn);

                newPageIn.m.enabled = true;
                newPageIn.m.hidden = false;

                if (hasPreviousPage == false) {
                    pageFlowIn.pageFlow.push(newPageIn);
                }

                pageFlowControllerIn.openPage(pageFlowIn, previousPage, newPageIn);
            },
			/*
			Closes a page that is partially open.
			*/
            closePartial: function(currentPageIn, pageFlowControllerIn) {
            
                if (isNull(pageFlowControllerIn)) {
                    pageFlowControllerIn = currentPageIn.pageFlowController;
                }

                currentPageIn.partialShownX = null;
                currentPageIn.partialShownY = null;

                var previousPage = currentPageIn.previousPage;  //pageFlowIn.pageFlow.get(pageFlowIn.pageFlow.size() - 2);

                var pageFlowIn = currentPageIn.m.parent;

                for (var i = 0; i < pageFlowIn.m.widgets; i++) {
                    pageFlowIn.m.widgets[i].m.l = 1;
                }

                if (previousPage != null) {
                    previousPage.m.hidden = false;
                    previousPage.m.enabled = true;
                    previousPage.m.l = 2;
                }

                pageFlowIn.currentShownPage.m.enabled = false;

                currentPageIn.partialNowShown = false;

                pageFlowControllerIn.closePage(pageFlowIn, previousPage, currentPageIn);

             },
			 /*
			 Returns the page flow controller by its name.
			 */
             getPageFlowController: function(nameIn, timeoutIn, amountIn) {
                if (nameIn == "PAGE_FLOW_UP") {
                    return mm.Pages.initPageFlowUp(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_FLOW_DOWN") {
                    return mm.Pages.initPageFlowDown(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_FLOW_RIGHT") {
                    return mm.Pages.initPageFlowRight(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_FLOW_LEFT") {
                    return mm.Pages.initPageFlowLeft(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_FLOW_JUMP") {
                    return mm.Pages.initPageFlowJump();
                } else if (nameIn == "PAGE_SLIDE_UP") {
                    return mm.Pages.initPageSlideUp(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_SLIDE_DOWN") {
                    return mm.Pages.initPageSlideDown(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_SLIDE_RIGHT") {
                    return mm.Pages.initPageSlideRight(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_SLIDE_LEFT") {
                    return mm.Pages.initPageSlideLeft(timeoutIn, amountIn);
                } else if (nameIn == "PAGE_FADE_IN") {
                    return mm.Pages.initPageFadeIn(timeoutIn, amountIn);
                }
                
                return mm.Pages.initPageFlowJump();
             },
			 /*
			 Initialises the page flow up transition controller.
			 */
             initPageFlowUp: function(animationTimeoutIn, moveAmountIn) {
             
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageFlowUp.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageFlowUp.setMoveAmount(moveAmountIn);
                }
                var pageFlowUp = new mm.IPageFlowController(mm.PageFlowUp.openPage, mm.PageFlowUp.closePage);
                
                return pageFlowUp;
             },
			 /*
			 Initialises the page flow down transition controller.
			 */
             initPageFlowDown: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageFlowDown.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageFlowDown.setMoveAmount(moveAmountIn);
                }
                var pageFlowDown = new mm.IPageFlowController(mm.PageFlowDown.openPage, mm.PageFlowDown.closePage);
                
                
                return pageFlowDown;
             },
			 /*
			 Initialises the page flow right transition controller.
			 */
             initPageFlowRight: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageFlowRight.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageFlowRight.setMoveAmount(moveAmountIn);
                }
                var pageFlowRight = new mm.IPageFlowController(mm.PageFlowRight.openPage, mm.PageFlowRight.closePage);
                
                
                return pageFlowRight;
             },
			 /*
			 Initialises the page flow left transition controller.
			 */
             initPageFlowLeft: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageFlowLeft.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageFlowLeft.setMoveAmount(moveAmountIn);
                }
                var pageFlowLeft = new mm.IPageFlowController(mm.PageFlowLeft.openPage, mm.PageFlowLeft.closePage);
                
                
                return pageFlowLeft;
             },
			 /*
			 Initialises the page flow jump transition controller.
			 */
             initPageFlowJump: function() {
             
                var pageFlowJump = new mm.IPageFlowController(mm.PageFlowJump.openPage, mm.PageFlowJump.closePage);
                
                
                return pageFlowJump;
             },
			 /*
			 Initialises the page slide up transition controller.
			 */
             initPageSlideUp: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageSlideUp.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageSlideUp.setMoveAmount(moveAmountIn);
                }
                var pageSlideUp = new mm.IPageFlowController(mm.PageSlideUp.openPage, mm.PageSlideUp.closePage);
                
                return pageSlideUp;
             },
			 /*
			 Initialises the page slide down transition controller.
			 */
             initPageSlideDown: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageSlideDown.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageSlideDown.setMoveAmount(moveAmountIn);
                }
                var pageSlideDown = new mm.IPageFlowController(mm.PageSlideDown.openPage, mm.PageSlideDown.closePage);
                
                return pageSlideDown;
             },
			 /*
			 Initialises the page slide right transition controller.
			 */
             initPageSlideRight: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageSlideRight.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageSlideRight.setMoveAmount(moveAmountIn);
                }
                var pageSlideRight = new mm.IPageFlowController(mm.PageSlideRight.openPage, mm.PageSlideRight.closePage);
                
                return pageSlideRight;
             },
			 /*
			 Initialises the page slide left transition controller.
			 */
             initPageSlideLeft: function(animationTimeoutIn, moveAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageSlideLeft.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(moveAmountIn)) {
                    mm.PageSlideLeft.setMoveAmount(moveAmountIn);
                }
                var pageSlideLeft = new mm.IPageFlowController(mm.PageSlideLeft.openPage, mm.PageSlideLeft.closePage);
                
                return pageSlideLeft;
             },
			 /*
			 Initialises the page fade in transition controller.
			 */
             initPageFadeIn: function(animationTimeoutIn, fadeAmountIn) {
             
                if (!isNull(animationTimeoutIn)) {
                    mm.PageFadeIn.setAnimationTimeout(animationTimeoutIn);
                }
                if (!isNull(fadeAmountIn)) {
                    mm.PageFadeIn.setFadeAmount(fadeAmountIn);
                }
                var pageFadeIn = new mm.IPageFlowController(mm.PageFadeIn.openPage, mm.PageFadeIn.closePage);
                
                return pageFadeIn;
             },
			 /*
			 Called when a swipe right is detected.
			 */
             swipeRight: function(pageIn) {
                mm.Pages.swipe(pageIn, pageIn.swipeRightAction);
             },
			 /*
			 Called when a swipe left is detected.
			 */
             swipeLeft: function(pageIn) {
                mm.Pages.swipe(pageIn, pageIn.swipeLeftAction);
             },
			 /*
			 Called when a swipe up is detected.
			 */
             swipeUp: function(pageIn) {
                mm.Pages.swipe(pageIn, pageIn.swipeUpAction);
             },
			 /*
			 Called when a swipe down is detected.
			 */
             swipeDown: function(pageIn) {
                mm.Pages.swipe(pageIn, pageIn.swipeDownAction);
             },
			 /*
			 Calls the swipe action, when a swipe is detected.
			 */
             swipe: function(pageIn, swipeActionIn) {
             
                if (swipeActionIn != null) {
                    if (swipeActionIn.action != null) {
                        var swipeAction = mm.App.getFunction(swipeActionIn.action);
                        if (swipeAction != null) {
                            swipeAction(pageIn);
                        }
                    }
                    mm.Pages.navigatePageByClickAction(pageIn, swipeActionIn);
                }
             }

           };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page flow jump, opens and closes the pages with no animation effects.  The new
		page is just instantly drawn on top of the old page.
		
		*/
        PageFlowJump: (function() {
		            
              
            return {
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                    mm.App.repaint();
                    mm.Pages.afterOpenPage(pageFlowIn, previousPageIn, newPageIn);
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    mm.App.repaint();
                    mm.Pages.afterClosePage(pageFlowIn, previousPageIn, currentPageIn);
                }
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page flow up, opens and closes the pages with a animation that slides the new page up over the previous page.  
		The reverse happens when closing the page.
		
		*/
        PageFlowUp: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
                 animateUp: function() {
                 
                    timeOutRunning = null;
		
        
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y - moveAmount;

                    if (newPage.m.y < newPage.shownY) {
                        animateAgain = false;
                        newPage.m.y = newPage.shownY;
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowUp.animateUp()", animationTimeout);
                    } else {
                         mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
                animateDown: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y + moveAmount;

                    if (newPage.partialShownY != null) {
                        if (newPage.m.y >= newPage.partialShownY) {
                            animateAgain = false;
                            newPage.m.y = newPage.partialShownY;
                        }
                    } else {
                        if (newPage.m.y >= (pageFlow.m.y + pageFlow.m.h + 1)) {
                            animateAgain = false;
                            newPage.m.y = (pageFlow.m.y + pageFlow.m.h + 1);
                        }
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowUp.animateDown()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                
                    // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    newPageIn.m.y = pageFlowIn.m.y + pageFlowIn.m.h + 1;
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;

                    // START ANIMATION
                    mm.PageFlowUp.animateUp();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                
                
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageFlowUp.animateDown();
                    
                }
                     
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page flow down, opens and closes the pages with a animation that slides the new page down over the previous page.  
		The reverse happens when closing the page.
		
		*/
        PageFlowDown: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            
              
            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page up on each animation loop.
				 */
                 animateUp: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y - moveAmount;

                    if (newPage.partialShownY != null) {
                        if (newPage.m.y < newPage.partialShownY) {
                            animateAgain = false;
                            newPage.m.y = newPage.partialShownY;
                        }
                    } else {
                        if (newPage.m.y < (pageFlow.m.y - (newPage.m.h + 1))) {
                            animateAgain = false;
                            newPage.m.y = (pageFlow.m.y - (newPage.m.h + 1));
                        }
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowDown.animateUp()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page down on each animation loop.
				 */
                animateDown: function() {
                
                    timeOutRunning = null;
              
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y + moveAmount;
              
                    if (newPage.m.y >= newPage.shownY) {
                        animateAgain = false;
                        newPage.m.y = newPage.shownY;
                    }
              
                    mm.App.repaint();  // REDRAW ALL
              
                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowDown.animateDown()", animationTimeout);
                    } else {
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                    
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                    newPageIn.m.y = pageFlowIn.m.y - (newPageIn.m.h + 1);
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;

                    // START ANIMATION
                    mm.PageFlowDown.animateDown();
                    
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                
                
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageFlowDown.animateUp();
                }
                     
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page flow left, opens and closes the pages with a animation that slides the new page left over the previous page.  
		The reverse happens when closing the page.
		
		*/
        PageFlowLeft: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page left on each animation loop.
				 */
                 animateLeft: function() {
		
                    timeOutRunning = null;

                    var animateAgain = true;
                    newPage.m.x = newPage.m.x - moveAmount;

                    if (newPage.m.x < newPage.shownX) {
                        animateAgain = false;
                        newPage.m.x = newPage.shownX;
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowLeft.animateLeft()", animationTimeout);
                    } else {
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page right on each animation loop.
				 */
                animateRight: function() {
		
                    timeOutRunning = null;

                    var animateAgain = true;
                    newPage.m.x = newPage.m.x + moveAmount;
                    
                    if (newPage.partialShownX != null) {
                        if (newPage.m.x >= newPage.partialShownX) {
                            animateAgain = false;
                            newPage.m.x = newPage.partialShownX;
                        }
                    } else {
                        if (newPage.m.x >= (pageFlow.m.x + pageFlow.m.w + 1)) {
                            animateAgain = false;
                            newPage.m.x = (pageFlow.m.x + pageFlow.m.w + 1);
                        }
                    }

                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {

                        timeOutRunning = setTimeout("mm.PageFlowLeft.animateRight()", animationTimeout);

                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                    // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    newPageIn.m.x = pageFlowIn.m.x + pageFlowIn.m.w + 1;
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;

                    // START ANIMATION
                    mm.PageFlowLeft.animateLeft();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageFlowLeft.animateRight();
                }
                     
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page flow right, opens and closes the pages with a animation that slides the new page right over the previous page.  
		The reverse happens when closing the page.
		
		*/
        PageFlowRight: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            
              
            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page left on each animation loop.
				 */
                 animateLeft: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.x = newPage.m.x - moveAmount;

                    if (newPage.partialShownX != null) {
                        if (newPage.m.x < newPage.partialShownX) {
                            animateAgain = false;
                            newPage.m.x = newPage.partialShownX;
                        }
                    } else {
                        if (newPage.m.x < (pageFlow.m.x - (newPage.m.w + 1))) {
                            animateAgain = false;
                            newPage.m.x = (pageFlow.m.x - (newPage.m.w + 1));
                        }
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowRight.animateLeft()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page right on each animation loop.
				*/
                animateRight: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.x = newPage.m.x + moveAmount;
		
                    if (newPage.m.x >= newPage.shownX) {
                        animateAgain = false;
                        newPage.m.x = newPage.shownX;
                    }

                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFlowRight.animateRight()", animationTimeout);
                    } else {
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                    // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    newPageIn.m.x = pageFlowIn.m.x - (newPageIn.m.w + 1);
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;


                    // START ANIMATION
                    mm.PageFlowRight.animateRight();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageFlowRight.animateLeft();
                }
                     
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page slide up, opens and closes the pages with a animation that slides both the previous page and the new page up.  The
		new page takes the position of the previous page.
		The reverse happens when closing the page.
		
		*/
        PageSlideUp: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            
              
            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page up on each animation loop.
				 */
                 animateUp: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y - moveAmount;
                    previousPage.m.y = previousPage.m.y - moveAmount;

                    if (newPage.m.y < newPage.shownY) {
                        animateAgain = false;
                        newPage.m.y = newPage.shownY;
                        previousPage.m.y = (newPage.shownY - (previousPage.m.h));
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideUp.animateUp()", animationTimeout);
                    } else {
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page down on each animation loop.
				 */
                animateDown: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y + moveAmount;
                    previousPage.m.y = previousPage.m.y + moveAmount;
        
                    if (newPage.partialShownY != null) {
                        if (newPage.m.y >= newPage.partialShownY) {
                            animateAgain = false;
                            newPage.m.y = newPage.partialShownY;
                            previousPage.m.y = newPage.m.y - (previousPage.m.h);
                        }
                    } else {
                        if (newPage.m.y >= (pageFlow.m.y + pageFlow.m.h)) {
                            animateAgain = false;
                            newPage.m.y = (pageFlow.m.y + pageFlow.m.h);
                            previousPage.m.y = previousPage.shownY;
                        }
                    }		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideUp.animateDown()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                    if (newPageIn.partialNowShown == true) {
                        newPageIn.m.y = newPageIn.partialShownY;		
                    } else {
                        newPageIn.m.y = pageFlowIn.m.y + pageFlowIn.m.h;
                    }       
	
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    // SLIDE MUST HAVE A PREVIOUS PAGE, OTHERWISE USE SHOW.
                    previousPage = previousPageIn;

                    // START ANIMATION
                    mm.PageSlideUp.animateUp();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageSlideUp.animateDown();
                }
                     
            };
        })(),
        
        /*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page slide down, opens and closes the pages with a animation that slides both the previous page and the new page down.  The
		new page takes the position of the previous page.
		The reverse happens when closing the page.
		
		*/
        PageSlideDown: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page up on each animation loop.
				 */
                 animateUp: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y - moveAmount;
                    previousPage.m.y = previousPage.m.y - moveAmount;
		
                    if (newPage.partialShownY != null) {
                        if (newPage.m.y <= newPage.partialShownY) {
                            animateAgain = false;
                            newPage.m.y = newPage.partialShownY;
                            previousPage.m.y = newPage.m.y + (newPage.m.h);
                        }
                    } else {
                        if (newPage.m.y < (pageFlow.m.y - (newPage.m.h))) {
                            animateAgain = false;
                            newPage.m.y = (pageFlow.m.y - (newPage.m.h));
                            previousPage.m.y = previousPage.shownY;
                        }
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideDown.animateUp()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page down on each animation loop.
				 */
                animateDown: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.y = newPage.m.y + moveAmount;
                    previousPage.m.y = previousPage.m.y + moveAmount;

                    if (newPage.m.y >= newPage.shownY) {
                        animateAgain = false;
                        newPage.m.y = newPage.shownY;
                        previousPage.m.y = newPage.m.y + newPage.m.h;
                    }		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideDown.animateDown()", animationTimeout);
                    } else {
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                    // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    if (newPageIn.partialNowShown == true) {
                        newPageIn.m.y = newPageIn.partialShownY;		
                    } else {
                        newPageIn.m.y = pageFlowIn.m.y - (newPageIn.m.h);
                    }
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;

                    // START ANIMATION
                    mm.PageSlideDown.animateDown();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageSlideDown.animateUp();
                }
                     
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page slide right, opens and closes the pages with a animation that slides both the previous page and the new page right.  The
		new page takes the position of the previous page.
		The reverse happens when closing the page.
		
		*/
        PageSlideRight: (function() {
		
            var animationLoop = null;
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;

            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page left on each animation loop.
				 */
                 animateLeft: function() {
		
                    timeOutRunning = null;

                    var animateAgain = true;
                    newPage.m.x = newPage.m.x - moveAmount;
                    previousPage.m.x = previousPage.m.x - moveAmount;

                    if (newPage.partialShownX != null) {
                        if (newPage.m.x <= newPage.partialShownX) {
                            animateAgain = false;
                            newPage.m.x = newPage.partialShownX;
                            previousPage.m.x = newPage.m.x + (newPage.m.w);
                        }
                    } else {
                        if (newPage.m.x < (pageFlow.m.x - (newPage.m.w))) {
                            animateAgain = false;
                            newPage.m.x = (pageFlow.m.x - (newPage.m.w));
                            previousPage.m.x = previousPage.shownX;
                        }
                    }
		
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideRight.animateLeft()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page right on each animation loop.
				 */
                animateRight: function() {
		
                    timeOutRunning = null;

                    var animateAgain = true;
                    newPage.m.x = newPage.m.x + moveAmount;
                    previousPage.m.x = previousPage.m.x + moveAmount;

                    if (newPage.m.x >= newPage.shownX) {
                        animateAgain = false;
                        newPage.m.x = newPage.shownX;
                        previousPage.m.x = newPage.m.x + newPage.m.w;
                    }
                    
                    mm.App.repaint();  // REDRAW ALL
                
                    if (animateAgain == true) {
                    
                        timeOutRunning = setTimeout("mm.PageSlideRight.animateRight()", animationTimeout);

                    } else {
                   
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {

                    // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    if (newPageIn.partialNowShown == true) {
                        newPageIn.m.x = newPageIn.partialShownX;		
                    } else {
                        newPageIn.m.x = pageFlowIn.m.x - (newPageIn.m.w);
                    }
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
                    

                    // START ANIMATION
                    mm.PageSlideRight.animateRight();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageSlideRight.animateLeft();
                }
                     
            };
        })(),
        
		/*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page slide left, opens and closes the pages with a animation that slides both the previous page and the new page left.  The
		new page takes the position of the previous page.
		The reverse happens when closing the page.
		
		*/
        PageSlideLeft: (function() {
		
            var timeOutRunning = null;
            var animationTimeout = 2;
            var moveAmount = 20;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;
              
            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setMoveAmount: function(moveAmountIn) {
                    moveAmount = moveAmountIn;
                 },
				 /*
				 Called to animate the page left on each animation loop.
				 */
                 animateLeft: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.x = newPage.m.x - moveAmount;
                    previousPage.m.x = previousPage.m.x - moveAmount;
		
                    if (newPage.m.x < newPage.shownX) {
                        animateAgain = false;
                        newPage.m.x = newPage.shownX;
                        previousPage.m.x = (newPage.m.x - (previousPage.m.w));
                    }

		            mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideLeft.animateLeft()", animationTimeout);
                    } else {
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page right on each animation loop.
				 */
                animateRight: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.m.x = newPage.m.x + moveAmount;
                    previousPage.m.x = previousPage.m.x + moveAmount;

                    if (newPage.partialShownX != null) {
                        if (newPage.m.x >= newPage.partialShownX) {
                            animateAgain = false;
                            newPage.m.x = newPage.partialShownX;
                            previousPage.m.x = newPage.m.x - (previousPage.m.w);
                        }
                    } else {
                        if (newPage.m.x >= (pageFlow.m.x + pageFlow.m.w)) {
                            animateAgain = false;
                            newPage.m.x = (pageFlow.m.x + pageFlow.m.w);
                            previousPage.m.x = previousPage.shownX;
                        }
                    }

                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageSlideLeft.animateRight()", animationTimeout);
                    } else {
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                     // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    if (newPageIn.partialNowShown == true) {
                        newPageIn.m.x = newPageIn.partialShownX;		
                    } else {
                        newPageIn.m.x = pageFlowIn.m.x + pageFlowIn.m.w;
                    }
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
                    
            
                    // START ANIMATION
                    mm.PageSlideLeft.animateLeft();
                },
				/*
				Implements the IPageFlowController.closePage.
				
				Responsible for closing the page.
				*/
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
		
                    // START ANIMATION
                    mm.PageSlideLeft.animateRight();
                }
                     
            };
        })(),


        /*
		This module implements the IPageFlowController interface.
		
		This is used to transition from one page to another page within a page flow.
		This handles the transition of both opening and closing the page.
		
		The page fade in, opens and closes the pages with a animation that fades the new page over the previous page using transparency. 
		
		The reverse happens when closing the page.
		
		*/
        PageFadeIn: (function() {
		
           
            var timeOutRunning = null;
            var animationTimeout = 2;
            var fadeAmount = 1;
            var newPage = null;
            var pageFlow = null;
            var previousPage = null;
            var maxTranspency = 255;
            
              
            return {
                 setAnimationTimeout: function(animationTimeoutIn) {
                    animationTimeout = animationTimeoutIn;
                 },
                 setFadeAmount: function(fadeAmountIn) {
                    fadeAmount = fadeAmountIn;
                 },
				 /*
				 Called to animate the page fade in on each animation loop.
				 */
                 fadeIn: function() {
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.s.transparency = newPage.s.transparency + fadeAmount;
                  
                    if (newPage.s.transparency >= maxTranspency) {
                        animateAgain = false;
                    }

		            mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFadeIn.fadeIn()", animationTimeout);
                    } else {
                        newPage.s.transparency = newPage.transparency;
                        mm.Pages.afterOpenPage(pageFlow, previousPage, newPage);
                    }
                },
				/*
				 Called to animate the page fade out on each animation loop.
				 */
                fadeOut: function() {
		
                    timeOutRunning = null;
		
                    var animateAgain = true;
                    newPage.s.transparency = newPage.s.transparency - fadeAmount;
                    if (newPage.s.transparency < - 1) {
                        newPage.s.transparency = -1;
                    }
                    
                    if (newPage.s.transparency < 1) {
                        animateAgain = false;
                    }
                    mm.App.repaint();  // REDRAW ALL

                    if (animateAgain == true) {
                        timeOutRunning = setTimeout("mm.PageFadeIn.fadeOut()", animationTimeout);
                    } else {
                        newPage.s.transparency = newPage.transparency;
                        newPage.transparency = -1;
                        mm.Pages.afterClosePage(pageFlow, previousPage, newPage);
                        //newPage.s.transparency = newPage.transparency;
                    }
                },
				/*
				Implements the IPageFlowController.openPage.
				
				Responsible for opening the page.
				*/
                openPage: function(pageFlowIn, previousPageIn, newPageIn) {
                
                    // SET THE NEW PAGE, UNDERNEATH THE CURRENT PAGE
                    newPage = newPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
                    newPage.transparency = newPage.s.transparency;
                    
                    if (newPage.s.transparency == -1) {
                        maxTranspency = 255;
                    } else {
                        maxTranspency = newPage.s.transparency;
                    }
                    
                    newPage.s.transparency = -1;

                    // START ANIMATION
                    mm.PageFadeIn.fadeIn();
                },
                closePage: function(pageFlowIn, previousPageIn, currentPageIn) {
                    newPage = currentPageIn;
                    pageFlow = pageFlowIn;
                    previousPage = previousPageIn;
                    
                    newPage.transparency = newPage.s.transparency;
                    
                    if (newPage.s.transparency == -1) {
                        maxTranspency = 255;
                    } else {
                        maxTranspency = newPage.s.transparency;
                    }
                    newPage.s.transparency = maxTranspency;
                    
                    // START ANIMATION
                    mm.PageFadeIn.fadeOut();
                }
                     
            };
        })(),

      
      /*
        ++
        This module contains all the functions for reading the xml files and converting them to the model.
		
		Generally used for internal use only.
		
		It handles the:
		
			- common.xml
			- pages.xml
			- messages.xml
	  */
      XML: (function() {
		
            var commonWidgets = null;
            
            var pageFlowsXML = null;  // HASH TABLE [id, pageFlowXMLText] - STORES THE TEXT IF PRE-LOAD == null, THEN CAN BE AUTOMATICALLY CALLED ON page.init
            
            // USED FOR PRE-LOAD IMAGES.  THIS IS IMPORTANT FOR iPHONE.
            var preLoadImages = null;  // PROPERTIES OF THE ACTUAL PRE-LOAD IMAGES.
            
            // STORES THE MESSAGES
            var messages = {};
            
              
            return {
				/*
				This reads and loads the common xml file.  When completed the callback is called.
				*/
                initXML: function(xmlConfigFileIn, callback) {
                
                    commonWidgets = new Array();
            
                    mm.XML.loadCommonXML(xmlConfigFileIn, function() {
                        callback(); // CALLBACK ONLY WHEN PROCESSING IS COMPLETE
                    });
                
                },
				/*
				This reads and loads the common xml file.  When completed the callback is called.
				*/
                loadCommonXML: function(xmlConfigFileIn, callback) {
                    
                    $.ajax({
                        type: "GET",
                        url: xmlConfigFileIn,
                        datatype: "XML",
                        success: function(xml) {
                            mm.XML.readCommonWidgets(xml);
                            
                            callback();
                        }
                    });
                },
				/*
				Reads the common widgets.
				*/
                readCommonWidgets: function(xmlIn) {
                    $(xmlIn).find("CommonWidgets").find("WidgetSection").each(function() {
                        mm.XML.readCommonWidgets(this);
                    });
                },
				/*
				Reads the common widgets in the "WidgetSection"
				*/
                readCommonWidgets: function(xmlIn) {
                    var preLoad = $(xmlIn).find("PreLoad").first().text();
                    
                    if (preLoad == "True") {
                        mm.XML.readAllWidgets(xmlIn, commonWidgets);
                    }
                },
				/*
				Reads all the widgets in the "SectionWidgets"
				*/
                readAllWidgets: function(xmlIn, widgetsIn) {
                    $(xmlIn).find("SectionWidgets").each(function() {
                        mm.XML.readEachWidget(this, widgetsIn);
                    });
                },
				/*
				Reads each widget.
				*/
                readEachWidget: function(xmlIn, widgetsIn) {
                    $(xmlIn).children().each(function() {
                        mm.XML.readWidget(this, widgetsIn);
                    });
                },
				/*
				Initialises the widget class.
				*/
                initWidgetClass: function(idIn, classIn, widgetsIn) {
                    var widget = null;
              
                    // FIRST SEE IF IT EXISTS IN THE WIDGETS IN, ID MUST MATCH
                    if (idIn != null) {
                        var i = 0;
              
                        while (i<widgetsIn.length && widget == null) {
                            if (widgetsIn[i].id != null && widgetsIn[i].id == idIn) {
                                widget = widgetsIn[i]; //mm.XML.deepCopyWidgetClass(widgetsIn[i].id, widgetsIn[i]);
                            }
              
                            i = i + 1;
                        }
                    }
              
                    if (widget == null) {
                        if (mm.FW.isStandardClass(classIn) == true) {
                            widget = new mm.WidgetClass(idIn);  // IN COMMON MUST HAVE ID
                            widget.className = classIn;
                        } else {
                            // NOT A STANDARD WIDGET CLASS, HAS TO BE COPIED FROM COMMON
                            var commonWidgetClass = mm.XML.findCommonWidgetClass(classIn);
                            widget = mm.XML.deepCopyWidgetClass(idIn, commonWidgetClass);
                        }
                    }
                    return widget;
                },
				/*
				Creates a deep copy of the widget class.
				*/
                deepCopyWidgetClass: function(idIn, commonWidgetClass) {
              
                    var widget = new mm.WidgetClass(idIn);
                    widget.className = commonWidgetClass.className;
              
                    // COPY ALL THE PROPERTIES
                    for (var tagName in commonWidgetClass.properties) {
                        if (commonWidgetClass.properties.hasOwnProperty(tagName)) {
                            if (tagName == "STYLE") {
                                widget.properties[tagName] = mm.XML.copyStyle(commonWidgetClass.properties[tagName]);
                            } else if (tagName == "CLICK" || tagName == "SWIPEUP" || tagName == "SWIPEDOWN" || tagName == "SWIPELEFT" || tagName == "SWIPERIGHT" ) {
                                widget.properties[tagName] = mm.XML.copyClick(commonWidgetClass.properties[tagName]);
                            } else if (tagName == "STAGES") {
                                widget.properties[tagName] = mm.XML.copyStages(commonWidgetClass.properties[tagName]);
                            } else if (tagName == "MOVABLE") {
                                widget.properties[tagName] = mm.XML.copyMovable(commonWidgetClass.properties[tagName]);
                            } else if (tagName == "MOVEOVER") {
                                widget.properties[tagName] = mm.XML.copyMoveOverArray(commonWidgetClass.properties[tagName]);
                            } else {
                                widget.properties[tagName] = commonWidgetClass.properties[tagName];
                            }

                        }
                    }
              
                    // COPY ALL OF THE WIDGETS
                    if (commonWidgetClass.widgets != null) {
                        widget.widgets = new Array();
                        for (var i=0;i<commonWidgetClass.widgets.length;i++) {
                            
                            var newWidget = mm.XML.deepCopyWidgetClass(commonWidgetClass.widgets[i].id, commonWidgetClass.widgets[i]);  // RECURSIVE
                            widget.widgets.push(newWidget);
                        }
                    }
              
                    // COPY ALL OF THE TEXTS
                    if (commonWidgetClass.texts != null) {
                        widget.texts = new Array();
                        for (var i=0;i<commonWidgetClass.texts.length;i++) {
                            
                            var newWidget = mm.XML.deepCopyWidgetClass(commonWidgetClass.texts[i].id, commonWidgetClass.texts[i]);  // RECURSIVE
                            widget.texts.push(newWidget);
                        }
                    }
              
                    return widget;
              
                },
				/*
				Returns a common widget class, but its id.
				*/
                findCommonWidgetClass: function(classIn) {
            
                    for (var i=0;i<commonWidgets.length;i++) {
                        if (commonWidgets[i].id == classIn) {
                            return commonWidgets[i];
                        }
                    }
              
                    console.log("ERROR: Type not found " + classIn);
                    return null;
                },
				/*
				Main method for reading a widget.
				*/
                readWidget: function(widgetIn, widgetsIn) {
            
                    var include = $(widgetIn).children("Include").first().text();
                    if (!isNull(include) && include.length > 0) {
                        // IF IT CONTAINS AN INCLUDE THEN IGNORE THIS WIDGET,
                        // THE ACTUAL WIDGET WILL HAVE ALREADY BEEN PRE-LOADED.
                    } else {
      
                        var id = $(widgetIn).children('Id').first().text();
                        var className = $(widgetIn).children('Class').first().text();
              
                        // GENERATE THE ID, IF IT DOES NOT EXIST
                        if (id == null || id.length < 1) {
                            id = className + mm.FW.getNextId();
                        }
              
                        var widget = new mm.XML.initWidgetClass(id, className, widgetsIn);  // IN COMMON MUST HAVE ID
                    
                        // LOOP THROUGH AND GET THE OTHER TAGS
                        $(widgetIn).children().each(function() {
                            var tagName = $(this).get(0).tagName.toUpperCase();
                            if (tagName == "STYLE") {
                                var style = null;
                                if (widget.properties.hasOwnProperty("STYLE")) {
                                    style = widget.properties["STYLE"];
                                } else {
                                    style = new mm.WidgetStyle();
                                }
                                mm.XML.readStyle($(this).get(0), style);
                                widget.properties[tagName] = style;
                            
                            } else if (tagName == "CLICK" || tagName == "SWIPEUP" || tagName == "SWIPEDOWN" || tagName == "SWIPELEFT" || tagName == "SWIPERIGHT" ) {
                                var click = null;
                                if (widget.properties.hasOwnProperty("CLICK")) {
                                    click = widget.properties["CLICK"];
                                } else {
                                    click = new mm.WidgetClick();
                                }
                                mm.XML.readClick($(this).get(0), click);
                                widget.properties[tagName] = click;
                            } else if (tagName == "MOVABLE") {
                                var movable = null;
                                if (widget.properties.hasOwnProperty("MOVABLE")) {
                                    movable = widget.properties["MOVABLE"];
                                } else {
                                    movable = new mm.Movable();
                                }
                                mm.XML.readMovable($(this).get(0), movable);
                                widget.properties[tagName] = movable;
                            } else if (tagName == "MOVEOVER") {
                                var moveOver = null;
                                if (widget.properties.hasOwnProperty("MOVEOVER")) {
                                    moveOver = widget.properties["MOVEOVER"];
                                } else {
                                    moveOver = new Array();
                                }
                                mm.XML.readMoveOverArray($(this).get(0), moveOver);
                                widget.properties[tagName] = moveOver;
                            } else if (tagName == "STAGES") {
                                var stages = null;
                                if (widget.properties.hasOwnProperty("STAGES")) {
                                    stages = widget.properties["STAGES"];
                                } else {
                                    stages = new mm.WidgetStages();
                                }
                                mm.XML.readStages($(this).get(0), stages);
                                widget.properties[tagName] = stages;
                            } else if (tagName == "WIDGETS") {
                                if (widget.widgets == null) {  // COULD HAVE BEEN CREATED ALREADY IN DEEP COPY
                                    widget.widgets = new Array();
                                }
                            
                                $(this).children().each(function() {
                                    mm.XML.readWidget(this, widget.widgets);  // RECURSIVE
                                });
                            
                            } else if (tagName == "TEXTS") {
                                if (widget.texts == null) {  // COULD HAVE BEEN CREATED ALREADY IN DEEP COPY
                                    widget.texts = new Array();
                                }
                            
                                $(this).children().each(function() {
                                    mm.XML.readWidget(this, widget.texts);  // RECURSIVE
                                });
                                
                            } else if (tagName == "INPUTTEXT") {  // USED FOR INPUT
                        
                                var textArray = new Array();
                            
                                $(this).children().each(function() {
                                    mm.XML.readWidget(this, textArray);  // RECURSIVE
                                });
                            
                            
                                if (textArray.length > 0) {  // CAN ONLY BE 1 or less
                                    widget.properties[tagName] = textArray[0];
                                }
                            
                            } else if (tagName == "COLLISIONDETECTION") {
                                widget.collisionDetection = mm.XML.readCollisionDetection(this);
                            } else {
                                widget.properties[tagName] = $(this).text();
                            
                                if (tagName == "PRELOAD") {
                                    widget.preLoad = mm.XML.getBoolean(widget, "PRELOAD");
                                }
                            }
                        });

                        // FIRST SEE IF IT EXISTS IN THE WIDGETS IN, IF IT EXISTS DO NOT ADD IT AGAIN
                        var found = false;
                        if (widget.id != null) {
                            var i = 0;
              
                            while (i<widgetsIn.length && found == false) {
                                if (widgetsIn[i].id != null && widgetsIn[i].id == widget.id) {
                                    found = true;
                                }
              
                                i = i + 1;
                            }
                        }
              
                        if (found == false) {
                            widgetsIn.push(widget);
                        }
              
                        // FOR IMAGES CHECK FOR PRE-LOAD IMAGES
                        // ADD TO PRE-LOAD IMAGE LIST
                        if (preLoadImages != null) {
                            if (widget.className == "Image") {
                                var preLoadImage = mm.XML.getBoolean(widget, "PreLoadImage");
                                if (preLoadImage != null && preLoadImage == true) {
                                    preLoadImages.push(mm.XML.deepCopyWidgetClass(widget.id, widget));
                                }
                            }
                        }
              
                    }
                },
				/*
				Reads the widget style.
				*/
                readStyle: function(xmlIn, style) {
                    
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "COLOUR") {
                            style.colour = $(this).text();
                        } else if (tagName == "BORDERW") {
                            style.borderW = $(this).text();
                        } else if (tagName == "BORDERCOLOUR") {
                            style.borderColour = $(this).text();
                        } else if (tagName == "ROUNDED") {
                            style.rounded = mm.XML.readBoolean($(this).text());
                        } else if (tagName == "TRANSPARENCY") {
                            style.transparency = mm.XML.readInt($(this).text());
                        } else if (tagName == "GRADIENT") {
                            style.gradient = mm.XML.readGradient($(this));
                        }
                        
                    });
                    
                    return true;
                },
                /*
				Reads animation collisions.
                */
                readCollisionDetection: function(xmlIn) {
            
                    var collisionDetection = new mm.CollisionDetection();
            
                    $(xmlIn).children().each(function() {
                    
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "COLLISIONTYPES") {
                            collisionDetection.collisionTypes = mm.XML.readCollisionTypes($(this));
                        } else if (tagName == "COLLISIONS") {
                            collisionDetection.collisions = mm.XML.readCollisions($(this));
                        }
                    
                    });
            
                    return collisionDetection;
            
            
                },
				/*
				Read collision types.
				*/
                readCollisionTypes: function(xmlIn) {
            
                    var collisionTypes = new Array();
            
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                    
                        
                        if (tagName == "COLLISIONRECTANGLETYPE") {
                            collisionTypes.push(mm.XML.readCollisionRectangleType($(this)));
                        } else if (tagName == "COLLISIONCIRCLETYPE") {
                            collisionTypes.push(mm.XML.readCollisionCircleType($(this)));
                        }
                    });
            
                    return collisionTypes;
            
                },
				/*
				Read collision rectangle type.
				*/
                readCollisionRectangleType: function(xmlIn) {
            
                    var collisionType = mm.CollisionType(null, "RECTANGLE", new Array());
            
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "ID") {
                            collisionType.id = $(this).text();
                        } else if (tagName == "TYPE") {
                            collisionType.type = $(this).text();
                        } else if (tagName == "ZONES") {
                            $(this).children().each(function() {
                                collisionType.collisionZones.push(mm.XML.readCollisionRectangleZone($(this)));
                            });
                        }
                    
                    });
            
                    return collisionType;
            
                },
				/*
				Reads the collision rectangle zone.
				*/
                readCollisionRectangleZone: function(xmlIn) {
            
                    var zone = mm.CollisionRectangleZone(null, null, null, null);
            
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "X") {
                            zone.x = mm.XML.readInt($(this).text());
                        } else if (tagName == "Y") {
                            zone.y = mm.XML.readInt($(this).text());
                        } else if (tagName == "W") {
                            zone.w = mm.XML.readInt($(this).text());
                        } else if (tagName == "H") {
                            zone.h = mm.XML.readInt($(this).text());
                        }
                        
                    });
            
                    return zone;
            
                },
				/*
				Reads the collision circle type.
				*/
                readCollisionCircleType: function(xmlIn) {
            
                    var collisionType = mm.CollisionType(null, "CIRCLE", new Array());
            
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "ID") {
                            collisionType.id = $(this).text();
                        } else if (tagName == "TYPE") {
                            collisionType.type = $(this).text();
                        } else if (tagName == "ZONES") {
                            $(this).children().each(function() {
                                collisionType.collisionZones.push(mm.XML.readCollisionCircleZone($(this)));
                            });
                        }
                    
                    });
            
                    return collisionType;
                },
				/*
				Reads collision circle zone.
				*/
                readCollisionCircleZone: function(xmlIn) {
            
                    var zone = mm.CollisionCircleZone(null, null, null);
            
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "X") {
                            zone.x = mm.XML.readInt($(this).text());
                        } else if (tagName == "Y") {
                            zone.y = mm.XML.readInt($(this).text());
                        } else if (tagName == "RADIUS") {
                            zone.radius = mm.XML.readInt($(this).text());
                        }
                        
                    });
            
                    return zone;
            
                },
				/*
				Read the collisions.
				*/
                readCollisions: function(xmlIn) {
                    var collisions = new Array();
            
                    $(xmlIn).children().each(function() {
                    
                        var collision = new mm.Collision(null, null, null);
                    
                        $(this).children().each(function() {
                        
                            var tagName = $(this).get(0).tagName.toUpperCase();
                        
                            if (tagName == "TYPEA") {
                                collision.collisionTypeA = $(this).text();
                            } else if (tagName == "TYPEB") {
                                collision.collisionTypeB = $(this).text();
                            } else if (tagName == "ACTION") {
                                collision.collisionAction = new mm.WidgetFunction($(this).text(), null);
                            }
                        });
                        
                        collisions.push(collision);
                    });
            
                    return collisions;

                },
                /*
                END TO READ ANIMATION COLLISIONS
                */
                /*
                ++
                Reads the gradiant that is part of the style widget.
                */
                readGradient: function(xmlIn) {
              
                    var gradient = new mm.Gradient();
              
                     $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "COLOURS") {
                            gradient.colours = mm.XML.readGradientColours($(this));
                        } else if (tagName == "STARTX") {
                            gradient.startX = mm.XML.readInt($(this).text());
                        } else if (tagName == "STARTY") {
                            gradient.startY = mm.XML.readInt($(this).text());
                        } else if (tagName == "ENDX") {
                            gradient.endX =mm.XML.readInt($(this).text());
                        } else if (tagName == "ENDY") {
                            gradient.endY = mm.XML.readInt($(this).text());
                        }
                        
                    });
              
                    return gradient;
                },
                /*
                ++
				Reads the gradient colours as used in the style widget.
                */
                readGradientColours: function(xmlIn) {
              
                    var gradientColours = new Array();
              
                    $(xmlIn).children().each(function() {
                    
                        // LOOP THROUGH COLOUR
                    
                        var gradientColour = new mm.GradientColour();
                        
                        var pos = $(this).attr('pos');
                        if (pos != null && pos.length > 0) {
                            gradientColour.pos = parseInt(pos);
                        }
                    
                        gradientColour.colour = $(this).text();
                        
                        gradientColours.push(gradientColour);
                    });
                    
                    return gradientColours;
                },
				/*
				Returns a new copy of the style.
				*/
                copyStyle: function(styleIn) {
                    var style = new mm.WidgetStyle();
                    style.colour = styleIn.colour;
                    style.borderW = styleIn.borderW;
                    style.borderColour = styleIn.borderColour;
                    style.rounded = styleIn.rounded;
                    style.transparency = styleIn.transparency;
                    style.gradient = mm.XML.copyGradient(styleIn.gradient);
                    return style;
                },
				/*
				Returns a new copy of the gradient.
				*/
                copyGradient: function(gradientIn) {
              
                    var gradient = null;
              
                    if (gradientIn != null) {
                        gradient = new mm.Gradient();
                        gradient.startX = gradientIn.startX;
                        gradient.startY = gradientIn.startY;
                        gradient.endX = gradientIn.endX;
                        gradient.endY = gradientIn.endY;
                        
                        gradient.colours = mm.XML.copyGradientColours(gradientIn.colours);
                        
                    }
              
                    return gradient;
                },
				/*
				Returns a copy of the gradient colours.
				*/
                copyGradientColours: function(coloursIn) {
              
                    var gradientColours = new Array();
              
                    if (coloursIn != null) {
              
                        for (var i=0;i<coloursIn.length;i++) {
                            var colour = new mm.GradientColour();
                            colour.pos = coloursIn[i].pos;
                            colour.colour = coloursIn[i].colour;
              
                            gradientColours.push(colour);
                        }
              
                    }
                    
                    return gradientColours;
                },
				/*
				Reads the stages.
				*/
                readStages: function(xmlIn, stage) {
            
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "INIT") {
                            stage.init = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "OPENPAGE") {
                            stage.openPage = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "REDRAW") {
                            stage.redraw = new mm.WidgetFuntion($(this).text(), null);
                        } else if (tagName == "AFTEROPEN") {
                            stage.afterOpen = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "CLOSE") {
                            stage.close = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "AFTERCLOSE") {
                            stage.afterClose = new mm.WidgetFunction($(this).text(), null);
                        }
                        
                    });
                    
                    return true;
                },
				/*
				Returns a new copy of the stage.
				*/
                copyStages: function(stageIn) {
                    var stage = new mm.WidgetStages();
                    if (stageIn.init != null) {
                        stage.init = new mm.WidgetFunction(stageIn.init.name, null);
                    }
                    if (stageIn.openPage != null) {
                        stage.openPage = new mm.WidgetFunction(stageIn.openPage.name, null);
                    }
                    if (stageIn.redraw != null) {
                        stage.redraw = new mm.WidgetFunction(stageIn.redraw.name, null);
                    }
                    if (stageIn.afterOpen != null) {
                        stage.afterOpen = new mm.WidgetFunction(stageIn.afterOpen.name, null);
                    }
                    if (stageIn.close != null) {
                        stage.close = new mm.WidgetFunction(stageIn.close.name, null);
                    }
                    if (stageIn.afterClose != null) {
                        stage.afterClose = new mm.WidgetFunction(stageIn.afterClose.name, null);
                    }
                    return stage;
                },
				/*
				Reads a click action.
				*/
                readClick: function(xmlIn, click) {
              
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "ACTION") {
                            click.action = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "NAVIGATION") {
                            click.navigation = $(this).text();
                        } else if (tagName == "CLOSEPAGE") {
                            click.closePage = mm.XML.readBoolean($(this).text());
                        } else if (tagName == "NAVIGATIONPARTIALX") {
                            click.navigationPartialX = mm.XML.readInt($(this).text());
                        } else if (tagName == "NAVIGATIONPARTIALY") {
                            click.navigationPartialY = mm.XML.readInt($(this).text());
                        }
                        
                    });
                    
                    return true;
                },
				/*
				Reads movable.
				*/
                readMovable: function(xmlIn, movable) {
              
                    $(xmlIn).children().each(function() {
                        
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "MOVABLE") {
                            movable.movable = mm.XML.readBoolean($(this).text());
                        } else if (tagName == "MOVEX") {
                             movable.moveX = mm.XML.readBoolean($(this).text());
                        } else if (tagName == "MOVEY") {
                             movable.moveY = mm.XML.readBoolean($(this).text());
                        } else if (tagName == "MINY") {
                             movable.minY = mm.XML.readInt($(this).text());
                        } else if (tagName == "MINX") {
                             movable.minX = mm.XML.readInt($(this).text());
                        } else if (tagName == "MAXY") {
                             movable.maxY = mm.XML.readInt($(this).text());
                        } else if (tagName == "MAXX") {
                             movable.minX = mm.XML.readInt($(this).text());
                        }
                        
                    });
                    
                    return true;
                },
				/*
				Reads move over array.
				*/
                readMoveOverArray: function(xmlIn, moveOverArray) {
            
                    $(xmlIn).children().each(function() {
                    
                        var moveOver = new mm.MoveOver();
                        
                        mm.XML.readMoveOver($(this), moveOver);
                        
                        moveOverArray.push(moveOver);
                    });
                    
                    return true;
                },
				/*
				Reads move over.
				*/
                readMoveOver: function(xmlIn, moveOver) {
              
                    $(xmlIn).children().each(function() {
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        
                        if (tagName == "SOURCETYPE") {
                            moveOver.sourceType = $(this).text();
                        } else if (tagName == "MOVEDROPACTION") {
                            moveOver.moveDropAction = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "MOVEOVERACTION") {
                            moveOver.moveOverAction = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "MOVEOUTOVERACTION") {
                            moveOver.moveOutOverAction = new mm.WidgetFunction($(this).text(), null);
                        } else if (tagName == "MOVEMENTTYPE") {
                            moveOver.movementType = $(this).text();
                        }
                        
                    });
                    
                    return true;
                },
				/*
				Returns a copy of the move over array.
				*/
                copyMoveOverArray: function(moveOverArrayIn) {
            
                    moveOverArray = new Array();
                    for (var i=0;i<moveOverArrayIn.length;i++) {
                        var moveOver = new mm.MoveOver();
                        moveOver.sourceType = moveOverArrayIn[i].sourceType;
                        if (moveOverArrayIn[i].moveDropAction != null) {
                            moveOver.moveDropAction = new mm.WidgetFunction(moveOverArrayIn[i].moveDropAction.name, null);
                        }
                        if (moveOverArrayIn[i].moveOverAction != null) {
                            moveOver.moveOverAction = new mm.WidgetFunction(moveOverArrayIn[i].moveOverAction.name, null);
                        }
                        if (moveOverArrayIn[i].moveOutOverAction != null) {
                            moveOver.moveOutOverAction = new mm.WidgetFunction(moveOverArrayIn[i].moveOutOverAction.name, null);
                        }
                        moveOver.movementType = moveOverArrayIn[i].movementType;
                        moveOverArray.push(moveOver);
                    }
              
              
                    return moveOverArray;
                },
				/*
				Returns a copy of movable.
				*/
                copyMovable: function(widIn) {
                    var wid = new mm.Movable();
                    wid.movable = widIn.movable;
                    wid.moveX = widIn.moveX;
                    wid.moveY = widIn.moveY;
                    wid.minY = widIn.minY;
                    wid.minX = widIn.minX;
                    wid.maxX = widIn.maxX;
                    wid.maxY = widIn.maxY;
                    return wid;
                },
				/*
				Returns a copy of the click action.
				*/
                copyClick: function(clickIn) {
                    var click = new mm.WidgetClick();
                    if (clickIn.action != null) {
                        click.action = new mm.WidgetFunction(clickIn.action.name, null);
                    }
                    click.closePage = clickIn.closePage;
                    click.navigation = clickIn.navigation;
                    click.navigationPartialX = clickIn.navigationPartialX;
                    click.navigationPartialY = clickIn.navigationPartialY;
                    return click;
                },
                getString: function(styleIn, propertyNameIn) {
                    var value = styleIn.properties[propertyNameIn.toUpperCase()];
                    if (isNull(value) || value.length <= 0) {
                        return null;
                    }
                    return value;
                },
                getArray: function(styleIn, propertyNameIn) {
                    var value = styleIn.properties[propertyNameIn.toUpperCase()];
                    if (isNull(value) || value.length <= 0) {
                        return null;
                    }
                    return value;
                },
                getClass: function(styleIn, propertyNameIn) {
                    var value = styleIn.properties[propertyNameIn.toUpperCase()];
                    if (isNull(value) || value.length <= 0) {
                        return null;
                    }
                    return value;
                },
                getInt: function(styleIn, propertyNameIn) {
                    var intValue = null;
                    var value = styleIn.properties[propertyNameIn.toUpperCase()];
                    if (!isNull(value) && value.length > 0) {
                        intValue = parseInt(value);
                    } 
                    return intValue;
                },
                readInt: function(textIn) {
                    var intValue = null;
                    var value = textIn;
                    if (!isNull(value) && value.length > 0) {
                        intValue = parseInt(value);
                    } 
                    return intValue;
                },
                getFloat: function(styleIn, propertyNameIn) {
                    var floatValue = null;
                    var value = styleIn.properties[propertyNameIn.toUpperCase()];
                    if (!isNull(value) && value.length > 0) {
                        floatValue = parseFloat(value);
                    } 
                    return floatValue;
                }, 
                getBoolean: function(styleIn, propertyNameIn) {
                    var booleanValue = null;
                    var value = styleIn.properties[propertyNameIn.toUpperCase()];
                    if (!isNull(value)) {
                        if (value.toUpperCase() == "TRUE" || value == "1") {
                            booleanValue = true;
                        } else if (value.toUpperCase() == "FALSE" || value == "0") {
                            booleanValue = false;
                        }
                    }
                    return booleanValue;
                },
                readBoolean: function(textIn) {
                    var booleanValue = null;
                    if (!isNull(textIn)) {
                        if (textIn.toUpperCase() == "TRUE" || textIn == "1") {
                            booleanValue = true;
                        } else if (textIn.toUpperCase() == "FALSE" || textIn == "0") {
                            booleanValue = false;
                        }
                    }
                    return booleanValue;

                },
                getPreLoadedImageById: function(idIn) {
                    var image = null;
                    var i = 0;
                    while (image == null && i < preLoadImages.length) {
              
                        if (preLoadImages[i].id == idIn) {
                            image = preLoadImages[i].image;
                        }
                        i = i + 1;
                    }
                    return image;
                },
                /*
				Reads and creates page flow widget from the page flow xml file.
				*/
                initPageFlowXML: function(pageFlowFileIn, callback) {
            
                    pageFlowsXML = {};  // HERE WE STORE ALL THE pageFlowsXML TEXT for reuse later.
              
                    preLoadImages = new Array();  // SET PRE LOADED IMAGES TO empty array
              
                    var pageFlows = new Array();  // THESE ARE THE ONES THAT ARE PRELOADED HERE....
              
                    $.ajax({
                        type: "GET",
                        url: pageFlowFileIn,
                        datatype: "XML",
                        success: function(xml) {
                            mm.XML.readPageFlows(xml, pageFlows, function() {
                                // PRELOAD THE IMAGES HERE
                                if (preLoadImages.length > 0) {
                                    mm.Images.preLoadImagesFromWidgetClasses(preLoadImages, function() {
                                        callback(pageFlows);
                                    });
                                } else {
                                    callback(pageFlows);
                                }
                           });
              
                        }
                    });
              
                    
              
                },
				/*
				Reads all the page flows.
				*/
                readPageFlows: function(xmlIn, pageFlowsIn, callback) {
                    mm.XML.readPF(xmlIn, 0, pageFlowsIn, function() {
                        callback();
                    });
            
                },
				/*
				Reads each page flow.
				*/
                readPF: function(xmlIn, iIn, pageFlowsIn, callback) {
                    if (iIn < $(xmlIn).find("PageFlows").children("PageFlow").size()) {
                        mm.XML.readPageFlow($(xmlIn).find("PageFlows").children("PageFlow").get(iIn), pageFlowsIn, function() {
                            mm.XML.readPF(xmlIn, iIn + 1, pageFlowsIn, callback);
                        });
                    } else {
                        callback();
                    }
                },
				/*
				Read the page flow.
				*/
                readPageFlow: function(xmlIn, pageFlowsIn, callback) {
            
                    var pageFlowId = $(xmlIn).find('Id').first().text();
            
                    // HERE NEED TO MERGE THE "INCLUDE TAGS IN TO THE XML"
                    mm.XML.mergeIncludes(xmlIn, function() {
            
                        pageFlowsXML[pageFlowId] = xmlIn;
              
                        var preLoad = $(xmlIn).find('PreLoad').first().text();
              
                        if (preLoad == "True") {
                            mm.XML.readWidget(xmlIn, pageFlowsIn);
                        }
                        
                        callback();
                    });
            
                },
				/*
				Merge includes for each page.
				*/
                mergeIncludes: function(pageFlowIn, callback) {
            
                    // LOOP THROUGH AND GET THE OTHER TAGS
                    var widgets = $(pageFlowIn).children("Widgets");
            
                    mm.XML.includeWidget(widgets, 0, new Array(), function(amendArray) {
                
                        if (!isNull(amendArray) && amendArray.length > 0) {
                            for (var i=0;i<amendArray.length;i++) {
                                widgets.get(0).appendChild(amendArray[i]);
                            }
                            callback();
                        } else {
                            callback();
                        }
                    });
            
                                
            
                },
                includeWidget: function(xmlIn, iIn, arrayToAdd, callbackMain) {
            
                    if (iIn < $(xmlIn).children().size() ) {
            
                        var child = $(xmlIn).children().get(iIn);
                        var include = $(child).children('Include').first().text();
            
                        if (!isNull(include) && include.length > 0) {
            
                            $.ajax({
                                type: "GET",
                                url: include,
                                datatype: "XML",
                                success: function(xml) {
                            
                                    arrayToAdd.push($(xml).find("Widget").get(0));
                                
                                    mm.XML.includeWidget(xmlIn, iIn + 1, arrayToAdd, callbackMain);  // RECURSIVE
                           
                                },
                                error: function() {
                                    console.log("ERROR: INCLUDE NOT FOUND " + include);
                                }
                            });
                        } else {
                            // IGNORE
                            mm.XML.includeWidget(xmlIn, iIn + 1, arrayToAdd, callbackMain);  // RECURSIVE
                        }
      
                    } else {
                        callbackMain(arrayToAdd);
                    }
            
            
                },
				/*
				Returns a page by page id in page flow.
				*/
                getPage: function(pageFlowIdIn, pageIdIn) {
                    var pageFlowXML = pageFlowsXML[pageFlowIdIn];
              
                    var page = mm.XML.getPageFromXML(pageFlowXML, pageIdIn);
            
                    if (!isNull(page)) {
                        page.preLoad = true;
                    } else {
                        // SHOW ERROR - FOR DEVELOPER
                        console.log("ERROR: Page not found.  Check it has been added to the pageflow.xml file.  The pageId is " + pageIdIn );
                    }
              
                    return page;
                },
				/*
				Gets a page from an xml file.
				*/
                getPageFromXML: function(pageFlowIn, pageIdIn) {
                    var id = $(pageFlowIn).find('Id').first().text();
                    var className = $(pageFlowIn).find('Class').first().text();
              
                    var widget = new mm.XML.initWidgetClass(id, className, new Array());  // IN COMMON MUST HAVE ID
                    
                    // LOOP THROUGH AND GET THE OTHER TAGS 
                    $(pageFlowIn).children().each(function() {
                        var tagName = $(this).get(0).tagName.toUpperCase();
                        if (tagName == "WIDGETS") {
                            if (widget.widgets == null) {  // COULD HAVE BEEN CREATED ALREADY IN DEEP COPY
                                widget.widgets = new Array();
                            }
                            
                            $(this).children().each(function() {  // LOOP THROUGH EACH PAGE
                                var pageId = $(this).find('Id').first().text();
                                if (pageId == pageIdIn) {
                                    // GET THE PAGE
                                    mm.XML.readWidget(this, widget.widgets);
                                }
                            });
                            
                        }
                    });
              
                    var page = null;
              
                    if (widget.widgets != null) {
                        var i = 0;
        
                        while (i<widget.widgets.length && page == null) {  // CAN ONLY EXIST ONE PAGE
                            if (pageIdIn == widget.widgets[i].id) {
                                page = widget.widgets[i];
                            }
                            i = i + 1;
                        }
                    }
              
                    return page;
                
                },
                // END PAGE FLOW XML
                /*
				Loads the messages.xml file and loads it into memory.  When complete callback is called.
				*/
                loadMessageXML: function(xmlNameIn, messageSection, callback) {
            
                    $.ajax({
                        type: "GET",
                        url: xmlNameIn,
                        datatype: "XML",
                        success: function(xml) {
                            mm.XML.readMessages(xml, messageSection);
                            callback();
                        }
                    });

                },
				/*
				Reads each message in the "MessageSection"
				*/
                readMessages: function(xmlIn, messageSection) {
              
                    $(xmlIn).find("Message").find("MessageSection").each(function() {
                        mm.XML.readMessageSection(this, messageSection);
                    });
                },
				/*
				Reads the message section.
				*/
                readMessageSection: function(xmlIn, messageSectionIn) {
                    var messageSectionId = $(xmlIn).find("Id").first().text();
                    if (messageSectionId == messageSectionIn) {
                        $(xmlIn).find("Messages").each(function() {
                            mm.XML.readAllMessages(this);
                        });
                    }
                },
				/*
				Read all of the messages.
				*/
                readAllMessages: function(xmlIn) {
                    $(xmlIn).find("M").each(function() {
                        messages[$(this).attr('id')] = $(this).text();
                    });
                },
				/*
				Gets the message by its id.
				*/
                getMessage: function(idIn) {
                    return messages[idIn];
                }
                // END READING MESSAGES
				
           };
        })()
        

		
		
		
    };
    
    return module;
        
})();
//**************************************************************
//* END mm is the main package for Swanc
//**************************************************************
