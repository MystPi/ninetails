fetch('../package.json')
  .then(res => res.json())
  .then(async (res) => {
    version = res.version;
    const homepageValue = await window.userConfig.load('homepage');
    if (homepageValue) {
      createTab(homepageValue);
    } else {
      const searchurlValue = await window.userConfig.load('searchurl');
      if (searchurlValue) { 
        createTab(defaultHome + '?v=' + version + '&e=' + searchurlValue); 
      } else { 
        createTab(defaultHome + '?v=' + version); 
      }
    }
  });