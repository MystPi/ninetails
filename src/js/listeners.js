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
        view.loadURL(defaultEngine + val);
      }
    }
  }
});


byId('settings-presets').addEventListener('change', () => {
  byId('settings-searchurl').value = byId('settings-presets').value;
});


click('newtab-button', () => {
  createTab();
});


click('more-button', toggleMoreMenu);


click('back', () => {
  view.goBack();
});


click('forward', () => {
  view.goForward();
});


click('reload', (e) => {
  if (e.ctrlKey) {
    view.reloadIgnoringCache();
  } else {
    view.reload();
  }
});


click('close', closeTab);


click('menu-inspect', () => {
  view.openDevTools();
  hideMenu();
});


click('menu-reload', () => {
  view.reload();
  hideMenu();
});


click('menu-back', () => {
  view.goBack();
  hideMenu();
});


click('menu-forward', () => {
  view.goForward();
  hideMenu();
});


click('cover', hideMenu);


click('more-settings', () => {
  openSettings();
  toggleMoreMenu();
});


click('more-github', () => {
  toggleMoreMenu();
  createTab('https://github.com/mystpi/ninetails');
});


click('settings-done', saveSettings);


click('settings-cancel', hideSettings);


/**
 * Add event listeners to a webview
 * @param {HTMLElement} view - The webview the event listeners will be added to
 * @param {string} hash - The hash of the webview
 */
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