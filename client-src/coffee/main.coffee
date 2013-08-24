angular.module('beviewed', ["ng", "ui.bootstrap", "ngAnimate"])

 .config ($sceDelegateProvider) ->
    youtubeResource = /^\/\/www\.youtube\.com\/embed\/.*$/
    soundCloudResource = /^https\:\/\/w\.soundcloud\.com\/player\/.*$/
    $sceDelegateProvider.resourceUrlWhitelist ["self", youtubeResource]

 .directive "embeder", ($sce) ->
    restrict: 'A'
    scope: 
      media: "=embeder"
      mediaData: "=embederSrc"
    template: "<div class='media' ng-switch on='media'>
        <iframe class='embed sc' ng-switch-when='sc' scrolling='no' frameborder='no' ng-src='{{soundCloud}}'></iframe>
        <iframe class='embed yt' ng-switch-when='yt' ng-src='{{youTube}}' frameborder='no' allowfullscreen></iframe>
        <div ng-switch-when='da' ng-bind-html='deviantArt'>
        </div>
      </div>"
    link: (scope, el, attrs) ->

      handleChange = () ->
        console.log "changing", scope.media, scope.mediaData
        if scope.media == "sc"
          scope.soundCloud = $sce.trustAsResourceUrl scope.mediaData
        else if scope.media == "yt"
          scope.youTube = $sce.trustAsResourceUrl "http://www.youtube.com/embed/#{scope.mediaData}"
        else if scope.media == "da"
          scope.deviantArt == "<embed class='embed da' ng-switch-when='da' src='http://backend.deviantart.com/embed/view.swf?1' type='application/x-shockwave-flash' width='450' height='589' flashvars='id=#{scope.mediaData}' allowscriptaccess='always'></embed>"

      scope.$watch "media", handleChange
      scope.$watch "mediaData", handleChange

      handleChange()

 .directive "ssv", () ->
    restrict: 'A'
    link: (scope, el, attrs) ->
      scope[attrs.ssv] = el.html()

 .directive "community", () ->
    restrict: 'A'
    replace: true
    scope:
      getCommunity: "&community"
      link: "="
      click: "&ngClick"
    template: "
    <div class='media'>
      <a href='{{ genLink() }}'>
        <img ng-click='delegate()' class='community img-rounded media-object'
          ng-src='/img/icons/{{community}}' />
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


 .directive "user", () ->
    restrict: 'A' 
    replace: true
    scope:
      getUser: "&user"
    template: "
      <div class='media'>
        <a href='/profile/{{user}}'>
          <img class='user img-rounded media-object'
            ng-src='/img/users/{{user}}' /></a></div>"
    link: (scope) ->
      scope.user = scope.getUser()

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
        
        #console.log(imageResult);
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

