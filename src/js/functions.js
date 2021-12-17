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