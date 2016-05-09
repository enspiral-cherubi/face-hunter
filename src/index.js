import $ from 'jquery'

$('#video-file').on('change', function (e) {
  var videoFile = this.files[0]
  var video = $('#video-player')[0]
  var videoSrc = window.URL.createObjectURL(videoFile)
  video.src = videoSrc
  video.play()
})
