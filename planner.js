
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

            // When moving blocks in groups we want to clean up after us.
            if(!$(ui.draggable).parent().is('#classes')) {
                $(ui.draggable).remove();
            }
            seri = generateURL();
        },
    });

    $('.div_add li').click(function() {
        var group = $(this).closest('.group');
        // Minus 1 because we have 6 elements in the div_add
        var index = $(this).index() - 1;
        var slot = group.find('.slot li').eq(index);
        var block = slot.children();
        if (block.length == 0) {
            console.log("Tried to switch role for empty slot");
        }
        else if (block.length == 1) {
            swapRole(block);
        }
        else {
            console.log("Unknown error. Length was " + block.length);
        }
        generateURL();
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

    function createCounters() {
        var counterHtml = '';
        for(var counter in counters) {
            counterHtml += '<span id="' + counter + '">' + counter.replace(/_/g, ' ') + ': <span class="counter"></span><br></span>\n'  
        }
        $('.counters').html(counterHtml);
    }

    function writeCounters() {
        for(var counter in counters) {
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
            if ( className !== "undefined") {
                updateCountersFor(className);
            }
            result = result + classes[className].toString();  
        });
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
                // ensure we restore the correct role, as the templates start off as assault
                if (!clone.hasClass(role)) {
                    swapRole(clone);
                }

                $(this).append(clone);         
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