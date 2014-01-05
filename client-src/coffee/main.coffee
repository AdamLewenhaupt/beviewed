snapUp = () ->
  if $("#content").css("margin-left") != "250px"
    if window.snapper == undefined
      window.snapper = new Snap
        element: document.getElementById 'content'
    else
      window.snapper.enable()
  else
    window.snapper.close()
    window.snapper.disable()

if window.Snap != undefined
  $ () ->
    snapUp()
    $(window).resize () ->
      snapUp()

angular.module('beviewed', ["ng", "ngAnimate"])

 .config ($sceDelegateProvider) ->
    youtubeResource = /^\/\/www\.youtube\.com\/embed\/.*$/
    soundCloudResource = /^https\:\/\/w\.soundcloud\.com\/player\/.*$/
    $sceDelegateProvider.resourceUrlWhitelist ["self", youtubeResource]

 .directive "embeder", ($sce) ->

    restrict: 'A'
    scope: 
      media: "=embeder"
      mediaData: "=embederSrc"
    template: "<div ng-switch on='media'>
        <iframe class='embed sc' ng-switch-when='sc' scrolling='no' frameborder='no' ng-src='{{soundCloud}}'></iframe>
        <iframe class='embed yt' ng-switch-when='yt' ng-src='{{youTube}}' frameborder='no' allowfullscreen></iframe>
        </div>
      </div>"

    link: (scope, el, attrs) ->

      handleChange = () ->
        if scope.media == "sc"
          scope.soundCloud = $sce.trustAsResourceUrl scope.mediaData
        else if scope.media == "yt"
          scope.youTube = $sce.trustAsResourceUrl "http://www.youtube.com/embed/#{scope.mediaData}"
        else if scope.media == "da"
          scope.deviantArt = $sce.trustAsHtml "<embed class='embed da' ng-switch-when='da' src='http://backend.deviantart.com/embed/view.swf?1' type='application/x-shockwave-flash' width='450' height='589' flashvars='id=#{scope.mediaData}' allowscriptaccess='always'></embed>"

      scope.$watch "media", handleChange
      scope.$watch "mediaData", handleChange

      handleChange()

 .directive "ssv", () ->
    restrict: 'A'
    link: (scope, el, attrs) ->
      scope[attrs.ssv] = el.html()


 .directive "ssvParse", () ->
    restrict: 'A'
    link: (scope, el, attrs) ->
      scope[attrs['ssvParse']] = JSON.parse(el.html())


 .directive "popup", () ->
  
    restrict: 'A'
    link: (scope, el, attrs) ->

      el.on "click", () ->

        saveText = attrs.text || "Save"
        options = scope[attrs.options]

        $(".popup").remove()

        offset = el.offset()

        x = offset.left + 10
        y = offset.top - 20 - $(window).scrollTop()

        calc = 
          if $(window).width() < (x + 400)
            -(320)
          else
            el.outerWidth(true)

        target = x + calc

        wrapper = $("<div class='popup panel' style='z-index:6;position:fixed;left:#{target}px;top:#{y}px;width:300px;' />")
        form = $("<form class='form-inline' />")
        field = $("<div class='input-group popup-group' style='float:left;width:90%;'/>")
        input = 
          if options
            parse = ""
            for key of options
              text = "<option value='#{key}'>#{options[key]}</option>"
              parse += text
            $("<select class='form-control popup-input' style='width:70%;'>#{parse}</select>")
          else
            $("<input type='text' class='form-control popup-input' style='width:70%;' />") 

        save = $("<button class='input-group-addon btn btn-success popup-save' style='width:30%;'>#{saveText}</button>")
        nvm = $("<button class='close popup-close' aria-hidden='true'>&times;</button>")
        save.on "click", () -> 
          if scope.$$phase 
            (scope[attrs.popup] || () ->) input.val()
          else
            scope.$apply () ->
              (scope[attrs.popup] || () ->) input.val()
          wrapper.remove()
          false

        nvm.on "click", () ->
          wrapper.remove()

        field.append input, save
        form.append field
        wrapper.append form, nvm
        $(document.body).append wrapper

 .directive "community", () ->
    restrict: 'A'
    replace: true
    scope:
      getCommunity: "&community"
      link: "="
      click: "&ngClick"
    template: "
    <div class='media community-wrapper'>
      <a href='{{ genLink() }}'>
        <img ng-click='delegate()' class='community img-rounded media-object'
          ng-src='/img/icons/{{community}}' onerror='$(this).attr(\"src\",\"/img/unknown.png\")' />
      </a></div>"
    link: (scope, el, attrs) ->
      scope.community = scope.getCommunity()

      scope.doLink = scope.link

      if scope.doLink == undefined
        scope.doLink = true


      scope.delegate = () -> 
        unless scope.doLink 
          scope.click()

      scope.genLink = () ->
        if scope.doLink 
          "/community/#{scope.community}" 
        else 
          "#"

 .directive "sub", () ->
    restrict: 'A'
    link: (scope, el, attrs) ->
      el.on "keydown", (e) ->
        e = e || window.event
        if e.keyCode == 13
          scope[attrs.sub]()
          return false

 .directive "user", () ->
    restrict: 'A' 
    replace: true
    scope:
      getUser: "&user"
    template: "
      <div class='media'>
        <a href='/profile/{{user}}'>
          <img class='user img-rounded media-object'
            ng-src='/img/users/{{user}}' onerror='$(this).attr(\"src\",\"/img/unknown.png\")' /></a></div>"
    link: (scope) ->
      scope.user = scope.getUser()

 .directive "hover", () ->
  restrict: 'A'
  link: (scope, el, attrs) ->
    el.on 'mouseenter', () ->
      el.addClass attrs.hover
    el.on 'mouseleave', () ->
      el.removeClass attrs.hover

 .directive "image", ($q) ->
  URL = window.URL or window.webkitURL
  getResizeArea = ->
    resizeAreaId = "fileupload-resize-area"
    resizeArea = document.getElementById(resizeAreaId)
    unless resizeArea
      resizeArea = document.createElement("canvas")
      resizeArea.id = resizeAreaId
      resizeArea.style.visibility = "hidden"
      document.body.appendChild resizeArea
    resizeArea

  resizeImage = (origImage, options) ->
    maxHeight = options.resizeMaxHeight or 300
    maxWidth = options.resizeMaxWidth or 250
    quality = options.resizeQuality or 0.7
    type = options.resizeType or "image/jpg"
    canvas = getResizeArea()
    height = origImage.height
    width = origImage.width
    
    # calculate the width and height, constraining the proportions
    if width > height
      if width > maxWidth
        height = Math.round(height *= maxWidth / width)
        width = maxWidth
    else
      if height > maxHeight
        width = Math.round(width *= maxHeight / height)
        height = maxHeight
    canvas.width = width
    canvas.height = height
    
    #draw image on canvas
    ctx = canvas.getContext("2d")
    ctx.drawImage origImage, 0, 0, width, height
    
    # get the data from canvas as 70% jpg (or specified type).
    canvas.toDataURL type, quality

  createImage = (url, callback) ->
    image = new Image()
    image.onload = ->
      callback image

    image.src = url

  fileToDataURL = (file) ->
    deferred = $q.defer()
    reader = new FileReader()
    reader.onload = (e) ->
      deferred.resolve e.target.result

    reader.readAsDataURL file
    deferred.promise

  restrict: "A"
  scope:
    image: "="
    resizeMaxHeight: "@"
    resizeMaxWidth: "@"
    resizeQuality: "@"
    resizeType: "@"

  link: postLink = (scope, element, attrs, ctrl) ->
    doResizing = (imageResult, callback) ->
      createImage imageResult.url, (image) ->
        dataURL = resizeImage(image, scope)
        imageResult.resized =
          dataURL: dataURL
          type: dataURL.match(/:(.+\/.+);/)[1]

        callback imageResult


    applyScope = (imageResult) ->
      scope.$apply ->
        
        if attrs.multiple
          scope.image.push imageResult
        else
          scope.image = imageResult


    element.bind "change", (evt) ->
      
      #when multiple always return an array of images
      scope.image = []  if attrs.multiple
      files = evt.target.files
      i = 0

      while i < files.length
        
        #create a result object for each file in files
        imageResult =
          file: files[i]
          url: URL.createObjectURL(files[i])

        fileToDataURL(files[i]).then (dataURL) ->
          imageResult.dataURL = dataURL

        if scope.resizeMaxHeight or scope.resizeMaxWidth #resize image
          doResizing imageResult, (imageResult) ->
            applyScope imageResult

        else #no resizing
          applyScope imageResult
        i++

 .factory "flow", () ->

    socket = io.connect window.location.hostname

    flow = 
      init: (types, data) ->
        socket.emit "init", 
          types: types
          data: data

      on: (name, fn) ->
        socket.on name, fn

      emit: (name, data) ->
        socket.emit name, data

    flow

 .factory "stream", () ->

  stream = 
    listeners: []
    count: 0

    watch: (fn) ->
      fn()
      stream.count += 1
      stream.update()

    done: () -> 
      stream.count -= 1
      stream.update()

    update: () ->
      for fn in stream.listeners
        fn(stream.count)

    change: (scope, name) ->
      update = (n) -> scope[name] = n
      stream.listeners.push (n) ->
        if scope.$$phase
          update n
        else
          scope.$apply () ->
            update n


  stream