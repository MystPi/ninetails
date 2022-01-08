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
        createTab(defaultHome + '?v=' + version + '&e=' + searchurlValue); 
      } else { 
        createTab(defaultHome + '?v=' + version); 
      }
    }
  });


if (!window.navigator.onLine) {
  byId('offline').style.display = 'block';
}