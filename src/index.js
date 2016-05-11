import $ from 'jquery'
import downloadFacesFromVideoAsGIF from './download-faces-from-video-as-gif.js'
var $progressIndicator = $('#progress-indicator')

$('#upload-btn').click(() => {
  $('#video-file').trigger('click')
})

$('#video-file').on('change', function (e) {
  downloadFacesFromVideoAsGIF({
    gifSize: 200, // 100 -- 500
    frameRate: 1, // 1 -- 25
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
      var $gif = $(`<img id="gif" src="${src}"/>`)
      $('#upload-container').append($gif)
      $progressIndicator.text('100.00%')
      $('#upload-btn').show()
      $('#progress-container').hide()
      $('#progress-indicator').text('')
    }
  })
})
