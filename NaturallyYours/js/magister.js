// global. currently active menu item 
var current_item = 0;

// few settings
var section_hide_time = 850;
var section_show_time = 850;

// jQuery stuff
jQuery(document).ready(function($) {

	// Switch section
	$("a", '.mainmenu').click(function() 
	{
		if( ! $(this).hasClass('active') ) { 
		    current_item = this;

            //External links (G+/Fbook) have override class. bug out of here
		    if($(this).hasClass('override')){return true;}

			// close all visible divs with the class of .section
			$('.section:visible').fadeOut( section_hide_time, function() { 
				$('a', '.mainmenu').removeClass( 'active' );  
				$(current_item).addClass('active');

			    //Get the new section to fade in
				var new_section = $($(current_item).attr('href') );
				new_section.fadeIn(
                    {
                        duration: section_show_time,
                        complete: function () {
                            //GMaps doesn't like loading properly when its parent element is hidden.  Wait for the section to finish fading in
                            //then update it
                            if (new_section.attr('id') == 'contact') { window.GMap.Update(); }
                        }
                    });
			});

		    //Close the menu
			$('.navbar-toggle').dropdown('toggle');
		}
		return false;
	});		
});