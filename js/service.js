(function ($) {
 
    $.fn.services = function(options) {

        var settings = $.extend({
                autoplay:false,
                currentItem: 0,
                duration:5000,
            }, options );

        
        var element = this[0];
        var paused = false;
		var autoSlide;
        if(typeof anime() === 'object' && anime !== null){

            //properties
            let selector = '#'+element.id
            var j = settings.currentItem;

			var items =  $(selector+" .items .item").length;
			$(selector+" .number_of_items").text("/ "+String(items).padStart(2,'0'));
			$(selector+" .current_item").text(String(j+1).padStart(2,'0'));
			
			if(settings.autoplay){
				autoSlide =  setInterval(slide ,settings.duration);
			}
			if(settings.autoplay){
				$(selector+" .play #play_pause").removeClass('bi-play-fill');
				$(selector+" .play #play_pause").addClass('bi-pause-fill');
			}else{
				$(selector+" .play #play_pause").removeClass('bi-pause-fill');
				$(selector+" .play #play_pause").addClass('bi-play-fill');
			}

            var currentItemAnim = anime.timeline({
                autoplay:true,
				targets:selector+' .items .item',
			})
            .add({
				targets:selector+' .items .item img',
				opacity:['0','1'],
				easing:'linear',
				duration:500,
			},500)
			.add({
				targets:selector+' .items .item h1',
				opacity:['0','1'],
				translateX:['50','0'],
				duration:600,
			})
			.add({
				targets:selector+' .items .item p',
				opacity:['0','1'],
				translateY:['10','0'],
			},600)

			var menuTargetAnimation = anime.timeline({
				autoplay:false,
				easing: 'easeInOutExpo',
				  })
				.add({
					delay:0,
					targets: '.loaders',
					opacity:'1',
					width:'100vw',
				})
				.add({
					targets: ['.loaders .slider'],
					translateX:0,
					width:['0','100vw'],
					delay:anime.stagger(100),
				})
				.add({
					targets: '.loaders .loading',
					opacity:'1',
					complete:function(){
						anime({
							targets: '.loaders .slider',
							delay:anime.stagger(100),
							translateX: '100vw ',
						})
					}
				})
				.add({
						targets: '.loaders',
						opacity:0,
						width:['100vw','0'],
						left:'0px',
				})

			//on service item clicked goto details
			$(selector+" .items .item h1").on('click',function(){
				
					menuTargetAnimation.play();
				var link = $(this).attr('data-link')
					$(selector+" .items").css({'display':'none'})
					$(selector+" .panel").css({'display':'none'})					
					$(selector+" #"+link).removeClass('hide')

					menuTargetAnimation.complete = ()=>{
					$(selector+" .back").css({'visibility':'visible'})
					$(selector+" #"+link).css({'display':'block'})
					anime.timeline({
						duration:500,
					})
					.add({
						targets:selector+" #"+link,
						translateY:['-80','0'],
						opacity:['0','1'],
					})
					.add({
						targets:selector+" .back",
						opacity:[0,1],
						translateX:["20","0"],
					})
				}

				$(selector+" .back").on('click',function(){
					$(selector+" .back").css({'visibility':'hidden'})				
					$(selector+" .items").css({'display':'block'})
					$(selector+" .panel").css({'display':'block'})
					$(selector+" #"+link).css({'display':'none'})
					$(selector+" #"+link).addClass('show')
				})
			})

			//create nav circles
			var itemslist = "<ul>";
                for(var i=0;i<items;i++){
                    itemslist +="<li></li>";
					}
                    itemslist += "</ul>";
			//current item selected
			$(selector+" .navigator").html(itemslist);
			var sel = " .navigator ul li:eq("+(j)+")";
			$(selector+" "+sel).addClass('active')

			//on navigator circle clicked
			$(selector+" .navigator ul li").on("click",function(e){
				e.preventDefault();
				var id = $(this).index();
				gotoSelected(id);
			});
 
			//auto play
            function slide(){
                currentItemAnim.play();
				$(selector+' .navigator ul li').removeClass('active');
				$(selector+' .navigator ul li:eq('+j+')').addClass('active');
				
				$(selector+' .item').removeClass('active');
				$(selector+' .item:eq(' + j + ')').addClass('active');
				$(selector+" .current_item").text(String(j+1).padStart(2,'0'));
				
				anime.timeline({
					duration:900,
					targets:selector+' .current_item',
					opacity:['0','1'],
					translateY:['50','0']
				})
				.add({
					duration:500,
					targets:selector+' .number_of_items',
					opacity:['0','1'],
					translateY:['-50','0']
				})
					if(j < items-1)
						j++; else j=0;
			}

			//play and pause 
            $(selector+" .play #play_pause").on('click',function(e){
				e.preventDefault()
				if(paused){
					settings.autoplay = true;					
					autoSlide = setInterval(slide,settings.duration);
					$(selector+" .play #play_pause").removeClass('bi-play-fill');
					$(selector+" .play #play_pause").addClass('bi-pause-fill');
				}else{
					$(selector+" .play #play_pause").removeClass('bi-pause-fill');
					$(selector+" .play #play_pause").addClass('bi-play-fill');
					clearInterval(autoSlide);
					settings.autoplay = false;
				}
				paused = !paused
			})

			$("#play_next").on('click',function(e){
				e.preventDefault()
				if( j<items-1){ j++; }else{ j=0; }
				gotoSelected(j)
			})

			$("#play_prev").on('click',function(e){
				e.preventDefault()
				if(j>0){ j--; }else{ j=items-1; }
				gotoSelected(j)
			})

			//goto selected item next - prev
			function gotoSelected(id){

				$(selector+' .navigator ul li').removeClass('active');
				$(selector+' .navigator ul li:eq('+id+')').addClass('active');
				
				$(selector+' .item').removeClass('active');
				$(selector+' .item:eq('+id+')').addClass('active');
				$(selector+" .current_item").text(String(id+1).padStart(2,'0'));

				currentItemAnim.play();
				
				anime.timeline({
					duration:900,
					targets:selector+' .current_item',
					opacity:['0','1'],
					translateY:['50','0']
				})
				.add({
					duration:500,
					targets:selector+' .number_of_items',
					opacity:['0','1'],
					translateY:['-50','0']
				})
			}

        }else{
            console.log("Plugin depending on anime.js library!");
        }

       

        
    };
 
}(jQuery));