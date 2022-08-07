;(function ( $, window, document, undefined ) {
    $.image_map_pro_editor_content = function() {
        var settings = $.image_map_pro_editor_current_settings();
        var html = '';

        if (settings.editor.tool == 'zoom-in') {
            html += '<div class="imp-editor-canvas-overlay" id="imp-editor-canvas-overlay-zoom-in"></div>';
        }
        if (settings.editor.tool == 'zoom-out') {
            html += '<div class="imp-editor-canvas-overlay" id="imp-editor-canvas-overlay-zoom-out"></div>';
        }
        if (settings.editor.tool == 'drag' || settings.editor.state.dragging) {
            html += '<div class="imp-editor-canvas-overlay" id="imp-editor-canvas-overlay-drag"></div>';
        }
        
        // If layers are turned on, display a select menu above the canvas
        if (isTrue(settings.layers.enable_layers)) {
            var layerImageURL = '', selected = '';

            // Build select menu
            html += '<select id="select-canvas-layer" data-editor-object-type="17">';
            for (var i=0; i<settings.layers.layers_list.length; i++) {
                
                if (settings.editor.currentLayer == settings.layers.layers_list[i].id) {
                    layerImageURL = settings.layers.layers_list[i].image_url;
                    selected = ' selected';
                } else {
                    selected = '';
                }

                html += '<option value="'+ settings.layers.layers_list[i].id +'" '+ selected +'>'+ settings.layers.layers_list[i].title +'</option>';
            }
            html += '</select>';

            // Add the image corresponding to the current layer
            html += '<img id="imp-editor-image" src="'+ layerImageURL +'">'
        } else {
            if (settings.image.url != '') {
                html += '<img id="imp-editor-image" src="'+ settings.image.url +'">'
            }
        }

        // ============== Shapes
        html += '<div id="imp-editor-shapes-container">';

        for (var i=0; i<settings.spots.length; i++) {
            var s = settings.spots[i];
            // s = settings.spots[16]

            // Does the spot belong to the current layer?
            if (isTrue(settings.layers.enable_layers) && parseInt(s.layerID, 10) != parseInt(settings.editor.currentLayer)) {
                continue
            }

            if (s.type == 'spot') {
                if (isTrue(s.default_style.use_icon)) {
                    var style = '';
                    style += 'left: ' + s.x + '%;';
                    style += 'top: ' + s.y + '%;';

                    style += 'width: ' + s.width + 'px;';
                    style += 'height: ' + s.height + 'px;';
                    style += 'margin-left: -' + (s.width/2) + 'px;';
                    style += 'margin-top: -' + (s.height/2) + 'px;';

                    if (s.default_style.icon_type == 'library') {
                        style += 'background-image: none;';
                    } else {
                        style += 'background-image: url('+ s.default_style.icon_url +');';
                        style += 'background-position: center;';
                        style += 'background-repeat: no-repeat;';
                    }

                    html += '<div class="imp-editor-shape imp-editor-spot" data-id="'+ s.id +'" data-editor-object-type="1" style="'+ style +'"><div class="imp-selection" style="border-radius: '+ s.default_style.border_radius +'px;"></div>';

                    // Icon inner part
                    var iconStyle = '';
                    if (isTrue(s.default_style.icon_is_pin)) {
                        iconStyle += 'top: -50%;';
                        iconStyle += 'position: absolute;';
                    }

                    if (s.default_style.icon_type == 'library') {
                        iconStyle += 'color: ' + s.default_style.icon_fill + ';';
                        iconStyle += 'line-height: ' + s.height + 'px;';
                        iconStyle += 'font-size: ' + s.height + 'px;';

                        html += '   <div class="imp-editor-spot-fontawesome-icon" style="'+ iconStyle +'">';
                        html += '       <i class="fa fa-'+ s.default_style.icon_fontawesome_id +'"></i>';
                        html += '   </div>';
                    }

                    if (s.default_style.icon_type == 'custom' && s.default_style.icon_url.length > 0) {
                        html += '   <img style="'+ iconStyle +'" src="'+ s.default_style.icon_url +'">';
                    }

                    // Icon shadow
                    if (isTrue(s.default_style.icon_shadow)) {
                        var shadowStyle = '';
                        shadowStyle += 'width: ' + s.width + 'px;';
                        shadowStyle += 'height: ' + s.height + 'px;';
                        if (!isTrue(s.default_style.icon_is_pin)) {
                            shadowStyle += 'top: '+ s.height/2 +'px;';
                        }
                        html += '<div style="'+ shadowStyle +'" class="imp-editor-shape-icon-shadow"></div>';
                    }

                    html += '</div>';
                } else {
                    var c_bg = hexToRgb(s.default_style.background_color);
                    var c_bo = hexToRgb(s.default_style.border_color);

                    var style = '';

                    style += 'left: ' + s.x + '%;';
                    style += 'top: ' + s.y + '%;';

                    style += 'width: ' + s.width + 'px;';
                    style += 'height: ' + s.height + 'px;';
                    style += 'margin-left: -' + (s.width/2) + 'px;';
                    style += 'margin-top: -' + (s.height/2) + 'px;';

                    style += 'background: rgba('+ c_bg.r +', '+ c_bg.g +', '+ c_bg.b +', '+ s.default_style.background_opacity +');';
                    // style += 'opacity: ' + s.default_style.opacity + ';';
                    style += 'border-color: rgba('+ c_bo.r +', '+ c_bo.g +', '+ c_bo.b +', '+ s.default_style.border_opacity +');';
                    style += 'border-width: ' + s.default_style.border_width + 'px;';
                    style += 'border-style: ' + s.default_style.border_style + ';';
                    style += 'border-radius: ' + s.default_style.border_radius + 'px;';

                    html += '<div class="imp-editor-shape imp-editor-spot" data-id="'+ s.id +'" data-editor-object-type="1" style="'+ style +'"><div class="imp-selection" style="border-radius: '+ s.default_style.border_radius +'px;"></div></div>';
                }
            }
            if (s.type == 'text') {
                var c = hexToRgb(s.text.text_color);
                var style = '';

                style += 'left: ' + s.x + '%;';
                style += 'top: ' + s.y + '%;';

                style += 'font-family: ' + s.text.font_family + ';';
                style += 'font-size: ' + (s.text.font_size * settings.editor.zoom) + 'px;';
                style += 'font-weight: ' + s.text.font_weight + ';';
                style += 'color: rgba('+ c.r +', '+ c.g +', '+ c.b +', '+ s.text.text_opacity +');';

                html += '<div class="imp-editor-shape imp-editor-text" data-id="'+ s.id +'" data-editor-object-type="8" style="'+ style +'">';
                html +=     s.text.text;;
                html += '   <div class="imp-selection" style="border-radius: '+ s.default_style.border_radius +'px;"></div>';
                html += '</div>';
            }
            if (s.type == 'rect') {
                var c_bg = hexToRgb(s.default_style.background_color);
                var c_bo = hexToRgb(s.default_style.border_color);

                var style = '';

                style += 'left: ' + s.x + '%;';
                style += 'top: ' + s.y + '%;';

                style += 'width: ' + s.width + '%;';
                style += 'height: ' + s.height + '%;';

                if (s.default_style.background_type == 'color') {
                    style += 'background: rgba('+ c_bg.r +', '+ c_bg.g +', '+ c_bg.b +', '+ s.default_style.background_opacity +');';
                }
                // style += 'opacity: ' + s.default_style.opacity + ';';
                style += 'border-color: rgba('+ c_bo.r +', '+ c_bo.g +', '+ c_bo.b +', '+ s.default_style.border_opacity +');';
                style += 'border-width: ' + s.default_style.border_width + 'px;';
                style += 'border-style: ' + s.default_style.border_style + ';';
                style += 'border-radius: ' + s.default_style.border_radius + 'px;';

                html += '<div class="imp-editor-shape imp-editor-rect" data-id="'+ s.id +'" data-editor-object-type="3" style="'+ style +'">';
                html += '   <div class="imp-selection" style="border-radius: '+ s.default_style.border_radius +'px;">';
                html += '       <div class="imp-selection-translate-boxes">';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-1" data-transform-direction="1" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-2" data-transform-direction="2" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-3" data-transform-direction="3" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-4" data-transform-direction="4" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-5" data-transform-direction="5" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-6" data-transform-direction="6" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-7" data-transform-direction="7" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-8" data-transform-direction="8" data-editor-object-type="5"></div>';
                html += '       </div>';
                html += '   </div>';
                html += '</div>';
            }
            if (s.type == 'oval') {
                var c_bg = hexToRgb(s.default_style.background_color);
                var c_bo = hexToRgb(s.default_style.border_color);

                var style = '';

                style += 'left: ' + s.x + '%;';
                style += 'top: ' + s.y + '%;';

                style += 'width: ' + s.width + '%;';
                style += 'height: ' + s.height + '%;';

                if (s.default_style.background_type == 'color') {
                    style += 'background: rgba('+ c_bg.r +', '+ c_bg.g +', '+ c_bg.b +', '+ s.default_style.background_opacity +');';
                }

                style += 'border-color: rgba('+ c_bo.r +', '+ c_bo.g +', '+ c_bo.b +', '+ s.default_style.border_opacity +');';
                style += 'border-width: ' + s.default_style.border_width + 'px;';
                style += 'border-style: ' + s.default_style.border_style + ';';
                style += 'border-radius: 100% 100%;';

                html += '<div class="imp-editor-shape imp-editor-oval" data-id="'+ s.id +'" data-editor-object-type="2" style="'+ style +'">';
                html += '   <div class="imp-selection" style="border-radius: 100% 100%;">';
                html += '       <div class="imp-selection-translate-boxes">';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-1" data-transform-direction="1" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-2" data-transform-direction="2" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-3" data-transform-direction="3" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-4" data-transform-direction="4" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-5" data-transform-direction="5" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-6" data-transform-direction="6" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-7" data-transform-direction="7" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-8" data-transform-direction="8" data-editor-object-type="5"></div>';
                html += '       </div>';
                html += '   </div>';
                html += '</div>';
            }
            if (s.type == 'poly' && s.points) {
                if (s.points.length < 3) {
                    continue;
                }

                var c_bg = hexToRgb(s.default_style.background_color);
                var c_stroke = hexToRgb(s.default_style.stroke_color);

                var style = '';
                style += 'left: ' + s.x + '%;';
                style += 'top: ' + s.y + '%;';
                style += 'width: ' + s.width + '%;';
                style += 'height: ' + s.height + '%;';
                // style += 'opacity: ' + s.default_style.opacity + ';';

                var svgStyle = '';
                svgStyle += 'width: 100%;';
                svgStyle += 'height: 100%;';

                if (s.default_style.background_type == 'color') {
                    svgStyle += 'fill: rgba('+ c_bg.r +', '+ c_bg.g +', '+ c_bg.b +', '+ s.default_style.background_opacity +');';
                } else {
                    svgStyle += 'fill: rgba(0, 0, 255, 0.25);';
                }

                svgStyle += 'stroke: rgba('+ c_stroke.r +', '+ c_stroke.g +', '+ c_stroke.b +', '+ s.default_style.stroke_opacity +');';
                svgStyle += 'stroke-width: ' + s.default_style.stroke_width + 'px;';
                svgStyle += 'stroke-dasharray: ' + s.default_style.stroke_dasharray + ';';
                svgStyle += 'stroke-linecap: ' + s.default_style.stroke_linecap + ';';

                html += '<div class="imp-editor-shape imp-editor-poly" data-id="'+ s.id +'" data-editor-object-type="4" style="'+ style +'">';
                html += '   <div class="imp-editor-poly-svg-temp-control-point" data-editor-object-type="6"></div>';

                var shapeWidthPx = settings.general.width * (s.width/100);
                var shapeHeightPx = settings.general.height * (s.height/100);
                html += '   <div class="imp-editor-svg-wrap" style="padding: '+ (s.default_style.stroke_width) +'px; left: -'+ (s.default_style.stroke_width) +'px; top: -'+ (s.default_style.stroke_width) +'px;">'
                html += '       <svg class="imp-editor-poly-svg" viewBox="0 0 '+ shapeWidthPx +' '+ shapeHeightPx +'" preserveAspectRatio="none" style="'+ svgStyle +'">';
                html += '           <polygon points="';

                for (var j=0; j<s.points.length; j++) {
                    var x = s.default_style.stroke_width + (s.points[j].x / 100) * (shapeWidthPx - s.default_style.stroke_width*2);
                    var y = s.default_style.stroke_width + (s.points[j].y / 100) * (shapeHeightPx - s.default_style.stroke_width*2);
                    html += x + ',' + y + ' ';
                }

                html += '           "></polygon>';
                html += '       </svg>';
                html += '   </div>'; // end svg wrap
                html += '       <svg class="imp-editor-shape-poly-svg-overlay" viewBox="0 0 '+ shapeWidthPx +' '+ shapeHeightPx +'" preserveAspectRatio="none">';
                html += '           <polygon points="';

                for (var j=0; j<s.points.length; j++) {
                    var x = (s.points[j].x / 100) * shapeWidthPx;
                    var y = (s.points[j].y / 100) * shapeHeightPx;
                    html += x + ',' + y + ' ';
                }

                html += '           "></polygon>';
                html += '       </svg>';
                html += '   <div class="imp-selection imp-expanded-selection">';
                html += '       <div class="imp-selection-translate-boxes">';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-1" data-transform-direction="1" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-2" data-transform-direction="2" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-3" data-transform-direction="3" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-4" data-transform-direction="4" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-5" data-transform-direction="5" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-6" data-transform-direction="6" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-7" data-transform-direction="7" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-8" data-transform-direction="8" data-editor-object-type="5"></div>';
                html += '       </div>';
                html += '   </div>';

                for (var j=0; j<s.points.length; j++) {
                    html += '       <div class="imp-poly-control-point" data-editor-object-type="7" data-index="'+ j +'" style="left: '+ s.points[j].x +'%; top: ' + s.points[j].y + '%;"></div>';
                }

                html += '</div>';
            }
            if (s.type == 'path') {
                // ====== Compute the path
                var dEditor = '';
                var pathDatas = $.pathParse(s.d).absNormalize()
                
                // Get minX, maxX...
                var minMax = $.getMinMaxValues(pathDatas)

                // Offset coords by minX and minY
                pathDatas = $.offsetPath(pathDatas, minMax.minX*-1, minMax.minY*-1)

                // Convert path back to string
                dEditor = $.serializePath(pathDatas)

                // ====== Continue with the rest of the shape settings
                var c_bg = hexToRgb(s.default_style.background_color);
                var c_stroke = hexToRgb(s.default_style.stroke_color);
                
                var style = '';
                style += 'left: ' + s.x + '%;';
                style += 'top: ' + s.y + '%;';
                style += 'width: ' + s.width + '%;';
                style += 'height: ' + s.height + '%;';

                var svgStyle = '';
                svgStyle += 'width: 100%;';
                svgStyle += 'height: 100%;';

                if (s.default_style.background_type == 'color') {
                    svgStyle += 'fill: rgba('+ c_bg.r +', '+ c_bg.g +', '+ c_bg.b +', '+ s.default_style.background_opacity +');';
                } else {
                    svgStyle += 'fill: rgba(0, 0, 255, 0.25);';
                }

                svgStyle += 'stroke: rgba('+ c_stroke.r +', '+ c_stroke.g +', '+ c_stroke.b +', '+ s.default_style.stroke_opacity +');';
                svgStyle += 'stroke-width: ' + s.default_style.stroke_width + 'px;';
                svgStyle += 'stroke-dasharray: ' + s.default_style.stroke_dasharray + ';';
                svgStyle += 'stroke-linecap: ' + s.default_style.stroke_linecap + ';';

                html += '<div class="imp-editor-shape imp-editor-path" data-id="'+ s.id +'" data-editor-object-type="16" style="'+ style +'">';
                // html += '   <div class="imp-editor-poly-svg-temp-control-point" data-editor-object-type="6"></div>';

                var shapeWidthPx = settings.general.width * (s.width/100);
                var shapeHeightPx = settings.general.height * (s.height/100);
                html += '   <div class="imp-editor-svg-wrap" style="padding: '+ (s.default_style.stroke_width) +'px; left: -'+ (s.default_style.stroke_width) +'px; top: -'+ (s.default_style.stroke_width) +'px;">'
                html += '       <svg class="imp-editor-path-svg" viewBox="0 0 '+ shapeWidthPx +' '+ shapeHeightPx +'" preserveAspectRatio="none" style="'+ svgStyle +'">';
                html += '           <path d="'+ dEditor +'"></path>';
                html += '       </svg>';
                html += '   </div>';
                html += '   <div class="imp-selection imp-expanded-selection">';
                html += '       <div class="imp-selection-translate-boxes">';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-1" data-transform-direction="1" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-2" data-transform-direction="2" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-3" data-transform-direction="3" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-4" data-transform-direction="4" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-5" data-transform-direction="5" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-6" data-transform-direction="6" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-7" data-transform-direction="7" data-editor-object-type="5"></div>';
                html += '           <div class="imp-selection-translate-box imp-selection-translate-box-8" data-transform-direction="8" data-editor-object-type="5"></div>';
                html += '       </div>';
                html += '   </div>';

                html += '</div>';
            }
        }

        // ============== Close shapes container
        html += '</div>';
        
        // ============== Image backgrounds
        html += '<div id="imp-editor-image-backgrounds-container">';

        for (var i=0; i<settings.spots.length; i++) {
            var s = settings.spots[i];

            // Does the spot belong to the current layer?
            if (isTrue(settings.layers.enable_layers) && parseInt(s.layerID, 10) != parseInt(settings.editor.currentLayer)) {
                continue
            }

            var style = '';
            style += 'left: ' + (s.x_image_background + s.default_style.background_image_offset_x) + '%;';
            style += 'top: ' + (s.y_image_background + s.default_style.background_image_offset_y) + '%;';
            style += 'width: ' + s.width_image_background + '%;';
            style += 'height: ' + s.height_image_background + '%;';

            if (s.default_style.background_type == 'image' && s.default_style.background_image_url) {
                style += 'background-image: url('+ s.default_style.background_image_url +');';
                style += 'opacity: '+ s.default_style.background_image_opacity +';';
                style += 'transform: scale('+ s.default_style.background_image_scale +');';
            }

            html += '<div class="imp-shape-background-image" style="'+ style +'" data-id="'+ s.id +'"></div>';
        }

        // ============== Close the image backgrounds container
        html += '</div>';

        // ============== Tooltip

        // Get selected spot
        var s = undefined;
        for (var i=0; i<settings.spots.length; i++) {
            if (settings.spots[i].id == settings.editor.selected_shape) {
                s = settings.spots[i];
                break;
            }
        }
        
        // If there is a selected spot
        if (s && s.type != 'text' && isTrue(s.tooltip.enable_tooltip) && isTrue(settings.tooltips.enable_tooltips) && !isTrue(s.use_connected_shape_tooltip)) {
            var tooltipStyle = '';

            var c_bg = hexToRgb(s.tooltip_style.background_color);
            var c_bo = hexToRgb(s.tooltip_style.border_color);

            // style
            tooltipStyle += 'background: rgba('+ c_bg.r +', '+ c_bg.g +', '+ c_bg.b +', '+ s.tooltip_style.background_opacity +');';
            tooltipStyle += 'padding: '+ s.tooltip_style.padding +'px;';
            tooltipStyle += 'border-radius: '+ s.tooltip_style.border_radius +'px;';

            if (!isTrue(s.tooltip_style.auto_width)) {
                tooltipStyle += 'width: '+ s.tooltip_style.width +'px;';
            }

            // arrow
            var tooltipArrow = '';
            if (s.tooltip_style.position == 'top') {
                tooltipArrow += '   <div class="hs-arrow hs-arrow-bottom" style="border-top-color: rgba(' + c_bg.r + ', ' + c_bg.g + ', ' + c_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>';
            }
            if (s.tooltip_style.position == 'bottom') {
                tooltipArrow += '   <div class="hs-arrow hs-arrow-top" style="border-bottom-color: rgba(' + c_bg.r + ', ' + c_bg.g + ', ' + c_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>';
            }
            if (s.tooltip_style.position == 'left') {
                tooltipArrow += '   <div class="hs-arrow hs-arrow-right" style="border-left-color: rgba(' + c_bg.r + ', ' + c_bg.g + ', ' + c_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>';
            }
            if (s.tooltip_style.position == 'right') {
                tooltipArrow += '   <div class="hs-arrow hs-arrow-left" style="border-right-color: rgba(' + c_bg.r + ', ' + c_bg.g + ', ' + c_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>';
            }

            // content
            var tooltipContent = '';
            tooltipContent += $.squaresRendererRenderObject(s.tooltip_content.squares_settings);

            // toolbar
            var tooltipToolbar = '';

            tooltipToolbar += '<div id="imp-editor-tooltip-bar-wrap">';
            if (isTrue(settings.editor.transform_tooltip_mode)) {
                tooltipToolbar += '<div data-editor-object-type="14" class="imp-editor-tooltip-bar-button"><i class="fa fa-times" aria-hidden="true"></i> Reset</div>';
                tooltipToolbar += '<div data-editor-object-type="13" class="imp-editor-tooltip-bar-button imp-editor-tooltip-bar-button-blue"><i class="fa fa-check" aria-hidden="true"></i> Done</div>';
            } else {
                tooltipToolbar += '<div data-editor-object-type="10" data-wcp-tooltip="Tooltip Style" data-wcp-tooltip-position="top" class="imp-editor-tooltip-bar-button"><i class="fa fa-paint-brush" aria-hidden="true"></i></div>';
                tooltipToolbar += '<div data-editor-object-type="11" data-wcp-tooltip="Transform Tooltip" data-wcp-tooltip-position="top" class="imp-editor-tooltip-bar-button"><i class="fa fa-arrows" aria-hidden="true"></i></div>';
                tooltipToolbar += '<div data-editor-object-type="12" data-wcp-tooltip="Tooltip Content" data-wcp-tooltip-position="top" class="imp-editor-tooltip-bar-button"><i class="fa fa-font" aria-hidden="true"></i></div>';
            }
            tooltipToolbar += '</div>';

            // selection
            var tooltipSelection = '';
            tooltipSelection += '   <div class="imp-selection imp-expanded-selection">';
            tooltipSelection += '       <div class="imp-selection-translate-boxes">';
            // tooltipSelection += '           <div class="imp-selection-translate-box imp-selection-translate-box-1" data-transform-direction="1" data-editor-object-type="15"></div>';
            // tooltipSelection += '           <div class="imp-selection-translate-box imp-selection-translate-box-3" data-transform-direction="3" data-editor-object-type="15"></div>';
            tooltipSelection += '           <div class="imp-selection-translate-box imp-selection-translate-box-4" data-transform-direction="4" data-editor-object-type="15"></div>';
            // tooltipSelection += '           <div class="imp-selection-translate-box imp-selection-translate-box-5" data-transform-direction="5" data-editor-object-type="15"></div>';
            // tooltipSelection += '           <div class="imp-selection-translate-box imp-selection-translate-box-7" data-transform-direction="7" data-editor-object-type="15"></div>';
            tooltipSelection += '           <div class="imp-selection-translate-box imp-selection-translate-box-8" data-transform-direction="8" data-editor-object-type="15"></div>';
            tooltipSelection += '       </div>';
            tooltipSelection += '   </div>';

            html += '<div data-editor-object-type="9" id="imp-editor-shape-tooltip" style="'+ tooltipStyle +'"><div id="imp-editor-shape-tooltip-content-wrap">'+ tooltipContent + '</div>' + tooltipArrow + tooltipToolbar + tooltipSelection +'</div>';
        }

        // Close canvas inner wrap
        html += '</div>';

        return html;
    }

    function isTrue(a) {
        if (parseInt(a, 10) == 1) return true;

        return false;
    }
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
})( jQuery, window, document );
