import $ from 'jquery'
import faceDetection from 'jquery-facedetection'
faceDetection($)
import Frame from 'canvas-to-buffer'
import jug from 'image-juggler'

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
    generateFaceThumbnails(i)
    i += frameTime

    if (i < $videoPlayer[0].duration) {
      $videoPlayer[0].currentTime = i
    } else {
      console.log('done!')
    }
  })

  function generateFaceThumbnails (i) {
    context = context || $canvas[0].getContext('2d')
    context.drawImage($videoPlayer[0], 0, 0, $videoPlayer.width(), $videoPlayer.height())

    $canvas.faceDetection({
      complete: function (faces) {
        if (faces && faces.length > 0) {
          faces.forEach((face) => {
            let imageData = context.getImageData(face.x, face.y, face.width, face.height)
            jug.imageDataToImage(imageData, null, (err, img) => {
              $thumbnailContainer.append(img)
            })
          })
        }
      }
    })

    // var dataURL = $canvas[0].toDataURL()
    // var $img = $(`<img src="${dataURL}"></img>`)
    // $thumbnailContainer.append($img)
  }

})
