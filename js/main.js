$(document).ready(function() {
		// Settings 
		var slideshowDelay = 5000; //slide show speed
		var currentPage = 0;//current page index in slide show
		var slideShowRunner=null; //slide show object
		var isSettingOpen = false;//settings in share box
		var shlideShowItems = $('.slideShow .items .item').length; //number of items in slide show
		var isOpen=false; //is menu open or closed
		
		//hide all sections
		$("#home").fadeOut();
		$("#profile").fadeOut();
		$("#portfolio").fadeOut();
		$("#service").fadeOut();
		$("#storage_details").fadeOut();
		$("#contact").fadeOut();
		$("#test").fadeOut();

		function modalOpenAnimation(selector){
			//close every modal
			$('.modal').css({'display':'none'})
			$(selector).css({'display':'block'});
			// modal animation 
			anime.timeline({
				duration:300,
				targets:selector,
				opacity:[0,1],
				translateX:'0vw',
				easing:'easeOutQuint'//easeInQuart,easeOutCubic
			})
			.add({
				targets:selector+' .container',
				opacity:0,
			})
			.add({
				duration:200,
				targets:selector,
				left:0,
			})
			.add({
				duration:200,
				targets:selector+' .wraper',
				height:['calc(100% - 80px)'],
				width:['0px','100%'],
				backgroundColor:'#ffa500',
			})
			.add({
				duration:200,
				targets:selector+' .wraper',
				right:'0',
				complete:function(){
					anime({
						targets:selector+' .container',
						opacity:[0,1],
					})
				}
			})
			.add({
				duration:400,
				targets:selector+' .wraper',
				height:['calc(100vh - 80px)','0px'],
			})
			.add({
				targets:selector+' .modal-title .close-modal',
				opacity:[0,1],
				scale:['0.5','1']
			})
			.add({
				targets:selector+' .modal-title .title',
				opacity:[0,1],
			})
		}
		function modalCloseAnimation(selector){
			anime.timeline({
				duration:600,
				easing:'easeOutQuint', //easeInQuart ,easeOutCubic, easeOutCubic	
			})
			.add({
				targets:selector+' .container',
				opacity:[1,0],
			})
			.add({
				duration:200,
				targets:selector+' .modal-title .close-modal',
				scale:['1','0'],
			})
			.add({
				duration:200,
				targets:selector+' .wraper',
				backgroundColor:'#781bf1',
				height:'calc(100% - 80px)',
			})
			.add({		
				duration:200,		
				targets:selector+' .wraper',
				opacity:'1',
				width:['calc(100% - 80px)','0'],
			})
			.add({
				targets:selector,
				translateX:'-100vw',
				complete:function(){
					$(selector).css({'display':'none'})
				}
			})
		}
		//check all anchers if has modal to open
		$('a').each(function(index){
			//for modals
			if($(this).attr('modal-name') !== undefined){
				var modalName = $(this).attr('modal-name');
				$(this).on('click',function(e){
					e.preventDefault();
					modalOpenAnimation("#"+modalName);
					//on close button clicked
					$("#"+modalName+' .close-modal').on('click',function(){
						modalCloseAnimation("#"+modalName)
					})
				})
			}
			//section links
			if($(this).attr('data-section') !== undefined){
				var section_link = $(this).attr('data-section');
				$(this).on('click',function(e){
					$(".page_title").text(section_link);
					$(".bottom_page_title").text(section_link);
					$("#home").fadeOut();
					$("#test").fadeOut();
					$("#profile").fadeOut();
					$("#portfolio").fadeOut();
					$("#service").fadeOut();
					$("#storage_details").fadeOut();
					$("#contact").fadeOut();
					anime({
						targets:['.page_title','.bottom_page_title'],					
						duration:500,					
						scaleX:['0','1'],
						opacity:['0','1'],
						easing: 'easeOutQuint',
					})
					closeMenuTimelineAnimation.play();
					closeMenuTimelineAnimation.complete = function(){

						loaderTargetAnimation.play();
						loaderTargetAnimation.complete = function(){
							closeMenu(section_link);
						}
					}
					isOpen = !isOpen;
				})
				
			}
		});

		//scroll to offset of element  in modal
		$('*[data-id]').each(function( index ) {
			 $($(this)).on('click',function(){
				var p = $("#"+$(this).attr('data-id'));
				var position = p.position();
				var offset = position.top; 
				anime({
					targets:'.container',
					scrollTop: offset,
					duration: 400,
				})
			 })
		})

		//escap modal by ckicking esc key on keyboard
		$(document).keyup(function(e) {
			if (e.key === "Escape") { // escape key maps to keycode `27`
				modalCloseAnimation(".modal")
			}
		});

		//home slideshow initialize
		function slideShowInIt(){
		//create nav circles
			var itemslistInSlideShow = "<ul>";
			for(var i=0;i<shlideShowItems;i++){
				itemslistInSlideShow +="<li></li>";
				}
				itemslistInSlideShow += "</ul>";
			//current item selected
			$(".slideShow .slideShowNavigator").html(itemslistInSlideShow);
			//initilizing first item in slide show
			slideShow(0);
		}
		slideShowInIt();

		// Home page animations *******************
		$(".slideShow .slideShowNavigator ul li").on("click",function(e){
			e.preventDefault();
			var id = $(this).index();
			currentPage = id;
			slideShow(id);
		});

		//slide show item animation
		function slideShowItemAnimationPlay(){
			anime.timeline({	
				duration:1000,	
				loop:false,
			})
			.add({
				targets:'.slideShow .numbers',
				translateY:['-80px','0']
			},'-=800')
			.add({
				targets:'.home .circle',
				boxShadow:['0px 0px 0px 1px #ffa500','0px 0px 50px 20px #ffa500'],
			})
			.add({
				targets:'.slideShow .items .item.active .t',
				opacity:['0','1'],
				translateY:["100vh",'0px'],
			},'-=800')
			.add({
				targets:'.slideShow .items .item.active .p',
				opacity:[0,1],
				translateY:["40",'10'],
			},'-=800')
			.add({
				easing:'easeOutQuint',
				duration:500,
				targets:'.slideShow .items li.item.active .b',
				opacity:['0','1'],
				// translateX:["-50",'10'],
			},'-=800')
			
			// .add({
			// 	duration:slideshowDelay,
			// 	targets:'.line-progress',
			// 	width:['0%','100%'],
			// 	easing:'linear',
			// },slideshowDelay-200)
		}

		//slide show function		
		function slideShow(id){
			$('.slideShow .slideShowNavigator ul li').removeClass('active');
			$('.slideShow .slideShowNavigator ul li:eq('+id+')').addClass('active')
			$('.slideShow .numbers span:eq(0)')
				.text(String(id+1).padStart(2,'0'));
			$('.slideShow .numbers .number_of_items')
				.text("/ "+String(shlideShowItems).padStart(2,'0'));

			$('.slideShow .items li.item ').removeClass('active')
			$('.slideShow .items li:eq('+id+')').addClass('active')	
			slideShowItemAnimationPlay()
		}

		// SlideShow Pagination 
		$(".pagination i:first-child").on('click',function(){
			if(currentPage>0){
				currentPage--;
				}
				else currentPage =shlideShowItems-1;
			slideShow(currentPage);
		})
		$(".pagination i:last-child").on('click',function(){
			if(currentPage<shlideShowItems-1){
				currentPage++;
			}
				else currentPage =  0;
			slideShow(currentPage);
		})

		// profile animations *******************
		$('.profile .information >* ').on('mouseover',()=>{
			anime.timeline({
				targets:'.profile .information .left >*',
				translateX:[100,0],
				})
				.add({
					targets:'.profile .information .right >*',
					translateX:[-100,0],
				})
		})
		$('.profile .information >*').on('mouseout',()=>{
			anime.timeline({
					targets:'.profile .information .left >*',
					translateX:[0,100],
				})
				.add({
					targets:'.profile .information .right >*',
					translateX:[0,-100],
				})

		})

		//Loader animation *************************	
		var loaderTargetAnimation = anime.timeline({
		// duration:500,
		autoplay:false,
		easing: 'easeOutQuint', // easeInOutExpo
	  	})
		.add({
			duration:300,
			targets: '.loaders',
			width:['0','100%'],
		})
		.add({
			duration:400,
			targets: '.loaders .slider',
			delay:anime.stagger(100),
			width:['0','100vw'],
			translateX:['0','100%'],
			scale:['0.5','1'],
		})
		.add({
			duration:400,
			targets: '.loaders .slider',
			delay:anime.stagger(100),
			width:['100vw','0vw'],
			translateX:['100%','0'],
			scale:['0.5','1'],
		})
		.add({
			duration:500,
			targets: '.loaders',
			opacity:0,
			width:['100vw','0vw'],
		})

		// loaderTargetAnimation.play();
		// loaderTargetAnimation.complete = function(){
		// 	//initial page with title	
		// 	$(".home").fadeIn();
		// 	$(".page_title").text("home"); 
		// }

		//initial page with title
		$(".home").fadeIn();
		$(".page_title").text("home");

		//menu toggling.
		$('#toggleMenu').on('click',function(e){	
			if(!isOpen){
				openMenuTimelineAnimation.play(); 
				$(".borger i").removeClass('bi-list');
				$(".borger i").addClass('bi-x-lg');
				anime.timeline({
					targets:'.borger i',
					rotate:['0deg','90deg']
				})
				.add({
					targets:'.borger i',
					fontSize:'2rem'
				})
			}else{
				closeMenuTimelineAnimation.play(); 
				$(".borger i").removeClass('bi-x-lg');
				$(".borger i").addClass('bi-list');
				anime.timeline({
					targets:'.borger i',
					rotate:['90deg','0deg']
				})
				.add({
					targets:'.borger i',
					fontSize:'1.5rem'
				})
			}
				isOpen = !isOpen;
		});

		var openMenuTimelineAnimation = anime.timeline({
			autoplay:false,
			duration: 400,
			easing: 'easeInOutExpo', //easeInOutExpo,easeOutQuint
			})
			.add({
				targets: '.menu',
				opacity: '1',
				width:'400px',
				translateX:'1000',
				height:'calc(100% - 80px)',
			})
			.add({
				targets: '.menu ul li',
				delay: anime.stagger(50),
				opacity:['0','1'],
				translateX:[0,40],
			})
			.add({
				targets:'.copyrights',
				opacity:'1',
				height:'50',
			})
			.add({
				targets:'.copyrights',
				borderLeft:['0px solid #ffa500','40px solid #ffa500']
			})
			.add({
				duration:200,
				targets: '.menu',
				width:"300px",
			})
		
		var closeMenuTimelineAnimation = anime.timeline({
				autoplay:false,
				duration:400,
				easing: 'easeOutQuint', //easeOutQuint,easeInOutExpo
			})
			.add({
				duration:200,
				targets: '.copyrights',
				height:['50','0'],
				opacity:['1','0'],
			})
			.add({
				duration:200,
				targets: '.menu ul li',
				opacity:['1','0'],
				delay: anime.stagger(40),
				complete:function(){
					anime({
						duration:200,
						targets: '.menu',
						translateX:'-100'
					})
				}
			})
			
		//menu navitation
		$(".menu ul li a").on('click',function(){
			$(".borger i").removeClass('bi-x-lg');
			$(".borger i").addClass('bi-list');
			anime({
				targets:'.borger i',
				rotate:['90deg','0deg']
			})
			let sec = $(this).attr('data-section');
			$(".page_title").text($(this).text());
			$(".bottom_page_title").text($(this).text());
			$("#home").fadeOut();
			$("#test").fadeOut();
			$("#profile").fadeOut();
			$("#portfolio").fadeOut();
			$("#service").fadeOut();
			$("#storage_details").fadeOut();
			anime.timeline({
				targets:['.page_title','bottom_page_title'],					
				duration:500,
				scaleX:['0','1'],
				scaleY:['0','1'],
				opacity:['0','1'],
				easing: 'easeOutQuint',
			})
			
			closeMenuTimelineAnimation.play();
			closeMenuTimelineAnimation.complete = function(){

				loaderTargetAnimation.play();
				loaderTargetAnimation.complete = function(){
					closeMenu(sec);
				}
			}
			isOpen = !isOpen;
		})
		//display section!
		function closeMenu(sec){
			$("#"+sec).fadeIn();
		}
		
		$('.share_box').on('click',function(){
			if(!isSettingOpen){
				$('.share_box i').addClass('bi-x-lg')
				$('.share_box i').removeClass('bi-telephone')
				anime.timeline({
					duration:400,
					easing: 'easeOutQuint',
					targets:'.settings',
					translateY:['0','-160px']
				})
				.add({
					targets:'.share_box i',
					rotate:['0deg','-180deg']
				})
				.add({
					targets:'.settings ul li .active',
					top:'-80px',
				})
			}else{
				$('.share_box i').removeClass('bi-x-lg')
				$('.share_box i').addClass('bi-telephone')
				anime.timeline({
					duration:300,
					easing: 'easeOutQuint',
					targets:'.settings',
					translateY:['-160','0']
				})
				.add({
					targets:'.share_box i',
					fontSize:'25px',
					rotate:['-180deg','0deg']
				})
			}
			isSettingOpen = !isSettingOpen;
		});

		var contactActiveSection = 0;
		$('.settings .navigator i').on('click',function(){
			var itemsInContactList = $('.settings ul li').length;
			if($(this).index()==0){			
				if(contactActiveSection<itemsInContactList-1){
					contactActiveSection++;
				}else{
					contactActiveSection=itemsInContactList-1;
				}
			}else{
				if(contactActiveSection>0){
					contactActiveSection--;
				}else{
					contactActiveSection = 0;
				}
			}

			$('.settings ul li').removeClass('active');
			$('.settings ul li:eq('+contactActiveSection+')').addClass('active');
		 
			anime.timeline({
				loop:false,
				// easing:'easeOutQuint'
				duration:600,
			})
			.add({
				duration:200,
				targets: '.settings ul li.active i',
				translateY:['80px','0px'],
			})
			.add({
				duration:200,
				targets: '.settings ul li.active p',
				translateY:['-10px','0px'],
			},'-=200')

		})
			
		//plugin for service gallery
		$( "#service" ).services({
			autoplay:false,
			currentItem:0,
			duration:5000,				
		});
		
		/*
		//Auto play slide show
		slideShowRunner = setInterval(function(){
			if(currentPage<shlideShowItems-1){
				currentPage++;
			}else{
				currentPage =0;
			}
			slideShow(currentPage);
		},slideshowDelay);
		*/

		// Portfolio page animations ******************* 

		// for each menu item clicked filter 
		$('.portfolio .filter_list li').each(function(index) {
			/**/
			if($(this).attr('project_type') !== undefined){
				$(this).on('click',function(e){
					e.preventDefault();
					closeFilterMenu()
					filterIsOpen = !filterIsOpen;
					var project = $(this).attr('project_type');
					if(project=='all'){
						$('.portfolio .container .masonry figure').css({'display':'grid'})
					}else{
						$('.portfolio .container .masonry figure').css({'display':'none'})
						$('.portfolio .container .masonry figure[project_type='+project+']')
							.css({'display':'grid'})						
					}
					anime({
						targets:'.portfolio .container .masonry figure img',
						duration:400,
						easing:'easeOutQuint',
						opacity:['0','1'],
						delay:anime.stagger(80, {from: 'center'}),
					})
				})
			}

			if($(this).attr('project_status') !== undefined){
				$(this).on('click',function(e){
					e.preventDefault();
					closeFilterMenu()
					filterIsOpen = !filterIsOpen;
					var status = $(this).attr('project_status');
						$('.portfolio .container .masonry figure').css({'display':'none'})
						$('.portfolio .container .masonry figure[project_status='+status+']').css({'display':'grid'})
						anime({
							targets:'.portfolio .container .masonry figure img',
							duration:400,
							easing:'easeOutQuint',
							opacity:['0','1'],
							delay:anime.stagger(80, {from: 'center'}),
						})


				})
			}
		});
		// open and close filter menu
		var filterIsOpen=false;
		$('.portfolio .filter').on('click',function(){
			if(filterIsOpen){
				closeFilterMenu()
			}else{					
				openFilterMenu()
			}
			filterIsOpen = !filterIsOpen;
		})

		function closeFilterMenu(){
			closeFilterAnimation.play()	
			$('.portfolio .filter i').addClass('bi-filter')
			$('.portfolio .filter i').removeClass('bi-x-lg')	
			anime({
				targets:'.portfolio .filter i',
				rotate:['90deg','0deg'],
			})	
		}
		function openFilterMenu(){
			$('.portfolio .filter_list').css({'display':'block'});
				openFilterAnimation.play()	
				$('.portfolio .filter i').removeClass('bi-filter')
				$('.portfolio .filter i').addClass('bi-x-lg')	
				anime({
					targets:'.portfolio .filter i',
					rotate:['0deg','90deg'],
				})	
		}

		var closeFilterAnimation = anime.timeline({
			autoplay:false,
			duration:600,
			easing:'easeOutQuint',
		})
		.add({
			duration:300,
			targets:'.portfolio .filter_list li',
			opacity:['1','0'],
			delay:anime.stagger(40),
		})
		.add({
			duration:600,
			targets:'.portfolio .filter_list',
			translateY:['0px','680px'],
		})

		var openFilterAnimation = anime.timeline({
			autoplay:false,
			duration:600,
		})
		.add({
			duration:300,
			targets:'.portfolio .filter_list',
			easing:'easeOutQuint',
			translateY:['680px','0px'],
		})
		.add({
			duration:300,
			targets:'.portfolio .filter_list li',
			opacity:['0','1'],
			delay:anime.stagger(80),
		})

		$('.portfolio .container .go_top').on('click',function(){
			anime({
				targets:'.portfolio',
				scrollTop: 0,
				duration: 1000,
				easing:'easeOutQuint',
			})
		})


		$('img').on('click',function(e){
			e.preventDefault()
			var src = $(this).attr('src')
			// var rnd = Date.now();
			var frame = '<div class="frame"><img src="'+src+'"></div>';
			$('body').append(frame);
			$('.frame').show();
			$('.frame').on('click',function(f){
				f.preventDefault();
				$('.frame').hide();
			});

		})

		// $('.masonry figure img').on('click',function(){
		
		// 	anime({
		// 		targets:'.masonry figure .icons',
		// 		translateY:['0px','-100px'],
		// 	})
		// })

	 
			
});
 

 