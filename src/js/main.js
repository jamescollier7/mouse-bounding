(()=>{
  loadScript(`src/js/sheets.js`)
  
  function loadScript(url) {
    var script = document.createElement("script")
    script.src = url
   
    document.head.appendChild(script)
  }
})()
