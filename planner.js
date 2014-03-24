
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

    var classes_reversed = {
        '0': 'undefined',
        '1': 'warrior-assault',
        '2': 'stalker-assault',
        '3': 'medic-assault',
        '4': 'engineer-assault',
        '5': 'spellslinger-assault',
        '6': 'esper-assault',
        '7': 'warrior-support',
        '8': 'stalker-support',
        '9': 'medic-support',
        'a': 'engineer-support',
        'b': 'spellslinger-support',
        'c': 'esper-support',
    }

    var classes_icons = {
        'warrior': {
            "assault": "melee_icon",
            "support": "tank_icon",
        },
        'stalker': {
            "assault": "melee_icon",
            "support": "tank_icon",
        },
        'engineer': {
            "assault": "ranged_icon",
            "support": "tank_icon",
        },
        'spellslinger': {
            "assault": "ranged_icon",
            "support": "healer_icon",
        },
        'esper': {
            "assault": "ranged_icon",
            "support": "healer_icon",
        },
        'medic': {
            "assault": "ranged_icon",
            "support": "healer_icon",
        },
    }

    var counters = {
        "tanks": {
            "anyOf": [
                "warrior-support",
                "stalker-support",
                "engineer-support",
            ],
            "total": 0,
        },

        "healers": {
            "anyOf": [
                "spellslinger-support",
                "esper-support",
                "medic-support",
            ],
            "total": 0,
        },

        "melee_dps": {
            "anyOf": [
                "warrior-assault",
                "stalker-assault",
            ],
            "total": 0,
        },

        "ranged_dps": {
            "anyOf": [
                "esper-assault",
                "medic-assault",
                "spellslinger-assault",
                "engineer-assault",
            ],
            "total": 0,
        },

        "interrupts": {
            "anyOf": [
                "warrior-assault",
                "stalker-assault",
                "esper-assault",
                "medic-assault",
                "spellslinger-assault",
                "engineer-assault",
                "warrior-support",
                "stalker-support",
                "engineer-support",
                "spellslinger-support",
                "esper-support",
                "medic-support",
            ],
            "total": 0,
        },
    }

    createCounters();

    draggableOpacity = 0.6;

    // Draggable blocks either from roster or class table
    $('.block').draggable({
        helper: 'clone',
        revert: 'invalid',
        opacity: draggableOpacity,
    });

    // Slots in which we can place our blocks
    $('.slot li').droppable({
        hoverClass: '.slot-highlight',
        accept: '.block',
        drop: function(event, ui){
            clone = ui.draggable.clone();
            clone.draggable({
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

    $('.div_add li').click(function() {
        var group = $(this).closest('.group');
        // Minus 1 because we have 6 elements in the div_add
        var index = $(this).index() - 1;
        var slot = group.find('.slot li').eq(index);
        console.log("number of children: " + slot.children().length)
        var block = slot.children();
        console.log("Slot: " + slot.attr('id'));
        console.log(block.length);
        if (block.length == 0) {
            console.log("Tried to switch role for empty slot");
        }
        else if (block.length == 1) {
            // var className = getClass(block); 
            console.log("Swapping role");
            swapRole(block);
        }
        else {
            console.log("Unknown error. Length was " + block.length);
        }
        var seri = generateURL();
        console.log("got new seri: " + seri);

        /*
        console.log("Me: " + $(this).attr('id'));
        console.log("Index: " + index);
        console.log("Parent: " + $(this).parent().attr('id'));
        console.log("In group: " + group.attr('id'));
        console.log("Slot: " + slot.attr('id'));
        */
    });

    $('.linkHere').click(function() {
        var URL = $(location).attr('href').split('#')[0];
        var seri = serializeGroups();
        URL += "#" + seri;
        prompt("Just copy this link and pass it on (or save it!)", URL);
    });

    parseURL()
    generateURL()

    function getClass(obj) {
        var className = 'undefined';
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

    /*
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
    */

    function createCounters() {
        var counterHtml = '';
        for(var counter in counters) {
            counterHtml += '<span id="' + counter + '">' + counter.replace(/_/g, ' ') + ': <span class="counter"></span><br></span>\n'  
        }
        $('.counters').html(counterHtml);
    }

    function writeCounters() {
        for(var counter in counters) {
            console.log(counter);
            console.log(counters[counter]['total']);
            $('.counters #' + counter + ' .counter').text(counters[counter]['total']);
        }
    }

    function updateCountersFor(className) {
        for(var counter in counters) {
            if (counters[counter]['anyOf'].indexOf(className) !== -1) {
                counters[counter]['total'] += 1;
            }
        }
    }

    function resetCounters() {
        for(var counter in counters) {
            counters[counter]['total'] = 0;
        }
    }

    function serializeGroups() {
        resetCounters();
        var result = '';
        $( ".div_groups li" ).each(function( index ) {
            var block = $( this ).children(".block");
            var className = getClass(block);
            //console.log(index + ": " + className);
            if ( className !== "undefined") {
                updateCountersFor(className);
            }
            //console.log("fisk " + classes[className]);
            result = result + classes[className].toString();  
        });
        console.log("result: " + result);
        //console.log("result62: " + Base62.encode(result));
        //console.log("result62decoded: " + Base62.decode(Base62.encode(result)));
        //return Base62.encode(result);
        return result
    };

    function generateURL() {
        var seri = serializeGroups();
        addToURL("#" + seri);
        writeCounters();
        return seri;
    };

    function parseURL() {
        var param = location.href.substr(location.href.indexOf('#')+1);
        var hash = $(location).attr('hash');
        if (hash.length > 0) {
            hash = hash.replace('#','').split('');
            console.log("full url: " + document.URL);
            console.log("param: " + param);
            console.log("hash: " + hash);
            console.log("indexing hash: " + hash[39]);
            restoreFromHash(hash);         
        }
    }

    function restoreFromHash(hash) {
        $('.slot li').each(function(index) {
            var classChar = hash[index];
            var classAndRole = classes_reversed[classChar];
            var clsname = classAndRole.split('-')[0];
            var role = classAndRole.split('-')[1];
            if (clsname != 'undefined') {
                var clone;

                $('#classes .block').each(function(index) {
                    if ($(this).hasClass(clsname)) {
                        clone = $(this).clone();
                        return false;
                    }
                });

                //clone.draggable({ disabled: true });
                //clone.draggable('enable');
                clone.draggable({
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

                console.log(clone.attr("class")); 
                // ensure we restore the correct role, as the templates start off as assault
                if (!clone.hasClass(role)) {
                    swapRole(clone);
                }

                $(this).append(clone);
                console.log(clone.attr("class"));           
            }

        });

    }

    function swapRole(block) {
        if (block.hasClass('assault')) {
            block.removeClass('assault');
            block.addClass('support');
            for (var className in classes_icons) {
                if (block.hasClass(className)) {
                    var role_icon = block.children();
                    role_icon.removeClass(classes_icons[className]['assault'])
                    role_icon.addClass(classes_icons[className]['support'])
                }
            }
        }
        else if (block.hasClass('support')) {
            block.removeClass('support');
            block.addClass('assault');
            for (var className in classes_icons) {
                if (block.hasClass(className)) {
                    var role_icon = block.children();
                    role_icon.removeClass(classes_icons[className]['support'])
                    role_icon.addClass(classes_icons[className]['assault'])
                }
            }
        }
    }

    function addToURL(addition) {
        window.history.pushState("object or string", "Title", addition);
    }

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