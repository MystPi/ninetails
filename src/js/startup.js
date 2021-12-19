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
        createTab('https://ninetails.cf/?v=' + version + '&e=' + searchurlValue); 
      } else { 
        createTab('https://ninetails.cf/?v=' + version); 
      }
    }
  });