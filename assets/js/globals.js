/**
 * Global variables and configuration for WooCommerce and other integrations
 * Stay Dripped Mobile IV Website
 */

// Global variables for WooCommerce scripts
window.wc_add_to_cart_params = {
  ajax_url: "/wp-admin/admin-ajax.php",
  wc_ajax_url: "/wc-ajax/%%endpoint%%",
  i18n_view_cart: "View cart",
  cart_url: "/cart",
  is_cart: false,
  cart_redirect_after_add: "no",
};

window.woocommerce_params = {
  ajax_url: "/wp-admin/admin-ajax.php",
  wc_ajax_url: "/wc-ajax/%%endpoint%%",
};

window.wcLiquid = {
  ajaxUrl: "/wp-admin/admin-ajax.php",
};

// Order attribution configuration
window.wc_order_attribution = {
  params: {
    allowTracking: true,
    lifetime: 60,
    session: 30,
    base64: false,
  },
  fields: {
    source_type: "current.typ",
    referrer: "current.src",
    utm_campaign: "current.cmp",
    utm_source: "current.src",
    utm_medium: "current.mdm",
    utm_content: "current.cnt",
    utm_id: "current.id",
    utm_term: "current.trm",
    session_entry: "current_add.ep",
    session_start_time: "current_add.fd",
    session_pages: "session.pgs",
    session_count: "udata.vst",
    user_agent: "udata.uag",
  },
};

// Initialize Cookies object for order attribution
(function () {
  "use strict";
  if (typeof window.Cookies === "undefined" && typeof Cookies !== "undefined") {
    window.Cookies = Cookies;
  }
})();
