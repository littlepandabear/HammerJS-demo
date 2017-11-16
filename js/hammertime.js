var test = new Draggable('#testCon',150,100);

function Draggable(id,xpos,ypos){
    
    this.id = id;
	this.x = xpos;
	this.y = ypos;
   
    var divContainer = document.querySelector(this.id);
	
    var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    })();
	
	
    var START_X = this.x;
    var START_Y = this.y;
    var START_SCALE = .5;
    var START_ANGLE = 0;
	var minScale = .5;
	var maxScale = 1;
    var ticking = false;
    var transform;
    var timer;
	
	var mc = new Hammer.Manager(divContainer,{
		drag:true,
		preventDefault: true
	});

	mc.add(new Hammer.Press({ event: 'press', time: 250 }));
	mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
	mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
	mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);


	mc.on("press", onPress);
	mc.on("panstart panmove", onPan);
	mc.on("rotatestart rotatemove", onRotate);
	mc.on("pinchstart pinchmove", onPinch);

	mc.on("hammer.input", function(ev) {

	    if(ev.isFinal) {
	
			START_X = transform.translate.x;
			START_Y = transform.translate.y;
			START_SCALE = transform.scale;
			START_ANGLE = transform.angle;
			console.log(START_SCALE);
		    console.log(START_X,START_Y);
	
		    resetElement();

	    }
	});


	function resetElement() {		

		if (START_X < 0){
			START_X = -75;
		}else if (START_X > window.innerWidth - divContainer.offsetWidth){
			START_X = window.innerWidth - (divContainer.offsetWidth - 75);	
		} 


		if (START_Y < 0){
			START_Y = -50;
		}else if (START_Y > window.innerHeight - divContainer.offsetHeight){
			START_Y = window.innerHeight - (divContainer.offsetHeight - 50);	
		} 

	    transform = {
	        translate: { x: START_X, y: START_Y },
	        scale: START_SCALE,
	        angle: START_ANGLE,
	    };

	    requestElementUpdate();


	}

	function updateElementTransform() {
	    var value = [
	                'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
	                'scale(' + transform.scale + ', ' + transform.scale + ')',
	                'rotate('+  transform.angle + 'deg)'
	    ];

	    value = value.join(" ");
	    divContainer.style.webkitTransform = value;
	    divContainer.style.mozTransform = value;
	    divContainer.style.transform = value;
		divContainer.style.webkitTransformOrigin ="center center"; 
		divContainer.style.transformOrigin ="center center"; 
	    ticking = false;

	}

	function requestElementUpdate() {
	    if(!ticking) {
	        reqAnimationFrame(updateElementTransform);
	        ticking = true;
	    }
	}

	function onPress(ev) {
	    console.log(ev.type);


	}

	function onPan(ev) {
		console.log(ev.type);
		console.log(transform.translate.x,transform.translate.y);
	 	console.log(START_X,START_Y);
		
	    transform.translate = {
	        x: START_X + ev.deltaX,
	        y: START_Y + ev.deltaY
	    };

	    requestElementUpdate();

	}

	function onPinch(ev) {

	    if(ev.type == 'pinchstart') {
	        START_SCALE = transform.scale || 1;
	    }

	    transform.scale =  START_SCALE * ev.scale;

		if( transform.scale < minScale){
			transform.scale = minScale;
	    }else if(transform.scale > maxScale){
			transform.scale = maxScale;
		}

	    requestElementUpdate();
	    console.log(ev.type);
	}

	function onRotate(ev) {
	    if(ev.type == 'rotatestart') {
	        initAngle = transform.angle || 0;
	    }

	    transform.rz = 1;
	    transform.angle = initAngle + ev.rotation;
	    requestElementUpdate();
	    console.log(ev.type);
	}
	
	resetElement();
   
}