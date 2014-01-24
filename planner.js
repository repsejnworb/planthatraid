$(document).ready(function(){

    draggableOpacity = 0.6;

    // Draggable blocks either from roster or class table
    $('.block').draggable({
        helper: 'clone',
        revert: 'invalid',
        cursor: 'pointer',
        opacity: draggableOpacity,
    });

    // Slots in which we can place our blocks
    $('.slot').droppable({
        hoverClass: 'slot-highlight',
        accept: '.block',
        drop: function(event, ui){
            clone = ui.draggable.clone();
            clone.draggable({
                cursor: 'pointer',
                revert: function(valid) {
                    if(!valid) {
                        //Dropped outside of valid droppable
                        $(this).remove();
                    }
                }
            });
            clone.css({
                top: 0,
                left: 0,
                zIndex: 75
            });
            $(this).append(clone);

            // When moving blocks in groups we want to clean up after us.
            if(!$(ui.draggable).parent().is('#classes')) {
                $(ui.draggable).remove();
            }
        },
    });
});