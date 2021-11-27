const byId = id => document.getElementById(id);

const view = byId('view'),
      omnibox = byId('omnibox'),
      ssl = byId('ssl'),
      back = byId('back'),
      forward = byId('forward'),
      reload = byId('reload'),
      reloadIcon = byId('reload-icon'),
      search = byId('search'),
      popup = byId('popup'),
      menu = byId('menu'),
      cover = byId('cover');


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
    if (val.startsWith('http://') || val.startsWith('https://')) {
      view.loadURL(val);
    } else {
      view.loadURL('http://'+ val);
    }
  }
});


search.addEventListener('click', () => {
  let val = omnibox.value;
  view.loadURL('https://www.google.com/search?q=' + val);
});


view.addEventListener('did-finish-load', () => {
  omnibox.value = view.src;
  checkSSL(view.src);
  grayOut();
  view.insertCSS(`::selection {
    color: white !important;
    background: rgb(99, 102, 241) !important;
  }`);
});


view.addEventListener('did-start-loading', () => {
  reloadIcon.classList.add('animate-spin');
  popup.style.display = 'none';
});


view.addEventListener('did-stop-loading', () => {
  reloadIcon.classList.remove('animate-spin');
});


view.addEventListener('did-fail-load', (e) => {
  popup.style.display = 'block';
  byId('desc').innerText = e.errorDescription;
  byId('site').innerText = e.validatedURL;
});


view.addEventListener('context-menu', (e) => {
  menu.style.display = 'block';
  menu.style.left = e.params.x + 'px';
  menu.style.top = e.params.y + 'px';
  cover.style.display = 'block';
});


cover.addEventListener('click', () => {
  menu.style.display = 'none';
  cover.style.display = 'none';
});


byId('close').addEventListener('click', () => {
  popup.style.display = 'none';
});