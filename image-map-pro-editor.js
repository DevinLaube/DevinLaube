/*
	- page load animation moved to "shapes" group
	- added glowing shapes, glowing shapes color and glowing shapes opacity options
*/

/*
	Editor updated tour:

	1. use toolbar to draw shapes
	2. edit shape styles
	3. shapes list
	4. edit tooltip style, position, content
	5. image map options
	6. preview mode
	7. save and load
	8. import and export
	9. easy installation (jquery only)
*/

; (function ($, window, document, undefined) {

	// Vars
	var editor = undefined;
	var settings = undefined;
	var sliderDragging = false;
	var copiedStyles = undefined;
	var indexOfShapeToDelete = 0;
	var floorIDtoDelete = undefined;
	var layerIDBeingEdited = undefined;

	// Consts
	var EDITOR_OBJECT_TYPE_CANVAS = 0;
	var EDITOR_OBJECT_TYPE_SPOT = 1;
	var EDITOR_OBJECT_TYPE_OVAL = 2;
	var EDITOR_OBJECT_TYPE_RECT = 3;
	var EDITOR_OBJECT_TYPE_POLY = 4;
	var EDITOR_OBJECT_TYPE_TEXT = 8;
	var EDITOR_OBJECT_TYPE_PATH = 16;
	var EDITOR_OBJECT_TYPE_TRANSFORM_GIZMO = 5;
	var EDITOR_OBJECT_TYPE_POLY_LINE = 6;
	var EDITOR_OBJECT_TYPE_POLY_POINT = 7;
	var EDITOR_OBJECT_TYPE_FLOORS_SELECT = 17;
	var EDITOR_OBJECT_TYPE_TOOLTIP = 9;
	var EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_STYLE = 10;
	var EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_TRANSFORM = 11;
	var EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_CONTENT = 12;
	var EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_DONE = 13;
	var EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_RESET = 14;
	var EDITOR_OBJECT_TYPE_TOOLTIP_GIZMO = 15;

	var EDITOR_TOOL_UNDEFINED = '';
	var EDITOR_TOOL_SPOT = 'spot';
	var EDITOR_TOOL_OVAL = 'oval';
	var EDITOR_TOOL_RECT = 'rect';
	var EDITOR_TOOL_POLY = 'poly';
	var EDITOR_TOOL_TEXT = 'text';
	var EDITOR_TOOL_SELECT = 'select';
	var EDITOR_TOOL_ZOOM_IN = 'zoom-in';
	var EDITOR_TOOL_ZOOM_OUT = 'zoom-out';
	var EDITOR_TOOL_DRAG_CANVAS = 'drag';

	// Editor Settings
	var editorMaxZoomLevel = 32;


	// Preview settings, Used when the tour launches
	var preview_settings = { "id": 96, "editor": { "selected_shape": "rect-3198" }, "general": { "name": "TourDemo", "width": 800, "height": 450, "naturalWidth": 800, "naturalHeight": 450 }, "image": {}, "tooltips": { "show_title_on_mouseover": 1 }, "layers": { "layers_list": [{ "id": 0, "title": "Main Floor", "image_url": "https://webcraftplugins.com/uploads/image-map-pro/demo.jpg", "image_width": 1280, "image_height": 776 }] }, "spots": [{ "id": "rect-3198", "title": "rect-3198", "type": "rect", "x": 9.375, "y": 60.667, "width": 16.5, "height": 26, "x_image_background": 9.375, "y_image_background": 60.667, "width_image_background": 16.5, "height_image_background": 26, "default_style": { "border_radius": 10, "background_opacity": 0, "border_width": 2, "border_style": "dashed", "border_color": "#000000" }, "mouseover_style": { "border_radius": 10 }, "tooltip_style": { "width": 150, "auto_width": 0 }, "tooltip_content": { "squares_settings": { "containers": [{ "id": "sq-container-305521", "settings": { "elements": [{ "settings": { "name": "Paragraph", "iconClass": "fa fa-paragraph" } }] } }] } } }, { "id": "oval-3529", "title": "oval-3529", "type": "oval", "x": 79.875, "y": 14.223, "width": 12.25, "height": 20.667, "x_image_background": 79.875, "y_image_background": 14.223, "width_image_background": 12.25, "height_image_background": 20.667, "default_style": { "background_opacity": 0 }, "tooltip_content": { "squares_settings": { "containers": [{ "id": "sq-container-403761", "settings": { "elements": [{ "settings": { "name": "Paragraph", "iconClass": "fa fa-paragraph" } }] } }] } } }, { "id": "oval-9040", "title": "oval-9040", "type": "oval", "x": 77.75, "y": 42.667, "width": 15.5, "height": 22.889, "x_image_background": 77.75, "y_image_background": 42.667, "width_image_background": 15.5, "height_image_background": 22.889, "default_style": { "background_opacity": 0 }, "tooltip_content": { "squares_settings": { "containers": [{ "id": "sq-container-403761", "settings": { "elements": [{ "settings": { "name": "Paragraph", "iconClass": "fa fa-paragraph" } }] } }] } } }] };
	var tmp_settings = undefined;

	// For safe keeping only
	var demo_drawing_shapes_settings = { "id": 8264, "editor": { "previewMode": 1, "selected_shape": "poly-3332", "tool": "poly" }, "general": { "name": "Demo - Drawing Shapes", "width": 5245, "height": 4428, "image_url": "img/demo_2.jpg" }, "spots": [{ "id": "poly-3332", "type": "poly", "x": 3.409, "y": 21.12, "width": 94.279, "height": 33.12, "actions": { "mouseover": "no-action" }, "default_style": { "fill": "#ffffff", "fill_opacity": 0 }, "mouseover_style": { "fill": "#209ee8", "fill_opacity": 0.6533864541832669 }, "tooltip_style": { "auto_width": 1 }, "points": [{ "x": 0, "y": 76.44927536231886 }, { "x": 0.5675485690757941, "y": 100 }, { "x": 39.6814667832578, "y": 63.28502415458939 }, { "x": 47.56156019637138, "y": 57.97101449275364 }, { "x": 51.28669526438871, "y": 57.00483091787441 }, { "x": 56.01475131225687, "y": 58.454106280193265 }, { "x": 60.169709657353124, "y": 62.318840579710155 }, { "x": 100, "y": 99.03381642512075 }, { "x": 99.71345114861406, "y": 69.56521739130436 }, { "x": 60.026435231660145, "y": 5.797101449275358 }, { "x": 55.58492803517794, "y": 1.4492753623188424 }, { "x": 52.86271394701143, "y": 0.4830917874396141 }, { "x": 48.707755601915174, "y": 0 }, { "x": 44.122973979739996, "y": 1.4492753623188424 }, { "x": 42.11713202003835, "y": 3.864734299516913 }, { "x": 40.11129006033671, "y": 6.763285024154586 }], "vs": [[178.81136000000004, 2056.3632], [206.87616000000003, 2401.7471999999993], [2141.0265600000002, 1863.3023999999998], [2530.69056, 1785.3696], [2714.89536, 1771.1999999999998], [2948.69376, 1792.4544], [3154.15296, 1849.1327999999999], [5123.72736, 2387.577599999999], [5109.55776, 1955.4047999999998], [3147.06816, 1020.2111999999998], [2927.43936, 956.448], [2792.82816, 942.2783999999999], [2587.3689600000002, 935.1936], [2360.6553599999997, 956.448], [2261.46816, 991.872], [2162.2809599999996, 1034.3808]] }, { "id": "poly-3432", "type": "poly", "x": 3.809, "y": 40.16, "width": 93.744, "height": 25.92, "actions": { "mouseover": "no-action" }, "default_style": { "fill": "#ffffff", "fill_opacity": 0 }, "mouseover_style": { "fill": "#209ee8", "fill_opacity": 0.6533864541832669 }, "tooltip_style": { "auto_width": 1 }, "points": [{ "x": 0, "y": 100 }, { "x": 37.89625360230547, "y": 93.20987654320986 }, { "x": 48.84726224783862, "y": 94.44444444444446 }, { "x": 60.37463976945246, "y": 91.35802469135804 }, { "x": 100, "y": 95.67901234567906 }, { "x": 99.85590778097982, "y": 53.086419753086425 }, { "x": 60.61982514337632, "y": 6.249999999999992 }, { "x": 56.77233429394812, "y": 2.4691358024691383 }, { "x": 53.7463976945245, "y": 0.6172839506172709 }, { "x": 51.44092219020173, "y": 0 }, { "x": 48.559077809798275, "y": 1.2345679012345692 }, { "x": 45.38904899135447, "y": 2.4691358024691383 }, { "x": 42.65129682997118, "y": 4.320987654320978 }, { "x": 39.62536023054755, "y": 6.790123456790117 }, { "x": 0.14409221902017288, "y": 53.703703703703724 }], "vs": [[199.79136, 2926.0224], [2063.0937599999997, 2848.0895999999993], [2601.5385600000004, 2862.2592], [3168.3225600000005, 2826.8352], [5116.64256, 2876.4288000000006], [5109.55776, 2387.5776], [3180.3779600000003, 1850.0184], [2991.20256, 1806.6240000000003], [2842.42176, 1785.3696], [2729.06496, 1778.2848000000001], [2587.3689600000002, 1792.4544], [2431.50336, 1806.6240000000003], [2296.8921600000003, 1827.8784], [2148.1113600000003, 1856.2176], [206.87616, 2394.6624]] }, { "id": "poly-1676", "type": "poly", "x": 3.269, "y": 63.84, "width": 94.149, "height": 25.1, "actions": { "mouseover": "no-action" }, "default_style": { "fill": "#ffffff", "fill_opacity": 0 }, "mouseover_style": { "fill": "#209ee8", "fill_opacity": 0.6533864541832669 }, "tooltip_style": { "auto_width": 1 }, "points": [{ "x": 0.573888091822095, "y": 57.370517928286844 }, { "x": 40.45911047345766, "y": 92.43027888446213 }, { "x": 42.71904594344843, "y": 98.64541832669322 }, { "x": 46.162374494380984, "y": 99.60159362549803 }, { "x": 49.78087548391025, "y": 99.36254980079683 }, { "x": 53.39381968664259, "y": 100 }, { "x": 56.85773507962243, "y": 94.18326693227088 }, { "x": 60.54519368723099, "y": 88.60557768924303 }, { "x": 70.01434720229557, "y": 78.40637450199203 }, { "x": 77.18794835007174, "y": 71.39442231075694 }, { "x": 85.5093256814921, "y": 62.47011952191235 }, { "x": 93.974175035868, "y": 55.45816733067726 }, { "x": 100, "y": 49.08366533864542 }, { "x": 100, "y": 4.4621513944223 }, { "x": 60.83213773314202, "y": 0 }, { "x": 57.53228120516497, "y": 1.2749003984063756 }, { "x": 39.45480631276901, "y": 1.2749003984063756 }, { "x": 1.0043041606886653, "y": 7.649402390438224 }, { "x": 0.1434720229555236, "y": 8.286852589641455 }, { "x": 0, "y": 12.111553784860554 }, { "x": 0.573888091822095, "y": 18.486055776892403 }], "vs": [[199.79135999999997, 3464.4672], [2169.365759999999, 3854.1312], [2280.9637599999996, 3923.2079999999996], [2450.998959999999, 3933.8352000000004], [2629.684359999999, 3931.1784000000002], [2808.09536, 3938.2632000000003], [2979.1471599999995, 3873.6143999999995], [3161.23776, 3811.6224], [3628.8345600000007, 3698.2656], [3983.0745599999996, 3620.3327999999997], [4393.99296, 3521.1456], [4811.99616, 3443.2128], [5109.55776, 3372.3648000000003], [5109.55776, 2876.4287999999997], [3175.407359999999, 2826.8352], [3012.4569599999986, 2841.0048], [2119.77216, 2841.0048], [221.04575999999994, 2911.8527999999997], [178.53695999999997, 2918.9376], [171.45215999999996, 2961.4464], [199.79135999999997, 3032.2943999999998]] }] };

	// Default settings
	var default_settings = $.imageMapProEditorDefaults;
	var default_spot_settings = $.imageMapProShapeDefaults;

	$.imageMapProDefaultSettings = $.extend(true, {}, default_settings);
	$.imageMapProDefaultSpotSettings = $.extend(true, {}, default_spot_settings);

	// SQUARES API =============================================================
	$.squaresExtendElementDefaults({
		defaultControls: {
			font: {
				text_color: {
					name: 'Text Color',
					type: 'color',
					default: '#ffffff'
				},
			}
		}
	});
	$.squaresUpdatedContent = function (newContentSettings) {
		if (editor.selectedSpot) {
			editor.selectedSpot.tooltip_content.squares_settings = newContentSettings;
		}
		editor.addAction();
	}
	// =========================================================================

	// IMAGE MAP PRO EDITOR API ================================================
	$.image_map_pro_default_spot_settings = function () {
		return default_spot_settings;
	}

	$.image_map_pro_init_editor = function (initSettings, wcpEditorSettings) {
		editor = new Editor();
		editor.init(initSettings, wcpEditorSettings);
	}

	$.image_map_pro_editor_current_settings = function () {
		return settings;
	}

	$.image_map_pro_editor_compressed_settings = function () {
		return editor.getCompressedSettings();
	}

	$.image_map_pro_user_uploaded_image = function () { }

	// WCP EDITOR API ==========================================================

	// CONTROLS API ============================================================
	$.wcpEditorSliderStartedDragging = function () {
		sliderDragging = true;
	}
	$.wcpEditorSliderFinishedDragging = function () {
		sliderDragging = false;
	}

	// WCP Tour API
	$.wcpTourCoordinatesForTipForStep = function (step) {
		if (step == 'Drawing Shapes') {
			return {
				x: $('#wcp-editor-toolbar-wrap').offset().left + $('#wcp-editor-toolbar-wrap').width() + 20,
				y: $('#wcp-editor-toolbar-wrap').offset().top + $('#wcp-editor-toolbar-wrap').height() / 3
			}
		}
		if (step == 'Customize Your Shapes') {
			return {
				x: $('#wcp-editor-object-settings').offset().left - 20,
				y: $('#wcp-editor-object-settings').offset().top + 40
			}
		}
		if (step == 'Edit and Delete Shapes') {
			return {
				x: $('#wcp-editor-object-list-wrap').offset().left - 20,
				y: $('#wcp-editor-object-list-wrap').offset().top + 50
			}
		}
		if (step == 'Edit the Tooltips') {
			return {
				x: $('#imp-editor-tooltip-bar-wrap').offset().left - 20,
				y: $('#imp-editor-tooltip-bar-wrap').offset().top + 10
			}
		}
		if (step == 'Image Map Settings') {
			return {
				x: $('#wcp-editor-button-settings').offset().left + $('#wcp-editor-button-settings').outerWidth() + 20,
				y: $('#wcp-editor-button-settings').offset().top + $('#wcp-editor-button-settings').outerHeight() / 2
			}
		}
		if (step == 'Responsive &amp; Fullscreen Tooltips') {
			return {
				x: $('[data-wcp-main-tab-button-name="Image Map"]').offset().left + 150,
				y: $('[data-wcp-main-tab-button-name="Image Map"]').offset().top + 40
			}
		}
		if (step == 'Preview Mode') {
			return {
				x: $('#wcp-editor-button-preview').offset().left - 20,
				y: $('#wcp-editor-button-preview').offset().top + 32
			}
		}
		if (step == 'Save and Load') {
			return {
				x: $('#wcp-editor-button-load').offset().left + 64,
				y: $('#wcp-editor-button-load').offset().top + 32
			}
		}
		if (step == 'Publish') {
			return {
				x: $('#wcp-editor-button-settings').offset().left + $('#wcp-editor-button-settings').outerWidth() + 20,
				y: $('#wcp-editor-button-settings').offset().top + $('#wcp-editor-button-settings').outerHeight() / 2
			}
		}
		if (step == 'Import and Export') {
			return {
				x: $('[data-wcp-editor-main-button-name="import"]').offset().left - 20,
				y: $('[data-wcp-editor-main-button-name="import"]').offset().top + 32
			}
		}
		if (step == 'Easy Installation') {
			return {
				x: $('[data-wcp-editor-main-button-name="code"]').offset().left - 20,
				y: $('[data-wcp-editor-main-button-name="code"]').offset().top + 32
			}
		}
	}
	$.wcpTourCoordinatesForHighlightRect = function (step) {
		if (step == 'Drawing Shapes') {
			return {
				x: $('#wcp-editor-toolbar-wrap').offset().left,
				y: $('.wcp-editor-toolbar').first().offset().top,
				width: $('#wcp-editor-toolbar-wrap').outerWidth(),
				height: ($('.wcp-editor-toolbar').last().offset().top - $('.wcp-editor-toolbar').first().offset().top) + $('.wcp-editor-toolbar').last().outerHeight(),
			}
		}
		if (step == 'Customize Your Shapes') {
			return {
				x: $('#wcp-editor-object-settings').offset().left,
				y: $('#wcp-editor-object-settings').offset().top,
				width: $('#wcp-editor-object-settings').outerWidth(),
				height: $('#wcp-editor-object-settings').outerHeight(),
			}
		}
		if (step == 'Edit and Delete Shapes') {
			return {
				x: $('#wcp-editor-object-list-wrap').offset().left,
				y: $('#wcp-editor-object-list-wrap').offset().top,
				width: $('#wcp-editor-object-list-wrap').outerWidth(),
				height: $('#wcp-editor-object-list-wrap').outerHeight(),
			}
		}
		if (step == 'Edit the Tooltips') {
			return {
				x: $('#imp-editor-tooltip-bar-wrap').offset().left,
				y: $('#imp-editor-tooltip-bar-wrap').offset().top,
				width: $('#imp-editor-tooltip-bar-wrap').outerWidth(),
				height: $('#imp-editor-tooltip-bar-wrap').outerHeight(),
			}
		}
		if (step == 'Image Map Settings') {
			return {
				x: $('#wcp-editor-button-settings').offset().left,
				y: $('#wcp-editor-button-settings').offset().top,
				width: $('#wcp-editor-button-settings').outerWidth(),
				height: $('#wcp-editor-button-settings').outerHeight(),
			}
		}
		if (step == 'Responsive &amp; Fullscreen Tooltips') {
			return {
				x: $('[data-wcp-main-tab-button-name="Image Map"]').offset().left,
				y: $('[data-wcp-main-tab-button-name="Image Map"]').offset().top,
				width: $('[data-wcp-main-tab-button-name="Image Map"]').outerWidth(),
				height: $('[data-wcp-main-tab-button-name="Image Map"]').outerHeight(),
			}
		}
		if (step == 'Preview Mode') {
			return {
				x: $('#wcp-editor-button-preview').offset().left,
				y: $('#wcp-editor-button-preview').offset().top,
				width: $('#wcp-editor-button-preview').outerWidth(),
				height: $('#wcp-editor-button-preview').outerHeight(),
			}
		}
		if (step == 'Save and Load') {
			return {
				x: $('#wcp-editor-button-save').offset().left,
				y: $('#wcp-editor-button-save').offset().top,
				width: $('#wcp-editor-button-save').outerWidth() + $('#wcp-editor-button-load').outerWidth(),
				height: $('#wcp-editor-button-save').outerHeight(),
			}
		}
		if (step == 'Publish') {
			return {
				x: $('#wcp-editor-button-settings').offset().left,
				y: $('#wcp-editor-button-settings').offset().top,
				width: $('#wcp-editor-button-settings').outerWidth(),
				height: $('#wcp-editor-button-settings').outerHeight(),
			}
		}
		if (step == 'Import and Export') {
			return {
				x: $('[data-wcp-editor-main-button-name="import"]').offset().left,
				y: $('[data-wcp-editor-main-button-name="import"]').offset().top,
				width: $('[data-wcp-editor-main-button-name="import"]').outerWidth() + $('[data-wcp-editor-main-button-name="export"]').outerWidth(),
				height: $('[data-wcp-editor-main-button-name="import"]').outerHeight(),
			}
		}
		if (step == 'Easy Installation') {
			return {
				x: $('[data-wcp-editor-main-button-name="code"]').offset().left,
				y: $('[data-wcp-editor-main-button-name="code"]').offset().top,
				width: $('[data-wcp-editor-main-button-name="code"]').outerWidth(),
				height: $('[data-wcp-editor-main-button-name="code"]').outerHeight(),
			}
		}
	}
	$.wcpTourEventStarted = function () {

	}
	$.wcpTourEventFinished = function () {
		// Event handling moved to .init()
		// settings = tmp_settings;
		// editor.redraw();
	}
	$.wcpTourEventStepWillChange = function (step) {

	}

	// [data source] Called on initialization:
	$.wcpEditorGetContentForCanvas = function () {
		return '';
	}
	$.wcpEditorGetListItems = function () {
		var items = [];

		// Returns an array of objects in the format { id: 'id', title: 'title' }
		for (var i = settings.spots.length - 1; i >= 0; i--) {
			var s = settings.spots[i];
			items.push({ id: s.id, title: s.title });
		}

		return items;
	}
	// [data source] Get a list of saves
	$.wcpEditorGetSaves = function (callback) {
		$.imp_editor_storage_get_saves_list(function (savesList) {
			var list = new Array();

			for (var i = 0; i < savesList.length; i++) {
				var listItem = {};

				if (savesList[i].name) {
					listItem = {
						name: savesList[i].name,
						id: savesList[i].id
					};
				} else {
					listItem = {
						name: 'Untitled',
						id: savesList[i].id
					};
				}

				list.push(listItem);
			}

			callback(list);
		});
	}
	// [data source] Provide encoded JSON for export
	$.wcpEditorGetExportJSON = function () {
		return JSON.stringify(editor.getCompressedSettings());
	}
	// [data source] Settings form content
	$.wcpEditorGetSettingsForm = function () {
		return $.wcpFormGenerateHTMLForForm('Image Map Settings');
	}
	// [data source] Settings form title
	$.wcpEditorGetSettingsFormTitle = function () {
		return 'Image Map Settings';
	}

	// Main button events
	$.wcpEditorEventNewButtonPressed = function () {
		var modalOptions = {
			name: 'create_new',
			title: 'Create New',
			buttons: [
				{
					name: 'cancel',
					title: 'Cancel',
					class: '',
				},
				{
					name: 'primary',
					title: 'Create',
					class: 'primary',
					id: 'wcp-editor-button-create-new-instance'
				},
			],
			width: 500,
			body: $.wcpFormGenerateHTMLForForm('New Image Map')
		};

		$.wcpEditorPresentModal(modalOptions);
		$.wcpFormUpdateForm('New Image Map');
		editor.updateNewImageMapFormState();
	}
	$.wcpEditorEventSaveButtonPressed = function () {
		$.wcpEditorPresentLoadingScreen('Saving...');

		$.imp_editor_storage_store_save(editor.getCompressedSettings(), function (success) {
			if (success) {
				$.wcpEditorHideLoadingScreenWithMessage('Saved!', false, false);
			} else {
				$.wcpEditorHideLoadingScreenWithMessage('There was an error saving the image map!', true, false);

				var modalBody = '';

				modalBody += '<div class="modal-info-text">Please save this code in order to preserve your work and try again later. <br>This code can be imported any time by opening an existing image map and pressing the Import button. <br>You can also <a href="https://webcraftplugins.com/support">contact us</a>!</div>';
				modalBody += '<textarea id="textarea-error-saving">' + JSON.stringify(editor.getCompressedSettings()) + '</textarea>';

				setTimeout(function () {
					$.wcpEditorPresentModal({
						name: 'error-saving',
						title: 'Error Saving Image Map',
						buttons: [
							{
								class: 'primary',
								name: 'primary',
								title: 'Done'
							}
						],
						body: modalBody
					});
				}, 1000);
			}
		});
	}
	$.wcpEditorEventLoadButtonPressed = function () { }
	$.wcpEditorEventUndoButtonPressed = function () {
		editor.undo();
	}
	$.wcpEditorEventRedoButtonPressed = function () {
		editor.redo();
	}
	$.wcpEditorEventPreviewButtonPressed = function () {
		// Close floating windows
		if ($.wcpEditorIsFloatingWindowOpen()) {
			$.wcpEditorCloseFloatingWindow();
		}
	}
	$.wcpEditorEventEnteredPreviewMode = function () {
		settings.editor.previewMode = 1;
		editor.redraw();
	}
	$.wcpEditorEventExitedPreviewMode = function () {
		settings.editor.previewMode = 0;
		editor.redraw();
	}

	// List events
	$.wcpEditorEventListItemMouseover = function (itemID) {
		// Find the title of the shape with ID = itemID
		var shapeTitle = undefined;

		for (var i = 0; i < settings.spots.length; i++) {
			if (settings.spots[i].id == itemID) {
				shapeTitle = settings.spots[i].title;
			}

			if (isTrue(settings.editor.previewMode)) {
				$.imageMapProUnhighlightShape(settings.general.name, settings.spots[i].title);
			}
		}
		if (isTrue(settings.editor.previewMode)) {
			$.imageMapProHighlightShape(settings.general.name, shapeTitle);
		}
	}
	$.wcpEditorEventListItemSelected = function (itemID) {
		editor.selectSpot(itemID);
		editor.redraw();
	}
	$.wcpEditorEventListItemMoved = function (oldIndex, newIndex) {
		settings.spots.splice(newIndex, 0, settings.spots.splice(oldIndex, 1)[0]);
		editor.updateShapesList();
		editor.redraw();
	}
	$.wcpEditorEventObjectListButtonPressed = function (buttonName) {
		if (!editor.selectedSpot) {
			return;
		}

		if (buttonName == 'duplicate') {
			var s = $.extend(true, {}, editor.selectedSpot);

			if (s.type == 'spot') s.id = editor.createIdForSpot();
			if (s.type == 'rect') s.id = editor.createIdForRect();
			if (s.type == 'oval') s.id = editor.createIdForOval();
			if (s.type == 'poly') s.id = editor.createIdForPoly();
			if (s.type == 'text') s.id = editor.createIdForText();

			s.title += ' Copy';

			settings.spots.push(s);

			editor.redraw();
			editor.addAction();
		}

		if (buttonName == 'copy') {
			copiedStyles = {
				text: $.extend(true, {}, editor.selectedSpot.text),
				default_style: $.extend(true, {}, editor.selectedSpot.default_style),
				mouseover_style: $.extend(true, {}, editor.selectedSpot.mouseover_style),
				tooltip_style: $.extend(true, {}, editor.selectedSpot.tooltip_style),
			}
		}

		if (buttonName == 'paste') {
			var text = editor.selectedSpot.text.text;

			editor.selectedSpot.text = $.extend(true, {}, copiedStyles.text);
			editor.selectedSpot.default_style = $.extend(true, {}, copiedStyles.default_style);
			editor.selectedSpot.mouseover_style = $.extend(true, {}, copiedStyles.mouseover_style);
			editor.selectedSpot.tooltip_style = $.extend(true, {}, copiedStyles.tooltip_style);

			editor.selectedSpot.text.text = text;

			editor.redraw();
			editor.addAction();
		}

		if (buttonName == 'delete') {
			indexOfShapeToDelete = editor.getIndexOfSpotWithId(editor.selectedSpot.id);

			$.wcpEditorPresentModal({
				name: 'confirm-delete-shape',
				title: 'Confirm Delete',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: ''
					},
					{
						name: 'primary',
						title: 'Delete',
						class: 'danger'
					}
				],
				body: 'Delete this shape?'
			});
		}

		if (buttonName == 'rename') {
			var html = '<div class="wcp-form-form-control">';
			html += '<label>Shape Name</label>';
			html += '<input type="text" id="input-shape-name">';
			html += '</div>';
			html += '<div class="modal-error-text" id="rename-shape-error" style="margin-top: 10px; display: none;"></div>';

			$.wcpEditorPresentModal({
				name: 'confirm-rename-shape',
				title: 'Rename Shape',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: ''
					},
					{
						name: 'primary',
						title: 'Rename',
						class: 'primary'
					}
				],
				body: html
			});

			$('#input-shape-name').val(editor.selectedSpot.title);
		}
	}

	// Tool events
	$.wcpEditorEventSelectedTool = function (toolName) {
		settings.editor.tool = toolName;
		editor.redraw();
	}
	$.wcpEditorEventPressedTool = function (toolName) {
		if (toolName == 'reset') {
			editor.zoomReset();
		}
	}

	// Main button events
	$.wcpEditorEventMainButtonClick = function (buttonName) {
		if (buttonName == 'code') {
			var html = '';

			html += '<div id="imp-generated-code-wrap">';
			html += '<div class="generated-code-help">';
			html += '    This is a sample HTML document, showing how to install the plugin in your website.';
			html += '</div>';

			html += '<pre>';
			html += '&lt;!doctype html&gt;<br>';
			html += '&lt;html&gt;<br>';
			html += '&lt;head&gt;<br>';
			html += '    <strong><span class="em-code">&lt;link rel=&quot;stylesheet&quot; href=&quot;css/image-map-pro.min.css&quot;&gt;</span></strong><br>';
			html += '&lt;/head&gt;<br>';
			html += '&lt;body&gt;<br>';
			html += '    &lt;div id=&quot;<strong><span class="em-code">image-map-pro-container</span></strong>&quot;&gt;&lt;/div&gt;<br><br>';

			html += '    &lt;script src=&quot;js/jquery.min.js&quot;&gt;&lt;/script&gt;<br>';
			html += '    <strong><span class="em-code">&lt;script src=&quot;js/image-map-pro.min.js&quot;&gt;&lt;/script&gt;</span></strong><br>';
			html += '    &lt;script type=&quot;text/javascript&quot;&gt;<br>';
			html += '        ;(function ($, window, document, undefined) {<br>';
			html += '            $(document).ready(function() {<br>';
			html += '</pre>';
			html += '<div class="generated-code-help">The code that contains all settings and initializes the plugin:</div>';

			html += '<textarea id="textarea-generated-code" rows="4"></textarea>';

			html += '    <pre>';
			html += '            });<br>';
			html += '        })(jQuery, window, document);<br>';
			html += '    &lt;/script&gt;<br>';
			html += '&lt;/body&gt;<br>';
			html += '&lt;/html&gt;<br>';
			html += '</pre>';
			html += '</div>';

			$.wcpEditorPresentModal({
				name: 'code',
				title: 'Code',
				buttons: [
					{
						name: 'primary',
						title: 'Done',
						class: 'primary'
					}
				],
				body: html
			});

			$('#textarea-generated-code').val("$('#image-map-pro-container').imageMapPro(" + JSON.stringify(editor.getCompressedSettings()) + ");");
		}
		if (buttonName == 'activate') {
			var html = '<div class="wcp-form-form-control">';
			html += '<label>Purchase Code <a href="https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code-" target="_blank"><i class="fa fa-question-circle" aria-hidden="true" data-wcp-tooltip="Trouble finding your purchase code?" data-wcp-tooltip-position="right"></i></a></label>';
			html += '<input type="text" id="input-purchase-code">'
			html += '</div>';

			$.wcpEditorPresentModal({
				name: 'activate',
				title: 'Activate',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: 'default'
					},
					{
						name: 'primary',
						title: 'Activate',
						class: 'primary'
					}
				],
				body: html
			});
		}
		if (buttonName == 'help') {
			tmp_settings = settings;
			settings = preview_settings;
			editor.shapesFormSpotIndex = -1; // Force redraw of the form
			editor.parseSettings();
			editor.redraw();
			$('#wcp-editor-main-buttons').addClass('wcp-expanded');
			$.wcpTourEventFinished = function () {
				settings = tmp_settings;
				editor.redraw();
			}
			$.wcpTourRestart('Image Map Pro Editor Tour');
		}
		if (buttonName == 'import') {
			$.wcpFormCreateForm({
				name: 'Import',
				controls: [
					{
						label_width: 104,
						name: 'import_format',
						title: 'Import Format',
						type: 'button group',
						options: [
							{ value: 'imp_code', title: 'Image Map Pro Code' },
							{ value: 'svg_code', title: 'SVG XML Code' }
						],
						value: 'imp_code'
					},
					{
						label_width: 104,
						name: 'code',
						title: 'Paste code to import',
						type: 'textarea',
						value: ''
					},
					{
						type: 'info',
						name: 'invalid_code',
						title: 'Invalid Code',
						value: 'Invalid Code',
						options: { style: 'red' }
					},
					{
						label_width: 104,
						name: 'resize_canvas',
						title: 'Resize Image Map',
						type: 'switch',
						value: 0
					},
				]
			});

			var modalOptions = {
				name: 'import',
				title: 'Import',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: '',
					},
					{
						name: 'primary',
						title: 'Import',
						class: 'primary',
						id: 'wcp-editor-confirm-import'
					},
				],
				body: $.wcpFormGenerateHTMLForForm('Import'),
				width: 700
			};

			$.wcpEditorPresentModal(modalOptions);
			$.wcpFormUpdateForm('Import');
			$.wcpFormHideControl('Import', 'invalid_code');
			$.wcpFormHideControl('Import', 'resize_canvas')
		}
		if (buttonName == 'fullscreen') {

		}
	}

	// Modal events
	$.wcpEditorEventModalButtonClicked = function (modalName, buttonName) {
		if (modalName == 'create_new') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				var model = $.wcpFormGetModel('New Image Map');

				// validate
				if (!model.name || model.name == 0) {
					model.name = 'Untitled';
				}

				model.name = model.name.replace(/\W+/g, ' ');

				// Create new settings object
				settings = $.extend(true, {}, default_settings);
				settings.id = Math.round(Math.random() * 10000) + 1;
				settings.general.name = model.name;
				settings.general.shortcode = model.name.replace(/[^\w]/g, '');

				// Present loading screen
				$.wcpEditorCloseModal();
				$.wcpEditorPresentLoadingScreen('Creating...');

				// If country template is selected
				// extract shapes from the SVG code 
				// and add them to the new "settings" object
				if (model.template == 'countries') {
					var svgCode = $.imageMapProCountriesGetCountrySVG(model.country, function (svgCode) {
						// Build shapes
						editor.parseSVG(svgCode, 1);

						// Make all shapes blue
						for (var i = 0; i < settings.spots.length; i++) {
							settings.spots[i].default_style.background_color = '#0258CF';
							settings.spots[i].default_style.background_opacity = 1;
							settings.spots[i].default_style.stroke_color = '#ffffff';
							settings.spots[i].default_style.stroke_width = 1;
							settings.spots[i].default_style.stroke_opacity = 1;
							settings.spots[i].mouseover_style.background_color = '#00357D';
							settings.spots[i].mouseover_style.background_opacity = 1;
							settings.spots[i].mouseover_style.stroke_color = '#ffffff';
							settings.spots[i].mouseover_style.stroke_width = 1;
							settings.spots[i].mouseover_style.stroke_opacity = 1;
						}

						// Change some settings
						settings.tooltips.sticky_tooltips = 1;

						// Store save and launch
						$.imp_editor_storage_store_save(editor.getCompressedSettings(), function () {
							$.imp_editor_storage_set_last_save(settings.id, function () {
								// Launch editor
								editor.launch();
								$.wcpEditorHideLoadingScreenWithMessage('Created!', false, false);
							});
						});

						// TEST ONLY
						// editor.launch();
						// editor.updateImageMapForm();
					});
				} else {
					// No country template is selected
					// Store save and launch
					$.imp_editor_storage_store_save(editor.getCompressedSettings(), function () {
						$.imp_editor_storage_set_last_save(settings.id, function () {
							// Launch editor
							editor.launch();
							$.wcpEditorHideLoadingScreenWithMessage('Created!', false, false);
						});
					});
				}
			}
		}
		if (modalName == 'modal-choose-icon') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
		}
		if (modalName == 'load') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
		}
		if (modalName == 'confirm-delete-shape') {
			if (buttonName == 'primary') {
				// If the deleted spot was selected, deselect it
				if (settings.editor.selected_shape == settings.spots[indexOfShapeToDelete].id) {
					editor.deselectSpot();
				}

				settings.spots.splice(indexOfShapeToDelete, 1);

				$.wcpEditorCloseModal();

				editor.redraw();
				editor.addAction();
			}
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
		}
		if (modalName == 'code') {
			if (buttonName == 'primary') {
				$.wcpEditorCloseModal();
			}
		}
		if (modalName == 'export') {
			if (buttonName == 'primary') {
				$.wcpEditorCloseModal();
			}
		}
		if (modalName == 'import') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				var model = $.wcpFormGetModel('Import');

				if (model.import_format == 'imp_code') {
					// Validate JSON
					var json = model.code;
					var parsedJSON = undefined;

					try {
						parsedJSON = JSON.parse(json);
					} catch (err) {
						console.log('error decoding JSON!');
					}

					if (parsedJSON === undefined) {
						// Show error text
						$.wcpFormShowControl('Import', 'invalid_code');
					} else {
						// Close modal
						$.wcpEditorCloseModal();

						// No error
						$.wcpFormHideControl('Import', 'invalid_code');

						// Import the JSON
						// Preserve the map name and ID to avoid conflicts
						var mapName = settings.general.name;
						var mapID = settings.id;

						// Set the settings
						settings = $.extend(true, {}, parsedJSON);

						// Set the map name
						settings.general.name = mapName;
						settings.id = mapID;

						editor.launch();
					}
				}

				if (model.import_format == 'svg_code') {
					var backup = $.extend(true, {}, settings);
					$.wcpFormHideControl('Import', 'invalid_code');

					try {
						editor.parseSVG(model.code, model.resize_canvas);

						// Redraw & close
						editor.redraw();
						$.wcpEditorCloseModal();
					} catch (err) {
						settings = $.extend(true, {}, backup);
						$.wcpFormShowControl('Import', 'invalid_code');
					}
				}
			}
		}
		if (modalName == 'error-saving') {
			if (buttonName == 'primary') {
				$.wcpEditorCloseModal();
			}
		}
		if (modalName == 'activate') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				$.wcpEditorCloseModal();
				$.wcpEditorPresentLoadingScreen('Validating Purchase Code...');

				if ($.wcpValidatePurchaseCode) {
					$.wcpValidatePurchaseCode($('#input-purchase-code').val(), function (success, errorMessage) {
						if (success) {
							$.wcpEditorHideLoadingScreenWithMessage('Success!', false, false);

							$.wcpEditorHideExtraMainButton('activate');
						} else {
							$.wcpEditorHideLoadingScreenWithMessage('Failed to validate your purchase code.', true, false);
						}
					});
				} else {
					$.wcpEditorHideLoadingScreenWithMessage('Failed to validate your purchase code.</div>', true, true);
				}
			}
		}
		if (modalName == 'confirm-rename-shape') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				var newTitle = $('#input-shape-name').val();

				// Validate new title, it must be unique
				if (newTitle.length == 0) {
					$('#rename-shape-error').show().html('Please enter a new name for the shape, or press Cancel.');
					return;
				}

				var shapeTitleExists = false;
				for (var i = 0; i < settings.spots.length; i++) {
					if (settings.spots[i].title == newTitle && settings.spots[i].id != editor.selectedSpot.id) {
						shapeTitleExists = true;
						break;
					}
				}

				if (shapeTitleExists || newTitle.length == 0) {
					$('#rename-shape-error').show().html('A shape with this name already exists!');
					return;
				}

				// Rename
				editor.selectedSpot.title = newTitle;

				// Close modal
				$.wcpEditorCloseModal();
				editor.redraw();
			}
		}
		if (modalName == 'modal-add-layer') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				// Validate
				var hasError = false;
				var model = $.wcpFormGetModel('New/Edit Layer');

				if (model.name.length == 0) {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'name', true);
					hasError = true;
				} else {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'name', false);
				}

				if (model.url.length == 0) {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', true);
					hasError = true;
					return;
				} else {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', false);
				}

				editor.processNewLayerImage(model.url, function (success, w, h) {
					if (success) {
						$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', false);
					} else {
						hasError = true;
						$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', true);
					}

					if (!hasError) {
						// Construct layer object
						var o = {
							id: editor.createIdForLayer(),
							title: model.name,
							image_url: model.url,
							image_width: w,
							image_height: h
						};

						settings.layers.layers_list.push(o);
						editor.updateImageMapForm();
						editor.redraw();

						$.wcpEditorCloseModal();
					}
				});
			}
		}
		if (modalName == 'modal-edit-layer') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				// Flag for validation
				var hasError = false;

				// Get the model of the form
				var model = $.wcpFormGetModel('New/Edit Layer');

				// Is the name field not empty
				if (model.name.length == 0) {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'name', true);
					hasError = true;
				} else {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'name', false);
				}

				// Is the image URL field not empty
				if (model.url.length == 0) {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', true);
					hasError = true;
					return;
				} else {
					$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', false);
				}

				editor.processNewLayerImage(model.url, function (success, w, h) {
					if (success) {
						$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', false);
					} else {
						hasError = true;
						$.wcpFormSetErrorStateForControl('New/Edit Layer', 'url', true);
					}

					if (!hasError) {
						// Modify layer object
						for (var i = 0; i < settings.layers.layers_list.length; i++) {
							if (settings.layers.layers_list[i].id == layerIDBeingEdited) {
								settings.layers.layers_list[i].title = model.name;
								settings.layers.layers_list[i].image_url = model.url;
								settings.layers.layers_list[i].image_width = w;
								settings.layers.layers_list[i].image_height = h;

								break;
							}
						}

						editor.updateImageMapForm();
						editor.redraw();

						$.wcpEditorCloseModal();
					}
				});
			}
		}
		if (modalName == 'modal-confirm-delete-floor') {
			if (buttonName == 'cancel') {
				$.wcpEditorCloseModal();
			}
			if (buttonName == 'primary') {
				// Is there only 1 floor left?
				if (settings.layers.layers_list.length == 1) {
					$.wcpEditorCloseModal();

					// Display confirmation box
					var html = '';
					html += 'Unable to delete, there is only one floor left.';

					$.wcpEditorPresentModal({
						name: 'modal-delete-floor-error',
						title: 'Error',
						buttons: [
							{
								name: 'ok',
								title: 'OK',
								class: 'default',
								id: 'imp-editor-button-delete-floor-error-ok'
							}
						],
						body: html
					});

					return;
				}

				// Remove the floor from the floors list
				var floorIndexToDelete = 0;

				for (var i = 0; i < settings.layers.layers_list.length; i++) {
					if (settings.layers.layers_list[i].id == floorIDtoDelete) {
						settings.layers.layers_list.splice(i, 1);
					}
				}

				settings.editor.currentLayer = settings.layers.layers_list[0].id;

				// Delete all shapes associated with the floor
				var newShapesArray = [];

				for (var i = 0; i < settings.spots.length; i++) {
					if (settings.spots[i].layerID != floorIDtoDelete) {
						var shape = $.extend(true, {}, settings.spots[i]);
						newShapesArray.push(shape);
					}
				}
				settings.spots = newShapesArray;

				$.wcpEditorCloseModal();
				editor.updateImageMapForm();
				editor.updateShapesList();
				editor.redraw();
			}
		}
		if (modalName == 'modal-delete-floor-error') {
			if (buttonName == 'ok') {
				$.wcpEditorCloseModal();
			}
		}
	}
	$.wcpEditorEventModalClosed = function (modalName) { }

	// Event for loading a save
	$.wcpEditorEventLoadSaveWithID = function (saveID) {
		$.wcpEditorPresentLoadingScreen('Loading Image Map...');

		$.imp_editor_storage_get_save(saveID, function (save) {
			if (!save) {
				$.wcpEditorHideLoadingScreenWithMessage('Error loading image map.', true, false);
			} else {
				settings = save;

				$.imp_editor_storage_set_last_save(settings.id, function () {
					$.wcpEditorHideLoadingScreen();
					editor.launch();
				});
			}
		});
	}

	// Event for deleting a save
	$.wcpEditorEventDeleteSaveWithID = function (saveID, cb) {
		$.imp_editor_storage_delete_save(saveID, function () {
			cb();
		});
	}

	// Event for help button
	$.wcpEditorEventHelpButtonPressed = function () {

	}

	// Form events
	$.wcpFormEventFormUpdated = function (formName) {
		if (formName == 'Image Map Settings') {
			var m = $.wcpFormGetModel(formName);

			// Did the image URL change?
			if (m.image.image_url && m.image.image_url.length > 0 && settings.image.url !== m.image.image_url) {
				// URL changed and it's not an empty string
				settings.image.url = m.image.image_url;
				editor.canvasImage.src = m.image.image_url;

				loadImage(editor.canvasImage, function () {
					// Image is loading
					// Show loader
					$.wcpEditorPresentLoadingScreen('Loading Image...');
				}, function () {
					// Image has loaded
					// init canvas events
					editor.canvas_events();

					// Hide loader
					$.wcpEditorHideLoadingScreen();

					settings.general.width = editor.canvasImage.naturalWidth;
					settings.general.height = editor.canvasImage.naturalHeight;

					settings.general.naturalWidth = editor.canvasImage.naturalWidth;
					settings.general.naturalHeight = editor.canvasImage.naturalHeight;

					$.wcpFormSetControlValue('Image Map Settings', 'image_map_width', settings.general.width);
					$.wcpFormSetControlValue('Image Map Settings', 'image_map_height', settings.general.height);
					$.wcpFormUpdateForm('Image Map Settings');

					editor.redraw();
					editor.addAction();
				}, function () {
					$.wcpEditorHideLoadingScreenWithMessage('Error Loading Image!', true, false);
				});
			} else if (settings.image.url !== m.image.image_url) {
				// URL changed and it's an empty string
				settings.image.url = m.image.image_url;
				editor.canvasImage.src = m.image.image_url;

				// Image has loaded
				// init canvas events
				editor.canvas_events();

				settings.general.width = default_settings.general.naturalWidth;
				settings.general.height = default_settings.general.naturalHeight;

				settings.general.naturalWidth = default_settings.general.naturalWidth;
				settings.general.naturalHeight = default_settings.general.naturalHeight;

				$.wcpFormSetControlValue('Image Map Settings', 'image_map_width', default_settings.general.width);
				$.wcpFormSetControlValue('Image Map Settings', 'image_map_height', default_settings.general.height);
				$.wcpFormUpdateForm('Image Map Settings');

				editor.redraw();
				editor.addAction();
			} else {
				// URL didn't change, update the rest of the settings
				settings.general.name = m.general.image_map_name.trim();
				if (m.general.image_map_shortcode) {
					settings.general.shortcode = m.general.image_map_shortcode.replace(/[\[\]']+/g, '').trim();
				}
				settings.general.width = m.general.image_map_width;
				settings.general.height = m.general.image_map_height;
				settings.general.responsive = m.general.responsive;
				settings.general.preserve_quality = m.general.preserve_quality;
				settings.general.center_image_map = m.general.center_image_map;

				settings.image.url = m.image.image_url;

				settings.shapes.pageload_animation = m.shapes.pageload_animation;
				settings.shapes.glowing_shapes = m.shapes.glowing_shapes;
				settings.shapes.glowing_shapes_color = m.shapes.glowing_shapes_color;
				settings.shapes.glow_opacity = m.shapes.glow_opacity;
				settings.shapes.stop_glowing_on_mouseover = m.shapes.stop_glowing_on_mouseover;

				settings.tooltips.enable_tooltips = m.tooltips.enable_tooltips;
				settings.tooltips.show_tooltips = m.tooltips.show_tooltips;
				settings.tooltips.show_title_on_mouseover = m.tooltips.show_title_on_mouseover;
				settings.tooltips.sticky_tooltips = m.tooltips.sticky_tooltips;
				settings.tooltips.constrain_tooltips = m.tooltips.constrain_tooltips;
				settings.tooltips.tooltip_animation = m.tooltips.tooltip_animation;
				settings.tooltips.fullscreen_tooltips = m.tooltips.fullscreen_tooltips;

				settings.fullscreen.enable_fullscreen_mode = m.fullscreen.enable_fullscreen_mode;
				settings.fullscreen.start_in_fullscreen_mode = m.fullscreen.start_in_fullscreen_mode;
				settings.fullscreen.fullscreen_background = m.fullscreen.fullscreen_background;
				settings.fullscreen.fullscreen_button_position = m.fullscreen.fullscreen_button_position;
				settings.fullscreen.fullscreen_button_type = m.fullscreen.fullscreen_button_type;
				settings.fullscreen.fullscreen_button_color = m.fullscreen.fullscreen_button_color;
				settings.fullscreen.fullscreen_button_text_color = m.fullscreen.fullscreen_button_text_color;

				settings.zooming.enable_zooming = m.zooming.enable_zooming;
				settings.zooming.max_zoom = m.zooming.max_zoom;
				settings.zooming.limit_max_zoom_to_image_size = m.zooming.limit_max_zoom_to_image_size;
				settings.zooming.enable_navigator = m.zooming.enable_navigator;
				settings.zooming.enable_zoom_buttons = m.zooming.enable_zoom_buttons;
				settings.zooming.zoom_button_text_color = m.zooming.zoom_button_text_color;
				settings.zooming.zoom_button_background_color = m.zooming.zoom_button_background_color;
				settings.zooming.hold_ctrl_to_zoom = m.zooming.hold_ctrl_to_zoom;
				settings.zooming.focus_shape_on_click = m.zooming.focus_shape_on_click;

				settings.layers.enable_layers = m.layers.enable_layers;
				settings.layers.layers_list = m.layers.layers_list;

				if (isTrue(settings.layers.enable_layers)) {
					if (settings.layers.layers_list.length == 0) {
						settings.layers.layers_list = [{
							id: 0,
							title: 'Main Floor',
							image_url: settings.image.url,
							image_width: settings.general.width,
							image_height: settings.general.height
						}];

						editor.updateImageMapForm();
					}
				}

				settings.shapes_menu.enable_shapes_menu = m.shapes_menu.enable_shapes_menu;
				settings.shapes_menu.detached_menu = m.shapes_menu.detached_menu;
				settings.shapes_menu.menu_position = m.shapes_menu.menu_position;
				settings.shapes_menu.enable_search = m.shapes_menu.enable_search;
				settings.shapes_menu.group_by_floor = m.shapes_menu.group_by_floor;
				settings.shapes_menu.hide_children_of_connected_shapes = m.shapes_menu.hide_children_of_connected_shapes;

				var detached_menu_info = '<div data-imp-detached-menu="' + settings.id + '"></div>';
				$.wcpFormSetControlValue('Image Map Settings', 'detached_menu_info', detached_menu_info);

				if (m.custom_code) {
					settings.custom_code.custom_css = m.custom_code.custom_css;
					settings.custom_code.custom_js = m.custom_code.custom_js;
				}

				editor.redraw();
				editor.addAction();
			}
		}
		if (formName == 'Shape Settings' && editor.selectedSpot !== undefined) {
			var s = editor.selectedSpot;
			var model = $.wcpFormGetModel('Shape Settings');

			// General
			s.title = model.general.shape_title;
			s.x = model.general.x;
			s.y = model.general.y;
			s.width = model.general.width;
			s.height = model.general.height;
			s.connected_to = model.general.connected_to;
			s.use_connected_shape_tooltip = model.general.use_connected_shape_tooltip;
			s.static = model.general.static;

			// Text
			s.text.text = model.text.text;
			s.text.font_family = model.text.font_family;
			s.text.font_size = model.text.font_size;
			s.text.font_weight = model.text.font_weight;
			s.text.text_color = model.text.text_color;
			s.text.text_opacity = model.text.text_opacity;

			// Actions
			s.actions.click = model.actions.click;
			s.actions.link = model.actions.link;
			s.actions.script = model.actions.script;
			s.actions.open_link_in_new_window = model.actions.open_link_in_new_window;

			// Default style
			s.default_style.opacity = model.default_style.opacity;
			s.default_style.icon_fill = model.default_style.icon_fill;
			s.default_style.border_radius = model.default_style.border_radius;
			s.default_style.background_type = model.default_style.background_type;
			s.default_style.background_image_url = model.default_style.background_image_url;
			s.default_style.background_image_opacity = model.default_style.background_image_opacity;
			s.default_style.background_image_scale = model.default_style.background_image_scale;
			s.default_style.background_image_offset_x = model.default_style.background_image_offset_x;
			s.default_style.background_image_offset_y = model.default_style.background_image_offset_y;
			s.default_style.background_color = model.default_style.background_color;
			s.default_style.background_opacity = model.default_style.background_opacity;
			s.default_style.border_width = model.default_style.border_width;
			s.default_style.border_style = model.default_style.border_style;
			s.default_style.border_color = model.default_style.border_color;
			s.default_style.border_opacity = model.default_style.border_opacity;
			s.default_style.stroke_color = model.default_style.stroke_color;
			s.default_style.stroke_opacity = model.default_style.stroke_opacity;
			s.default_style.stroke_width = model.default_style.stroke_width;
			s.default_style.stroke_dasharray = model.default_style.stroke_dasharray;
			s.default_style.stroke_linecap = model.default_style.stroke_linecap;
			s.default_style.use_icon = model.icon.use_icon;
			s.default_style.icon_type = model.icon.icon_type;
			s.default_style.icon_svg_path = model.icon.icon_svg_path;
			s.default_style.icon_svg_viewbox = model.icon.icon_svg_viewbox;
			s.default_style.icon_url = model.icon.icon_url;
			s.default_style.icon_is_pin = model.icon.icon_is_pin;
			s.default_style.icon_shadow = model.icon.icon_shadow;

			// Mouseover style
			s.mouseover_style.opacity = model.mouseover_style.mouseover_opacity;
			s.mouseover_style.background_image_url = model.mouseover_style.mouseover_background_image_url;
			s.mouseover_style.background_image_opacity = model.mouseover_style.mouseover_background_image_opacity;
			s.mouseover_style.background_image_scale = model.mouseover_style.mouseover_background_image_scale;
			s.mouseover_style.background_image_offset_x = model.mouseover_style.mouseover_background_image_offset_x;
			s.mouseover_style.background_image_offset_y = model.mouseover_style.mouseover_background_image_offset_y;
			s.mouseover_style.background_color = model.mouseover_style.mouseover_background_color;
			s.mouseover_style.background_opacity = model.mouseover_style.mouseover_background_opacity;
			s.mouseover_style.icon_fill = model.mouseover_style.mouseover_icon_fill;
			s.mouseover_style.border_radius = model.mouseover_style.mouseover_border_radius;
			s.mouseover_style.border_width = model.mouseover_style.mouseover_border_width;
			s.mouseover_style.border_style = model.mouseover_style.mouseover_border_style;
			s.mouseover_style.border_color = model.mouseover_style.mouseover_border_color;
			s.mouseover_style.border_opacity = model.mouseover_style.mouseover_border_opacity;
			s.mouseover_style.stroke_color = model.mouseover_style.mouseover_stroke_color;
			s.mouseover_style.stroke_opacity = model.mouseover_style.mouseover_stroke_opacity;
			s.mouseover_style.stroke_width = model.mouseover_style.mouseover_stroke_width;
			s.mouseover_style.stroke_dasharray = model.mouseover_style.mouseover_stroke_dasharray;
			s.mouseover_style.stroke_linecap = model.mouseover_style.mouseover_stroke_linecap;

			// Tooltip
			s.tooltip.enable_tooltip = model.tooltip.enable_tooltip;

			editor.redraw();
			if (!sliderDragging) { editor.addAction(); }
		}
		if (formName == 'Tooltip Style' && editor.selectedSpot !== undefined) {
			var s = editor.selectedSpot;
			var model = $.wcpFormGetModel('Tooltip Style');

			s.tooltip_style.border_radius = model.tooltip_border_radius;
			s.tooltip_style.padding = model.tooltip_padding;
			s.tooltip_style.background_color = model.tooltip_background_color;
			s.tooltip_style.background_opacity = model.tooltip_background_opacity;
			s.tooltip_style.position = model.tooltip_position;
			s.tooltip_style.width = model.tooltip_width;
			s.tooltip_style.auto_width = model.tooltip_auto_width;

			editor.redraw();
			if (!sliderDragging) { editor.addAction(); }
		}
		if (formName == 'New Image Map') {
			editor.updateNewImageMapFormState();
		}
		if (formName == 'Import') {
			var m = $.wcpFormGetModel(formName);
			if (m.import_format == 'svg_code') {
				$.wcpFormShowControl('Import', 'resize_canvas')
			} else {
				$.wcpFormHideControl('Import', 'resize_canvas')
			}
		}
	}

	// Floating window events

	// Event when floating window closed 
	$.wcpEditorEventFloatingWindowClosed = function (windowTitle) {
		if (windowTitle == 'Tooltip Content') {
			editor.redraw();
		}
	}

	// Event when settings window opened
	$.wcpEditorSettingsWindowOpened = function () {
		editor.redraw();
	}
	// Event when settings window opened
	$.wcpEditorSettingsWindowClosed = function () {
		editor.redraw();
	}

	// EDITOR CLASS ============================================================

	function Editor() {
		this.wcpEditorSettings = undefined;

		// undo/redo
		this.actionStack = new Array();
		this.actionIndex = 0;

		// canvas
		this.canvasImage = new Image();
		this.canvasWidth = 0;
		this.canvasHeight = 0;
		this.canvas = undefined;

		this.ix = 0; // in pixels, canvas space
		this.iy = 0;
		this.x = 0; // in pixels, canvas space
		this.y = 0;
		this.dx = 0; // in percentage, canvas space
		this.dy = 0;

		// screen space, pixels
		this.ixss = 0;
		this.iyss = 0;
		this.xss = 0;
		this.yss = 0;
		this.dxss = 0;
		this.dyss = 0;

		this.drawRectWidth = 0;
		this.drawRectHeight = 0;

		this.transformX = 0;
		this.transformY = 0;
		this.transformWidth = 0;
		this.transformHeight = 0;

		this.eventSpotId = undefined;
		this.redrawEl = undefined;
		this.redrawSvgEl = undefined;
		this.redrawPolygonEl = undefined;
		this.redrawElBgImage = undefined;
		this.redrawTooltip = undefined;

		this.tempControlPoint = undefined;
		this.tempControlPointLine = undefined;
		this.tempControlPointIndex = undefined;

		this.controlPointInsertionPointX = 0;
		this.controlPointInsertionPointY = 0;

		this.translatedPointIndex = 0;
		this.translatedPoint = undefined;

		this.translatedPointX = 0;
		this.translatedPointY = 0;

		this.polyPoints = new Array();

		this.canvasInitialX = 0;
		this.canvasInitialY = 0;
		this.movingTooltipShapeCenterX = 0;
		this.movingTooltipShapeCenterY = 0;
		this.movingTooltipCenterX = 0;
		this.movingTooltipCenterY = 0;
		this.movingTooltipPosition = undefined; // top/bottom/left/right
		this.movingTooltipColorRGBA = undefined;
		this.movingTooltipArrow = undefined;

		this.transformingTooltipStartingWidth = 0;
		this.transformingTooltipWidth = 0;
		// this.transformingTooltipAutoWidth = 0;

		// flags
		this.startedSelecting = false;
		this.startedMoving = false;
		this.startedTransforming = false;
		this.didTransforming = false;
		this.transformDirection = 0;
		this.startedTransformingTooltip = false;
		this.didTransformTooltip = false;

		this.startedDrawingSpot = false;
		this.startedDrawingText = false;
		this.startedDrawingRect = false;
		this.createdDrawingRect = false;
		this.startedDrawingOval = false;
		this.createdDrawingOval = false;
		this.startedDrawingPoly = false;
		this.drawingPoly = false;
		this.finishedDrawingPoly = false;
		this.mouseDownWhileDrawingPoly = false;

		this.startedTranslatingControlPoint = false;
		this.translatingControlPoint = false;
		this.didDeleteControlPoint = false;

		this.shouldDeselectShape = false;

		this.ctrlKeyDown = false;
		this.altKeyDown = false;
		this.shiftKeyDown = false;
		this.spaceKeyDown = false;
		this.commandKeyDown = false;

		this.draggingCanvas = false;

		this.startedSelectingTooltip = false;
		this.movingTooltip = false;

		// vars
		this.selectedSpot = undefined;
		this.eventSpot = undefined;
		this.shapesFormSpotIndex = undefined;
		this.iconsHTML = $.wcpFontawesomeUI;

		this.zoom = 1;
		this.canvasX = 0;
		this.canvasY = 0;
	}
	Editor.prototype.init = function (initSettings, wcpEditorSettings) {
		var self = this;

		// events & other
		self.events();
		// Initialize the editor
		self.wcpEditorSettings = wcpEditorSettings;
		settings = $.extend(true, {}, default_settings);

		if ($.wcpEditorWebsiteSettings) {
			if (!$.wcpTourIsFinished('Image Map Pro Editor Tour')) {
				// console.log('show guided tour');

				tmp_settings = settings;
				settings = preview_settings;
				$.wcpEditorInit(this.wcpEditorSettings);
				editor.shapesFormSpotIndex = -1; // Force redraw of the form
				editor.parseSettings();
				editor.redraw();
				$('#wcp-editor-main-buttons').addClass('wcp-expanded');

				$.wcpTourStart('Image Map Pro Editor Tour');

				// When done, launch with defaults
				$.wcpTourEventFinished = function (tourName) {
					// console.log('launch with defaults');
					// console.log('tour finished');
					if (tourName == 'Image Map Pro Editor Tour') {
						settings = $.wcpEditorWebsiteSettings();
						self.launch();
					}
				}
			} else {
				settings = $.wcpEditorWebsiteSettings();
				self.launch();
			}

			return;
		}

		$.wcpEditorInit(this.wcpEditorSettings);

		// If settings were passed with initialization, use them and don't look for saves
		if (initSettings) {
			settings = initSettings;

			// launch
			self.launch();
		} else {
			// Load last save
			$.imp_editor_storage_get_last_save(function (lastSaveID) {
				// $.wcpTourStart('Whats New 5.0');
				// return;
				// Does last save exist?
				if (lastSaveID) {
					// Existing customer!
					// Whats new not seen
					// Show whats new
					if (!$.wcpTourIsFinished('Whats New 5.0')) {
						// console.log('show whats new');
						$.wcpTourStart('Whats New 5.0');

						// When finished, launch with last save
						$.wcpTourEventFinished = function (tourName) {
							if (tourName == 'Whats New 5.0') {
								$.wcpEditorPresentLoadingScreen('Loading Image Map...');
								$.imp_editor_storage_get_save(parseInt(lastSaveID, 10), function (save) {
									if (!save) {
										// Save could not be loaded
										// console.log('save could not be loaded');
										$.wcpEditorHideLoadingScreenWithMessage('Error loading image map.', true, false);

										// Launch with defaults
										// console.log('launch with defaults');
										settings = $.extend(true, {}, default_settings);
										settings.general.name = 'Untitled';
										settings.id = Math.round(Math.random() * 10000) + 1;
										self.launch();
									} else {
										// Launch with last save
										// console.log('launch with last save');
										settings = save;
										editor.launch();
									}
								});
							}
						}
					} else {
						// Tour is finished
						// Load last save
						$.wcpEditorPresentLoadingScreen('Loading Image Map...');
						$.imp_editor_storage_get_save(parseInt(lastSaveID, 10), function (save) {
							if (!save) {
								// Save could not be loaded
								// console.log('save could not be loaded');
								$.wcpEditorHideLoadingScreenWithMessage('Error loading image map.', true, false);

								// Launch with defaults
								// console.log('launch with defaults');
								settings = $.extend(true, {}, default_settings);
								settings.general.name = 'Untitled';
								settings.id = Math.round(Math.random() * 10000) + 1;
								self.launch();
							} else {
								// Launch with last save
								// console.log('launch with last save');
								settings = save;
								editor.launch();
							}
						});
					}
				} else {
					// Does list of saves exist?
					$.imp_editor_storage_get_saves_list(function (savesList) {
						if (savesList.length > 0) {
							// Existing customer!
							// Show whats new
							if (!$.wcpTourIsFinished('Whats New 5.0')) {
								// console.log('show whats new');
								$.wcpTourStart('Whats New 5.0');

								// When finished, launch with defaults and show load modal
								$.wcpTourEventFinished = function (tourName) {
									if (tourName == 'Whats New 5.0') {
										// console.log('launch with defaults');
										// Launch with defaults
										settings = $.extend(true, {}, default_settings);
										settings.general.name = 'Untitled';
										settings.id = Math.round(Math.random() * 10000) + 1;
										self.launch();

										// Display saves modal
										$.wcpEditorPresentLoadModal();
									}
								}
							} else {
								// Launch with defaults
								// console.log('launch with defaults');
								settings = $.extend(true, {}, default_settings);
								settings.general.name = 'Untitled';
								settings.id = Math.round(Math.random() * 10000) + 1;
								self.launch();

								// Display saves modal
								$.wcpEditorPresentLoadModal();
							}
						} else {
							// New customer
							// Show guided tour
							if (!$.wcpTourIsFinished('Image Map Pro Editor Tour')) {
								// console.log('show guided tour');

								tmp_settings = settings;
								settings = preview_settings;
								editor.shapesFormSpotIndex = -1; // Force redraw of the form
								editor.parseSettings();
								editor.redraw();
								$('#wcp-editor-main-buttons').addClass('wcp-expanded');
								// $.wcpEditorOpenMainTabWithName('Shape');

								$.wcpTourStart('Image Map Pro Editor Tour');

								// When done, launch with defaults
								$.wcpTourEventFinished = function (tourName) {
									// console.log('launch with defaults');
									// console.log('tour finished');
									if (tourName == 'Image Map Pro Editor Tour') {
										settings = $.extend(true, {}, default_settings);
										settings.general.name = 'Untitled';
										settings.id = Math.round(Math.random() * 10000) + 1;
										self.launch();
									}
								}
							} else {
								// Disable whats new
								$.wcpTourDisable('Whats New 5.0');

								// Launch with defaults
								// console.log('launch with defaults');
								settings = $.extend(true, {}, default_settings);
								settings.general.name = 'Untitled';
								settings.id = Math.round(Math.random() * 10000) + 1;
								self.launch();
							}
						}
					});
				}
			});
		}
	};
	Editor.prototype.launch = function () {
		var self = this;

		// Initialize the editor
		$.wcpEditorInit(this.wcpEditorSettings);

		// Set the canvas object type
		$('#wcp-editor-canvas').attr('data-editor-object-type', '0');

		// Reset vars
		this.selectedSpot = undefined;
		this.eventSpot = undefined;
		this.shapesFormSpotIndex = undefined;

		this.parseSettings();

		// If there is an image URL entered, show the loader and start redraw
		if ((settings.image.url && settings.image.url.length > 0) || isTrue(settings.layers.enable_layers) && settings.layers.layers_list.length > 0) {
			// There is an image URL
			if (isTrue(settings.layers.enable_layers) && settings.layers.layers_list.length > 0) {
				this.canvasImage.src = settings.layers.layers_list[0].image_url;
			} else {
				this.canvasImage.src = settings.image.url;
			}

			loadImage(this.canvasImage, function () {
				// Image is loading
				// Show loader
				$.wcpEditorPresentLoadingScreen('Loading Image...');
			}, function () {
				// Image has loaded
				// Hide loader

				// init canvas events
				self.canvas_events();

				settings.general.naturalWidth = self.canvasImage.naturalWidth;
				settings.general.naturalHeight = self.canvasImage.naturalHeight;

				settings.editor.state = {
					dragging: false,
					canvasX: 0,
					canvasY: 0,
					canvasZoom: 1
				};

				self.redraw();
				self.selectSpot(settings.editor.selected_shape);

				$.wcpEditorHideLoadingScreen();
			}, function () {
				$.wcpEditorHideLoadingScreenWithMessage('Error Loading Image!', true, false);
			});
		} else {
			// There is no image URL
			self.canvas_events();

			settings.editor.state = {
				dragging: false,
				canvasX: 0,
				canvasY: 0,
				canvasZoom: 1
			};

			self.redraw();
			self.selectSpot(settings.editor.selected_shape);
			$.wcpEditorHideLoadingScreen();
		}

		// Variables
		this.actionIndex = -1;
		this.actionStack = new Array();
		this.addAction();
		this.canvas = $('#wcp-editor-canvas');

		// Select the active tool
		$.wcpEditorSelectTool(settings.editor.tool);

		// Init general settings form
		this.updateImageMapForm();

		// Modify editor for website
		if ($.wcpEditorModifyForPublish) {
			$.wcpEditorModifyForPublish();
		}
	};
	Editor.prototype.parseSettings = function () {
		// 4.0 
		// Uncompress and update legacy spot options
		for (var i = 0; i < settings.spots.length; i++) {
			settings.spots[i] = $.extend(true, {}, default_spot_settings, settings.spots[i]);

			// Set values for bg image x/y/width/height if they don't exist
			if (settings.spots[i].x_image_background == -1 || settings.spots[i].y_image_background == -1) {
				settings.spots[i].x_image_background = settings.spots[i].x;
				settings.spots[i].y_image_background = settings.spots[i].y;
				settings.spots[i].width_image_background = settings.spots[i].width;
				settings.spots[i].height_image_background = settings.spots[i].height;
			}

			// Migrate fill / fill opacity to background color / background opacity for POLY shapes
			if (settings.spots[i].type == 'poly') {
				if (settings.spots[i].default_style.fill) {
					settings.spots[i].default_style.background_color = settings.spots[i].default_style.fill;
					settings.spots[i].default_style.fill = undefined;
				}
				if (settings.spots[i].default_style.fill_opacity) {
					settings.spots[i].default_style.background_opacity = settings.spots[i].default_style.fill_opacity;
					settings.spots[i].default_style.fill_opacity = undefined;
				}
			}

			// Migrate the title and text to the plain_text setting
			if (settings.spots[i].tooltip_content.title || settings.spots[i].tooltip_content.text) {
				var plainText = '';

				if (settings.spots[i].tooltip_content.title) {
					plainText += '<h3>' + settings.spots[i].tooltip_content.title + '</h3>';
				}
				if (settings.spots[i].tooltip_content.text) {
					plainText += '<p>' + settings.spots[i].tooltip_content.text + '</p>';
				}

				settings.spots[i].tooltip_content.plain_text = plainText;

				settings.spots[i].tooltip_content = {
					content_type: settings.spots[i].tooltip_content.content_type,
					plain_text: settings.spots[i].tooltip_content.plain_text,
					plain_text_color: settings.spots[i].tooltip_content.plain_text_color,
					squares_json: settings.spots[i].tooltip_content.squares_json
				};
			}

			// Migrate squares_json to squares_settings
			if (settings.spots[i].tooltip_content.squares_json) {
				try {
					settings.spots[i].tooltip_content.squares_settings = JSON.parse(settings.spots[i].tooltip_content.squares_json);
					settings.spots[i].tooltip_content.squares_json = '';
				} catch (err) {
					// console.log('Failed to parse JSON for spot ' + settings.spots[i].id + ':');
					// console.log(settings.spots[i].tooltip_content.squares_json);
				}
			}

			// Create a "title" for each spot that doesn't have one
			if (!settings.spots[i].title) {
				settings.spots[i].title = settings.spots[i].id;
			}

			// If there is a click action set to "show tooltip", then change it to "no action"
			if (settings.spots[i].actions.click == 'show-tooltip') {
				settings.spots[i].actions.click = 'no-action';
			}

			// Make sure the points and vs arrays are actually arrays
			// Otherwise they cause crash in wcp-compress
			if (Object.prototype.toString.call(settings.spots[i].points) !== '[object Array]') {
				settings.spots[i].points = [];
			}
			if (Object.prototype.toString.call(settings.spots[i].vs) !== '[object Array]') {
				settings.spots[i].vs = [];
			}
		}

		// 5.0 - Shapes
		for (var i = 0; i < settings.spots.length; i++) {
			var s = settings.spots[i];

			// Move shape title from tooltip content to general
			if (s.tooltip_content && s.tooltip_content.title) {
				s.title = s.tooltip_content.title;
				s.tooltip_content.title = undefined;
			}

			// Move tooltip enable/disable from "tooltip_style" to "tooltip"
			if (s.tooltip_style && s.tooltip_style.enable_tooltip) {
				s.tooltip.enable_tooltip = s.tooltip_style.enable_tooltip;
				s.tooltip_style.enable_tooltip = undefined;
			}

			// If tooltip content type is NOT "content-builder" and it contains plain text, remove content type and move the content to a text element
			if (s.tooltip_content.plain_text && s.tooltip_content.content_type != 'content-builder') {
				var newSquaresSettings = {
					"containers": [{
						"id": "sq-container-160121",
						"settings": {
							"elements": [{
								"settings": {
									"name": "Paragraph",
									"iconClass": "fa fa-paragraph"
								},
								"options": {
									"text": {
										"text": s.tooltip_content.plain_text
									},
									"font": {
										"text_color": s.tooltip_content.plain_text_color
									}
								}
							}]
						}
					}]
				}

				s.tooltip_content.squares_settings = newSquaresSettings;

				// Remove legacy options
				s.tooltip_content.content_type = undefined;
				s.tooltip_content.plain_text = undefined;
				s.tooltip_content.plain_text_color = undefined;
			}

			// Move fill and fill_opacity to background and background_opacity
			// remove fill and fill_opacity
			if (s.default_style && s.default_style.fill) {
				s.default_style.background_color = s.default_style.fill;
				delete s.default_style.fill;
			}
			if (s.default_style && s.default_style.fill_opacity) {
				s.default_style.background_opacity = s.default_style.fill_opacity;
				delete s.default_style.fill_opacity;
			}
			if (s.mouseover_style && s.mouseover_style.fill) {
				s.mouseover_style.background_color = s.mouseover_style.fill;
				delete s.mouseover_style.fill;
			}
			if (s.mouseover_style && s.mouseover_style.fill_opacity) {
				s.mouseover_style.background_opacity = s.mouseover_style.fill_opacity;
				delete s.mouseover_style.fill_opacity;
			}
		}

		// 5.0 - Image map settings
		if (!settings.shapes) {
			settings.shapes = $.imageMapProDefaultSettings.shapes

			// Move pageload_animation to "shapes" group
			if (settings.general && settings.general.pageload_animation) {
				settings.shapes.pageload_animation = settings.general.pageload_animation;
				settings.general.pageload_animation = undefined;
			}
		}

		// KEEP: Make sure spot coordinates are numbers
		var newSpots = [];
		for (var i = 0; i < settings.spots.length; i++) {
			var s = settings.spots[i];

			s.x = parseFloat(s.x);
			s.y = parseFloat(s.y);

			if (s.width) {
				s.width = parseFloat(s.width);
			}
			if (s.height) {
				s.height = parseFloat(s.height);
			}

			if (s.type == 'poly') {
				if (s.points.length < 3) {
					continue;
				}
				if (s.points) {
					for (var j = 0; j < s.points.length; j++) {
						s.points[j].x = parseFloat(s.points[j].x);
						s.points[j].y = parseFloat(s.points[j].y);
					}
				}
				if (s.vs) {
					for (var j = 0; j < s.vs.length; j++) {
						for (var k = 0; k < s.vs[j].length; k++) {
							s.vs[j][0] = parseFloat(s.vs[j][0]);
							s.vs[j][1] = parseFloat(s.vs[j][1]);
						}
					}
				}
			}
			newSpots.push(s);
		}
		settings.spots = newSpots;

		// Merge defaults into imported options
		settings.general = $.extend(true, {}, default_settings.general, settings.general);
		settings.image = $.extend(true, {}, default_settings.image, settings.image);
		settings.shapes = $.extend(true, {}, default_settings.shapes, settings.shapes);
		settings.tooltips = $.extend(true, {}, default_settings.tooltips, settings.tooltips);
		settings.fullscreen = $.extend(true, {}, default_settings.fullscreen, settings.fullscreen);
		settings.zooming = $.extend(true, {}, default_settings.zooming, settings.zooming);
		settings.editor = $.extend(true, {}, default_settings.editor, settings.editor);
		settings.custom_code = $.extend(true, {}, default_settings.custom_code, settings.custom_code);
		settings.layers = $.extend(true, {}, default_settings.layers, settings.layers);
		settings.shapes_menu = $.extend(true, {}, default_settings.shapes_menu, settings.shapes_menu);

		settings.general.width = parseInt(settings.general.width);
		settings.general.height = parseInt(settings.general.height);

		// 3.1.0 - Reorganize "general" settings
		if (settings.general.image_url) {
			settings.image.url = settings.general.image_url;
			settings.general.image_url = undefined;
		}
		if (settings.general.sticky_tooltips) {
			settings.tooltips.sticky_tooltips = settings.general.sticky_tooltips;
			settings.general.sticky_tooltips = undefined;
		}
		if (settings.general.constrain_tooltips) {
			settings.tooltips.constrain_tooltips = settings.general.constrain_tooltips;
			settings.general.constrain_tooltips = undefined;
		}
		if (settings.general.fullscreen_tooltips) {
			settings.tooltips.fullscreen_tooltips = settings.general.fullscreen_tooltips;
			settings.general.fullscreen_tooltips = undefined;
		}
		if (settings.general.tooltip_animation) {
			settings.tooltips.tooltip_animation = settings.general.tooltip_animation;
			settings.general.tooltip_animation = undefined;
		}

		// Add squares settings for objects that don't have them
		for (var i = 0; i < settings.spots.length; i++) {
			if (!settings.spots[i].tooltip_content.squares_settings) {
				settings.spots[i].tooltip_content.squares_settings = $.extend(true, {}, default_spot_settings.tooltip_content.squares_settings);
			}
		}

		// Move the old imageurl property to settings.image.url
		if (settings.general.imageurl) {
			settings.image.url = settings.general.imageurl;
		}

		// Trim whitespaces of the image map name and shortcode
		settings.general.name = settings.general.name.trim();
		settings.general.shortcode = settings.general.shortcode.trim();
	}
	Editor.prototype.redraw = function () {
		if (!isTrue(settings.editor.previewMode)) {
			// Edit mode

			// Calculate canvas dimensions
			var size = this.getCanvasDefaultSize();

			this.canvasWidth = size.w * this.zoom;
			this.canvasHeight = size.h * this.zoom;

			// Set the size of the canvas
			$('#wcp-editor-canvas').css({
				width: this.canvasWidth,
				height: this.canvasHeight,
				'max-width': 'none',
				'max-height': 'none'
			});

			// Redraw editor
			$('#wcp-editor-canvas').html($.image_map_pro_editor_content());

			$('#imp-editor-image').css({
				width: this.canvasWidth,
				height: this.canvasHeight
			});

			$.wcpEditorSetPreviewModeOff();
		} else {
			// Preview mode
			var size = this.getCanvasDefaultSize();
			// Set the size of the canvas

			if (settings.image.url != '') {
				$('#wcp-editor-canvas').css({
					width: 'auto',
					height: 'auto',
					'max-width': size.w,
					'max-height': size.h
				});
			} else {
				$('#wcp-editor-canvas').css({
					width: '100%',
					height: 'auto',
					'max-width': size.w,
					'max-height': size.h
				});
			}

			// Redraw plugin

			// Modify settings for the editor only
			var clonedSettings = $.extend(true, {}, settings);
			clonedSettings.fullscreen.start_in_fullscreen_mode = 0;
			clonedSettings.shapes_menu.detached_menu = 0;
			$('#wcp-editor-canvas').imageMapPro(clonedSettings);

			// Reset zoom
			if (this.zoom != 1) {
				this.zoomReset();
			}

			// Update UI
			$.wcpEditorSetPreviewModeOn();
		}

		// Redraw spot selection in canvas
		this.redrawSpotSelection();

		// Redraw the tooltip of the selected shape
		this.redrawSelectedSpotTooltip();

		// Update shape settings form
		// this.updateShapeSettingsForm();

		// Update shapes form values
		this.updateShapesForm();

		// Update the state of the form
		this.updateShapesFormState();

		// Update Shapes list
		this.updateShapesList();

		// Update state of the general form
		this.updateImageMapFormState();

		// Redraw temp poly if user is currently drawing a polygon
		if (this.drawingPoly) {
			this.redrawTempPoly();
		}
	}
	Editor.prototype.redrawCanvas = function () {
		this.canvas.css({ transform: 'translate(' + this.canvasX + 'px, ' + this.canvasY + 'px)' });
	}
	Editor.prototype.getCanvasDefaultSize = function () {
		var size = { w: 0, h: 0 };

		// Calculate canvas dimentions
		var canvasBackgroundWidth = $('#wcp-editor-center').width() - 80;
		var canvasBackgroundHeight = $('#wcp-editor-center').height() - 80;

		var currentImageWidth = 0, currentImageHeight = 0;

		if (isTrue(settings.layers.enable_layers)) {
			for (var i = 0; i < settings.layers.layers_list.length; i++) {
				if (parseInt(settings.layers.layers_list[i].id, 10) == parseInt(settings.editor.currentLayer, 10)) {
					currentImageWidth = settings.layers.layers_list[i].image_width;
					currentImageHeight = settings.layers.layers_list[i].image_height;
					break;
				}
			}
		} else {
			currentImageWidth = settings.general.width;
			currentImageHeight = settings.general.height;
		}

		if (currentImageWidth > canvasBackgroundWidth || currentImageHeight > canvasBackgroundHeight) {
			// Canvas needs to be resized to fit the editor's background
			var imageRatio = currentImageWidth / currentImageHeight;
			var backgroundRatio = canvasBackgroundWidth / canvasBackgroundHeight;

			if (imageRatio <= backgroundRatio) {
				// Fit to height
				size.w = canvasBackgroundHeight * imageRatio;
				size.h = $('#wcp-editor-center').height() - 80;
			} else {
				// Fit to width
				size.w = $('#wcp-editor-center').width() - 80;
				size.h = canvasBackgroundWidth / imageRatio;
			}
		} else {
			// Canvas does not need to be resized
			size.w = currentImageWidth;
			size.h = currentImageHeight;
		}

		return size;
	}
	Editor.prototype.redrawSpotSelection = function () {
		var self = this;

		// deselect
		$('.imp-editor-shape').removeClass('selected');
		$('#imp-editor-shape-tooltip').removeClass('selected');

		// select
		if (settings.editor.selected_shape != -1) {
			// set a reference to the selected spot
			var i = self.getIndexOfSpotWithId(settings.editor.selected_shape);

			// No such spot found
			if (i == undefined) {
				settings.editor.selected_shape = -1;
				return;
			}

			// Tooltip transform mode
			if (this.tooltipTransformMode) {
				$('#imp-editor-shape-tooltip').addClass('selected');

				// hack
				$('#wcp-editor-tooltip').remove();
				return;
			}

			$('.imp-editor-shape[data-id="' + settings.editor.selected_shape + '"]').addClass('selected');

			self.selectedSpot = settings.spots[i];

			// Save a reference to the SVG if it's a poly for quick redraw
			if (self.selectedSpot.type == 'poly') {
				self.tempControlPoint = $('.imp-editor-poly[data-id="' + settings.editor.selected_shape + '"]').find('.imp-editor-poly-svg-temp-control-point');
				self.tempControlPointLine = $('.imp-editor-poly[data-id="' + settings.editor.selected_shape + '"]').find('.imp-editor-poly-svg-temp-control-point-line');
			}
		} else {
			self.selectedSpot = undefined;
		}
	}
	Editor.prototype.redrawSelectedSpotTooltip = function () {
		if (this.selectedSpot && this.selectedSpot.type != 'text') {
			var t = $('#imp-editor-shape-tooltip');
			if (t.length == 0) return;

			var x = 0, y = 0;
			var s = this.selectedSpot;
			var tw = t[0].getBoundingClientRect().width / this.canvasWidth * 100;
			var th = t[0].getBoundingClientRect().height / this.canvasHeight * 100;
			var px = 20 / this.canvasWidth * 100;
			var py = 20 / this.canvasHeight * 100;
			var sw = s.width;
			var sh = s.height;
			var sx = s.x;
			var sy = s.y;

			if (s.type == 'spot') {
				sw = s.width / this.canvasWidth * 100;
				sh = s.height / this.canvasHeight * 100;
				sx = s.x - sw / 2;
				sy = s.y - sh / 2;

				if (isTrue(s.default_style.icon_is_pin) && isTrue(s.default_style.use_icon)) {
					sy -= sh / 2;
				}
			}

			// calculate tooltip x/y in %, canvas space
			if (s.tooltip_style.position == 'top') {
				x = sx + sw / 2 - tw / 2;
				y = sy - th - py;
			}
			if (s.tooltip_style.position == 'bottom') {
				x = sx + sw / 2 - tw / 2;
				y = sy + sh + py;
			}
			if (s.tooltip_style.position == 'left') {
				x = sx - tw - px;
				y = sy + sh / 2 - th / 2;
			}
			if (s.tooltip_style.position == 'right') {
				x = sx + sw + px;
				y = sy + sh / 2 - th / 2;
			}

			// apply tooltip offset
			x += s.tooltip_style.offset_x;
			y += s.tooltip_style.offset_y;

			t.css({
				left: x + '%',
				top: y + '%',
				width: tw + '%'
			});
		}
	}

	Editor.prototype.events = function () {
		var self = this;

		// Triggered when an image in content builder image element loads
		$(document).off('squares_image_loaded');
		$(document).on('squares_image_loaded', function () {
			self.redrawSelectedSpotTooltip();
		});

		// Button Controls events
		$(document).off('button-choose-icon-clicked');
		$(document).on('button-choose-icon-clicked', function () {
			$.wcpEditorPresentModal({
				name: 'modal-choose-icon',
				title: 'Choose Icon',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: 'default',
						id: 'imp-editor-button-cancel-choose-icon'
					},
				],
				body: self.iconsHTML
			});
		});

		// Copy styles from default to mouseover
		$(document).off('button-copy-from-default-styles-clicked');
		$(document).on('button-copy-from-default-styles-clicked', function () {
			self.selectedSpot.mouseover_style.opacity = self.selectedSpot.default_style.opacity;
			self.selectedSpot.mouseover_style.background_image_url = self.selectedSpot.default_style.background_image_url;
			self.selectedSpot.mouseover_style.background_image_opacity = self.selectedSpot.default_style.background_image_opacity;
			self.selectedSpot.mouseover_style.background_image_scale = self.selectedSpot.default_style.background_image_scale;
			self.selectedSpot.mouseover_style.background_image_offset_x = self.selectedSpot.default_style.background_image_offset_x;
			self.selectedSpot.mouseover_style.background_image_offset_y = self.selectedSpot.default_style.background_image_offset_y;
			self.selectedSpot.mouseover_style.background_color = self.selectedSpot.default_style.background_color;
			self.selectedSpot.mouseover_style.background_opacity = self.selectedSpot.default_style.background_opacity;
			self.selectedSpot.mouseover_style.icon_fill = self.selectedSpot.default_style.icon_fill;
			self.selectedSpot.mouseover_style.border_radius = self.selectedSpot.default_style.border_radius;
			self.selectedSpot.mouseover_style.border_width = self.selectedSpot.default_style.border_width;
			self.selectedSpot.mouseover_style.border_style = self.selectedSpot.default_style.border_style;
			self.selectedSpot.mouseover_style.border_color = self.selectedSpot.default_style.border_color;
			self.selectedSpot.mouseover_style.border_opacity = self.selectedSpot.default_style.border_opacity;
			self.selectedSpot.mouseover_style.stroke_color = self.selectedSpot.default_style.stroke_color;
			self.selectedSpot.mouseover_style.stroke_opacity = self.selectedSpot.default_style.stroke_opacity;
			self.selectedSpot.mouseover_style.stroke_width = self.selectedSpot.default_style.stroke_width;
			self.selectedSpot.mouseover_style.stroke_dasharray = self.selectedSpot.default_style.stroke_dasharray;
			self.selectedSpot.mouseover_style.stroke_linecap = self.selectedSpot.default_style.stroke_linecap;

			self.redraw();
			self.addAction();
		});

		// Reset original image size
		$(document).off('button-reset-size-clicked');
		$(document).on('button-reset-size-clicked', function () {
			if (settings.image.url != '') {
				settings.general.width = self.canvasImage.naturalWidth;
				settings.general.height = self.canvasImage.naturalHeight;
			} else {
				settings.general.width = default_settings.general.naturalWidth;
				settings.general.height = default_settings.general.naturalHeight;
				settings.general.naturalWidth = default_settings.general.naturalWidth;
				settings.general.naturalHeight = default_settings.general.naturalHeight;
			}
			self.updateImageMapForm();
			self.redraw();
		});

		// Launch content builder
		$(document).off('button-launch-content-builder-clicked');
		$(document).on('button-launch-content-builder-clicked', function () {
			self.launchTooltipContentBuilder();
		});

		// Choose Icon modal events
		$(document).off('click', '.fontawesome-icon-wrap');
		$(document).on('click', '.fontawesome-icon-wrap', function () {
			$.wcpEditorCloseModal();
			self.selectedSpot.default_style.icon_fontawesome_id = $(this).data('fontawesome-id');
			self.redraw();
			self.addAction();
		});
		$(document).off('click', '.category-title-wrap');
		$(document).on('click', '.category-title-wrap', function () {
			$(this).toggleClass('active');
			$(this).next().toggle();
		});

		// Unhighlight shapes if in preview mode the mouse leaves the shapes list
		$(document).on('mouseout', '#wcp-editor-right', function (e) {
			if (isTrue(settings.editor.previewMode)) {
				for (var i = 0; i < settings.spots.length; i++) {
					$.imageMapProUnhighlightShape(settings.general.name, settings.spots[i].title);
				}
			}
		});

		// Layers list
		$(document).off('event-layers-list-add');
		$(document).on('event-layers-list-add', function () {
			// Display modal
			$.wcpEditorPresentModal({
				name: 'modal-add-layer',
				title: 'Add Layer',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: 'default',
						id: 'imp-editor-button-cancel-add-layer'
					},
					{
						name: 'primary',
						title: 'Create',
						class: 'primary',
						id: 'imp-editor-button-create-layer'
					},
				],
				body: $.wcpFormGenerateHTMLForForm('New/Edit Layer')
			});

			$.wcpFormSetControlValue('New/Edit Layer', 'name', 'Untitled');
			$.wcpFormSetControlValue('New/Edit Layer', 'url', '');
			$.wcpFormUpdateForm('New/Edit Layer');
		});
		$(document).off('event-layers-list-remove');
		$(document).on('event-layers-list-remove', function (e, floorID) {
			floorIDtoDelete = floorID;

			// Display confirmation box
			var html = '';
			html += 'Are you sure you want to permanently delete this floor and all shapes in it?';

			$.wcpEditorPresentModal({
				name: 'modal-confirm-delete-floor',
				title: 'Delete Floor',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: 'default',
						id: 'imp-editor-button-cancel-delete-floor'
					},
					{
						name: 'primary',
						title: 'Delete',
						class: 'danger',
						id: 'imp-editor-button-delete-floor'
					},
				],
				body: html
			});

			// // Did the currently active layer get deleted?
			// if (settings.editor.currentLayer == deletedLayerID) {
			// 	settings.editor.currentLayer = settings.layers.layers_list[0].id;
			// }

			// // Delete all shapes associated with the layer
			// var newSpotsArray = [];

			// for (var i=0; i<settings.spots.length; i++) {
			// 	if (settings.spots[i].layerID != deletedLayerID) {
			// 		newSpotsArray.push(settings.spots[i]);
			// 	}
			// }
			// settings.spots = newSpotsArray;

			// editor.redraw();
		});
		$(document).off('event-layers-list-duplicate');
		$(document).on('event-layers-list-duplicate', function (e, v) {
			// Duplicate the layer
			for (var i = 0; i < settings.layers.layers_list.length; i++) {
				var newLayerID = self.createIdForLayer();

				if (settings.layers.layers_list[i].id == v) {
					var tmp = {
						id: newLayerID,
						image_height: settings.layers.layers_list[i].image_height,
						image_width: settings.layers.layers_list[i].image_width,
						image_url: settings.layers.layers_list[i].image_url,
						title: settings.layers.layers_list[i].title + ' Copy',
					}

					settings.layers.layers_list.splice(i + 1, 0, tmp);

					break;
				}
			}

			// Duplicate the shapes
			var l = settings.spots.length;

			for (var i = 0; i < l; i++) {
				var s = settings.spots[i];
				if (s.layerID == v) {
					var sCopy = $.extend(true, {}, s);
					sCopy.layerID = newLayerID;

					if (sCopy.type == 'spot') sCopy.id = self.createIdForSpot();
					if (sCopy.type == 'rect') sCopy.id = self.createIdForRect();
					if (sCopy.type == 'oval') sCopy.id = self.createIdForOval();
					if (sCopy.type == 'poly') sCopy.id = self.createIdForPoly();
					if (sCopy.type == 'text') sCopy.id = self.createIdForText();

					settings.spots.push(sCopy);
				}
			}

			self.updateImageMapForm();
			self.redraw();
		});
		$(document).off('event-layers-list-up');
		$(document).on('event-layers-list-up', function () {

		});
		$(document).off('event-layers-list-down');
		$(document).on('event-layers-list-down', function () {

		});
		$(document).off('event-layers-list-edit');
		$(document).on('event-layers-list-edit', function (e, listItemID) {
			layerIDBeingEdited = listItemID;

			// Display modal
			$.wcpEditorPresentModal({
				name: 'modal-edit-layer',
				title: 'Edit Layer',
				buttons: [
					{
						name: 'cancel',
						title: 'Cancel',
						class: 'default',
						id: 'imp-editor-button-cancel-add-layer'
					},
					{
						name: 'primary',
						title: 'Done',
						class: 'primary',
						id: 'imp-editor-button-edit-layer-done'
					},
				],
				body: $.wcpFormGenerateHTMLForForm('New/Edit Layer')
			});

			var selectedListItem = $('[data-wcp-form-layers-list-control-option-id="' + listItemID + '"]');
			$.wcpFormSetControlValue('New/Edit Layer', 'name', selectedListItem.data('wcp-form-layers-list-control-option-title'));
			$.wcpFormSetControlValue('New/Edit Layer', 'url', selectedListItem.data('wcp-form-layers-list-control-option-image-url'));
			$.wcpFormUpdateForm('New/Edit Layer');

			// Set values

			// $('#wcp-editor-input-add-layer-name').val(selectedListItem.data('wcp-form-layers-list-control-option-title'));
			// $('#wcp-editor-input-add-layer-url').val(selectedListItem.data('wcp-form-layers-list-control-option-image-url'));
		});

		// Select a layer (canvas menu)
		$(document).off('change', '#select-canvas-layer');
		$(document).on('change', '#select-canvas-layer', function () {
			// Change current layer in the settings
			settings.editor.currentLayer = $('#select-canvas-layer').val();

			// Change the list of shapes
			self.updateShapesList();

			// Deselect shape
			self.deselectSpot();

			// Redraw
			self.redraw();
		});

		// Reset tooltip position
		$(document).off('button-reset-tooltip-position-clicked');
		$(document).on('button-reset-tooltip-position-clicked', function () {
			if (self.selectedSpot) {
				self.selectedSpot.tooltip_style.offset_x = $.imageMapProDefaultSpotSettings.tooltip_style.offset_x;
				self.selectedSpot.tooltip_style.offset_y = $.imageMapProDefaultSpotSettings.tooltip_style.offset_y;
				self.selectedSpot.tooltip_style.position = $.imageMapProDefaultSpotSettings.tooltip_style.position;
			}

			self.addAction();
			self.redraw();
		});

		// Reset tooltip size
		$(document).off('button-reset-tooltip-size-clicked');
		$(document).on('button-reset-tooltip-size-clicked', function () {
			if (self.selectedSpot) {
				self.selectedSpot.tooltip_style.width = $.imageMapProDefaultSpotSettings.tooltip_style.width;
			}

			self.addAction();
			self.redraw();
		});

		// Edit tooltip buttons in Shape Settings
		$(document).off('button-edit-tooltip-style-clicked');
		$(document).on('button-edit-tooltip-style-clicked', function () {
			if (settings.editor.transform_tooltip_mode == 1) {
				settings.editor.transform_tooltip_mode = 0;
				self.tooltipTransformMode = false;

				self.redraw();
			}

			if ($.wcpEditorIsFloatingWindowOpen()) {
				$.wcpEditorCloseFloatingWindow();
				self.redraw();
				return;
			}

			// Open tooltip style window

			// Get location of the toolbar
			var toolbar = $('[data-editor-object-type="10"]').parent();
			var toolbarX = toolbar.offset().left;
			var toolbarY = toolbar.offset().top;
			var toolbarWidth = toolbar.width();

			// Get content for the window
			var windowContent = $.wcpFormGenerateHTMLForForm('Tooltip Style');

			var options = {
				x: Math.round(toolbarX + toolbarWidth + 10),
				y: Math.round(toolbarY),
				padding: true,
				title: 'Tooltip Style',
				width: 300,
				content: windowContent
			};

			$.wcpEditorCreateFloatingWindow(options);
			self.updateShapesForm();
			self.redraw();
		});

		$(document).off('button-edit-tooltip-position-clicked');
		$(document).on('button-edit-tooltip-position-clicked', function () {
			if ($.wcpEditorIsFloatingWindowOpen()) {
				$.wcpEditorCloseFloatingWindow();
			}

			if (settings.editor.transform_tooltip_mode == 1) {
				settings.editor.transform_tooltip_mode = 0;
				self.tooltipTransformMode = false;

				self.redraw();
			} else {
				settings.editor.transform_tooltip_mode = 1;
				self.tooltipTransformMode = true;

				self.transformingTooltipStartingWidth = $('#imp-editor-shape-tooltip').outerWidth();

				self.redraw();
			}


		});

		$(document).off('button-edit-tooltip-content-clicked');
		$(document).on('button-edit-tooltip-content-clicked', function () {
			if (settings.editor.transform_tooltip_mode == 1) {
				settings.editor.transform_tooltip_mode = 0;
				self.tooltipTransformMode = false;

				self.redraw();
			}

			if ($.wcpEditorIsFloatingWindowOpen()) {
				$.wcpEditorCloseFloatingWindow();
				self.redraw();
				return;
			}

			// Open tooltip content window

			// Get location of the toolbar
			var toolbar = $('[data-editor-object-type="10"]').parent();
			var toolbarX = toolbar.offset().left;
			var toolbarY = toolbar.offset().top;
			var toolbarWidth = toolbar.width();

			// Init squares in the tooltip
			$.squaresInitWithSettings($('#imp-editor-shape-tooltip-content-wrap'), self.selectedSpot.tooltip_content.squares_settings);

			// Get content for the window
			var windowContent = $.squaresGetEditorWindowContents();

			var options = {
				x: Math.round(toolbarX + toolbarWidth + 10),
				y: Math.round(toolbarY),
				padding: false,
				title: 'Tooltip Content',
				content: windowContent,
				width: 394
			};

			$.wcpEditorCreateFloatingWindow(options);
		});
	}
	Editor.prototype.canvas_events = function () {
		var self = this;

		$(window).off('resize.imp-redraw');
		$(window).on('resize.imp-redraw', function () {
			self.redraw();
		});

		$(document).off('mousedown', '#wcp-editor-center');
		$(document).on('mousedown', '#wcp-editor-center', function (e) {
			self.handleMouseDown(e);
		});
		$(document).off('mousemove', '#wcp-editor');
		$(document).on('mousemove', '#wcp-editor', function (e) {
			self.handleMouseMove(e);
		});
		$(document).off('mouseup', '#wcp-editor');
		$(document).on('mouseup', '#wcp-editor', function (e) {
			self.handleMouseUp(e);
		});
		// Disable the context menu when deleting control point
		$('body').on('contextmenu', function (e) {
			if (self.didDeleteControlPoint) {
				self.didDeleteControlPoint = false;
				return false;
			}
		});
		// Keyboard shortcuts
		$(document).off('keydown.canvasEvents');
		$(document).on('keydown.canvasEvents', function (e) {
			return self.handleKeyDown(e);
		});
		$(document).off('keyup.canvasEvents');
		$(document).on('keyup.canvasEvents', function (e) {
			return self.handleKeyUp(e);
		});
	}
	Editor.prototype.addAction = function () {
		var self = this;
		if (self.actionIndex < self.actionStack.length - 1) {
			self.actionStack.splice(self.actionIndex + 1, self.actionStack.length);
		}

		self.actionStack.push($.extend(true, {}, settings));
		self.actionIndex++;

		if (self.actionStack.length > 100) {
			self.actionStack.splice(0, 1);
			self.actionIndex--;
		}

		$('#button-save').html('<span class="glyphicon glyphicon-hdd"></span> Save');
	}
	Editor.prototype.undo = function () {
		var self = this;
		if (self.actionIndex > 0) {
			self.actionIndex--;
		}

		settings = $.extend(true, {}, self.actionStack[self.actionIndex]);

		self.redraw();

		// Update forms
		self.updateImageMapForm();
		self.updateImageMapFormState();
		self.updateShapesForm();
		self.updateShapesFormState();
	}
	Editor.prototype.redo = function () {
		var self = this;
		if (self.actionIndex < self.actionStack.length - 1) {
			self.actionIndex++;
		}

		settings = $.extend(true, {}, self.actionStack[self.actionIndex]);

		self.redraw();

		// Update forms
		self.updateImageMapForm();
		self.updateImageMapFormState();
		self.updateShapesForm();
		self.updateShapesFormState();
	}

	Editor.prototype.handleMouseDown = function (e) {
		var self = this;

		// If the event occurred on a UI element of the editor, ignore event
		if ($(e.target).attr('id') == 'wcp-editor-toolbar' || $(e.target).closest('#wcp-editor-toolbar').length == 1) {
			return;
		}
		if ($(e.target).attr('id') == 'wcp-editor-extra-main-buttons' || $(e.target).closest('#wcp-editor-extra-main-buttons').length == 1) {
			return;
		}
		if ($(e.target).closest('#wcp-editor-floating-window').length > 0 || $(e.target).attr('id') == 'wcp-editor-floating-window') {
			return;
		}

		// If user clicked on a tooltip close button, ignore
		if ($(e.target).attr('id') == 'imp-poly-tooltip-close-button') {
			return;
		}

		// === If preview mode, return
		if (isTrue(settings.editor.previewMode)) return;

		// === If a modal is open, ignore
		// to do: Add this class to WCPEditor
		if ($('body').hasClass('modal-open')) return;

		// Convert the screen coords to canvas coords
		var point = screenToCanvasSpace(e.pageX, e.pageY, self.canvas);

		// Record the coords for later use
		self.ix = point.x;
		self.iy = point.y;

		self.ixss = e.pageX;
		self.iyss = e.pageY;

		// Commonly used checks
		var isEventInsideCanvas = false;
		if (point.x > 0 && point.x < self.canvasWidth * self.zoom && point.y > 0 && point.y < self.canvasHeight * self.zoom) {
			isEventInsideCanvas = true;
		}

		// Which object is below the mouse
		var objectType = $(e.target).data('editor-object-type') || $(e.target).closest('[data-editor-object-type]').data('editor-object-type');

		// === Space bar down or drag tool active?
		if ((self.spaceKeyDown || settings.editor.tool == EDITOR_TOOL_DRAG_CANVAS) && isEventInsideCanvas) {
			self.draggingCanvas = true;

			self.canvasInitialX = self.canvasX;
			self.canvasInitialY = self.canvasY;

			return;
		}

		// === Zoom in active?
		if (settings.editor.tool == EDITOR_TOOL_ZOOM_IN && $(e.target).attr('id') != 'wcp-editor-center') {
			self.zoomIn(e);

			// Deselect shapes
			this.shouldDeselectShape = true;

			return;
		}

		// === Zoom out active?
		if (settings.editor.tool == EDITOR_TOOL_ZOOM_OUT && $(e.target).attr('id') != 'wcp-editor-center') {
			self.zoomOut(e);

			// Deselect shapes
			this.shouldDeselectShape = true;

			return;
		}

		// === Drawing a poly?
		if (self.drawingPoly) {
			// close the loop
			if ($(e.target).is('circle') && $(e.target).data('index') == 0) {
				self.drawingPoly = false;
				self.finishedDrawingPoly = true;
				return;
			}

			// or create a new point
			self.placePointForTempPoly(self.ix, self.iy);
			self.redrawTempPoly();
			self.mouseDownWhileDrawingPoly = true;

			return;
		}

		// === Canvas drag active?
		if (settings.editor.tool == EDITOR_TOOL_DRAG_CANVAS && $(e.target).attr('id') != 'wcp-editor-center') {
			self.startedDraggingCanvas = true;

			// Deselect shapes
			this.shouldDeselectShape = true;

			return;
		}

		// === Did user click on a control point?
		if (objectType == EDITOR_OBJECT_TYPE_POLY_POINT) {
			$(e.target).addClass('active');

			self.translatedPointIndex = $(e.target).data('index');

			if (e.button == 2) {
				// Remove the control point
				self.selectedSpot.points.splice(self.translatedPointIndex, 1);
				self.updateBoundingBoxForPolygonSpot(self.selectedSpot);
				self.redraw();
				self.addAction();
				self.didDeleteControlPoint = true;
				return;
			}

			self.translatingControlPoint = true;

			self.translatedPointX = self.selectedSpot.points[self.translatedPointIndex].x;
			self.translatedPointY = self.selectedSpot.points[self.translatedPointIndex].y;

			// Cache
			self.translatedPoint = $(e.target);
			self.redrawPolygonEl = $(e.target).closest('.imp-editor-shape').find('.imp-editor-poly-svg polygon');

			return;
		}

		// === Did user click on a poly line?
		if (objectType == EDITOR_OBJECT_TYPE_POLY_LINE) {
			self.selectedSpot.points.splice(self.tempControlPointIndex + 1, 0, { x: self.controlPointInsertionPointX, y: self.controlPointInsertionPointY });
			self.redraw();

			// Same code as from the "click on control point action"
			var point = $('.imp-editor-shape[data-id="' + self.selectedSpot.id + '"]').find('.imp-poly-control-point[data-index="' + (self.tempControlPointIndex + 1) + '"]');
			point.addClass('active');

			self.translatedPointIndex = point.data('index');
			self.translatingControlPoint = true;

			self.translatedPointX = self.selectedSpot.points[self.translatedPointIndex].x;
			self.translatedPointY = self.selectedSpot.points[self.translatedPointIndex].y;

			// Cache
			self.translatedPoint = point;
			self.redrawPolygonEl = point.closest('.imp-editor-shape').find('.imp-editor-poly-svg polygon');

			return;
		}

		// === Did the event happen on a transform box?
		if (objectType == EDITOR_OBJECT_TYPE_TRANSFORM_GIZMO) {
			self.startedTransforming = true;
			self.transformDirection = $(e.target).data('transform-direction');
			self.redrawEl = $(e.target).closest('.imp-editor-shape');
			self.redrawElBgImage = $('.imp-editor-shape-background-image[data-id="' + self.selectedSpot.id + '"]');

			if (self.selectedSpot.type == 'poly') {
				// Reference for quick redrawing
				self.redrawSvgEl = self.redrawEl.find('.imp-editor-poly-svg');
				self.redrawPolygonEl = self.redrawSvgEl.find('polygon');

				// Save the original coordinates of the poly's points
				self.polyPoints = new Array();
				for (var i = 0; i < self.selectedSpot.points.length; i++) {
					self.polyPoints.push({
						x: self.selectedSpot.points[i].x,
						y: self.selectedSpot.points[i].y
					});
				}
			}

			return;
		}

		// === Did user click on a tooltip?
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP) {
			if (this.tooltipTransformMode) {
				this.startedSelectingTooltip = true;
			}
			return;
		}

		// === Tooltip transform gizmo
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_GIZMO) {
			this.transformDirection = $(e.target).data('transform-direction');
			this.startedTransformingTooltip = true;
			this.didTransformTooltip = false;
			this.redrawTooltip = $('#imp-editor-shape-tooltip');

			// this.transformingTooltipStartingWidth = this.redrawTooltip.outerWidth();
		}

		// === Did the user click on a tooltip button?
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_STYLE) {
			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_TRANSFORM) {
			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_CONTENT) {
			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_DONE) {
			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_RESET) {
			return;
		}

		// === If editor is in transform tooltip mode, stop here
		if (this.tooltipTransformMode) return;

		// === Did user try to select a polygon?
		for (var i = settings.spots.length - 1; i >= 0; i--) {
			if (settings.spots[i].type != 'poly') continue;
			if (isTrue(settings.layers.enable_layers) && settings.spots[i].layerID != settings.editor.currentLayer) continue;

			if (self.shouldSelectPoly(settings.spots[i].id)) {
				self.eventSpotId = settings.spots[i].id;
				self.startedSelecting = true;
				return;
			}
		}

		// === Did the event happen on a shape?
		if ($(e.target).hasClass('imp-editor-shape') || $(e.target).closest('.imp-editor-shape').length > 0) {
			// Make sure it's not a polygon
			if (!$(e.target).hasClass('imp-editor-poly') && $(e.target).closest('.imp-editor-poly').length == 0) {
				self.eventSpotId = $(e.target).data('id') || $(e.target).closest('.imp-editor-shape').data('id');
				self.startedSelecting = true;
				return;
			}
		}

		// === Create spots
		// === If the event is outside canvas, ignore

		if (isEventInsideCanvas) {
			// Spot tool
			if (settings.editor.tool == EDITOR_TOOL_SPOT) {
				self.startedDrawingSpot = true;
				return;
			}

			// Rect tool
			if (settings.editor.tool == EDITOR_TOOL_RECT) {
				self.startedDrawingRect = true;
				return;
			}

			// Ellipse tool
			if (settings.editor.tool == EDITOR_TOOL_OVAL) {
				self.startedDrawingOval = true;
				return;
			}

			// Poly tool
			if (settings.editor.tool == EDITOR_TOOL_POLY) {
				self.startedDrawingPoly = true;

				// deselect and redraw
				self.deselectSpot();
				self.redraw();

				// create a temp array of points
				self.polyPoints = new Array();

				// create a temp poly
				$('#imp-editor-shapes-container').append('<svg id="temp-poly" width="' + self.canvasWidth + 'px" height="' + self.canvasHeight + 'px" viewBox="0 0 ' + self.canvasWidth + ' ' + self.canvasHeight + '" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>')

				// place the first point
				self.placePointForTempPoly(self.ix, self.iy);
				self.redrawTempPoly();
				self.mouseDownWhileDrawingPoly = true;

				self.drawingPoly = true;
				return;
			}

			// Text tool
			if (settings.editor.tool == EDITOR_TOOL_TEXT) {
				self.startedDrawingText = true;
				return;
			}
		}

		// If SELECT tool is active and user clicked the canvas, deselect shape
		if (settings.editor.tool == EDITOR_TOOL_SELECT && objectType == EDITOR_OBJECT_TYPE_CANVAS) {
			this.shouldDeselectShape = true;
			return;
		}

		// If event happened outside the canvas, set the flag to deselect shape
		if ($(e.target).attr('id') == 'wcp-editor-center' && this.selectedSpot) {
			this.shouldDeselectShape = true;
			return;
		}
	}
	Editor.prototype.handleMouseMove = function (e) {
		// === If preview mode, return
		if (isTrue(settings.editor.previewMode)) return;

		// Canvas space coords
		var point = screenToCanvasSpace(e.pageX, e.pageY, this.canvas);

		this.x = point.x;
		this.y = point.y;

		this.dx = ((this.x - this.ix) / this.canvasWidth) * 100;
		this.dy = ((this.y - this.iy) / this.canvasHeight) * 100;

		this.dx = Math.round(this.dx * 1000) / 1000;
		this.dy = Math.round(this.dy * 1000) / 1000;

		// Screen space coords
		this.xss = e.pageX;
		this.yss = e.pageY;

		this.dxss = this.xss - this.ixss;
		this.dyss = this.yss - this.iyss;

		// Move tooltip
		if (this.startedSelectingTooltip) {
			this.movingTooltip = true;
			this.startedSelectingTooltip = false;

			// cache object
			this.redrawTooltip = $('#imp-editor-shape-tooltip');

			// cache tooltip position
			this.movingTooltipPosition = this.selectedSpot.tooltip_style.position;

			// cache tooltip color RGBA
			var c_bg = hexToRgb(this.selectedSpot.default_style.background_color);
			this.movingTooltipColorRGBA = 'rgba(' + c_bg.r + ', ' + c_bg.g + ', ' + c_bg.b + ', ' + this.selectedSpot.tooltip_style.background_opacity + ')';

			// cache arrow
			this.movingTooltipArrow = this.redrawTooltip.find('.hs-arrow');

			// calculate center of shape in pixels, canvas space
			if (this.selectedSpot.type != 'spot') {
				this.movingTooltipShapeCenterX = this.selectedSpot.x + this.selectedSpot.width / 2;
				this.movingTooltipShapeCenterY = this.selectedSpot.y + this.selectedSpot.height / 2;

				this.movingTooltipShapeCenterX = this.movingTooltipShapeCenterX / 100 * this.canvasWidth;
				this.movingTooltipShapeCenterY = this.movingTooltipShapeCenterY / 100 * this.canvasHeight;
			} else {
				this.movingTooltipShapeCenterX = (this.selectedSpot.x / 100 * this.canvasWidth) + this.selectedSpot.width / 2;
				this.movingTooltipShapeCenterY = (this.selectedSpot.y / 100 * this.canvasHeight) + this.selectedSpot.height / 2;
			}

			// calculate center of tooltip in pixels, canvas space
			this.movingTooltipCenterX = this.redrawTooltip.position().left + this.redrawTooltip.outerWidth() / 2;
			this.movingTooltipCenterY = this.redrawTooltip.position().top + this.redrawTooltip.outerHeight() / 2;
		}
		if (this.movingTooltip) {
			if (this.redrawTooltip) {
				// offset tooltip
				this.redrawTooltip.css({
					'transform': 'translate(' + (this.x - this.ix) + 'px,' + (this.y - this.iy) + 'px)'
				});

				var vectorX = this.movingTooltipCenterX + (this.x - this.ix) - this.movingTooltipShapeCenterX;
				var vectorY = this.movingTooltipCenterY + (this.y - this.iy) - this.movingTooltipShapeCenterY;

				// calculate angle from shape center to tooltip center and set arrow
				var angle = Math.atan2(vectorY, vectorX);
				var degrees = 180 * angle / Math.PI;

				if (degrees > -135 && degrees < -45) {
					// top
					this.movingTooltipPosition = 'top';
					this.movingTooltipArrow.attr('class', 'hs-arrow hs-arrow-bottom');

					// set color
					this.movingTooltipArrow.css('border-top-color', this.movingTooltipColorRGBA);
					this.movingTooltipArrow.css('border-bottom-color', '');
					this.movingTooltipArrow.css('border-left-color', '');
					this.movingTooltipArrow.css('border-right-color', '');
				}
				if ((degrees > 135 && degrees < 180) || (degrees > -180 && degrees < -135)) {
					// left
					this.movingTooltipPosition = 'left';
					this.movingTooltipArrow.attr('class', 'hs-arrow hs-arrow-right');

					// set color
					this.movingTooltipArrow.css('border-top-color', '');
					this.movingTooltipArrow.css('border-bottom-color', '');
					this.movingTooltipArrow.css('border-left-color', this.movingTooltipColorRGBA);
					this.movingTooltipArrow.css('border-right-color', '');
				}
				if (degrees > -45 && degrees < 45) {
					// right
					this.movingTooltipPosition = 'right';
					this.movingTooltipArrow.attr('class', 'hs-arrow hs-arrow-left');

					// set color
					this.movingTooltipArrow.css('border-top-color', '');
					this.movingTooltipArrow.css('border-bottom-color', '');
					this.movingTooltipArrow.css('border-left-color', '');
					this.movingTooltipArrow.css('border-right-color', this.movingTooltipColorRGBA);
				}
				if (degrees > 45 && degrees < 135) {
					// bottom
					this.movingTooltipPosition = 'bottom';
					this.movingTooltipArrow.attr('class', 'hs-arrow hs-arrow-top');

					// set color
					this.movingTooltipArrow.css('border-top-color', '');
					this.movingTooltipArrow.css('border-bottom-color', this.movingTooltipColorRGBA);
					this.movingTooltipArrow.css('border-left-color', '');
					this.movingTooltipArrow.css('border-right-color', '');
				}
			}
		}

		// Drag canvas
		if (this.draggingCanvas) {
			var x = this.canvasInitialX + this.dxss;
			var y = this.canvasInitialY + this.dyss;

			this.canvasX = this.canvasInitialX + this.dxss;
			this.canvasY = this.canvasInitialY + this.dyss;

			this.redrawCanvas();
		}

		// Select
		if (this.startedSelecting) {
			// If shape is not selected, remove current tooltip
			this.redrawTooltip = $('#imp-editor-shape-tooltip');
			if (this.selectedSpot && this.eventSpotId != this.selectedSpot.id) {
				this.redrawTooltip.remove();
			}

			this.selectSpot(this.eventSpotId);
			this.redrawEl = $('.imp-editor-shape[data-id="' + this.eventSpotId + '"]');
			this.redrawElBgImage = $('.imp-editor-shape-background-image[data-id="' + this.eventSpotId + '"]');

			// Manually select the spot
			this.redrawSpotSelection();

			this.startedMoving = true;
			this.startedSelecting = false;
		}

		// Move
		if (this.startedMoving) {
			var c = limitToCanvas(this.selectedSpot.x + this.dx, this.selectedSpot.y + this.dy);

			if (this.selectedSpot.type == 'rect' || this.selectedSpot.type == 'oval' || this.selectedSpot.type == 'poly') {
				if (c.x + this.selectedSpot.width > 100) {
					c.x = 100 - this.selectedSpot.width;
				}
				if (c.y + this.selectedSpot.height > 100) {
					c.y = 100 - this.selectedSpot.height;
				}
			}

			this.redrawEl.css({
				left: c.x + '%',
				top: c.y + '%'
			});

			if (this.redrawElBgImage) {
				this.redrawElBgImage.css({
					left: c.x + '%',
					top: c.y + '%'
				});
			}

			// Tooltip translate
			var dx = (c.x - this.selectedSpot.x) / 100 * this.canvasWidth;
			var dy = (c.y - this.selectedSpot.y) / 100 * this.canvasHeight;

			if (this.redrawTooltip) {
				this.redrawTooltip.css({
					'transform': 'translate(' + dx + 'px,' + dy + 'px)'
				});
			}

			return;
		}

		// Transform
		if (this.startedTransforming) {
			this.didTransform = true;
			var c, d;

			if (this.shiftKeyDown) {
				var ratio = this.selectedSpot.width / this.selectedSpot.height;

				if (this.transformDirection == 1 || this.transformDirection == 5) {
					this.dy = this.dx / ratio;
				}
				if (this.transformDirection == 3 || this.transformDirection == 7) {
					this.dy = -this.dx / ratio;
				}
			}

			if (this.transformDirection == 1) {
				c = { x: this.selectedSpot.x + this.dx, y: this.selectedSpot.y + this.dy };
				d = { x: this.selectedSpot.width - this.dx, y: this.selectedSpot.height - this.dy };
			}
			if (this.transformDirection == 2) {
				c = { x: this.selectedSpot.x, y: this.selectedSpot.y + this.dy };
				d = { x: this.selectedSpot.width, y: this.selectedSpot.height - this.dy };
			}
			if (this.transformDirection == 3) {
				c = { x: this.selectedSpot.x, y: this.selectedSpot.y + this.dy };
				d = { x: this.selectedSpot.width + this.dx, y: this.selectedSpot.height - this.dy };
			}
			if (this.transformDirection == 4) {
				c = { x: this.selectedSpot.x, y: this.selectedSpot.y };
				d = { x: this.selectedSpot.width + this.dx, y: this.selectedSpot.height };
			}
			if (this.transformDirection == 5) {
				c = { x: this.selectedSpot.x, y: this.selectedSpot.y };
				d = { x: this.selectedSpot.width + this.dx, y: this.selectedSpot.height + this.dy };
			}
			if (this.transformDirection == 6) {
				c = { x: this.selectedSpot.x, y: this.selectedSpot.y };
				d = { x: this.selectedSpot.width, y: this.selectedSpot.height + this.dy };
			}
			if (this.transformDirection == 7) {
				c = { x: this.selectedSpot.x + this.dx, y: this.selectedSpot.y };
				d = { x: this.selectedSpot.width - this.dx, y: this.selectedSpot.height + this.dy };
			}
			if (this.transformDirection == 8) {
				c = { x: this.selectedSpot.x + this.dx, y: this.selectedSpot.y };
				d = { x: this.selectedSpot.width - this.dx, y: this.selectedSpot.height };
			}

			// Canvas bounds
			if (c.x < 0) {
				d.x = this.selectedSpot.x + this.selectedSpot.width;
				c.x = 0;
			}
			if (c.y < 0) {
				c.y = 0;
				d.y = this.selectedSpot.y + this.selectedSpot.height;
			}
			if (d.x + c.x > 100) d.x = 100 - c.x;
			if (d.y + c.y > 100) d.y = 100 - c.y;

			// Negative width/height
			if (c.x > this.selectedSpot.x + this.selectedSpot.width) c.x = this.selectedSpot.x + this.selectedSpot.width;
			if (c.y > this.selectedSpot.y + this.selectedSpot.height) c.y = this.selectedSpot.y + this.selectedSpot.height;
			if (d.x < 0) d.x = 0;
			if (d.y < 0) d.y = 0;

			this.transformX = c.x;
			this.transformY = c.y;
			this.transformWidth = d.x;
			this.transformHeight = d.y;

			this.redrawEl.css({
				left: this.transformX + '%',
				top: this.transformY + '%',
				width: this.transformWidth + '%',
				height: this.transformHeight + '%'
			});

			this.redrawElBgImage.css({
				left: this.transformX + '%',
				top: this.transformY + '%',
				width: this.transformWidth + '%',
				height: this.transformHeight + '%'
			});

			// Update the SVG viewbox property
			if (this.selectedSpot.type == 'poly') {
				var shapeWidthPx = settings.general.width * (d.x / 100);
				var shapeHeightPx = settings.general.height * (d.y / 100);
				this.redrawSvgEl[0].setAttribute('viewBox', '0 0 ' + shapeWidthPx + ' ' + shapeHeightPx);

				// Redraw the shape
				var coords = '';
				for (var j = 0; j < this.selectedSpot.points.length; j++) {
					var p = this.selectedSpot.points[j];
					var x = this.selectedSpot.default_style.stroke_width + (p.x / 100) * (shapeWidthPx - this.selectedSpot.default_style.stroke_width * 2);
					var y = this.selectedSpot.default_style.stroke_width + (p.y / 100) * (shapeHeightPx - this.selectedSpot.default_style.stroke_width * 2);
					coords += x + ',' + y + ' ';
				}

				this.redrawPolygonEl.attr('points', coords);
			}


			return;
		}

		// Transform Tooltip
		if (this.startedTransformingTooltip) {
			this.didTransformTooltip = true;

			// Calculate new width
			var d = this.ix - this.x;
			if (this.selectedSpot.tooltip_style.position == 'top' || this.selectedSpot.tooltip_style.position == 'bottom') {
				if (this.transformDirection == 4) {
					this.transformingTooltipWidth = this.transformingTooltipStartingWidth - d * 2;
				}
				if (this.transformDirection == 8) {
					this.transformingTooltipWidth = this.transformingTooltipStartingWidth + d * 2;
				}
			} else {
				if (this.transformDirection == 4) {
					this.transformingTooltipWidth = this.transformingTooltipStartingWidth - d;
				}
				if (this.transformDirection == 8) {
					this.transformingTooltipWidth = this.transformingTooltipStartingWidth + d;
				}

			}

			// Recalc position
			var t = this.redrawTooltip;
			var x = 0, y = 0;
			var s = this.selectedSpot;
			var tw = this.transformingTooltipWidth / this.canvasWidth * 100;
			var th = t.outerHeight() / this.canvasHeight * 100;
			var px = 20 / this.canvasWidth * 100;
			var py = 20 / this.canvasHeight * 100;
			var sw = s.width;
			var sh = s.height;
			var sx = s.x;
			var sy = s.y;

			if (s.type == 'spot') {
				sw = s.width / this.canvasWidth * 100;
				sh = s.height / this.canvasHeight * 100;
				sx = s.x - sw / 2;
				sy = s.y - sh / 2;

				if (isTrue(s.default_style.icon_is_pin)) {
					sy -= sh / 2;
				}
			}

			// calculate tooltip x/y in %, canvas space
			if (s.tooltip_style.position == 'top') {
				x = sx + sw / 2 - tw / 2;
				y = sy - th - py;
			}
			if (s.tooltip_style.position == 'bottom') {
				x = sx + sw / 2 - tw / 2;
				y = sy + sh + py;
			}
			if (s.tooltip_style.position == 'left') {
				x = sx - tw - px;
				y = sy + sh / 2 - th / 2;
			}
			if (s.tooltip_style.position == 'right') {
				x = sx + sw + px;
				y = sy + sh / 2 - th / 2;
			}

			// apply tooltip offset
			x += s.tooltip_style.offset_x;
			y += s.tooltip_style.offset_y;

			// Set new width
			this.redrawTooltip.css({
				width: this.transformingTooltipWidth,
				left: x + '%',
				top: y + '%'
			});
		}

		// Draw rect
		if (this.startedDrawingRect) {
			var point = screenToCanvasSpace(e.pageX, e.pageY, this.canvas);

			if (!this.createdDrawingRect) {
				this.createdDrawingRect = true;

				// create a rect
				this.eventSpot = this.createRect();

				// set position
				this.eventSpot.x = (this.x / this.canvasWidth) * 100;
				this.eventSpot.y = (this.y / this.canvasHeight) * 100;

				this.eventSpot.x = Math.round(this.eventSpot.x * 1000) / 1000;
				this.eventSpot.y = Math.round(this.eventSpot.y * 1000) / 1000;

				// redraw once
				this.redraw();

				this.redrawEl = $('.imp-editor-shape[data-id="' + this.eventSpot.id + '"]');
			}

			// fast redraw rect
			var d = { x: this.dx, y: this.dy };

			if (this.eventSpot.x + d.x > 100) {
				d.x = 100 - this.eventSpot.x;
			}
			if (this.eventSpot.y + d.y > 100) {
				d.y = 100 - this.eventSpot.y;
			}

			this.drawRectWidth = d.x;
			this.drawRectHeight = d.y;

			if (this.shiftKeyDown) {
				var ratio = this.canvasWidth / this.canvasHeight;
				this.drawRectHeight = this.drawRectWidth * ratio;
			}

			this.redrawEl.css({
				width: this.drawRectWidth + '%',
				height: this.drawRectHeight + '%'
			});

			return;
		}

		// Draw oval
		if (this.startedDrawingOval) {
			var point = screenToCanvasSpace(e.pageX, e.pageY, this.canvas);

			if (!this.createdDrawingOval) {
				this.createdDrawingOval = true;

				// create a rect
				this.eventSpot = this.createOval();

				// set position
				this.eventSpot.x = (this.x / this.canvasWidth) * 100;
				this.eventSpot.y = (this.y / this.canvasHeight) * 100;

				this.eventSpot.x = Math.round(this.eventSpot.x * 1000) / 1000;
				this.eventSpot.y = Math.round(this.eventSpot.y * 1000) / 1000;

				// set position for image background
				this.eventSpot.x_image_background = this.eventSpot.x;
				this.eventSpot.y_image_background = this.eventSpot.y;

				// redraw once
				this.redraw();

				this.redrawEl = $('.imp-editor-shape[data-id="' + this.eventSpot.id + '"]');
			}

			// fast redraw rect
			var d = { x: this.dx, y: this.dy };

			if (this.eventSpot.x + d.x > 100) {
				d.x = 100 - this.eventSpot.x;
			}
			if (this.eventSpot.y + d.y > 100) {
				d.y = 100 - this.eventSpot.y;
			}

			this.drawRectWidth = d.x;
			this.drawRectHeight = d.y;

			if (this.shiftKeyDown) {
				var ratio = this.canvasWidth / this.canvasHeight;
				this.drawRectHeight = this.drawRectWidth * ratio;
			}

			this.redrawEl.css({
				width: this.drawRectWidth + '%',
				height: this.drawRectHeight + '%'
			});

			return;
		}

		// Draw poly
		if (this.mouseDownWhileDrawingPoly) {
			this.polyPoints[this.polyPoints.length - 1].x = this.x / this.zoom;
			this.polyPoints[this.polyPoints.length - 1].y = this.y / this.zoom;

			this.redrawTempPoly();

			return;
		}

		// Move control point
		if (this.translatingControlPoint) {
			// Scale up the SVG and redraw the points
			if (!this.startedTranslatingControlPoint) {
				this.startedTranslatingControlPoint = true;

				// Hide transform boxes
				$(e.target).closest('.imp-editor-shape').find('.imp-selection').hide();

				// Scale up the shape
				$(e.target).closest('.imp-editor-shape').css({
					left: 0,
					top: 0,
					width: '100%',
					height: '100%'
				});

				// Change the SVG viewbox
				$(e.target).closest('.imp-editor-shape').find('.imp-editor-poly-svg')[0].setAttribute('viewBox', '0 0 ' + settings.general.width + ' ' + settings.general.height);

				// Redraw the control points
				for (var i = 0; i < this.selectedSpot.points.length; i++) {
					$('.imp-editor-shape[data-id="' + this.selectedSpot.id + '"]').find('.imp-poly-control-point[data-index="' + i + '"]').css({
						left: relLocalToRelCanvasSpace(this.selectedSpot.points[i], this.selectedSpot).x + '%',
						top: relLocalToRelCanvasSpace(this.selectedSpot.points[i], this.selectedSpot).y + '%'
					});
				}
			}

			// Limit to canvas bounds
			if (relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).x + this.dx < 0) {
				this.dx = -relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).x;
			}
			if (relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).x + this.dx > 100) {
				this.dx = 100 - relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).x;
			}
			if (relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).y + this.dy < 0) {
				this.dy = -relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).y;
			}
			if (relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).y + this.dy > 100) {
				this.dy = 100 - relLocalToRelCanvasSpace({ x: this.translatedPointX, y: this.translatedPointY }, this.selectedSpot).y;
			}

			// convert this.dx from canvas rel. to poly rel.
			var dx = this.dx / (((this.selectedSpot.width / 100) * this.canvasWidth) / this.canvasWidth);
			var dy = this.dy / (((this.selectedSpot.height / 100) * this.canvasHeight) / this.canvasHeight);

			// Update the coordinates of the translated point
			this.selectedSpot.points[this.translatedPointIndex].x = this.translatedPointX + dx;
			this.selectedSpot.points[this.translatedPointIndex].y = this.translatedPointY + dy;

			// Redraw the control point
			this.translatedPoint.css({
				left: relLocalToRelCanvasSpace(this.selectedSpot.points[this.translatedPointIndex], this.selectedSpot).x + '%',
				top: relLocalToRelCanvasSpace(this.selectedSpot.points[this.translatedPointIndex], this.selectedSpot).y + '%',
			});

			// Redraw the polygon shape
			var coords = '';
			for (var j = 0; j < this.selectedSpot.points.length; j++) {
				var p = relLocalToRelCanvasSpace(this.selectedSpot.points[j], this.selectedSpot);
				var x = this.selectedSpot.default_style.stroke_width + (p.x / 100) * (settings.general.width - this.selectedSpot.default_style.stroke_width * 2);
				var y = this.selectedSpot.default_style.stroke_width + (p.y / 100) * (settings.general.height - this.selectedSpot.default_style.stroke_width * 2);
				// var x = (p.x/100) * (settings.general.width);
				// var y = (p.y/100) * (settings.general.height);
				coords += x + ',' + y + ' ';
			}

			this.redrawPolygonEl.attr('points', coords);

			return;
		}

		// Place temporary control point
		if (this.selectedSpot && this.selectedSpot.type == 'poly') {
			this.redrawSelectedPolyTempPoint(e);
			return;
		}
	}
	Editor.prototype.handleMouseUp = function (e) {
		// === If preview mode, return
		if (isTrue(settings.editor.previewMode)) return;

		// If user clicked on a tooltip close button, remove the tooltip
		if ($(e.target).attr('id') == 'imp-poly-tooltip-close-button') {
			$("#imp-poly-tooltip").remove();
		}

		// Which object is below the mouse
		var objectType = $(e.target).data('editor-object-type') || $(e.target).closest('[data-editor-object-type]').data('editor-object-type');

		if (this.startedDrawingSpot) {
			// Draw spot
			var s = this.createSpot();
			s.x = (this.ix / this.canvasWidth) * 100;
			s.y = (this.iy / this.canvasHeight) * 100;

			s.x = Math.round(s.x * 1000) / 1000;
			s.y = Math.round(s.y * 1000) / 1000;

			this.selectSpot(s.id);
			this.redraw();
			this.addAction();
		} else if (this.startedDrawingRect && this.createdDrawingRect) {
			// Draw rect
			var o = limitToCanvas(this.dx, this.dy);
			this.eventSpot.width = Math.round(this.drawRectWidth * 1000) / 1000;
			this.eventSpot.height = Math.round(this.drawRectHeight * 1000) / 1000;

			this.eventSpot.x_image_background = this.eventSpot.x;
			this.eventSpot.y_image_background = this.eventSpot.y;
			this.eventSpot.width_image_background = this.eventSpot.width;
			this.eventSpot.height_image_background = this.eventSpot.height;

			this.selectSpot(this.eventSpot.id);
			this.redraw();
			this.addAction();
		} else if (this.startedDrawingOval && this.createdDrawingOval) {
			// Draw oval
			var o = limitToCanvas(this.dx, this.dy);
			this.eventSpot.width = Math.round(this.drawRectWidth * 1000) / 1000;
			this.eventSpot.height = Math.round(this.drawRectHeight * 1000) / 1000;

			this.eventSpot.x_image_background = this.eventSpot.x;
			this.eventSpot.y_image_background = this.eventSpot.y;

			this.eventSpot.width_image_background = this.eventSpot.width;
			this.eventSpot.height_image_background = this.eventSpot.height;

			this.selectSpot(this.eventSpot.id);
			this.redraw();
			this.addAction();
		} else if (this.finishedDrawingPoly) {
			// Finish drawing poly
			// Delete temp poly
			$('#temp-poly').remove();

			// Create the final poly
			// Dimentions are created in the createPoly() function
			var p = this.createPoly(this.polyPoints);

			// Select it
			this.selectSpot(p.id);

			p.x_image_background = p.x;
			p.y_image_background = p.y;
			p.width_image_background = p.width;
			p.height_image_background = p.height;

			// Redraw
			this.addAction();
			this.redraw();

		} else if (this.startedDrawingText) {
			// Draw spot
			var s = this.createText();
			s.x = (this.ix / this.canvasWidth) * 100;
			s.y = (this.iy / this.canvasHeight) * 100;

			s.x = Math.round(s.x * 1000) / 1000;
			s.y = Math.round(s.y * 1000) / 1000;

			this.selectSpot(s.id);
			this.redraw();
			this.addAction();
		} else if (this.startedMoving) {
			// Move
			var o = limitToCanvas(this.selectedSpot.x + this.dx, this.selectedSpot.y + this.dy);

			if (this.selectedSpot.type == 'rect' || this.selectedSpot.type == 'oval' || this.selectedSpot.type == 'poly') {
				if (o.x + this.selectedSpot.width > 100) {
					o.x = 100 - this.selectedSpot.width;
				}
				if (o.y + this.selectedSpot.height > 100) {
					o.y = 100 - this.selectedSpot.height;
				}
			}

			this.selectedSpot.x = Math.round(o.x * 1000) / 1000;
			this.selectedSpot.y = Math.round(o.y * 1000) / 1000;

			this.selectedSpot.x_image_background = this.selectedSpot.x;
			this.selectedSpot.y_image_background = this.selectedSpot.y;

			this.redraw();
			this.addAction();

		} else if (this.startedTransforming && this.didTransform) {
			// Transform
			this.selectedSpot.x = Math.round(this.transformX * 1000) / 1000;
			this.selectedSpot.y = Math.round(this.transformY * 1000) / 1000;
			this.selectedSpot.width = Math.round(this.transformWidth * 1000) / 1000;
			this.selectedSpot.height = Math.round(this.transformHeight * 1000) / 1000;

			this.selectedSpot.x_image_background = this.selectedSpot.x;
			this.selectedSpot.y_image_background = this.selectedSpot.y;
			this.selectedSpot.width_image_background = this.selectedSpot.width;
			this.selectedSpot.height_image_background = this.selectedSpot.height;

			this.redraw();
			this.addAction();

		} else if (this.startedTransformingTooltip && this.didTransformTooltip) {
			this.selectedSpot.tooltip_style.width = this.transformingTooltipWidth;
			this.selectedSpot.tooltip_style.auto_width = 0;
			this.addAction();
			this.redraw();
		} else if (this.translatingControlPoint) {
			var dx = this.dx / (((this.selectedSpot.width / 100) * this.canvasWidth) / this.canvasWidth);
			var dy = this.dy / (((this.selectedSpot.height / 100) * this.canvasHeight) / this.canvasHeight);

			// Update the bounding box of the poly
			this.updateBoundingBoxForPolygonSpot(this.selectedSpot);

			this.redraw();
			this.addAction();
		} else if (this.startedSelecting) {
			// Select
			if (this.selectedSpot && this.selectedSpot.id != this.eventSpotId) {
				this.deselectSpot();
			}
			this.selectSpot(this.eventSpotId);

			this.redraw();
			this.addAction();
		} else if (this.shouldDeselectShape) {
			this.deselectSpot();
			this.redraw();
			this.addAction();
		} else if (this.movingTooltip) {
			// ==== calculate new default tooltip coordinates according to current tooltip_style.position
			// ==== before the offset
			var t = this.redrawTooltip;
			var x = 0, y = 0;
			var s = this.selectedSpot;
			var tw = t.outerWidth() / this.canvasWidth * 100;
			var th = t.outerHeight() / this.canvasHeight * 100;
			var px = 20 / this.canvasWidth * 100;
			var py = 20 / this.canvasHeight * 100;
			var sw = s.width;
			var sh = s.height;
			var sx = s.x;
			var sy = s.y;

			if (s.type == 'spot') {
				sw = s.width / this.canvasWidth * 100;
				sh = s.height / this.canvasHeight * 100;
				sx = s.x - sw / 2;
				sy = s.y - sh / 2;

				if (isTrue(s.default_style.icon_is_pin)) {
					sy -= sh / 2;
				}
			}

			// calculate tooltip x/y in %, canvas space
			if (this.movingTooltipPosition == 'top') {
				x = sx + sw / 2 - tw / 2;
				y = sy - th - py;
			}
			if (this.movingTooltipPosition == 'bottom') {
				x = sx + sw / 2 - tw / 2;
				y = sy + sh + py;
			}
			if (this.movingTooltipPosition == 'left') {
				x = sx - tw - px;
				y = sy + sh / 2 - th / 2;
			}
			if (this.movingTooltipPosition == 'right') {
				x = sx + sw + px;
				y = sy + sh / 2 - th / 2;
			}

			// calculate new default center of the tooltip
			var newDefaultCenterX = x + tw / 2;
			var newDefaultCenterY = y + th / 2;

			// calculate current center of tooltip
			var currentCenterX = (this.redrawTooltip.position().left + this.redrawTooltip.outerWidth() / 2) / this.canvasWidth * 100;
			var currentCenterY = (this.redrawTooltip.position().top + this.redrawTooltip.outerHeight() / 2) / this.canvasHeight * 100;

			// calculate offset from new default center to current center
			var ox = currentCenterX - newDefaultCenterX;
			var oy = currentCenterY - newDefaultCenterY;

			// apply offset
			this.selectedSpot.tooltip_style.offset_x = ox;
			this.selectedSpot.tooltip_style.offset_y = oy;
			this.selectedSpot.tooltip_style.position = this.movingTooltipPosition;

			this.addAction();
			this.redraw();
		}

		// === Did the user click on a tooltip button?
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_STYLE) {
			if ($.wcpEditorIsFloatingWindowOpen()) {
				$.wcpEditorCloseFloatingWindow();
				this.redraw();
				return;
			}

			// Open tooltip style window

			// Get location of the toolbar
			var toolbar = $('[data-editor-object-type="10"]').parent();
			var toolbarX = toolbar.offset().left;
			var toolbarY = toolbar.offset().top;
			var toolbarWidth = toolbar.width();

			// Get content for the window
			var windowContent = $.wcpFormGenerateHTMLForForm('Tooltip Style');

			var options = {
				x: Math.round(toolbarX + toolbarWidth + 10),
				y: Math.round(toolbarY),
				padding: true,
				title: 'Tooltip Style',
				width: 300,
				content: windowContent
			};

			$.wcpEditorCreateFloatingWindow(options);
			this.updateShapesForm();
			this.redraw();

			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_TRANSFORM) {
			if ($.wcpEditorIsFloatingWindowOpen()) {
				$.wcpEditorCloseFloatingWindow();
			}

			settings.editor.transform_tooltip_mode = 1;
			this.tooltipTransformMode = true;

			this.transformingTooltipStartingWidth = $('#imp-editor-shape-tooltip').outerWidth();

			this.redraw();
			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_CONTENT) {
			if ($.wcpEditorIsFloatingWindowOpen()) {
				$.wcpEditorCloseFloatingWindow();
				this.redraw();
				return;
			}

			// Open tooltip content window

			// Get location of the toolbar
			var toolbar = $('[data-editor-object-type="10"]').parent();
			var toolbarX = toolbar.offset().left;
			var toolbarY = toolbar.offset().top;
			var toolbarWidth = toolbar.width();

			// Init squares in the tooltip
			$.squaresInitWithSettings($('#imp-editor-shape-tooltip-content-wrap'), this.selectedSpot.tooltip_content.squares_settings);

			// Get content for the window
			var windowContent = $.squaresGetEditorWindowContents();

			var options = {
				x: Math.round(toolbarX + toolbarWidth + 10),
				y: Math.round(toolbarY),
				padding: false,
				title: 'Tooltip Content',
				content: windowContent,
				width: 394
			};

			$.wcpEditorCreateFloatingWindow(options);

			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_DONE) {
			settings.editor.transform_tooltip_mode = 0;
			this.tooltipTransformMode = false;

			this.addAction();
			this.redraw();
			return;
		}
		if (objectType == EDITOR_OBJECT_TYPE_TOOLTIP_BUTTON_RESET) {
			this.selectedSpot.tooltip_style.offset_x = 0;
			this.selectedSpot.tooltip_style.offset_y = 0;
			this.selectedSpot.tooltip_style.width = this.transformingTooltipStartingWidth;

			this.addAction();
			this.redraw();
			return;
		}

		// Reset flags
		this.draggingCanvas = false;
		this.startedSelecting = false;
		this.startedMoving = false;
		this.startedTransforming = false;
		this.didTransform = false;
		this.startedTransformingTooltip = false;
		this.didTransformTooltip = false;
		this.transformDirection = 0;

		this.startedDrawingSpot = false;
		this.startedDrawingText = false;

		this.startedDrawingRect = false;
		this.createdDrawingRect = false;

		this.startedDrawingOval = false;
		this.createdDrawingOval = false;

		this.startedDrawingPoly = false;
		this.finishedDrawingPoly = false;
		this.mouseDownWhileDrawingPoly = false;

		this.translatingControlPoint = false;
		this.startedTranslatingControlPoint = false;

		this.shouldDeselectShape = false;

		this.startedSelectingTooltip = false;
		this.movingTooltip = false;
	}
	Editor.prototype.handleKeyDown = function (e) {
		// console.log('keydown: ' + e.keyCode);
		var returnValue = undefined;

		// If there is an input field focused, don't return any keys
		if ($('input:focus').length > 0 || $('textarea:focus').length > 0) {
			return true;
		}

		// Space
		if (e.keyCode == 32) {
			this.spaceKeyDown = true;
			this.enterCanvasDragMode();

			returnValue = false;
		}
		// CMD
		if (e.keyCode == 91) {
			this.commandKeyDown = true;
			returnValue = true;
		}
		// CTRL
		if (e.keyCode == 17) {
			this.ctrlKeyDown = true;
			returnValue = true;
		}
		// SHIFT
		if (e.keyCode == 16) {
			this.shiftKeyDown = true;
			returnValue = true;
		}
		// +
		if (e.keyCode == 187 || e.keyCode == 107) {
			if (this.ctrlKeyDown || this.commandKeyDown) {
				this.zoomIn();
				returnValue = false;
			}
		}
		// -
		if (e.keyCode == 189 || e.keyCode == 109) {
			if (this.ctrlKeyDown || this.commandKeyDown) {
				this.zoomOut();
				returnValue = false;
			}
		}
		// 0
		if (e.keyCode == 48) {
			if (this.ctrlKeyDown || this.commandKeyDown) {
				this.zoomReset();
				returnValue = false;
			}
		}

		return returnValue;
	}
	Editor.prototype.handleKeyUp = function (e) {
		var returnValue = false;

		// If there is an input field focused, don't return any keys
		if ($('input:focus').length > 0 || $('textarea:focus').length > 0) {
			// Icon search
			if ($('#input-icon-search').is(':focus')) {
				$.wcpFontawesomeSearch($('#input-icon-search').val());
			}

			return true;
		}

		// Space
		if (e.keyCode == 32) {
			this.spaceKeyDown = false;

			this.exitCanvasDragMode();

			returnValue = false;
		}
		// CMD
		if (e.keyCode == 91) {
			this.commandKeyDown = false;
			returnValue = true;
		}
		// CTRL
		if (e.keyCode == 17) {
			this.ctrlKeyDown = false;
			returnValue = true;
		}
		// SHIFT
		if (e.keyCode == 16) {
			this.shiftKeyDown = false;
			returnValue = true;
		}

		// ESC
		if (e.keyCode == 27) {
			if (this.drawingPoly) {
				this.drawingPoly = false;
				this.startedDrawingPoly = false;
				this.mouseDownWhileDrawingPoly = false;
				$('#temp-poly').remove();
			} else if (this.tooltipTransformMode) {
				this.tooltipTransformMode = false;
				settings.editor.transform_tooltip_mode = 0;
				this.redraw();
			} else {
				$.wcpEditorCloseModal();
			}
		}
		// ENTER
		if (e.keyCode == 13) {
			if (this.drawingPoly) {
				this.drawingPoly = false;
				this.finishedDrawingPoly = false;

				// Finish drawing poly

				// Delete temp poly
				$('#temp-poly').remove();

				// Create the final poly
				// Dimentions are created in the createPoly() function
				var p = this.createPoly(this.polyPoints);

				// Select it
				this.selectSpot(p.id);

				// Redraw
				this.addAction();
				this.redraw();
			} else if (this.tooltipTransformMode) {
				this.tooltipTransformMode = false;
				settings.editor.transform_tooltip_mode = 0;
				// Apply offsets to tooltip


				this.redraw();
			}
		}
		// DELETE
		if (e.keyCode == 46) {
			returnValue = true;
			if (this.selectedSpot) {
				indexOfShapeToDelete = editor.getIndexOfSpotWithId(this.selectedSpot.id);

				$.wcpEditorPresentModal({
					name: 'confirm-delete-shape',
					title: 'Confirm Delete',
					buttons: [
						{
							name: 'cancel',
							title: 'Cancel',
							class: ''
						},
						{
							name: 'primary',
							title: 'Delete',
							class: 'danger'
						}
					],
					body: 'Delete this shape?'
				});
			}
		}

		return returnValue;
	}

	Editor.prototype.getIndexOfSpotWithId = function (id) {
		for (var i = 0; i < settings.spots.length; i++) {
			if (settings.spots[i].id == id) {
				return i;
			}
		}
	}
	Editor.prototype.selectSpot = function (id) {
		settings.editor.selected_shape = id;
	}
	Editor.prototype.deselectSpot = function () {
		$.wcpEditorCloseFloatingWindow();

		// Reset flags
		settings.editor.selected_shape = -1;
		settings.editor.transform_tooltip_mode = 0;
		this.tooltipTransformMode = false;

		// Update shape settings UI
	}

	Editor.prototype.createIdForSpot = function () {
		var id = 0;

		// Check if there is already a shape with the same ID
		var exists = false;

		do {
			id = 'spot-' + Math.floor(Math.random() * 9999);

			exists = false;
			for (var i = 0; i < settings.spots.length; i++) {
				if (settings.spots[i].id == id) {
					exists = true;
					break;
				}
			}
		} while (exists);

		return id;
	}
	Editor.prototype.createIdForRect = function () {
		var id = 0;
		// Check if there is already a shape with the same ID
		var exists = false;

		do {
			id = 'rect-' + Math.floor(Math.random() * 9999);

			exists = false;
			for (var i = 0; i < settings.spots.length; i++) {
				if (settings.spots[i].id == id) {
					exists = true;
					break;
				}
			}
		} while (exists);

		return id;
	}
	Editor.prototype.createIdForOval = function () {
		var id = 0;

		// Check if there is already a shape with the same ID
		var exists = false;

		do {
			id = 'oval-' + Math.floor(Math.random() * 9999);

			exists = false;
			for (var i = 0; i < settings.spots.length; i++) {
				if (settings.spots[i].id == id) {
					exists = true;
					break;
				}
			}
		} while (exists);

		return id;
	}
	Editor.prototype.createIdForPoly = function () {
		var id = 0;

		// Check if there is already a shape with the same ID
		var exists = false;

		do {
			id = 'poly-' + Math.floor(Math.random() * 9999);

			exists = false;
			for (var i = 0; i < settings.spots.length; i++) {
				if (settings.spots[i].id == id) {
					exists = true;
					break;
				}
			}
		} while (exists);

		return id;
	}
	Editor.prototype.createIdForText = function () {
		var id = 0;

		// Check if there is already a shape with the same ID
		var exists = false;

		do {
			id = 'text-' + Math.floor(Math.random() * 9999);

			exists = false;
			for (var i = 0; i < settings.spots.length; i++) {
				if (settings.spots[i].id == id) {
					exists = true;
					break;
				}
			}
		} while (exists);

		return id;
	}
	Editor.prototype.createIdForPath = function () {
		var id = 0;

		// Check if there is already a shape with the same ID
		var exists = false;

		do {
			id = 'path-' + Math.floor(Math.random() * 9999);

			exists = false;
			for (var i = 0; i < settings.spots.length; i++) {
				if (settings.spots[i].id == id) {
					exists = true;
					break;
				}
			}
		} while (exists);

		return id;
	}
	Editor.prototype.createIdForLayer = function () {
		var largest = 0;

		for (var i = 0; i < settings.layers.layers_list.length; i++) {
			if (settings.layers.layers_list[i].id > largest) {
				largest = settings.layers.layers_list[i].id;
			}
		}

		largest++;
		return largest;
	}

	Editor.prototype.createTitleForSpot = function () {
		var title = 'Spot ' + settings.editor.shapeCounter.spots;

		settings.editor.shapeCounter.spots++;

		return title;
	}
	Editor.prototype.createTitleForRect = function () {
		var title = 'Rect ' + settings.editor.shapeCounter.rects;

		settings.editor.shapeCounter.rects++;

		return title;
	}
	Editor.prototype.createTitleForOval = function () {
		var title = 'Oval ' + settings.editor.shapeCounter.ovals;

		settings.editor.shapeCounter.ovals++;

		return title;
	}
	Editor.prototype.createTitleForPoly = function () {
		var title = 'Poly ' + settings.editor.shapeCounter.polys;

		settings.editor.shapeCounter.polys++;

		return title;
	}
	Editor.prototype.createTitleForText = function () {
		var title = 'Text ' + settings.editor.shapeCounter.texts;

		settings.editor.shapeCounter.texts++;

		return title;
	}
	Editor.prototype.createTitleForPath = function () {
		var title = 'Path ' + settings.editor.shapeCounter.paths;

		settings.editor.shapeCounter.paths++;

		return title;
	}

	Editor.prototype.createSpot = function () {
		var s = $.extend(true, {}, default_spot_settings);
		s.type = 'spot';
		s.id = this.createIdForSpot();
		s.title = this.createTitleForSpot();
		s.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = s.title; // omg

		if (isTrue(settings.layers.enable_layers)) {
			s.layerID = settings.editor.currentLayer;
		} else {
			if (settings.layers.layers_list[0]) {
				s.layerID = settings.layers.layers_list[0].id;
			} else {
				s.layerID = 0;
			}
		}

		settings.spots.push(s);

		return s;
	}
	Editor.prototype.createRect = function () {
		var s = $.extend(true, {}, default_spot_settings);
		s.type = 'rect';
		s.default_style.border_radius = 10;
		s.mouseover_style.border_radius = 10;
		s.id = this.createIdForRect();
		s.title = this.createTitleForRect();
		s.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = s.title; // omg

		if (isTrue(settings.layers.enable_layers)) {
			s.layerID = settings.editor.currentLayer;
		} else {
			if (settings.layers.layers_list[0]) {
				s.layerID = settings.layers.layers_list[0].id;
			} else {
				s.layerID = 0;
			}
		}

		settings.spots.push(s);

		return s;
	}
	Editor.prototype.createOval = function () {
		var s = $.extend(true, {}, default_spot_settings);
		s.type = 'oval';
		s.id = this.createIdForOval();
		s.title = this.createTitleForOval();
		s.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = s.title; // omg

		if (isTrue(settings.layers.enable_layers)) {
			s.layerID = settings.editor.currentLayer;
		} else {
			if (settings.layers.layers_list[0]) {
				s.layerID = settings.layers.layers_list[0].id;
			} else {
				s.layerID = 0;
			}
		}

		settings.spots.push(s);

		return s;
	}
	Editor.prototype.createPoly = function (polyPoints, offsetX = 0, offsetY = 0) {
		var s = $.extend(true, {}, default_spot_settings);
		s.type = 'poly';
		s.id = this.createIdForPoly();
		s.title = this.createTitleForPoly();
		s.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = s.title; // omg

		// Set dimentions
		var minX = 99999, minY = 99999, maxX = 0, maxY = 0;
		for (var i = 0; i < polyPoints.length; i++) {
			var p = polyPoints[i];

			if (p.x < minX) minX = p.x;
			if (p.x > maxX) maxX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.y > maxY) maxY = p.y;
		}

		// Apply offset
		for (var i = 0; i < polyPoints.length; i++) {
			polyPoints[i].x += offsetX
			polyPoints[i].y += offsetY
		}

		var pixelWidth = maxX - minX;
		var pixelHeight = maxY - minY;

		// percentage, relative to the canvas width/height
		s.x = (minX / this.canvasWidth) * 100 * this.zoom;
		s.y = (minY / this.canvasHeight) * 100 * this.zoom;
		s.width = (pixelWidth / this.canvasWidth) * 100 * this.zoom;
		s.height = (pixelHeight / this.canvasHeight) * 100 * this.zoom;

		for (var i = 0; i < polyPoints.length; i++) {
			// coordinates are in percentage, relative to the current pixel dimentions of the shape box
			s.points.push({
				x: ((polyPoints[i].x - minX) / pixelWidth) * 100,
				y: ((polyPoints[i].y - minY) / pixelHeight) * 100
			});
		}

		if (isTrue(settings.layers.enable_layers)) {
			s.layerID = settings.editor.currentLayer;
		} else {
			if (settings.layers.layers_list[0]) {
				s.layerID = settings.layers.layers_list[0].id;
			} else {
				s.layerID = 0;
			}
		}

		settings.spots.push(s);

		return s;
	}
	Editor.prototype.createText = function () {
		var s = $.extend(true, {}, default_spot_settings);
		s.type = 'text';
		s.id = this.createIdForText();
		s.title = this.createTitleForText();
		s.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = s.title; // omg

		if (isTrue(settings.layers.enable_layers)) {
			s.layerID = settings.editor.currentLayer;
		} else {
			if (settings.layers.layers_list[0]) {
				s.layerID = settings.layers.layers_list[0].id;
			} else {
				s.layerID = 0;
			}
		}

		settings.spots.push(s);

		return s;
	}
	Editor.prototype.createPath = function (d, offsetX, offsetY) {
		var s = $.extend(true, {}, default_spot_settings);
		var pathDatas = $.pathParse(d).absNormalize()

		s.type = 'path';
		s.id = this.createIdForPath();
		s.title = this.createTitleForPath();
		s.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = s.title; // omg

		// If there is an offset set,
		// Apply offset to the parsed path commands
		pathDatas = $.offsetPath(pathDatas, offsetX, offsetY)

		// Get minX, maxX...
		var minMax = $.getMinMaxValues(pathDatas)

		// percentage, relative to the width/height
		// the only way to import "path" nodes currently is by creating a new image map,
		// or with the Import window. Both ways replace the current image map, so the canvasSize is not relevant
		var pixelWidth = minMax.maxX - minMax.minX;
		var pixelHeight = minMax.maxY - minMax.minY;

		s.d = $.serializePath(pathDatas)
		s.x = (minMax.minX / settings.general.width) * 100;
		s.y = (minMax.minY / settings.general.height) * 100;
		s.width = (pixelWidth / settings.general.width) * 100;
		s.height = (pixelHeight / settings.general.height) * 100;

		// Set layer
		if (isTrue(settings.layers.enable_layers)) {
			s.layerID = settings.editor.currentLayer;
		} else {
			if (settings.layers.layers_list[0]) {
				s.layerID = settings.layers.layers_list[0].id;
			} else {
				s.layerID = 0;
			}
		}

		// Done
		settings.spots.push(s);
		return s;
	}

	Editor.prototype.enterCanvasDragMode = function () {
		if (!settings.editor.state.dragging) {
			settings.editor.state.dragging = true;

			this.canvas.append('<div class="imp-editor-canvas-overlay" id="imp-editor-canvas-overlay-drag"></div>');
		}
	}
	Editor.prototype.exitCanvasDragMode = function () {
		if (settings.editor.state.dragging) {
			settings.editor.state.dragging = false;

			this.canvas.find('#imp-editor-canvas-overlay-drag').remove();
		}
	}
	Editor.prototype.zoomIn = function (e) {
		this.zoom *= 2;
		settings.editor.zoom = this.zoom;

		if (this.zoom > editorMaxZoomLevel) {
			this.zoom = editorMaxZoomLevel;
		} else {
			// The distance to offset the image
			var dx = 0;
			var dy = 0;

			// The focal point around which to center the image
			var fx = 0;
			var fy = 0;

			// Check if the zoom was triggered by clicking with the zoom tool, or by keyboard shortcut
			if (e) {
				// Focal point is at event point in pixel canvas space
				fx = this.ix;
				fy = this.iy;
			} else {
				// If there is a shape selected, set the focal point to its center
				if (this.selectedSpot) {
					// Find out the center of the shape

					if (this.selectedSpot.type != 'spot') {
						fx = this.selectedSpot.x + this.selectedSpot.width / 2;
						fy = this.selectedSpot.y + this.selectedSpot.height / 2;

						fx = fx / 100 * this.canvasWidth;
						fy = fy / 100 * this.canvasHeight;
					} else {
						fx = (this.selectedSpot.x / 100 * this.canvasWidth) + this.selectedSpot.width / 2;
						fy = (this.selectedSpot.y / 100 * this.canvasHeight) + this.selectedSpot.height / 2;
					}
				} else {
					// Otherwise assume that the focal point is at the center of #wcp-editor-center
					var wcpEditorCenter = $('#wcp-editor-center');

					// Center of wcp-editor-center, relative to screen
					var wcpEditorCenterCenterX = wcpEditorCenter.offset().left + wcpEditorCenter.width() / 2;
					var wcpEditorCenterCenterY = wcpEditorCenter.offset().top + wcpEditorCenter.height() / 2;

					// Center of wcp-editor-center in pixel canvas space
					var p = screenToCanvasSpace(wcpEditorCenterCenterX, wcpEditorCenterCenterY, this.canvas);

					// Set focal point to that center
					fx = p.x;
					fy = p.y;
				}
			}

			// Find the distance from the focal point to the center of the image, all in pixel canvas space
			dx = (this.canvasWidth / 2) - fx;
			dy = (this.canvasHeight / 2) - fy;

			// Adjust the canvas position to match the focal point
			this.canvasX += dx;
			this.canvasY += dy;

			// Redraw
			this.redrawCanvas();
			this.redraw();
		}
	}
	Editor.prototype.zoomOut = function (e) {
		this.zoom /= 2;
		settings.editor.zoom = this.zoom;

		if (this.zoom < 1) {
			this.zoom = 1;
			settings.editor.zoom = 1;
		} else {
			// The distance to offset the image
			var dx = 0;
			var dy = 0;

			// The focal point around which to center the image
			var fx = 0;
			var fy = 0;

			// Check if the zoom was triggered by clicking with the zoom tool, or by keyboard shortcut
			if (e) {
				// Focal point is at event point in pixel canvas space
				fx = this.ix;
				fy = this.iy;
			} else {
				// Assume that the focal point is at the center of #wcp-editor-center
				var wcpEditorCenter = $('#wcp-editor-center');

				// Center of wcp-editor-center, relative to screen
				var wcpEditorCenterCenterX = wcpEditorCenter.offset().left + wcpEditorCenter.width() / 2;
				var wcpEditorCenterCenterY = wcpEditorCenter.offset().top + wcpEditorCenter.height() / 2;

				// Center of wcp-editor-center in pixel canvas space
				var p = screenToCanvasSpace(wcpEditorCenterCenterX, wcpEditorCenterCenterY, this.canvas);

				// Set focal point to that center
				fx = p.x;
				fy = p.y;
			}

			// Find the distance from the focal point to the center of the image, all in pixel canvas space
			dx = (this.canvasWidth / 2) - fx;
			dy = (this.canvasHeight / 2) - fy;

			// Adjust the canvas position to match the focal point
			this.canvasX -= dx / 2;
			this.canvasY -= dy / 2;

			// Redraw
			this.redrawCanvas();
			this.redraw();
		}

		if (this.zoom == 1) {
			// If zoom becomes 1, reset the canvas offset
			this.canvasX = 0;
			this.canvasY = 0;
			this.redrawCanvas();
		}
	}
	Editor.prototype.zoomReset = function () {
		this.zoom = 1;
		settings.editor.zoom = this.zoom;

		this.canvasX = 0;
		this.canvasY = 0;

		this.redrawCanvas();
		this.redraw();
	}
	Editor.prototype.shouldSelectPoly = function (id) {
		var self = this;
		var s;

		for (var i = 0; i < settings.spots.length; i++) {
			if (settings.spots[i].id == id) {
				s = settings.spots[i];
			}
		}

		// Coordinates in shape pixel space
		var x = self.ix - (s.x / 100) * self.canvasWidth;
		var y = self.iy - (s.y / 100) * self.canvasHeight;

		// Spot dimentions in pixels
		var spotWidth = (s.width / 100) * self.canvasWidth;
		var spotHeight = (s.height / 100) * self.canvasHeight;

		// Convert to shape percentage space
		x = (x / spotWidth) * 100;
		y = (y / spotHeight) * 100;

		var testPoly = new Array();
		for (var i = 0; i < s.points.length; i++) {
			testPoly.push([s.points[i].x, s.points[i].y]);
		}

		if (isPointInsidePolygon({ x: x, y: y }, testPoly)) {
			return true;
		} else {
			return false;
		}
	}
	Editor.prototype.placePointForTempPoly = function (x, y) {
		var self = this;

		self.polyPoints.push({
			x: x / self.zoom,
			y: y / self.zoom
		});
	}
	Editor.prototype.redrawTempPoly = function () {
		var self = this;

		// Draw polygon
		var html = '<polygon points="'

		for (var i = 0; i < self.polyPoints.length; i++) {
			var x = self.polyPoints[i].x * self.zoom;
			var y = self.polyPoints[i].y * self.zoom;
			html += x + ',' + y + ' ';
		}
		html += '" />';

		// Draw points

		for (var i = 0; i < self.polyPoints.length; i++) {
			var x = self.polyPoints[i].x * self.zoom;
			var y = self.polyPoints[i].y * self.zoom;

			html += '<circle cx="' + x + '" cy="' + y + '" r="4" data-index="' + i + '" />';
		}

		// Insert HTML
		if ($('#temp-poly').length == 0) {
			$('#imp-editor-shapes-container').append('<svg id="temp-poly" width="' + self.canvasWidth + 'px" height="' + self.canvasHeight + 'px" viewBox="0 0 ' + self.canvasWidth + ' ' + self.canvasHeight + '" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>')
		}
		$('#temp-poly').html(html);

		// Tooltip
		var html = '';

		if (localStorage['image-map-pro-seen-poly-tooltip'] != 1) {
			localStorage['image-map-pro-seen-poly-tooltip'] = 1;

			var x = self.polyPoints[0].x * self.zoom;
			var y = self.polyPoints[0].y * self.zoom;

			html += '<div id="imp-poly-tooltip" style="left: ' + x + 'px; top: ' + y + 'px;">Click the first point or press ENTER to finish <i class="fa fa-times" aria-hidden="true" id="imp-poly-tooltip-close-button"></i></div>';

			$('#imp-editor-shapes-container').append(html);
			$('#imp-poly-tooltip').css({
				left: $('#imp-poly-tooltip').position().left - $('#imp-poly-tooltip').outerWidth() - 20,
				top: $('#imp-poly-tooltip').position().top - $('#imp-poly-tooltip').outerHeight() / 2,
			});
		}
	}
	Editor.prototype.redrawSelectedPolyTempPoint = function (e) {
		var self = this;

		// Convert canvas space pixel coordinates to percentage space polygon space
		var polygonPixelWidth = (self.selectedSpot.width / 100) * self.canvasWidth;
		var polygonPixelHeight = (self.selectedSpot.height / 100) * self.canvasHeight;
		var xPolygonPixelSpace = self.x - ((self.selectedSpot.x / 100) * self.canvasWidth);
		var yPolygonPixelSpace = self.y - ((self.selectedSpot.y / 100) * self.canvasHeight);
		var xPolygonPerSpace = (xPolygonPixelSpace / polygonPixelWidth) * 100;
		var yPolygonPerSpace = (yPolygonPixelSpace / polygonPixelHeight) * 100;

		var p;
		if (p = self.shouldShowTempControlPoint(xPolygonPerSpace, yPolygonPerSpace, self.selectedSpot.points, e)) {
			// Show
			self.tempControlPoint.show();
			self.tempControlPointLine.show();

			self.tempControlPoint.css({
				left: p.x + '%',
				top: p.y + '%'
			});

			self.controlPointInsertionPointX = p.x;
			self.controlPointInsertionPointY = p.y;
		} else {
			// Hide
			self.tempControlPoint.hide();
			self.tempControlPointLine.hide();
		}
	}
	Editor.prototype.shouldShowTempControlPoint = function (x, y, points, e) {
		// Get the object type under the mouse
		var objectType = $(e.target).data('editor-object-type') || $(e.target).closest('[data-editor-object-type]').data('editor-object-type')

		// If there is a control point under the mouse, don't show the temp control point
		if (objectType == EDITOR_OBJECT_TYPE_POLY_POINT) return false;

		// Continue
		var self = this;
		var p = { x: x, y: y };
		var shortestDistance = 9999;
		var shortestDistanceIndex = -1;
		var shortestDistanceCoords = false;

		var shapeWidthPx = self.canvasWidth * (self.selectedSpot.width / 100);
		var minDistancePx = 20;
		var minDistance = minDistancePx * 100 / shapeWidthPx;

		// Test for each line
		for (var i = 0; i < points.length; i++) {
			var a = { x: points[i].x, y: points[i].y };
			var b = undefined;

			if (points[i + 1]) {
				b = { x: points[i + 1].x, y: points[i + 1].y };
			} else {
				b = { x: points[0].x, y: points[0].y };
			}

			var closestPointToLine = new Vector2(p.x, p.y).closestPointOnLine(new Vector2(a.x, a.y), new Vector2(b.x, b.y));
			var d = Math.sqrt(Math.pow((p.x - closestPointToLine.x), 2) + Math.pow((p.y - closestPointToLine.y), 2));

			if (d < shortestDistance && d < minDistance) {
				self.tempControlPointIndex = i;
				shortestDistance = d;
				shortestDistanceIndex = i;
				shortestDistanceCoords = { x: closestPointToLine.x, y: closestPointToLine.y };
			}
		}

		if (shortestDistanceIndex != -1) {
			return shortestDistanceCoords;
		} else {
			return false;
		}
	}
	Editor.prototype.updateBoundingBoxForPolygonSpot = function (s) {
		var minX = 99999, minY = 99999, maxX = -99999, maxY = -99999;
		for (var i = 0; i < s.points.length; i++) {
			var p = s.points[i];

			if (p.x < minX) minX = p.x;
			if (p.x > maxX) maxX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.y > maxY) maxY = p.y;
		}

		// Calculate new bounding box
		var o = relLocalToRelCanvasSpace({ x: minX, y: minY }, s);
		var o2 = relLocalToRelCanvasSpace({ x: maxX, y: maxY }, s);

		// Update the coordinates of the points
		for (var i = 0; i < s.points.length; i++) {
			var p = s.points[i];

			// to canvas space
			var p1 = relLocalToRelCanvasSpace(p, s);
			// to local space
			var p2 = relCanvasToRelLocalSpace(p1, { x: o.x, y: o.y, width: o2.x - o.x, height: o2.y - o.y });
			p.x = p2.x;
			p.y = p2.y;
		}

		// Set new values
		s.x = o.x;
		s.y = o.y;
		s.width = o2.x - o.x;
		s.height = o2.y - o.y;
	}
	Editor.prototype.updateShapesList = function () {
		// Create a list of items
		var listItems = [];
		for (var i = settings.spots.length - 1; i >= 0; i--) {
			var s = settings.spots[i];
			var listItem = { id: s.id, title: s.title, modelIndex: i }

			if (!isTrue(settings.layers.enable_layers) || parseInt(s.layerID, 10) == parseInt(settings.editor.currentLayer, 10)) {
				listItems.push(listItem);
			}
		}

		// Set items
		$.wcpEditorSetListItems(listItems);

		// Select item
		$.wcpEditorSelectListItem(settings.editor.selected_shape);
	}
	Editor.prototype.launchTooltipContentBuilder = function () {
		if ($('#imp-editor-tooltip-content-builder-wrap').length == 0) {
			// add HTML
			var html = '';

			html += '<div id="imp-editor-tooltip-content-builder-wrap">';
			html += '   <div id="imp-editor-tooltip-content-builder-background"></div>';
			html += '   <div id="imp-editor-tooltip-content-builder-close"><i class="fa fa-times" aria-hidden="true"></i></div>';
			html += '   <div id="imp-editor-tooltip-content-builder-tooltip-wrap" class="squares">';
			html += '       <div id="imp-editor-tooltip-content-builder" class="squares"></div>';
			html += '   </div>';
			html += '   <div id="imp-editor-tooltip-content-builder-description">';
			html += '       <p>Press the Done button when you are done editing, or click the Close button in the upper-right corner.</p>';
			html += '   </div>';
			html += '   <div class="wcp-editor-control-button" id="imp-editor-done-editing-tooltip">Done</div>';
			html += '</div>';

			$('body').append(html);
		} else {
			$('#imp-editor-tooltip-content-builder-wrap').show();
		}

		setTimeout(function () {
			$('#imp-editor-tooltip-content-builder-wrap').addClass('imp-visible');
		}, 10);

		// Set width of the content root
		var tooltipWidth = this.selectedSpot.tooltip_style.width;
		var tooltipBackgroundRGB = hexToRgb(this.selectedSpot.tooltip_style.background_color);
		var tooltipBackground = 'rgba(' + tooltipBackgroundRGB.r + ', ' + tooltipBackgroundRGB.g + ', ' + tooltipBackgroundRGB.b + ', ' + this.selectedSpot.tooltip_style.background_opacity + ')';

		$('#imp-editor-tooltip-content-builder-tooltip-wrap').css({
			width: tooltipWidth,
			background: tooltipBackground
		});

		// initialize content builder
		$.squaresInitWithSettings($('#imp-editor-tooltip-content-builder'), this.selectedSpot.tooltip_content.squares_settings);
		$.squaresShowEditorWindow(20, 20);
	}
	Editor.prototype.processNewLayerImage = function (url, cb) {
		var img = new Image();
		img.src = url;

		loadImage(img, function () {
			// loading
		}, function () {
			// complete
			cb(true, img.naturalWidth, img.naturalHeight);
		}, function () {
			// error
			cb(false);
		});
	}
	Editor.prototype.getCompressedSettings = function () {
		var compressed = $.extend(true, {}, settings);
		var compressedSpots = [];

		for (var i = 0; i < compressed.spots.length; i++) {
			compressedSpots[i] = $.wcpCompress(compressed.spots[i], default_spot_settings);

			compressedSpots[i].x = Math.round(compressedSpots[i].x * 1000) / 1000;
			compressedSpots[i].y = Math.round(compressedSpots[i].y * 1000) / 1000;

			if (compressedSpots[i].width) {
				compressedSpots[i].width = Math.round(compressedSpots[i].width * 1000) / 1000;
			}
			if (compressedSpots[i].height) {
				compressedSpots[i].height = Math.round(compressedSpots[i].height * 1000) / 1000;
			}
		}

		compressed = $.wcpCompress(settings, default_settings);
		compressed.spots = compressedSpots;

		return compressed;
	}

	// Forms
	Editor.prototype.updateShapesForm = function () {
		// This function needs to be called only when a shape is created, selected or deselected

		var i = this.getIndexOfSpotWithId(settings.editor.selected_shape);
		var s = settings.spots[i];

		if (s) {
			// General
			$.wcpFormSetControlValue('Shape Settings', 'shape_title', s.title);
			$.wcpFormSetControlValue('Shape Settings', 'x', s.x);
			$.wcpFormSetControlValue('Shape Settings', 'y', s.y);
			$.wcpFormSetControlValue('Shape Settings', 'width', s.width);
			$.wcpFormSetControlValue('Shape Settings', 'height', s.height);
			$.wcpFormSetControlValue('Shape Settings', 'connected_to', s.connected_to);
			$.wcpFormSetControlValue('Shape Settings', 'use_connected_shape_tooltip', s.use_connected_shape_tooltip);
			$.wcpFormSetControlValue('Shape Settings', 'text', s.text);
			$.wcpFormSetControlValue('Shape Settings', 'static', s.static);

			// Text
			$.wcpFormSetControlValue('Shape Settings', 'text', s.text.text);
			$.wcpFormSetControlValue('Shape Settings', 'font_family', s.text.font_family);
			$.wcpFormSetControlValue('Shape Settings', 'font_size', s.text.font_size);
			$.wcpFormSetControlValue('Shape Settings', 'font_weight', s.text.font_weight);
			$.wcpFormSetControlValue('Shape Settings', 'text_color', s.text.text_color);
			$.wcpFormSetControlValue('Shape Settings', 'text_opacity', s.text.text_opacity);

			// Actions
			$.wcpFormSetControlValue('Shape Settings', 'click', s.actions.click);
			$.wcpFormSetControlValue('Shape Settings', 'link', s.actions.link);
			$.wcpFormSetControlValue('Shape Settings', 'script', s.actions.script);
			$.wcpFormSetControlValue('Shape Settings', 'open_link_in_new_window', s.actions.open_link_in_new_window);

			// Icon
			$.wcpFormSetControlValue('Shape Settings', 'use_icon', s.default_style.use_icon);
			$.wcpFormSetControlValue('Shape Settings', 'icon_type', s.default_style.icon_type);
			$.wcpFormSetControlValue('Shape Settings', 'icon_svg_path', s.default_style.icon_svg_path);
			$.wcpFormSetControlValue('Shape Settings', 'icon_svg_viewbox', s.default_style.icon_svg_viewbox);
			$.wcpFormSetControlValue('Shape Settings', 'icon_url', s.default_style.icon_url);
			$.wcpFormSetControlValue('Shape Settings', 'icon_is_pin', s.default_style.icon_is_pin);
			$.wcpFormSetControlValue('Shape Settings', 'icon_shadow', s.default_style.icon_shadow);

			// Default Style
			$.wcpFormSetControlValue('Shape Settings', 'opacity', s.default_style.opacity);
			$.wcpFormSetControlValue('Shape Settings', 'icon_fill', s.default_style.icon_fill);
			$.wcpFormSetControlValue('Shape Settings', 'border_radius', s.default_style.border_radius);
			$.wcpFormSetControlValue('Shape Settings', 'background_type', s.default_style.background_type);
			$.wcpFormSetControlValue('Shape Settings', 'background_image_url', s.default_style.background_image_url);
			$.wcpFormSetControlValue('Shape Settings', 'background_image_opacity', s.default_style.background_image_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'background_image_scale', s.default_style.background_image_scale);
			$.wcpFormSetControlValue('Shape Settings', 'background_image_offset_x', s.default_style.background_image_offset_x);
			$.wcpFormSetControlValue('Shape Settings', 'background_image_offset_y', s.default_style.background_image_offset_y);
			$.wcpFormSetControlValue('Shape Settings', 'background_color', s.default_style.background_color);
			$.wcpFormSetControlValue('Shape Settings', 'background_opacity', s.default_style.background_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'border_width', s.default_style.border_width);
			$.wcpFormSetControlValue('Shape Settings', 'border_style', s.default_style.border_style);
			$.wcpFormSetControlValue('Shape Settings', 'border_color', s.default_style.border_color);
			$.wcpFormSetControlValue('Shape Settings', 'border_opacity', s.default_style.border_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'stroke_color', s.default_style.stroke_color);
			$.wcpFormSetControlValue('Shape Settings', 'stroke_opacity', s.default_style.stroke_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'stroke_width', s.default_style.stroke_width);
			$.wcpFormSetControlValue('Shape Settings', 'stroke_dasharray', s.default_style.stroke_dasharray);
			$.wcpFormSetControlValue('Shape Settings', 'stroke_linecap', s.default_style.stroke_linecap);

			// Mouseover Style
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_opacity', s.mouseover_style.opacity);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_icon_fill', s.mouseover_style.icon_fill);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_border_radius', s.mouseover_style.border_radius);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_image_url', s.mouseover_style.background_image_url);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_image_opacity', s.mouseover_style.background_image_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_image_scale', s.mouseover_style.background_image_scale);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_image_offset_x', s.mouseover_style.background_image_offset_x);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_image_offset_y', s.mouseover_style.background_image_offset_y);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_color', s.mouseover_style.background_color);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_background_opacity', s.mouseover_style.background_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_border_width', s.mouseover_style.border_width);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_border_style', s.mouseover_style.border_style);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_border_color', s.mouseover_style.border_color);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_border_opacity', s.mouseover_style.border_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_stroke_color', s.mouseover_style.stroke_color);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_stroke_opacity', s.mouseover_style.stroke_opacity);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_stroke_width', s.mouseover_style.stroke_width);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_stroke_dasharray', s.mouseover_style.stroke_dasharray);
			$.wcpFormSetControlValue('Shape Settings', 'mouseover_stroke_linecap', s.mouseover_style.stroke_linecap);

			// Tooltip Style
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_border_radius', s.tooltip_style.border_radius, true);
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_padding', s.tooltip_style.padding, true);
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_background_color', s.tooltip_style.background_color, true);
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_background_opacity', s.tooltip_style.background_opacity, true);
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_position', s.tooltip_style.position, true);
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_width', s.tooltip_style.width, true);
			$.wcpFormSetControlValue('Tooltip Style', 'tooltip_auto_width', s.tooltip_style.auto_width, true);

			// Tooltip Content

			// Tooltip
			$.wcpFormSetControlValue('Shape Settings', 'enable_tooltip', s.tooltip.enable_tooltip);

			// Do a "redraw update" of the form only when the selection changes
			// To show/hide shape-specific controls
			if (i == this.shapesFormSpotIndex) return;
			this.shapesFormSpotIndex = i;

			var html = $.wcpFormGenerateHTMLForForm('Shape Settings');
			$.wcpEditorSetObjectSettingsContent(html);

			$.wcpFormUpdateForm('Shape Settings');

			// Hack - select control doesn't have an API to change the values
			var selectOptions = '<option value="">(Not Connected)</option>';
			for (var j = 0; j < settings.spots.length; j++) {
				if (settings.spots[j].id != settings.editor.selected_shape && settings.spots[j].connected_to == '') {
					selectOptions += '<option value="' + settings.spots[j].id + '">' + settings.spots[j].title + '</option>'
				}
			}

			$('#wcp-form-form-control-connected_to select').html(selectOptions);
			$('#wcp-form-form-control-connected_to select').val(s.connected_to);
		} else {
			this.shapesFormSpotIndex = -1;
			$.wcpEditorSetObjectSettingsContent('<div id="imp-editor-no-shape-selected-wrap"><span>No shape selected</span></div>');
		}
	}
	Editor.prototype.updateShapesFormState = function () {
		// Show/hide controls, depending on current settings of the selected shape
		var i = this.getIndexOfSpotWithId(settings.editor.selected_shape);
		var s = settings.spots[i];

		if (!s) return;

		// Enable tooltips
		if (isTrue(s.tooltip.enable_tooltip)) {
			$.wcpFormShowControl('Shape Settings', 'reset_tooltip_position');
			$.wcpFormShowControl('Shape Settings', 'reset_tooltip_size');
			$.wcpFormShowControl('Shape Settings', 'edit_tooltip_style');
			$.wcpFormShowControl('Shape Settings', 'edit_tooltip_position');
			$.wcpFormShowControl('Shape Settings', 'edit_tooltip_content');
		} else {
			$.wcpFormHideControl('Shape Settings', 'reset_tooltip_position');
			$.wcpFormHideControl('Shape Settings', 'reset_tooltip_size');
			$.wcpFormHideControl('Shape Settings', 'edit_tooltip_style');
			$.wcpFormHideControl('Shape Settings', 'edit_tooltip_position');
			$.wcpFormHideControl('Shape Settings', 'edit_tooltip_content');
		}

		// When shape selection changes, the entire form is redrawn and all controls are visible (from updateShapesForm())

		// HIDE CONTROLS DEPENDING ON THE TYPE OF SHAPE ====================
		if (s.type == 'spot') {
			// Hide the Text tab
			$.wcpFormHideControlsGroup('Shape Settings', 'text');

			// Hide polygon-specific controls
			$.wcpFormHideControl('Shape Settings', 'stroke_color');
			$.wcpFormHideControl('Shape Settings', 'stroke_opacity');
			$.wcpFormHideControl('Shape Settings', 'stroke_width');
			$.wcpFormHideControl('Shape Settings', 'stroke_dasharray');
			$.wcpFormHideControl('Shape Settings', 'stroke_linecap');

			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_color');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_opacity');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_width');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_dasharray');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_linecap');
		}
		if (s.type == 'rect') {
			// Hide the Text tab
			$.wcpFormHideControlsGroup('Shape Settings', 'text');

			// Hide the Icon tab
			$.wcpFormHideControlsGroup('Shape Settings', 'icon');

			// Hide icon specific controls
			$.wcpFormHideControl('Shape Settings', 'icon_fill');
			$.wcpFormHideControl('Shape Settings', 'mouseover_icon_fill');

			// Hide polygon-specific controls
			$.wcpFormHideControl('Shape Settings', 'stroke_color');
			$.wcpFormHideControl('Shape Settings', 'stroke_opacity');
			$.wcpFormHideControl('Shape Settings', 'stroke_width');
			$.wcpFormHideControl('Shape Settings', 'stroke_dasharray');
			$.wcpFormHideControl('Shape Settings', 'stroke_linecap');

			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_color');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_opacity');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_width');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_dasharray');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_linecap');
		}
		if (s.type == 'oval') {
			// Hide the Text tab
			$.wcpFormHideControlsGroup('Shape Settings', 'text');

			// Hide the Icon tab
			$.wcpFormHideControlsGroup('Shape Settings', 'icon');

			// Hide icon specific controls
			$.wcpFormHideControl('Shape Settings', 'icon_fill');
			$.wcpFormHideControl('Shape Settings', 'mouseover_icon_fill');

			// Hide rectangle specific controls
			$.wcpFormHideControl('Shape Settings', 'border_radius');
			$.wcpFormHideControl('Shape Settings', 'mouseover_border_radius');

			// Hide polygon-specific controls
			$.wcpFormHideControl('Shape Settings', 'stroke_color');
			$.wcpFormHideControl('Shape Settings', 'stroke_opacity');
			$.wcpFormHideControl('Shape Settings', 'stroke_width');
			$.wcpFormHideControl('Shape Settings', 'stroke_dasharray');
			$.wcpFormHideControl('Shape Settings', 'stroke_linecap');

			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_color');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_opacity');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_width');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_dasharray');
			$.wcpFormHideControl('Shape Settings', 'mouseover_stroke_linecap');
		}
		if (s.type == 'poly' || s.type == 'path') {
			// Hide the Text tab
			$.wcpFormHideControlsGroup('Shape Settings', 'text');

			// Hide the Icon tab
			$.wcpFormHideControlsGroup('Shape Settings', 'icon');

			// Hide icon specific controls
			$.wcpFormHideControl('Shape Settings', 'icon_fill');
			$.wcpFormHideControl('Shape Settings', 'mouseover_icon_fill');

			// Hide non-poly-specific controls
			$.wcpFormHideControl('Shape Settings', 'opacity');
			$.wcpFormHideControl('Shape Settings', 'border_radius');
			$.wcpFormHideControl('Shape Settings', 'border_width');
			$.wcpFormHideControl('Shape Settings', 'border_style');
			$.wcpFormHideControl('Shape Settings', 'border_color');
			$.wcpFormHideControl('Shape Settings', 'border_opacity');

			$.wcpFormHideControl('Shape Settings', 'mouseover_opacity');
			$.wcpFormHideControl('Shape Settings', 'mouseover_border_radius');
			$.wcpFormHideControl('Shape Settings', 'mouseover_border_width');
			$.wcpFormHideControl('Shape Settings', 'mouseover_border_style');
			$.wcpFormHideControl('Shape Settings', 'mouseover_border_color');
			$.wcpFormHideControl('Shape Settings', 'mouseover_border_opacity');
		}
		if (s.type == 'text') {
			$.wcpFormHideControl('Shape Settings', 'width');
			$.wcpFormHideControl('Shape Settings', 'height');
			$.wcpFormHideControl('Shape Settings', 'connected_to');

			$.wcpFormHideControlsGroup('Shape Settings', 'actions');
			$.wcpFormHideControlsGroup('Shape Settings', 'icon');
			$.wcpFormHideControlsGroup('Shape Settings', 'default_style');
			$.wcpFormHideControlsGroup('Shape Settings', 'mouseover_style');
			$.wcpFormHideControlsGroup('Shape Settings', 'tooltip');

			// Show text specific controls
			$.wcpFormShowControlsGroup('Shape Settings', 'text');
		}

		// SHOW/HIDE CONTROLS DEPENDING ON THE FORM VALUES ======================

		// Background type
		if (s.default_style.background_type == 'color') {
			$.wcpFormHideControl('Shape Settings', 'background_image_url');
			$.wcpFormHideControl('Shape Settings', 'background_image_opacity');
			$.wcpFormHideControl('Shape Settings', 'background_image_scale');
			$.wcpFormHideControl('Shape Settings', 'background_image_offset_x');
			$.wcpFormHideControl('Shape Settings', 'background_image_offset_y');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_image_url');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_image_opacity');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_image_scale');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_image_offset_x');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_image_offset_y');

			$.wcpFormShowControl('Shape Settings', 'background_color');
			$.wcpFormShowControl('Shape Settings', 'background_opacity');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_color');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_opacity');
		} else {
			$.wcpFormShowControl('Shape Settings', 'background_image_url');
			$.wcpFormShowControl('Shape Settings', 'background_image_opacity');
			$.wcpFormShowControl('Shape Settings', 'background_image_scale');
			$.wcpFormShowControl('Shape Settings', 'background_image_offset_x');
			$.wcpFormShowControl('Shape Settings', 'background_image_offset_y');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_image_url');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_image_opacity');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_image_scale');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_image_offset_x');
			$.wcpFormShowControl('Shape Settings', 'mouseover_background_image_offset_y');

			$.wcpFormHideControl('Shape Settings', 'background_color');
			$.wcpFormHideControl('Shape Settings', 'background_opacity');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_color');
			$.wcpFormHideControl('Shape Settings', 'mouseover_background_opacity');
		}

		// Spot - use icon
		if (s.type == 'spot') {
			if (!isTrue(s.default_style.use_icon)) {
				$.wcpFormHideControl('Shape Settings', 'choose_icon_from_library');
				$.wcpFormHideControl('Shape Settings', 'icon_type');
				$.wcpFormHideControl('Shape Settings', 'icon_url');
				$.wcpFormHideControl('Shape Settings', 'icon_is_pin');
				$.wcpFormHideControl('Shape Settings', 'icon_shadow');

				// Default style tab
				$.wcpFormHideControl('Shape Settings', 'icon_fill');

				$.wcpFormShowControl('Shape Settings', 'border_radius');
				$.wcpFormShowControl('Shape Settings', 'background_type');
				$.wcpFormShowControl('Shape Settings', 'background_color');
				$.wcpFormShowControl('Shape Settings', 'background_opacity');
				$.wcpFormShowControl('Shape Settings', 'border_width');
				$.wcpFormShowControl('Shape Settings', 'border_style');
				$.wcpFormShowControl('Shape Settings', 'border_color');
				$.wcpFormShowControl('Shape Settings', 'border_opacity');

				// Mouseover style tab
				$.wcpFormHideControl('Shape Settings', 'mouseover_icon_fill');

				$.wcpFormShowControl('Shape Settings', 'mouseover_border_radius');
				$.wcpFormShowControl('Shape Settings', 'mouseover_background_color');
				$.wcpFormShowControl('Shape Settings', 'mouseover_background_opacity');
				$.wcpFormShowControl('Shape Settings', 'mouseover_border_width');
				$.wcpFormShowControl('Shape Settings', 'mouseover_border_style');
				$.wcpFormShowControl('Shape Settings', 'mouseover_border_color');
				$.wcpFormShowControl('Shape Settings', 'mouseover_border_opacity');
			} else {
				$.wcpFormShowControl('Shape Settings', 'choose_icon_from_library');
				$.wcpFormShowControl('Shape Settings', 'icon_type');
				$.wcpFormShowControl('Shape Settings', 'icon_url');
				$.wcpFormShowControl('Shape Settings', 'icon_is_pin');
				$.wcpFormShowControl('Shape Settings', 'icon_shadow');

				// Default style tab
				$.wcpFormShowControl('Shape Settings', 'icon_fill');

				$.wcpFormHideControl('Shape Settings', 'border_radius');
				$.wcpFormHideControl('Shape Settings', 'background_type');
				$.wcpFormHideControl('Shape Settings', 'background_color');
				$.wcpFormHideControl('Shape Settings', 'background_opacity');
				$.wcpFormHideControl('Shape Settings', 'border_width');
				$.wcpFormHideControl('Shape Settings', 'border_style');
				$.wcpFormHideControl('Shape Settings', 'border_color');
				$.wcpFormHideControl('Shape Settings', 'border_opacity');

				// Mouseover style tab
				$.wcpFormShowControl('Shape Settings', 'mouseover_icon_fill');

				$.wcpFormHideControl('Shape Settings', 'mouseover_border_radius');
				$.wcpFormHideControl('Shape Settings', 'mouseover_background_color');
				$.wcpFormHideControl('Shape Settings', 'mouseover_background_opacity');
				$.wcpFormHideControl('Shape Settings', 'mouseover_border_width');
				$.wcpFormHideControl('Shape Settings', 'mouseover_border_style');
				$.wcpFormHideControl('Shape Settings', 'mouseover_border_color');
				$.wcpFormHideControl('Shape Settings', 'mouseover_border_opacity');
			}

			// Spot - icon type
			if (s.default_style.icon_type == 'library') {
				$.wcpFormHideControl('Shape Settings', 'icon_url');
			}

			if (s.default_style.icon_type == 'custom') {
				$.wcpFormHideControl('Shape Settings', 'choose_icon_from_library');
			}
		}

		// Link URL
		if (s.actions.click == 'follow-link') {
			$.wcpFormShowControl('Shape Settings', 'link');
			$.wcpFormShowControl('Shape Settings', 'open_link_in_new_window');
		} else {
			$.wcpFormHideControl('Shape Settings', 'link');
			$.wcpFormHideControl('Shape Settings', 'open_link_in_new_window');
		}

		// Run script
		if (s.actions.click == 'run-script') {
			$.wcpFormShowControl('Shape Settings', 'script');
		} else {
			$.wcpFormHideControl('Shape Settings', 'script');
		}

		// Connected shape tooltip
		if (s.connected_to != '') {
			$.wcpFormShowControl('Shape Settings', 'use_connected_shape_tooltip');
			if (isTrue(s.use_connected_shape_tooltip)) {
				$.wcpFormHideControlsGroup('Shape Settings', 'tooltip');
			} else {
				$.wcpFormShowControlsGroup('Shape Settings', 'tooltip');
			}
		} else {
			$.wcpFormHideControl('Shape Settings', 'use_connected_shape_tooltip');
		}
	}
	Editor.prototype.updateImageMapForm = function () {
		$.wcpFormSetControlValue('Image Map Settings', 'image_map_name', settings.general.name);
		$.wcpFormSetControlValue('Image Map Settings', 'image_map_shortcode', settings.general.shortcode);
		$.wcpFormSetControlValue('Image Map Settings', 'image_map_width', settings.general.width);
		$.wcpFormSetControlValue('Image Map Settings', 'image_map_height', settings.general.height);
		$.wcpFormSetControlValue('Image Map Settings', 'responsive', settings.general.responsive);
		$.wcpFormSetControlValue('Image Map Settings', 'preserve_quality', settings.general.preserve_quality);
		$.wcpFormSetControlValue('Image Map Settings', 'center_image_map', settings.general.center_image_map);

		$.wcpFormSetControlValue('Image Map Settings', 'image_url', settings.image.url);

		$.wcpFormSetControlValue('Image Map Settings', 'pageload_animation', settings.shapes.pageload_animation);
		$.wcpFormSetControlValue('Image Map Settings', 'glowing_shapes', settings.shapes.glowing_shapes);
		$.wcpFormSetControlValue('Image Map Settings', 'glowing_shapes_color', settings.shapes.glowing_shapes_color);
		$.wcpFormSetControlValue('Image Map Settings', 'glow_opacity', settings.shapes.glow_opacity);
		$.wcpFormSetControlValue('Image Map Settings', 'stop_glowing_on_mouseover', settings.shapes.stop_glowing_on_mouseover);

		$.wcpFormSetControlValue('Image Map Settings', 'enable_tooltips', settings.tooltips.enable_tooltips);
		$.wcpFormSetControlValue('Image Map Settings', 'show_tooltips', settings.tooltips.show_tooltips);
		$.wcpFormSetControlValue('Image Map Settings', 'show_title_on_mouseover', settings.tooltips.show_title_on_mouseover);
		$.wcpFormSetControlValue('Image Map Settings', 'sticky_tooltips', settings.tooltips.sticky_tooltips);
		$.wcpFormSetControlValue('Image Map Settings', 'constrain_tooltips', settings.tooltips.constrain_tooltips);
		$.wcpFormSetControlValue('Image Map Settings', 'tooltip_animation', settings.tooltips.tooltip_animation);
		$.wcpFormSetControlValue('Image Map Settings', 'fullscreen_tooltips', settings.tooltips.fullscreen_tooltips);

		$.wcpFormSetControlValue('Image Map Settings', 'enable_fullscreen_mode', settings.fullscreen.enable_fullscreen_mode);
		$.wcpFormSetControlValue('Image Map Settings', 'start_in_fullscreen_mode', settings.fullscreen.start_in_fullscreen_mode);
		$.wcpFormSetControlValue('Image Map Settings', 'fullscreen_background', settings.fullscreen.fullscreen_background);
		$.wcpFormSetControlValue('Image Map Settings', 'fullscreen_button_position', settings.fullscreen.fullscreen_button_position);
		$.wcpFormSetControlValue('Image Map Settings', 'fullscreen_button_type', settings.fullscreen.fullscreen_button_type);
		$.wcpFormSetControlValue('Image Map Settings', 'fullscreen_button_color', settings.fullscreen.fullscreen_button_color);
		$.wcpFormSetControlValue('Image Map Settings', 'fullscreen_button_text_color', settings.fullscreen.fullscreen_button_text_color);

		$.wcpFormSetControlValue('Image Map Settings', 'enable_zooming', settings.zooming.enable_zooming);
		$.wcpFormSetControlValue('Image Map Settings', 'max_zoom', settings.zooming.max_zoom);
		$.wcpFormSetControlValue('Image Map Settings', 'limit_max_zoom_to_image_size', settings.zooming.limit_max_zoom_to_image_size);
		$.wcpFormSetControlValue('Image Map Settings', 'enable_navigator', settings.zooming.enable_navigator);
		$.wcpFormSetControlValue('Image Map Settings', 'enable_zoom_buttons', settings.zooming.enable_zoom_buttons);
		$.wcpFormSetControlValue('Image Map Settings', 'zoom_button_text_color', settings.zooming.zoom_button_text_color);
		$.wcpFormSetControlValue('Image Map Settings', 'zoom_button_background_color', settings.zooming.zoom_button_background_color);
		$.wcpFormSetControlValue('Image Map Settings', 'hold_ctrl_to_zoom', settings.zooming.hold_ctrl_to_zoom);
		$.wcpFormSetControlValue('Image Map Settings', 'focus_shape_on_click', settings.zooming.focus_shape_on_click);

		$.wcpFormSetControlValue('Image Map Settings', 'custom_css', settings.custom_code.custom_css);
		$.wcpFormSetControlValue('Image Map Settings', 'custom_js', settings.custom_code.custom_js);

		$.wcpFormSetControlValue('Image Map Settings', 'enable_layers', settings.layers.enable_layers);
		$.wcpFormSetControlValue('Image Map Settings', 'layers_list', settings.layers.layers_list);

		var detached_menu_info = '<div data-imp-detached-menu="' + settings.id + '"></div>';

		$.wcpFormSetControlValue('Image Map Settings', 'enable_shapes_menu', settings.shapes_menu.enable_shapes_menu);
		$.wcpFormSetControlValue('Image Map Settings', 'detached_menu', settings.shapes_menu.detached_menu);
		$.wcpFormSetControlValue('Image Map Settings', 'detached_menu_info', detached_menu_info);
		$.wcpFormSetControlValue('Image Map Settings', 'menu_position', settings.shapes_menu.menu_position);
		$.wcpFormSetControlValue('Image Map Settings', 'enable_search', settings.shapes_menu.enable_search);
		$.wcpFormSetControlValue('Image Map Settings', 'group_by_floor', settings.shapes_menu.group_by_floor);
		$.wcpFormSetControlValue('Image Map Settings', 'hide_children_of_connected_shapes', settings.shapes_menu.hide_children_of_connected_shapes);

		$.wcpFormUpdateForm('Image Map Settings');
	}
	Editor.prototype.updateImageMapFormState = function () {
		// Show/hide controls

		if (!isTrue(settings.general.responsive)) {
			$.wcpFormShowControl('Image Map Settings', 'image_map_width');
			$.wcpFormShowControl('Image Map Settings', 'image_map_height');
			$.wcpFormShowControl('Image Map Settings', 'reset_size');

			$.wcpFormHideControl('Image Map Settings', 'preserve_quality');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'image_map_width');
			$.wcpFormHideControl('Image Map Settings', 'image_map_height');
			$.wcpFormHideControl('Image Map Settings', 'reset_size');

			$.wcpFormShowControl('Image Map Settings', 'preserve_quality');
		}

		if (isTrue(settings.fullscreen.enable_fullscreen_mode)) {
			$.wcpFormShowControl('Image Map Settings', 'start_in_fullscreen_mode');
			$.wcpFormShowControl('Image Map Settings', 'fullscreen_background');
			$.wcpFormShowControl('Image Map Settings', 'fullscreen_button_position');
			$.wcpFormShowControl('Image Map Settings', 'fullscreen_button_type');
			$.wcpFormShowControl('Image Map Settings', 'fullscreen_button_color');
			$.wcpFormShowControl('Image Map Settings', 'fullscreen_button_text_color');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'start_in_fullscreen_mode');
			$.wcpFormHideControl('Image Map Settings', 'fullscreen_background');
			$.wcpFormHideControl('Image Map Settings', 'fullscreen_button_position');
			$.wcpFormHideControl('Image Map Settings', 'fullscreen_button_type');
			$.wcpFormHideControl('Image Map Settings', 'fullscreen_button_color');
			$.wcpFormHideControl('Image Map Settings', 'fullscreen_button_text_color');
		}

		if (isTrue(settings.tooltips.enable_tooltips)) {
			$.wcpFormShowControl('Image Map Settings', 'show_tooltips');
			$.wcpFormShowControl('Image Map Settings', 'sticky_tooltips');
			$.wcpFormShowControl('Image Map Settings', 'constrain_tooltips');
			$.wcpFormShowControl('Image Map Settings', 'tooltip_animation');
			$.wcpFormShowControl('Image Map Settings', 'fullscreen_tooltips');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'show_tooltips');
			$.wcpFormHideControl('Image Map Settings', 'sticky_tooltips');
			$.wcpFormHideControl('Image Map Settings', 'constrain_tooltips');
			$.wcpFormHideControl('Image Map Settings', 'tooltip_animation');
			$.wcpFormHideControl('Image Map Settings', 'fullscreen_tooltips');
		}

		if (settings.tooltips.show_tooltips == 'click') {
			$.wcpFormShowControl('Image Map Settings', 'show_title_on_mouseover');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'show_title_on_mouseover');
		}

		if (isTrue(settings.zooming.enable_zooming)) {
			$.wcpFormShowControl('Image Map Settings', 'max_zoom');
			$.wcpFormShowControl('Image Map Settings', 'limit_max_zoom_to_image_size');
			$.wcpFormShowControl('Image Map Settings', 'enable_zoom_buttons');
			$.wcpFormShowControl('Image Map Settings', 'enable_navigator');
			$.wcpFormShowControl('Image Map Settings', 'hold_ctrl_to_zoom');
			$.wcpFormShowControl('Image Map Settings', 'focus_shape_on_click');

			// $.wcpFormUpdateForm('Image Map Settings');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'max_zoom');
			$.wcpFormHideControl('Image Map Settings', 'limit_max_zoom_to_image_size');
			$.wcpFormHideControl('Image Map Settings', 'enable_zoom_buttons');
			$.wcpFormHideControl('Image Map Settings', 'enable_navigator');
			$.wcpFormHideControl('Image Map Settings', 'hold_ctrl_to_zoom');
			$.wcpFormHideControl('Image Map Settings', 'focus_shape_on_click');
		}

		if (isTrue(settings.zooming.enable_zoom_buttons) && isTrue(settings.zooming.enable_zooming)) {
			$.wcpFormShowControl('Image Map Settings', 'zoom_button_text_color');
			$.wcpFormShowControl('Image Map Settings', 'zoom_button_background_color');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'zoom_button_text_color');
			$.wcpFormHideControl('Image Map Settings', 'zoom_button_background_color');
		}

		if (isTrue(settings.layers.enable_layers)) {
			$.wcpFormShowControl('Image Map Settings', 'layers_list');
			$.wcpFormHideControlsGroup('Image Map Settings', 'image');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'layers_list');
			$.wcpFormShowControlsGroup('Image Map Settings', 'image');
		}

		if (isTrue(settings.shapes_menu.enable_shapes_menu)) {
			$.wcpFormShowControl('Image Map Settings', 'detached_menu');
			$.wcpFormShowControl('Image Map Settings', 'menu_position');
			$.wcpFormShowControl('Image Map Settings', 'enable_search');
			$.wcpFormShowControl('Image Map Settings', 'group_by_floor');
			$.wcpFormShowControl('Image Map Settings', 'hide_children_of_connected_shapes');

			if (isTrue(settings.shapes_menu.detached_menu)) {
				$.wcpFormShowControl('Image Map Settings', 'detached_menu_info');
				$.wcpFormHideControl('Image Map Settings', 'menu_position');
			} else {
				$.wcpFormHideControl('Image Map Settings', 'detached_menu_info');
				$.wcpFormShowControl('Image Map Settings', 'menu_position');
			}
		} else {
			$.wcpFormHideControl('Image Map Settings', 'detached_menu');
			$.wcpFormHideControl('Image Map Settings', 'menu_position');
			$.wcpFormHideControl('Image Map Settings', 'detached_menu_info');
			$.wcpFormHideControl('Image Map Settings', 'enable_search');
			$.wcpFormHideControl('Image Map Settings', 'group_by_floor');
			$.wcpFormHideControl('Image Map Settings', 'hide_children_of_connected_shapes');
		}

		if (isTrue(settings.shapes.glowing_shapes)) {
			$.wcpFormShowControl('Image Map Settings', 'glowing_shapes_color');
			$.wcpFormShowControl('Image Map Settings', 'glow_opacity');
		} else {
			$.wcpFormHideControl('Image Map Settings', 'glowing_shapes_color');
			$.wcpFormHideControl('Image Map Settings', 'glow_opacity');
		}
	}
	Editor.prototype.updateNewImageMapFormState = function () {
		var model = $.wcpFormGetModel('New Image Map');

		// Show/hide controls
		if (model.template == 'blank') {
			$.wcpFormHideControl('New Image Map', 'country');
		} else {
			$.wcpFormShowControl('New Image Map', 'country');
		}
	}

	// Utility
	Editor.prototype.parseSVG = function (svg, resizeCanvas) {
		// Parse XML
		var parsedXML = $.parseXML(svg);

		// Set canvas size
		if (resizeCanvas) {
			var svgWidth = 0, svgHeight = 0
			if (!isNaN(parseInt($(parsedXML).find('svg').attr('height'), 10)) && !isNaN(parseInt($(parsedXML).find('svg').attr('width'), 10))) {
				svgWidth = parseInt($(parsedXML).find('svg').attr('width'), 10)
				svgHeight = parseInt($(parsedXML).find('svg').attr('height'), 10)
			} else if ($(parsedXML).find('svg').attr('viewBox')) {
				var split = $(parsedXML).find('svg').attr('viewBox').split(' ')
				svgWidth = parseInt(split[2], 10)
				svgHeight = parseInt(split[3], 10)
			}

			if (svgWidth > 0 && svgHeight > 0) {
				settings.general.width = svgWidth
				settings.general.height = svgHeight
				settings.general.naturalWidth = svgWidth
				settings.general.naturalHeight = svgHeight

				// To update canvas size
				this.redraw()
			}
		}

		this.parseNode(parsedXML.children[0], 0, 0)

		// var children = $(parsedXML).find('g, rect, polygon, ellipse, circle, path');
		// for (var i=0; i<children.length; i++) {
		// 	var node = children[i]
		// 	this.parseNode(node, 0, 0)
		// }

		return

		// Set dimentions of the image map
		settings.general.width = parseInt($(parsedXML).find('svg').attr('width'), 10);
		settings.general.height = parseInt($(parsedXML).find('svg').attr('height'), 10);
		settings.general.naturalWidth = parseInt($(parsedXML).find('svg').attr('width'), 10);
		settings.general.naturalHeight = parseInt($(parsedXML).find('svg').attr('height'), 10);

		// Iterate over all groups
		var groups = $(parsedXML).find('g');
		for (var i = 0; i < groups.length; i++) {
			var g = $(groups[i]);

			// Does group contain sub groups?
			if (g.find('g').length == 0) {
				// No sub groups
				// Iterate over children, create shapes AND CONNECT THEM

				// Get children
				var children = g.find('rect, polygon, ellipse, circle, path');

				// Get the offset of the group
				var groupTransformX = 0, groupTransformY = 0;
				if (g.attr('transform')) {
					var groupTransformX = parseFloat(g.attr('transform').match(/\d+\.+\d+/g)[0]);
					var groupTransformY = parseFloat(g.attr('transform').match(/\d+\.+\d+/g)[1]);
				}

				// Is this top level group?
				if (g.parent().is('svg')) {
					for (var j = 1; j < children.length; j++) {
						this.parseSVGShape($(children[j]), undefined, groupTransformX, groupTransformY);
					}
				} else {
					// Not top level group
					// Create the parent shape
					$(children[0]).attr('id', $(g).attr('id')); // Since Sketch doesn't export the ID of the shapes that belong in a group (weird), manually set the ID of each child to be equal to the ID of the group
					var parentID = this.parseSVGShape($(children[0]), undefined, groupTransformX, groupTransformY);

					// Iterate over THE REST of the children
					// parse them
					// and set their parent to the first parsed shape
					for (var j = 1; j < children.length; j++) {
						// Since Sketch doesn't export the ID of the shapes that belong in a group (weird)
						// Manually set the ID of each child to be equal to the ID of the group
						$(children[j]).attr('id', $(g).attr('id'));
						this.parseSVGShape($(children[j]), parentID, groupTransformX, groupTransformY);
					}
				}
			} else {
				// Contains sub groups
				// Iterate over children and create shapes
				var children = g.children('rect, polygon, ellipse, circle, path');

				for (var j = 0; j < children.length; j++) {
					var c = children[j];
					this.parseSVGShape($(c));
				}
			}
		}
	}
	Editor.prototype.parseNode = function (node, offsetX, offsetY) {
		// Check type
		var nodeType = $(node).prop('nodeName');

		if (!nodeType) return

		// Transform
		if ($(node).attr('transform')) {
			var coords = $(node).attr('transform').match(/\d+\.\d+/g)
			offsetX += parseInt(coords[0], 10)
			offsetY += parseInt(coords[1], 10)
		}

		// Parse shape
		if (nodeType == 'rect' || nodeType == 'polygon' || nodeType == 'ellipse' || nodeType == 'circle' || nodeType == 'path') {
			this.parseSVGShape($(node), offsetX, offsetY)
		}

		// Children
		if (node.children.length > 0) {
			for (var i = 0; i < node.children.length; i++) {
				this.parseNode(node.children[i], offsetX, offsetY)
			}
		}
	}
	Editor.prototype.parseSVGShape = function (el, offsetX, offsetY) {
		// Gets an svg element as a jQuery object and creates a shape
		// el: the jquery object
		// parentID: if this value is set, connect the shape to this parent
		// offsetX/offsetY: if these values are set, apply this offset to the x/y of the shape

		// Rebuild shape objects
		var createdShapeID = 0;

		if (el.is('polygon')) {
			var coords = el.attr('points').split(' ');
			var polyPoints = [];

			for (var j = 0; j < coords.length - 2; j++) {
				if (j % 2 == 0) {
					var x = parseFloat(coords[j]);
					var y = parseFloat(coords[j + 1]);
					polyPoints.push({ x: x, y: y });
				}
			}

			var poly = editor.createPoly(polyPoints);
			createdShapeID = poly.id;

			// If the element has an ID, set it as a title and content for the created shape
			if (el.attr('id')) {
				poly.title = el.attr('id');
				poly.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = el.attr('id');
			}
		}
		if (el.is('rect')) {
			var rect = editor.createRect();

			rect.x = (el.attr('x') / settings.general.naturalWidth) * 100;
			rect.y = (el.attr('y') / settings.general.naturalHeight) * 100;
			rect.width = (el.attr('width') / settings.general.naturalWidth) * 100;
			rect.height = (el.attr('height') / settings.general.naturalHeight) * 100;

			createdShapeID = rect.id;

			// If the element has an ID, set it as a title and content for the created shape
			if (el.attr('id')) {
				rect.title = el.attr('id');
				rect.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = el.attr('id');
			}
		}
		if (el.is('circle')) {
			var circle = editor.createOval();

			circle.x = ((el.attr('cx') - el.attr('r')) / settings.general.naturalWidth) * 100;
			circle.y = ((el.attr('cy') - el.attr('r')) / settings.general.naturalHeight) * 100;
			circle.width = ((el.attr('r') * 2) / settings.general.naturalWidth) * 100;
			circle.height = ((el.attr('r') * 2) / settings.general.naturalHeight) * 100;

			createdShapeID = circle.id;

			// If the element has an ID, set it as a title and content for the created shape
			if (el.attr('id')) {
				circle.title = el.attr('id');
				circle.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = el.attr('id');
			}
		}
		if (el.is('ellipse')) {
			var ellipse = editor.createOval();

			ellipse.x = ((el.attr('cx') - el.attr('rx')) / settings.general.naturalWidth) * 100;
			ellipse.y = ((el.attr('cy') - el.attr('ry')) / settings.general.naturalHeight) * 100;
			ellipse.width = ((el.attr('rx') * 2) / settings.general.naturalWidth) * 100;
			ellipse.height = ((el.attr('ry') * 2) / settings.general.naturalHeight) * 100;

			createdShapeID = ellipse.id;

			// If the element has an ID, set it as a title and content for the created shape
			if (el.attr('id')) {
				ellipse.title = el.attr('id');
				ellipse.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = el.attr('id');
			}
		}
		if (el.is('path')) {
			var path = editor.createPath(el.attr('d'), offsetX, offsetY);
			createdShapeID = path.id;

			// If the element has an ID, set it as a title and content for the created shape
			if (el.attr('id')) {
				path.title = el.attr('id');
				path.tooltip_content.squares_settings.containers[0].settings.elements[0].options.heading.text = el.attr('id');
			}
		}

		return createdShapeID;
	}

	function loadImage(image, cbLoading, cbComplete, cbError) {
		if (!image.complete || image.naturalWidth === undefined || image.naturalHeight === undefined) {
			cbLoading();
			$(image).on('load', function () {
				$(image).off('load');
				cbComplete();
			});
			$(image).on('error', function () {
				$(image).off('error');
				cbError();
			});
		} else {
			cbComplete();
		}
	}
	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : { r: 0, g: 0, b: 0 };
	}
	function screenToCanvasSpace(x, y, canvas) {
		return {
			x: Math.round((x - canvas.offset().left) * 1000) / 1000,
			y: Math.round((y - canvas.offset().top) * 1000) / 1000
		}
	}
	function relLocalToRelCanvasSpace(p, localSpace) {
		return {
			x: (localSpace.width) * (p.x / 100) + localSpace.x,
			y: (localSpace.height) * (p.y / 100) + localSpace.y
		}
	}
	function relCanvasToRelLocalSpace(p, localSpace) {
		return {
			x: ((p.x - localSpace.x) / (localSpace.width)) * 100,
			y: ((p.y - localSpace.y) / (localSpace.height)) * 100
		}
	}
	function limitToCanvas(x, y) {
		if (x < 0) x = 0;
		if (x > 100) x = 100;
		if (y < 0) y = 0;
		if (y > 100) y = 100;

		return {
			x: Math.round(x * 1000) / 1000,
			y: Math.round(y * 1000) / 1000
		}
	}
	function isPointInsidePolygon(point, vs) {
		// ray-casting algorithm based on
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

		var x = point.x, y = point.y;

		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			var xi = vs[i][0], yi = vs[i][1];
			var xj = vs[j][0], yj = vs[j][1];

			var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}

		return inside;
	}
	function isTrue(a) {
		if (parseInt(a, 10) == 1) return true;

		return false;
	}

	function Vector2(x, y) {
		this.x = x;
		this.y = y;
	}
	Vector2.prototype.add = function (other) {
		return new Vector2(this.x + other.x, this.y + other.y);
	};
	Vector2.prototype.subtract = function (other) {
		return new Vector2(this.x - other.x, this.y - other.y);
	};
	Vector2.prototype.scale = function (scalar) {
		return new Vector2(this.x * scalar, this.y * scalar);
	};
	Vector2.prototype.normalized = function () {
		var magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		return new Vector2(this.x / magnitude, this.y / magnitude);
	};
	Vector2.prototype.dot = function (other) {
		return this.x * other.x + this.y * other.y;
	};
	Vector2.prototype.closestPointOnLine = function (pt1, pt2) {
		function dist2(pt1, pt2) {
			return Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2);
		}

		var l2 = dist2(pt1, pt2);
		if (l2 == 0)
			return dist2(this, v);

		var t = ((this.x - pt1.x) * (pt2.x - pt1.x) + (this.y - pt1.y) * (pt2.y - pt1.y)) / l2;

		if (t < 0)
			return pt1;
		if (t > 1)
			return pt2;

		return new Vector2(pt1.x + t * (pt2.x - pt1.x), pt1.y + t * (pt2.y - pt1.y));
	}
	Vector2.prototype.vector2Args = function (x, y) {
		x = x || 0;
		y = y || 0;
		return [this.x + x, this.y + y];
	};


})(jQuery, window, document);
