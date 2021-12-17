$('#omnibox').keypress(function(e) {
  if (e.which === 13) {
    $(this).blur();
    let val = $(this).val();
    if (/((https?:\/\/)?(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.exec(val)) {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        view[0].loadURL(val);
      } else {
        view[0].loadURL('http://'+ val);
      }
    } else {
      const searchurlValue = localStorage.getItem('searchurl');
      if (searchurlValue) {
        view[0].loadURL(searchurlValue + val);
      } else {
        view[0].loadURL('https://www.google.com/search?q=' + val);
      }
    }
  }
});


$('#newtab-button').click(function() {
  createTab();
});


$('#more-button').click(function() {
  toggleMoreMenu();
});


$('#reload').click(function(e) {
  if (e.ctrlKey) {
    view[0].reloadIgnoringCache();
  } else {
    view[0].reload();
  }
});


$('#back').click(function() {
  view[0].goBack();
});


$('#forward').click(function() {
  view[0].goForward();
});


$('#close').click(function() {
  closeTab();
});


$('#menu').children().click(function () {
  hideMenu();
});


$('#menu-inspect').click(function() {
  view[0].openDevTools();
});


$('#menu-reload').click(function() {
  view[0].reload();
});


$('#menu-back').click(function() {
  view[0].goBack();
});


$('#menu-forward').click(function() {
  view[0].goForward();
});


$('#cover').click(function() {
  hideMenu();
});


$('#more').children().click(function() {
  toggleMoreMenu();
});


$('#more-settings').click(function() {
  openSettings();
});


$('#more-github').click(function() {
  createTab('https://github.com/mystpi/ninetails');
});


$('#settings-done').click(function() {
  saveSettings();
});


$('#settings-cancel').click(function() {
  hideSettings();
});


/**
 * Add event listeners to a webview
 * @param {jQuery} view - The webview the event listeners will be added to
 * @param {string} hash - The hash of the webview
 */
function addListenersToView(view, hash) {
  let tab = $('#tab-' + hash);
  
  view.on('did-stop-loading', function() {
    if (hash === activeHash) {
      $('#omnibox').val(view[0].getURL());
      checkSSL(view[0].getURL());
      grayOut();
    }
    tab.removeClass('animate-pulse');
    setTitle(tab, view[0].getTitle());
    view[0].insertCSS(`::selection {
      color: white !important;
      background: rgb(99, 102, 241) !important;
    }`);
  });


  view.on('load-commit', function(e) {
    if (hash === activeHash && e.originalEvent.isMainFrame) {
      $('#omnibox').val(e.originalEvent.url);
    }
  });


  view.on('did-start-loading', function() {
    tab.addClass('animate-pulse');
  });


  view.on('page-title-updated', function(e) {
    setTitle(tab, e.originalEvent.title);
  });


  view.on('context-menu', function(e) {
    $('#menu').fadeIn(75).css({
      'left': e.originalEvent.params.x + 'px',
      'top': e.originalEvent.params.y + 'px'
    });
    $('#cover').fadeIn(75);
  });


  view.on('new-window', (e) => {
    createTab(e.originalEvent.url);
  });
  

  view.on('update-target-url', (e) => {
    if (e.originalEvent.url) {
      $('#target').text(e.originalEvent.url).css('opacity', '1');
    } else {
      if ($('#target').css('opacity')) {
        $('#target').css('opacity', '0');
      }
    }
  });

  
  view.on('page-favicon-updated', (e) => {
    if (e.originalEvent.favicons.length > 0) {
      let icon = e.originalEvent.favicons[0];
      let img = tab.children('img');
      img.attr('src', icon);
    }
  });
}