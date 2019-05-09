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
		}
		if(!(window.innerWidth > adaptiveMod)){
			element.setAttribute("style", "top:" + "" + "transform:" + "");
			element.css("transform", "");
		}
	}


	var ParalaxParent = document.querySelector(".fs-image-container");
	var ParalaxElement = document.querySelector(".fs-image-container img");

	
	document.addEventListener('scroll', function (e) {
		Paralax(ParalaxParent, ParalaxElement, 0.1, 6, false,1);
		var currentSection;
		if(document.querySelector(".scroll-block") !== null){
			document.querySelectorAll(".scroll-block").forEach(function(i){
				if(i.offsetTop - 80 < window.pageYOffset && i.offsetTop + i.clientHeight > window.pageYOffset){
					currentSection = i.getAttribute("id");

					if(!(document.querySelector(".advisor-navigation-item a[href='#" + currentSection + "']").closest(".advisor-navigation-item").classList.contains("active"))){
						document.querySelectorAll(".advisor-navigation-item").forEach(function(nav){
							nav.classList.remove("active")
						})
						document.querySelector(".advisor-navigation-item a[href='#" + currentSection + "']").closest(".advisor-navigation-item").classList.add("active")
					}
				}
			})
		}
	});



	document.querySelectorAll("a[href*='#']").forEach(function(userItem) {
		userItem.addEventListener('click', function (e) {
			e.preventDefault();
			var anchor = this;
			const blockID = anchor.getAttribute('href')
			var elPos =document.querySelector(blockID).offsetTop;
			window.scroll({top: elPos, left: 0, behavior: 'smooth' });
		});
	});

},1000)


