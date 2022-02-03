/**
 * Set the title of a tab
 * @param {HTMLElement} tab
 * @param {string} title
 */
function setTitle(tab, title) {
  tab.children[1].innerText = title;
}


/**
 * Set the omnibox's value
 * @param {string} text
 */
function setOmnibox(text) {
  if (document.activeElement === omnibox) return;
  let home = localStorage.getItem('homepage');
  if (!home) {
    home = defaultHome;
  }
  if (text.startsWith(home)) {
    omnibox.value = '';
  } else {
    omnibox.value = text;
  }
}


/**
 * Switch the active tab
 * @param {string} tab - The hash of the tab to switch to
 */ 
function switchTabs(tab) {
  let currentTab = document.querySelector('.active-tab');
  if (currentTab) {
    currentTab.classList.remove('active-tab');
    currentTab.classList.add('tab');
  }

  let activeTab = byId('tab-' + tab);
  activeTab.classList.add('active-tab');
  activeTab.classList.remove('tab');

  let views = document.querySelectorAll('.view');
  views.forEach(x => {
    x.style.display = 'none';
  });

  byId('view-' + tab).style.display = 'flex';

  view = byId('view-' + tab);
  activeHash = tab;

  setOmnibox(view.src);
  // Hacky, but it works (until I find a better way)
  try {
    // First, execute the functions assuming the DOM is ready
    setOmnibox(view.getURL());
    checkSSL(view.getURL());
    grayOut();
    fillHeart(view.getURL());
  } catch (e) {
    // If the DOM isn't ready, wait for it
    // console.log(e);
    view.addEventListener('dom-ready', () => {
      setOmnibox(view.getURL());
      checkSSL(view.getURL());
      grayOut();
      fillHeart(view.getURL());
    });
  }
}


/**
 * Create a tab and append it to the tabbar
 * @param {string} [url] - If present, the new tab's URL will be set to this, otherwise it will be set to the default homepage
 */
function createTab(url) {
  let tab = document.createElement('button');
  let span = document.createElement('span');
  let icon = document.createElement('img');
  let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  tab.classList.add('tab');
  tab.id = 'tab-' + hash;
  tab.onmousedown = (e) => {
    switchTabs(hash);
    checkForDelTab(e, hash);
  };
  span.innerText = 'New Tab';
  icon.src = './icons/favicon.png';
  tab.appendChild(icon);
  tab.appendChild(span);

  byId('tabbar').appendChild(tab);

  let view = document.createElement('webview');
  view.id = 'view-' + hash;
  view.classList.add('view');
  view.allowpopups = 'allowpopups';
  view.webpreferences = 'nativeWindowOpen=true';
  const uaValue = localStorage.getItem('ua');
  if (uaValue) {
    view.useragent = uaValue;
  } else {
    view.useragent = 'Ninetails/' + version;
  }

  if (url) {
    view.src = url;
  } else {
    const homepageValue = localStorage.getItem('homepage');
    if (homepageValue) {
      view.src = homepageValue;
    } else {
      const searchurlValue = localStorage.getItem('searchurl');
      if (searchurlValue) { 
        view.src = defaultHome + '?v=' + version + '&e=' + searchurlValue;
      } else { 
        view.src = defaultHome + '?v=' + version;
      }
    }
  }

  byId('views').appendChild(view);
  addListenersToView(view, hash);
  switchTabs(hash);
  omnibox.focus();
}


/** Toggle the visibility of the 'more' menu */
function toggleMoreMenu() {
  const menu = byId('more-menu');
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
    cover.style.display = 'none';
  } else {
    menu.style.display = 'block';
    cover.style.display = 'block';
  }
}


/** Open the settings menu */
function openSettings(e) {
  const searchurlElement = byId('settings-searchurl');
  const homepageElement = byId('settings-homepage');
  const uaElement = byId('settings-ua');
  const openInNewTabElement = byId('settings-open-in-new-tab');
  const searchUrlValue = localStorage.getItem('searchurl');
  const homePageValue = localStorage.getItem('homepage');
  const uaValue = localStorage.getItem('ua');
  const openInNewTab = localStorage.getItem('openInNewTab');

  searchurlElement.value = searchUrlValue;
  homepageElement.value = homePageValue;
  uaElement.value = uaValue;
  uaElement.placeholder = 'Ninetails/' + version;
  openInNewTabElement.checked = openInNewTab === 'true';
  
  settings.style.display = 'block';
}


/** Hide the settings menu */
function hideSettings() {
  settings.style.display = 'none';
}


/** Save any changed settings to localStorage */
function saveSettings() {
  hideSettings();
  
  const searchurlElement = byId('settings-searchurl');
  const homepageElement = byId('settings-homepage');
  const uaElement = byId('settings-ua');
  const openInNewTabElement = byId('settings-open-in-new-tab');

  localStorage.setItem('searchurl', searchurlElement.value);
  localStorage.setItem('homepage', homepageElement.value);
  localStorage.setItem('ua', uaElement.value);
  localStorage.setItem('openInNewTab', openInNewTabElement.checked);
}


/** Open the bookmarks menu and load the bookmarks */
function openBookmarks() {
  let el = byId('bookmarks-container');
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  let openInNewTab = localStorage.getItem('openInNewTab');
  if (bookmarks) {
    bookmarks.forEach((bookmark) => {
      let p = document.createElement('p');
      p.className = 'mb-2 overflow-hidden font-mono text-gray-700 whitespace-nowrap text-ellipsis';
      let img = document.createElement('img');
      img.src = bookmark[0];
      img.className = 'inline w-4 h-4 mr-4';
      let a = document.createElement('a');
      a.setAttribute('data-link', bookmark[1]);
      a.innerText = bookmark[1];
      a.className = 'underline cursor-pointer';
      a.onclick = (e) => {
        if (openInNewTab === 'true') {
          createTab(e.target.dataset.link);
        } else {
          view.loadURL(e.target.dataset.link);
        }
        byId('bookmarks').style.display = 'none';
      }
      p.appendChild(img);
      p.appendChild(a);
      el.appendChild(p);
    });
  }
  byId('bookmarks').style.display = 'block';
}


/**
 * Set the heart icon to the correct state
 * @param {string} url - The URL to check
 */
function fillHeart(url) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  let inBookmarks = false;
  let el = byId('bookmark');
  if (bookmarks) {
    bookmarks.forEach((bookmark) => {
      if (bookmark[1] === url) {
        el.children[0].src = './icons/heart_filled.png';
        inBookmarks = true;
        return;
      }
    });
  }
  if (!inBookmarks) {
    el.children[0].src = './icons/heart_empty.png';
  }
}


/** Hide the right-click menu */
function hideMenu() {
  menu.style.display = 'none';
  cover.style.display = 'none';
}


/** Close the active tab and switch to a new one */
function closeTab() {
  let tabbar = byId('tabbar');
  if (tabbar.children.length === 1) return;
  byId('view-' + activeHash).remove();
  byId('tab-' + activeHash).remove();
  switchTabs(tabbar.lastChild.id.slice(4));
}


/**
 * Check if a tab is ctrl-clicked upon, and, if so, delete it
 * @param {MouseEvent} e
 * @param {string} hash - The hash of the tab
 */
function checkForDelTab(e, hash) {
  if (e.ctrlKey) {
    closeTab(hash)
  }
}


/**
 * Check if a URL is https or http
 * @param {string} url - The URL to be checked
 */
function checkSSL(url) {
  if (url.slice(0, 8) === 'https://') {
    ssl.setAttribute('src', './icons/lock-closed.png');
    return true;
  } else if (url.slice(0, 7) === 'http://') {
    ssl.setAttribute('src', './icons/lock-open.png');
    return false;
  }
}


/** Gray out the back/forward buttons if the user can't go back/forward */
function grayOut() {
  let backImage = back.getElementsByTagName('img')[0];
  let forwardImage = forward.getElementsByTagName('img')[0];

  if (view.canGoBack()) {
    backImage.style.opacity = 0.5;
    back.classList.add('hoverable');
  } else {
    backImage.style.opacity = 0.2;
    back.classList.remove('hoverable');
  }
  if (view.canGoForward()) {
    forwardImage.style.opacity = 0.5;
    forward.classList.add('hoverable');
  } else {
    forwardImage.style.opacity = 0.2;
    forward.classList.remove('hoverable');
  }
}