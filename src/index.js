import $ from 'jquery'
import downloadFacesFromVideoAsGIF from './download-faces-from-video-as-gif.js'
var $progressIndicator = $('#progress-indicator')

$('#video-file').on('change', function (e) {
  downloadFacesFromVideoAsGIF({
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
