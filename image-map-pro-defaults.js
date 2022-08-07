(function ($, window, document, undefined) {

	$.imageMapProShapeDefaults = {
		id: 'spot-0',
		title: '',
		type: 'spot', // spot, rect, oval, poly, text
		x: -1,
		y: -1,
		width: 44,
		height: 44,
		x_image_background: -1,
		y_image_background: -1,
		width_image_background: 44,
		height_image_background: 44,
		connected_to: '',
		use_connected_shape_tooltip: 0,
		layerID: 0,
		static: 0,
		text: {
			text: 'Text',
			font_family: 'sans-serif',
			font_size: 16,
			font_weight: 400,
			text_color: '#000000',
			text_opacity: 1
		},
		actions: {
			click: 'no-action',
			link: '#',
			open_link_in_new_window: 1,
			script: ''
		},
		default_style: {
			opacity: 1,
			border_radius: 50,
			background_type: 'color', // color / image
			background_image_url: '',
			background_image_opacity: 1,
			background_image_scale: 1, // 0-2
			background_image_offset_x: 0,
			background_image_offset_y: 0,
			background_color: '#000000',
			background_opacity: 0.4,
			border_width: 0,
			border_style: 'solid',
			border_color: '#ffffff',
			border_opacity: 1,

			// poly-specific
			// fill: '#000000',
			// fill_opacity: 0.4,
			stroke_color: '#ffffff',
			stroke_opacity: 0.75,
			stroke_width: 0,
			stroke_dasharray: '0',
			stroke_linecap: 'round',

			// spot-specific
			use_icon: 1,
			icon_type: 'library', // or 'custom'
			/* deprecated */ icon_svg_path: 'M409.81,160.113C409.79,71.684,338.136,0,249.725,0C161.276,0,89.583,71.684,89.583,160.113     c0,76.325,119.274,280.238,151.955,334.638c1.72,2.882,4.826,4.641,8.178,4.641c3.351,0,6.468-1.759,8.168-4.631     C290.545,440.361,409.81,236.438,409.81,160.113z M249.716,283.999c-68.303,0-123.915-55.573-123.915-123.895     c0-68.313,55.592-123.895,123.915-123.895s123.876,55.582,123.876,123.895S318.029,283.999,249.716,283.999z',
			/* deprecated */ icon_svg_viewbox: '0 0 499.392 499.392',
			icon_fontawesome_id: 'map-marker',
			icon_fill: '#000000',
			icon_url: '',
			icon_is_pin: 1,
			icon_shadow: 0
		},
		mouseover_style: {
			opacity: 1,
			border_radius: 50,
			background_image_url: '',
			background_image_opacity: 1,
			background_image_scale: 1,
			background_image_offset_x: 0,
			background_image_offset_y: 0,
			background_color: '#ffffff',
			background_opacity: 0.4,
			border_width: 0,
			border_style: 'solid',
			border_color: '#ffffff',
			border_opacity: 1,

			// poly-specific
			// fill: '#ffffff',
			// fill_opacity: 0.4,
			stroke_color: '#ffffff',
			stroke_opacity: 0.75,
			stroke_width: 0,
			stroke_dasharray: '0',
			stroke_linecap: 'round',

			// spot-specific
			icon_fill: '#000000'
		},
		tooltip: {
			enable_tooltip: 1,
		},
		tooltip_style: {
			// enable_tooltip: 1,
			buffer: 40,
			border_radius: 10,
			padding: 15,
			background_color: '#222222',
			background_opacity: 1,
			position: 'top',
			width: 225,
			auto_width: 1,

			// 5.0
			offset_x: 0,
			offset_y: 0
		},
		tooltip_content: {
			// content_type: 'content-builder', // plain-text / content-builder
			// plain_text: 'Example Text',
			// plain_text_color: '#ffffff',
			squares_settings: {
				containers: [{
					id: "sq-container-403761",
					settings: {
						elements: [
							{
								"settings": {
									"name": "Heading",
									"iconClass": "fa fa-header"
								},
								"options": {
									"heading": {
										"text": "My Shape"
									}
								}
							}
						]
					}
				}]
			}
		},
		points: [],
		vs: [],
		svgPathCommands: [],
		d: '',
		dEditor: ''
	};

	$.imageMapProEditorDefaults = {
		id: 0,
		editor: {
			previewMode: 0,
			selected_shape: -1,
			transform_tooltip_mode: 0,
			tool: 'spot',
			zoom: 1,
			currentLayer: 0,
			state: {
				dragging: false
			},
			shapeCounter: {
				spots: 0,
				rects: 0,
				ovals: 0,
				polys: 0,
				texts: 0,
				paths: 0
			}
		},
		runtime: {
			is_fullscreen: 0,
			layerID: 0,
			menu_search_string: '',
			menu_scroll: 0
		},
		general: {
			name: '',
			shortcode: '',
			width: 800,
			height: 450,
			naturalWidth: 800,
			naturalHeight: 450,
			responsive: 1,
			preserve_quality: 1,
			center_image_map: 0
		},
		image: {
			// url: 'https://imagemappro.com/uploads/editor/default-image-blank.png',
			url: '',
		},
		fullscreen: {
			enable_fullscreen_mode: 0,
			start_in_fullscreen_mode: 0,
			fullscreen_background: '#000000',
			fullscreen_button_position: 1,
			fullscreen_button_type: 'icon_and_text',
			fullscreen_button_color: '#ffffff',
			fullscreen_button_text_color: '#222222'
		},
		shapes: {
			pageload_animation: 'none', // none, grow, fade, fall-down
			glowing_shapes: 0,
			glowing_shapes_color: '#ffffff',
			glow_opacity: 0.5,
			stop_glowing_on_mouseover: 1
		},
		tooltips: {
			enable_tooltips: 1,
			show_tooltips: 'mouseover', // mouseover/click
			show_title_on_mouseover: 0, // Appears only when show_tooltips is set to click
			sticky_tooltips: 0,
			constrain_tooltips: 1,
			tooltip_animation: 'none',
			fullscreen_tooltips: 'mobile-only', // none / mobile-only / always,
		},
		zooming: {
			enable_zooming: 0,
			max_zoom: 16,
			limit_max_zoom_to_image_size: 0,
			enable_zoom_buttons: 1,
			enable_navigator: 1,
			zoom_button_text_color: '#000000',
			zoom_button_background_color: '#ffffff',
			hold_ctrl_to_zoom: 1,
			focus_shape_on_click: 1
		},
		layers: {
			enable_layers: 0,
			layers_list: [],
			/* Example:
				[
					{
						id: 0,
						title: 'Main Layer',
						image_url: 'img/floor1.jpg',
						image_width: 800,
						image_height: 600
					}
				]
			*/
		},
		shapes_menu: {
			enable_shapes_menu: 0,
			detached_menu: 0,
			menu_position: 'left', // left/right
			enable_search: 1,
			group_by_floor: 0,
			hide_children_of_connected_shapes: 1
		},
		custom_code: {
			custom_css: '',
			custom_js: ''
		},
		spots: []
	};
})(jQuery, window, document);