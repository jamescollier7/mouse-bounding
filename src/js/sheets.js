;(() => {
  "use strict"

  const API_KEY_NAME = `apikey`
  const SHEET_ID_NAME = `sheetid`

  let apiKey = getFromLocalStorage(API_KEY_NAME)
  let sheetId = getFromLocalStorage(SHEET_ID_NAME)

  const configFormEle = document.getElementById(`config-form`)
  const resetConfigBtn = document.getElementById(`reset-config`)

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = `https://sheets.googleapis.com/$discovery/rest?version=v4`

  /**
   * Callback after api.js is loaded.
   */
  function gapiLoaded() {
    if (sheetId && apiKey) {
      gapi.load("client", initializeGapiClient)
    } else {
      showElement(configFormEle)
    }
  }

  /**
   * Listener for gapi loaded
   */
  document.body.addEventListener(`gapi-loaded`, () => {
    if (document.readyState !== `loading`) {
      gapiLoaded()
    } else {
      document.addEventListener(`readystatechange`, () => {
        gapiLoaded()
      })
    }
  })

  /**
   * Callback after the API client is loaded. Loads the discovery doc to initialize the API.
   */
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: [DISCOVERY_DOC],
    })
    showElement(resetConfigBtn)
    doFirstFetch()
  }

  configFormEle.addEventListener(`submit`, (e) => {
    e.preventDefault()
    const configForm = e.currentTarget
    setApiKey(configForm.querySelector(`#${API_KEY_NAME}`).value)
    setSheetId(configForm.querySelector(`#${SHEET_ID_NAME}`).value)
    hideElement(configFormEle)
    gapi.load("client", initializeGapiClient)
  })

  resetConfigBtn.addEventListener(`click`, (e) => {
    localStorage.clear()
    showElement(configFormEle)
    hideElement(resetConfigBtn)
    window.location.reload()
  })

  function setSheetId(id) {
    localStorage.setItem(SHEET_ID_NAME, id)
    sheetId = id
  }
  function setApiKey(key) {
    localStorage.setItem(API_KEY_NAME, key)
    apiKey = key
  }
  function getFromLocalStorage(item) {
    return localStorage.getItem(item)
  }

  async function fetchAllSpreadsheetInfo() {
    let response
    try {
      response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      })
    } catch (err) {
      console.error(err)
      return
    }

    return response
  }

  async function fetchSpreadsheetData(colCount, rowCount) {
    let response
    try {
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `Sheet1!${cellRef}`,
      })
    } catch (err) {
      console.error(err)
      return
    }

    const range = response.result
    if (!range || !range.values || range.values.length == 0) {
      console.warn(`No values found.`)
      return
    }

    return range
  }

  function doFirstFetch() {
    fetchAllSpreadsheetInfo().then((data) => writeOutTable(data))
  }

  function numToColLetter(num) {}

  function showElement(ele) {
    ele.classList.remove(`hidden`)
  }
  function hideElement(ele) {
    ele.classList.add(`hidden`)
  }

  if (window.srchtmlsheetform) {
    init()
  } else {
    document.body.addEventListener(`srchtmlsheetform`, () => {
      init()
    })
  }
})()
