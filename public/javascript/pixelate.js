$(function () {
  if (typeof Pixelate === "undefined") {
    window.Pixelate = {};
  }

  $.Pixelate = function () {
    var my = this;

    this.scale = 1/5,
    this.img = new Image(),
    this.canvas = document.getElementById('canvas'),
    this.scaledWidth = canvas.width*this.scale,
    this.scaledHeight = canvas.height*this.scale,
    this.ctx = canvas.getContext('2d');

    this.img.src = 'public/images/me.jpg';

    this.img.onload = function () {
      my.ctx.drawImage(my.img, 0, 0, my.scaledWidth, my.scaledHeight);
      my.ctx.drawImage(my.canvas, 0, 0, my.scaledWidth, my.scaledHeight, 0, 0, my.canvas.width, my.canvas.height);
    }

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  };
});

$(function () {
  $.Pixelate();
})
