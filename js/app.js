
import { recordService } from "./data.js";

// Get HTML elements
const recordForm = document.getElementById("recordForm");
const recordId = document.getElementById("recordId");
const title = document.getElementById("title");
const category = document.getElementById("category");
const description = document.getElementById("description");
const status = document.getElementById("status");

const submitButton = document.getElementById("submitButton");
const cancelEdit = document.getElementById("cancelEdit");

const recordList = document.getElementById("recordList");
const message = document.getElementById("message");
const search = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");
const recordCount = document.getElementById("recordCount");

// Display messages
function showMessage(text, type = "success") {
    message.textContent = text;

    message.style.color =
        type === "error" ? "#c0392b" : "#16803c";
}

// Validate form input
function validateInput() {
    const cleanTitle = title.value.trim();
    const cleanCategory = category.value.trim();
    const cleanDescription = description.value.trim();

    if (cleanTitle.length < 3 || cleanTitle.length > 80) {
        showMessage("Title must contain 3 to 80 characters.", "error");
        return false;
    }

    if (cleanCategory.length < 2 || cleanCategory.length > 40) {
        showMessage("Category must contain 2 to 40 characters.", "error");
        return false;
    }

    if (cleanDescription.length < 5 || cleanDescription.length > 300) {
        showMessage("Description must contain 5 to 300 characters.", "error");
        return false;
    }

    if (!["Pending", "In progress", "Completed"].includes(status.value)) {
        showMessage("Please select a valid status.", "error");
        return false;
    }

    return true;
}

// Create a safe record card
function createRecordCard(record) {
    const card = document.createElement("article");
    card.className = "record-card";

    const heading = document.createElement("h3");
    heading.textContent = record.title;

    const idText = document.createElement("p");
    idText.textContent = `ID: ${record.id}`;

    const categoryText = document.createElement("p");
    categoryText.textContent = `Category: ${record.category}`;

    const statusText = document.createElement("p");
    statusText.textContent = `Status: ${record.status}`;

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.addEventListener("click", () => viewRecord(record.id));

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editRecord(record.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteRecord(record.id));

    card.append(
        heading,
        idText,
        categoryText,
        statusText,
        viewButton,
        editButton,
        deleteButton
    );

    return card;
}

// Display records
async function displayRecords() {
    const records = await recordService.list();

    const searchValue = search.value.trim().toLowerCase();
    const selectedStatus = filterStatus.value;

    const filteredRecords = records.filter(record => {
        const matchesSearch = record.title.toLowerCase()
            .includes(searchValue);

        const matchesStatus =
            selectedStatus === "All" ||
            record.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    recordList.replaceChildren();

    recordCount.textContent =
        `${filteredRecords.length} record(s) found`;

    if (filteredRecords.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No support requests found.";
        recordList.appendChild(emptyMessage);
        return;
    }

    filteredRecords.forEach(record => {
        recordList.appendChild(createRecordCard(record));
    });
}

// View a complete record
async function viewRecord(id) {
    try {
        const record = await recordService.get(id);

        alert(
            `Request Details\n\n` +
            `ID: ${record.id}\n` +
            `Title: ${record.title}\n` +
            `Category: ${record.category}\n` +
            `Description: ${record.description}\n` +
            `Status: ${record.status}`
        );
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Edit a record
async function editRecord(id) {
    try {
        const record = await recordService.get(id);

        recordId.value = record.id;
        title.value = record.title;
        category.value = record.category;
        description.value = record.description;
        status.value = record.status;

        submitButton.textContent = "Update Request";
        cancelEdit.hidden = false;

        showMessage("Editing support request.");
        title.focus();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Cancel editing
function resetForm() {
    recordForm.reset();
    recordId.value = "";

    submitButton.textContent = "Add Request";
    cancelEdit.hidden = true;
}

// Delete a record
async function deleteRecord(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this support request?"
    );

    if (!confirmed) {
        showMessage("Deletion cancelled.");
        return;
    }

    try {
        const result = await recordService.remove(id);

        resetForm();
        showMessage(result);

        await displayRecords();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Handle form submission
recordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateInput()) {
        return;
    }

    const record = {
        title: title.value.trim(),
        category: category.value.trim(),
        description: description.value.trim(),
        status: status.value
    };

    try {
        if (recordId.value) {
            await recordService.update(recordId.value, record);
            showMessage("Support request updated successfully.");
        } else {
            await recordService.create(record);
            showMessage("Support request added successfully.");
        }

        resetForm();
        await displayRecords();

    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Cancel edit button
cancelEdit.addEventListener("click", () => {
    resetForm();
    showMessage("Editing cancelled.");
});

// Search and filter
search.addEventListener("input", displayRecords);
filterStatus.addEventListener("change", displayRecords);

// Load records when page opens
displayRecords().catch(error => {
    showMessage(error.message, "error");
});
