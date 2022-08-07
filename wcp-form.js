/*
Usage:

1. Register a form with premade controls (wcp-form-controls)
2. Request HTML for the form and insert it in the app
3. Whenever the form's values change, the form will send an event with the updated module

*/

/*
        
Example:

$.wcpFormCreateForm({
    name: 'Image Map Settings',
    controlGroups: [
        {
            groupName: 'general',
            groupTitle: 'General',
            groupIcon: 'fa fa-cog',
            controls: [
                {
                    label_width: 50, // Optional, default = auto
                    span: 1, // 1 = 100% width, 2 = 50% width, 3 = 33% width, 4 = 25% width
                    type: 'text',
                    name: 'image_map_name',
                    title: 'Image Map Name',
                    value: $.imageMapProDefaultSettings.general.name
                },
                {
                    type: 'divider',
                    title: 'Title'
                }
            ]
        }
    ]
});

Controls list:

- int
- float
- text
- textarea
- checkbox
- color
- select
    options: [
        { value: 'value-name', title: 'Value Title' },
        { value: 'value-name', title: 'Value Title' },
        { value: 'value-name', title: 'Value Title' },
        { value: 'value-name', title: 'Value Title' },
    ]
- box-model
- slider
    options: { min: 0, max: 1, type: 'float/int' }
- grid-system
- switch
- button group
    options: [
        { value: 'button-value', title: 'Button Title' },
        { value: 'button-value', title: 'Button Title' },
        { value: 'button-value', title: 'Button Title' },
    ],
- button 
    options: { event_name: 'event-name' }
- wcp-media-upload
- object
- fullscreen-button-position
- layers-list
- info
    options: {
        style: 'blue' // blue/red/green/yellow
    }

*/

;(function ($, window, document, undefined) {
    var forms = {};
    var registeredControls = {};

    // ===============================
    // API
    // ===============================

    // EVENTS

    // FUNCTIONS
    $.wcpFormRegisterControl = function(options) {
        registeredControls[options.type] = options;
    };
    $.wcpFormGenerateHTMLForForm = function(formName) {
        return forms[formName].getFormHTML();
    }
    $.wcpFormCreateForm = function(options) {
        var form = new WCPForm(options);
        forms[options.name] = form;
    }
    $.wcpFormUpdateForm = function(formName) {
        forms[formName].updateForm();
    };
    $.wcpFormGetModel = function(formName) {
        return forms[formName].getModel();
    }
    $.wcpFormSetModel = function(formName, model) {
        forms[formName].setModel(model);
    }
    $.wcpFormSetControlValue = function(formName, controlName, v, force) {
        forms[formName].setControlValue(controlName, v, force);
    }
    $.wcpFormShowControl = function(formName, controlName) {
        forms[formName].showControl(controlName);
    }
    $.wcpFormHideControl = function(formName, controlName) {
        forms[formName].hideControl(controlName);
    }
    $.wcpFormShowControlsGroup = function(formName, groupName) {
        forms[formName].showControlsGroup(groupName);
    }
    $.wcpFormHideControlsGroup = function(formName, groupName) {
        forms[formName].hideControlsGroup(groupName);
    }
    $.wcpFormSetErrorStateForControl = function(formName, controlName, isError) {
        forms[formName].wcpFormSetErrorStateForControl(controlName, isError);
    }

    // ===============================
    // PRIVATE
    // ===============================

    function WCPForm(options) {
        this.options = options;

        this.id = 'wcp-form-' + (Math.floor(Math.random() * 9999) + 1);

        // Contains a reference to each WCPFormControl object
        this.controls = [];

        // Callback function for when a control changes its value
        this.formUpdated = undefined;

        // Assoc array of all control values
        this.model = {};

        this.init();
    };
    WCPForm.prototype.init = function() {
        // Create WCPFormControl objects

        if (this.options.controlGroups) {
            // Form has control groups
            // Iterate over control groups
            for (var i=0; i<this.options.controlGroups.length; i++) {

                // Iterate over controls in each group
                for (var j=0; j<this.options.controlGroups[i].controls.length; j++) {
                    var controlOptions = this.options.controlGroups[i].controls[j];
                    var controlRegisteredSettings = $.extend(true, {}, registeredControls[controlOptions.type]);

                    var self = this;
                    var c = new WCPFormControl(controlOptions, controlRegisteredSettings, function() {
                        self.controlUpdated(this.name);
                    });

                    c.setVal(controlOptions.value);

                    this.controls[controlOptions.name] = c;
                }
            }
        } else {
            // Form doesn't have control groups
            // Iterate over controls
            for (var i=0; i<this.options.controls.length; i++) {
                var controlOptions = this.options.controls[i];
                var controlRegisteredSettings = $.extend(true, {}, registeredControls[controlOptions.type]);

                var self = this;
                var c = new WCPFormControl(controlOptions, controlRegisteredSettings, function() {
                    self.controlUpdated(this.name);
                });

                c.setVal(controlOptions.value);

                this.controls[controlOptions.name] = c;
            }
        }
        
        // Create events
        this.events();
    };
    WCPForm.prototype.events = function(controls) {
        var self = this;

        // Tab functionality
        $(document).on('click', '#' + this.id + ' [data-wcp-form-group-button]', function() {
            var name = $(this).data('wcp-form-group-button');
            self.openFormTabWithName(name);
        });
    }
    WCPForm.prototype.openFormTabWithName = function(tabName) {
        $('#' + this.id + ' [data-wcp-form-group="'+ tabName +'"]').toggleClass('wcp-form-tab-closed');
    };
    WCPForm.prototype.getFormHTML = function() {
        if (this.options.controlGroups) {
            return this.getFormHTMLWithTabs();
        } else {
            return this.getFormHTMLWithoutTabs();
        }
    };
    WCPForm.prototype.getFormHTMLWithTabs = function() {
        var html = '';

        html += '<div class="wcp-form-wrap" id="'+ this.id +'">';

        // Iterate over control groups
        for (var i=0; i<this.options.controlGroups.length; i++) {
            var group = this.options.controlGroups[i];

            var closed = 'wcp-form-tab-closed';

            if (i == 0) {
                closed = '';
            }

            // Tab button
            html += '<div class="wcp-form-tab ' + closed + '" data-wcp-form-group="'+ group.groupName +'">';
            html += '<div class="wcp-form-tab-button" id="'+ this.id +'" data-wcp-form-group-button="'+ group.groupName +'"><i class="fa fa-plus"></i><i class="fa fa-minus"></i> '+ group.groupTitle +'</div>';
            html += '<div class="wcp-form-tab-content">';
            // Iterate over controls in each group
            for (var j=0; j<group.controls.length; j++) {
                var control = group.controls[j];

                if (control.render !== false) {
                    // Tooltip
                    var tooltipAttributes = '';
                    if (control.tooltip) {
                        tooltipAttributes = 'data-wcp-tooltip="'+ control.tooltip.text +'" data-wcp-tooltip-position="'+ control.tooltip.position +'"';
                    }

                    // Span
                    var width = 100;

                    if (control.width) {
                        width = control.width;
                    }

                    // Label width
                    var labelWidth = '';
                    if (control.label_width) {
                        labelWidth = 'width: ' + control.label_width + 'px; ';
                    }

                    html += '<div class="wcp-form-form-control" style="width: '+ width +'%;" id="wcp-form-form-control-'+ control.name +'" '+ tooltipAttributes +'>';
                    
                    if (!this.controls[control.name].customLabel) {
                        html += '   <label style="'+ labelWidth +'">'+ control.title +'</label>';
                    }
                    html += this.controls[control.name].HTML();
                    html += '</div>';
                }
            }
            html += '<div class="wcp-form-clear"></div>';
            html += '</div>';
            html += '</div>';
        }

        html += '</div>';

        return html;
    }
    WCPForm.prototype.getFormHTMLWithoutTabs = function() {
        var html = '';

        html += '<div class="wcp-form-form-wrap" id="'+ this.id +'">';
        html += '   <div class="wcp-form-tab-content">';

        for (var j=0; j<this.options.controls.length; j++) {
            var control = this.options.controls[j];

            if (control.render !== false) {
                // Tooltip
                var tooltipAttributes = '';
                if (control.tooltip) {
                    tooltipAttributes = 'data-wcp-tooltip="'+ control.tooltip.text +'" data-wcp-tooltip-position="'+ control.tooltip.position +'"';
                }

                // Span
                var width = 100;

                if (control.width) {
                    width = control.width;
                }

                // Label width
                var labelWidth = '';
                if (control.label_width) {
                    labelWidth = 'width: ' + control.label_width + 'px; ';
                }

                html += '<div class="wcp-form-form-control" style="width: '+ width +'%;" id="wcp-form-form-control-'+ control.name +'" '+ tooltipAttributes +'>';
                
                if (!this.controls[control.name].customLabel) {
                    html += '   <label style="'+ labelWidth +'">'+ control.title +'</label>';
                }
                html += this.controls[control.name].HTML();
                html += '</div>';
            }
        }

        html += '   </div>';
        html += '</div>';
        return html;
    }
    WCPForm.prototype.controlUpdated = function(controlName) {
        $.wcpFormEventFormUpdated(this.options.name, controlName);
    }
    WCPForm.prototype.updateForm = function() {
        for (var c in this.controls) {
            this.controls[c].loadVal();
        }
    }
    WCPForm.prototype.getModel = function() {
        var model = {};

        if (this.options.controlGroups) {
            // With control groups
            for (var i=0; i<this.options.controlGroups.length; i++) {
                var controlGroupName = this.options.controlGroups[i].groupName;

                model[controlGroupName] = {};

                // Iterate over controls in each group
                for (var j=0; j<this.options.controlGroups[i].controls.length; j++) {
                    var controlName = this.options.controlGroups[i].controls[j].name;
                    var controlValue = this.controls[controlName].getVal();

                    model[controlGroupName][controlName] = controlValue;
                }
            }
        } else {
            // No control groups
            for (var j=0; j<this.options.controls.length; j++) {
                var controlName = this.options.controls[j].name;
                var controlValue = this.controls[controlName].getVal();

                model[controlName] = controlValue;
            }
        }

        return model;
    }
    // todo
    WCPForm.prototype.setModel = function(model) {
        // Iterate over all controls of this form and update values according to the new model
    }
    WCPForm.prototype.setControlValue = function(controlName, v, force) {
        if ((this.controls[controlName] && this.controls[controlName].getVal() !== v) || force) {
            this.controls[controlName].setVal(v);
        }
    }
    WCPForm.prototype.showControlsGroup = function(groupName) {
        var formRoot = $('#' + this.id);

        formRoot.find('[data-wcp-form-group="'+ groupName +'"]').show();
    }
    WCPForm.prototype.hideControlsGroup = function(groupName) {
        var formRoot = $('#' + this.id);

        formRoot.find('[data-wcp-form-group="'+ groupName +'"]').hide();
    }
    WCPForm.prototype.showControl = function(controlName) {
        var formRoot = $('#' + this.id);

        formRoot.find('#wcp-form-form-control-' + controlName).show();
    }
    WCPForm.prototype.hideControl = function(controlName) {
        var formRoot = $('#' + this.id);

        formRoot.find('#wcp-form-form-control-' + controlName).hide();
    }
    WCPForm.prototype.addControl = function(controlGroupName, controlOptions) {
        // Add the control to the form's options
        for (var i=0; i<this.options.controlGroups.length; i++) {
            var controlGroup = this.options.controlGroups[i];

            if (controlGroup.groupName == controlGroupName) {
                controlGroup.controls.push(controlOptions);
                break;
            }
        }

        // Create the WCPFormControl object and add it to this.controls
        var controlRegisteredSettings = $.extend(true, {}, registeredControls[controlOptions.type]);

        var self = this;
        var c = new WCPFormControl(controlOptions, controlRegisteredSettings, function() {
            self.controlUpdated(this.name);
        });

        c.setVal(controlOptions.value);

        this.controls[controlOptions.name] = c;
    };
    WCPForm.prototype.removeControl = function(controlName) {
        // Delete it from the list of Controls
        delete this.controls[controlName];

        // Delete it from the options array
        for (var i=0; i<this.options.controlGroups.length; i++) {
            var controlGroup = this.options.controlGroups[i];
            var done = false;
            for (var j=0; j<controlGroup.controls.length; j++) {
                var control = controlGroup.controls[j];

                if (control.name == controlName) {
                    controlGroup.controls.splice(j, 1);
                    done = true;
                    break;
                }
            }

            if (done) break;
        }
    };
    WCPForm.prototype.wcpFormSetErrorStateForControl = function(controlName, isError) {
        this.controls[controlName].setError(isError);
    }

    function WCPFormControl(controlOptions, controlRegisteredSettings, valueUpdated) {
        // The 's' argument is the array coming from the registeredControls array
        // Automatically generated at the time of object creation
        this.id = Math.floor(Math.random() * 9999) + 1;
        this.elementID = 'wcp-form-control-' + this.id;
        this.elementClass = 'sq-element-option-group';

        // Settings coming from the registered controls catalog
        // referenced in the 'this' variable, so 'this' can be accessed within
        // those functions (in case of validate(), HTML(), events(), etc)
        // These settings are also common in all controls
        this.type = controlRegisteredSettings.type;
        this.getValue = controlRegisteredSettings.getValue;
        this.setValue = controlRegisteredSettings.setValue;
        this.HTML = controlRegisteredSettings.HTML;

        // These variables are specific for each individual control
        this.name = controlOptions.name;
        this.title = controlOptions.title;
        this.options = controlOptions.options;

        // Private property, must be accessed only via setter and getter
        this._value = undefined;

        // Launch the events provided from the settings
        this.init = controlRegisteredSettings.init;
        this.init();

        // Create a callback function for when the control updates its value
        this.valueUpdated = valueUpdated;

        // Inline label flag
        this.customLabel = controlRegisteredSettings.customLabel;
    }
    WCPFormControl.prototype.getVal = function() {
        return this._value;
    }
    WCPFormControl.prototype.setVal = function(v) {
        this._value = v;

        try {
            this.setValue(v);
        } catch (err) {
            console.log(err);
        }
    }
    WCPFormControl.prototype.loadVal = function() {
        this.setValue(this._value);
    }
    WCPFormControl.prototype.valueChanged = function() {
        // Re-sets the control to its stored value
        this._value = this.getValue();
        this.valueUpdated();
    }
    WCPFormControl.prototype.setError = function(isError) {
        // The parent of this element is the wcp-form-control element
        if (isError) {
            $('#' + this.elementID).parent().addClass('wcp-error');
        } else {
            $('#' + this.elementID).parent().removeClass('wcp-error');
        }
    }

})(jQuery, window, document);