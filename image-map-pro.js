/*
*/

; (function ($, window, document, undefined) {
  'use strict'

  // Variable to hold the currently fullscreen image map
  var fullscreenMap = undefined
  var fullscreenMapParent = undefined
  var touch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))

  // API

  /*
        HTML API
        ---------------------------------------
        data-imp-highlight-shape-on-mouseover
        data-imp-highlight-shape-on-click
        data-imp-unhighlight-shape-on-mouseover
        data-imp-unhighlight-shape-on-click

        data-imp-open-tooltip-on-mouseover
        data-imp-open-tooltip-on-click
        data-imp-close-tooltip-on-mouseover
        data-imp-close-tooltip-on-click

        data-imp-trigger-shape-on-mouseover
        data-imp-trigger-shape-on-click
        data-imp-untrigger-shape-on-mouseover
        data-imp-untrigger-shape-on-click

        data-imp-focus-shape-on-click
        data-imp-focus-shape-on-mouseover

        data-imp-go-to-floor

        EXAMPLE
        ---------------------------------------
        <div data-imp-highlight-shape-on-mouseover="myshape1" data-imp-image-map-name="map1">Click</div>
    */

  // Events (called by the plugin, need implementation)
  $.imageMapProInitialized = function (imageMapName) {

  }
  $.imageMapProEventHighlightedShape = function (imageMapName, shapeName) {

  }
  $.imageMapProEventUnhighlightedShape = function (imageMapName, shapeName) {

  }
  $.imageMapProEventClickedShape = function (imageMapName, shapeName) {

  }
  $.imageMapProEventOpenedTooltip = function (imageMapName, shapeName) {

  }
  $.imageMapProEventClosedTooltip = function (imageMapName, shapeName) {

  }
  $.imageMapProEventSwitchedFloor = function (imageMapName, floorName) {

  }
  // Actions (called by a third party, implemented here)
  $.imageMapProHighlightShape = function (imageMapName, shapeName) {
    // Boilerplate code:
    // -- Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    // -- Get the shape and its index
    var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
    if (!shapeData) return

    var s = shapeData.shape
    var i = shapeData.index
    // End boilerplate code

    // Add shape to the list of highlighted shapes by the API
    if (map.apiHighlightedShapes.indexOf(i) === -1) {
      map.apiHighlightedShapes.push(i)
    }

    // If the shape is a master, then add its slaves too
    if (map.connectedShapes[s.id]) {
      for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
        var index = map.connectedShapes[s.id][j].index
        if (map.apiHighlightedShapes.indexOf(index) === -1) {
          map.apiHighlightedShapes.push(index)
        }
      }
    }

    APIFunctionQueueAddAction(function (cb) {
      map.highlightShape(i)
      cb()
    })
  }
  $.imageMapProUnhighlightShape = function (imageMapName, shapeName) {
    // Boilerplate code:
    // -- Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    // -- Get the shape and its index
    var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
    if (!shapeData) return

    var s = shapeData.shape
    var i = shapeData.index
    // End boilerplate code

    // Remove the shape from the list of highlighted shapes by the API
    if (map.apiHighlightedShapes.indexOf(i) != -1) {
      var arrayIndex = map.apiHighlightedShapes.indexOf(i)
      map.apiHighlightedShapes.splice(arrayIndex, 1)
    }

    // If the shape is a master, then remove its slaves too, and unhighlight them
    if (map.connectedShapes[s.id]) {
      for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
        var index = map.connectedShapes[s.id][j].index
        var index2 = map.apiHighlightedShapes.indexOf(index)
        map.apiHighlightedShapes.splice(index2, 1)

        APIFunctionQueueAddAction(function (cb) {
          map.unhighlightShape(index)
          cb()
        })
      }
    }

    APIFunctionQueueAddAction(function (cb) {
      map.unhighlightShape(i)
      cb()
    })
  }
  $.imageMapProFocusShape = function (imageMapName, shapeName) {
    // Boilerplate code:
    // -- Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    // -- Get the shape and its index
    var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
    if (!shapeData) return

    var s = shapeData.shape
    var i = shapeData.index
    // End boilerplate code

    // If the shape floor is different than current floor, switch floors
    if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
      APIFunctionQueueAddAction(function (cb) {
        map.switchLayer(s.layerID, function () {
          cb()
        })
      })
    }

    APIFunctionQueueAddAction(function (cb) {
      map.focusShape(i)
      cb()
    })
    APIFunctionQueueAddAction(function (cb) {
      map.highlightShape(i)
      cb()
    })
  }
  $.imageMapProOpenTooltip = function (imageMapName, shapeName) {
    // Boilerplate code:
    // -- Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    // -- Get the shape and its index
    var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
    if (!shapeData) return

    var s = shapeData.shape
    var i = shapeData.index
    // End boilerplate code

    APIFunctionQueueAddAction(function (cb) {
      map.showTooltip(i)
      cb()
    })
    APIFunctionQueueAddAction(function (cb) {
      map.updateTooltipPosition(i)
      cb()
    })

    // Add the tooltip to the list of tooltips opened with the API
    if (map.apiOpenedTooltips.indexOf(i) === -1) {
      map.apiOpenedTooltips.push(i)
    }
  }
  $.imageMapProHideTooltip = function (imageMapName, shapeName) {
    // Boilerplate code:
    // -- Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    // -- Get the shape and its index
    var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
    if (!shapeData) return

    var s = shapeData.shape
    var i = shapeData.index
    // End boilerplate code

    // Remove the tooltip to the list of tooltips opened with the API
    if (map.apiOpenedTooltips.indexOf(i) != -1) {
      var arrayIndex = map.apiOpenedTooltips.indexOf(i)
      map.apiOpenedTooltips.splice(arrayIndex, 1)
    }

    APIFunctionQueueAddAction(function (cb) {
      map.hideTooltip(i)
      cb()
    })
  }
  $.imageMapProReInitMap = function (imageMapName) {
    // Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    map.init()
  }
  $.imageMapProIsMobile = function () {
    return isMobile()
  }
  $.imageMapProGoToFloor = function (imageMapName, floorName) {
    // Get the map
    // var map = findImageMapWithName(imageMapName + '-fullscreen') || findImageMapWithName(imageMapName)
    // if (!map) return

    // Try to get a fullscreen map with the same name, or a non-fullscreen map
    var map = instances[imageMapName + '-fullscreen'] || instances[imageMapName]
    if (!map) return

    // Find out the ID of the floor with name floorName
    var layerID = 0
    for (var i = 0; i < map.settings.layers.layers_list.length; i++) {
      if (map.settings.layers.layers_list[i].title === floorName) {
        layerID = map.settings.layers.layers_list[i].id
      }
    }

    // Switch floors
    APIFunctionQueueAddAction(function (cb) {
      map.switchLayer(layerID)
      cb()
    })
  }
  $.imageMapProZoomIn = function (imageMapName) {
    // Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    map.zoomIn()
  }
  $.imageMapProZoomOut = function (imageMapName) {
    // Get the map
    var map = findImageMapWithName(imageMapName)
    if (!map) return

    map.zoomOut()
  }

  // Helper functions
  var APIFunctionQueue = []
  function findShapeWithTitle(imageMapName, shapeTitle) {
    var i = $('[data-shape-title="' + shapeTitle + '"]').data('index')
    var s = instances[imageMapName].settings.spots[i]

    // If shape is not found, search other floors
    if (!s) {
      for (var j = 0; j < instances[imageMapName].settings.spots.length; j++) {
        if (instances[imageMapName].settings.spots[j].title === shapeTitle) {
          s = instances[imageMapName].settings.spots[j]
          i = j
        }
      }

      if (!s) {
        console.log('Error: Could not find shape with name: ' + shapeTitle)
        return undefined
      }
    }

    return { shape: s, index: i }
  }
  function findImageMapWithName(imageMapName) {
    for (var imageMap in instances) {
      if (instances[imageMap].settings.general.name === imageMapName) {
        return instances[imageMap]
      }
    }

    // Not found, return first image map
    console.log('Image map with name "' + imageMapName + '" not found, returning the first found image map instead.')
    for (var imageMap in instances) {
      return instances[imageMap]
    }

    // No image maps, return undefined
    console.log('Error: No image maps found!')
    return undefined
  }

  // Action queue
  function APIFunctionQueueAddAction(action) {
    var l = APIFunctionQueue.length

    APIFunctionQueue.push(action)

    if (l === 0) {
      APIFunctionQueuePopAction()
    }
  }
  function APIFunctionQueuePopAction() {
    APIFunctionQueue[0](function () {
      APIFunctionQueue.shift()
      if (APIFunctionQueue.length > 0) {
        APIFunctionQueuePopAction()
      }
    })
  }

  // HTML API events
  $(document).ready(function () {
    /*

        HTML API
        ---------------------------------------
        data-imp-highlight-shape-on-mouseover
        data-imp-highlight-shape-on-click
        data-imp-unhighlight-shape-on-mouseover
        data-imp-unhighlight-shape-on-click

        data-imp-open-tooltip-on-mouseover
        data-imp-open-tooltip-on-click
        data-imp-close-tooltip-on-mouseover
        data-imp-close-tooltip-on-click

        data-imp-trigger-shape-on-mouseover
        data-imp-trigger-shape-on-click
        data-imp-untrigger-shape-on-mouseover
        data-imp-untrigger-shape-on-click

        data-imp-focus-shape-on-mouseover
        data-imp-focus-shape-on-click

        data-imp-go-to-floor

        */

    // HTML API - SHAPE

    var self = this

    // [data-imp-highlight-shape-on-mouseover]
    $(document).on('mouseover', '[data-imp-highlight-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-highlight-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      // if (s.layerID != map.settings.runtime.layerID) {
      //     APIFunctionQueueAddAction(function(cb) {
      //         map.switchLayer(s.layerID, function() {
      //             cb();
      //         });
      //     });
      // }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.highlightShape(i, true)
        cb()
      })
    })
    $(document).on('mouseout', '[data-imp-highlight-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-highlight-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      // if (s.layerID != map.settings.runtime.layerID) {
      //     APIFunctionQueueAddAction(function(cb) {
      //         map.switchLayer(s.layerID, function() {
      //             cb();
      //         });
      //     });
      // }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightAllShapes()
        cb()
      })
    })

    // [data-imp-highlight-shape-on-click]
    $(document).on('click', '[data-imp-highlight-shape-on-click]', function () {
      var shapeName = $(this).data('imp-highlight-shape-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.highlightShape(i, true)
        cb()
      })

      // Add shape to the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) === -1) {
        map.apiHighlightedShapes.push(i)
      }

      // If the shape is a master, then add its slaves too
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          if (map.apiHighlightedShapes.indexOf(index) === -1) {
            map.apiHighlightedShapes.push(index)
          }
        }
      }
    })

    // [data-imp-unhighlight-shape-on-mouseover]
    $(document).on('mouseover', '[data-imp-unhighlight-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-unhighlight-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // Remove the shape from the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) != -1) {
        var arrayIndex = map.apiHighlightedShapes.indexOf(i)
        map.apiHighlightedShapes.splice(arrayIndex, 1)
      }

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // If the shape is a master, then remove its slaves too, and unhighlight them
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          var index2 = map.apiHighlightedShapes.indexOf(index)
          map.apiHighlightedShapes.splice(index2, 1)
          APIFunctionQueueAddAction(function (cb) {
            map.unhighlightShape(index)
            cb()
          })
        }
      }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightShape(i)
        cb()
      })
    })

    // [data-imp-unhighlight-shape-on-click]
    $(document).on('click', '[data-imp-unhighlight-shape-on-click]', function () {
      var shapeName = $(this).data('imp-unhighlight-shape-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // Remove the shape from the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) != -1) {
        var arrayIndex = map.apiHighlightedShapes.indexOf(i)
        map.apiHighlightedShapes.splice(arrayIndex, 1)
      }

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // If the shape is a master, then remove its slaves too, and unhighlight them
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          var index2 = map.apiHighlightedShapes.indexOf(index)
          map.apiHighlightedShapes.splice(index2, 1)
          APIFunctionQueueAddAction(function (cb) {
            map.unhighlightShape(index)
            cb()
          })
        }
      }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightShape(i)
        cb()
      })
    })

    // HTML API - TOOLTIP

    // [data-imp-open-tooltip-on-mouseover]
    $(document).on('mouseover', '[data-imp-open-tooltip-on-mouseover]', function () {
      var shapeName = $(this).data('imp-open-tooltip-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.showTooltip(i)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.updateTooltipPosition(i)
        cb()
      })

      // Add the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) === -1) {
        map.apiOpenedTooltips.push(i)
      }
    })
    $(document).on('mouseout', '[data-imp-open-tooltip-on-mouseover]', function () {
      var shapeName = $(this).data('imp-open-tooltip-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.hideAllTooltips()
        cb()
      })

      // Remove the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) != -1) {
        var arrayIndex = map.apiOpenedTooltips.indexOf(i)
        map.apiOpenedTooltips.splice(arrayIndex, 1)
      }
    })

    // [data-imp-open-tooltip-on-click]
    $(document).on('click', '[data-imp-open-tooltip-on-click]', function () {
      var shapeName = $(this).data('imp-open-tooltip-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Perform event main action
      APIFunctionQueueAddAction(function (cb) {
        map.showTooltip(i)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.updateTooltipPosition(i)
        cb()
      })

      // Add the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) === -1) {
        map.apiOpenedTooltips.push(i)
      }
    })

    // [data-imp-close-tooltip-on-mouseover]
    $(document).on('mouseover', '[data-imp-close-tooltip-on-mouseover]', function () {
      var shapeName = $(this).data('imp-close-tooltip-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Remove the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) != -1) {
        var arrayIndex = map.apiOpenedTooltips.indexOf(i)
        map.apiOpenedTooltips.splice(arrayIndex, 1)
      }

      APIFunctionQueueAddAction(function (cb) {
        map.hideTooltip(i)
        cb()
      })
    })

    // [data-imp-close-tooltip-on-click]
    $(document).on('click', '[data-imp-close-tooltip-on-click]', function () {
      var shapeName = $(this).data('imp-close-tooltip-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Remove the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) != -1) {
        var arrayIndex = map.apiOpenedTooltips.indexOf(i)
        map.apiOpenedTooltips.splice(arrayIndex, 1)
      }

      APIFunctionQueueAddAction(function (cb) {
        map.hideTooltip(i)
        cb()
      })
    })

    // HTML API - TRIGGER

    // [data-imp-trigger-shape-on-mouseover]
    $(document).on('mouseover', '[data-imp-trigger-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-trigger-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      APIFunctionQueueAddAction(function (cb) {
        map.highlightShape(i, true)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.showTooltip(i)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.updateTooltipPosition(i)
        cb()
      })

      // Add the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) === -1) {
        map.apiOpenedTooltips.push(i)
      }

      // Add shape to the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) === -1) {
        map.apiHighlightedShapes.push(i)
      }

      // If the shape is a master, then add its slaves too
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          if (map.apiHighlightedShapes.indexOf(index) === -1) {
            map.apiHighlightedShapes.push(index)
          }
        }
      }
    })
    $(document).on('mouseout', '[data-imp-trigger-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-trigger-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Remove the shape from the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) != -1) {
        var arrayIndex = map.apiHighlightedShapes.indexOf(i)
        map.apiHighlightedShapes.splice(arrayIndex, 1)
      }

      // If the shape is a master, then remove its slaves too, and unhighlight them
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          var index2 = map.apiHighlightedShapes.indexOf(index)
          map.apiHighlightedShapes.splice(index2, 1)

          APIFunctionQueueAddAction(function (cb) {
            map.unhighlightShape(index)
            cb()
          })
        }
      }

      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightShape(i)
        cb()
      })

      // Remove the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) != -1) {
        var arrayIndex = map.apiOpenedTooltips.indexOf(i)
        map.apiOpenedTooltips.splice(arrayIndex, 1)
      }

      APIFunctionQueueAddAction(function (cb) {
        map.hideTooltip(i)
        cb()
      })
    })

    // [data-imp-trigger-shape-on-click]
    $(document).on('click', '[data-imp-trigger-shape-on-click]', function () {
      var shapeName = $(this).data('imp-trigger-shape-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      APIFunctionQueueAddAction(function (cb) {
        map.highlightShape(i, true)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.showTooltip(i)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.updateTooltipPosition(i)
        cb()
      })

      // Add the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) === -1) {
        map.apiOpenedTooltips.push(i)
      }

      // Add shape to the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) === -1) {
        map.apiHighlightedShapes.push(i)
      }

      // If the shape is a master, then add its slaves too
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          if (map.apiHighlightedShapes.indexOf(index) === -1) {
            map.apiHighlightedShapes.push(index)
          }
        }
      }
    })

    // [data-imp-untrigger-shape-on-mouseover]
    $(document).on('mouseover', '[data-imp-untrigger-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-untrigger-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Remove the shape from the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) != -1) {
        var arrayIndex = map.apiHighlightedShapes.indexOf(i)
        map.apiHighlightedShapes.splice(arrayIndex, 1)
      }

      // If the shape is a master, then remove its slaves too, and unhighlight them
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          var index2 = map.apiHighlightedShapes.indexOf(index)
          map.apiHighlightedShapes.splice(index2, 1)

          APIFunctionQueueAddAction(function (cb) {
            map.unhighlightShape(index)
            cb()
          })
        }
      }

      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightShape(i)
        cb()
      })

      // Remove the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) != -1) {
        var arrayIndex = map.apiOpenedTooltips.indexOf(i)
        map.apiOpenedTooltips.splice(arrayIndex, 1)
      }

      APIFunctionQueueAddAction(function (cb) {
        map.hideTooltip(i)
        cb()
      })
    })

    // [data-imp-untrigger-shape-on-click]
    $(document).on('click', '[data-imp-untrigger-shape-on-click]', function () {
      var shapeName = $(this).data('imp-untrigger-shape-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      // Remove the shape from the list of highlighted shapes by the API
      if (map.apiHighlightedShapes.indexOf(i) != -1) {
        var arrayIndex = map.apiHighlightedShapes.indexOf(i)
        map.apiHighlightedShapes.splice(arrayIndex, 1)
      }

      // If the shape is a master, then remove its slaves too, and unhighlight them
      if (map.connectedShapes[s.id]) {
        for (var j = 0; j < map.connectedShapes[s.id].length; j++) {
          var index = map.connectedShapes[s.id][j].index
          var index2 = map.apiHighlightedShapes.indexOf(index)
          map.apiHighlightedShapes.splice(index2, 1)

          APIFunctionQueueAddAction(function (cb) {
            map.unhighlightShape(index)
            cb()
          })
        }
      }

      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightShape(i)
        cb()
      })

      // Remove the tooltip to the list of tooltips opened with the API
      if (map.apiOpenedTooltips.indexOf(i) != -1) {
        var arrayIndex = map.apiOpenedTooltips.indexOf(i)
        map.apiOpenedTooltips.splice(arrayIndex, 1)
      }

      APIFunctionQueueAddAction(function (cb) {
        map.hideTooltip(i)
        cb()
      })
    })

    // HTML API - Focus
    // [data-imp-focus-shape-on-mouseover]
    $(document).on('mouseover', '[data-imp-focus-shape-on-mouseover]', function () {
      var shapeName = $(this).data('imp-focus-shape-on-mouseover')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }

      APIFunctionQueueAddAction(function (cb) {
        map.focusShape(i)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightAllShapes()
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.highlightShape(i)
        cb()
      })
    })

    // [data-imp-focus-shape-on-click]
    $(document).on('click', '[data-imp-focus-shape-on-click]', function () {
      var shapeName = $(this).data('imp-focus-shape-on-click')
      var imageMapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(imageMapName)
      if (!map) return

      // -- Get the shape and its index
      var shapeData = findShapeWithTitle(map.settings.general.name, shapeName)
      if (!shapeData) return

      var s = shapeData.shape
      var i = shapeData.index
      // End boilerplate code

      // This event is triggered from the responsive shapes menu
      // so hide the menu if it's visible
      map.hideResponsiveShapesMenu()

      // If the shape floor is different than current floor, switch floors
      if (parseInt(s.layerID, 10) !== parseInt(map.settings.runtime.layerID, 10)) {
        APIFunctionQueueAddAction(function (cb) {
          map.switchLayer(s.layerID, function () {
            cb()
          })
        })
      }
      APIFunctionQueueAddAction(function (cb) {
        map.focusShape(i)
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.unhighlightAllShapes()
        cb()
      })
      APIFunctionQueueAddAction(function (cb) {
        map.highlightShape(i)
        cb()
      })
    })

    // HTML API - Floors
    $(document).on('click', '[data-imp-go-to-floor]', function () {
      var floorName = $(this).data('imp-go-to-floor')
      var mapName = $(this).data('imp-image-map-name')

      // Boilerplate code:
      // -- Get the map
      var map = findImageMapWithName(mapName)
      if (!map) return

      // if (mapName === map.settings.general.name) {
      // Find out the ID of the floor with name floorName
      var layerID = 0
      for (var i = 0; i < map.settings.layers.layers_list.length; i++) {
        if (map.settings.layers.layers_list[i].title === floorName) {
          layerID = map.settings.layers.layers_list[i].id
        }
      }
      // Switch floors
      map.switchLayer(layerID)
      // }
    })
  })

  // Create the defaults once
  var pluginName = 'imageMapPro'
  var default_settings = $.imageMapProEditorDefaults
  var default_spot_settings = $.imageMapProShapeDefaults
  var instances = new Array()

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend(true, {}, default_settings, options)

    this.root = $(element)
    this.wrap = undefined
    this.shapesMenuWrap = undefined
    this.shapesMenuResponsiveButton = undefined
    this.zoomWrap = undefined
    this.translateWrap = undefined
    this.ui = undefined
    this.uiNavigatorRoot = undefined
    this.uiNavigatorWindowWidth = undefined
    this.uiNavigatorWindowHeight = undefined
    this.uiNavigatorImage = undefined
    this.shapeContainer = undefined
    this.imageBackgroundsContainer = undefined
    this.shapeSvgContainer = undefined
    this.fullscreenTooltipsContainer = undefined
    this.tooltipsContainer = undefined
    this.scrollMessage = undefined
    this.responsiveShapesMenu = false // This value is adjusted on window resize, rather than set once on init
    this.responsiveShapesMenuWrap = false // This value is adjusted on window resize, rather than set once on init

    // Cache
    this.wrapWidth = 0
    this.wrapHeight = 0
    this.wrapOffsetLeft = 0
    this.wrapOffsetTop = 0
    this.visibleFullscreenTooltip = undefined
    this.visibleFullscreenTooltipIndex = undefined
    this.bodyOverflow = undefined
    this.highlightedShapes = new Array()
    this.connectedShapes = new Array()
    this.openedTooltips = new Array()
    this.apiHighlightedShapes = new Array()
    this.apiOpenedTooltips = new Array()
    this.hideScrollMessageTimeout = undefined

    // Zoom
    this.targetZoom = 1
    this.zoom = 1
    this.maxZoomLevel = 8
    this.zoomMultiplier = 1.45

    // Pan
    this.targetPanX = 0
    this.actualPanX = 0
    this.targetPanY = 0
    this.actualPanY = 0
    this.initialPanX = 0
    this.initialPanY = 0
    this.panDeltaY = 0

    this.ix = 0
    this.iy = 0
    this.lastX = 0
    this.lastY = 0

    this.pinchInitial = [{ x: 0, y: 0 }, { x: 0, y: 0 }]
    this.pinchInitialDistance = 0
    this.pinchInitialZoom = 0

    this.navigatorRatio = 1
    this.navigatorMarginX = 0
    this.navigatorMarginY = 0

    // Flags
    this.touch = false
    this.fullscreenTooltipVisible = false
    this.panning = false
    this.didPan = false
    this.panningOnNavigator = false
    this.pinching = false
    this.didAnimateShapesOnPageload = false
    this.ctrlKeyDown = false
    this.cmdKeyDown = false
    this.mac = false
    this.lastWrapRecalc = 0

    this.init()
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function (cb) {
      this.parseSettings()

      instances[this.settings.general.name] = this

      this.id = Math.random() * 100

      // Various preparations
      this.connectedShapes = []
      for (var i = 0; i < this.settings.spots.length; i++) {
        // Fill out any missing properties
        var s = this.settings.spots[i]
        var d = $.extend(true, {}, default_spot_settings)
        s = $.extend(true, d, s)
        this.settings.spots[i] = $.extend(true, {}, s)

        // Support for image maps created before 3.1.0
        if (!this.settings.spots[i].title || this.settings.spots[i].title.length === 0) {
          this.settings.spots[i].title = this.settings.spots[i].id
        }

        // Create connected shape groups
        // this.connectedShapes = new Array()
        if (s.connected_to != '') {
          if (!this.connectedShapes[s.connected_to]) {
            this.connectedShapes[s.connected_to] = new Array()
          }

          this.connectedShapes[s.connected_to].push({ id: s.id, index: i })
        }

        // Copy the background_type value from default_style to mouseover_style
        this.settings.spots[i].mouseover_style.background_type = this.settings.spots[i].default_style.background_type
      }

      if (isTrue(this.settings.layers.enable_layers)) {
        // Find the currently active layer by ID, from the list of layers
        var exists = false
        for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
          if (parseInt(this.settings.layers.layers_list[i].id, 10) === parseInt(this.settings.runtime.layerID, 10)) {
            exists = true
            this.settings.image.url = this.settings.layers.layers_list[i].image_url
          }
        }

        // If the layer doesn't exist, show the first layer
        if (!exists) {
          this.settings.image.url = this.settings.layers.layers_list[0].image_url
          this.settings.runtime.layerID = this.settings.layers.layers_list[0].id
        }
      }

      // Mac?
      this.mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

      if (this.settings.image.url != '') {
        var img = new Image()
        img.src = this.settings.image.url

        var self = this
        this.loadImage(img, function () {
          // Image loading
        }, function () {
          self.finishInit(cb)
        })
      } else {
        this.finishInit(cb)
      }

      // Pre-load all shape background images for mouseover
      for (var i = 0; i < this.settings.spots.length; i++) {
        var s = this.settings.spots[i]
        if (s.default_style.background_type === 'image') {
          var img = new Image()
          img.src = s.mouseover_style.background_image_url
          $(img).on('load', function () {
            // console.log('image load complete');
          })
        }
      }
    },
    finishInit: function (cb) {
      // Responsive shapes menu?
      var rootWidth = this.root.width()
      if (this.settings.runtime.is_fullscreen) {
        rootWidth = $(window).width()
      }

      if (isMobile() || rootWidth / 3 < 240) {
        this.responsiveShapesMenu = true
      }

      var html = ''

      // Sticky tooltips class
      var stickyTooltipsClass = ''
      if (isTrue(this.settings.tooltips.sticky_tooltips)) {
        stickyTooltipsClass = 'imp-sticky-tooltips'
      }

      html += '<div class="imp-wrap ' + stickyTooltipsClass + '">'
      html += '   <div class="imp-ui" data-image-map-pro-ui-id="' + this.settings.id + '">'

      // Navigator
      if (isTrue(this.settings.zooming.enable_zooming) && isTrue(this.settings.zooming.enable_navigator)) {
        html += '       <div data-imp-id="' + this.settings.id + '" class="imp-ui-element imp-ui-navigator-root">'

        if (this.settings.image.url != '') {
          html += '         <img src="' + this.settings.image.url + '" class="imp-ui-navigator-background-image-edgefill">'
          html += '         <img src="' + this.settings.image.url + '" class="imp-ui-navigator-background-image">'
        }

        html += '         <div class="imp-ui-navigator-overlay"></div>'
        if (this.settings.image.url != '') {
          html += '         <img src="' + this.settings.image.url + '" class="imp-ui-navigator-window-image">'
        }
        html += '      </div>'
      }

      // Zoom Buttons
      if (isTrue(this.settings.zooming.enable_zooming) && isTrue(this.settings.zooming.enable_zoom_buttons)) {
        html += '       <div data-imp-id="' + this.settings.id + '" class="imp-ui-element imp-ui-zoom-button imp-ui-zoom-button-zoom-in" style="color: ' + this.settings.zooming.zoom_button_text_color + '; background: ' + this.settings.zooming.zoom_button_background_color + ';"><i class="fa fa-plus"></i></div>'
        html += '       <div data-imp-id="' + this.settings.id + '" class="imp-ui-element imp-ui-zoom-button imp-ui-zoom-button-zoom-out" style="color: ' + this.settings.zooming.zoom_button_text_color + '; background: ' + this.settings.zooming.zoom_button_background_color + ';"><i class="fa fa-minus"></i></div>'
      }

      // Layers UI
      if (isTrue(this.settings.layers.enable_layers)) {
        html += '<div class="imp-ui-layers-menu-wrap">'
        html += '   <div data-imp-id="' + this.settings.id + '" class="imp-ui-layer-switch-up imp-ui-layer-switch"><i class="fa fa-caret-up" aria-hidden="true"></i></div>'
        html += '   <div data-imp-id="' + this.settings.id + '" class="imp-ui-layer-switch-down imp-ui-layer-switch"><i class="fa fa-caret-down" aria-hidden="true"></i></div>'
        html += '   <select class="imp-ui-element imp-ui-layers-select">'
        for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
          html += '<option value="' + this.settings.layers.layers_list[i].id + '">' + this.settings.layers.layers_list[i].title + '</option>'
        }
        html += '   </select>'
        html += '</div>'
      }

      // Scroll message
      if (isTrue(this.settings.zooming.enable_zooming) && isTrue(this.settings.zooming.hold_ctrl_to_zoom)) {
        var keyName = 'CTRL'
        if (this.mac) keyName = '⌘'
        html += '<div class="imp-ui-scroll-message-wrap">'
        html += '   <div class="imp-ui-scroll-message-wrap-inner">'
        html += '       <div class="imp-ui-scroll-message">Hold <div class="imp-ui-scroll-message-button">' + keyName + '</div> to Zoom</div>'
        html += '   </div>'
        html += '</div>'
      }

      html += '   </div>'
      html += '   <div class="imp-zoom-outer-wrap">'
      html += '       <div class="imp-translate-wrap">'
      html += '           <div class="imp-zoom-wrap">'
      if (this.settings.image.url != '') {
        html += '               <img src="' + this.settings.image.url + '" class="imp-main-image">'
      }
      html += '           </div>'
      html += '       </div>'
      html += '   </div>'
      html += '</div>'

      this.root.html(html)

      this.wrap = this.root.find('.imp-wrap')
      this.zoomWrap = this.root.find('.imp-zoom-wrap')
      this.translateWrap = this.root.find('.imp-translate-wrap')
      this.ui = this.wrap.find('.imp-ui')
      this.scrollMessage = this.wrap.find('.imp-ui-scroll-message-wrap')

      this.root.addClass('imp-initialized')
      this.root.attr('data-image-map-pro-id', this.settings.id)

      // Create tooltips wrap
      $('[data-imp-tooltips-container="' + this.settings.id + '"]').remove()
      $('body').prepend('<div class="imp-tooltips-container" data-imp-tooltips-container="' + this.settings.id + '"></div>')
      this.tooltipsContainer = $('[data-imp-tooltips-container="' + this.settings.id + '"]')

      this.events()
      this.centerImageMap()
      this.drawShapes()
      this.generateShapeStyleClasses()
      this.addTooltips()
      this.initFullscreen()
      this.initZoom()
      this.drawShapesMenu()
      this.adjustSize()
      this.initNavigator()
      this.initLayers()
      this.animateShapesLoop()

      $.imageMapProInitialized(this.settings.general.name)
      if (cb) cb()
    },
    parseSettings: function () {
      // If there is a value for the old image URL in the settings, use that instead
      // This happens when the user updates from an older version using the old format and the
      // image map has not been saved yet.
      if (this.settings.general.image_url) {
        this.settings.image.url = this.settings.general.image_url
      }

      // 5.0
      for (var i = 0; i < this.settings.spots.length; i++) {
        var s = this.settings.spots[i]

        // 1. Move s.tooltip_style.enable_tooltip to s.tooltip.enable_tooltip
        if (s.tooltip_style && s.tooltip_style.enable_tooltip) {
          s.tooltip.enable_tooltip = s.tooltip_style.enable_tooltip
          s.tooltip_style.enable_tooltip = undefined
        }

        // 2. If tooltip content type is NOT "content-builder" and it contains plain text, remove content type and move the content to a text element
        if (s.tooltip_content.plain_text && s.tooltip_content.content_type != 'content-builder') {
          var newSquaresSettings = {
            'containers': [{
              'id': 'sq-container-160121',
              'settings': {
                'elements': [{
                  'settings': {
                    'name': 'Paragraph',
                    'iconClass': 'fa fa-paragraph'
                  },
                  'options': {
                    'text': {
                      'text': s.tooltip_content.plain_text
                    },
                    'font': {
                      'text_color': s.tooltip_content.plain_text_color
                    }
                  }
                }]
              }
            }]
          }

          s.tooltip_content.squares_settings = newSquaresSettings

          // Remove legacy options
          s.tooltip_content.content_type = undefined
          s.tooltip_content.plain_text = undefined
          s.tooltip_content.plain_text_color = undefined
        }

        // 3. Move fill and fill_opacity to background and background_opacity
        // remove fill and fill_opacity

        if (s.default_style && s.default_style.fill) {
          s.default_style.background_color = s.default_style.fill
          delete s.default_style.fill
        }
        if (s.default_style && s.default_style.fill_opacity) {
          s.default_style.background_opacity = s.default_style.fill_opacity
          delete s.default_style.fill_opacity
        }
        if (s.mouseover_style && s.mouseover_style.fill) {
          s.mouseover_style.background_color = s.mouseover_style.fill
          delete s.mouseover_style.fill
        }
        if (s.mouseover_style && s.mouseover_style.fill_opacity) {
          s.mouseover_style.background_opacity = s.mouseover_style.fill_opacity
          delete s.mouseover_style.fill_opacity
        }
      }
    },
    loadImage: function (image, cbLoading, cbComplete) {
      // Does the image map contain multiple floors?
      if (isTrue(this.settings.layers.enable_layers)) {
        for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
          var img = new Image()
          img.src = this.settings.layers.layers_list[i].image_url
          var numberOfLoadedImages = 0

          var self = this
          $(img).on('load', function () {
            numberOfLoadedImages++

            if (numberOfLoadedImages === self.settings.layers.layers_list.length) {
              cbComplete()
            }
          })
        }
      } else {
        if (!image.complete || image.naturalWidth === undefined || image.naturalHeight === undefined) {
          cbLoading()
          $(image).on('load', function () {
            $(image).off('load')
            cbComplete()
          })
        } else {
          cbComplete()
        }
      }
    },
    centerImageMap: function () {
      var self = this

      if (isTrue(self.settings.general.center_image_map)) {
        self.wrap.css({
          margin: '0 auto'
        })
      }
    },
    adjustSize: function () {
      // If the image map is in fullscreen mode, adjust according to the window and return
      if (isTrue(this.settings.runtime.is_fullscreen)) {
        var rootElementWidth = $(window).width()
        var rootElementHeight = $(window).height()

        if (isTrue(this.settings.shapes_menu.enable_shapes_menu) && !this.responsiveShapesMenu) {
          rootElementWidth = rootElementWidth - 240
        }

        var screenRatio = rootElementWidth / rootElementHeight
        var imageRatio = this.settings.general.naturalWidth / this.settings.general.naturalHeight

        if (imageRatio < screenRatio) {
          this.settings.general.width = rootElementHeight * imageRatio
          this.settings.general.height = rootElementHeight
        } else {
          this.settings.general.width = rootElementWidth
          this.settings.general.height = rootElementWidth / imageRatio
        }

        this.wrap.css({
          width: this.settings.general.width,
          height: this.settings.general.height
        })

        // Store wrap data for quick reference in events
        this.wrapWidth = this.wrap.width()
        this.wrapHeight = this.wrap.height()
        this.wrapOffsetLeft = this.wrap.offset().left
        this.wrapOffsetTop = this.wrap.offset().top

        return
      }

      // Is there an image?
      if (this.settings.image.url != '') {
        // If the image map is responsive, fit the map to its parent element
        if (isTrue(this.settings.general.responsive)) {
          if (isTrue(this.settings.general.preserve_quality)) {
            this.wrap.css({
              'max-width': this.settings.general.naturalWidth
            })
          }
        } else {
          this.wrap.css({
            width: this.settings.general.width,
            height: this.settings.general.height
          })
        }
      } else {
        // There is no image
        // Fix the width and height
        if (isTrue(this.settings.general.responsive)) {
          this.wrap.css({
            'width': '100%',
            'height': this.settings.general.height,
            'max-width': this.settings.general.width,
            'max-height': this.settings.general.height
          })
          this.wrap.css({
            'height': this.wrap.width() * (this.settings.general.height / this.settings.general.width)
          })
        } else {
          this.wrap.css({
            'width': this.settings.general.width,
            'height': this.settings.general.height
          })
        }
      }

      // Store wrap data for quick reference in events
      this.wrapWidth = this.wrap.width()
      this.wrapHeight = this.wrap.height()
      this.wrapOffsetLeft = this.wrap.offset().left
      this.wrapOffsetTop = this.wrap.offset().top
    },
    drawShapes: function () {
      // Make sure spot coordinates are numbers
      for (var i = 0; i < this.settings.spots.length; i++) {
        var s = this.settings.spots[i]

        s.x = parseFloat(s.x)
        s.y = parseFloat(s.y)
        s.width = parseFloat(s.width)
        s.height = parseFloat(s.height)
        s.default_style.stroke_width = parseInt(s.default_style.stroke_width)
        s.mouseover_style.stroke_width = parseInt(s.mouseover_style.stroke_width)

        if (s.type === 'poly') {
          for (var j = 0; j < s.points.length; j++) {
            s.points[j].x = parseFloat(s.points[j].x)
            s.points[j].y = parseFloat(s.points[j].y)
          }
        }
      }

      this.settings.general.width = parseInt(this.settings.general.width)
      this.settings.general.height = parseInt(this.settings.general.height)

      this.zoomWrap.prepend('<div class="imp-shape-container"></div>')
      this.zoomWrap.prepend('<div class="imp-image-backgrounds-container" id="imp-image-backgrounds-container-' + this.settings.id + '"></div>')
      this.shapeContainer = this.wrap.find('.imp-shape-container')
      this.imageBackgroundsContainer = this.wrap.find('.imp-image-backgrounds-container')

      var html = ''
      var hasPolygons = false

      // If the image map is responsive, use natural width and height
      // Otherwise, use the width/height set from the editor
      var imageMapWidth = this.settings.general.width
      var imageMapHeight = this.settings.general.height
      if (isTrue(this.settings.general.responsive)) {
        imageMapWidth = this.settings.general.naturalWidth
        imageMapHeight = this.settings.general.naturalHeight
      }

      var svgHtml = '<svg class="hs-poly-svg" viewBox="0 0 ' + imageMapWidth + ' ' + imageMapHeight + '" preserveAspectRatio="none">'

      for (var i = 0; i < this.settings.spots.length; i++) {
        // If layers are enabled and the shape does not belong to the currently active layer, then continue
        if (isTrue(this.settings.layers.enable_layers) && parseInt(this.settings.spots[i].layerID, 10) !== parseInt(this.settings.runtime.layerID)) {
          continue
        }

        var s = this.settings.spots[i]

        var staticClass = ''
        if (isTrue(s.static)) staticClass = 'imp-shape-static'

        if (s.type === 'spot') {
          if (isTrue(s.default_style.use_icon)) {
            var spotClass = 'imp-shape-spot'

            if (isTrue(s.default_style.icon_is_pin)) {
              spotClass += ' imp-shape-spot-pin'
            }

            html += '<div class="imp-shape ' + staticClass + ' ' + spotClass + '" id="' + s.id + '" data-shape-title="' + s.title + '" data-index=' + i + '>'

            // Icon
            if (s.default_style.icon_type === 'library') {
              var iconStyle = ''
              // var iconStyle = 'color: ' + s.default_style.icon_fill + ';';
              iconStyle += 'line-height: ' + s.height + 'px;'
              iconStyle += 'font-size: ' + s.height + 'px;'

              html += '   <div class="imp-spot-fontawesome-icon" style="' + iconStyle + '">'
              html += '       <i class="fa fa-' + s.default_style.icon_fontawesome_id + '"></i>'
              html += '   </div>'
            }

            if (s.default_style.icon_type === 'custom' && s.default_style.icon_url.length > 0) {
              html += '<img src="' + s.default_style.icon_url + '" style="width: ' + s.width + 'px; height: ' + s.height + 'px">'
            }

            // Shadow
            if (isTrue(s.default_style.icon_shadow)) {
              var shadowStyle = ''

              shadowStyle += 'width: ' + s.width + 'px;'
              shadowStyle += 'height: ' + s.height + 'px;'
              shadowStyle += 'top: ' + s.height / 2 + 'px;'

              html += '<div style="' + shadowStyle + '" class="imp-shape-icon-shadow"></div>'
            }

            // Glow
            if (isTrue(this.settings.shapes.glowing_shapes)) {
              var glowStyle = ''

              glowStyle += 'width: ' + s.width / 3 + 'px;'
              glowStyle += 'height: ' + s.height / 3 + 'px;'
              glowStyle += 'margin-left: ' + (-s.width / 6) + 'px;'
              glowStyle += 'margin-top: ' + (-s.height / 6) + 'px;'
              glowStyle += 'border-radius: ' + s.width / 3 + 'px;'
              // glowStyle += 'opacity: ' + this.settings.shapes.glow_opacity + ';';

              var glow_bg = hexToRgb(this.settings.shapes.glowing_shapes_color) || { r: 0, b: 0, g: 0 }

              glowStyle += 'background: rgba(' + glow_bg.r + ', ' + glow_bg.g + ', ' + glow_bg.b + ', ' + this.settings.shapes.glow_opacity + ');'
              glowStyle += 'box-shadow: 0 0 20px 15px rgba(' + glow_bg.r + ', ' + glow_bg.g + ', ' + glow_bg.b + ', ' + this.settings.shapes.glow_opacity + ');'

              html += '<div class="imp-spot-glow" style="' + glowStyle + '"></div>'
            }

            html += '</div>'
          } else {
            // Glow
            var glowHTML = ''
            if (isTrue(this.settings.shapes.glowing_shapes)) {
              var glowStyle = ''
              var glow_bg = hexToRgb(this.settings.shapes.glowing_shapes_color) || { r: 0, b: 0, g: 0 }

              glowStyle += 'box-shadow: 0 0 20px 15px rgba(' + glow_bg.r + ', ' + glow_bg.g + ', ' + glow_bg.b + ', ' + this.settings.shapes.glow_opacity + ');'
              glowStyle += 'border-radius: 50% 50%;'

              glowHTML += '<div class="imp-shape-glow" style="' + glowStyle + '"></div>'
            }

            html += '<div class="imp-shape ' + staticClass + ' imp-shape-spot" id="' + s.id + '" data-shape-title="' + s.title + '" data-index=' + i + '>' + glowHTML + '</div>'
          }
        }
        if (s.type === 'text') {
          html += '<div class="imp-shape ' + staticClass + ' imp-shape-text" id="' + s.id + '" data-shape-title="' + s.title + '" data-index=' + i + '>' + s.text.text + '</div>'
        }
        if (s.type === 'rect') {
          var glowHTML = ''
          if (isTrue(this.settings.shapes.glowing_shapes)) {
            var glowStyle = ''
            var glow_bg = hexToRgb(this.settings.shapes.glowing_shapes_color) || { r: 0, b: 0, g: 0 }

            glowStyle += 'box-shadow: 0 0 20px 15px rgba(' + glow_bg.r + ', ' + glow_bg.g + ', ' + glow_bg.b + ', ' + this.settings.shapes.glow_opacity + ');'
            glowStyle += 'border-radius: ' + s.default_style.border_radius + 'px;'

            glowHTML += '<div class="imp-shape-glow" style="' + glowStyle + '"></div>'
          }
          html += '<div class="imp-shape ' + staticClass + ' imp-shape-rect" id="' + s.id + '" data-shape-title="' + s.title + '" data-index=' + i + '>' + glowHTML + '</div>'
        }
        if (s.type === 'oval') {
          var glowHTML = ''
          if (isTrue(this.settings.shapes.glowing_shapes)) {
            var glowStyle = ''
            var glow_bg = hexToRgb(this.settings.shapes.glowing_shapes_color) || { r: 0, b: 0, g: 0 }

            glowStyle += 'box-shadow: 0 0 20px 15px rgba(' + glow_bg.r + ', ' + glow_bg.g + ', ' + glow_bg.b + ', ' + this.settings.shapes.glow_opacity + ');'
            glowStyle += 'border-radius: 50% 50%;'

            glowHTML += '<div class="imp-shape-glow" style="' + glowStyle + '"></div>'
          }
          html += '<div class="imp-shape ' + staticClass + ' imp-shape-oval" id="' + s.id + '" data-shape-title="' + s.title + '" data-index=' + i + '>' + glowHTML + '</div>'
        }
        if (s.type === 'poly') {
          if (s.points.length < 3) continue
          svgHtml += '<polygon class="imp-shape ' + staticClass + ' imp-shape-poly" data-index=' + i + ' id="' + s.id + '" data-shape-title="' + s.title + '" points="'

          var shapeWidthPx = imageMapWidth * (s.width / 100)
          var shapeHeightPx = imageMapHeight * (s.height / 100)

          s.vs = new Array()
          for (var j = 0; j < s.points.length; j++) {
            var x = (imageMapWidth * (s.x / 100)) + (s.points[j].x / 100) * (shapeWidthPx)
            var y = (imageMapHeight * (s.y / 100)) + (s.points[j].y / 100) * (shapeHeightPx)

            svgHtml += x + ',' + y + ' '

            // Cache an array of coordinates for later use in mouse events
            s.vs.push([x, y])
          }

          svgHtml += '"></polygon>'
        }
        if (s.type === 'path') {
          var shapeWidthPx = imageMapWidth * (s.width / 100)
          var shapeHeightPx = imageMapHeight * (s.height / 100)
          svgHtml += '<path class="imp-shape ' + staticClass + ' imp-shape-poly" data-index=' + i + ' id="' + s.id + '" data-shape-title="' + s.title + '" d="' + s.d + '"></path>'
        }
      }
      svgHtml += '</svg>'

      // Image backgrounds
      var imageBackgroundsHtml = ''

      for (var i = 0; i < this.settings.spots.length; i++) {
        // If layers are enabled and the shape does not belong to the currently active layer, then continue
        if (isTrue(this.settings.layers.enable_layers) && parseInt(this.settings.spots[i].layerID, 10) !== parseInt(this.settings.runtime.layerID)) {
          continue
        }

        var s = this.settings.spots[i]

        var imageBackgroundStyle = ''
        imageBackgroundStyle += 'left: ' + (s.x_image_background + s.default_style.background_image_offset_x) + '%;'
        imageBackgroundStyle += 'top: ' + (s.y_image_background + s.default_style.background_image_offset_y) + '%;'
        imageBackgroundStyle += 'width: ' + s.width_image_background + '%;'
        imageBackgroundStyle += 'height: ' + s.height_image_background + '%;'

        if (s.default_style.background_type === 'image' && s.default_style.background_image_url) {
          // imageBackgroundStyle += 'background-image: url(' + s.default_style.background_image_url + ');'
          imageBackgroundStyle += 'opacity: ' + s.default_style.background_image_opacity + ';'
          imageBackgroundStyle += 'transform: scale(' + s.default_style.background_image_scale + ');'
        }

        imageBackgroundsHtml += '<div class="imp-shape-background-image" style="' + imageBackgroundStyle + '" data-id="' + s.id + '"></div>'
      }

      this.shapeContainer.html(html + svgHtml)
      this.imageBackgroundsContainer.html(imageBackgroundsHtml)
    },
    generateShapeStyleClasses: function () {
      // delete any stylesheets, matching this image map id
      $('style#' + this.settings.id).remove()

      // create stylesheet
      var sheet = document.createElement('style')
      $(sheet).attr('id', this.settings.id)

      // generate classes for each shape
      var text = ''
      for (var i = 0; i < this.settings.spots.length; i++) {
        var s = this.settings.spots[i]

        // default style
        text += '#' + s.id + ' {'
        text += this.calcStyles(s.default_style, i)
        text += '}'

        // EXCEPTION - If the shape is a spot and is using an SVG icon
        if (s.type === 'spot' && $('#' + s.id).find('path').length > 0) {
          text += '#' + s.id + ' path {'
          text += 'fill: ' + s.default_style.icon_fill
          text += '}'
        }

        // EXCEPTION - If the shape has an image background
        if (s.default_style.background_type === 'image') {
          text += '#imp-image-backgrounds-container-' + this.settings.id + ' [data-id="' + s.id + '"] {'
          text += 'background-image: url(' + s.default_style.background_image_url + ');'
          text += 'opacity:' + s.default_style.background_image_opacity + ';'
          text += 'transform: scale(' + s.default_style.background_image_scale + ') translate(' + s.default_style.background_image_offset_x + 'px, ' + s.default_style.background_image_offset_y + 'px);'
          text += '}'
        }

        // mouseover style
        text += '.imp-shape-highlighted#' + s.id + ' {'
        text += this.calcStyles(s.mouseover_style, i)
        text += '}'

        // // EXCEPTION - If the shape is a spot and is using an SVG icon
        if (s.type === 'spot' && $('#' + s.id).find('path').length > 0) {
          text += '.imp-shape-highlighted#' + s.id + ' path {'
          text += 'fill: ' + s.mouseover_style.icon_fill
          text += '}'
        }
      }

      sheet.innerHTML = text

      // append sheet
      document.body.appendChild(sheet)
    },
    drawShapesMenu: function () {
      if (isTrue(this.settings.shapes_menu.enable_shapes_menu)) {
        // Delete existing menu and responsive button
        // For example if drawShapesMenu() has been called on window resize

        if (this.shapesMenuWrap) {
          this.shapesMenuWrap.remove()
        }
        if (this.shapesMenuResponsiveButton) {
          this.shapesMenuResponsiveButton.remove()
        }

        // Move the layers select menu back to its original position
        if ($('.imp-ui-layers-menu-wrap').length > 0) {
          $('.imp-ui-layers-menu-wrap').css({ right: 20 })
        }

        // Build menu HTML
        var html = ''

        var positionClass = 'imp-shapes-menu-wrap-left'
        if (this.settings.shapes_menu.menu_position === 'right') {
          positionClass = 'imp-shapes-menu-wrap-right'
        }

        var searchBoxPaddingClass = ''
        if (isTrue(this.settings.shapes_menu.enable_search)) {
          searchBoxPaddingClass = 'imp-shapes-menu-wrap-with-search-box'
        }

        html += '<div class="imp-shapes-menu-wrap ' + positionClass + ' ' + searchBoxPaddingClass + '">'

        // -- Add close button to search box for responsive menu
        var closeButton = ''
        if (this.responsiveShapesMenu) {
          closeButton = '<div data-imp-id="' + this.settings.id + '" class="imp-close-responsive-menu"><i class="fa fa-times" aria-hidden="true"></i></div>'
        }

        // -- Add search box
        if (isTrue(this.settings.shapes_menu.enable_search)) {
          html += '<div class="imp-shapes-menu-search-box">'
          html += '   <div class="imp-shapes-menu-search-box-input-wrap">'
          html += '       <input type="text" placeholder="Search..." data-image-map-pro-search-id="' + this.settings.id + '">'
          html += '       <i class="fa fa-search" aria-hidden="true"></i>'
          html += '       <i class="fa fa-times imp-clear-search" aria-hidden="true" data-image-map-pro-id="' + this.settings.id + '"></i>'
          html += '   </div>'
          html += closeButton
          html += '</div>'
        }

        // -- Inner scroll wrap
        html += '   <div class="imp-shapes-menu-scroll-wrap">'

        // -- Build shapes list
        if (isTrue(this.settings.shapes_menu.group_by_floor) && isTrue(this.settings.layers.enable_layers)) {
          for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
            var layer = this.settings.layers.layers_list[this.settings.layers.layers_list.length - i - 1]
            html += '<div class="imp-shapes-menu-layer-title" data-imp-content="' + layer.title + '">' + layer.title + '</div>'

            for (var j = 0; j < this.settings.spots.length; j++) {
              var shape = this.settings.spots[j]

              if (isTrue(this.settings.shapes_menu.hide_children_of_connected_shapes) && shape.connected_to != '') {
                continue
              }

              if (parseInt(shape.layerID, 10) === parseInt(layer.id, 10)) {
                html += '<div class="imp-shapes-menu-shape-title" data-imp-image-map-name="' + this.settings.general.name + '" data-imp-highlight-shape-on-mouseover="' + shape.title + '" data-imp-focus-shape-on-click="' + shape.title + '" data-imp-content="' + shape.title + '">' + shape.title + '</div>'
              }
            }
          }
        } else {
          for (var j = 0; j < this.settings.spots.length; j++) {
            var shape = this.settings.spots[this.settings.spots.length - j - 1]

            if (isTrue(this.settings.shapes_menu.hide_children_of_connected_shapes) && shape.connected_to != '') {
              continue
            }
            html += '<div class="imp-shapes-menu-shape-title" data-imp-image-map-name="' + this.settings.general.name + '" data-imp-highlight-shape-on-mouseover="' + shape.title + '" data-imp-focus-shape-on-click="' + shape.title + '" data-imp-content="' + shape.title + '">' + shape.title + '</div>'
          }
        }

        // -- Close Inner scroll wrap
        html += '   </div>'

        html += '</div>'

        // -- Append menu HTML
        if (!isTrue(this.settings.shapes_menu.detached_menu)) {
          // Menu is not detached
          // so we append it to the image map

          if (this.responsiveShapesMenu) {
            // Menu should be responsive
            // meaning it should be attached to a hidden container
            // and a Menu button should be added to the UI

            // Create a container
            // and attach the menu to it
            if (!this.responsiveShapesMenuWrap) {
              $('body').append('<div data-imp-id="' + this.settings.id + '" class="imp-responsive-menu"></div>')
              this.responsiveShapesMenuWrap = $('.imp-responsive-menu[data-imp-id="' + this.settings.id + '"]')
            }
            this.responsiveShapesMenuWrap.append(html)

            this.shapesMenuWrap = this.responsiveShapesMenuWrap.find('.imp-shapes-menu-wrap')

            // Add button to the UI
            var buttonHTML = ''
            buttonHTML += '<div data-imp-id="' + this.settings.id + '" class="imp-ui-element imp-shapes-menu-button">'
            buttonHTML += '<i class="fa fa-bars" aria-hidden="true"></i>'
            buttonHTML += '</div>'

            this.ui.append(buttonHTML)
            this.shapesMenuResponsiveButton = this.ui.find('.imp-shapes-menu-button')

            // Move the layers select menu to the left
            // to make space for the show/hide button
            if ($('.imp-ui-layers-menu-wrap').length > 0) {
              $('.imp-ui-layers-menu-wrap').css({ right: 70 })
            }

            // If we are in fullscreen mode
            // then remove the imp-shapes-menu-left/right classes
            $('#imp-fullscreen-wrap').find('.imp-fullscreen-root-wrap').removeClass('imp-shapes-menu-left')
            $('#imp-fullscreen-wrap').find('.imp-fullscreen-root-wrap').removeClass('imp-shapes-menu-right')
          } else {
            // Menu should NOT be responsive
            if (!isTrue(this.settings.runtime.is_fullscreen)) {
              // Not fullscreen
              // Wrap the main container and attach the menu next to it
              if (this.root.find('.imp-shapes-menu-outer-wrap').length === 0) {
                this.wrap.wrap('<div class="imp-shapes-menu-outer-wrap"></div>')
              }

              if (this.settings.shapes_menu.menu_position === 'left') {
                this.root.find('.imp-shapes-menu-outer-wrap').prepend(html)
              } else {
                this.root.find('.imp-shapes-menu-outer-wrap').append(html)
              }

              this.shapesMenuWrap = this.root.find('.imp-shapes-menu-wrap')

              // Set fixed height of the shapes menu
              // If search is enabled, shrink height
              if (isTrue(this.settings.shapes_menu.enable_search)) {
                this.shapesMenuWrap.height(this.wrap.height() - 73)
              } else {
                this.shapesMenuWrap.height(this.wrap.height())
              }
            } else {
              // Fullscreen
              // Append the menu in the fullscreen container
              $('#imp-fullscreen-wrap').find('.imp-shapes-menu-wrap').remove()
              $('#imp-fullscreen-wrap').append(html)

              if ($('#imp-fullscreen-wrap').find('.imp-fullscreen-root-wrap').length === 0) {
                this.root.wrap('<div class="imp-fullscreen-root-wrap"></div>')
              }

              this.shapesMenuWrap = $('#imp-fullscreen-wrap').find('.imp-shapes-menu-wrap')

              if (this.settings.shapes_menu.menu_position === 'left') {
                $('#imp-fullscreen-wrap').find('.imp-fullscreen-root-wrap').addClass('imp-shapes-menu-left')
              } else {
                $('#imp-fullscreen-wrap').find('.imp-fullscreen-root-wrap').addClass('imp-shapes-menu-right')
              }
            }
          }
        } else {
          // Menu is detached
          // so we append it to the designated container
          $('[data-imp-detached-menu="' + this.settings.id + '"]').html(html)
          this.shapesMenuWrap = $('[data-imp-detached-menu="' + this.settings.id + '"]').find('.imp-shapes-menu-wrap')
        }

        // Restore search string
        this.shapesMenuWrap.find('input[data-image-map-pro-search-id="' + this.settings.id + '"]').val(this.settings.runtime.menu_search_string)
        this.updateMenuSearch()

        // Restore scroll
        this.shapesMenuWrap.find('.imp-shapes-menu-scroll-wrap').scrollTop(this.settings.runtime.menu_scroll)
      }
    },
    addTooltips: function () {
      if (this.settings.tooltips.fullscreen_tooltips === 'always' || (this.settings.tooltips.fullscreen_tooltips === 'mobile-only' && isMobile())) {
        // Fullscreen tooltips
        if (!this.fullscreenTooltipsContainer) {
          $('.imp-fullscreen-tooltips-container[data-image-map-id="' + this.settings.id + '"]').remove()
          $('body').prepend('<div class="imp-fullscreen-tooltips-container" data-image-map-id="' + this.settings.id + '"></div>')
          this.fullscreenTooltipsContainer = $('.imp-fullscreen-tooltips-container[data-image-map-id="' + this.settings.id + '"]')
        }

        var html = ''

        for (var i = 0; i < this.settings.spots.length; i++) {
          var s = this.settings.spots[i]

          if (s.type === 'text') continue

          var style = ''
          var color_bg = hexToRgb(s.tooltip_style.background_color) || { r: 0, b: 0, g: 0 }

          style += 'padding: ' + s.tooltip_style.padding + 'px;'
          style += 'background: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + s.tooltip_style.background_opacity + ');'

          if (this.settings.tooltips.tooltip_animation === 'none') {
            style += 'opacity: 0;'
          }
          if (this.settings.tooltips.tooltip_animation === 'fade') {
            style += 'opacity: 0;'
            style += 'transition-property: opacity;-moz-transition-property: opacity;-webkit-transition-property: opacity;'
          }
          if (this.settings.tooltips.tooltip_animation === 'grow') {
            style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);'
            style += 'transition-property: transform;-moz-transition-property: -moz-transform;-webkit-transition-property: -webkit-transform;'
            style += 'transform-origin: 50% 50%;-moz-transform-origin: 50% 50%;-webkit-transform-origin: 50% 50%;'
          }

          html += '<div class="imp-fullscreen-tooltip" style="' + style + '" data-index="' + i + '">'
          html += '   <div class="imp-tooltip-close-button" data-index="' + i + '"><i class="fa fa-times" aria-hidden="true"></i></div>'

          if (s.tooltip_content.content_type === 'plain-text') {
            var style = ''
            style += 'color: ' + s.tooltip_content.plain_text_color + ';'

            html += '<div class="imp-tooltip-plain-text" style="' + style + '">' + s.tooltip_content.plain_text + '</div>'
          } else {
            if (s.tooltip_content.squares_json) {
              html += $.squaresRendererRenderObject(s.tooltip_content.squares_json)
            } else {
              html += $.squaresRendererRenderObject(s.tooltip_content.squares_settings)
            }
          }

          html += '</div>'
        }

        this.fullscreenTooltipsContainer.html(html)
      } else {
        // Regular tooltips
        var html = ''

        for (var i = 0; i < this.settings.spots.length; i++) {
          var s = this.settings.spots[i]

          if (s.type === 'text') continue

          var style = ''
          var color_bg = hexToRgb(s.tooltip_style.background_color) || { r: 0, b: 0, g: 0 }

          style += 'border-radius: ' + s.tooltip_style.border_radius + 'px;'
          style += 'padding: ' + s.tooltip_style.padding + 'px;'
          style += 'background: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + s.tooltip_style.background_opacity + ');'

          if (this.settings.tooltips.tooltip_animation === 'none') {
            style += 'opacity: 0;'
            style += 'transition-property: transform; -moz-transition-property: -moz-transform; -webkit-transition-property: -webkit-transform;'
          }
          if (this.settings.tooltips.tooltip_animation === 'fade') {
            style += 'opacity: 0;'
            style += 'transition-property: transform, opacity; -moz-transition-property: -moz-transform, opacity;-webkit-transition-property: -webkit-transform, opacity;'
          }
          if (this.settings.tooltips.tooltip_animation === 'grow') {
            style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);'
            style += 'transition-property: transform; -moz-transition-property: -moz-transform; -webkit-transition-property: -webkit-transform;'

            if (s.tooltip_style.position === 'top') {
              style += 'transform-origin: 50% 100%;-moz-transform-origin: 50% 100%;-webkit-transform-origin: 50% 100%;'
            }
            if (s.tooltip_style.position === 'bottom') {
              style += 'transform-origin: 50% 0%;-moz-transform-origin: 50% 0%;-webkit-transform-origin: 50% 0%;'
            }
            if (s.tooltip_style.position === 'left') {
              style += 'transform-origin: 100% 50%;-moz-transform-origin: 100% 50%;-webkit-transform-origin: 100% 50%;'
            }
            if (s.tooltip_style.position === 'right') {
              style += 'transform-origin: 0% 50%;-moz-transform-origin: 0% 50%;-webkit-transform-origin: 0% 50%;'
            }
          }

          html += '<div class="imp-tooltip" style="' + style + '" data-index="' + i + '">'

          if (s.tooltip_style.position === 'top') {
            html += '   <div class="hs-arrow hs-arrow-bottom" style="border-top-color: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>'
          }
          if (s.tooltip_style.position === 'bottom') {
            html += '   <div class="hs-arrow hs-arrow-top" style="border-bottom-color: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>'
          }
          if (s.tooltip_style.position === 'left') {
            html += '   <div class="hs-arrow hs-arrow-right" style="border-left-color: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>'
          }
          if (s.tooltip_style.position === 'right') {
            html += '   <div class="hs-arrow hs-arrow-left" style="border-right-color: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + s.tooltip_style.background_opacity + ');"></div>'
          }

          // Tooltip text/title style
          var style = ''
          style += 'color: ' + s.tooltip_content.plain_text_color + ';'

          // Tooltip title
          var titleJSON = {
            containers: [{
              id: 'sq-container-403761',
              settings: {
                elements: [{
                  settings: {
                    name: 'Paragraph',
                    iconClass: 'fa fa-paragraph'
                  },
                  'options': {
                    'text': {
                      'text': s.title
                    }
                  }
                }]
              }
            }]
          }
          html += '<div class="imp-tooltip-title" style="' + style + '">' + $.squaresRendererRenderObject(titleJSON) + '</div>'

          // Tooltip content
          if (s.tooltip_content.content_type === 'plain-text') {
            html += '<div class="imp-tooltip-plain-text" style="' + style + '">' + s.tooltip_content.plain_text + '</div>'
          } else {
            if (s.tooltip_content.squares_json) {
              html += $.squaresRendererRenderObject(s.tooltip_content.squares_json)
            } else {
              html += $.squaresRendererRenderObject(s.tooltip_content.squares_settings)
            }
          }

          html += '</div>'
        }

        // this.wrap.prepend(html);
        this.tooltipsContainer.prepend(html)
        // $('body').prepend(html);

        // Sticky tooltips class
        if (isTrue(this.settings.tooltips.sticky_tooltips)) {
          this.tooltipsContainer.addClass('imp-sticky-tooltips')
        }
      }
    },
    initFullscreen: function () {
      if (isTrue(this.settings.fullscreen.enable_fullscreen_mode)) {
        // Button style
        var style = ''
        style += 'background: ' + this.settings.fullscreen.fullscreen_button_color + '; '
        style += 'color: ' + this.settings.fullscreen.fullscreen_button_text_color + '; '

        // Button content
        var icon = '<i class="fa fa-arrows-alt" aria-hidden="true"></i>'
        if (isTrue(this.settings.runtime.is_fullscreen)) {
          icon = '<i class="fa fa-times" aria-hidden="true"></i>'
        }

        var text = 'Go Fullscreen'
        if (isTrue(this.settings.runtime.is_fullscreen)) {
          text = 'Close Fullscreen'
        }

        var buttonContent = ''
        if (this.settings.fullscreen.fullscreen_button_type === 'icon') {
          buttonContent += icon
        }
        if (this.settings.fullscreen.fullscreen_button_type === 'text') {
          buttonContent += text
        }
        if (this.settings.fullscreen.fullscreen_button_type === 'icon_and_text') {
          buttonContent += icon + ' ' + text
        }

        // Button classes
        var classes = ''
        if (this.settings.fullscreen.fullscreen_button_type === 'icon') {
          classes += 'imp-fullscreen-button-icon-only'
        }

        // Button html
        var html = ''
        html += '<div data-imp-id="' + this.settings.id + '" style="' + style + '" class="imp-ui-element ' + classes + ' imp-fullscreen-button imp-fullscreen-button-position-' + this.settings.fullscreen.fullscreen_button_position + '">'
        html += buttonContent
        html += '</div>'

        // Append
        this.ui.append(html)

        // Scroll to top
        if (isTrue(this.settings.runtime.is_fullscreen)) {
          $(window).scrollTop(0)
          fullscreenMap = this
        }

        // Correct the button's position
        var btn = this.ui.find('.imp-fullscreen-button')
        if (parseInt(this.settings.fullscreen.fullscreen_button_position, 10) === 1 || parseInt(this.settings.fullscreen.fullscreen_button_position, 10) === 4) {
          btn.css({ 'margin-left': -btn.outerWidth() / 2 })
        }

        // Start in fullscreen mode
        if (isTrue(this.settings.fullscreen.start_in_fullscreen_mode) && this.settings.runtime.is_fullscreen === 0) {
          this.settings.fullscreen.start_in_fullscreen_mode = 0
          this.toggleFullscreen()
        }
      }
    },
    initNavigator: function () {
      if (isTrue(this.settings.zooming.enable_zooming) && isTrue(this.settings.zooming.enable_navigator)) {
        this.uiNavigatorRoot = this.ui.find('.imp-ui-navigator-root')
        this.uiNavigatorImage = this.ui.find('.imp-ui-navigator-window-image')

        this.adjustNavigatorSize()
      }
    },
    initLayers: function () {
      // Is layers enabled?
      if (!isTrue(this.settings.layers.enable_layers)) return

      // If the layerID set in the runtime doesn't exist in the list of layers, then set the layerID to the first layer
      var exists = false
      for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
        if (parseInt(this.settings.layers.layers_list[i].id, 10) === parseInt(this.settings.runtime.layerID, 10)) {
          exists = true
        }
      }

      if (!exists) {
        this.settings.runtime.layerID = this.settings.layers.layers_list[0].id
      }

      // Set the value of the layers select
      this.wrap.find('.imp-ui-layers-select').val(this.settings.runtime.layerID)
    },
    initZoom: function () {
      if (isTrue(this.settings.zooming.enable_zooming)) {
        // Reset zoom variables
        this.zoom = 1
        this.targetZoom = 1
        this.targetPanX = 0
        this.actualPanX = 0
        this.targetPanY = 0
        this.actualPanY = 0
        this.initialPanX = 0
        this.initialPanY = 0
        this.panDeltaY = 0

        // Calculate max zoom level
        if (isTrue(this.settings.zooming.limit_max_zoom_to_image_size)) {
          this.maxZoomLevel = this.settings.general.naturalWidth / this.wrap.width()
        } else {
          this.maxZoomLevel = this.settings.zooming.max_zoom
        }
      }
    },
    adjustNavigatorSize: function () {
      if (!isTrue(this.settings.zooming.enable_zooming)) return
      if (!isTrue(this.settings.zooming.enable_navigator)) return

      if (isTrue(this.settings.runtime.is_fullscreen)) {
        // Calculate the ratio of the size of the navigator, compared to the actual size of the image
        this.navigatorRatio = this.uiNavigatorRoot.width() / this.settings.general.width

        // Calculate the size of the navigator window
        var imageRatio = this.settings.general.naturalWidth / this.settings.general.naturalHeight
        var windowRatio = window.innerWidth / window.innerHeight
        var navigatorImageWidth = 0
        var navigatorImageHeight = 0

        if (imageRatio < windowRatio) {
          if (imageRatio < 1) {
            navigatorImageWidth = 150 * imageRatio
            navigatorImageHeight = 150

            this.uiNavigatorWindowWidth = navigatorImageHeight * windowRatio
            this.uiNavigatorWindowHeight = navigatorImageHeight
            this.navigatorMarginX = navigatorImageWidth / 2 - this.uiNavigatorWindowWidth / 2
            this.navigatorMarginY = 0
          } else {
            navigatorImageWidth = 150
            navigatorImageHeight = 150 / imageRatio

            this.uiNavigatorWindowWidth = navigatorImageHeight * windowRatio
            this.uiNavigatorWindowHeight = navigatorImageHeight

            this.navigatorMarginX = navigatorImageWidth / 2 - this.uiNavigatorWindowWidth / 2
            this.navigatorMarginY = 0
          }
        } else {
          if (imageRatio < 1) {
            navigatorImageWidth = 150 * imageRatio
            navigatorImageHeight = 150

            this.uiNavigatorWindowWidth = navigatorImageWidth
            this.uiNavigatorWindowHeight = navigatorImageWidth / windowRatio

            this.navigatorMarginX = 0
            this.navigatorMarginY = navigatorImageHeight / 2 - this.uiNavigatorWindowHeight / 2
          } else {
            navigatorImageWidth = 150
            navigatorImageHeight = 150 / imageRatio

            this.uiNavigatorWindowWidth = navigatorImageWidth
            this.uiNavigatorWindowHeight = navigatorImageWidth / windowRatio

            this.navigatorMarginX = 0
            this.navigatorMarginY = navigatorImageHeight / 2 - this.uiNavigatorWindowHeight / 2
          }
        }
      } else {
        // Calculate the ratio of the size of the navigator, compared to the actual size of the image
        this.navigatorRatio = this.uiNavigatorRoot.width() / this.wrap.width()
        this.uiNavigatorWindowWidth = this.uiNavigatorRoot.width()
        this.uiNavigatorWindowHeight = this.uiNavigatorRoot.height()
      }
    },
    measureTooltipSize: function (i) {
      // Size needs to be calculated just before
      // the tooltip displays, and for the specific tooltip only.
      // No calculations needed if in fullscreen mode

      // 1. Does size need to be calculated?
      if (this.settings.tooltips.fullscreen_tooltips === 'always' || (this.settings.tooltips.fullscreen_tooltips === 'mobile-only' && isMobile())) return

      var s = this.settings.spots[i]
      var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')

      // 2. If the tooltip has manual width, set it
      if (!isTrue(s.tooltip_style.auto_width)) {
        t.css({
          width: s.tooltip_style.width
        })
      }

      // 3. Measure width/height
      var rect = t[0].getBoundingClientRect()

      t.data('imp-measured-width', t.outerWidth())
      t.data('imp-measured-height', t.outerHeight())

      // 4.
      // if (this.settings.tooltips.tooltip_animation === 'grow') return;

      // Set width
      // t.css({
      //     width: rect.width
      // });
    },
    animateShapesLoop: function () {
      if (this.settings.shapes.pageload_animation === 'none') return

      this.didAnimateShapesOnPageload = true

      var interval = 750 / this.settings.spots.length
      var shapesRandomOrderArray = shuffle(this.settings.spots.slice())

      for (var i = 0; i < shapesRandomOrderArray.length; i++) {
        this.animateShape(shapesRandomOrderArray[i], interval * i)
      }
    },
    animateShape: function (shape, delay) {
      var self = this
      var spotEl = this.root.find('#' + shape.id)
      var currentTime = 0

      function animate() {
        requestAnimationFrame(function () {
          currentTime += 0.01666
          var y = easeOutBounce(undefined, currentTime, -200, 200, 1)
          spotEl.css({
            transform: 'translateY(' + y + 'px)'
          })
          if (currentTime <= 1) {
            animate()
          }
        })
      }

      setTimeout(function () {
        if (self.settings.shapes.pageload_animation === 'fade') {
          spotEl.css({
            opacity: shape.default_style.opacity
          })
        }
        if (self.settings.shapes.pageload_animation === 'grow') {
          spotEl.css({
            transform: 'scale(1, 1)',
            '-moz-transform': 'scale(1, 1)',
            '-webkit-transform': 'scale(1, 1)'
          })
        }
        if (self.settings.shapes.pageload_animation === 'fall-down') {
          spotEl.css({
            opacity: shape.default_style.opacity
          })

          if (shape.type === 'spot') {
            var currentTime = 0
            spotEl.css({
              'transition-property': 'opacity'
            })

            animate()
          }
        }
      }, delay)
    },
    events: function () {
      var self = this

      // Mouse
      $(document).off('mousedown.' + this.settings.id)
      $(document).on('mousedown.' + this.settings.id, function (e) {
        if (touch) return
        self.handleEventStart(e)
      })
      $(document).off('mousemove.' + this.settings.id)
      $(document).on('mousemove.' + this.settings.id, function (e) {
        if (touch) return
        self.handleEventMove(e)
      })
      $(document).off('mouseup.' + this.settings.id)
      $(document).on('mouseup.' + this.settings.id, function (e) {
        if (touch) return
        self.handleEventEnd(e)
      })

      // Touch
      $(document).off('touchstart.' + this.settings.id)
      $(document).on('touchstart.' + this.settings.id, function (e) {
        self.handleEventStart(e)
      })
      $(document).off('touchmove.' + this.settings.id)
      $(document).on('touchmove.' + this.settings.id, function (e) {
        self.handleEventMove(e)

        if (self.panning && self.panDeltaY != 0) return false
        if (self.pinching) return false
      })
      $(document).off('touchend.' + this.settings.id)
      $(document).on('touchend.' + this.settings.id, function (e) {
        self.handleEventEnd(e)
      })

      // Scroll
      this.wrap.off('mousewheel')
      this.wrap.on('mousewheel', function (e) {
        if (touch) return

        // Zooming enabled?
        if (isTrue(self.settings.zooming.enable_zooming)) {
          // Hold CTRL to zoom?
          if (isTrue(self.settings.zooming.hold_ctrl_to_zoom)) {
            // Holding CTRL?
            if ((self.mac && self.cmdKeyDown) || (!self.mac && self.ctrlKeyDown)) {
              // Perform zoom
              self.handleEventEnd(e)
              return false
            } else {
              self.displayScrollMessage()
              return true
            }
          } else {
            // Perform zoom
            self.handleEventEnd(e)

            // Interrupt scrolling if image map can be zoomed in/out further, depending on scroll direction
            if ((e.deltaY < 0 && self.targetZoom > 1) || (e.deltaY > 0 && self.targetZoom < self.maxZoomLevel)) {
              return false
            }
          }
        }
      })

      // Keys
      $(document).off('keydown.' + this.settings.id)
      $(document).on('keydown.' + this.settings.id, function (e) {
        self.handleKeyDownEvent(e)
      })
      $(document).off('keyup.' + this.settings.id)
      $(document).on('keyup.' + this.settings.id, function (e) {
        self.handleKeyUpEvent(e)
      })

      // Tooltips close button
      $(document).off('click.' + this.settings.id, '.imp-tooltip-close-button')
      $(document).on('click.' + this.settings.id, '.imp-tooltip-close-button', function () {
        self.hideAllTooltips()
      })

      // Layers select
      $(document).off('change.' + this.settings.id, '.imp-ui-layers-select')
      $(document).on('change.' + this.settings.id, '.imp-ui-layers-select', function () {
        var newID = self.wrap.find('.imp-ui-layers-select').val()
        self.switchLayer(newID)
      })

      // Menu search
      $(document).off('keyup.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]')
      $(document).on('keyup.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]', function (e) {
        self.updateMenuSearch()
      })
      $(document).off('change.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]')
      $(document).on('change.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]', function (e) {
        self.updateMenuSearch()
      })

      // Resize
      $(window).off('resize.' + this.settings.general.id + this.settings.runtime.is_fullscreen)
      $(window).on('resize.' + this.settings.general.id + this.settings.runtime.is_fullscreen, function () {
        // Store new wrap width/height
        // after the window has been resized
        self.wrapWidth = self.wrap.width()
        self.wrapHeight = self.wrap.height()
        self.wrapOffsetLeft = self.wrap.offset().left
        self.wrapOffsetTop = self.wrap.offset().top

        // If there is an open tooltip,
        // update its position
        if (self.openedTooltips.length > 0) {
          for (var i = 0; i < self.openedTooltips.length; i++) {
            self.updateTooltipPosition(self.openedTooltips[i])
          }
        }

        // Zoom out and reset pan
        self.resetZoomAndPan()

        // Reset navigator
        self.adjustNavigatorSize()

        // Is there a shapes menu?
        if (isTrue(self.settings.shapes_menu.enable_shapes_menu)) {
          // Responsive shapes menu?
          var currentlyResponsive = self.responsiveShapesMenu // Used for comparison below
          var rootWidth = self.root.width()
          if (self.settings.runtime.is_fullscreen) {
            rootWidth = $(window).width()
          }

          if (isMobile() || rootWidth / 3 < 240) {
            self.responsiveShapesMenu = true
          } else {
            self.responsiveShapesMenu = false
          }

          // If self.responsiveShapesMenu changes
          // then redraw the menu
          if (currentlyResponsive != self.responsiveShapesMenu) {
            self.drawShapesMenu()
          }

          // If the menu is not detached
          // and the image map is not in fullscreen mode
          // then set the height of the menu to be equal to the height of the image map
          if (isTrue(self.settings.shapes_menu.enable_shapes_menu) && !isTrue(self.settings.shapes_menu.detached_menu) && !self.settings.runtime.is_fullscreen && !self.responsiveShapesMenu) {
            if (isTrue(self.settings.shapes_menu.enable_search)) {
              // Make the shapes menu slightly shorter if there is a search bar
              self.shapesMenuWrap.height(self.wrap.height() - 73)
            } else {
              self.shapesMenuWrap.height(self.wrap.height())
            }
          }
        }

        // If fullscreen,
        // recalculate image map size
        if (fullscreenMap) {
          fullscreenMap.adjustSize()
        }

        // If there is no image URL,
        // manually set the width/height
        if (self.settings.image.url === '') {
          // There is no image
          // Fix the width and height
          if (isTrue(self.settings.general.responsive)) {
            self.wrap.css({
              'width': '100%',
              'height': self.settings.general.height,
              'max-width': self.settings.general.width,
              'max-height': self.settings.general.height
            })
            self.wrap.css({
              'height': self.wrap.width() * (self.settings.general.height / self.settings.general.width)
            })
          } else {
            self.wrap.css({
              'width': self.settings.general.width,
              'height': self.settings.general.height
            })
          }
        }
      })
    },
    disableEvents: function () {
      // Mouse
      $(document).off('mousedown.' + this.settings.id)
      $(document).off('mousemove.' + this.settings.id)
      $(document).off('mouseup.' + this.settings.id)

      // Touch
      $(document).off('touchstart.' + this.settings.id)
      $(document).off('touchmove.' + this.settings.id)
      $(document).off('touchend.' + this.settings.id)

      // Scroll
      this.wrap.off('mousewheel')

      // Keys
      $(document).off('keydown.' + this.settings.id)
      $(document).off('keyup.' + this.settings.id)

      // Tooltips close button
      $(document).off('click.' + this.settings.id, '.imp-tooltip-close-button')

      // Layers select
      $(document).off('change.' + this.settings.id, '.imp-ui-layers-select')

      // Menu search
      $(document).off('keyup.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]')
      $(document).off('change.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]')

      // Resize
      $(window).off('resize.' + this.settings.general.id + this.settings.runtime.is_fullscreen)

      // return
      // $(document).off('mousedown.' + this.settings.id)
      // $(document).off('mousemove.' + this.settings.id)
      // $(document).off('mouseup.' + this.settings.id)

      // // Touch
      // $(document).off('touchstart.' + this.settings.id)
      // $(document).off('touchmove.' + this.settings.id)
      // $(document).off('touchend.' + this.settings.id)

      // // Scroll
      // this.wrap.off('mousewheel')

      // // Tooltips close button
      // $(document).off('click.' + this.settings.id, '.imp-tooltip-close-button')

      // // Layers select
      // $(document).off('change.' + this.settings.id, '.imp-ui-layers-select')

      // // Menu search
      // $(document).off('keyup.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]')
      // $(document).off('change.' + this.settings.id, '[data-image-map-pro-search-id="' + this.settings.id + '"]')
    },
    isEventOnHTMLAPIElement: function (e) {
      if ($(e.target).data('imp-highlight-shape-on-mouseover')) return true
      if ($(e.target).data('imp-highlight-shape-on-click')) return true
      if ($(e.target).data('imp-unhighlight-shape-on-mouseover')) return true
      if ($(e.target).data('imp-unhighlight-shape-on-click')) return true

      if ($(e.target).data('imp-open-tooltip-on-mouseover')) return true
      if ($(e.target).data('imp-open-tooltip-on-click')) return true
      if ($(e.target).data('imp-close-tooltip-on-mouseover')) return true
      if ($(e.target).data('imp-close-tooltip-on-click')) return true

      if ($(e.target).data('imp-trigger-shape-on-mouseover')) return true
      if ($(e.target).data('imp-trigger-shape-on-click')) return true
      if ($(e.target).data('imp-untrigger-shape-on-mouseover')) return true
      if ($(e.target).data('imp-untrigger-shape-on-click')) return true

      if ($(e.target).data('imp-focus-shape-on-click')) return true
      if ($(e.target).data('imp-focus-shape-on-mouseover')) return true

      return false
    },
    handleEventStart: function (e) {
      // Reset redrawable values
      this.targetZoom = this.zoom
      this.targetPanX = this.actualPanX
      this.targetPanY = this.actualPanY

      var p = this.getEventCoordinates(e)

      // Is the event on an HTML API element?
      if (this.isEventOnHTMLAPIElement(e)) return

      // Is zooming enabled?
      if (isTrue(this.settings.zooming.enable_zooming)) {
        // Pan on navigator
        if ($(e.target).closest('.imp-ui-navigator-root').length > 0 && $(e.target).closest('.imp-ui-navigator-root').data('imp-id') === parseInt(this.settings.id)) {
          this.ix = p.x
          this.iy = p.y

          this.panningOnNavigator = true
          return
        }

        // Pinch
        if (e.originalEvent.touches && e.originalEvent.touches.length > 1) {
          this.pinchInitial[0] = { x: e.originalEvent.touches[0].pageX, y: e.originalEvent.touches[0].pageY }
          this.pinchInitial[1] = { x: e.originalEvent.touches[1].pageX, y: e.originalEvent.touches[1].pageY }

          this.initialPanX = this.actualPanX
          this.initialPanY = this.actualPanY

          this.ix = (e.originalEvent.touches[0].pageX + e.originalEvent.touches[1].pageX) / 2
          this.iy = (e.originalEvent.touches[0].pageY + e.originalEvent.touches[1].pageY) / 2

          this.lastX = this.ix
          this.lastY = this.iy

          this.pinchInitialDistance = Math.sqrt(Math.pow(this.pinchInitial[1].x - this.pinchInitial[0].x, 2) + Math.pow(this.pinchInitial[1].y - this.pinchInitial[0].y, 2))
          this.pinchInitialZoom = this.zoom

          this.pinching = true
          return
        }

        // Pan
        if (!this.panning &&
          $(e.target).closest('.imp-ui').length === 0 &&
          (p.x > this.wrapOffsetLeft && p.x < this.wrapOffsetLeft + this.wrapWidth && p.y > this.wrapOffsetTop && p.y < this.wrapOffsetTop + this.wrapHeight)) {
          this.ix = p.x
          this.iy = p.y

          this.initialPanX = this.actualPanX
          this.initialPanY = this.actualPanY

          this.panning = true
        }
      }
    },
    handleEventMove: function (e) {
      // Periodically recalculate wrap dimensions and offset
      if (Date.now() - this.lastWrapRecalc > 1000) {
        this.lastWrapRecalc = Date.now()

        this.wrapWidth = this.wrap.width()
        this.wrapHeight = this.wrap.height()
        this.wrapOffsetLeft = this.wrap.offset().left
        this.wrapOffsetTop = this.wrap.offset().top
      }

      // If there is a visible fullscreen tooltip, return
      if (this.fullscreenTooltipVisible) return

      // Get event data
      var i = parseInt(this.matchShapeToEvent(e))
      var p = this.getEventCoordinates(e)

      // If there is a tooltip under the event, and sticky tooltips are turned off, then return
      var insideTooltip = false
      if (this.isPointInsideVisibleTooltip(e) && !isTrue(this.settings.tooltips.sticky_tooltips)) {
        insideTooltip = true
        return
      }

      // Is event outside the wrap?
      // AND there is no visible tooltip
      var outsideWrap = false
      if (p.x < this.wrapOffsetLeft ||
        p.x > this.wrapOffsetLeft + this.wrapWidth ||
        p.y < this.wrapOffsetTop ||
        p.y > this.wrapOffsetTop + this.wrapHeight) {
        outsideWrap = true
      }

      if (!insideTooltip && outsideWrap) {
        this.hideAllTooltips()
        return
      }

      // Is zooming enabled?
      if (isTrue(this.settings.zooming.enable_zooming)) {
        // Pan on navigator
        if (this.panningOnNavigator) {
          var x = (p.x - this.uiNavigatorRoot.offset().left) / this.navigatorRatio * this.targetZoom
          var y = (p.y - this.uiNavigatorRoot.offset().top) / this.navigatorRatio * this.targetZoom

          this.panTo(x, y)
        }

        // Pinch
        if (this.pinching) {
          this.pinch(e)
          this.didPan = true
          return
        }

        // Pan
        if (this.panning) {
          var p = this.getEventCoordinates(e)
          this.pan(p.x, p.y)
          this.didPan = true
          return
        }
      }

      // If the mouse is over a UI element, then return
      if ($(e.target).closest('.imp-ui').length === 1) {
        this.unhighlightAllShapes()
        if (this.settings.tooltips.show_tooltips === 'mouseover') {
          this.hideAllTooltips()
        }
        return
      }

      // There is a shape under the event
      // And the image map is in fullscreen mode
      if (i !== -1) {
        // Disable glow
        if (isTrue(this.settings.shapes.glowing_shapes) && isTrue(this.settings.shapes.stop_glowing_on_mouseover)) {
          this.wrap.addClass('imp-no-glow')
        }

        if (!this.didPan) {
          // If the shape is not highlighted,
          // then highlight it, hide any visible tooltip and unhighlight all other shapes
          if (!this.isShapeHighlighted(i)) {
            this.unhighlightAllShapes()
            if (this.settings.tooltips.show_tooltips === 'mouseover') {
              this.hideAllTooltips()
            }
            if (isTrue(this.settings.tooltips.show_title_on_mouseover) && this.settings.tooltips.show_tooltips === 'click') {
              this.hideAllTitles()
            }
            this.highlightShape(i, true)
          }

          // Tooltip functionality
          if (isTrue(this.settings.tooltips.enable_tooltips)) {
            // If tooltips are set to show on mouseover, show the tooltip for the shape under the event
            if (this.settings.tooltips.show_tooltips === 'mouseover' && isTrue(this.settings.spots[i].tooltip.enable_tooltip)) {
              this.showTooltip(i)
            }

            // If tooltips are set to show on click and tooltip titles are set to appear on mouseover, show the tooltip and the title
            if (this.settings.tooltips.show_tooltips === 'click' && isTrue(this.settings.tooltips.show_title_on_mouseover) && isTrue(this.settings.spots[i].tooltip.enable_tooltip)) {
              this.showTooltipTitle(i)
            }

            // If there is a visible tooltip and sticky tooltips is on, then update the position of the last opened tooltip
            if (this.openedTooltips.length > 0 && isTrue(this.settings.tooltips.sticky_tooltips)) {
              // Tooltips must be set to show on mouseover
              if (this.settings.tooltips.show_tooltips === 'mouseover') {
                this.updateTooltipPosition(this.openedTooltips[this.openedTooltips.length - 1], e)
              }
            }

            // If tooltip titles are turned on and the tooltip of the shape under the mouse is not open, reposition the tooltip of the shape under the mouse
            if (isTrue(this.settings.tooltips.show_title_on_mouseover) && this.settings.tooltips.show_tooltips === 'click' && this.openedTooltips.indexOf(i) === -1) {
              this.updateTooltipPosition(i, e)
            }
          }
        }
      }

      // Don't hide tooltip on video click (fullscreen)
      if ($(e.target).is('video') || $(e.target).closest('video').length > 0) {
        return
      }

      // There is no shape under the event
      // OR the image map is not in fullscreen mode
      if (i === -1) {
        // Unhighlight all shapes and hide any visible tooltip
        this.unhighlightAllShapes()

        // Hide all titles if there is no shape under the mouse and titles are turned on
        if (isTrue(this.settings.tooltips.show_title_on_mouseover) && this.settings.tooltips.show_tooltips === 'click') {
          this.hideAllTitles()
        }

        // Hide all tooltips if there is no shape under the mouse and tooltips appear on mouseover, or title appears on mouseover
        if (this.settings.tooltips.show_tooltips === 'mouseover' && this.openedTooltips.length > 0) {
          this.hideAllTooltips()
        }
      }
    },
    handleEventEnd: function (e) {
      // Is the event on an HTML API element?
      if (this.isEventOnHTMLAPIElement(e)) return

      // Is zooming enabled?
      if (isTrue(this.settings.zooming.enable_zooming)) {
        // Panning
        if (this.panning) {
          this.panning = false
          this.tooltipsContainer.removeClass('imp-no-transition')
        }

        // Pinching
        if (this.pinching) {
          this.pinching = false
        }

        // Zooming
        if (e.type === 'mousewheel') {
          this.hideAllTooltips()
          this.unhighlightAllShapes()

          if (e.deltaY > 0) {
            this.zoomIn(e)
          }
          if (e.deltaY < 0) {
            this.zoomOut(e)
          }
          return
        }

        // Navigator click
        if (this.panningOnNavigator && $(e.target).closest('.imp-ui-navigator-root').length > 0 && parseInt($(e.target).closest('.imp-ui-navigator-root').data('imp-id')) === parseInt(this.settings.id)) {
          this.panningOnNavigator = false

          var p = this.getEventCoordinates(e)

          var x = (p.x - this.uiNavigatorRoot.offset().left) / this.navigatorRatio * this.targetZoom
          var y = (p.y - this.uiNavigatorRoot.offset().top) / this.navigatorRatio * this.targetZoom

          this.panTo(x, y)
          return
        }

        // Navigator pan
        if (this.panningOnNavigator) {
          this.panningOnNavigator = false
        }

        // Zoom button click
        if ($(e.target).closest('.imp-ui-zoom-button').length > 0 && parseInt($(e.target).closest('.imp-ui-zoom-button').data('imp-id')) === parseInt(this.settings.id)) {
          if ($(e.target).closest('.imp-ui-zoom-button-zoom-in').length > 0) {
            this.zoomIn()
          } else {
            this.zoomOut()
          }

          return
        }
      }
      // Fullscreen button click
      if ($(e.target).closest('.imp-fullscreen-button').length > 0) {
        if (parseInt($(e.target).closest('.imp-fullscreen-button').data('imp-id')) === parseInt(this.settings.id)) {
          this.toggleFullscreen()
        }
      }

      // Shapes menu show button click
      if ($(e.target).closest('.imp-shapes-menu-button').length > 0) {
        if (parseInt($(e.target).closest('.imp-shapes-menu-button').data('imp-id')) === parseInt(this.settings.id)) {
          this.showResponsiveShapesMenu()
        }
      }

      // Shapes menu hide button click
      if ($(e.target).closest('.imp-close-responsive-menu').length > 0) {
        if (parseInt($(e.target).closest('.imp-close-responsive-menu').data('imp-id')) === parseInt(this.settings.id)) {
          this.hideResponsiveShapesMenu()
        }
      }

      // Layers switch click
      if ($(e.target).closest('.imp-ui-layer-switch-up').length > 0 && parseInt($(e.target).closest('.imp-ui-layer-switch-up').data('imp-id')) === parseInt(this.settings.id)) {
        for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
          if (parseInt(this.settings.layers.layers_list[i].id, 10) === parseInt(this.settings.runtime.layerID, 10) && i > 0) {
            var newLayerID = this.settings.layers.layers_list[i - 1].id
            this.switchLayer(newLayerID)
            break
          }
        }
      }
      if ($(e.target).closest('.imp-ui-layer-switch-down').length > 0 && parseInt($(e.target).closest('.imp-ui-layer-switch-down').data('imp-id')) === parseInt(this.settings.id)) {
        for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
          if (parseInt(this.settings.layers.layers_list[i].id, 10) === parseInt(this.settings.runtime.layerID, 10) && i < this.settings.layers.layers_list.length - 1) {
            var newLayerID = this.settings.layers.layers_list[i + 1].id
            this.switchLayer(newLayerID)
            break
          }
        }
      }

      // Clear search
      if ($(e.target).hasClass('imp-clear-search') && $(e.target).data('image-map-pro-id') === parseInt(this.settings.id)) {
        $('input[data-image-map-pro-search-id="' + this.settings.id + '"]').val('')
        this.updateMenuSearch()
      }

      // Did the user click on a tooltip?
      if ($(e.target).closest('.imp-tooltip').length != 0) {
        return
      }

      // If there is a visible fullscreen tooltip, return
      if (this.fullscreenTooltipVisible) return

      // If the mouse is over a UI element, then return
      if ($(e.target).closest('.imp-ui').length === 1) {
        this.unhighlightAllShapes()
        if (this.settings.tooltips.show_tooltips === 'mouseover') {
          this.hideAllTooltips()
        }
        return
      }

      // Get event data
      var c = this.getEventRelativeCoordinates(e)
      var i = this.matchShapeToEvent(e)
      var p = this.getEventCoordinates(e)

      // There is a shape under the event
      // And the event is inside the wrap OR the image map is in fullscreen mode
      if (i != -1 &&
        ((p.x > this.wrapOffsetLeft && p.x < this.wrapOffsetLeft + this.wrapWidth && p.y > this.wrapOffsetTop && p.y < this.wrapOffsetTop + this.wrapHeight) || this.settings.runtime.is_fullscreen)
      ) {
        if (!this.didPan) {
          // If the shape is not highlighted,
          // then highlight it, hide any visible tooltip and unhighlight all other shapes
          if (!this.isShapeHighlighted(i)) {
            this.unhighlightAllShapes()
            if (this.settings.tooltips.show_tooltips === 'mouseover') {
              this.hideAllTooltips()
            }

            this.highlightShape(i, true)
          }

          // Show the tooltip for the shape under the event
          if (isTrue(this.settings.tooltips.enable_tooltips) && isTrue(this.settings.spots[i].tooltip.enable_tooltip)) {
            this.showTooltip(i)
          }

          // If there is a visible tooltip and sticky tooltips is on, then update the position of the last opened tooltip
          if (this.openedTooltips.length > 0 && isTrue(this.settings.tooltips.sticky_tooltips)) {
            // Tooltips must be set to show on mouseover
            if (this.settings.tooltips.show_tooltips === 'mouseover') {
              this.updateTooltipPosition(this.openedTooltips[this.openedTooltips.length - 1], e)
            }
          }

          // If zooming is enabled, focus shape
          if (isTrue(this.settings.zooming.enable_zooming) && isTrue(this.settings.zooming.focus_shape_on_click)) {
            this.focusShape(i)
          }
        }

        // Do click action for the shape
        this.performClickAction(i)
      }

      // There is no shape under the event
      // OR (the event is outside the wrap AND not in fullscreen mode)
      if (i === -1 ||
        ((p.x < this.wrapOffsetLeft || p.x > this.wrapOffsetLeft + this.wrapWidth || p.y < this.wrapOffsetTop || p.y > this.wrapOffsetTop + this.wrapHeight) && !this.settings.runtime.is_fullscreen)
      ) {
        // Hide any visible tooltips
        this.hideAllTooltips()

        if (!this.didPan) {
          this.unhighlightAllShapes()
        }
      }

      if (e.originalEvent.touches && e.originalEvent.touches.length === 0) {
        this.didPan = false
      }
      if (!e.originalEvent.touches) {
        this.didPan = false
      }
    },
    handleKeyDownEvent: function (e) {
      if (e.ctrlKey) {
        this.ctrlKeyDown = true
      }
      if (e.metaKey) {
        this.cmdKeyDown = true
      }
    },
    handleKeyUpEvent: function (e) {
      this.ctrlKeyDown = false
      this.cmdKeyDown = false
    },
    getEventRelativeCoordinates: function (e) {
      var x, y

      if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
        x = touch.pageX
        y = touch.pageY
      } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
        x = e.pageX
        y = e.pageY
      }

      // Make coordinates relative to the container
      x -= this.zoomWrap.offset().left
      y -= this.zoomWrap.offset().top

      // Convert coordinates to %
      x = (x / (this.wrap.width() * this.zoom)) * 100
      y = (y / (this.wrap.height() * this.zoom)) * 100

      return { x: x, y: y }
    },
    getEventCoordinates: function (e) {
      var x, y

      if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
        x = touch.pageX
        y = touch.pageY
      } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
        x = e.pageX
        y = e.pageY
      }

      return { x: x, y: y }
    },
    matchShapeToCoords: function (c) {
      for (var i = this.settings.spots.length - 1; i >= 0; i--) {
        // If layers are enabled and the shape does not belong to the currently active layer, then continue
        if (isTrue(this.settings.layers.enable_layers) && parseInt(this.settings.spots[i].layerID, 10) !== parseInt(this.settings.runtime.layerID, 10)) {
          continue
        }

        var s = this.settings.spots[i]

        if (isTrue(s.static)) continue

        if (s.type === 'poly' || s.type === 'path') {
          var x = (c.x / 100) * this.zoomWrap.width()
          var y = (c.y / 100) * this.zoomWrap.height()

          x = (x * this.settings.general.naturalWidth) / this.zoomWrap.width()
          y = (y * this.settings.general.naturalHeight) / this.zoomWrap.height()

          if (isPointInsidePolygon(x, y, s.vs)) {
            return i
            break
          }
        }

        if (s.type === 'spot') {
          var shapeWidth = (s.width < 44) ? 44 : s.width
          var shapeHeight = (s.height < 44) ? 44 : s.height

          shapeWidth /= this.zoom
          shapeHeight /= this.zoom

          var x = (c.x / 100) * this.wrap.width()
          var y = (c.y / 100) * this.wrap.height()
          var rx = (s.x / 100) * this.wrap.width() - shapeWidth / 2
          var ry = (s.y / 100) * this.wrap.height() - shapeHeight / 2
          var rw = shapeWidth
          var rh = shapeHeight

          if (isTrue(s.default_style.icon_is_pin) && isTrue(s.default_style.use_icon)) {
            ry -= shapeHeight / 2

            if (s.height < 44) {
              ry += s.height / 2
            }
          }

          if (isPointInsideRect(x, y, rx, ry, rw, rh)) {
            return i
            break
          }
        }

        if (s.type === 'rect') {
          if (isPointInsideRect(c.x, c.y, s.x, s.y, s.width, s.height)) {
            return i
            break
          }
        }

        if (s.type === 'oval') {
          var x = c.x
          var y = c.y
          var ex = s.x + s.width / 2
          var ey = s.y + s.height / 2
          var rx = s.width / 2
          var ry = s.height / 2

          if (isPointInsideEllipse(x, y, ex, ey, rx, ry)) {
            return i
            break
          }
        }

        if (s.type === 'text') continue
      }

      return -1
    },
    matchShapeToEvent: function (e) {
      if ($(e.target).hasClass('imp-shape') || $(e.target).closest('.imp-shape').length > 0) {
        return $(e.target).data('index') || $(e.target).closest('.imp-shape').data('index')
      } else {
        return -1
      }
    },
    isPointInsideVisibleTooltip: function (e) {
      for (var i = 0; i < this.openedTooltips.length; i++) {
        var p = this.getEventCoordinates(e)
        var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + this.openedTooltips[i] + '"]')
        var index = this.openedTooltips[i]

        p.x = ((p.x - this.wrap.offset().left) / this.wrap.width()) * 100
        p.y = ((p.y - this.wrap.offset().top) / this.wrap.height()) * 100

        var buffer = 0
        if (this.settings.spots[index].type === 'spot') {
          buffer = this.settings.spots[index].tooltip_style.buffer
        } else {
          buffer = this.settings.spots[index].tooltip_style.buffer * this.zoom
        }

        var tw = t.outerWidth()
        var th = t.outerHeight()
        var tx = t.offset().left - this.wrap.offset().left
        var ty = t.offset().top - this.wrap.offset().top

        // Convert tooltip x/y/w/h from px to %
        tx = (tx / this.wrap.width()) * 100
        ty = (ty / this.wrap.height()) * 100
        tw = (tw / this.wrap.width()) * 100
        th = (th / this.wrap.height()) * 100

        // Create a polygon, representing the buffer space
        var poly = []

        if (this.settings.spots[index].tooltip_style.position === 'left') {
          // Convert buffer from px to %
          buffer = (buffer / this.wrap.width()) * 100

          var poly = [
            [tx, ty],
            [tx + tw, ty],
            [tx + tw + buffer, ty + th - th / 3 - th / 3],
            [tx + tw + buffer, ty + th - th / 3],
            [tx + tw, ty + th],
            [tx, ty + th]
          ]
        }
        if (this.settings.spots[index].tooltip_style.position === 'right') {
          // Convert buffer from px to %
          buffer = (buffer / this.wrap.width()) * 100

          var poly = [
            [tx, ty],
            [tx + tw, ty],
            [tx + tw, ty + th],
            [tx, ty + th],
            [tx - buffer, ty + th - th / 3],
            [tx - buffer, ty + th - th / 3 - th / 3]
          ]
        }
        if (this.settings.spots[index].tooltip_style.position === 'top') {
          // Convert buffer from px to %
          buffer = (buffer / this.wrap.height()) * 100

          var poly = [
            [tx, ty],
            [tx + tw, ty],
            [tx + tw, ty + th],
            [tx + tw - tw / 3, ty + th + buffer],
            [tx + tw - tw / 3 - tw / 3, ty + th + buffer],
            [tx, ty + th]
          ]
        }
        if (this.settings.spots[index].tooltip_style.position === 'bottom') {
          // Convert buffer from px to %
          buffer = (buffer / this.wrap.height()) * 100

          var poly = [
            [tx, ty],
            [tx + tw - tw / 3 - tw / 3, ty - buffer],
            [tx + tw - tw / 3, ty - buffer],
            [tx + tw, ty],
            [tx + tw, ty + th],
            [tx, ty + th]
          ]
        }

        if (isPointInsidePolygon(p.x, p.y, poly)) {
          return true
        }

        return false
      }
    },
    getIndexOfShapeWithID: function (id) {
      for (var i = 0; i < this.settings.spots.length; i++) {
        if (this.settings.spots[i].id === id) return i
      }
    },
    calcStyles: function (styles, i) {
      // The shape object
      var s = this.settings.spots[i]

      // The computed styles
      var style = ''

      // The shape is a Spot
      if (s.type === 'spot') {
        style += 'left: ' + s.x + '%;'
        style += 'top: ' + s.y + '%;'
        style += 'width: ' + s.width + 'px;'
        style += 'height: ' + s.height + 'px;'

        if (!this.didAnimateShapesOnPageload) {
          if (this.settings.shapes.pageload_animation === 'fall-down') {
            style += 'opacity: 0;'
            style += 'transform: translateY(-500px);'
          } else if (this.settings.shapes.pageload_animation === 'grow') {
            style += 'opacity: ' + styles.opacity + ';'
            style += 'transform: scale(0);'
          } else if (this.settings.shapes.pageload_animation === 'fade') {
            style += 'opacity: 0;'
            style += 'transform: scale(' + (1 / this.zoom) + ');'
          } else {
            style += 'opacity: ' + styles.opacity + ';'
            style += 'transform: scale(' + (1 / this.zoom) + ');'
          }
        }

        var marginTop = -s.width / 2
        var marginLeft = -s.height / 2

        // The spot is not an icon
        if (!isTrue(s.default_style.use_icon)) {
          var color_bg = hexToRgb(styles.background_color) || { r: 0, b: 0, g: 0 }
          var color_border = hexToRgb(styles.border_color) || { r: 0, b: 0, g: 0 }

          style += 'border-radius: ' + styles.border_radius + 'px;'
          style += 'background: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + styles.background_opacity + ');'
          style += 'border-width: ' + styles.border_width + 'px;'
          style += 'border-style: ' + styles.border_style + ';'
          style += 'border-color: rgba(' + color_border.r + ', ' + color_border.g + ', ' + color_border.b + ', ' + styles.border_opacity + ');'
        }
        // The spot is an icon
        if (isTrue(s.default_style.use_icon)) {
          // If the icon is a pin, center it on the bottom edge
          if (isTrue(s.default_style.icon_is_pin)) {
            marginTop = -s.height
          }
          if (s.default_style.icon_type === 'library') {
            var color_fill = hexToRgb(styles.icon_fill) || { r: 0, b: 0, g: 0 }
            style += 'color: rgba(' + color_fill.r + ', ' + color_fill.g + ', ' + color_fill.b + ', ' + styles.opacity + ');'
          }
        }

        style += 'margin-left: ' + marginLeft + 'px;'
        style += 'margin-top: ' + marginTop + 'px;'
      }

      // The shape is Text
      if (s.type === 'text') {
        var c = hexToRgb(s.text.text_color)

        style += 'left: ' + s.x + '%;'
        style += 'top: ' + s.y + '%;'
        style += 'font-family: ' + s.text.font_family + ';'
        style += 'font-size: ' + s.text.font_size + 'px;'
        style += 'font-weight: ' + s.text.font_weight + ';'
        style += 'color: rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + s.text.text_opacity + ');'

        if (!this.didAnimateShapesOnPageload) {
          if (this.settings.shapes.pageload_animation === 'grow') {
            style += 'opacity: ' + styles.opacity + ';'
            style += 'transform: scale(0);'
          } else if (this.settings.shapes.pageload_animation === 'fade') {
            style += 'opacity: 0;'
            style += 'transform: scale(' + (1 / this.zoom) + ');'
          } else {
            style += 'opacity: ' + styles.opacity + ';'
            style += 'transform: scale(' + (1 / this.zoom) + ');'
          }
        }
      }

      // The shape is a Rect or Oval
      if (s.type === 'rect' || s.type === 'oval') {
        // If the shape is an Oval, apply 50% 50% border radius
        var borderRadius = styles.border_radius + 'px'
        if (s.type === 'oval') {
          borderRadius = '50% 50%'
        }

        var color_bg = hexToRgb(styles.background_color) || { r: 0, b: 0, g: 0 }
        var color_border = hexToRgb(styles.border_color) || { r: 0, b: 0, g: 0 }

        style += 'left: ' + s.x + '%;'
        style += 'top: ' + s.y + '%;'
        style += 'width: ' + s.width + '%;'
        style += 'height: ' + s.height + '%;'

        if (styles.background_type === 'color') {
          style += 'background: rgba(' + color_bg.r + ', ' + color_bg.g + ', ' + color_bg.b + ', ' + styles.background_opacity + ');'
        }

        style += 'border-width: ' + styles.border_width + 'px;'
        style += 'border-style: ' + styles.border_style + ';'
        style += 'border-color: rgba(' + color_border.r + ', ' + color_border.g + ', ' + color_border.b + ', ' + styles.border_opacity + ');'
        style += 'border-radius: ' + borderRadius + ';'

        if (!this.didAnimateShapesOnPageload) {
          if (this.settings.shapes.pageload_animation === 'grow') {
            style += 'opacity: ' + styles.opacity + ';'
            style += 'transform: scale(0);'
          } else if (this.settings.shapes.pageload_animation === 'fade') {
            style += 'opacity: 0;'
            style += 'transform: scale(1);'
          } else {
            style += 'opacity: ' + styles.opacity + ';'
            style += 'transform: scale(1);'
          }
        }
      }

      // The shape is a Poly
      if (s.type === 'poly' || s.type === 'path') {
        var c_bg = hexToRgb(styles.background_color) || { r: 0, b: 0, g: 0 }
        var c_stroke = hexToRgb(styles.stroke_color) || { r: 0, b: 0, g: 0 }

        if (styles.background_type === 'color') {
          style += 'fill: rgba(' + c_bg.r + ', ' + c_bg.g + ', ' + c_bg.b + ', ' + styles.background_opacity + ');'
        } else {
          style += 'fill: rgba(0, 0, 0, 0);'
        }
        style += 'stroke: rgba(' + c_stroke.r + ', ' + c_stroke.g + ', ' + c_stroke.b + ', ' + styles.stroke_opacity + ');'
        style += 'stroke-width: ' + styles.stroke_width + 'px;'
        style += 'stroke-dasharray: ' + styles.stroke_dasharray + ';'
        style += 'stroke-linecap: ' + styles.stroke_linecap + ';'

        if (!this.didAnimateShapesOnPageload) {
          if (this.settings.shapes.pageload_animation === 'fade') {
            style += 'opacity: 0;'
          } else {
            style += 'opacity: ' + styles.opacity + ';'
          }
        }
      }

      return style
    },
    highlightShape: function (i, recursive) {
      i = parseInt(i)
      var s = this.settings.spots[i]

      // If layers is enabled and the shape isn't in the currently active layer, return
      if (isTrue(this.settings.enable_layers) == 1 && s.layerID != this.settings.runtime.layerID) return

      // If the shape is connected to a master, start from the master and return
      if (recursive && s.connected_to !== '') {
        var index = this.getIndexOfShapeWithID(s.connected_to)
        this.highlightShape(index, true)
        return
      }

      // If the shape is a connected shape master, then highlight its slaves (if recursive is TRUE)
      if (this.connectedShapes[s.id]) {
        for (var j = 0; j < this.connectedShapes[s.id].length; j++) {
          var index = this.connectedShapes[s.id][j].index
          this.highlightShape(index, false)
        }
      }

      // Apply mouseover styles
      var shapeEl = this.root.find('#' + s.id)
      shapeEl.attr('class', shapeEl.attr('class') + ' imp-shape-highlighted')

      // MOUSEOVER STYLES EXCEPTION
      if (s.mouseover_style.background_type === 'image') {
        console.log(s.mouseover_style.background_image_url)
        this.imageBackgroundsContainer.find('[data-id="' + s.id + '"]').css({
          'background-image': 'url("' + s.mouseover_style.background_image_url + '")',
          'opacity': s.mouseover_style.background_image_opacity,
          'transform': 'scale(' + s.mouseover_style.background_image_scale + ') translate(' + s.mouseover_style.background_image_offset_x + 'px, ' + s.mouseover_style.background_image_offset_y + 'px)'
        })
      }

      // Send API event
      $.imageMapProEventHighlightedShape(this.settings.general.name, s.title)

      // Add the shape to the array of highlighted shapes
      if (this.highlightedShapes.indexOf(i) === -1) {
        this.highlightedShapes.push(i)
      }
    },
    unhighlightShape: function (i) {
      i = parseInt(i)
      var s = this.settings.spots[i]

      // If layers is enabled and the shape isn't in the currently active layer, return
      if (isTrue(this.settings.layers.enable_layers) && parseInt(s.layerID) != parseInt(this.settings.runtime.layerID)) return

      // If the shape is highlighted with the API, then return
      if (this.apiHighlightedShapes.indexOf(i) != -1) {
        return
      }

      // Apply default styles
      var shapeEl = this.root.find('#' + s.id)
      shapeEl.attr('class', shapeEl.attr('class').replace(' imp-shape-highlighted', ''))

      // MOUSEOVER STYLES EXCEPTION
      if (s.default_style.background_type === 'image') {
        this.imageBackgroundsContainer.find('[data-id="' + s.id + '"]').css({
          'background-image': 'url(' + s.default_style.background_image_url + ')',
          'opacity': s.default_style.background_image_opacity,
          'transform': 'scale(' + s.default_style.background_image_scale + ') translate(' + s.default_style.background_image_offset_x + 'px, ' + s.default_style.background_image_offset_y + 'px)'
        })
      }

      // Send API event
      $.imageMapProEventUnhighlightedShape(this.settings.general.name, s.title)

      // Remove the shape from the array of highlighted shapes
      var indexInList = this.highlightedShapes.indexOf(i)
      this.highlightedShapes.splice(indexInList, 1)
    },
    unhighlightAllShapes: function () {
      var shapes = this.highlightedShapes.slice(0)

      for (var i = 0; i < shapes.length; i++) {
        this.unhighlightShape(shapes[i])
      }
    },
    isShapeHighlighted: function (i) {
      for (var j = 0; j < this.highlightedShapes.length; j++) {
        if (this.highlightedShapes[j] === i) {
          return true
        }
      }

      return false
    },
    focusShape: function (i) {
      if (!isTrue(this.settings.zooming.enable_zooming)) return

      // Find all children of the shape
      var connectedShapes = []

      for (var j = 0; j < this.settings.spots.length; j++) {
        if (this.settings.spots[j].connected_to === this.settings.spots[i].id) {
          connectedShapes.push(this.settings.spots[j])
        }
      }

      // Zoom to fit shape at 50% of wrap width or height
      var s = this.settings.spots[i]
      var shapeWidth = 0; var shapeHeight = 0

      // If the shape has other shapes connected to it, calculate average width and height
      if (connectedShapes.length > 0) {
        var shapeMinX = 999; var shapeMinY = 999; var shapeMaxX = 0; var shapeMaxY = 0

        if (s.x < shapeMinX) shapeMinX = s.x
        if (s.y < shapeMinY) shapeMinY = s.y
        if (s.x > shapeMaxX) shapeMaxX = s.x
        if (s.y > shapeMaxY) shapeMaxY = s.y

        for (var j = 0; j < connectedShapes.length; j++) {
          if (connectedShapes[j].x < shapeMinX) shapeMinX = connectedShapes[j].x
          if (connectedShapes[j].y < shapeMinY) shapeMinY = connectedShapes[j].y
          if (connectedShapes[j].x > shapeMaxX) shapeMaxX = connectedShapes[j].x
          if (connectedShapes[j].y > shapeMaxY) shapeMaxY = connectedShapes[j].y
        }

        shapeWidth = shapeMaxX - shapeMinX
        shapeHeight = shapeMaxY - shapeMinY
      } else {
        // If not, take the shape's width or height, whatever is bigger
        if (s.type === 'spot') {
          shapeWidth = shapeWidth / this.wrapWidth
          shapeHeight = shapeHeight / this.wrapHeight
          if (shapeWidth < 25) shapeWidth = 25
          if (shapeHeight < 25) shapeHeight = 25
        } else {
          shapeWidth = s.width
          shapeHeight = s.height
        }
      }

      var shapeLargerDimension = 0
      if (shapeWidth >= shapeHeight) shapeLargerDimension = shapeWidth
      if (shapeHeight > shapeWidth) shapeLargerDimension = shapeHeight

      var zoom = 50 / shapeLargerDimension
      if (zoom < 1) zoom = 1
      if (zoom > this.maxZoomLevel) zoom = this.maxZoomLevel

      // Calculate shape center
      var shapeCenterX = 0
      var shapeCenterY = 0

      if (s.type === 'spot') {
        shapeCenterX = s.x
        shapeCenterY = s.y
      } else {
        shapeCenterX = s.x + s.width / 2
        shapeCenterY = s.y + s.height / 2
      }

      if (connectedShapes.length > 0) {
        for (var j = 0; j < connectedShapes.length; j++) {
          if (connectedShapes[j].type === 'spot') {
            shapeCenterX += connectedShapes[j].x
            shapeCenterY += connectedShapes[j].y
          } else {
            shapeCenterX += connectedShapes[j].x + connectedShapes[j].width / 2
            shapeCenterY += connectedShapes[j].y + connectedShapes[j].height / 2
          }
        }

        shapeCenterX /= connectedShapes.length + 1
        shapeCenterY /= connectedShapes.length + 1
      }

      // Convert shape % coords to shape px coords
      shapeCenterX = (shapeCenterX / 100 * this.wrapWidth) * zoom
      shapeCenterY = (shapeCenterY / 100 * this.wrapHeight) * zoom

      // Pan and zoom to shape center
      this.applyZoom(zoom)
      this.panTo(shapeCenterX, shapeCenterY)
    },
    performClickAction: function (i) {
      var s = this.settings.spots[i]

      if (s.actions.click === 'follow-link') {
        if ($('#imp-temp-link').length === 0) {
          $('body').append('<a href="" id="imp-temp-link" target="_blank"></a>')
        }
        $('#imp-temp-link').attr('href', s.actions.link)

        if (isTrue(s.actions.open_link_in_new_window)) {
          $('#imp-temp-link').attr('target', '_blank')
        } else {
          $('#imp-temp-link').removeAttr('target')
        }

        $('#imp-temp-link')[0].click()
      }
      if (s.actions.click === 'run-script') {
        eval(s.actions.script.replace('<br>', ''))
      }

      $.imageMapProEventClickedShape(this.settings.general.name, this.settings.spots[i].title)
    },
    showTooltip: function (i, e) {
      var s = this.settings.spots[i]
      if (s.type === 'text') return

      // If the tooltip is already visible, then return
      if (this.openedTooltips.indexOf(i) != -1) return

      // Show content, instead of title
      if (isTrue(this.settings.tooltips.show_title_on_mouseover) && this.settings.tooltips.show_tooltips === 'click') {
        var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')
        t.find('.imp-tooltip-title').hide()
        t.find('.imp-tooltip-plain-text').show()
        t.find('.squares-container').show()

        // Reset tooltip position to avoid wrong calculations
        t.css({ left: 0, top: 0 })
      }

      // If the tooltip's shape is connected to a master and it's using its tooltip, show that tooltip instead

      if (s.connected_to != '' && isTrue(s.use_connected_shape_tooltip)) {
        var masterShapeIndex = this.getIndexOfShapeWithID(s.connected_to)
        this.showTooltip(masterShapeIndex)
        return
      }

      // If there is a visible tooltip, then hide it
      if (this.openedTooltips.length > 0) {
        this.hideAllTooltips()
      }

      // Add tooltip to the list of opened tooltips, if we are not showing only the title
      if (this.openedTooltips.indexOf(i) === -1) {
        this.openedTooltips.push(i)
      }

      // Show fullscreen or normal tooltips
      if ((this.settings.tooltips.fullscreen_tooltips === 'mobile-only' && isMobile()) || this.settings.tooltips.fullscreen_tooltips === 'always') {
        // Fullscreen tooltips
        this.visibleFullscreenTooltip = $('.imp-fullscreen-tooltip[data-index="' + i + '"]')
        this.visibleFullscreenTooltipIndex = i

        this.fullscreenTooltipsContainer.show()
        this.visibleFullscreenTooltip.show()

        var self = this
        setTimeout(function () {
          self.visibleFullscreenTooltip.addClass('imp-tooltip-visible')
        }, 20)

        this.fullscreenTooltipVisible = true

        // Prevent scrolling of the body and store the original overflow attribute value
        this.bodyOverflow = $('body').css('overflow')
        $('body').css({
          overflow: 'hidden'
        })
      } else {
        // Normal tooltips
        var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')
        t.show()
        setTimeout(function () {
          t.addClass('imp-tooltip-visible')
        }, 1)

        this.measureTooltipSize(i)
        this.updateTooltipPosition(i, e)
      }

      // Send event
      $.imageMapProEventOpenedTooltip(this.settings.general.name, this.settings.spots[i].title)
    },
    hideTooltip: function (i) {
      var s = this.settings.spots[i]
      if (s.type === 'text') return

      // If the tooltip has been opened with the API, then return
      if (this.apiOpenedTooltips.indexOf(i) != -1) {
        return
      }

      // Remove from the list of opened tooltips
      var indexInList = this.openedTooltips.indexOf(i)
      this.openedTooltips.splice(indexInList, 1)

      // Hide mobile tooltip
      if ((this.settings.tooltips.fullscreen_tooltips === 'mobile-only' && isMobile()) || this.settings.tooltips.fullscreen_tooltips === 'always') {
        var self = this
        var t = this.fullscreenTooltipsContainer.find('.imp-fullscreen-tooltip[data-index="' + i + '"]')

        t.removeClass('imp-tooltip-visible')
        // setTimeout(function() {
        self.fullscreenTooltipsContainer.hide()
        t.hide()
        // }, 200);

        this.fullscreenTooltipVisible = false

        // Restore the body overflow to allow scrolling
        $('body').css({
          overflow: this.bodyOverflow
        })
      } else {
        // Hide normal tooltip
        var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')

        setTimeout(function () {
          t.removeClass('imp-tooltip-visible')
          if (!t.hasClass('imp-tooltip-visible')) {
            t.hide()
          }
        }, 1)

        // Stop all videos
        t.find('video').trigger('pause')
        t.find('iframe').each(function () {
          $(this).attr('src', $(this).attr('src'))
        })
      }

      // Send event
      $.imageMapProEventClosedTooltip(this.settings.general.name, this.settings.spots[i].title)
    },
    hideAllTooltips: function () {
      var tooltips = this.openedTooltips.slice(0)

      for (var i = 0; i < tooltips.length; i++) {
        this.hideTooltip(tooltips[i])
      }
    },
    hideAllTitles: function () {
      for (var i = 0; i < this.settings.spots.length; i++) {
        this.hideTooltipTitle(i, true)
      }
    },
    showTooltipTitle: function (i, e) {
      var s = this.settings.spots[i]
      if (s.type === 'text') return

      // If the tooltip is already open, then return
      if (this.openedTooltips.indexOf(i) != -1) {
        return
      }

      // Show the title div
      var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')

      // If the tooltip has class visible, only update position and return
      if (t.hasClass('imp-tooltip-visible')) {
        this.updateTooltipPosition(i, e)
        return
      }

      t.find('.squares-container').hide()
      t.find('.imp-tooltip-title').show()
      t.find('.imp-tooltip-title .squares-container').show()
      t.find('.imp-tooltip-plain-text').hide()

      // Show the tooltip
      t.show()
      setTimeout(function () {
        t.addClass('imp-tooltip-visible')
      }, 1)

      // Reposition
      t.data('imp-measured-width', t.outerWidth())
      t.data('imp-measured-height', t.outerHeight())
      this.updateTooltipPosition(i, e)
    },
    hideTooltipTitle: function (i) {
      var s = this.settings.spots[i]
      if (s.type === 'text') return

      // If the tooltip is already open, then return
      if (this.openedTooltips.indexOf(i) != -1) {
        return
      }

      // Hide the title div and show the content
      var t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')
      t.find('.imp-tooltip-title').hide()
      t.find('.imp-tooltip-plain-text').show()
      t.find('.squares-container').show()

      // Hide the tooltip
      t.css({ width: 'auto' })
      t.removeClass('imp-tooltip-visible')
      t.hide()
    },
    updateTooltipPosition: function (i, e) {
      // t = tooltip element
      // tw/th = tooltip width/height
      // sx/sy/sw/sh = spot x/y/width/height
      // p = padding
      // ex/ey = event x/y
      // s = target shape

      // If fullscreen tooltips are on, then do nothing
      if (this.fullscreenTooltipVisible) return

      var t; var tw; var th; var sx; var sy; var sw; var sh; var p = 20; var ex; var ey; var s

      t = this.tooltipsContainer.find('.imp-tooltip[data-index="' + i + '"]')
      tw = t.data('imp-measured-width')
      th = t.data('imp-measured-height')
      s = this.settings.spots[i]

      var windowWidth = window.innerWidth
      var windowHeight = window.innerHeight

      // Values that need to be updated right after zoom
      // this.zoom
      // this.actualPanX/Y

      if (isTrue(this.settings.tooltips.sticky_tooltips) && e) {
        // Sticky tooltips
        // Set width/height of the spot to 0
        // and X and Y to the mouse coordinates
        // Get the event coordinates
        var c = this.getEventCoordinates(e)
        ex = c.x
        ey = c.y

        sx = ex - this.wrapOffsetLeft
        sy = ey - this.wrapOffsetTop
        sw = 0
        sh = 0
      } else {
        sw = (s.width / 100) * this.wrapWidth
        sh = (s.height / 100) * this.wrapHeight

        sw = sw * this.targetZoom
        sh = sh * this.targetZoom

        sx = ((Math.round(s.x * 10) / 10) / 100) * this.wrapWidth
        sy = ((Math.round(s.y * 10) / 10) / 100) * this.wrapHeight

        sx = sx * this.targetZoom + this.targetPanX
        sy = sy * this.targetZoom + this.targetPanY
      }

      // If the shape is a spot, move its x/y center to the top-left corner
      if (s.type === 'spot') {
        sx -= s.width / 2
        if (!isTrue(this.settings.tooltips.sticky_tooltips)) {
          sy -= s.height / 2
        }

        sw = s.width
        sh = s.height
      }

      // If the spot is a pin, offset it to the top
      if (s.type === 'spot' && isTrue(s.default_style.icon_is_pin) && s.type === 'spot' && isTrue(s.default_style.use_icon) && !isTrue(this.settings.tooltips.sticky_tooltips)) {
        sy -= sh / 2
      }

      // Limit the size-position of the shape to the bounds of the wrap
      if (isTrue(this.settings.runtime.is_fullscreen) && isTrue(this.settings.tooltips.constrain_tooltips)) {
        console.log(this.wrapOffsetLeft)
        if (sx + this.wrapOffsetLeft < 0) {
          sw = sw + sx + this.wrapOffsetLeft
          sx = -this.wrapOffsetLeft
        }
        if (sx + this.wrapOffsetLeft + sw > windowWidth) {
          sw += windowWidth - (sx + this.wrapOffsetLeft + sw)
        }
        if (sy + this.wrapOffsetTop < 0) {
          sh = sh + sy + this.wrapOffsetTop
          sy = -this.wrapOffsetTop
        }
        if (sy + this.wrapOffsetTop + sh > windowHeight) {
          sh += windowHeight - (sy + this.wrapOffsetTop + sh)
        }
      } else {
        if (sx < 0) {
          sw = sw + sx
          sx = 0
        }
        if (sx + sw > this.wrapWidth) {
          sw = this.wrapWidth - sx
        }
        if (sy < 0) {
          sh = sh + sy
          sy = 0
        }
        if (sy + sh > this.wrapHeight) {
          sh = this.wrapHeight - sy
        }
      }

      // Calculate and set the position
      var x, y
      if (s.tooltip_style.position === 'left') {
        x = sx - tw - p
        y = sy + sh / 2 - th / 2
      }
      if (s.tooltip_style.position === 'right') {
        x = sx + sw + p
        y = sy + sh / 2 - th / 2
      }
      if (s.tooltip_style.position === 'top') {
        x = sx + sw / 2 - tw / 2
        y = sy - th - p
      }
      if (s.tooltip_style.position === 'bottom') {
        x = sx + sw / 2 - tw / 2
        y = sy + sh + p
      }

      var pos = { x: x, y: y }

      // Constrain tooltips
      if (isTrue(this.settings.tooltips.constrain_tooltips)) {
        pos = fitRectToScreen(x + this.wrapOffsetLeft, y + this.wrapOffsetTop, tw, th)
        pos.x -= this.wrapOffsetLeft
        pos.y -= this.wrapOffsetTop
      }

      // Apply tooltip position offset (custom position)
      pos.x += s.tooltip_style.offset_x / 100 * this.wrapWidth
      pos.y += s.tooltip_style.offset_y / 100 * this.wrapHeight

      // When doing all calcs above, the tooltips used to be within the wrap.
      // They are now outside the wrap, so we apply offset
      t.css({
        left: pos.x + this.wrapOffsetLeft - this.tooltipsContainer.offset().left,
        top: pos.y + this.wrapOffsetTop - this.tooltipsContainer.offset().top
      })
    },
    updateOpenedTooltipsPosition: function () {
      for (var i = 0; i < this.openedTooltips.length; i++) {
        this.updateTooltipPosition(this.openedTooltips[i])
      }
    },
    toggleFullscreen: function () {
      if (!isTrue(this.settings.runtime.is_fullscreen)) {
        // Go fullscreen
        $('body').addClass('imp-fullscreen-mode')

        var fullscreenSettings = $.extend(true, {}, this.settings)
        fullscreenSettings.runtime.is_fullscreen = 1
        fullscreenSettings.id = '999999'
        fullscreenSettings.general.responsive = 0
        fullscreenSettings.general.width = this.settings.general.naturalWidth
        fullscreenSettings.general.height = this.settings.general.naturalHeight
        fullscreenSettings.general.name += '-fullscreen'

        if (isTrue(this.settings.shapes_menu.enable_shapes_menu) && isTrue(this.settings.shapes_menu.detached_menu)) {
          fullscreenSettings.shapes_menu.detached_menu = 0
        }

        var style = ''
        style += 'background: ' + this.settings.fullscreen.fullscreen_background
        $('body').append('<div id="imp-fullscreen-wrap" style="' + style + '"><div id="image-map-pro-' + fullscreenSettings.id + '"></div></div>')

        $('#image-map-pro-' + fullscreenSettings.id).imageMapPro(fullscreenSettings)

        // Disable current image map
        this.disableEvents()

        fullscreenMapParent = this
      } else {
        // Close fullscreen
        $('body').removeClass('imp-fullscreen-mode')
        $('#imp-fullscreen-wrap').remove()
        this.disableEvents()

        delete instances[this.settings.general.name]
        fullscreenMapParent.events()
      }
    },
    resetZoomAndPan: function () {
      this.zoom = 1
      this.targetZoom = 1
      this.targetPanX = 0
      this.targetPanY = 0
      this.actualPanX = 0
      this.actualPanY = 0

      this.redraw(false)
    },
    zoomIn: function (e) {
      // Check if it's possible to zoom further
      if (this.targetZoom < this.maxZoomLevel) {
        // Adjust zoom
        var targetZoom = this.zoom * this.zoomMultiplier

        // Focal point
        var eventX = 0; var eventY = 0; var wrapWidth = this.wrap.width(); var wrapHeight = this.wrap.height()

        // Check if the zoom was triggered by clicking with the zoom tool, or by keyboard shortcut
        if (e) {
          // Focal point is at event point, relative to the zoomed wrap
          eventX = e.pageX
          eventY = e.pageY
        } else {
          // Assume that the event happened at the center of the non-zoomed wrap
          eventX = this.wrap.offset().left + wrapWidth / 2
          eventY = this.wrap.offset().top + wrapHeight / 2
        }

        this.applyZoom(targetZoom, eventX, eventY)
      }
    },
    zoomOut: function (e) {
      // Check if it's possible to zoom further
      if (this.targetZoom > 1) {
        // Adjust zoom
        var targetZoom = this.zoom / this.zoomMultiplier

        // Focal point
        var eventX = 0; var eventY = 0; var wrapWidth = this.wrap.width(); var wrapHeight = this.wrap.height()

        // Check if the zoom was triggered by clicking with the zoom tool, or by keyboard shortcut
        if (e) {
          // Focal point is at event point, relative to the zoomed wrap
          eventX = e.pageX
          eventY = e.pageY
        } else {
          // Assume that the event happened at the center of the non-zoomed wrap
          eventX = this.wrap.offset().left + wrapWidth / 2
          eventY = this.wrap.offset().top + wrapHeight / 2
        }

        this.applyZoom(targetZoom, eventX, eventY)
      }
    },
    applyZoom: function (zoomLevel, eventX, eventY) {
      // Stop interpolation at the actual pan
      this.targetZoom = this.zoom
      this.targetPanX = this.actualPanX
      this.targetPanY = this.actualPanY

      // Limit the zoom level
      if (zoomLevel > this.maxZoomLevel) {
        zoomLevel = this.maxZoomLevel
      }
      if (zoomLevel < 1) {
        zoomLevel = 1
      }

      this.targetZoom = zoomLevel

      // Calculate base zoom offset
      var baseOffsetX = (this.wrapWidth * this.targetZoom - this.wrapWidth * this.zoom) / 2
      var baseOffsetY = (this.wrapHeight * this.targetZoom - this.wrapHeight * this.zoom) / 2

      // Focal point
      if (eventX && eventY) {
        var fx = eventX - this.zoomWrap.offset().left
        var fy = eventY - this.zoomWrap.offset().top

        // Calculate focal offset
        var focalOffsetX = baseOffsetX * (((this.wrapWidth * this.zoom) / 2 - fx) / ((this.wrapWidth * this.zoom) / 2))
        var focalOffsetY = baseOffsetY * (((this.wrapHeight * this.zoom) / 2 - fy) / ((this.wrapHeight * this.zoom) / 2))

        this.targetPanX -= baseOffsetX
        this.targetPanY -= baseOffsetY
        this.targetPanX += focalOffsetX
        this.targetPanY += focalOffsetY
      }

      // Limit to bounds
      if (this.targetPanX > 0) this.targetPanX = 0
      if (this.targetPanY > 0) this.targetPanY = 0

      if (this.targetPanX < this.wrapWidth - this.wrapWidth * this.targetZoom) this.targetPanX = this.wrapWidth - this.wrapWidth * this.targetZoom
      if (this.targetPanY < this.wrapHeight - this.wrapHeight * this.targetZoom) this.targetPanY = this.wrapHeight - this.wrapHeight * this.targetZoom

      // Adjust the size of the spots
      for (var i = 0; i < this.settings.spots.length; i++) {
        var s = this.settings.spots[i]
        if (s.type === 'spot') {
          this.wrap.find('#' + s.id).css({
            'transform': 'scale(' + (1 / this.targetZoom) + ')'
          })
        }
      }

      if (this.settings.tooltips.show_tooltips === 'mouseover') {
        this.hideAllTooltips()
      } else {
        this.updateOpenedTooltipsPosition()
      }

      this.redraw(true)
    },
    pan: function (eventX, eventY) {
      var panDeltaX = this.ix - eventX
      var panDeltaY = this.iy - eventY

      this.targetPanX = this.initialPanX - panDeltaX
      this.targetPanY = this.initialPanY - panDeltaY

      // Limit to bounds
      if (this.targetPanX > 0) this.targetPanX = 0
      if (this.targetPanY > 0) this.targetPanY = 0

      if (this.targetPanX < this.wrapWidth - this.wrapWidth * this.zoom) this.targetPanX = this.wrapWidth - this.wrapWidth * this.zoom
      if (this.targetPanY < this.wrapHeight - this.wrapHeight * this.zoom) this.targetPanY = this.wrapHeight - this.wrapHeight * this.zoom

      // Redraw
      if (this.settings.tooltips.show_tooltips === 'mouseover') {
        this.hideAllTooltips()
      } else {
        this.tooltipsContainer.addClass('imp-no-transition')
        this.updateOpenedTooltipsPosition()
      }
      this.redraw(false)
    },
    panTo: function (x, y) {
      var panX = -x + this.wrapWidth / 2
      var panY = -y + this.wrapHeight / 2

      this.targetPanX = panX
      this.targetPanY = panY

      // Limit to bounds
      if (this.targetPanX > 0) this.targetPanX = 0
      if (this.targetPanY > 0) this.targetPanY = 0

      if (this.targetPanX < this.wrapWidth - this.wrapWidth * this.targetZoom) this.targetPanX = this.wrapWidth - this.wrapWidth * this.targetZoom
      if (this.targetPanY < this.wrapHeight - this.wrapHeight * this.targetZoom) this.targetPanY = this.wrapHeight - this.wrapHeight * this.targetZoom

      // Redraw
      if (this.settings.tooltips.show_tooltips === 'mouseover') {
        this.hideAllTooltips()
      } else {
        this.updateOpenedTooltipsPosition()
      }
      this.redraw(true)
    },
    pinch: function (e) {
      var eventX = (e.originalEvent.touches[0].pageX + e.originalEvent.touches[1].pageX) / 2
      var eventY = (e.originalEvent.touches[0].pageY + e.originalEvent.touches[1].pageY) / 2

      // Pan
      this.actualPanX += eventX - this.lastX
      this.actualPanY += eventY - this.lastY

      // Limit to bounds
      var wrapWidth = this.wrap.width()
      var wrapHeight = this.wrap.height()
      var wrapOffsetLeft = this.wrap.offset().left
      var wrapOffsetTop = this.wrap.offset().top

      var windowWidth = window.innerWidth
      var windowHeight = window.innerHeight

      if (isTrue(this.settings.runtime.is_fullscreen)) {
        if (wrapWidth * this.zoom > windowWidth) {
          if (this.actualPanX > -wrapOffsetLeft) this.actualPanX = -wrapOffsetLeft
          if (this.actualPanX < windowWidth - wrapWidth * this.targetZoom - wrapOffsetLeft) this.actualPanX = windowWidth - wrapWidth * this.targetZoom - wrapOffsetLeft
        } else {
          this.actualPanX = (wrapWidth - wrapWidth * this.targetZoom) / 2
        }

        if (wrapHeight * this.zoom > windowHeight) {
          if (this.actualPanY > -wrapOffsetTop) this.actualPanY = -wrapOffsetTop
          if (this.actualPanY < windowHeight - wrapHeight * this.targetZoom - wrapOffsetTop) this.actualPanY = windowHeight - wrapHeight * this.targetZoom - wrapOffsetTop
        } else {
          this.actualPanY = (wrapHeight - wrapHeight * this.targetZoom) / 2
        }
      } else {
        if (this.actualPanX > 0) this.actualPanX = 0
        if (this.actualPanY > 0) this.actualPanY = 0

        if (this.actualPanX < wrapWidth - wrapWidth * this.targetZoom) this.actualPanX = wrapWidth - wrapWidth * this.targetZoom
        if (this.actualPanY < wrapHeight - wrapHeight * this.targetZoom) this.actualPanY = wrapHeight - wrapHeight * this.targetZoom
      }

      this.lastX = eventX
      this.lastY = eventY

      // Zoom
      var distance = Math.sqrt(Math.pow(e.originalEvent.touches[1].pageX - e.originalEvent.touches[0].pageX, 2) + Math.pow(e.originalEvent.touches[1].pageY - e.originalEvent.touches[0].pageY, 2))
      var delta = distance / this.pinchInitialDistance

      this.applyZoom(this.pinchInitialZoom * delta, eventX, eventY)
    },
    redraw: function (interpolate) {
      // Interpolate
      if (interpolate) {
        this.zoom = lerp(this.zoom, this.targetZoom, 0.1)
        this.actualPanX = lerp(this.actualPanX, this.targetPanX, 0.1)
        this.actualPanY = lerp(this.actualPanY, this.targetPanY, 0.1)

        // Check interpolation thresholds
        if (Math.abs(this.zoom - this.targetZoom) < 0.001) this.zoom = this.targetZoom
        if (Math.abs(this.actualPanX - this.targetPanX) < 1) this.actualPanX = this.targetPanX
        if (Math.abs(this.actualPanY - this.targetPanY) < 1) this.actualPanY = this.targetPanY
      } else {
        this.zoom = this.targetZoom
        this.actualPanX = this.targetPanX
        this.actualPanY = this.targetPanY
      }

      // Draw
      this.zoomWrap.css({
        'transform': 'scale(' + this.zoom + ', ' + this.zoom + ')'
      })
      this.translateWrap.css({
        'transform': 'translate(' + this.actualPanX + 'px, ' + this.actualPanY + 'px)'
      })

      // Navigator window
      if (isTrue(this.settings.zooming.enable_navigator) && isTrue(this.settings.zooming.enable_zooming)) {
        var imageClipLeft = -this.actualPanX * this.navigatorRatio / this.zoom + this.navigatorMarginX / this.zoom
        var imageClipRight = (this.wrapWidth * this.navigatorRatio) - (imageClipLeft + (this.uiNavigatorWindowWidth * 1 / this.zoom))
        var imageClipTop = -this.actualPanY * this.navigatorRatio / this.zoom + this.navigatorMarginY / this.zoom
        var imageClipBottom = (this.wrapHeight * this.navigatorRatio) - (imageClipTop + (this.uiNavigatorWindowHeight * 1 / this.zoom))

        this.uiNavigatorImage.css({
          'clip-path': 'inset(' + imageClipTop + 'px ' + imageClipRight + 'px ' + imageClipBottom + 'px ' + imageClipLeft + 'px)',
          '-webkit-clip-path': 'inset(' + imageClipTop + 'px ' + imageClipRight + 'px ' + imageClipBottom + 'px ' + imageClipLeft + 'px)',
          '-moz-clip-path': 'inset(' + imageClipTop + 'px ' + imageClipRight + 'px ' + imageClipBottom + 'px ' + imageClipLeft + 'px)'
        })
      }

      // Repeat
      if (interpolate) {
        var self = this
        if (this.zoom != this.targetZoom || this.actualPanX != this.targetPanX || this.actualPanY != this.targetPanY) {
          window.requestAnimationFrame(function () {
            self.redraw(interpolate)
          })
        }
      }
    },
    switchLayer: function (layerID, cb) {
      // Set the layerID in the runtime
      this.settings.runtime.layerID = layerID

      // Clear data
      this.openedTooltips = []
      this.apiOpenedTooltips = []
      this.highlightedShapes = []
      this.apiHighlightedShapes = []

      // Store runtime variables
      if (this.shapesMenuWrap) {
        this.settings.runtime.menu_scroll = this.shapesMenuWrap.find('.imp-shapes-menu-scroll-wrap').scrollTop()
      }

      // Find the new layer from its ID
      var layerName = ''
      for (var i = 0; i < this.settings.layers.layers_list.length; i++) {
        if (parseInt(this.settings.layers.layers_list[i].id, 10) === parseInt(this.settings.runtime.layerID, 10)) {
          layerName = this.settings.layers.layers_list[i].title
          // Change image URL

          // Change image dimentions
          this.settings.general.naturalWidth = this.settings.layers.layers_list[i].image_width
          this.settings.general.naturalHeight = this.settings.layers.layers_list[i].image_height

          // If fullscreen mode is on, change the default width/height as well
          if (isTrue(this.settings.runtime.is_fullscreen)) {
            this.settings.general.width = this.settings.layers.layers_list[i].image_width
            this.settings.general.height = this.settings.layers.layers_list[i].image_height
          }

          break
        }
      }

      var self = this
      this.init(function () {
        if (cb) cb()
        $.imageMapProEventSwitchedFloor(self.settings.general.name, layerName)
      })
    },
    updateMenuSearch: function () {
      var str = $('[data-image-map-pro-search-id="' + this.settings.id + '"]').val()

      if (str && str.length > 0) {
        // Add class to menu root
        this.shapesMenuWrap.addClass('imp-searching')

        $('.imp-shapes-menu-shape-title').each(function () {
          var r = '(' + str + ')'
          var regex = new RegExp(r, 'gi')
          var defaultContent = $(this).data('imp-content')
          var newHTML = $(this).data('imp-content').replace(regex, '<span class="imp-search-highlight">' + '$&' + '</span>')

          if (defaultContent != newHTML) {
            $(this).show()
            $(this).html(newHTML)
          } else {
            $(this).hide()
            $(this).html(defaultContent)
          }
        })
      } else {
        // Remove class from menu root
        this.shapesMenuWrap.removeClass('imp-searching')

        $('.imp-shapes-menu-shape-title, .imp-shapes-menu-layer-title').each(function () {
          $(this).show()
          $(this).html($(this).data('imp-content'))
        })
      }

      this.settings.runtime.menu_search_string = str
    },
    displayScrollMessage: function () {
      this.scrollMessage.fadeIn()
      clearTimeout(this.hideScrollMessageTimeout)
      var self = this
      this.hideScrollMessageTimeout = setTimeout(function () {
        self.scrollMessage.fadeOut()
      }, 1000)
    },
    showResponsiveShapesMenu: function () {
      if (this.responsiveShapesMenuWrap) {
        this.responsiveShapesMenuWrap.addClass('imp-responsive-menu-visible')
        $('body').addClass('imp-noscroll')
      }
    },
    hideResponsiveShapesMenu: function () {
      if (this.responsiveShapesMenuWrap) {
        this.responsiveShapesMenuWrap.removeClass('imp-responsive-menu-visible')
        $('body').removeClass('imp-noscroll')
      }
    }
  })

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      $.data(this, 'plugin_' + pluginName, new Plugin(this, options))
    })
  }

  // Convenience functions
  function isTrue(a) {
    if (parseInt(a, 10) === 1) return true

    return false
  }
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }
  function screenToImageMapSpace(x, y, imageMap) {
    return {
      x: Math.round((x - imageMap.offset().left) * 1000) / 1000,
      y: Math.round((y - imageMap.offset().top) * 1000) / 1000
    }
  }
  function isPointInsideRect(x, y, rx, ry, rw, rh) {
    if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) return true
    return false
  }
  function isPointInsidePolygon(x, y, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var inside = false
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0]; var yi = vs[i][1]
      var xj = vs[j][0]; var yj = vs[j][1]

      var intersect = ((yi > y) != (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }

    return inside
  }
  function isPointInsideEllipse(x, y, ex, ey, rx, ry) {
    var a = (x - ex) * (x - ex)
    var b = rx * rx
    var c = (y - ey) * (y - ey)
    var d = ry * ry

    if (a / b + c / d <= 1) return true

    return false
  }
  function fitRectToScreen(x, y, w, h) {
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (x > $(document).width() - w) x = $(document).width() - w
    if (y > $(document).height() - h) y = $(document).height() - h
    return { x: x, y: y }
  }
  function shuffle(array) {
    var currentIndex = array.length; var temporaryValue; var randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
  function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true
    }

    return false
  }
  function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
  }
  function easeOutBounce(x, t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
    }
  }
})(jQuery, window, document);

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!(function (a) { typeof define === 'function' && define.amd ? define(['jquery'], a) : typeof exports === 'object' ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event; var h = i.call(arguments, 1); var j = 0; var l = 0; var m = 0; var n = 0; var o = 0; var p = 0; if (b = a.event.fix(g), b.type = 'mousewheel', 'detail' in g && (m = -1 * g.detail), 'wheelDelta' in g && (m = g.wheelDelta), 'wheelDeltaY' in g && (m = g.wheelDeltaY), 'wheelDeltaX' in g && (l = -1 * g.wheelDeltaX), 'axis' in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = m === 0 ? l : m, 'deltaY' in g && (m = -1 * g.deltaY, j = m), 'deltaX' in g && (l = g.deltaX, m === 0 && (j = -1 * l)), m !== 0 || l !== 0) { if (g.deltaMode === 1) { var q = a.data(this, 'mousewheel-line-height'); j *= q, m *= q, l *= q } else if (g.deltaMode === 2) { var r = a.data(this, 'mousewheel-page-height'); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? 'floor' : 'ceil'](j / f), l = Math[l >= 1 ? 'floor' : 'ceil'](l / f), m = Math[m >= 1 ? 'floor' : 'ceil'](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && a.type === 'mousewheel' && b % 120 === 0 } var e; var f; var g = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll']; var h = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll']; var i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: '3.1.12', setup: function () { if (this.addEventListener) for (var c = h.length; c;) this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, 'mousewheel-line-height', k.getLineHeight(this)), a.data(this, 'mousewheel-page-height', k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, 'mousewheel-line-height'), a.removeData(this, 'mousewheel-page-height') }, getLineHeight: function (b) { var c = a(b); var d = c['offsetParent' in a.fn ? 'offsetParent' : 'parent'](); return d.length || (d = a('body')), parseInt(d.css('fontSize'), 10) || parseInt(c.css('fontSize'), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind('mousewheel', a) : this.trigger('mousewheel') }, unmousewheel: function (a) { return this.unbind('mousewheel', a) } }) }))
