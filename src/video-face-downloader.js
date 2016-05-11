import $ from 'jquery'
import faceDetection from 'jquery-facedetection'
faceDetection($)
import GIFEncoder from 'gifencoder'
import download from 'downloadjs'

class VideoFaceDownloader {

  constructor (opts = {}) {
    this.opts = opts
    this.$previewCanvas = $(`<canvas width="${opts.gifSize}" height="${opts.gifSize}"></canvas>`)
    this.previewCanvasContext = this.$previewCanvas[0].getContext('2d')

    this.encoder = new GIFEncoder(opts.gifSize, opts.gifSize)

    this.frameTime = 1 / opts.frameRate

    this.$videoPlayer = $('<video muted controls></video>')
  }

  downloadGIF (opts) {
    var videoSrc = window.URL.createObjectURL(opts.file)
    this.$videoPlayer.attr('src', videoSrc)

    var self = this

    var i = 0
    this.$videoPlayer.on('loadeddata', function () {
      this.currentTime = i
      self.encoder.start()
      self.encoder.setRepeat(0)
      self.encoder.setDelay(40) // 25 fps
      self.encoder.setQuality(10)
      opts.onLoad(self.$previewCanvas[0])
    })

    this.$videoPlayer.on('seeked', function () {
      i += self.frameTime

      var progressValue = (i / self.$videoPlayer[0].duration * 100).toFixed(2)
      opts.onProgress(progressValue)
      self._addFaceFramesToGIF()

      if (i < self.$videoPlayer[0].duration) {
        self.$videoPlayer[0].currentTime = i
      } else {
        self.encoder.finish()
        var buf = self.encoder.out.getData()
        var blob = new Blob([buf], {type: 'image/gif'})
        download(blob, 'meow.gif', 'image/gif')
        opts.onComplete()
      }
    })
  }

  _addFaceFramesToGIF () {
    var self = this

    this.$videoPlayer.faceDetection({
      interval: 1,
      minneighbors: 1,
      complete: function (faces) {
        faces.forEach((face) => {
          self.previewCanvasContext.drawImage(self.$videoPlayer[0], face.x, face.y, face.width, face.height, 0, 0, self.opts.gifSize, self.opts.gifSize)
          self.encoder.addFrame(self.previewCanvasContext)
        })
      }
    })
  }

}

export default VideoFaceDownloader
