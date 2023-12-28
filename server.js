const express = require('express');
const excel = require('exceljs');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public')); // Assuming your HTML file is in a 'public' folder

app.post('/submitForm', (req, res) => {
    const formData = req.body;

    // Create a new Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Check if the Excel file exists
    let exists = false;
    if (fs.existsSync('formData.xlsx')) {
        exists = true;
        workbook.xlsx.readFile('formData.xlsx')
            .then(() => {
                worksheet.addRow([formData.slot, formData.vehicleNumber, formData.entryTime]);
                return workbook.xlsx.writeFile('formData.xlsx');
            })
            .then(() => {
                res.send('Form data added to Excel sheet!');
            })
            .catch((error) => {
                console.error('Error writing to Excel sheet:', error);
                res.status(500).send('Internal Server Error');
            });
    } else {
        worksheet.addRow(['Slot', 'Vehicle Number', 'Entry Time']);
        worksheet.addRow([formData.slot, formData.vehicleNumber, formData.entryTime]);
        workbook.xlsx.writeFile('formData.xlsx')
            .then(() => {
                res.send('Form data added to a new Excel sheet!');
            })
            .catch((error) => {
                console.error('Error writing to Excel sheet:', error);
                res.status(500).send('Internal Server Error');
            });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
