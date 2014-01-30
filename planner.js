
$(document).ready(function(){

    var classes = {
        'undefined': 0,
        'warrior': 1,
        'stalker': 2,
        'medic': 3,
        'engineer': 4,
        'spellslinger': 5,
        'esper': 6,
    }


    function getClass(obj) {
        var className;
        // Note, an object with multiple classes will not work well (:
        $.each(classes, function(index) {
            if (obj.hasClass(index)) {
                className = index;
                return false;
            };
        }); 
        return className;
    };

    console.log(Base62.encode(13455));

    function serializeGroups() {
        var result = '';
        $( ".group li" ).each(function( index ) {
            var block = $( this ).children(".block");
            if (typeof(block) === 'undefined') {
                result = result + '0';
                console.log("UNDEFFED");
            }
            else {
                var className = getClass(block);
                console.log(index + ": " + className);
                console.log("fisk " + classes[className]);
                result = result + classes[className].toString();  
            }
        });
        return Base62.encode(result);
    };


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
            var cla = getClass(clone);
            console.log("got class: " + cla);
            var seri = serializeGroups();
            console.log("got seri: " + seri);

            // When moving blocks in groups we want to clean up after us.
            if(!$(ui.draggable).parent().is('#classes')) {
                $(ui.draggable).remove();
            }
        },
    });
});



var Base62 = {
  chars: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),

  encode: function(i){
    if (i === 0) {return '0'}
    var s = ''
    while (i > 0) {
      s = this.chars[i % 62] + s
      i = Math.floor(i/62)
    }
    return s
  },

  decode: function(a,b,c,d){
    for (
      b = c = (
        a === (/\W|_|^$/.test(a += "") || a)
      ) - 1;
      d = a.charCodeAt(c++);
    )
    b = b * 62 + d - [, 48, 29, 87][d >> 5];
    return b
  },

};