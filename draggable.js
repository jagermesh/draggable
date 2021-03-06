/* global jQuery */

if (jQuery) {
  (function($) {

    function makeDraggable(ctrl, options) {

      const _this = this;

      let dragObject = null;
      let dragHandler = null;

      options = options || {};
      options.exclude = [ 'INPUT', 'TEXTAREA', 'SELECT', 'A', 'BUTTON' ];

      if (options.handler) {
        dragHandler = ctrl.querySelector(options.handler);
      } else {
        dragHandler = ctrl;
      }

      function setPosition(element, left, top) {
        element.style.marginTop = '0px';
        element.style.marginLeft = '0px';
        element.style.left = left + 'px';
        element.style.top = top + 'px';
      }

      let drg_h, drg_w, pos_y, pos_x, ofs_x, ofs_y;

      ctrl.style.cursor = 'move';
      ctrl.style.position = 'fixed';

      function downHandler(e) {
        if (e.button === 0) {
          const target = e.target || e.srcElement;
          const parent = target.parentNode;

          if (target && (options.exclude.indexOf(target.tagName.toUpperCase()) == -1)) {
            if (!parent || (options.exclude.indexOf(parent.tagName.toUpperCase()) == -1)) {  // img in a
              dragObject = ctrl;

              let pageX = e.pageX || e.touches[0].pageX;
              let pageY = e.pageY || e.touches[0].pageY;

              ofs_x = dragObject.getBoundingClientRect().left - dragObject.offsetLeft;
              ofs_y = dragObject.getBoundingClientRect().top  - dragObject.offsetTop;

              pos_x = pageX - (dragObject.getBoundingClientRect().left + document.body.scrollLeft);
              pos_y = pageY - (dragObject.getBoundingClientRect().top  + document.body.scrollTop);

              e.preventDefault();
            }
          }
        }
      }

      function moveHandler(e) {
        if (dragObject !== null) {
          const pageX = e.pageX || e.touches[0].pageX;
          const pageY = e.pageY || e.touches[0].pageY;
          let left = pageX - pos_x - ofs_x - document.body.scrollLeft;
          let top  = pageY - pos_y - ofs_y - document.body.scrollTop;
          if (top < 0) {
            top = 0;
          }
          if (top > window.innerHeight) {
            top = window.innerHeight - 40;
          }
          if (left < 0) {
            left = 0;
          }

          setPosition(dragObject, left, top);
          if (options.ondrag) {
            options.ondrag.call(e);
          }
        }
      }

      function upHandler(e) {
        if (dragObject !== null) {
          dragObject = null;
        }
      }

      dragHandler.addEventListener('mousedown', function(e) {
        downHandler(e);
      });

      window.addEventListener('mousemove', function(e) {
        moveHandler(e);
      });

      window.addEventListener('mouseup', function(e) {
        upHandler(e);
      });

      dragHandler.addEventListener('touchstart', function(e) {
        downHandler(e);
      });

      window.addEventListener('touchmove', function(e) {
        moveHandler(e);
      });

      window.addEventListener('touchend', function(e) {
        upHandler(e);
      });

      return _this;

    }

    $.fn.makeDraggable = function(options) {
      if (this.length > 0) {
        makeDraggable(this[0], options);
      }
      return this;
    };

  })(jQuery);
}