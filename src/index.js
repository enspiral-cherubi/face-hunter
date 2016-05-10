import $ from 'jquery'
import faceDetection from 'jquery-facedetection'
faceDetection($)
import Frame from 'canvas-to-buffer'
import GIFEncoder from 'gifencoder'
import download from 'downloadjs'

var croppedCanvasSize = 150;
var $croppedCanvas = $(`<canvas id="cropped-canvas" width="${croppedCanvasSize}" height="${croppedCanvasSize}"></canvas>`)
var croppedCanvasContext = $croppedCanvas[0].getContext('2d')
$('body').append($croppedCanvas)
var encoder = new GIFEncoder(croppedCanvasSize, croppedCanvasSize)

var $videoPlayer;
var frameTime = 1 / 3

$('#video-file').on('change', function (e) {
  var videoFile = this.files[0]
  $videoPlayer = $('#video-player')
  var videoSrc = window.URL.createObjectURL(videoFile)
  $videoPlayer.attr('src', videoSrc)

  var i = 0
  $videoPlayer.on('loadeddata', function () {
    var $this = $(this)

    $videoPlayer[0].currentTime = i
    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(frameTime)
    encoder.setQuality(10)
  })

  $videoPlayer.on('seeked', function () {
    addFaceFramesToGIF()
    i += frameTime

    if (i < $videoPlayer[0].duration) {
      $videoPlayer[0].currentTime = i
    } else {
      encoder.finish()
      var buf = encoder.out.getData()
      var blob = new Blob([buf], {type: 'image/gif'})
      download(blob, 'meow.gif', 'image/gif')
    }
  })

  function addFaceFramesToGIF () {

    $videoPlayer.faceDetection({
      minneighbors: 4,
      complete: function (faces) {
        faces.forEach((face) => {
          croppedCanvasContext.drawImage($videoPlayer[0], face.x, face.y, face.width, face.height, 0, 0, croppedCanvasSize, croppedCanvasSize)
          encoder.addFrame(croppedCanvasContext)
        })
      }
    })
  }
})
