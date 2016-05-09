import $ from 'jquery'

$('#video').on('change', function (e) {
  var video = this.files[0]
  console.log('video: ', video)
})
