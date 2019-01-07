$(function () {

  var isMobile;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;

    // Mobile height fix
    $('.height-fix').each(function () {
      var h = $(this).height();
      $(this).height(h)
    })
  }

  // RESIZE RESETS
  $(window).resize(function () {
    posFilterBar($('.filter').first());
  });

  // Sticky Nav on Mobile
  if (isMobile) {
    $('nav').addClass('fixed');
  } else {
    $('nav').addClass('desk');
  }

  // TYPEWRITER INTRO
  let TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };

  TxtType.prototype.tick = function () {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    let that = this;
    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  };

  window.onload = function () {
    let elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i++) {
      let toRotate = elements[i].getAttribute('data-type');
      let period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
  };



  // NAV POSITION
  var navPos = $('nav').position().top;
  var lastPos = 0;
  var lockTimer

  $(window).on('scroll', function () {

    var pos = $(window).scrollTop();
    var pos2 = pos + 50;
    var scrollBottom = pos + $(window).height();

    if (!isMobile) {
      if (pos >= navPos + $('nav').height() && lastPos < pos) {
        $('nav').addClass('fixed');
      }
      if (pos < navPos && lastPos > pos) {
        $('nav').removeClass('fixed');
      }
      lastPos = pos;
    }

    // Link Highlighting
    if (pos2 > $('#home').offset().top) { highlightLink('home'); }
    if (pos2 > $('#about').offset().top) { highlightLink('about'); }
    if (pos2 > $('#portfolio').offset().top) { highlightLink('portfolio'); }
    // if (pos2 > $('#blog').offset().top) { highlightLink('blog'); }
    if (pos2 > $('#contact').offset().top ||
      pos + $(window).height() === $(document).height()) {
      highlightLink('contact');
    }

    // Prevent Hover on Scroll
    clearTimeout(lockTimer);
    if (!$('body').hasClass('disable-hover')) {
      $('body').addClass('disable-hover')
    }

    lockTimer = setTimeout(function () {
      $('body').removeClass('disable-hover')
    }, 500);
  });

  function highlightLink(anchor) {
    $('nav .active').removeClass('active');
    $("nav").find('[dest="' + anchor + '"]').addClass('active');
  }


  // EVENT HANDLERS
  $('.page-link').click(function () {
    var anchor = $(this).attr("dest");
    $('.link-wrap').removeClass('visible');

    $('nav span').removeClass('active');
    $("nav").find('[dest="' + anchor + '"]').addClass('active');

    $('html, body').animate({
      scrollTop: $('#' + anchor).offset().top
    }, 400);
  });

  $('.mdi-menu').click(function () {
    $('.link-wrap').toggleClass('visible');
  });

  posFilterBar($('.filter').first());

  $('.filter').click(function () {
    posFilterBar(this);
  });

  function posFilterBar(elem) {
    var origin = $(elem).parent().offset().left;
    var pos = $(elem).offset().left;
    $('.float-bar').css({
      left: pos - origin,
      width: $(elem).innerWidth()
    });
    $('.float-bar .row').css('left', (pos - origin) * -1);
  }


  // FUN FACT CAROUSEL //
  $("#slideshow > div:gt(0)").hide();

  setInterval(function () {
    $('#slideshow > div:first')
      .fadeOut(0)
      .next()
      .fadeIn(0)
      .end()
      .appendTo('#slideshow');
  }, 5000);
  ///////////////////////////////////////////////////////////////


  // GALLERY
  $('#gallery').mixItUp({});

  function mixClear() {
    setTimeout(function () { $('#gallery').removeClass('waypoint') }, 2000);
  }

  // SCROLL ANIMATIONS
  function onScrollInit(items, elemTrigger) {
    var offset = $(window).height() / 1.6
    items.each(function () {
      var elem = $(this),
        animationClass = elem.attr('data-animation'),
        animationDelay = elem.attr('data-delay');

      elem.css({
        '-webkit-animation-delay': animationDelay,
        '-moz-animation-delay': animationDelay,
        'animation-delay': animationDelay
      });

      var trigger = (elemTrigger) ? trigger : elem;

      trigger.waypoint(function () {
        elem.addClass('animated').addClass(animationClass);
        if (elem.get(0).id === 'gallery') mixClear(); //OPTIONAL
      }, {
          triggerOnce: true,
          offset: offset
        });
    });
  }

  setTimeout(function () { onScrollInit($('.waypoint')) }, 10);

  // CONTACT FORM

  $('#contact-form').submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: "https://formspree.io/paul@pauljmphoto.com",
      method: "POST",
      data: { message: $('form').serialize() },
      dataType: "json"
    }).done(function (response) {
      $('#success').addClass('expand');
      $('#contact-form').find("input[type=text], input[type=email], textarea").val("");
    });
  });

  $('#close').click(function () {
    $('#success').removeClass('expand');
  })

});
