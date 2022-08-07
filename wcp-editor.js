// Webcraft Plugins Ltd.
// Author: Nikolay Dyankov

/*
Class hierarchy and descriptions:

- WCPEditor
The main class.

- WCPEditorForm
An abstract class, containing a list of controls, grouped in tabs.
It will get/set values for the controls in bulk.
It will generate its own HTML code.

- WCPEditorControl
An object, representing a single control. It will have a getter
and a setter.
*/

;(function ($, window, document, undefined) {
    var wcpEditor = undefined;

    function WCPEditor() {
        this.host = $('#wcp-editor');
        this.forms = {};

        this.tooltip = undefined;
        this.modal = undefined;
        this.floatingWindow = undefined;
        this.floatingWindowOptions = undefined;
        this.modalTimeout = undefined;
        this.settingsWindowVisible = false;

        this.loadingScreen = undefined;
        this.loadingScreenTimeout = undefined;

        // Temp vars
        this.saveToDeleteID = undefined;
    }
    WCPEditor.prototype.init = function(options) {
        this.options = options;

        // Build html
        var html = '';        

        // ================================================
        // Settings window
        // ================================================
        var settingsHTML = $.wcpEditorGetSettingsForm();
        var settingsTitle = $.wcpEditorGetSettingsFormTitle();
        // $.wcpFormCreateForm(formOptions);
        html += '<div id="wcp-editor-settings-window-dummy"></div>';
        html += '<div id="wcp-editor-settings-window">';
        html += '   <div id="wcp-editor-settings-window-title">';
        html += '       ' + settingsTitle;
        html += '   </div>';
        html += '   <div id="wcp-editor-settings-window-close">';
        html += '       <i class="fa fa-times" aria-hidden="true"></i>';
        html += '   </div>';
        html +=     settingsHTML;
        html += '</div>';

        // ================================================
        // Editor center
        // ================================================

        html += '<div id="wcp-editor-center-wrap">';

        // ================================================
        // Toolbar
        // ================================================

        html += '<div id="wcp-editor-toolbar-wrap">';

        // Toolbar groups
        for (var i=0; i<this.options.toolbar.length; i++) {
            var t = this.options.toolbar[i];
            html += '   <div class="wcp-editor-toolbar">';

            // Toolbar group buttons
            for (var j=0; j<t.length; j++) {
                var b = t[j];

                html += '<div class="wcp-editor-toolbar-button" data-wcp-editor-toolbar-button-name="'+ b.name +'" data-wcp-tooltip="'+ b.tooltip +'" data-wcp-tooltip-position="right" data-wcp-editor-toolbar-button-kind="'+ b.kind +'">';
                html += '    <div class="wcp-editor-toolbar-button-icon">'+ b.icon +'</div>';
                html += '</div>';
            }
            html += '   </div>';
        }

        html += '</div>';

        // ================================================
        // Main buttons
        // ================================================
        html += '   <div id="wcp-editor-main-buttons">';

        html += '   <div id="wcp-editor-button-new" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-file" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">New</div>';
        html += '   </div>';
        html += '   <div id="wcp-editor-button-save" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-floppy-o" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">Save</div>';
        html += '   </div>';
        html += '   <div id="wcp-editor-button-load" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-sign-out" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">Load</div>';
        html += '   </div>';
        html += '   <div id="wcp-editor-button-settings" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-cog" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">Settings</div>';
        html += '   </div>';
        html += '   <div id="wcp-editor-button-undo" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-undo" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">Undo</div>';
        html += '   </div>';
        html += '   <div id="wcp-editor-button-redo" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-repeat" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">Redo</div>';
        html += '   </div>';
        html += '   <div id="wcp-editor-button-preview" class="wcp-editor-main-button">';
        html += '       <div class="wcp-editor-main-button-icon"><i class="fa fa-eye" aria-hidden="true"></i></div>';
        html += '       <div class="wcp-editor-main-button-text">Preview</div>';
        html += '   </div>';

        // Extra buttons
        for (var i=0; i<this.options.extraMainButtons.length; i++) {
            var b = this.options.extraMainButtons[i];

            var tooltip = '';
            if (b.tooltip) {
                tooltip = 'data-wcp-tooltip="'+ b.tooltip +'" data-wcp-tooltip-position="bottom" ';
            }

            html += '   <div '+ tooltip +' class="wcp-editor-main-button" data-wcp-editor-main-button-name="'+ b.name +'">';
            html += '       <div class="wcp-editor-main-button-icon"><i class="'+ b.icon +'" aria-hidden="true"></i></div>';
            html += '       <div class="wcp-editor-main-button-text">'+ b.title +'</div>';
            html += '   </div>';
        }

        html += '   </div>';

        // ================================================
        // Editor canvas
        // ================================================

        html += '   <div id="wcp-editor-center">';

        var canvasClass = '';
        if (this.options.canvasFill) {
            canvasClass = 'wcp-editor-canvas-fill';
        }

        var canvasStyle = '';
        if (!this.options.canvasFill) {
            canvasStyle += 'width: ' + this.options.canvasWidth + 'px; height: ' + this.options.canvasHeight + 'px;';
        }
        html += '   <div id="wcp-editor-canvas" class="'+ canvasClass +'" style="'+ canvasStyle +'">'+ $.wcpEditorGetContentForCanvas() +'</div>';

        html += '   </div>'; // editor-center
        html += '</div>'; // editor-center-wrap

        // ================================================
        // Editor right
        // ================================================

        html += '<div id="wcp-editor-right">';

        // Object settings
        html += '   <div id="wcp-editor-object-settings"></div>';

        // Object list wrap
        html += '   <div id="wcp-editor-object-list-wrap">';

        // Object list buttons
        html += '       <div id="wcp-editor-object-list-buttons">';
        for (var i=0; i<this.options.objectListButtons.length; i++) {
            var b = this.options.objectListButtons[i];
            html += '       <div class="wcp-editor-object-list-button" data-wcp-editor-object-list-button-name="'+ b.name +'" data-wcp-tooltip="'+ b.tooltip +'" data-wcp-tooltip-position="top"><i class="'+ b.icon +'" aria-hidden="true"></i></div>';
        }
        html += '       </div>';

        // Object list
        html += '       <div id="wcp-editor-object-list"></div>';

        html += '   </div>'; // Close list wrap
        html += '</div>'; // Close editor right

        // Close any remaining floating windows from prev inits
        $('#wcp-editor-floating-window').remove();

        this.host.html(html);

        // Set the list items
        this.setListItems($.wcpEditorGetListItems());

        // Init events
        this.events();

        // Remove class for settings menu
        this.host.removeClass('wcp-settings-window-visible');
    };
    WCPEditor.prototype.events = function () {
        var self = this;

        // Main tab functionality
        $('[data-wcp-main-tab-button-name]').on('click', function() {
            var name = $(this).data('wcp-main-tab-button-name');
            self.openMainTabWithName(name);
        });

        // Main buttons events

        // New
        $(document).off('click', '#wcp-editor-button-new');
        $(document).on('click', '#wcp-editor-button-new', function() {
            $.wcpEditorEventNewButtonPressed();
            // self.presentCreateNewModal();
        });

        // Save
        $(document).off('click', '#wcp-editor-button-save');
        $(document).on('click', '#wcp-editor-button-save', function() {
            $.wcpEditorEventSaveButtonPressed();
        });

        // Load
        $(document).off('click', '#wcp-editor-button-load');
        $(document).on('click', '#wcp-editor-button-load', function() {
            $.wcpEditorEventLoadButtonPressed();
            self.presentLoadModal();
        });

        // Settings
        $(document).off('click', '#wcp-editor-button-settings');
        $(document).on('click', '#wcp-editor-button-settings', function() {
            self.presentSettings();
        });
        $(document).off('click', '#wcp-editor-settings-window-close');
        $(document).on('click', '#wcp-editor-settings-window-close', function() {
            self.presentSettings();
        });

        // Undo
        $(document).off('click', '#wcp-editor-button-undo');
        $(document).on('click', '#wcp-editor-button-undo', function() {
            $.wcpEditorEventUndoButtonPressed();
        });

        // Redo
        $(document).off('click', '#wcp-editor-button-redo');
        $(document).on('click', '#wcp-editor-button-redo', function() {
            $.wcpEditorEventRedoButtonPressed();
        });

        // Preview
        $(document).off('click', '#wcp-editor-button-preview');
        $(document).on('click', '#wcp-editor-button-preview', function() {
            $.wcpEditorEventPreviewButtonPressed();

            if (self.options.previewToggle) {
                if ($(this).hasClass('wcp-active')) {
                    $(this).removeClass('wcp-active');

                    $.wcpEditorEventExitedPreviewMode();
                } else {
                    $(this).addClass('wcp-active');
                    $.wcpEditorEventEnteredPreviewMode();
                }
            }
        });

        // Expand
        $(document).off('click', '#wcp-editor-button-expand');
        $(document).on('click', '#wcp-editor-button-expand', function() {
            $('#wcp-editor-main-buttons').toggleClass('wcp-expanded');
        });

        // Extra main buttons events
        $(document).off('click', '.wcp-editor-main-button');
        $(document).on('click', '.wcp-editor-main-button', function(e) {
            var buttonName = $(this).data('wcp-editor-main-button-name');
            $.wcpEditorEventMainButtonClick(buttonName);

            // Export button
            if (buttonName == 'export') {
                self.presentExportModal();
            }
        });

        // Tools events
        $(document).off('click', '.wcp-editor-toolbar-button');
        $(document).on('click', '.wcp-editor-toolbar-button', function(e) {
            $.wcpEditorEventPressedTool($(this).data('wcp-editor-toolbar-button-name'));

            if ($(this).data('wcp-editor-toolbar-button-kind') == 'button') {
                return;
            }

            $('.wcp-editor-toolbar-button').removeClass('wcp-active');
            $(this).addClass('wcp-active');
            $.wcpEditorEventSelectedTool($(this).data('wcp-editor-toolbar-button-name'));
        });

        // Help button event
        $(document).off('click', '#wcp-editor-help-button');
        $(document).on('click', '#wcp-editor-help-button', function(e) {
            $.wcpEditorEventHelpButtonPressed();
        });


        // List items events
        $(document).off('mouseover', '.wcp-editor-object-list-item');
        $(document).on('mouseover', '.wcp-editor-object-list-item', function(e) {
            $.wcpEditorEventListItemMouseover($(this).data('wcp-editor-object-list-item-id'));
        });

        $(document).off('click', '.wcp-editor-object-list-item');
        $(document).on('click', '.wcp-editor-object-list-item', function(e) {
            if ($(e.target).closest('.wcp-editor-object-list-item-buttons').length == 0) {
                self.selectListItem($(this).data('wcp-editor-object-list-item-id'));

                $.wcpEditorEventListItemSelected($(this).data('wcp-editor-object-list-item-id'));
            }
        });
        $(document).off('click', '.wcp-editor-object-list-button');
        $(document).on('click', '.wcp-editor-object-list-button', function() {
            var buttonName = $(this).data('wcp-editor-object-list-button-name');
            $.wcpEditorEventObjectListButtonPressed(buttonName);
        });

        // Tooltip functionality
        $(document).off('mouseover', '[data-wcp-tooltip]');
        $(document).on('mouseover', '[data-wcp-tooltip]', function(e) {
            $(this).addClass('wcp-visible-tooltip');
            self.showTooltip($(this), $(this).data('wcp-tooltip'), $(this).data('wcp-tooltip-position'));
        });
        $(document).off('mouseout', '[data-wcp-tooltip]');
        $(document).on('mouseout', '[data-wcp-tooltip]', function(e) {
            self.hideTooltip();
        });
        $(document).off('mousemove.wcp-tooltip');
        $(document).on('mousemove.wcp-tooltip', function(e) {
            if ($(e.target).closest('[data-wcp-tooltip]').length == 0 && !$(e.target).attr('data-wcp-tooltip')) {
                self.hideTooltip();
            }
        });

        // Modal events
        $(document).off('click', '#wcp-editor-modal');
        $(document).on('click', '#wcp-editor-modal', function(e) {
            if ($(e.target).attr('id') == 'wcp-editor-modal') {
                self.closeModal();
                var modalName = $('#wcp-editor-modal').data('wcp-editor-modal-name');
                $.wcpEditorEventModalClosed(modalName);
            }
        });
        $(document).off('click', '.wcp-editor-modal-close');
        $(document).on('click', '.wcp-editor-modal-close', function(e) {
            self.closeModal();
            var modalName = $('#wcp-editor-modal').data('wcp-editor-modal-name');
            $.wcpEditorEventModalClosed(modalName);
        });
        $(document).off('click', '.wcp-editor-modal-button');
        $(document).on('click', '.wcp-editor-modal-button', function(e) {
            var modalName = $('#wcp-editor-modal').data('wcp-editor-modal-name');
            var buttonName = $(this).data('wcp-editor-modal-button-name');
            $.wcpEditorEventModalButtonClicked(modalName, buttonName);
        });
        $(document).off('click', '#button-loading-screen-close');
        $(document).on('click', '#button-loading-screen-close', function() {
            self.hideLoadingScreen();
        });

        // Load modal list item
        $(document).off('click', '.wcp-editor-save-list-item');
        $(document).on('click', '.wcp-editor-save-list-item', function() {
            var saveID = $(this).parent().data('wcp-editor-save-list-item-id');
            $.wcpEditorEventLoadSaveWithID(saveID);
            self.closeModal();
        });
        // Load modal delete button
        $(document).off('click', '.wcp-editor-save-list-item-delete-button');
        $(document).on('click', '.wcp-editor-save-list-item-delete-button', function() {
            self.saveToDeleteID = $(this).parent().data('wcp-editor-save-list-item-id');

            self.closeModal();

            // Present delete save confirmation modal
            self.presentDeleteSaveConfirmationModal();
        });
        // Save delete modal cancel
        $(document).off('click', '#wcp-editor-cancel-delete-save');
        $(document).on('click', '#wcp-editor-cancel-delete-save', function() {
            self.presentLoadModal();
        });
        // Save delete modal confirm
        $(document).off('click', '#wcp-editor-confirm-delete-save');
        $(document).on('click', '#wcp-editor-confirm-delete-save', function() {
            $.wcpEditorEventDeleteSaveWithID(self.saveToDeleteID, function() {
                self.presentLoadModal();
            });
        });

        // List items reorder
        var iex = 0, iey = 0, ix = 0, iy = 0;
        var shouldStartDragging = false, didStartDragging = false, dragThreshold = 5;
        var dragMap = [], startingItemIndex = -1, currentItemIndex = -1, startingItemModelIndex = -1, currentItemModelIndex = -1;
        var draggedListItem = undefined, listItemCopy = undefined;
        var draggedListItemWidth = 0;
        var draggedListItemHeight = 0;
        var listScroll = 0;

        $(document).off('mousedown', '.wcp-editor-object-list-item');
        $(document).on('mousedown', '.wcp-editor-object-list-item', function(e) {
            iex = e.pageX;
            iey = e.pageY;

            shouldStartDragging = true;
            draggedListItem = $(this);

            // Set the startingItemIndex
            startingItemIndex = draggedListItem.data('wcp-editor-object-list-item-index');
            startingItemModelIndex = draggedListItem.data('wcp-editor-object-list-item-model-index');

            // Cache some variables
            draggedListItemWidth = draggedListItem.outerWidth();
            draggedListItemHeight = draggedListItem.outerHeight();

            // Cache the list scroll
            listScroll = $('#wcp-editor-object-list').scrollTop();
        });

        $(document).off('mousemove.wcp-editor-object-list-item-reorder');
        $(document).on('mousemove.wcp-editor-object-list-item-reorder', function(e) {
            var dx = Math.abs(e.pageX - iex);
            var dy = Math.abs(e.pageY - iey);

            if (!didStartDragging && shouldStartDragging && (dx > dragThreshold || dy > dragThreshold)) {
                didStartDragging = true;

                // Create a copy of the list item at the current mouse position
                listItemCopy = draggedListItem.clone();
                listItemCopy.addClass('wcp-editor-object-dragged-list-item');
                listItemCopy.css({
                    width: draggedListItemWidth,
                    left: draggedListItem.offset().left,
                    top: draggedListItem.offset().top
                });

                ix = draggedListItem.offset().left;
                iy = draggedListItem.offset().top;

                $('body').prepend(listItemCopy);

                // Wrap the listItemCopy in an element to prevent it from going
                // beyond the boundaries of the document
                listItemCopy.wrap('<div class="wcp-editor-object-dragged-list-item-wrap"></div>');

                // Create a virtual map of every possible position of the item
                // using an invisible dummy item of the same dimentions
                var tempElHtml = '<div id="wcp-editor-object-list-item-invisible-tmp" style="width: '+ draggedListItemWidth +'px; height: '+ draggedListItemHeight +'px; position: relative;"></div>';
                var numberOfListItems = $('#wcp-editor-object-list .wcp-editor-object-list-item').length;
                
                for (var i=0; i<numberOfListItems; i++) {
                    // Insert temp el
                    $('#wcp-editor-object-list .wcp-editor-object-list-item[data-wcp-editor-object-list-item-index="'+ i +'"]').before(tempElHtml);

                    // Store its position
                    dragMap.push($('#wcp-editor-object-list-item-invisible-tmp').offset().top + draggedListItemHeight/2);

                    // Delete it
                    $('#wcp-editor-object-list-item-invisible-tmp').remove();
                }

                // Hide the draggedListItem
                draggedListItem.hide();
            }

            if (didStartDragging) {
                clearSelection();

                // Update the position of the listItemCopy
                listItemCopy.css({
                    left: ix - (iex - e.pageX),
                    top: iy - (iey - e.pageY)
                });

                // Check which is the closest map point from the virtual map
                var closestIndex = -1;
                var smallestDistance = 99999;
                var listItemCopyOffsetTop = listItemCopy.offset().top + draggedListItemHeight/2;

                for (var i=0; i<dragMap.length; i++) {
                    var distance = Math.abs(listItemCopyOffsetTop - dragMap[i]);

                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        closestIndex = i;
                    }
                }

                // If the map point has a different index from the currentItemIndex,
                // then insert a visible dummy element at that position
                if (currentItemIndex != closestIndex) {
                    // Remove the current temp element
                    $('#wcp-editor-object-list-item-visible-tmp').remove();

                    var visibleDummyElementHTML = '<div id="wcp-editor-object-list-item-visible-tmp" style="width: '+ draggedListItemWidth +'px; height: '+ draggedListItemHeight +'px;"><div id="wcp-editor-object-list-item-visible-tmp-inner"></div></div>';

                    if (closestIndex < startingItemIndex) {
                        $('#wcp-editor-object-list .wcp-editor-object-list-item[data-wcp-editor-object-list-item-index="'+ closestIndex +'"]').before(visibleDummyElementHTML);
                    } else {
                        $('#wcp-editor-object-list .wcp-editor-object-list-item[data-wcp-editor-object-list-item-index="'+ closestIndex +'"]').after(visibleDummyElementHTML);
                    }

                    // Set the currentItemIndex to the new index
                    currentItemIndex = closestIndex;
                }

                // Preserve the list scroll
                $('#wcp-editor-object-list').scrollTop(listScroll);
            }
        });

        $(document).off('mouseup.wcp-editor-object-list-item-reorder');
        $(document).on('mouseup.wcp-editor-object-list-item-reorder', function() {
            if (didStartDragging) {
                // Delete temporary items
                $('.wcp-editor-object-dragged-list-item').remove();
                $('.wcp-editor-object-dragged-list-item-wrap').remove();
                $('#wcp-editor-object-list-item-visible-tmp').remove();

                // Show the hidden original list item
                draggedListItem.show();

                // Send an event that the order of the items changed
                currentItemModelIndex = $('[data-wcp-editor-object-list-item-index="'+ currentItemIndex +'"]').data('wcp-editor-object-list-item-model-index');

                $.wcpEditorEventListItemMoved(startingItemModelIndex, currentItemModelIndex);
            }

            // Clean up
            shouldStartDragging = false;
            didStartDragging = false;
            startingItemIndex = -1;
            currentItemIndex = -1;
            dragMap = [];
        });

        // Close floating window
        $(document).off('click', '.wcp-editor-floating-window-close');
        $(document).on('click', '.wcp-editor-floating-window-close', function() {
            self.closeFloatingWindow();
        });

        // Drag floating window
        var shouldStartDraggingWindow = false;
        var didStartDraggingWindow = false;
        var ix = 0, iy = 0, initialWindowX = 0, initialWindowY = 0;
        var floatingWindowWidth, windowWidth, floatingWindowHeight, windowHeight;

        $(document).off('mousedown.drag-floating-window');
        $(document).on('mousedown.drag-floating-window', '.wcp-editor-floating-window-header', function(e) {
            if (!$(e.target).hasClass('.wcp-editor-floating-window-close') && $(e.target).closest('.wcp-editor-floating-window-close').length == 0) {
                shouldStartDraggingWindow = true;
            }
        });
        
        $(document).on('mousemove.drag-floating-window');
        $(document).on('mousemove.drag-floating-window', function(e) {
            if (shouldStartDraggingWindow) {
                shouldStartDraggingWindow = false;
                didStartDraggingWindow = true;
                ix = e.pageX;
                iy = e.pageY;

                initialWindowX = self.floatingWindow.offset().left;
                initialWindowY = self.floatingWindow.offset().top;

                floatingWindowWidth = self.floatingWindow.width();
                floatingWindowHeight = self.floatingWindow.height();

                windowWidth = $(window).width();
                windowHeight = $(window).height();
            }

            if (didStartDraggingWindow) {
                var dx = e.pageX - ix;
                var dy = e.pageY - iy;

                var x = initialWindowX + dx;
                var y = initialWindowY + dy;

                // fit floating window in viewport
                if (x < 10) x = 10;
                if (y < 70) y = 70;
                if (x + floatingWindowWidth > windowWidth) {
                    x = windowWidth - floatingWindowWidth - 10;
                }
                if (y + floatingWindowHeight > windowHeight) {
                    y = windowHeight - floatingWindowHeight - 10;
                }
                
                self.floatingWindow.css({
                    left: x,
                    top: y
                });
            }
        });

        $(document).on('mouseup.drag-floating-window');
        $(document).on('mouseup.drag-floating-window', function(e) {
            shouldStartDraggingWindow = false;
            didStartDraggingWindow = false;
        });

        $(document).off('keyup.wcp-editor');
        $(document).on('keyup.wcp-editor', function(e) {
            if (e.keyCode == 13) {
                if (self.modal) {
                    self.modalPressPrimaryButton();
                }
            }
        });
    };
    WCPEditor.prototype.setObjectSettingsContent = function(html) {
        $('#wcp-editor-object-settings').html(html);
    };
    WCPEditor.prototype.presentModal = function(options) {
        clearTimeout(this.modalTimeout);

        if ($('#wcp-editor-modal').length == 0) {
            var html = '';
            
            html += '<div id="wcp-editor-modal">';
            html += '   <div class="wcp-editor-modal-body" style="width: '+ options.width +'px;">';
            html += '       <div class="wcp-editor-modal-close"><i class="fa fa-times" aria-hidden="true"></i></div>';
            html += '       <div class="wcp-editor-modal-header"></div>';
            html += '       <div class="wcp-editor-modal-content"></div>';
            html += '       <div class="wcp-editor-modal-footer"></div>';
            html += '       </div>';
            html += '   </div>';
            html += '</div>';

            $('body').append(html);
            this.modal = $('#wcp-editor-modal');
        }
        if (!this.modal) {
            this.modal = $('#wcp-editor-modal');
        }

        // Set the data-name
        this.modal.data('wcp-editor-modal-name', options.name);

        // Set the title
        this.modal.find('.wcp-editor-modal-header').html(options.title);

        // Set the body
        this.modal.find('.wcp-editor-modal-content').html(options.body);

        // Set the buttons
        var buttonHtml = '';
        for (var i=0; i<options.buttons.length; i++) {
            var buttonClass = '';
            var buttonId = '';

            if (options.buttons[i].class == 'primary') {
                buttonClass = 'wcp-editor-modal-button-primary';
            }
            if (options.buttons[i].class == 'danger') {
                buttonClass = 'wcp-editor-modal-button-danger';
            }

            if (options.buttons[i].id) {
                buttonId = options.buttons[i].id;
            }

            buttonHtml += '<div class="wcp-editor-modal-button '+ buttonClass +'" id="'+ buttonId +'" data-wcp-editor-modal-button-name="'+ options.buttons[i].name +'">'+ options.buttons[i].title +'</div>'
        }

        this.modal.find('.wcp-editor-modal-footer').html(buttonHtml);

        // Show modal
        var self = this;
        self.modal.css({ 
            display: 'flex'
        });
        
        if (options.width) {
            self.modal.find('.wcp-editor-modal-body').css({ width: options.width });
        } else {
            self.modal.find('.wcp-editor-modal-body').css({ width: 'auto' });
        }
        setTimeout(function() {
            self.modal.addClass('wcp-editor-modal-visible');
        }, 10);
    };
    WCPEditor.prototype.closeModal = function() {
        var self = this;
        
        if (this.modal && this.modal.hasClass('wcp-editor-modal-visible')) {
            this.modal.removeClass('wcp-editor-modal-visible');

            this.modalTimeout = setTimeout(function() {
                self.modal.hide();
            }, 330);
        }
    };
    WCPEditor.prototype.modalPressPrimaryButton = function() {
        // Is modal active?
        if (this.modal && this.modal.hasClass('wcp-editor-modal-visible')) {
            // Submit event
            var modalName = $('#wcp-editor-modal').data('wcp-editor-modal-name');
            $.wcpEditorEventModalButtonClicked(modalName, 'primary');

            if (modalName == 'confirmation') {
                var self = this;
                $.wcpEditorEventDeleteSaveWithID(self.saveToDeleteID, function() {
                    self.presentLoadModal();
                });
            }
        }
    };
    WCPEditor.prototype.presentLoadModal = function() {
        var self = this;

        this.presentLoadingScreenWithText('Loading Saves...');

        $.wcpEditorGetSaves(function(savesList) {
            
            var modalBody = '';

            for (var i=0; i<savesList.length; i++) {
                modalBody += '  <div class="wcp-editor-save-list-item-wrap" data-wcp-editor-save-list-item-name="'+ savesList[i].name +'" data-wcp-editor-save-list-item-id="'+ savesList[i].id +'">';
                modalBody += '      <div class="wcp-editor-save-list-item">'+ savesList[i].name +'</div>';
                modalBody += '      <div class="wcp-editor-save-list-item-delete-button"><i class="fa fa-trash-o" aria-hidden="true"></i></div>';
                modalBody += '  </div>';
            }

            var modalOptions = {
                name: 'load',
                title: 'Load',
                buttons: [
                    {
                        name: 'cancel',
                        title: 'Cancel',
                        class: '',
                    },
                ],
                body: modalBody
            };

            self.hideLoadingScreen();
            self.presentModal(modalOptions);
        });
    };
    WCPEditor.prototype.presentDeleteSaveConfirmationModal = function() {
        var modalOptions = {
            name: 'confirmation',
            title: 'Delete Save',
            buttons: [
                {
                    name: 'cancel',
                    title: 'Cancel',
                    class: '',
                    id: 'wcp-editor-cancel-delete-save'
                },
                {
                    name: 'primary',
                    title: 'Delete',
                    class: 'danger',
                    id: 'wcp-editor-confirm-delete-save'
                },
            ],
            body: 'Are you sure you want to permanently delete this save?'
        };

        this.presentModal(modalOptions);
    };
    WCPEditor.prototype.presentExportModal = function() {
        // var html = '';

        // html += '<div class="wcp-editor-form-control">';
        // html += '   <label for="wcp-editor-textarea-export">Copy this code to import it later:</label>';
        // html += '   <textarea id="wcp-editor-textarea-export">'+ $.wcpEditorGetExportJSON() +'</textarea>';
        // html += '</div>';

        $.wcpFormCreateForm({
            name: 'Export',
            controls: [
                {
                    type: 'info',
                    name: 'info',
                    title: 'info',
                    value: 'Copy this code to import it later in this editor.',
                    options: { style: 'blue' }
                },
                {
                    type: 'textarea',
                    name: 'code',
                    title: 'Code',
                    value: $.wcpEditorGetExportJSON()
                }
            ]
        });

        var modalOptions = {
            name: 'export',
            title: 'Export',
            buttons: [
                {
                    name: 'primary',
                    title: 'Done',
                    class: 'primary',
                }
            ],
            body: $.wcpFormGenerateHTMLForForm('Export')
        };

        this.presentModal(modalOptions);
        $.wcpFormUpdateForm('Export');

        // Select the text
        $('.wcp-editor-modal-content textarea').get(0).select();
    };
    WCPEditor.prototype.presentSettings = function() {
        if (!this.settingsWindowVisible) {
            this.settingsWindowVisible = true;
            
            $('#wcp-editor-settings-window-dummy').css({ width: 350 });
            this.host.toggleClass('wcp-settings-window-visible');

            setTimeout(function() {
                $.wcpEditorSettingsWindowOpened();
            }, 250);
        } else {
            this.settingsWindowVisible = false;
            $('#wcp-editor-settings-window-dummy').css({ width: 0 });
            this.host.toggleClass('wcp-settings-window-visible');

            setTimeout(function() {
                $.wcpEditorSettingsWindowClosed();
            }, 250);
        }
    };
    WCPEditor.prototype.setContentForCanvas = function(content) {
        $('#wcp-editor-canvas').html(content);
    };
    WCPEditor.prototype.setListItems = function(listItems) {
        // Preserve scroll
        var s = $('#wcp-editor-object-list').scrollTop();

        // Populate the list
        var html = '';
        html += '<div id="wcp-editor-list">';
        for (var i=0; i<listItems.length; i++) {
            html += '<div class="wcp-editor-object-list-item" id="wcp-editor-object-list-item-'+ listItems[i].id +'" data-wcp-editor-object-list-item-index="'+ i +'" data-wcp-editor-object-list-item-model-index="'+ listItems[i].modelIndex +'" data-wcp-editor-object-list-item-id="'+ listItems[i].id +'">';
            html += '    <div class="wcp-editor-object-list-item-title">'+ listItems[i].title +'</div>';
            html += '</div>';
        }
        html += '</div>';

        $('#wcp-editor-object-list').html(html);

        // Restore scroll
        $('#wcp-editor-object-list').scrollTop(s);
    };
    WCPEditor.prototype.selectListItem = function(listItemId) {
        $('.wcp-editor-object-list-item').removeClass('wcp-active');
        $('#wcp-editor-object-list-item-' + listItemId).addClass('wcp-active');

        // Adjust list scroll position to show the selected list item
        
    };
    WCPEditor.prototype.showTooltip = function(element, text, tooltipPosition) {
        if ($('#wcp-editor-tooltip').length == 0) {
            $('body').append('<div id="wcp-editor-tooltip"></div>');
            this.tooltip = $('#wcp-editor-tooltip');
        }
        if (!this.tooltip) {
            this.tooltip = $('#wcp-editor-tooltip');
        }

        // Set the text
        this.tooltip.html(text);

        // Show (invisible)
        this.tooltip.show();

        // Set the position
        var x = 0;
        var y = 0;
        var tooltipSpacing = 12;

        if (tooltipPosition == 'left') {
            x = element.offset().left - this.tooltip.outerWidth() - tooltipSpacing;
            y = element.offset().top + element.outerHeight()/2 - this.tooltip.outerHeight()/2;
        }
        if (tooltipPosition == 'right') {
            x = element.offset().left + element.outerWidth() + tooltipSpacing;
            y = element.offset().top + element.outerHeight()/2 - this.tooltip.outerHeight()/2;
        }
        if (tooltipPosition == 'top') {
            x = element.offset().left + element.outerWidth()/2 - this.tooltip.outerWidth()/2;
            y = element.offset().top - this.tooltip.outerHeight() - tooltipSpacing;
        }
        if (tooltipPosition == 'bottom') {
            x = element.offset().left + element.outerWidth()/2 - this.tooltip.outerWidth()/2;
            y = element.offset().top + element.outerHeight() + tooltipSpacing;
        }
        
        this.tooltip.css({
            left: x,
            top: y
        });

        // Set tooltip position class
        if (tooltipPosition == 'left') {
            this.tooltip.removeClass('wcp-editor-tooltip-left');
            this.tooltip.removeClass('wcp-editor-tooltip-right');
            this.tooltip.removeClass('wcp-editor-tooltip-top');
            this.tooltip.removeClass('wcp-editor-tooltip-bottom');

            this.tooltip.addClass('wcp-editor-tooltip-left');
        }
        if (tooltipPosition == 'right') {
            this.tooltip.removeClass('wcp-editor-tooltip-left');
            this.tooltip.removeClass('wcp-editor-tooltip-right');
            this.tooltip.removeClass('wcp-editor-tooltip-top');
            this.tooltip.removeClass('wcp-editor-tooltip-bottom');

            this.tooltip.addClass('wcp-editor-tooltip-right');
        }
        if (tooltipPosition == 'top') {
            this.tooltip.removeClass('wcp-editor-tooltip-left');
            this.tooltip.removeClass('wcp-editor-tooltip-right');
            this.tooltip.removeClass('wcp-editor-tooltip-top');
            this.tooltip.removeClass('wcp-editor-tooltip-bottom');

            this.tooltip.addClass('wcp-editor-tooltip-top');
        }
        if (tooltipPosition == 'bottom') {
            this.tooltip.removeClass('wcp-editor-tooltip-left');
            this.tooltip.removeClass('wcp-editor-tooltip-right');
            this.tooltip.removeClass('wcp-editor-tooltip-top');
            this.tooltip.removeClass('wcp-editor-tooltip-bottom');

            this.tooltip.addClass('wcp-editor-tooltip-bottom');
        }

        // Constrain to window
        if (this.tooltip.offset().left + this.tooltip.outerWidth() > window.innerWidth) {
            this.tooltip.css({
                left: window.innerWidth - this.tooltip.outerWidth() - 5
            });
        }
        if (this.tooltip.offset().left < 0) {
            this.tooltip.css({
                left: 0
            });
        }
        if (this.tooltip.offset().top + this.tooltip.outerHeight() > window.innerHeight) {
            this.tooltip.css({
                top: window.innerHeight - this.tooltip.outerHeight() - 5
            });
        }
        if (this.tooltip.offset().top < 0) {
            this.tooltip.css({
                top: 0
            });
        }

        // Show (visible)
        this.tooltip.addClass('wcp-editor-tooltip-visible');
    }
    WCPEditor.prototype.hideTooltip = function() {
        if (this.tooltip) {
            this.tooltip.hide();
            this.tooltip.removeClass('wcp-editor-tooltip-visible');
        }
    }
    WCPEditor.prototype.presentLoadingScreenWithText = function(text) {
        clearTimeout(this.loadingScreenTimeout);
        
        if ($('#wcp-editor-loading-screen').length == 0) {
            var html = '';

            html += '<div id="wcp-editor-loading-screen">';
            html += '   <div id="wcp-editor-loading-screen-icon"><i class="fa fa-circle-o-notch fa-spin"></i></div>';
            html += '   <div id="wcp-editor-loading-screen-text"></div>';
            html += '</div>';

            $('body').append(html);

            this.loadingScreen = $('#wcp-editor-loading-screen');
        }
        if (!this.loadingScreen) {
            this.loadingScreen = $('#wcp-editor-loading-screen');
        }

        this.loadingScreen.css({ display: 'flex' });

        // Change icon
        $('#wcp-editor-loading-screen-icon').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

        // Change text
        $('#wcp-editor-loading-screen-text').html(text);

        var self = this;
        setTimeout(function() {
            self.loadingScreen.addClass('wcp-editor-loading-screen-visible');
        }, 10);
    }
    WCPEditor.prototype.updateLoadingScreenMessage = function(text) {
        $('#wcp-editor-loading-screen-text').html(text);
    };
    WCPEditor.prototype.hideLoadingScreen = function() {
        if (!this.loadingScreen) {
            this.loadingScreen = $('#wcp-editor-loading-screen');
        }
        this.loadingScreen.removeClass('wcp-editor-loading-screen-visible');

        var self = this;
        this.loadingScreenTimeout = setTimeout(function() {
            self.loadingScreen.hide();
        }, 250);
    }
    WCPEditor.prototype.hideLoadingScreenWithText = function(text, error, manualClose) {
        var self = this;

        // Change text
        if (manualClose) {
            text += '<div class="wcp-editor-control-button" id="button-loading-screen-close">Close</div>';
        }

        $('#wcp-editor-loading-screen-text').html(text);

        // Change icon
        if (error) {
            $('#wcp-editor-loading-screen-icon').html('<i class="fa fa-times"></i>');
        } else {
            $('#wcp-editor-loading-screen-icon').html('<i class="fa fa-check"></i>');
        }

        if (!manualClose) {
            setTimeout(function() {
                self.hideLoadingScreen();
            }, 1000);
        }
    }
    WCPEditor.prototype.selectTool = function(toolName) {
        $('.wcp-editor-toolbar-button').removeClass('wcp-active');
        $('[data-wcp-editor-toolbar-button-name="'+ toolName +'"]').addClass('wcp-active');

        $.wcpEditorEventSelectedTool(toolName);
    }
    WCPEditor.prototype.setPreviewModeOn = function() {
        $('#wcp-editor-button-preview').addClass('wcp-active');
    }
    WCPEditor.prototype.setPreviewModeOff = function() {
        $('#wcp-editor-button-preview').removeClass('wcp-active');
    }
    WCPEditor.prototype.showExtraMainButton = function(buttonName) {
        // Shows an extra main button using the button's name 
        // as specified during initialization

        $('[data-wcp-editor-main-button-name=' + buttonName + ']').show();
    }
    WCPEditor.prototype.hideExtraMainButton = function(buttonName) {
        // Hides an extra main button using the button's name 
        // as specified during initialization

        $('[data-wcp-editor-main-button-name=' + buttonName + ']').hide();
    }
    WCPEditor.prototype.createFloatingWindow = function(options) {
        if (this.floatingWindow) {
            this.floatingWindow.remove();
            this.floatingWindow = undefined;
        }

        var padding = 'with-padding';

        if (!options.padding) {
            padding = '';
        }

        var html = '';

        html += '<div id="wcp-editor-floating-window">';
        html += '   <div class="wcp-editor-floating-window-header">';
        html += '       ' + options.title;
        html += '       <div class="wcp-editor-floating-window-close"><i class="fa fa-times" aria-hidden="true"></i></div>';
        html += '   </div>';
        html += '   <div class="wcp-editor-floating-window-body '+ padding +'" style="max-height: '+ ($(window).height() - 20 - 50) +'px; ">'+ options.content +'</div>';
        html += '</div>';

        $('body').append(html);
        this.floatingWindow = $('#wcp-editor-floating-window');
        this.floatingWindow.css({
            width: options.width
        });

        // fit floating window in viewport
        if (options.x < 10) options.x = 10;
        if (options.y < 70) options.y = 70;
        if (options.x + this.floatingWindow.width() > $(window).width()) {
            options.x = $(window).width() - this.floatingWindow.width() - 10;
        }
        if (options.y + this.floatingWindow.height() > $(window).height()) {
            options.y = $(window).height() - this.floatingWindow.height() - 10;
        }

        this.floatingWindow.css({
            left: options.x,
            top: options.y
        });

        this.floatingWindowOptions = options;
    }
    WCPEditor.prototype.closeFloatingWindow = function() {
        if (this.floatingWindow) {
            this.floatingWindow.remove();
            this.floatingWindow = undefined;

            $.wcpEditorEventFloatingWindowClosed(this.floatingWindowOptions.title);
            this.floatingWindowOptions = undefined;
        }
    }
    WCPEditor.prototype.isFloatingWindowOpen = function() {
        if (this.floatingWindow) return true;

        return false;
    }

    // Utility
    function clearSelection() {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    // API =====================================================================

    // Basic initialization of the editor. Builds UI.
    $.wcpEditorInit = function(options) {
        var defaultOptions = {
            canvasFill: false,
            canvasWidth: 800,
            canvasHeight: 600,
            mainTabs: [], // Objects { name: 'Name', icon: 'fa fa-icon-name', title: 'The Title' }
            toolbarButtons: [], // Objects { name: 'Name', icon: 'fa fa-icon-name', title: 'The Title' }
            extraMainButtons: [], // Objects { name: 'Name', icon: 'fa fa-icon-name', title: 'The Title' }
            listItemButtons: [], // Objects { name: 'Name', icon: 'fa fa-icon-name', title: 'The Title' }
            newButton: true,
            previewToggle: true
        };
        wcpEditor = new WCPEditor();
        wcpEditor.init($.extend(true, {}, defaultOptions, options));
    };

    // Sets content for the "object settings" section
    $.wcpEditorSetObjectSettingsContent = function(html) {
        wcpEditor.setObjectSettingsContent(html);
    }

    // Inserts content in the canvas
    $.wcpEditorSetContentForCanvas = function(content) {
        wcpEditor.setContentForCanvas(content);
    };

    // Updates list items
    $.wcpEditorSetListItems = function(listItems) {
        wcpEditor.setListItems(listItems);
    }

    // Selects a list item
    $.wcpEditorSelectListItem = function(listItemId) {
        wcpEditor.selectListItem(listItemId);
    }

    // Selects a tool
    $.wcpEditorSelectTool = function(toolName) {
        wcpEditor.selectTool(toolName);
    }

    // Present loading screen
    $.wcpEditorPresentLoadingScreen = function(text) {
        wcpEditor.presentLoadingScreenWithText(text);
    }
    $.wcpEditorUpdateLoadingScreenMessage = function(text) {
        wcpEditor.updateLoadingScreenMessage(text);
    }
    $.wcpEditorHideLoadingScreen = function() {
        wcpEditor.hideLoadingScreen();
    }
    $.wcpEditorHideLoadingScreenWithMessage = function(text, error, manualClose) {
        wcpEditor.hideLoadingScreenWithText(text, error, manualClose);
    }

    // Present load modal
    $.wcpEditorPresentLoadModal = function() {
        wcpEditor.presentLoadModal();
    }

    // Present modal
    $.wcpEditorPresentModal = function(options) {
        var modalDefaults = {
            title: '',
            buttons: [

            ],
            body: ''
        };

        wcpEditor.presentModal($.extend(true, {}, modalDefaults, options));
    }

    // Close modal
    $.wcpEditorCloseModal = function() {
        wcpEditor.closeModal();
    }

    // Set preview mode
    $.wcpEditorSetPreviewModeOn = function() {
        wcpEditor.setPreviewModeOn();
    }
    $.wcpEditorSetPreviewModeOff = function() {
        wcpEditor.setPreviewModeOff();
    }

    // Show/hide extra main buttons
    $.wcpEditorShowExtraMainButton = function(buttonName) {
        wcpEditor.showExtraMainButton(buttonName);
    }
    $.wcpEditorHideExtraMainButton = function(buttonName) {
        wcpEditor.hideExtraMainButton(buttonName);
    }

    // Create new floating window
    $.wcpEditorCreateFloatingWindow = function(options) {
        // var options = { x: 0, y: 0, width: 0, padding: true/false, title: '', content: '' };
        wcpEditor.createFloatingWindow(options);
    }

    // Close floating window
    $.wcpEditorCloseFloatingWindow = function() {
        wcpEditor.closeFloatingWindow();
    }

    // Check if there is an open floating window
    $.wcpEditorIsFloatingWindowOpen = function() {
        return wcpEditor.isFloatingWindowOpen();
    }

    // BOILERPLATE CODE FOR IMPLEMENTING REQUIRED API FUNCTIONS ****************
    // *************************************************************************

    // [data source] Called on initialization:
    $.wcpEditorGetContentForCanvas = function() {

    }
    $.wcpEditorGetListItems = function() {
        // Returns an array of objects in the format { id: 'id', title: 'title' }
    }
    // [data source] Get a list of saves
    $.wcpEditorGetSaves = function(callback) {
        // Format: [ { name: 'name', id: 'id' }, ... ]

    }
    // [data source] Provide encoded JSON for export
    $.wcpEditorGetExportJSON = function() {
        return '{}';
    }
    // [data source] Settings form content
    $.wcpEditorGetSettingsForm = function() {

    }
    // [data source] Settings form title
    $.wcpEditorGetSettingsFormTitle = function() {

    }

    // Main button events
    $.wcpEditorEventNewButtonPressed = function() {

    }
    $.wcpEditorEventSaveButtonPressed = function() {

    }
    $.wcpEditorEventLoadButtonPressed = function() {

    }
    $.wcpEditorEventUndoButtonPressed = function() {

    }
    $.wcpEditorEventRedoButtonPressed = function() {

    }
    $.wcpEditorEventPreviewButtonPressed = function() {

    }
    $.wcpEditorEventEnteredPreviewMode = function() {

    }
    $.wcpEditorEventExitedPreviewMode = function() {

    }

    // List events
    $.wcpEditorEventListItemMouseover = function(itemID) {

    }
    $.wcpEditorEventListItemSelected = function(itemID) {

    }
    $.wcpEditorEventListItemMoved = function(oldIndex, newIndex) {

    }
    $.wcpEditorEventObjectListButtonPressed = function(itemID, buttonName) {

    }

    // Tool events
    $.wcpEditorEventSelectedTool = function(toolName) {

    }
    $.wcpEditorEventPressedTool = function(toolName) {

    }

    // Extra main button events
    $.wcpEditorEventMainButtonClick = function(buttonName) {

    }

    // Modal events
    $.wcpEditorEventModalButtonClicked = function(modalName, buttonName) {

    }
    $.wcpEditorEventModalClosed = function(modalName) {

    }

    // Event for loading a save
    $.wcpEditorEventLoadSaveWithID = function(saveID) {

    }

    // Event for deleting a save
    $.wcpEditorEventDeleteSaveWithID = function(saveID) {

    }

    // Event for help button
    $.wcpEditorEventHelpButtonPressed = function() {

    }

    // Event when floating window closed 
    $.wcpEditorEventFloatingWindowClosed = function(windowTitle) {

    }

    // Event when settings window opened
    $.wcpEditorSettingsWindowOpened = function() {
        
    }
    // Event when settings window opened
    $.wcpEditorSettingsWindowClosed = function() {

    }

})(jQuery, window, document);
