import $ from 'jquery'
import downloadFacesFromVideoAsGIF from './download-faces-from-video-as-gif.js'
var $progressIndicator = $('#progress-indicator')

$('#video-file').on('change', function (e) {
  downloadFacesFromVideoAsGIF({
    gifSize: 150,
    frameRate: 5,
    file: this.files[0],
    onLoad: function (canvas) {
      $('img').remove()
      $('body').append(canvas)
    },
    onProgress: function (progress) {
      $progressIndicator.text(`${progress}%`)
    },
    onComplete: function (blob) {
      $('canvas').remove()
      var src = window.URL.createObjectURL(blob)
      var $gif = $(`<img src="${src}"/>`)
      $('body').append($gif)
      $progressIndicator.text('100%')
    }
  })
})
