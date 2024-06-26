// Generalized function to create buttons
export function createButton(text, id, className, eventListener) {
	// Step 1: Create the button element
	const button = document.createElement('button');

	// Step 2: Set the button attributes and text
	button.textContent = text;
	if (id) button.id = id; // Set an ID for the button if provided
	if (className) button.className = className; // Add a class to the button if provided
	let toggle = false;

	// Step 3: Append the button to the document
	const mainContent = document.getElementById('main-content');
	mainContent.appendChild(button);

	// Step 4: Add an event listener
	if (eventListener) {
		button.addEventListener('click', eventListener);
	}
}

