const byId = id => document.getElementById(id);

const view = byId('view');
const omnibox = byId('omnibox');
const ssl = byId('ssl');
const back = byId('back');
const forward = byId('forward');
const reload = byId('reload');
const reloadIcon = byId('reload-icon');
const search = byId('search');
const popup = byId('popup');

function checkSSL(string) {
  if (string.slice(0, 8) === 'https://') {
    ssl.setAttribute('src', './icons/lock-closed.png');
    return true;
  } else if (string.slice(0, 7) === 'http://') {
    ssl.setAttribute('src', './icons/lock-open.png');
    return false;
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

byId('close').addEventListener('click', () => {
  popup.style.display = 'none';
});

back.addEventListener('click', () => {
  view.goBack();
});

forward.addEventListener('click', () => {
  view.goForward();
});

reload.addEventListener('click', () => {
  view.reload();
});