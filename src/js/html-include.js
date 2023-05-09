;(() => {
  "use strict"

  const includeElements = document.querySelectorAll(`[data-include]`)
  const groupedIncludeMap = groupIncludeElementsIntoMap(includeElements)

  groupedIncludeMap.forEach(processGroupOfIncludes)

  /*
    Reduce an array of dom elements with paths to a Map of paths 
    with an array of those elements -- for example:
      [
        <div id="1" data-include="hi.html"></div>,
        <div id="2" data-include="hi.html"></div>,
        <div id="3" data-include="hey.html"></div>
      ]
      
      turns into a map like:
      
      {
        'hi.html': ['<div id="1">' , '<div id="2">'],
        'hey.html': ['<div id="3">']
      }
  */
  function groupIncludeElementsIntoMap(includeElements) {
    const arrayOfIncludeElements = Array.from(includeElements)
    return arrayOfIncludeElements.reduce((accumulatorMap, includeElement) => {
      const path = includeElement.getAttribute(`data-include`)
      let arrayOfElements = accumulatorMap.get(path)

      if (!arrayOfElements) {
        arrayOfElements = []
      }

      arrayOfElements.push(includeElement)

      accumulatorMap.set(path, arrayOfElements)

      return accumulatorMap
    }, new Map())
  }

  /*
    Use the path of a group, fetch the data using that path, 
    and inject the result into each of the elements in the group.
    
    Cache the responses for this session to prevent duplicate calls
  */
  async function processGroupOfIncludes(arrayOfElements, path) {
    let html = sessionStorage.getItem(path)
    if (!html) {
      html = await fetchHtml(path)
      sessionStorage.setItem(path, html)
    }

    arrayOfElements.forEach((includeEle) => (includeEle.outerHTML = html))

    const eventName = path.replace(/\/|\.(.*)$/g, ``)
    document.body.dispatchEvent(new Event(eventName))
    window[eventName] = true
  }

  /*
    Fetch the html from a path
  */
  async function fetchHtml(path) {
    const response = await fetch(path)
    const html = await response.text()
    return html
  }
})()
