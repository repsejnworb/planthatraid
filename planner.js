
$(document).ready(function(){

    var classes = {
        'undefined': 0,
        'warrior-assault': 1,
        'stalker-assault': 2,
        'medic-assault': 3,
        'engineer-assault': 4,
        'spellslinger-assault': 5,
        'esper-assault': 6,
        'warrior-support': 7,
        'stalker-support': 8,
        'medic-support': 9,
        'engineer-support': "a",
        'spellslinger-support': "b",
        'esper-support': "c",
    }

    generateURL()
    var param = location.href.substr(location.href.indexOf('#')+1);
    var hash = $(location).attr('hash');
    console.log("full url: " + document.URL);
    console.log("param: " + param);
    console.log("hash: " + hash);

    function getClass(obj) {
        var className;
        // Note, an object with multiple classes will not work well (:
        $.each(classes, function(index) {
            var clsname = index.split('-')[0];
            var role = index.split('-')[1];
            if (obj.hasClass(clsname) && obj.hasClass(role)) {
                className = index;
                return false;
            };
        }); 
        return className;
    };

    console.log(Base62.encode(13455));
    //var string = '4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG'
    var string = '4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG4aBfKjHiG6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa6kKlIjHGa1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw1MmNfJaOw2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK2qIqQoPlK'
    var compressed = LZString.compressToBase64(string);
    console.log(compressed);
    console.log(string.length);
    console.log(compressed.length);
    var korv = Base62.encode(string);
    console.log("B62: " + korv.length);
    var decompressed = LZString.decompressFromBase64(compressed);
    console.log(decompressed);
    console.log(decompressed.length);

    function serializeGroups() {
        var result = '';
        $( ".div_groups li" ).each(function( index ) {
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
        console.log("result: " + result);
        console.log("result: " + Base62.encode(result));
        return Base62.encode(result);
    };

    function generateURL() {
        var URL = $(location).attr('href');
        var seri = serializeGroups();
        URL += "#" + seri;
        $( ".linkfield" ).val(URL);
        return seri;
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
    $('.slot li').droppable({
        hoverClass: '.slot-highlight',
        accept: '.block',
        drop: function(event, ui){
            clone = ui.draggable.clone();
            clone.draggable({
                cursor: 'pointer',
                revert: function(valid) {
                    if(!valid) {
                        //Dropped outside of valid droppable
                        $(this).remove();
                        generateURL();
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

            // When moving blocks in groups we want to clean up after us.
            if(!$(ui.draggable).parent().is('#classes')) {
                $(ui.draggable).remove();
            }
            var seri = generateURL();
            console.log("got seri: " + seri);
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