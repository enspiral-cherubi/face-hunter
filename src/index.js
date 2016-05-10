import $ from 'jquery'

var $canvas;
var $videoPlayer;
var context;
var $thumbnailContainer = $('#thumbnail-container')
var frameTime = 1 / 30

$('#video-file').on('change', function (e) {
  var videoFile = this.files[0]
  $videoPlayer = $('#video-player')
  var videoSrc = window.URL.createObjectURL(videoFile)
  $videoPlayer.attr('src', videoSrc)

  var i = 0

  $videoPlayer.on('loadeddata', function () {
    var $this = $(this)
    $canvas = $(`<canvas id="canvas" width="${$this.width()}" height="${$this.height()}"></canvas>`)
    $('body').append($canvas)
    $videoPlayer[0].currentTime = i
  })

  $videoPlayer.on('seeked', function () {
    generateThumbnail(i)
    i += frameTime

    if (i < $videoPlayer[0].duration) {
      $videoPlayer[0].currentTime = i
    } else {
      console.log('done!')
    }
  })

  function generateThumbnail (i) {
    context = context || $canvas[0].getContext('2d')
    context.drawImage($videoPlayer[0], 0, 0, $videoPlayer.width(), $videoPlayer.height())
    // var dataURL = $canvas[0].toDataURL()
    // var $img = $(`<img src="${dataURL}"></img>`)
    // $thumbnailContainer.append($img)
  }

})
