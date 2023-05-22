/*
 * All of the utility/helper functions that the rest of the scripts will rely on. These will be globally available via export/import.
 */
function showElement(ele) {
  ele.classList.remove(`hidden`)
}

function hideElement(ele) {
  ele.classList.add(`hidden`)
}

export { showElement, hideElement };
