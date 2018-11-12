$(document).ready(function(){
			$("body").on("click", ".scrollTo", function(e) {
        		e.preventDefault();

        		var target  = $(this).attr("href"),
        		    offset = Math.floor($(target).offset().top);
        		    console.log(offset);

        		$("body, html").animate({
        			scrollTop: offset
        		}, 1500);
   			 });
		});