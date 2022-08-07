; (function ($, window, document, undefined) {
    // Register Forms

    $.wcpFormCreateForm({
        name: 'Image Map Settings',
        controlGroups: [
            {
                groupName: 'general',
                groupTitle: 'General',
                groupIcon: 'fa fa-cog',
                controls: [
                    {
                        label_width: 91,
                        type: 'text',
                        name: 'image_map_name',
                        title: 'Image Map Name',
                        value: $.imageMapProDefaultSettings.general.name
                    },
                    {
                        label_width: 91,
                        type: 'switch',
                        name: 'responsive',
                        title: 'Responsive',
                        value: $.imageMapProDefaultSettings.general.responsive,
                    },
                    {
                        label_width: 91,
                        type: 'switch',
                        name: 'preserve_quality',
                        title: 'Preserve Quality',
                        value: $.imageMapProDefaultSettings.general.preserve_quality,
                        tooltip: {
                            text: 'Will not stretch the image beyond its original width/height. Works only if there is an image set in the Image tab.',
                            position: 'right'
                        }
                    },
                    {
                        label_width: 91,
                        width: 59,
                        type: 'int',
                        name: 'image_map_width',
                        title: 'Width',
                        value: $.imageMapProDefaultSettings.general.width,
                    },
                    {
                        // label_width: 91,
                        width: 41,
                        type: 'int',
                        name: 'image_map_height',
                        title: 'Height',
                        value: $.imageMapProDefaultSettings.general.height
                    },
                    {
                        type: 'button',
                        name: 'reset_size',
                        title: 'Reset Size',
                        options: { event_name: 'button-reset-size-clicked' },
                        value: undefined
                    },
                    {
                        label_width: 91,
                        type: 'switch',
                        name: 'center_image_map',
                        title: 'Center Image Map',
                        value: $.imageMapProDefaultSettings.general.center_image_map,
                    },
                ]
            },
            {
                groupName: 'image',
                groupTitle: 'Image',
                groupIcon: 'fa fa-photo',
                controls: [
                    {
                        type: 'text',
                        name: 'image_url',
                        title: 'Image URL',
                        value: $.imageMapProDefaultSettings.general.image_url
                    },
                ]
            },
            {
                groupName: 'shapes',
                groupTitle: 'Shapes',
                groupIcon: 'fa fa-map-marker',
                controls: [
                    {
                        label_width: 140,
                        type: 'select',
                        name: 'pageload_animation',
                        title: 'Page Load Animation',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'grow', title: 'Grow' },
                            { value: 'fade', title: 'Fade' },
                            { value: 'fall-down', title: 'Fall Down' },
                        ],
                        value: $.imageMapProDefaultSettings.shapes.pageload_animation
                    },
                    {
                        label_width: 140,
                        type: 'switch',
                        name: 'glowing_shapes',
                        title: 'Glowing Shapes',
                        tooltip: {
                            text: 'Not supported on Polygon shapes',
                            position: 'right'
                        },
                        value: $.imageMapProDefaultSettings.shapes.glowing_shapes
                    },
                    {
                        label_width: 140,
                        type: 'color',
                        name: 'glowing_shapes_color',
                        title: 'Glow Color',
                        value: $.imageMapProDefaultSettings.shapes.glowing_shapes_color
                    },
                    {
                        label_width: 140,
                        type: 'slider',
                        name: 'glow_opacity',
                        title: 'Glow Opacity',
                        options: { min: 0, max: 1, type: 'float' },
                        value: $.imageMapProDefaultSettings.shapes.glow_opacity
                    },
                    {
                        label_width: 140,
                        type: 'switch',
                        name: 'stop_glowing_on_mouseover',
                        title: 'Stop Glowing on Mouseover',
                        value: $.imageMapProDefaultSettings.shapes.stop_glowing_on_mouseover
                    },
                ]
            },
            {
                groupName: 'tooltips',
                groupTitle: 'Tooltips',
                groupIcon: 'fa fa-comment',
                controls: [
                    {
                        label_width: 126,
                        type: 'switch',
                        name: 'enable_tooltips',
                        title: 'Enable Tooltips',
                        value: $.imageMapProDefaultSettings.tooltips.enable_tooltips,
                    },
                    {
                        label_width: 126,
                        type: 'select',
                        name: 'show_tooltips',
                        title: 'Show Tooltips On:',
                        options: [
                            { value: 'mouseover', title: 'Mouseover' },
                            { value: 'click', title: 'Click' },
                        ],
                        value: $.imageMapProDefaultSettings.tooltips.show_tooltips,
                    },
                    {
                        label_width: 126,
                        type: 'switch',
                        name: 'show_title_on_mouseover',
                        title: 'Show Title on Mouseover',
                        value: $.imageMapProDefaultSettings.tooltips.show_title_on_mouseover,
                    },
                    {
                        label_width: 126,
                        type: 'switch',
                        name: 'sticky_tooltips',
                        title: 'Sticky Tooltips',
                        value: $.imageMapProDefaultSettings.tooltips.sticky_tooltips,
                    },
                    {
                        label_width: 126,
                        type: 'switch',
                        name: 'constrain_tooltips',
                        title: 'Constrain Tooltips',
                        value: $.imageMapProDefaultSettings.tooltips.constrain_tooltips,
                    },
                    {
                        label_width: 126,
                        type: 'select',
                        name: 'tooltip_animation',
                        title: 'Tooltip Animation',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'grow', title: 'Grow' },
                            { value: 'fade', title: 'Fade' },
                        ],
                        value: $.imageMapProDefaultSettings.tooltips.tooltip_animation
                    },
                    {
                        label_width: 126,
                        type: 'select',
                        name: 'fullscreen_tooltips',
                        title: 'Fullscreen Tooltips',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'mobile-only', title: 'Mobile Only' },
                            { value: 'always', title: 'Always' },
                        ],
                        value: $.imageMapProDefaultSettings.tooltips.fullscreen_tooltips
                    },
                ]
            },
            {
                groupName: 'fullscreen',
                groupTitle: 'Fullscreen',
                groupIcon: 'fa fa-arrows-alt',
                controls: [
                    {
                        label_width: 132,
                        type: 'switch',
                        name: 'enable_fullscreen_mode',
                        title: 'Enable Fullscreen Mode',
                        value: $.imageMapProDefaultSettings.fullscreen.enable_fullscreen_mode,
                    },
                    {
                        label_width: 132,
                        type: 'switch',
                        name: 'start_in_fullscreen_mode',
                        title: 'Start in Fullscreen Mode',
                        value: $.imageMapProDefaultSettings.fullscreen.start_in_fullscreen_mode,
                    },
                    {
                        label_width: 132,
                        type: 'color',
                        name: 'fullscreen_background',
                        title: 'Fullscreen Background',
                        value: $.imageMapProDefaultSettings.fullscreen.fullscreen_background,
                    },
                    {
                        label_width: 132,
                        type: 'fullscreen button position',
                        name: 'fullscreen_button_position',
                        title: 'Fullscreen Button Position',
                        value: 1 // 0 = top left, 1 = top center, 2 = top right, 3 = bottom right, 4 = bottom center, 5 = bottom left
                    },
                    {
                        label_width: 132,
                        type: 'button group',
                        name: 'fullscreen_button_type',
                        title: 'Button Type',
                        options: [
                            { value: 'icon', title: 'Icon' },
                            { value: 'text', title: 'Text' },
                            { value: 'icon_and_text', title: 'Icon + Text' }
                        ],
                        value: $.imageMapProDefaultSettings.fullscreen.fullscreen_button_type,
                    },
                    {
                        label_width: 132,
                        type: 'color',
                        name: 'fullscreen_button_color',
                        title: 'Button Color',
                        value: $.imageMapProDefaultSettings.fullscreen.fullscreen_button_color,
                    },
                    {
                        label_width: 132,
                        type: 'color',
                        name: 'fullscreen_button_text_color',
                        title: 'Button Icon/Text Color',
                        value: $.imageMapProDefaultSettings.fullscreen.fullscreen_button_text_color,
                    }
                ]
            },
            {
                groupName: 'zooming',
                groupTitle: 'Zooming',
                groupIcon: 'fa fa-search-plus',
                controls: [
                    {
                        label_width: 159,
                        type: 'switch',
                        name: 'enable_zooming',
                        title: 'Enable Zooming',
                        value: $.imageMapProDefaultSettings.zooming.enable_zooming,
                    },
                    {
                        label_width: 159,
                        type: 'slider',
                        name: 'max_zoom',
                        title: 'Max Zoom',
                        options: { min: 2, max: 16, type: 'int' },
                        value: $.imageMapProDefaultSettings.zooming.max_zoom
                    },
                    {
                        label_width: 159,
                        type: 'switch',
                        name: 'limit_max_zoom_to_image_size',
                        title: 'Limit Max Zoom to Image Size',
                        value: $.imageMapProDefaultSettings.zooming.limit_max_zoom_to_image_size,
                    },
                    {
                        label_width: 159,
                        type: 'switch',
                        name: 'enable_navigator',
                        title: 'Enable Navigator',
                        value: $.imageMapProDefaultSettings.zooming.enable_navigator,
                    },
                    {
                        label_width: 159,
                        type: 'switch',
                        name: 'enable_zoom_buttons',
                        title: 'Enable Zoom Buttons',
                        value: $.imageMapProDefaultSettings.zooming.enable_zoom_buttons,
                    },
                    {
                        label_width: 159,
                        type: 'color',
                        name: 'zoom_button_text_color',
                        title: 'Zoom Button Text Color',
                        value: $.imageMapProDefaultSettings.zooming.zoom_button_text_color,
                    },
                    {
                        label_width: 159,
                        type: 'color',
                        name: 'zoom_button_background_color',
                        title: 'Zoom Button Background Color',
                        value: $.imageMapProDefaultSettings.zooming.zoom_button_background_color,
                    },
                    {
                        label_width: 159,
                        type: 'switch',
                        name: 'hold_ctrl_to_zoom',
                        title: 'Hold CTRL to Zoom',
                        value: $.imageMapProDefaultSettings.zooming.hold_ctrl_to_zoom,
                    },
                    {
                        label_width: 159,
                        type: 'switch',
                        name: 'focus_shape_on_click',
                        title: 'Focus Shape on Click',
                        value: $.imageMapProDefaultSettings.zooming.focus_shape_on_click,
                    },
                ]
            },
            {
                groupName: 'layers',
                groupTitle: 'Floors',
                groupIcon: 'fa fa-files-o',
                controls: [
                    {
                        type: 'switch',
                        name: 'enable_layers',
                        title: 'Enable Floors',
                        value: $.imageMapProDefaultSettings.layers.enable_layers,
                    },
                    {
                        type: 'layers-list',
                        name: 'layers_list',
                        title: '',
                        value: $.imageMapProDefaultSettings.layers.layers_list
                    },
                ]
            },
            {
                groupName: 'shapes_menu',
                groupTitle: 'Shapes Menu',
                groupIcon: 'fa fa-th-list',
                controls: [
                    {
                        label_width: 177,
                        type: 'switch',
                        name: 'enable_shapes_menu',
                        title: 'Enable Shapes Menu',
                        value: $.imageMapProDefaultSettings.shapes_menu.enable_shapes_menu,
                    },
                    {
                        label_width: 177,
                        type: 'switch',
                        name: 'enable_search',
                        title: 'Search Box',
                        value: $.imageMapProDefaultSettings.shapes_menu.enable_search,
                    },
                    {
                        label_width: 177,
                        type: 'switch',
                        name: 'group_by_floor',
                        title: 'Group by Floor',
                        value: $.imageMapProDefaultSettings.shapes_menu.group_by_floor,
                    },
                    {
                        label_width: 177,
                        type: 'switch',
                        name: 'detached_menu',
                        title: 'Detached Menu',
                        value: $.imageMapProDefaultSettings.shapes_menu.detached_menu,
                    },
                    {
                        label_width: 177,
                        type: 'switch',
                        name: 'hide_children_of_connected_shapes',
                        title: 'Hide Children of Connected Shapes',
                        value: $.imageMapProDefaultSettings.shapes_menu.hide_children_of_connected_shapes,
                    },
                    {
                        label_width: 177,
                        type: 'textarea',
                        name: 'detached_menu_info',
                        title: 'To place the menu anywhere on your website, copy and paste this HTML code:',
                        value: ''
                    },
                    {
                        label_width: 177,
                        type: 'button group',
                        name: 'menu_position',
                        title: 'Menu Position',
                        options: [
                            { value: 'left', title: 'Left' },
                            { value: 'right', title: 'Right' },
                        ],
                        value: $.imageMapProDefaultSettings.shapes_menu.menu_position,
                    },
                ]
            }
        ]
    });
    $.wcpFormCreateForm({
        name: 'Shape Settings',
        controlGroups: [
            {
                groupName: 'general',
                groupTitle: 'General',
                groupIcon: 'fa fa-cog',
                controls: [
                    {
                        label_width: 57,
                        type: 'text',
                        name: 'shape_title',
                        title: 'Shape Title',
                        value: $.imageMapProDefaultSpotSettings.title
                    },
                    {
                        label_width: 57,
                        type: 'switch',
                        name: 'static',
                        title: 'Static',
                        value: $.imageMapProDefaultSpotSettings.static
                    },
                    {
                        label_width: 57,
                        width: 60,
                        type: 'float',
                        name: 'x',
                        title: 'X',
                        value: $.imageMapProDefaultSpotSettings.x
                    },
                    {
                        width: 40,
                        label_width: 8,
                        type: 'float',
                        name: 'y',
                        title: 'Y',
                        value: $.imageMapProDefaultSpotSettings.y
                    },
                    {
                        label_width: 57,
                        width: 60,
                        type: 'float',
                        name: 'width',
                        title: 'w',
                        value: $.imageMapProDefaultSpotSettings.width
                    },
                    {
                        width: 40,
                        label_width: 8,
                        type: 'float',
                        name: 'height',
                        title: 'h',
                        value: $.imageMapProDefaultSpotSettings.height
                    },
                    {
                        label_width: 57,
                        type: 'select',
                        name: 'connected_to',
                        title: 'Parent',
                        options: [
                            { value: '', title: '(Not Connected)' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.connected_to
                    },
                    {
                        type: 'switch',
                        name: 'use_connected_shape_tooltip',
                        title: 'Use Parent\'s Tooltip',
                        value: $.imageMapProDefaultSpotSettings.use_connected_shape_tooltip
                    },

                ]
            },
            {
                groupName: 'text',
                groupTitle: 'Text',
                groupIcon: 'fa fa-font',
                controls: [
                    {
                        label_width: 61,
                        type: 'textarea',
                        name: 'text',
                        title: 'Text',
                        value: $.imageMapProDefaultSpotSettings.text
                    },
                    {
                        label_width: 61,
                        type: 'text',
                        name: 'font_family',
                        title: 'Font Family',
                        value: $.imageMapProDefaultSpotSettings.text.font_family
                    },
                    {
                        label_width: 61,
                        type: 'slider',
                        name: 'font_size',
                        title: 'Font Size',
                        options: { min: 6, max: 100, type: 'int' },
                        value: $.imageMapProDefaultSpotSettings.text.font_size
                    },
                    {
                        width: 50,
                        label_width: 61,
                        type: 'int',
                        name: 'font_weight',
                        title: 'Font Weight',
                        value: $.imageMapProDefaultSpotSettings.text.font_weight
                    },
                    {
                        width: 50,
                        label_width: 27,
                        type: 'color',
                        name: 'text_color',
                        title: 'Color',
                        value: $.imageMapProDefaultSpotSettings.text.text_color
                    },
                    {
                        label_width: 61,
                        type: 'slider',
                        name: 'text_opacity',
                        title: 'Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.text.text_opacity
                    },
                ]
            },
            {
                groupName: 'actions',
                groupTitle: 'Actions',
                groupIcon: 'fa fa-bolt',
                controls: [
                    {
                        label_width: 65,
                        type: 'select',
                        name: 'click',
                        title: 'Click Action',
                        options: [
                            { value: 'no-action', title: 'No Action' },
                            { value: 'run-script', title: 'Run Script' },
                            { value: 'follow-link', title: 'Follow Link' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.actions.click
                    },
                    {
                        label_width: 65,
                        type: 'text',
                        name: 'link',
                        title: 'Link URL',
                        value: $.imageMapProDefaultSpotSettings.actions.link
                    },
                    {
                        label_width: 65,
                        type: 'textarea',
                        name: 'script',
                        title: 'Script to Run',
                        value: $.imageMapProDefaultSpotSettings.actions.script
                    },
                    {
                        label_width: 65,
                        type: 'switch',
                        name: 'open_link_in_new_window',
                        title: 'Open in New Window',
                        value: $.imageMapProDefaultSpotSettings.actions.open_link_in_new_window
                    },
                ]
            },
            {
                groupName: 'icon',
                groupTitle: 'Icon',
                groupIcon: 'fa fa-map-marker',
                controls: [
                    {
                        label_width: 59,
                        type: 'switch',
                        name: 'use_icon',
                        title: 'Use Icon',
                        value: $.imageMapProDefaultSpotSettings.default_style.use_icon
                    },
                    {
                        label_width: 59,
                        type: 'button group',
                        name: 'icon_type',
                        title: 'Icon Type',
                        options: [
                            { value: 'library', title: 'Library' },
                            { value: 'custom', title: 'Custom' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_type
                    },
                    {
                        type: 'button',
                        name: 'choose_icon_from_library',
                        title: 'Choose from Library',
                        options: { event_name: 'button-choose-icon-clicked' },
                        value: undefined
                    },
                    {
                        label_width: 59,
                        type: 'text',
                        name: 'icon_svg_path',
                        title: 'Icon SVG Path',
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_svg_path,
                        render: false
                    },
                    {
                        label_width: 59,
                        type: 'text',
                        name: 'icon_svg_viewbox',
                        title: 'Icon SVG Viewbox',
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_svg_viewbox,
                        render: false
                    },
                    {
                        label_width: 59,
                        type: 'text',
                        name: 'icon_url',
                        title: 'Icon URL',
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_url
                    },
                    {
                        label_width: 55,
                        width: 50,
                        type: 'switch',
                        name: 'icon_is_pin',
                        title: 'Icon is a Pin',
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_is_pin
                    },
                    {
                        label_width: 55,
                        width: 50,
                        type: 'switch',
                        name: 'icon_shadow',
                        title: 'Shadow',
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_shadow
                    },
                ]
            },
            {
                groupName: 'default_style',
                groupTitle: 'Default Style',
                groupIcon: 'fa fa-paint-brush',
                controls: [
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'opacity',
                        title: 'Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.default_style.opacity
                    },
                    {
                        label_width: 102,
                        type: 'button group',
                        name: 'background_type',
                        title: 'Background Type',
                        options: [
                            { value: 'color', title: 'Color' },
                            { value: 'image', title: 'Image' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.default_style.background_type
                    },
                    {
                        label_width: 102,
                        type: 'text',
                        name: 'background_image_url',
                        title: 'Image URL',
                        value: $.imageMapProDefaultSpotSettings.default_style.background_image_url
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'background_image_opacity',
                        title: 'Image Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.default_style.background_image_opacity
                    },
                    {
                        label_width: 102,
                        type: 'float',
                        name: 'background_image_scale',
                        title: 'Image Scale',
                        options: { min: 0, max: 2 },
                        value: $.imageMapProDefaultSpotSettings.default_style.background_image_scale
                    },
                    {
                        label_width: 102,
                        type: 'float',
                        name: 'background_image_offset_x',
                        title: 'Image Offset X',
                        // options: { min: -20, max: 20, type: "float" },
                        value: $.imageMapProDefaultSpotSettings.default_style.background_image_offset_x
                    },
                    {
                        label_width: 102,
                        type: 'float',
                        name: 'background_image_offset_y',
                        title: 'Image Offset Y',
                        // options: { min: -20, max: 20 },
                        value: $.imageMapProDefaultSpotSettings.default_style.background_image_offset_y
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'background_color',
                        title: 'Background Color',
                        value: $.imageMapProDefaultSpotSettings.default_style.background_color
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'background_opacity',
                        title: 'Background Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.default_style.background_opacity
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'icon_fill',
                        title: 'SVG Icon Fill Color',
                        value: $.imageMapProDefaultSpotSettings.default_style.icon_fill
                    },
                    {
                        label_width: 102,
                        type: 'int',
                        name: 'border_radius',
                        title: 'Border Radius',
                        value: $.imageMapProDefaultSpotSettings.default_style.border_radius
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'border_width',
                        title: 'Border Width',
                        options: { min: 0, max: 20, type: 'int' },
                        value: $.imageMapProDefaultSpotSettings.default_style.border_width
                    },
                    {
                        label_width: 102,
                        type: 'select',
                        name: 'border_style',
                        title: 'Border Style',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'hidden', title: 'Hidden' },
                            { value: 'solid', title: 'Solid' },
                            { value: 'dotted', title: 'Dotted' },
                            { value: 'dashed', title: 'Dashed' },
                            { value: 'double', title: 'Double' },
                            { value: 'groove', title: 'Groove' },
                            { value: 'inset', title: 'Inset' },
                            { value: 'outset', title: 'Outset' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.default_style.border_style
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'border_color',
                        title: 'Border Color',
                        value: $.imageMapProDefaultSpotSettings.default_style.border_color
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'border_opacity',
                        title: 'Border Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.default_style.border_opacity
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'stroke_color',
                        title: 'Stroke Color',
                        value: $.imageMapProDefaultSpotSettings.default_style.stroke_color
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'stroke_opacity',
                        title: 'Stroke Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.default_style.stroke_opacity
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'stroke_width',
                        title: 'Stroke Width',
                        options: { min: 0, max: 20, type: 'int' },
                        value: $.imageMapProDefaultSpotSettings.default_style.stroke_width
                    },
                    {
                        label_width: 102,
                        type: 'text',
                        name: 'stroke_dasharray',
                        title: 'Stroke Dasharray',
                        value: $.imageMapProDefaultSpotSettings.default_style.stroke_dasharray
                    },
                    {
                        label_width: 102,
                        type: 'select',
                        name: 'stroke_linecap',
                        title: 'Stroke Linecap',
                        options: [
                            { value: 'butt', title: 'Butt' },
                            { value: 'round', title: 'Round' },
                            { value: 'square', title: 'Square' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.default_style.stroke_linecap
                    },
                ]
            },
            {
                groupName: 'mouseover_style',
                groupTitle: 'Mouseover Style',
                groupIcon: 'fa fa-paint-brush',
                controls: [
                    {
                        label_width: 102,
                        type: 'button',
                        name: 'copy_from_default_styles',
                        title: 'Copy from Default Styles',
                        options: { event_name: 'button-copy-from-default-styles-clicked' },
                        value: undefined
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_opacity',
                        title: 'Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.opacity
                    },
                    {
                        label_width: 102,
                        type: 'text',
                        name: 'mouseover_background_image_url',
                        title: 'Image URL',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_image_url
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_background_image_opacity',
                        title: 'Image Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_image_opacity
                    },
                    {
                        label_width: 102,
                        type: 'float',
                        name: 'mouseover_background_image_scale',
                        title: 'Image Scale',
                        // options: { min: 0, max: 2 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_image_scale
                    },
                    {
                        label_width: 102,
                        type: 'float',
                        name: 'mouseover_background_image_offset_x',
                        title: 'Image Offset X',
                        // options: { min: -20, max: 20 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_image_offset_x
                    },
                    {
                        label_width: 102,
                        type: 'float',
                        name: 'mouseover_background_image_offset_y',
                        title: 'Image Offset Y',
                        // options: { min: -20, max: 20 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_image_offset_y
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'mouseover_background_color',
                        title: 'Background Color',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_color
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_background_opacity',
                        title: 'Background Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.background_opacity
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'mouseover_icon_fill',
                        title: 'SVG Icon Fill Color',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.icon_fill
                    },
                    {
                        label_width: 102,
                        type: 'int',
                        name: 'mouseover_border_radius',
                        title: 'Border Radius',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.border_radius
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_border_width',
                        title: 'Border Width',
                        options: { min: 0, max: 20, type: 'int' },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.border_width
                    },
                    {
                        label_width: 102,
                        type: 'select',
                        name: 'mouseover_border_style',
                        title: 'Border Style',
                        options: [
                            { value: 'none', title: 'None' },
                            { value: 'hidden', title: 'Hidden' },
                            { value: 'solid', title: 'Solid' },
                            { value: 'dotted', title: 'Dotted' },
                            { value: 'dashed', title: 'Dashed' },
                            { value: 'double', title: 'Double' },
                            { value: 'groove', title: 'Groove' },
                            { value: 'inset', title: 'Inset' },
                            { value: 'outset', title: 'Outset' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.border_style
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'mouseover_border_color',
                        title: 'Border Color',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.border_color
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_border_opacity',
                        title: 'Border Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.border_opacity
                    },
                    {
                        label_width: 102,
                        type: 'color',
                        name: 'mouseover_stroke_color',
                        title: 'Stroke Color',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.stroke_color
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_stroke_opacity',
                        title: 'Stroke Opacity',
                        options: { min: 0, max: 1 },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.stroke_opacity
                    },
                    {
                        label_width: 102,
                        type: 'slider',
                        name: 'mouseover_stroke_width',
                        title: 'Stroke Width',
                        options: { min: 0, max: 20, type: 'int' },
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.stroke_width
                    },
                    {
                        label_width: 102,
                        type: 'text',
                        name: 'mouseover_stroke_dasharray',
                        title: 'Stroke Dasharray',
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.stroke_dasharray
                    },
                    {
                        label_width: 102,
                        type: 'select',
                        name: 'mouseover_stroke_linecap',
                        title: 'Stroke Linecap',
                        options: [
                            { value: 'butt', title: 'Butt' },
                            { value: 'round', title: 'Round' },
                            { value: 'square', title: 'Square' },
                        ],
                        value: $.imageMapProDefaultSpotSettings.mouseover_style.stroke_linecap
                    },
                ]
            },
            {
                groupName: 'tooltip',
                groupTitle: 'Tooltip',
                groupIcon: 'fa fa-comment',
                controls: [
                    {
                        type: 'switch',
                        name: 'enable_tooltip',
                        title: 'Enable Tooltip',
                        value: $.imageMapProDefaultSpotSettings.tooltip_style.enable_tooltip,
                    },
                    {
                        width: 100,
                        type: 'button',
                        name: 'reset_tooltip_position',
                        title: 'Reset Position',
                        options: { event_name: 'button-reset-tooltip-position-clicked' },
                        value: undefined
                    },
                    {
                        width: 100,
                        type: 'button',
                        name: 'reset_tooltip_size',
                        title: 'Reset Size',
                        options: { event_name: 'button-reset-tooltip-size-clicked' },
                        value: undefined
                    },
                    {
                        width: 50,
                        type: 'button',
                        name: 'edit_tooltip_style',
                        title: 'Edit Style',
                        options: { event_name: 'button-edit-tooltip-style-clicked' },
                        value: undefined
                    },
                    {
                        width: 50,
                        type: 'button',
                        name: 'edit_tooltip_position',
                        title: 'Edit Position',
                        options: { event_name: 'button-edit-tooltip-position-clicked' },
                        value: undefined
                    },
                    {
                        width: 50,
                        type: 'button',
                        name: 'edit_tooltip_content',
                        title: 'Edit Content',
                        options: { event_name: 'button-edit-tooltip-content-clicked' },
                        value: undefined
                    },
                ]
            },
        ]
    });
    $.wcpFormCreateForm({
        name: 'Tooltip Style',
        controls: [
            {
                label_width: 71,
                width: 50,
                type: 'int',
                name: 'tooltip_border_radius',
                title: 'Border Radius',
                value: $.imageMapProDefaultSpotSettings.tooltip_style.border_radius
            },
            {
                width: 50,
                type: 'int',
                name: 'tooltip_padding',
                title: 'Padding',
                value: $.imageMapProDefaultSpotSettings.tooltip_style.padding
            },
            {
                label_width: 71,
                width: 50,
                type: 'color',
                name: 'tooltip_background_color',
                title: 'BG Color',
                value: $.imageMapProDefaultSpotSettings.tooltip_style.background_color
            },
            {
                width: 50,
                type: 'slider',
                name: 'tooltip_background_opacity',
                title: 'BG Opacity',
                options: { min: 0, max: 1 },
                value: $.imageMapProDefaultSpotSettings.tooltip_style.background_opacity
            },
            {
                label_width: 71,
                type: 'select',
                name: 'tooltip_position',
                title: 'Position',
                options: [
                    { value: 'top', title: 'Top' },
                    { value: 'bottom', title: 'Bottom' },
                    { value: 'left', title: 'Left' },
                    { value: 'right', title: 'Right' },
                ],
                value: $.imageMapProDefaultSpotSettings.tooltip_style.position
            },
            {
                label_width: 71,
                width: 50,
                type: 'int',
                name: 'tooltip_width',
                title: 'Width',
                value: $.imageMapProDefaultSpotSettings.tooltip_style.width
            },
            {
                label_width: 71,
                width: 50,
                type: 'switch',
                name: 'tooltip_auto_width',
                title: 'Auto Width',
                value: $.imageMapProDefaultSpotSettings.tooltip_style.auto_width
            },
        ]
    });
    $.wcpFormCreateForm({
        name: 'New Image Map',
        controls: [
            {
                label_width: 85,
                type: 'text',
                name: 'name',
                title: 'Name',
                value: 'Untitled'
            }, {
                label_width: 85,
                type: 'button group',
                name: 'template',
                title: 'Template',
                options: [
                    { value: 'blank', title: 'Blank' },
                    { value: 'countries', title: 'Country' }
                ],
                value: 'blank'
            }, {
                label_width: 85,
                type: 'select',
                name: 'country',
                title: 'Choose Country',
                options: $.imageMapProCountriesGetList(),
                value: 'united-states'
            }
        ]
    });
    $.wcpFormCreateForm({
        name: 'New/Edit Layer',
        controls: [
            {
                label_width: 85,
                type: 'text',
                name: 'name',
                title: 'Name',
                value: 'Untitled'
            },
            {
                label_width: 85,
                type: 'text',
                name: 'url',
                title: 'Image URL',
                value: ''
            },
        ]
    });

    // Register Tour
    $.wcpTourRegister({
        name: 'Image Map Pro Editor Tour',
        welcomeScreen: {
            title: 'Welcome!',
            text: 'This is a guided tour to get you started quickly with Image Map Pro.<br>Click the button below to begin!',
            startButtonTitle: 'Take the Tour',
            cancelButtonTitle: 'Or skip this guide',
        },
        steps: [
            {
                title: 'Drawing Shapes',
                text: 'Use the toolbar on the left to draw different kinds of shapes.<br>Choose between Spots/Icons, Ellipses, Rectangles or polygons.',
                tip: {
                    title: 'Toolbar',
                    subtitle: 'Watch Video',
                    media: {
                        type: 'video',
                        url_mp4: 'https://imagemappro.com/uploads/tour_videos/01_toolbar.mp4',
                        url_webm: 'https://imagemappro.com/uploads/tour_videos/01_toolbar.webm',
                        url_ogv: 'https://imagemappro.com/uploads/tour_videos/01_toolbar.ogv',
                    },
                    position: 'bottom-right',
                    highlightRect: true
                },
            },
            {
                title: 'Customize Your Shapes',
                text: 'Change how the shapes look by selecting a shape <br>and clicking “Shape” on the left, and then “Default Style” or “Mouseover Style”.',
                tip: {
                    title: 'Shape Styles',
                    subtitle: 'Watch Video',
                    media: {
                        type: 'video',
                        url_mp4: 'https://imagemappro.com/uploads/tour_videos/02_edit_shapes.mp4',
                        url_webm: 'https://imagemappro.com/uploads/tour_videos/02_edit_shapes.webm',
                        url_ogv: 'https://imagemappro.com/uploads/tour_videos/02_edit_shapes.ogv',
                    },
                    position: 'bottom-left',
                    arrowStyle: 'transform: scaleX(-1);',
                    highlightRect: true
                }
            },
            {
                title: 'Edit and Delete Shapes',
                text: 'From the list on the right you can do various things with your shapes, like <br>copy-pasting styles, reordering them, or deleting the shapes.',
                tip: {
                    title: 'Shapes List',
                    subtitle: 'Watch Video',
                    media: {
                        type: 'video',
                        url_mp4: 'https://imagemappro.com/uploads/tour_videos/03_shapes_list.mp4',
                        url_webm: 'https://imagemappro.com/uploads/tour_videos/03_shapes_list.webm',
                        url_ogv: 'https://imagemappro.com/uploads/tour_videos/03_shapes_list.ogv',
                    },
                    position: 'bottom-left',
                    highlightRect: true
                }
            },
            {
                title: 'Edit the Tooltips',
                text: 'Set custom position, change the style or edit the tooltips!<br>Simply select a shape to reveal its tooltip and click any of the buttons above it.<br>These buttons can also be accessed from the Shape Settings panel on the top-right.',
                tip: {
                    title: 'Edit Buttons',
                    subtitle: 'Watch Video',
                    media: {
                        type: 'video',
                        url_mp4: 'https://imagemappro.com/uploads/tour_videos/04_edit_tooltip.mp4',
                        url_webm: 'https://imagemappro.com/uploads/tour_videos/04_edit_tooltip.webm',
                        url_ogv: 'https://imagemappro.com/uploads/tour_videos/04_edit_tooltip.ogv',
                    },
                    position: 'bottom-left',
                    highlightRect: true
                }
            },
            {
                title: 'Image Map Settings',
                text: 'Zooming, multiple levels, shapes menu, fullscreen and more.<br>Customize the image map specifically for your needs!',
                tip: {
                    title: 'Image Map Settings',
                    subtitle: 'Watch Video',
                    media: {
                        type: 'video',
                        url_mp4: 'https://imagemappro.com/uploads/tour_videos/05_image_map_settings.mp4',
                        url_webm: 'https://imagemappro.com/uploads/tour_videos/05_image_map_settings.webm',
                        url_ogv: 'https://imagemappro.com/uploads/tour_videos/05_image_map_settings.ogv',
                    },
                    position: 'bottom-right',
                    highlightRect: true
                }
            },
            {
                title: 'Preview Mode',
                text: 'See how your image map will look like by entering Preview Mode. <br>You can continue to tweak settings and see the changes live!',
                tip: {
                    title: 'Preview Mode Button',
                    // subtitle: 'Watch Video',
                    // media: {
                    //     type: 'video',
                    //     url_mp4: 'https://webcraftplugins.com/uploads/image-map-pro/videos/07-preview-mode.mp4',
                    //     url_webm: 'https://webcraftplugins.com/uploads/image-map-pro/videos/07-preview-mode.mp4',
                    //     url_ogv: 'https://webcraftplugins.com/uploads/image-map-pro/videos/07-preview-mode.mp4',
                    // },
                    position: 'bottom-left',
                    highlightRect: true
                }
            },
            {
                title: 'Save and Load',
                text: 'This editor uses Local Storage to save your work. You can have <br>as many image maps as you want, and switch between them any time. No database needed!',
                tip: {
                    title: 'Save/Load Buttons',
                    // subtitle: 'Watch Video',
                    // media: {
                    //     type: 'video',
                    //     url_mp4: 'https://webcraftplugins.com/uploads/image-map-pro/videos/08-save-load.mp4',
                    //     url_webm: 'https://webcraftplugins.com/uploads/image-map-pro/videos/08-save-load.mp4',
                    //     url_ogv: 'https://webcraftplugins.com/uploads/image-map-pro/videos/08-save-load.mp4',
                    // },
                    position: 'bottom-right',
                    highlightRect: true
                }
            },
            {
                title: 'Import and Export',
                text: 'You can also import and export your data, <br>in case you need to switch devices, or save your work somewhere else.',
                tip: {
                    title: 'Import/Export Buttons',
                    // subtitle: 'Watch Video',
                    // media: {
                    //     type: 'video',
                    //     url_mp4: 'https://webcraftplugins.com/uploads/image-map-pro/videos/09-import-export.mp4',
                    //     url_webm: 'https://webcraftplugins.com/uploads/image-map-pro/videos/09-import-export.mp4',
                    //     url_ogv: 'https://webcraftplugins.com/uploads/image-map-pro/videos/09-import-export.mp4',
                    // },
                    position: 'bottom-left',
                    highlightRect: true
                }
            },
            {
                title: 'Easy Installation',
                text: 'When you are ready to add the image map to your site, simply click the <br>"Code" button and follow the instructions.',
                tip: {
                    title: 'Code Button',
                    // subtitle: 'Watch Video',
                    // media: {
                    //     type: 'video',
                    //     url_mp4: 'https://webcraftplugins.com/uploads/image-map-pro/videos/10-install.mp4',
                    //     url_webm: 'https://webcraftplugins.com/uploads/image-map-pro/videos/10-install.mp4',
                    //     url_ogv: 'https://webcraftplugins.com/uploads/image-map-pro/videos/10-install.mp4',
                    // },
                    position: 'bottom-left',
                    highlightRect: true
                }
            },
        ]
    });

    // Register "what's new" tour
    $.wcpTourSimpleRegister({
        name: 'Whats New 5.0',
        width: 600,
        height: 400,
        slides: [
            {
                html: '<div id="whats-new-tour-slide-1"><img src="https://imagemappro.com/uploads/whats-new/logo.png"><h1>Version 5</h1><h2>What\'s New</h2></div>',
            },
            {
                html: '<div id="whats-new-tour-slide-2"><h3>Brand New UI for the Editor</h3><p>Reimagined from scratch for ease of use for new and existing users.</p><img src="https://imagemappro.com/uploads/whats-new/editor.png"></div>'
            },
            {
                html: '<div id="whats-new-tour-slide-3"><div><h3>Custom Tooltip Position</h3><p>Tooltips can be repositioned precisely where you want them, by selecting a shape and clicking the “move” button above the tooltip.</p></div><img src="https://imagemappro.com/uploads/whats-new/tooltip.png"></div>'
            },
            {
                html: '<div id="whats-new-tour-slide-4"><img src="https://imagemappro.com/uploads/whats-new/menu.png"><div><h3>Shapes Menu</h3><p>You can now choose to have a menu containing all shapes on your image map. Search functionality and shape focus on click make the image map easier to navigate for the end user.</p><p>The menu can be placed next to the image map, or wherever you choose on your website. You can even build your own menu with the API.</p></div></div>'
            },
            {
                html: '<div id="whats-new-tour-slide-5"><div><h3>Image Backgrounds for Shapes</h3><p>Shapes can now have an image as a background, as well as another image for mouseover. This opens up a whole new category of use cases!</p></div><img src="https://imagemappro.com/uploads/whats-new/image-bg.png"></div>'
            },
            {
                html: '<div id="whats-new-tour-slide-6"><h3>The list goes on…</h3><div><ul><li>Option to show shape title on mouseover</li><li>Hold SHIFT to preserve shape ration when scaling</li><li>API events to focus a shape on mouseover or click</li></ul><ul><li>Focus on shape on mouse click</li><li>The content builder is now integrated in the editor</li><li>Glowing spots</li><li>Animate icons and shapes from top on page load</li></ul></div></div>'
            }
        ]
    });

    $.WCPEditorSettings = {
        extraMainButtons: [
            {
                name: 'code',
                icon: 'fa fa-code',
                title: 'Code'
            },
            {
                name: 'import',
                icon: 'fa fa-arrow-down',
                title: 'Import'
            },
            {
                name: 'export',
                icon: 'fa fa-arrow-up',
                title: 'Export'
            },
            {
                name: 'help',
                icon: 'fa fa-question-circle',
                title: 'Help'
            }
        ],
        toolbar: [
            [
                {
                    name: 'select',
                    tooltip: 'Select',
                    kind: 'tool',
                    icon: '<i class="fa fa-mouse-pointer" aria-hidden="true"></i>'
                },
                {
                    name: 'zoom-in',
                    tooltip: 'Zoom In (CTRL +)',
                    kind: 'tool',
                    icon: '<i class="fa fa-search-plus" aria-hidden="true"></i>'
                },
                {
                    name: 'zoom-out',
                    tooltip: 'Zoom Out (CTRL -)',
                    kind: 'tool',
                    icon: '<i class="fa fa-search-minus" aria-hidden="true"></i>'
                },
                {
                    name: 'drag',
                    tooltip: 'Drag Canvas (Hold Spacebar and Drag)',
                    kind: 'tool',
                    icon: '<i class="fa fa-hand-paper-o" aria-hidden="true"></i>'
                },
                {
                    name: 'reset',
                    tooltip: 'Reset Canvas Zoom &amp; Pan (CTRL + 0)',
                    kind: 'button',
                    icon: '1:1'
                }
            ],
            [
                {
                    name: 'spot',
                    tooltip: 'Icon',
                    kind: 'tool',
                    icon: '<i class="fa fa-map-marker" aria-hidden="true"></i>'
                },
                {
                    name: 'oval',
                    tooltip: 'Ellipse',
                    kind: 'tool',
                    icon: '<div style="width: 14px; height: 14px; border: 2px solid #333; border-radius: 50px;"></div>'
                },
                {
                    name: 'rect',
                    tooltip: 'Rectangle',
                    kind: 'tool',
                    icon: '<div style="width: 20px; height: 14px; border: 2px solid #333; border-radius: 5px;"></div>'
                },
                {
                    name: 'poly',
                    tooltip: 'Polygon',
                    kind: 'tool',
                    icon: '<svg width="24px" height="24px" viewport="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><polygon class="nofill" fill="none" style="stroke: #333; stroke-width: 2px;" points="20,20 18,4 7,7 4,20"></polygon><ellipse fill="#333" cx="20" cy="20" rx="3" ry="3"></ellipse><ellipse fill="#333" cx="18" cy="4" rx="3" ry="3"></ellipse><ellipse fill="#333" cx="7" cy="7" rx="3" ry="3"></ellipse><ellipse fill="#333" cx="4" cy="20" rx="3" ry="3"></ellipse></svg>'
                },
                {
                    name: 'text',
                    tooltip: 'Text',
                    kind: 'tool',
                    icon: '<i class="fa fa-font" aria-hidden="true"></i>'
                },
            ]
        ],
        objectListButtons: [
            {
                name: 'rename',
                icon: 'fa fa-pencil',
                tooltip: 'Rename'
            },
            {
                name: 'copy',
                icon: 'fa fa-files-o',
                tooltip: 'Copy Style'
            },
            {
                name: 'paste',
                icon: 'fa fa-clipboard',
                tooltip: 'Paste Style'
            },
            {
                name: 'duplicate',
                icon: 'fa fa-clone',
                tooltip: 'Duplicate'
            },
            {
                name: 'delete',
                icon: 'fa fa-trash-o',
                tooltip: 'Delete'
            },
        ]
    };

    // Init Editor
    $(document).ready(function () {
        $.image_map_pro_init_editor(undefined, $.WCPEditorSettings);
    });
})(jQuery, window, document);
