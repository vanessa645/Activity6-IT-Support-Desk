
const KEY = "it-support-desk-demo-v1";

// Eight starting demonstration records
const startingRecords = [
    {
        id: 1,
        title: "Computer not starting",
        category: "Hardware",
        description: "The computer in the laboratory does not power on.",
        status: "Pending"
    },
    {
        id: 2,
        title: "Internet connection problem",
        category: "Network",
        description: "The internet connection in the computer laboratory is unstable.",
        status: "In progress"
    },
    {
        id: 3,
        title: "Microsoft Word installation",
        category: "Software",
        description: "Microsoft Word needs to be installed on a laboratory computer.",
        status: "Completed"
    },
    {
        id: 4,
        title: "Keyboard not working",
        category: "Hardware",
        description: "Some keys on the laboratory keyboard are not responding.",
        status: "Pending"
    },
    {
        id: 5,
        title: "Wi-Fi connection failure",
        category: "Network",
        description: "Students cannot connect to the campus Wi-Fi network.",
        status: "In progress"
    },
    {
        id: 6,
        title: "Antivirus installation",
        category: "Software",
        description: "An antivirus application is required on the office computer.",
        status: "Completed"
    },
    {
        id: 7,
        title: "Printer connection issue",
        category: "Hardware",
        description: "The office printer is not connecting to the computer.",
        status: "Pending"
    },
    {
        id: 8,
        title: "Slow network connection",
        category: "Network",
        description: "The network is very slow when accessing online resources.",
        status: "In progress"
    }
];

// Initialise localStorage only if the key does not exist
if (localStorage.getItem(KEY) === null) {
    localStorage.setItem(KEY, JSON.stringify(startingRecords));
}

// Helper function to read records
function getRecords() {
    return JSON.parse(localStorage.getItem(KEY));
}

// Helper function to save records
function saveRecords(records) {
    localStorage.setItem(KEY, JSON.stringify(records));
}

// Data service
export const recordService = {

    // Return all records
    async list() {
        return getRecords();
    },

    // Return one record
    async get(id) {
        const records = getRecords();

        const record = records.find(item => item.id === Number(id));

        if (!record) {
            throw new Error("Record not found.");
        }

        return record;
    },

    // Create a new record
    async create(record) {
        const records = getRecords();

        const newId = records.length > 0
            ? Math.max(...records.map(item => item.id)) + 1
            : 1;

        const newRecord = {
            id: newId,
            title: record.title,
            category: record.category,
            description: record.description,
            status: record.status
        };

        records.push(newRecord);

        saveRecords(records);

        return newRecord;
    },

    // Update an existing record
    async update(id, record) {
        const records = getRecords();

        const index = records.findIndex(
            item => item.id === Number(id)
        );

        if (index === -1) {
            throw new Error("Record not found.");
        }

        records[index] = {
            id: Number(id),
            title: record.title,
            category: record.category,
            description: record.description,
            status: record.status
        };

        saveRecords(records);

        return records[index];
    },

    // Delete a record
    async remove(id) {
        const records = getRecords();

        const updatedRecords = records.filter(
            item => item.id !== Number(id)
        );

        if (updatedRecords.length === records.length) {
            throw new Error("Record not found.");
        }

        saveRecords(updatedRecords);

        return "Record deleted successfully.";
    }

};
