(function () {
  if (typeof Pixelate === 'undefined') {
    window.Pixelate = {};
  }

  $.Pixelate = function (options) {
    var my = this;

    this.steps = 10;
    this.timeout = 50;
    this.transitionStep = [];

    this.scale = 1/6;
    this.img = new Image();
    this.canvas = options.el;
    this.scaledWidth = this.canvas.width*this.scale;
    this.scaledHeight = this.canvas.height*this.scale;
    this.ctx = this.canvas.getContext('2d');

    this.img.src = this.canvas.getAttribute('pixelate-src');

    this.img.onload = function (arg) {
      my.ctx.drawImage(my.img, 0, 0, my.canvas.width, my.canvas.height);
      my.originalImageData = my.ctx.getImageData(0, 0, my.canvas.width, my.canvas.height).data;

      my.ctx.drawImage(my.img, 0, 0, my.scaledWidth, my.scaledHeight);
      my.ctx.drawImage(my.canvas, 0, 0, my.scaledWidth, my.scaledHeight, 0, 0, my.canvas.width, my.canvas.height);

      my.averagePixels();
    };

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.bindEvents();
  };

  $.Pixelate.prototype.averagePixels = function () {
    var pixelIdx, color, avg, roundedAvg,
        imgPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        imgData = imgPixels.data;

    for (pixelIdx = 0; pixelIdx < imgData.length; pixelIdx += 4) {
      avg = (imgData[pixelIdx] + imgData[pixelIdx + 1] + imgData[pixelIdx + 2]) / 3;
      roundedAvg = Math.floor(avg/16) * 16;
      for (color = 0; color <= 2; color++) {
        // to transition we need to store an amount to increment by evenly at each step
        this.transitionStep[pixelIdx + color] = ((this.originalImageData[pixelIdx + color] - roundedAvg)/this.steps);
        // setting the image to sixteen color grayscale
        imgData[pixelIdx + color] = roundedAvg;
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
  };

  $.Pixelate.prototype.eachPixel = function (callback) {
    var pixelIdx, color, pixel,
        imgPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
        imgData = imgPixels.data;

    for (pixelIdx = 0; pixelIdx < imgData.length; pixelIdx += 4) {
      for (color = 0; color <= 2; color++) {
        pixel = imgPixels.data[pixelIdx + color];
        imgPixels.data[pixelIdx + color] = callback(pixel, pixelIdx, color);
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
  };

  $.Pixelate.prototype.bindEvents = function () {
    var my = this;

    this.canvas.addEventListener("mouseenter", function (event) {
      my.stepCount = 0;

      my.enterInterval = setInterval(function () {
        console.log('enter step', my.stepCount);
        my.eachPixel(function (pixel, pixelIdx, color) {
          return pixel + my.transitionStep[pixelIdx + color];
        });

        my.stepCount++;

        if (my.stepCount >= my.steps) {
          clearInterval(my.enterInterval)
          my.transitioning = false;
        }
      }, my.timeout);
    });

    this.canvas.addEventListener("mouseleave", function (event) {
      if (my.enterInterval) {
        clearInterval(my.enterInterval);
        my.enterInterval = 0;

        var interval = setInterval(function () {
          console.log('leave step', my.stepCount);
          if (!my.stepCount) {
            clearInterval(interval);
            my.transitioning = false;
            return;
          }

          my.eachPixel(function (pixel, pixelIdx, color) {
            return pixel - my.transitionStep[pixelIdx + color];
          });

          my.stepCount--;
        }, my.timeout);
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
