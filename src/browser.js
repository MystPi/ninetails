/* == GLOBALS == */


let view;
let version;
let activeHash = '0';


/* == FUNCTIONS == */


/**
 * Set the title of a tab
 * @param {jQuery} tab
 * @param {string} title
 */
function setTitle(tab, title) {
  tab.children('span').text(title);
}


/**
 * Switch the active tab
 * @param {string} tab - The hash of the tab to switch to
 */ 
function switchTabs(tab) {
  $('.active-tab').removeClass('active-tab').addClass('tab');
  $('#tab-' + tab).addClass('active-tab').removeClass('tab');
  $('.view').hide();
  $('#view-' + tab).css('display', 'flex');

  view = $('#view-' + tab);
  activeHash = tab;

  omnibox.value = view[0].getURL();
  checkSSL(view[0].getURL());
  grayOut();
}


/**
 * Create a tab and append it to the tabbar
 * @param {string} [url] - If present, the new tab's URL will be set to this, otherwise it will be set to the default homepage
 */
function createTab(url) {
  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const uaValue = localStorage.getItem('ua');

  $(`<button class="tab" id="tab-${hash}"><img src="./icons/favicon.png"><span>New Tab</span></button>`)
    .click(function() {
      switchTabs(hash);
    })
    .appendTo('#tabbar');

  let view = $(`
    <webview
      class="view"
      id="view-${hash}"
      allowpopups
      webpreferences="nativeWindowOpen=true"
      useragent="${uaValue ? uaValue : 'Ninetails/' + version}">
    </webview>
  `);

  if (url) {
    view.attr('src', url);
  } else {
    const homepageValue = localStorage.getItem('homepage');
    if (homepageValue) {
      view.attr('src', homepageValue);
    } else {
      const searchurlValue = localStorage.getItem('searchurl');
      if (searchurlValue) { 
        view.attr('src', 'https://ninetails.cf/?v=' + version + '&e=' + searchurlValue);
      } else { 
        view.attr('src', 'https://ninetails.cf/?v=' + version);
      }
    }
  }

  view.appendTo('#views')
  addListenersToView(view, hash);
  switchTabs(hash);
}


/** Toggle the visibility of the 'more' menu */
function toggleMoreMenu() {
  $('#more').fadeToggle(75);
}


/** Open the settings menu */
function openSettings() {
  $('#settings-searchurl').val(localStorage.getItem('searchurl'));
  $('#settings-homepage').val(localStorage.getItem('homepage'));
  $('#settings-ua').val(localStorage.getItem('ua')).attr('placeholder', 'Ninetails/' + version);
  $('#settings').fadeIn(75);
}


/** Hide the settings menu */
function hideSettings() {
  $('#settings').fadeOut(75);
}


/** Save any changed settings to localStorage */
function saveSettings() {
  hideSettings();

  localStorage.setItem('searchurl', $('#settings-searchurl').val());
  localStorage.setItem('homepage', $('#settings-homepage').val());
  localStorage.setItem('ua', $('#settings-ua').val());
}


/** Hide the right-click menu */
function hideMenu() {
  $('#menu, #cover').fadeOut(75);
}


/** Close the active tab and switch to a new one */
function closeTab() {
  let tabs = $('[id^="tab-"]');
  if (tabs.length > 1) {
    let temp = activeHash;
    if (temp !== tabs[0].id.slice(4)) {
      switchTabs(tabs[0].id.slice(4));
    } else {
      switchTabs(tabs[1].id.slice(4));
    }
    $('#tab-' + temp).remove();
    $('#view-' + temp).remove();
  }
}


/**
 * Check the security of a URL
 * @param {string} url - The URL to be checked
 */
function checkSSL(url) {
  if (url.slice(0, 8) === 'https://') {
    $('#ssl').attr('src', './icons/lock-closed.png');
    return true;
  } else if (url.slice(0, 7) === 'http://') {
    $('#ssl').attr('src', './icons/lock-open.png');
    return false;
  }
}


/** Gray out the back/forward buttons if the user can't go back/forward */
function grayOut() {
  $('#back').children('img').css('opacity', view[0].canGoBack() ? '0.4' : '0.2');
  $('#forward').children('img').css('opacity', view[0].canGoForward() ? '0.4' : '0.2');

  if (view[0].canGoBack()) {
    $('#back').addClass('hoverable');
  } else {
    $('#back').removeClass('hoverable');
  }
  if (view[0].canGoForward()) {
    $('#forward').addClass('hoverable');
  } else {
    $('#forward').removeClass('hoverable');
  }
}


/* == EVENT LISTENERS == */


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


/* == STARTUP == */


$.getJSON('../package.json', function(res) {
  version = res.version;
  const homepageValue = localStorage.getItem('homepage');
  if (homepageValue) {
    createTab(homepageValue);
  } else {
    const searchurlValue = localStorage.getItem('searchurl');
    if (searchurlValue) { 
      createTab('https://ninetails.cf/?v=' + version + '&e=' + searchurlValue); 
    } else { 
      createTab('https://ninetails.cf/?v=' + version); 
    }
  }
});