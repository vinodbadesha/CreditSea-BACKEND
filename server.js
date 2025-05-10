const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const path = require("path")
const dbPath = path.join(__dirname, "creditsea.db")

const {open} = require("sqlite")
const sqlite3 = require("sqlite3")

let db

const initializeDbAndServer = async (request, response) => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        await db.run(
            `CREATE TABLE IF NOT EXISTS loans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                loan_amount REAL NOT NULL,
                loan_tenure_in_months INTEGER NOT NULL,
                employment_status TEXT NOT NULL,
                reason_for_loan TEXT NOT NULL,
                employment_address VARCHAR(250) NOT NULL,
                date_applied TEXT NOT NULL,
                loan_status TEXT DEFAULT "PENDING"
            )`
        )

        app.listen(4000, () => {
            console.log("Server is running successfully at Port: 4000")
        })
        
    }
    catch(error){
        console.log("Error: ", error)
        process.exit(1)
    }
}

initializeDbAndServer()

// POST API
app.post("/get-loan", async (request, response) => {
    const {fullName, loanAmount, loanTenureInMonths, employmentStatus, reasonForLoan, employmentAddress, dateApplied} = request.body
    const postQuery = `
        INSERT INTO loans
            (full_name, loan_amount, loan_tenure_in_months, employment_status, reason_for_loan, employment_address, date_applied)
        VALUES
            ("${fullName}", ${loanAmount}, ${loanTenureInMonths}, "${employmentStatus}", "${reasonForLoan}", "${employmentAddress}", "${dateApplied}")
    `

    await db.run(postQuery)
    response.send("Query posted successfully.")

})

// GET API
app.get("/", async (request, response) => {
    const loansDataQuery = `
        SELECT *
        FROM loans
    `
    const data = await db.all(loansDataQuery)
    response.send(data)
})