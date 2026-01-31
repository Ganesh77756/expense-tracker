import axios from "axios";

const API_URL = "http://localhost:5000/api/transactions";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjdmMDI5MjBlZDI2Zjc0ZjFhNmU4NCIsImlhdCI6MTc2NDIyNTI0NCwiZXhwIjoxNzY0ODMwMDQ0fQ.cwrM5qhIH0eioepvXv2L93iwAT9Rm0alsrAmfoXc0ak";  

const data = [
  {
    "title": "Salary",
    "type": "income",
    "amount": 5000,
    "category": "Job",
    "date": "2025-11-30",
    "description": "Monthly salary"
  },
  {
    "title": "Freelance Work",
    "type": "income",
    "amount": 1800,
    "category": "Freelance",
    "date": "2025-11-25",
    "description": "Website project"
  },
  {
    "title": "Electricity Bill",
    "type": "expense",
    "amount": 120,
    "category": "Bills",
    "date": "2025-11-22",
    "description": "Electricity usage"
  },
  {
    "title": "Groceries",
    "type": "expense",
    "amount": 260,
    "category": "Food",
    "date": "2025-11-18",
    "description": "Weekly groceries"
  },
  {
    "title": "Movie",
    "type": "expense",
    "amount": 40,
    "category": "Entertainment",
    "date": "2025-11-16",
    "description": "Movie with friends"
  },
  {
    "title": "Fuel",
    "type": "expense",
    "amount": 50,
    "category": "Transport",
    "date": "2025-11-14",
    "description": "Bike fuel"
  },
  {
    "title": "Dining Out",
    "type": "expense",
    "amount": 75,
    "category": "Food",
    "date": "2025-11-10",
    "description": "Lunch outside"
  },
  {
    "title": "Bonus",
    "type": "income",
    "amount": 1200,
    "category": "Job",
    "date": "2025-11-05",
    "description": "Performance bonus"
  },


  {
    "title": "Salary",
    "type": "income",
    "amount": 5000,
    "category": "Job",
    "date": "2025-10-30",
    "description": "Monthly salary"
  },
  {
    "title": "Groceries",
    "type": "expense",
    "amount": 250,
    "category": "Food",
    "date": "2025-10-28",
    "description": "Food essentials"
  },
  {
    "title": "Mobile Recharge",
    "type": "expense",
    "amount": 30,
    "category": "Bills",
    "date": "2025-10-27",
    "description": "Prepaid recharge"
  },
  {
    "title": "Online Course",
    "type": "expense",
    "amount": 200,
    "category": "Education",
    "date": "2025-10-25",
    "description": "JavaScript course"
  },
  {
    "title": "Freelance Logo",
    "type": "income",
    "amount": 900,
    "category": "Freelance",
    "date": "2025-10-20",
    "description": "Logo design"
  },
  {
    "title": "Rent",
    "type": "expense",
    "amount": 1500,
    "category": "Housing",
    "date": "2025-10-05",
    "description": "Monthly rent"
  },
  {
    "title": "Coffee",
    "type": "expense",
    "amount": 15,
    "category": "Food",
    "date": "2025-10-02",
    "description": "Coffee with friend"
  },


  {
    "title": "Salary",
    "type": "income",
    "amount": 5000,
    "category": "Job",
    "date": "2025-09-30",
    "description": "Monthly salary"
  },
  {
    "title": "Gym Membership",
    "type": "expense",
    "amount": 300,
    "category": "Health",
    "date": "2025-09-28",
    "description": "Monthly gym fee"
  },
  {
    "title": "Groceries",
    "type": "expense",
    "amount": 230,
    "category": "Food",
    "date": "2025-09-26",
    "description": "Monthly groceries"
  },
  {
    "title": "Freelance Editing",
    "type": "income",
    "amount": 1000,
    "category": "Freelance",
    "date": "2025-09-25",
    "description": "Video editing"
  },
  {
    "title": "Bus Travel",
    "type": "expense",
    "amount": 20,
    "category": "Transport",
    "date": "2025-09-20",
    "description": "Local travel"
  },
  {
    "title": "Electricity Bill",
    "type": "expense",
    "amount": 110,
    "category": "Bills",
    "date": "2025-09-17",
    "description": "Electricity usage"
  },
  {
    "title": "Snacks",
    "type": "expense",
    "amount": 25,
    "category": "Food",
    "date": "2025-09-15",
    "description": "Evening snacks"
  },
  {
    "title": "Rent",
    "type": "expense",
    "amount": 1500,
    "category": "Housing",
    "date": "2025-09-05",
    "description": "Monthly rent"
  },
  {
    "title": "Petrol",
    "type": "expense",
    "amount": 70,
    "category": "Transport",
    "date": "2025-09-03",
    "description": "Bike fuel"
  }
];

async function insertData() {
  try {
    for (const item of data) {
      const res = await axios.post(API_URL, item, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      console.log("Inserted:", res.data.title);
    }
    console.log(" All data inserted successfully!");
  } catch (error) {
    console.error(" Error inserting data:", error.response?.data || error);
  }
}

insertData();
