import $ from 'jquery'
import videoFaceDownloader from './video-face-downloader.js'
var $progressIndicator = $('#progress-indicator')

$('#video-file').on('change', function (e) {
  videoFaceDownloader({
    gifSize: 150,
    frameRate: 10,
    file: this.files[0],
    onLoad: function (canvas) {
      $('body').append(canvas)
    },
    onProgress: function (progress) {
      $progressIndicator.text(`${progress}%`)
    },
    onComplete: function () {
      $progressIndicator.text('100%')
    }
  })
})
