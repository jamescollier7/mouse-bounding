import { showElement, hideElement } from "./modules/utilities.mjs";

(() => {
  // loadScript(`src/js/utilities.js`)
  // loadScript(`src/js/sheets.js`)
  // loadScript(`src/js/html-include.js`)
  loadScript(`src/js/game.js`)

  function loadScript(url) {
    var script = document.createElement("script")
    script.src = url

    document.head.appendChild(script)
  }
})()

// test
hideElement(document.body)
