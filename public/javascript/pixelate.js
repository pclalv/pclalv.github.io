(function () {
  if (typeof Pixelate === 'undefined') {
    window.Pixelate = {};
  }

  $.Pixelate = function (options) {
    var my = this;

    this.stepSize = 1;
    this.transitionStep = [];

    this.scale = 1/6;
    this.img = new Image();
    this.canvas = options.el;
    this.scaledWidth = this.canvas.width*this.scale;
    this.scaledHeight = this.canvas.height*this.scale;
    this.ctx = this.canvas.getContext('2d');

    this.img.src = this.canvas.getAttribute('pixelate-src');

    this.img.onload = function () {
      my.ctx.drawImage(my.img, 0, 0, my.scaledWidth, my.scaledHeight);
      my.ctx.drawImage(my.canvas, 0, 0, my.scaledWidth, my.scaledHeight, 0, 0, my.canvas.width, my.canvas.height);

      my.averagePixels();
    };

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.bindEvents();
  };

  $.Pixelate.prototype.averagePixels = function () {
    var x, y, i, j, avg, roundedAvg;

    var imgPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    // for (y = 0; y < imgPixels.height; y++) {
    //   for (x = 0; x < imgPixels.width; x++) {
    //     i = (y * 4) * imgPixels.width + x * 4;
    //     avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
    //     roundedAvg = Math.floor(avg/16) * 16;
    //
    //     for (j = 0; j <= 2; j++) {
    //       // to transition we need to store an amount to increment by evenly at each step
    //       this.transitionStep[i + j] = ((imgPixels.data[i + j] - roundedAvg)/this.stepSize);
    //
    //       // setting the image to sixteen grayscale
    //       imgPixels.data[i + j] = roundedAvg;
    //     }
    //   }
    // }

    var imgData = imgPixels.data;
    for (i = 0; i < imgData.length; i += 4) {
      avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
      roundedAvg = Math.floor(avg/16) * 16;

      for (j = 0; j <= 2; j++) {
        // to transition we need to store an amount to increment by evenly at each step
        this.transitionStep[i + j] = ((imgPixels.data[i + j] - roundedAvg)/this.stepSize);

        // setting the image to sixteen grayscale
        imgPixels.data[i + j] = roundedAvg;
      }
    }


    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
  };

  $.Pixelate.prototype.bindEvents = function () {
    var x, y, step, i, j, avg,
        my = this;

    this.canvas.addEventListener("mouseenter", function (event) {
      var imgPixels = my.ctx.getImageData(0, 0, my.canvas.width, my.canvas.height);
      for (step = 0; step < my.stepSize; step++) {
        console.log('step');
        for (y = 0; y < imgPixels.height; y++) {
          for (x = 0; x < imgPixels.width; x++) {
            i = (y * 4) * imgPixels.width + x * 4;

            for (j = 0; j <= 2; j++) {
              imgPixels.data[i + j] = imgPixels.data[i + j] + my.transitionStep[i + j];
            }

          }
        }
        my.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
      }
    });
  };

  $.fn.pixelate = function () {
    return this.each(function () {
      new $.Pixelate({
        el: this
      });
    });
  };
})();

$(function () {
  $('.pixelate').pixelate();
});
