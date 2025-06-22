(function(){
  if (window.gtag) {
    window.gtag('event', 'page_view');
  } else {
    console.debug('Analytics library not loaded');
  }

// Lightweight Google Analytics helper
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
  window.gtag = gtag;
})();

})();
