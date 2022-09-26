// Get element reference
const elements = {
  tbody: document.querySelector("#list-body"),
  input: document.querySelector(".todo-input"),
  filterField: document.getElementById("select-filter")
}

// Todo list container
let list = []

// For filtered items
let filteredItems = [], filterList = false

// Set list initial display value
const listDefaultValue = `
  <tr>
    <td colspan=3 style="text-align: center">List is empty as of the moment.</td>
  </tr>
`

// Assigned default list value if list is empty on load event
elements.tbody.innerHTML = listDefaultValue

// Timestamp generator
const genTimestamp = () => new Date()

// Update todo status function
const updateStatus = (title, value) => {
  list[list.findIndex(item => item.title.toLowerCase() === title)]["isDone"] = value
  
  if (filterList) {
    const showFinishedTasks = elements.filterField.value === "done"

    filteredItems = showFinishedTasks 
      ? [...list].filter(item => item.isDone)
      : [...list].filter(item => !item.isDone)

    appendList(filteredItems)
  } else {
    appendList()
  }
}

// Filtering the display
const filterDisplay = element => {
  filterList = element.value !== "all"
  
  const listToDisplay = element.value === "all"
    ? list
    : element.value === "done"
    ? [...list].filter(item => item.isDone)
    : [...list].filter(item => !item.isDone)

  filteredItems = listToDisplay
  appendList(listToDisplay)
}

// Removing the item from the list
const removeItem = title => {
  list.splice(list.findIndex(item => item.title.toLowerCase() === title), 1)
  
  if (filterList) {
    const showFinishedTasks = elements.filterField.value === "done"

    filteredItems = showFinishedTasks 
      ? [...list].filter(item => item.isDone)
      : [...list].filter(item => !item.isDone)

    appendList(filteredItems)
  } else {
    appendList()
  }
}

// Append list to the display
const appendList = (listToDisplay = list) => {
  elements.tbody.innerHTML = listToDisplay.length ? [...listToDisplay].map((item, index) => {
    return `
      <tr>
        <td>${index+1}</td>
        <td>${item.title}</td>
        <td>
          <div class="actions-container">
            <div class="checkbox-container">
              <button 
                onclick="updateStatus('${item.title}', ${!item.isDone})"
              >
                ${item.isDone ? "Redo" : "Mark as done"}
              </button>
            </div>
            <button 
              class="remove-item-btn" 
              onclick="removeItem('${item.title}')"
            >
              Remove
            </button>
          </div>
        </td>
      </tr>
    `
  }).join("") : listDefaultValue
}

// Add todo function
const addTodo = (e) => {
  // Prevent the form from reloading during submit
  e.preventDefault()
  
  // Capture user's input value
  const inputValue = elements.input.value.toLowerCase()

  // Validate user's input value
  if (list.length) {
    const foundItem = list.find(item => item.title.toLowerCase() === inputValue)

    if (foundItem) return alert("This item is already on the list.")
  }

  // Add item to the list
  list = [
    ...list,
    {
      title: elements.input.value,
      dateAdded: genTimestamp(),
      isDone: false
    }
  ]

  if (elements.filterField.value !== "all") {
    filterList = true
    const filterFinishedTasks = elements.filterField.value === "done"
    
    filteredItems = filterFinishedTasks 
      ? [...list].filter(item => item.isDone)
      : [...list].filter(item => !item.isDone)
  }
  
  // Append the list to the display
  if (filterList) {
    appendList(filteredItems)
  } else {
    appendList()
  }

  // Remove filter
  filterList = false

  // Clear user's input
  elements.input.value = null
}