animationview = (function() {
       
      var module = {
      
       
        App: (function() {
        
            // FOR ANIMATION TICKER
            var iTickerCount = 0;
            var tickerAnimation = null;

            // FOR SPACE GAME
            var spaceGameAnimation = null;
            var shipExploded = false;
            var explosionTime = 30;
            var score = 0;
            var bomb = 0;
            var alienI = 0;
            var direction = "right";
        	var spaceship = null;
            var explosion = null;
            var gameOverText = null;
            var scoreText = null;
            var restartGameButton = null;
              
            return {
                init: function() {

                    // ANIMATION TICKER
                    animationview.App.initTicker();
              
              
                    // SPACE GAME
                    animationview.App.initSpaceGame();
              
                },
                initTicker: function() {
              
                    mm.App.addFunction("ANIMATIONS_START_TICKER_PAGE_OPEN", function(pageIn) {
                    
                        
                        // GET THE TICKER ANIMATION WIDGET
                        if (tickerAnimation == null) {
                            tickerAnimation = mm.App.getWidget(pageIn, "TickerAnimation");
                        }
                        
                        // START THE ANIMATION ONCE THE PAGE HAS OPENED
                        mm.Animations.startAnimation(tickerAnimation);
                        
                        
                    });
              
                    mm.App.addFunction("ANIMATIONS_START_TICKER_PAGE_CLOSE", function(pageIn) {
                        
                        // STOP THE ANIMATION BEFORE CLOSING THE PAGE
                        mm.Animations.stopAnimation(tickerAnimation);
                        
                    });
              
                    mm.App.addFunction("ANIMATIONS_TICKER_ANIMATE", function(ctx, xIn, yIn, animationIn) {
                        if (iTickerCount == 2) {
                            iTickerCount = 0;
                        } else {
                            iTickerCount = iTickerCount + 1;
                        }
                        
                        // SET ALL THE IMAGES TO HIDDEN THAT ARE THE WIDGETS OF THE ANIMATION.
                        for(var i=0;i<animationIn.m.widgets.length;i++) {
                            animationIn.m.widgets[i].m.hidden = true;
                        }
                        
                        animationIn.m.widgets[iTickerCount].m.hidden = false;
                    });
                },
                initSpaceGame: function() {
              
                    mm.App.addFunction("ANIMATIONS_SPACE_GAME_PAGE_OPEN", function(pageIn) {
                    
                        // GET THE SPACE GAME ANIMATION WIDGET
                        if (spaceGameAnimation == null) {
                            spaceGameAnimation = mm.App.getWidget(pageIn, "SpaceGameAnimation");
                        }
                        
                        spaceship = mm.App.getWidget(spaceGameAnimation, "SpaceShip");
                        
                        explosion = mm.App.getWidget(spaceGameAnimation, "Explosion");
                        
                        gameOverText = mm.App.getWidget(spaceGameAnimation, "GameOverText");
                        
                        scoreText = mm.App.getWidget(spaceGameAnimation, "ScoreText");
                        
                        restartGameButton = mm.App.getWidget(pageIn, "RestartGame");
                        
                        // ADD BOMBS TO SPACE GAME
                        animationview.App.initBombs();
                        
                        // ADD ALIENS TO SPACE GAME
                        animationview.App.initAliens();
                        
                        // START THE ANIMATION ONCE THE PAGE HAS OPENED
                        mm.Animations.startAnimation(spaceGameAnimation);
                        
                        
                    });
              
                    mm.App.addFunction("ANIMATIONS_SPACE_GAME_PAGE_CLOSE", function(pageIn) {
                        
                        // STOP THE ANIMATION BEFORE CLOSING THE PAGE
                        mm.Animations.stopAnimation(spaceGameAnimation);
                        
                    });
              
                    mm.App.addFunction("ANIMATIONS_SPACE_GAME_ANIMATE", function(ctx, xIn, yIn, animationIn) {
                        animationview.App.animateSpaceGame(ctx, xIn, yIn, animationIn);
                    });
              
                    // COLLISION ACTION BOMB HITS ALIEN
                    mm.App.addFunction("ANIMATIONS_BOMB_HIT_ALIEN_COLLISION", function(animationIn, alienIn, bombIn) {
                    
                        alienIn.m.hidden = true;
                        bombIn.m.hidden = true;
                        score = score + 1;
                        scoreText.text = "Score: " + score;
                        mm.Texts.calculateTextWidth(scoreText);
              
                    });
              
                    //ANIMATIONS_SPACESHIP_HIT_ALIEN_COLLISION
                    mm.App.addFunction("ANIMATIONS_SPACESHIP_HIT_ALIEN_COLLISION", function(animationIn, alienIn, spaceShipIn) {
                    
                        spaceShipIn.m.hidden = true;
                        alienIn.m.hidden = true;
                        explosion.m.hidden = false;
                        shipExploded = true;
              
                    });
              
                    // RESTART GAME
                    mm.App.addFunction("ANIMATIONS_RESTART_GAME_ACTION", function(buttonIn, xIn, yIn) {
                        // STOP ANIMATION
                        mm.Animations.stopAnimation(spaceGameAnimation);
                        
                        // SET EVERYTHING TO HIDDEN
                        for (var i=0;i<spaceGameAnimation.m.widgets.length; i++) {
                            spaceGameAnimation.m.widgets[i].m.hidden = true;
                        }
                        spaceship.m.x = Math.floor(spaceGameAnimation.m.w * 0.48);
                        spaceship.m.y = Math.floor(spaceGameAnimation.m.h * 0.80);
                        spaceship.m.hidden = false;
                        scoreText.text = "Score: 0";
                        scoreText.m.hidden = false;
                        mm.Texts.calculateTextWidth(scoreText);
                        score = 0;
                        shipExploded = false;
                        explosionTime = 30;
                        
                        // START ANIMATION
                        mm.Animations.startAnimation(spaceGameAnimation);
                    });
                },
                initBombs: function() {
                    // ADD THE BOMBS USING CODE, REPETITION EASIER THAN USING XML...
                    var bombWidgetClass = mm.App.getWidgetClass("Bomb");
              
                    // ADD 15 bombs
                    for (var i=0; i<15; i++) {
                        // CREATE A NEW BOMB INSTANCE
                        var bombFragment = mm.App.addWidgetX("bomb" + i, bombWidgetClass);
              
                        console.log("bombFragment " + bombFragment.m.id + " " + bombFragment.m.type);
              
                        // ADD THE BOMB TO THE ANIMATION
                        mm.App.add(spaceGameAnimation, bombFragment);
                    }
                },
                initAliens: function() {
                    // ADD THE ALIENS USING CODE, REPETITION EASIER THAN USING XML...
                    var alienWidgetClass = mm.App.getWidgetClass("Alien");
              
                    // ADD 15 aliens
                    for (var i=0; i<10; i++) {
                        // CREATE A NEW ALIEN INSTANCE
                        var alien = mm.App.addWidgetX("alien" + i, alienWidgetClass);
              
                        // ADD THE ALIEN TO THE ANIMATION
                        mm.App.add(spaceGameAnimation, alien);
                    }
                },
                animateSpaceGame: function(ctx, xIn, yIn, animationIn) {
              
                    if (shipExploded == true) {
                        explosionTime = explosionTime - 1;
                        if (explosionTime < 0) {
                            explosion.m.hidden = true;
                            gameOverText.m.hidden = false;
                        }
                    }
              
                    // MOVE SPACE SHIP TO TOUCH POS
                    if (shipExploded == false) {
                        if (xIn != -1) {
                            if ((xIn + spaceship.m.w) > animationIn.m.w) {
                                spaceship.m.x = animationIn.m.w - (spaceship.m.w);
                            } else {
                                spaceship.m.x = xIn;
                            }
                        }
                        if (yIn != -1) {
                            if ((yIn - spaceship.m.h) < 0) {
                                spaceship.m.y = 0;
                            } else {
                                spaceship.m.y = yIn - spaceship.m.h;
                            }
                        }
                    }
              
                    // UPDATE ALL OF THE BOMBS AND ALIENS
                    for (var i=0;i < animationIn.m.widgets.length; i++) {
                        var widget = animationIn.m.widgets[i];
              
                        // BOMBS (MOV POS)
                        if (widget.m.hidden == false) {
                            if (widget.m.type == "BOMB") {
                                widget.m.y = widget.m.y - 5;
                                if (widget.m.y < 0) {
                                    widget.m.hidden = true;
                                }
                            }
              
              
                            if (widget.m.type == "ALIEN") {
                                widget.m.y = widget.m.y + 3;
                                var speed = Math.round(Math.random()*15);
                                if (animationview.App.isEven(i)) {
                                    widget.m.x = widget.m.x + speed;
                                } else {
                                    widget.m.x = widget.m.x - speed;
                                }
                                if ((widget.m.y + widget.m.h) > animationIn.m.h) {
                                    widget.m.hidden = true;
                                } else if ((widget.m.x + widget.m.w) > animationIn.m.w) {
                                    widget.m.x = 0;
                                } else if (widget.m.x < 0) {
                                    widget.m.x = animationIn.m.w - widget.m.w;
                                }
                            }
                        }
              
              
                    }
              
                    if (shipExploded == false) {
                        // ADD A BOMB
                        bomb = bomb + 1;
                        if (bomb == 10) {
                            bomb = 0;
                            var found = false;
                            var i = 0;
                            while(found == false && i < animationIn.m.widgets.length) {
                                if (animationIn.m.widgets[i].m.type == "BOMB" && animationIn.m.widgets[i].m.hidden == true) {
                                    animationIn.m.widgets[i].m.x = spaceship.m.x + 14;
                                    animationIn.m.widgets[i].m.y = spaceship.m.y - 10;
                                    animationIn.m.widgets[i].m.hidden = false;
                                    found = true;
                                }
					
                                i = i + 1;
                            }
                        }
              
                        // ADD AN ALIEN
                        alienI = alienI + 1;
                        if (alienI == 10) {
                            alienI = 0;
                            var found = false;
                            var i = 0;
                            while (found == false && i < animationIn.m.widgets.length) {
                                if (animationIn.m.widgets[i].m.type == "ALIEN" && animationIn.m.widgets[i].m.hidden == true) {
                                    animationIn.m.widgets[i].m.x = Math.round(Math.random()*animationIn.m.w);
                                    animationIn.m.widgets[i].m.y = 0;
                                    animationIn.m.widgets[i].m.hidden = false;
                                    found = true;
                                }
              
                                i = i + 1;
                            }
              
                        }
                    }
              
                },
                isEven: function(valueIn) {
                    if (valueIn%2 == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
             };
        })()
        
       
       	};
    
    
    
	return module;
})();