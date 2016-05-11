import $ from 'jquery'
import downloadFacesFromVideoAsGIF from './download-faces-from-video-as-gif.js'
import bowser from 'bowser'
var $progressIndicator = $('#progress-indicator')

if (bowser.chrome || bowser.firefox) {
  $('#content').show()
} else {
  $('#browser-warning-screen').show()
}

$('#upload-btn').click(() => {
  $('#video-file').trigger('click')
})

$('.range-input').on('input', function () {
  var selector = `#${$(this).attr('id')}-value`
  $(selector).text($(this).val())
})

$('#video-file').on('change', function (e) {
  var gifSize = parseInt($('#gif-size-range-value').text())
  var frameRate = parseInt($('#frame-rate-range-value').text())

  downloadFacesFromVideoAsGIF({
    gifSize: gifSize,
    frameRate: frameRate,
    file: this.files[0],
    onLoad: function (canvas) {
      $('img').remove()
      $('#upload-params').hide()
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
      $('#upload-params').show()
      $('#progress-container').hide()
      $('#progress-indicator').text('')
    }
  })
})
