import $ from 'jquery'
import faceDetection from 'jquery-facedetection'
faceDetection($)
import GIFEncoder from 'gifencoder'
import download from 'downloadjs'

function downloadFacesFromVideoAsGIF (args) {
  var { gifSize, frameRate, file, onLoad, onProgress, onComplete } = args

  var $canvas = $(`<canvas width="${gifSize}" height="${gifSize}"></canvas>`)
  var context = $canvas[0].getContext('2d')
  var encoder = new GIFEncoder(gifSize, gifSize)
  var $video = $('<video muted></video>')

  var videoSrc = window.URL.createObjectURL(file)
  $video.attr('src', videoSrc)

  var i = 0
  $video.on('loadeddata', function () {
    this.currentTime = i
    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(40) // 25 fps
    encoder.setQuality(10)
    if (onLoad) { onLoad($canvas[0]) }
  })

  $video.on('seeked', function () {
    i += 1 / frameRate

    $(this).faceDetection({
      interval: 4,
      minneighbors: 4,
      complete: (faces) => {
        faces.forEach((face) => {
          context.drawImage(this, face.x, face.y, face.width, face.height, 0, 0, gifSize, gifSize)
          encoder.addFrame(context)
        })
      }
    })

    if (i < this.duration) {
      this.currentTime = i
      if (onProgress) { onProgress((this.currentTime / this.duration * 100).toFixed(2)) }
    } else {
      encoder.finish()
      var blob = new Blob([encoder.out.getData()], {type: 'image/gif'})
      download(blob, 'meow.gif', 'image/gif')
      if (onComplete) { onComplete() }
    }
  })
}

export default downloadFacesFromVideoAsGIF
