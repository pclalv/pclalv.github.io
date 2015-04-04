$(function () {
  if (typeof Pixelate === "undefined") {
    window.Pixelate = {};
  }

  $.Pixelate = function () {
    var my = this;

    this.scale = 1/6,
    this.img = new Image(),
    this.canvas = document.getElementById('canvas'),
    this.scaledWidth = canvas.width*this.scale,
    this.scaledHeight = canvas.height*this.scale,
    this.ctx = canvas.getContext('2d');

    this.img.src = 'public/images/me.jpg';

    this.img.onload = function () {
      my.ctx.drawImage(my.img, 0, 0, my.scaledWidth, my.scaledHeight);
      my.ctx.drawImage(my.canvas, 0, 0, my.scaledWidth, my.scaledHeight, 0, 0, my.canvas.width, my.canvas.height);

      var imgPixels = my.ctx.getImageData(0, 0, my.canvas.width, my.canvas.height);
      for(var y = 0; y < imgPixels.height; y++){
          for(var x = 0; x < imgPixels.width; x++){
              var i = (y * 4) * imgPixels.width + x * 4; //Why is this multiplied by 4?
              var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3; //Is this getting the average of the values of each channel R G and B, and converting them to BW(?)
              imgPixels.data[i] = avg;
              imgPixels.data[i + 1] = avg;
              imgPixels.data[i + 2] = avg;
          }
      }
      my.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    }

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  };
});

$(function () {
  $.Pixelate();
})
