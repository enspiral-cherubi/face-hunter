import $ from 'jquery'
import downloadFacesFromVideoAsGIF from './download-faces-from-video-as-gif.js'
var $progressIndicator = $('#progress-indicator')

$('#upload-btn').click(() => {
  $('#video-file').trigger('click')
})

$('#video-file').on('change', function (e) {
  downloadFacesFromVideoAsGIF({
    gifSize: 200, // 100 -- 500
    frameRate: 5, // 1 -- 25
    file: this.files[0],
    onLoad: function (canvas) {
      $('img').remove()
      $('#upload-btn').hide()
      $('#progress-container').show()
      $('#upload-container').append(canvas)
    },
    onProgress: function (progress) {
      $progressIndicator.text(`${progress}% processed . . .`)
    },
    onComplete: function (blob) {
      $('canvas').remove()
      var src = window.URL.createObjectURL(blob)
      var $gif = $(`<img src="${src}"/>`)
      $('#upload-container').append($gif)
      $progressIndicator.text('100%')
      $('#upload-btn').show()
      $('#progress-container').hide()
    }
  })
})
