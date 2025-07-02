const disclosureModalContainer = document.createElement("div");
disclosureModalContainer.id = "disclosure-modal-container";
const innerModel = document.createElement("div");

function updateModelSize(e) {
  e.matches
    ? (document.getElementById("inner-model").style.width = "80%")
    : (document.getElementById("inner-model").style.width = "30%");
}
(innerModel.id = "inner-model"),
  (innerModel.innerHTML =
    '\n  <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 20px">\n    Disclosure\n  </div>\n  <div style="margin-bottom: 20px; line-height: 26px; font-size: 16px">\n    Please accept terms and conditions to proceed. You can access the terms\n    <a target="_blank" href="https://qualiphy.me/qualiphy-terms-of-use/qualiphy-patient-telehealth-consent-and-liability-release/">here</a>.\n    Ensure you are in a private space where you can discuss your personal health information before starting the consultation.\n  </div>\n  <div style="display: flex; justify-content: flex-end; gap: 20px">\n    <button id="acceptButton" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="loadForm()">\n      Accept\n    </button>\n  </div>\n'),
  disclosureModalContainer.appendChild(innerModel),
  (disclosureModalContainer.style.display = "none"),
  document.body.appendChild(disclosureModalContainer);

const x = window.matchMedia("(max-width: 1024px)");
updateModelSize(x),
  x.addEventListener("change", function () {
    updateModelSize(x);
  });
const disclosureModelContainer = document.getElementById(
  "disclosure-modal-container"
);

window.addEventListener("message", (event) => {
  if (event.data === "close-iframe") {
    const iframeContainer = document.getElementById("modal-container");
    if (iframeContainer) {
      iframeContainer.remove();
    }
  }
});

function showDisclosureModal() {
  const el = document.getElementById("disclosure-modal-container");
  if (el) {
    el.style.display = "flex";
    el.style.position = "fixed";
  }
}
disclosureModelContainer?.addEventListener("click", function (e) {
  e.target === disclosureModelContainer &&
    (document.getElementById("disclosure-modal-container").style.display =
      "none");
});
const poweredByQualiphy = document.createElement("p");

function checkButtonAvailability(e, t) {
  const n = moment().utcOffset(60 * e),
    o = n.format("ddd").toUpperCase(),
    i = JSON.parse(t).find((e) => e[o]);
  if (i) {
    const { FROM: e, TO: t, isDaySelected: d } = i[o];
    if (d && e && t) {
      const o = moment(e, "HH:mm"),
        i = moment(t, "HH:mm");
      n.isBetween(o, i)
        ? ((document.getElementById("loadFormButton").style.display = "flex"),
          (document.getElementById("poweredByQualiphy").style.display =
            "block"),
          (document.getElementById("main-qualiphy-widget").style.display =
            "block"))
        : (console.log("2"),
          (document.getElementById("loadFormButton").style.display = "none"),
          (document.getElementById("main-qualiphy-widget").style.display =
            "none"));
    } else
      console.log("3"),
        (document.getElementById("loadFormButton").style.display = "none"),
        (document.getElementById("main-qualiphy-widget").style.display =
          "none");
  } else
    console.log("4"),
      (document.getElementById("loadFormButton").style.display = "none"),
      (document.getElementById("main-qualiphy-widget").style.display = "none");
}

function loadForm() {
  const e = document.createElement("div");
  (e.id = "modal-container"),
    (e.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height:100vh; z-index: 9999; display: flex; justify-content: center; align-items: center;");
  const t = document.createElement("div");

  function n() {
    const e = document
      .getElementById("qualiphy-script")
      .getAttribute("data-formsrc");
    const n = window.innerWidth,
      o = window.innerHeight;

    n <= 768 ? Math.min(0.9 * n, 90) : Math.min(0.5 * n, 90),
      Math.min(0.7 * o, 90),
      (t.innerHTML =
        '<iframe allowusermedia frameborder="0" type="text/html" class="responsive-embed" allow="camera *; microphone *; display-capture *" title="Qualiphy Exam Form" src="' +
        e +
        '">');
    closeButton.style.top = n <= 768 ? "4%" : n <= 1024 ? "13.5%" : "6%";
    closeButton.style.right = n <= 1024 ? "4%" : "9.5%";
  }
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "X";
  closeButton.style.cssText =
    "position: fixed; top:6%; right:9.5%; background-color: #CFC9FF; color: #ffffff; border: none; border-radius: 50%; cursor: pointer;z-index:9999;width:30px;height:30px;";
  closeButton.addEventListener("click", function () {
    e.remove();
    window.removeEventListener("resize", n);
  });

  const iframeContainer = document.createElement("div");
  iframeContainer.appendChild(t);
  iframeContainer.appendChild(closeButton);

  e.appendChild(iframeContainer);
  (t.id = "form-container"),
    (t.style.cssText = "background-color:#ffffff; border-radius:5px; "),
    n(),
    window.addEventListener("resize", n),
    e.addEventListener("click", function (t) {
      t.target === e && (e.remove(), window.removeEventListener("resize", n));
    }),
    e.appendChild(t),
    document.body.appendChild(e);
  const o = document.getElementById("disclosure-modal-container");
  // o && o.parentNode && document.body.removeChild(o)
  const el = document.getElementById("disclosure-modal-container");
  if (el) {
    el.style.display = "none";
  }
}
(poweredByQualiphy.id = "poweredByQualiphy"),
  (poweredByQualiphy.style.cssText =
    "margin-top:5px; padding-left:10px; font-weight:600; font-size:14px; display:none;"),
  (poweredByQualiphy.innerHTML =
    'Powered By <a href="https://qualiphy.me" target="_blank" id="qualiphyLink">Qualiphy</a>'),
  document
    .getElementById("main-qualiphy-widget")
    .appendChild(poweredByQualiphy),
  document
    .getElementById("qualiphyLink")
    .addEventListener("click", function (e) {
      e.preventDefault(), window.open("https://qualiphy.me", "_blank");
    }),
  document.addEventListener("DOMContentLoaded", function () {
    const e = document.getElementById("qualiphy-script");
    checkButtonAvailability(
      e.getAttribute("data-timezone"),
      e.getAttribute("data-examhours")
    );
  });
