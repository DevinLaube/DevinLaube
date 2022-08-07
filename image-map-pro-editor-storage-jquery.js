;(function ( $, window, document, undefined ) {
    var supported = false;

    $.imp_editor_storage_get_saves_list = function(cb) {
        if (localStorage.editor_saves) {
            var saves = JSON.parse(localStorage.editor_saves);
            var list = new Array();

            for (var i=0; i<saves.length; i++) {
                list.push({
                    id: saves[i].id,
                    name: saves[i].general.name
                });
            }

            cb(list);
        } else {
            cb(new Array());
        }
    }

    $.imp_editor_storage_get_save = function(id, cb) {
        if (localStorage.editor_saves) {
            var saves = JSON.parse(localStorage.editor_saves);
            for (var i=0; i<saves.length; i++) {
                if (saves[i].id == id) {
                    cb(saves[i]);
                }
            }
        } else {
            cb(false);
        }
    }

    $.imp_editor_storage_store_save = function(save, cb) {
        if (!localStorage.editor_saves) {
            localStorage.editor_saves = '[]';
        }

        var currentSaves = JSON.parse(localStorage.editor_saves);
        var updated = false;
        for (var i=0; i<currentSaves.length; i++) {
            if (currentSaves[i].id == save.id) {
                updated = true;
                currentSaves[i] = save;
            }
        }
        if (!updated) {
            currentSaves.push(save);
        }

        localStorage.editor_saves = JSON.stringify(currentSaves);

        cb(true);
    }

    $.imp_editor_storage_delete_save = function(id, cb) {
        if (!localStorage.editor_saves) {
            localStorage.editor_saves = '[]';
        }

        var currentSaves = JSON.parse(localStorage.editor_saves);
        var index = 0;

        for (var i=0; i<currentSaves.length; i++) {
            if (currentSaves[i].id == id) {
                index = i;
                break;
            }
        }

        currentSaves.splice(index, 1);

        localStorage.editor_saves = JSON.stringify(currentSaves);

        cb();
    }
    $.imp_editor_storage_get_last_save = function(cb) {
        if (localStorage.editor_last_save) {
            cb(localStorage.editor_last_save);
        } else {
            cb(false);
        }
    }
    $.imp_editor_storage_set_last_save = function(id, cb) {
        localStorage.editor_last_save = id;
        cb();
    }

    $(document).ready(function() {
        // Support check
        try {
            var storage = window['localStorage'],
            x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            supported = true;
        }
        catch(e) {
            console.log('Local storage is NOT supported!');
            supported = false;
        }
    });
})( jQuery, window, document );
