const byId = id => document.getElementById(id);

let view;
let version;
let activeHash = '0';

const omnibox = byId('omnibox'),
      ssl = byId('ssl'),
      back = byId('back'),
      forward = byId('forward'),
      menu = byId('menu'),
      cover = byId('cover'),
      reload = byId('reload'),
      target = byId('target'),
      settings = byId('settings');


function setTitle(tab, title) {
  tab.children[1].innerText = title;
}


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


function createTab(url) {
  let tab = document.createElement('button');
  let span = document.createElement('span');
  let icon = document.createElement('img');
  let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  tab.classList.add('tab');
  tab.id = 'tab-' + hash;
  tab.onclick = (e) => {
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


function showMoreMenu() {
  const menu = byId('more-menu');
  if (menu.classList.contains('block')) {
    menu.classList.remove('block')
    menu.classList.add('hidden')
  } else {
    menu.classList.remove('hidden')
    menu.classList.add('block')
  }
}


function openSettings(e) {
  showMoreMenu();
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


function hideSettings() {
  settings.style.display = 'none';
}


function saveSettings() {
  hideSettings();
  
  const searchurlElement = byId('settings-searchurl');
  const homepageElement = byId('settings-homepage');
  const uaElement = byId('settings-ua');

  localStorage.setItem('searchurl', searchurlElement.value);
  localStorage.setItem('homepage', homepageElement.value);
  localStorage.setItem('ua', uaElement.value);
}


function hideMenu() {
  menu.style.display = 'none';
  cover.style.display = 'none';
}


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


function checkSSL(string) {
  if (string.slice(0, 8) === 'https://') {
    ssl.setAttribute('src', './icons/lock-closed.png');
    return true;
  } else if (string.slice(0, 7) === 'http://') {
    ssl.setAttribute('src', './icons/lock-open.png');
    return false;
  }
}


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


omnibox.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    omnibox.blur();
    let val = omnibox.value;
    if (/((https?:\/\/)?(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.exec(val)) {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        view.loadURL(val);
      } else {
        view.loadURL('http://'+ val);
      }
    } else {
      const searchurlValue = localStorage.getItem('searchurl');
      if (searchurlValue) {
        view.loadURL(searchurlValue + val);
      } else {
        view.loadURL('https://www.google.com/search?q=' + val);
      }
    }
  }
});

function checkForDelTab(e, hash) {
  if (e.ctrlKey) {
    closeTab(hash)
});

reload.addEventListener('click', (e) => {
  if (e.ctrlKey) {
    view.reloadIgnoringCache();
  } else {
    view.reload();
  }
});


function addListenersToView(view, hash) {
  let tab = byId('tab-' + hash);
  
  view.addEventListener('did-stop-loading', () => {
    if (hash === activeHash) {
      omnibox.value = view.getURL();
      checkSSL(view.getURL());
      grayOut();
    }
    tab.classList.remove('animate-pulse');
    setTitle(tab, view.getTitle());
    view.insertCSS(`::selection {
      color: white !important;
      background: rgb(99, 102, 241) !important;
    }`);
  });


  view.addEventListener('load-commit', (e) => {
    if (hash === activeHash && e.isMainFrame) {
      omnibox.value = e.url;
    }
  });


  view.addEventListener('did-start-loading', () => {
    tab.classList.add('animate-pulse')
  });


  view.addEventListener('page-title-updated', (e) => {
    setTitle(tab, e.title);
  });


  view.addEventListener('context-menu', (e) => {
    menu.style.display = 'block';
    menu.style.left = e.params.x + 'px';
    menu.style.top = e.params.y + 'px';
    cover.style.display = 'block';
  });


  view.addEventListener('new-window', (e) => {
    createTab(e.url);
  });
  

  view.addEventListener('update-target-url', (e) => {
    if (e.url) {
      target.innerText = e.url;
      target.style.opacity = '1';
    } else {
      if (target.style.opacity) {
        target.style.opacity = '0';
      }
    }
  });

  
  view.addEventListener('page-favicon-updated', (e) => {
    if (e.favicons.length > 0) {
      let icon = e.favicons[0];
      let img = tab.getElementsByTagName('img')[0];
      img.src = icon;
    }
  });
}


fetch('../package.json')
  .then(res => res.json())
  .then(res => {
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
