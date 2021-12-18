/**
 * Set the title of a tab
 * @param {HTMLElement} tab
 * @param {string} title
 */
function setTitle(tab, title) {
  tab.children[1].innerText = title;
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

  omnibox.value = view.getURL();
  checkSSL(view.getURL());
  grayOut();
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
  tab.onclick = () => {
    switchTabs(hash);
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
        view.src = 'https://ninetails.cf/?v=' + version + '&e=' + searchurlValue;
      } else { 
        view.src = 'https://ninetails.cf/?v=' + version;
      }
    }
  }

  byId('views').appendChild(view);
  addListenersToView(view, hash);
  switchTabs(hash);
}


/** Toggle the visibility of the 'more' menu */
function toggleMoreMenu() {
  const menu = byId('more-menu');
  if (menu.classList.contains('block')) {
    menu.classList.remove('block')
    menu.classList.add('hidden')
  } else {
    menu.classList.remove('hidden')
    menu.classList.add('block')
  }
}


/** Open the settings menu */
function openSettings(e) {
  const searchurlElement = byId('settings-searchurl');
  const homepageElement = byId('settings-homepage');
  const uaElement = byId('settings-ua');
  const searchUrlValue = localStorage.getItem('searchurl');
  const homePageValue = localStorage.getItem('homepage');
  const uaValue = localStorage.getItem('ua');

  searchurlElement.value = searchUrlValue;
  homepageElement.value = homePageValue;
  uaElement.value = uaValue;
  uaElement.placeholder = 'Ninetails/' + version;
  
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

  localStorage.setItem('searchurl', searchurlElement.value);
  localStorage.setItem('homepage', homepageElement.value);
  localStorage.setItem('ua', uaElement.value);
}


/** Hide the right-click menu */
function hideMenu() {
  menu.style.display = 'none';
  cover.style.display = 'none';
}


/** Close the active tab and switch to a new one */
function closeTab() {
  let tabs = document.querySelectorAll('[id^="tab-"]')
  if (tabs.length > 1) {
    let temp = activeHash;
    if (temp !== tabs[0].id.slice(4)) {
      switchTabs(tabs[0].id.slice(4));
    } else {
      switchTabs(tabs[1].id.slice(4));
    }
    byId('tab-' + temp).remove();
    byId('view-' + temp).remove();
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
    backImage.style.opacity = 0.4;
    back.classList.add('hoverable');
  } else {
    backImage.style.opacity = 0.2;
    back.classList.remove('hoverable');
  }
  if (view.canGoForward()) {
    forwardImage.style.opacity = 0.4;
    forward.classList.add('hoverable');
  } else {
    forwardImage.style.opacity = 0.2;
    forward.classList.remove('hoverable');
  }
}