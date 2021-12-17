$.getJSON('../package.json', function(res) {
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