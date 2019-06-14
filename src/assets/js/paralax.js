setTimeout(function() {
	function Paralax(parent, element,transition, animationSpeed, offset, adaptive){
		var adaptiveMod;
		if(!adaptive) {
			adaptiveMod = 992;
		}
		if(adaptive) {
			adaptiveMod = adaptive;
		}
		if(parent !== null && window.innerWidth > adaptiveMod){
			var sizeCalc = parseInt(getComputedStyle(document.body).fontSize) / 20;
			var elemOffset = parent.clientHeight / (animationSpeed * sizeCalc);
			if(window.pageYOffset + parent.clientHeight > parent.offsetTop){
				var scrollSize = window.pageYOffset;
				if(offset){
					element.setAttribute("style", "top:" + elemOffset + ";");
				}
				TweenMax.to(element, transition, {y: -scrollSize / (animationSpeed * sizeCalc)});
			}
			// console.log(document.querySelector(".content").offsetTop)
		}
		if(!(window.innerWidth > adaptiveMod)){
			element.setAttribute("style", "top:" + "" + "transform:" + "");
			element.css("transform", "");
		}
	}

	document.addEventListener('scroll', function (e) {
	var ParalaxParent = document.querySelector(".fs-image-container");
	var ParalaxElement = document.querySelector(".fs-image-container img");
		Paralax(ParalaxParent, ParalaxElement, 0.1, 6, false,1);
	});
},1000)
