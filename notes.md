#### currently

  - user uploads video
  - html5 video created from file blob
  - on video load, encoder started, and initialized with repeat, delay, and quality
  - skip frame by frame through video, and for each frame:
    - draw html5's current image to a canvas
    - detect faces from that canvas
    - for each detected face
      - draw face to croppedCanvas
      - add croppedCanvas frame to encoder
  - when finished:
    - finish encoder
    - get encoderData
    - create GIF blob
    - download blob as GIF

#### optimization strategies

  - can we extract faces, directly from HTML5 video, instead of sending to canvas and then reading from canvas?
  - send raw 1D rgba bitmap to gifencoder via stream
  - use face's scalex and scaley to avoid rawCanvas vs croppedCanvas? (hmm idk)
  - let user choose what frame rate they want
  - experiment with GIF quality
