import $ from 'jquery'

import VideoFaceDownloader from './video-face-downloader.js'

var $progressIndicator = $('#progress-indicator')

var videoFaceDownloader = new VideoFaceDownloader({
  gifSize: 150,
  frameRate: 1
})

$('#video-file').on('change', function (e) {
  var videoFile = this.files[0]

  videoFaceDownloader.downloadGIF({
    file: videoFile,
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
