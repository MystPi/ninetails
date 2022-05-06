fetch('../package.json')
  .then(res => res.json())
  .then(res => {
    version = res.version;
    createTab();
    fetch('https://api.github.com/repos/MystPi/ninetails/releases/latest')
      .then(res => res.json())
      .then(res => {
        if (res.tag_name !== 'v' + version) {
          byId('update-available-version').innerText = res.tag_name.slice(1);
          byId('update-available').style.display = 'block';
        }
      });
  });

window.ipc.send('toMain', 'platform');
window.ipc.on('platform', (data) => {
  const platform = data.platform;

  if (platform === 'win32' || platform === 'darwin') {
    const prefix = platform === 'darwin' ? 'mac' : 'win';
    const titlebar = byId('titlebar');

    if (platform === 'win32') {
      titlebar.classList.add('pl-4');
    }

    const winControls = byId('window-controls-win');
    const macControls = byId('window-controls-mac');

    if (platform === 'darwin') {
      winControls.style.display = 'none';
      macControls.style.display = 'flex';
    } else {
      winControls.style.display = 'flex';
      macControls.style.display = 'none';
    }

    const close = byId(`${prefix}-close-button`);
    const minimize = byId(`${prefix}-minimize-button`);
    const maximize = byId(`${prefix}-maximize-button`);

    const winRestoreSvg = '<path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" style="stroke-opacity: 0;" />';
    const winMaximizeSvg = '<path d="M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z" style="stroke-opacity: 0;" />';

    close.addEventListener('click', () => {
      window.ipc.send('toMain', 'close');
    });

    minimize.addEventListener('click', () => {
      window.ipc.send('toMain', 'minimize');
    });

    maximize.addEventListener('click', () => {
      window.ipc.send('toMain', 'maximize');
    });

    window.ipc.on('maximized', (maximized) => {
      if (platform === 'win32') {
        const svg = maximize.querySelector('svg');

        svg.innerHTML = maximized ? winRestoreSvg : winMaximizeSvg;
      }
    });
  }
});

const sortable = Sortable.create(byId('tabbar'), {
  animation: 150
});


setTimeout(() => {
  byId('loading').classList.add('opacity-0');
  setTimeout(() => {
    byId('loading').style.display = 'none';
  }, 500);
}, 1000);


if (!window.navigator.onLine) {
  byId('offline').style.display = 'block';
}