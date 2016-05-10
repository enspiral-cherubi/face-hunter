import $ from 'jquery'
import faceDetection from 'jquery-facedetection'
faceDetection($)
import GIFEncoder from 'gifencoder'
import download from 'downloadjs'

var previewCanvasSize = 150;
var $previewCanvas = $(`<canvas id="preview-canvas" width="${previewCanvasSize}" height="${previewCanvasSize}"></canvas>`)
var previewCanvasContext = $previewCanvas[0].getContext('2d')
$('body').append($previewCanvas)
var encoder = new GIFEncoder(previewCanvasSize, previewCanvasSize)
var $progressIndicator = $('#progress-indicator')

var $videoPlayer = $('<video muted controls id="video-player"></video>')
var frameTime = 1 / 5

$('#video-file').on('change', function (e) {
  var videoFile = this.files[0]
  var videoSrc = window.URL.createObjectURL(videoFile)
  $videoPlayer.attr('src', videoSrc)

  var i = 0
  $videoPlayer.on('loadeddata', function () {
    this.currentTime = i
    encoder.start()
    encoder.setRepeat(0)
    // encoder.setDelay(frameTime * 1000)
    encoder.setDelay(40)
    encoder.setQuality(10)
  })

  $videoPlayer.on('seeked', function () {
    addFaceFramesToGIF()
    i += frameTime
    updateProgressIndicator(i)

    if (i < $videoPlayer[0].duration) {
      $videoPlayer[0].currentTime = i
    } else {
      encoder.finish()
      var buf = encoder.out.getData()
      var blob = new Blob([buf], {type: 'image/gif'})
      download(blob, 'meow.gif', 'image/gif')
    }
  })

  function updateProgressIndicator (i) {
    var progressValue = (i / $videoPlayer[0].duration * 100).toFixed(2)
    $progressIndicator.text(`${progressValue}%`)
  }

  function addFaceFramesToGIF () {
    $videoPlayer.faceDetection({
      interval: 1,
      minneighbors: 1,
      complete: function (faces) {
        faces.forEach((face) => {
          previewCanvasContext.drawImage($videoPlayer[0], face.x, face.y, face.width, face.height, 0, 0, previewCanvasSize, previewCanvasSize)
          encoder.addFrame(previewCanvasContext)
        })
      }
    })
  }
})
