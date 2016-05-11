import $ from 'jquery'
import faceDetection from 'jquery-facedetection'
faceDetection($)
import GIFEncoder from 'gifencoder'
import download from 'downloadjs'

class VideoFaceDownloader {

  constructor (opts = {}) {
    this.opts = opts
    this.$canvas = $(`<canvas width="${opts.gifSize}" height="${opts.gifSize}"></canvas>`)
    this.context = this.$canvas[0].getContext('2d')
    this.encoder = new GIFEncoder(opts.gifSize, opts.gifSize)
    this.$video = $('<video muted></video>')
  }

  downloadGIF (opts) {
    var videoSrc = window.URL.createObjectURL(opts.file)
    this.$video.attr('src', videoSrc)

    var self = this

    var i = 0
    this.$video.on('loadeddata', function () {
      this.currentTime = i
      self.encoder.start()
      self.encoder.setRepeat(0)
      self.encoder.setDelay(40) // 25 fps
      self.encoder.setQuality(10)
      opts.onLoad(self.$canvas[0])
    })

    this.$video.on('seeked', function () {
      i += 1 / self.opts.frameRate
      
      self._addFaceFramesToGIF()

      if (i < self.$video[0].duration) {
        self.$video[0].currentTime = i
        opts.onProgress(self._downloadProgress())
      } else {
        self.encoder.finish()
        var blob = new Blob([self.encoder.out.getData()], {type: 'image/gif'})
        download(blob, 'meow.gif', 'image/gif')
        opts.onComplete()
      }
    })
  }

  // 'private'

  _addFaceFramesToGIF () {
    this.$video.faceDetection({
      interval: 1,
      minneighbors: 1,
      complete: (faces) => {
        faces.forEach((face) => {
          this.context.drawImage(this.$video[0], face.x, face.y, face.width, face.height, 0, 0, this.opts.gifSize, this.opts.gifSize)
          this.encoder.addFrame(this.context)
        })
      }
    })
  }

  _downloadProgress () {
    return (this.$video[0].currentTime / this.$video[0].duration * 100).toFixed(2)
  }

}

export default VideoFaceDownloader
