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


if (!window.navigator.onLine) {
  byId('offline').style.display = 'block';
}