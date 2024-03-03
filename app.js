const express = require('express');
const mysql = require('mysql2');
const path = require("path");
const bodyParser = require('body-parser');


const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));

const correctPassword = '1234';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'SPS',
    password: '1234'
});

app.post('/submit-form', (req, res) => {
    
    const slot = req.body.slot;
    const name = req.body.Name;
    const vehicleNumber = req.body.Vehicle;
    const date = req.body.birthday;
    const entryTime = req.body.Time;

 
    const bookingSql = 'INSERT INTO bookings (slot, name, vehicleNumber, date, entryTime) VALUES (?, ?, ?, ?, ?)';
    const bookingValues = [slot, name, vehicleNumber, date, entryTime];

    connection.query(bookingSql, bookingValues, (err, result) => {
        if (err) {
            console.error('Error executing MySQL query for bookings: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted into bookings successfully');
            
            const guardSql = 'INSERT INTO guard (slot, name, vehicleNumber, date, entryTime) VALUES (?, ?, ?, ?, ?)';
            connection.query(guardSql, bookingValues, (err, result) => {
                if (err) {
                    console.error('Error executing MySQL query for guard: ', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('Data inserted into guard successfully');
                    res.render("booked.ejs");
                }
            });
        }
    });
});



// connection.end();
app.get("/home", (req, res)=>{
    res.render("home.ejs");
});

app.get("/slot-booking", (req, res) => {
    res.render("slotbooking.ejs");
});

app.get("/guard-login", (req, res) => {
  res.render("guard.ejs");
});
app.post("/checkout", (req, res) => {
  const enteredPassword = req.body.password;

  
  if (enteredPassword === correctPassword) {
     
      const query = 'SELECT * FROM guard';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render("checkout.ejs", { bookings: results });
    }
  });
  } else {
      
      res.send('Wrong password. Please try again.');
  }
});
 

app.get("/checkin", (req, res) => {
  const query = 'SELECT * FROM guard';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render("checkin.ejs", { bookings: results });
    }
  });


});



app.post("/checkin-checkout", (req, res) => {
  const bookingId = req.body.bookingId;
  const currentStatus = req.body.currentStatus;

  if (currentStatus === 'checkin') {
     
      const newStatus = 'checkout';

      const updateQuery = 'UPDATE guard SET status = ? WHERE id = ?';
      connection.query(updateQuery, [newStatus, bookingId], (err, result) => {
          if (err) {
              console.error('Error updating status in the database: ', err);
              res.status(500).send('Internal Server Error');
          } else {
              console.log('Status updated successfully');
              res.redirect('/guard-login');
          }
      });
  } else {
      
      const deleteQuery = 'DELETE FROM guard WHERE id = ?';
      connection.query(deleteQuery, [bookingId], (err, result) => {
          if (err) {
              console.error('Error deleting row from the database: ', err);
              res.status(500).send('Internal Server Error');
          } else {
              console.log('Row deleted successfully');
              res.redirect('/guard-login');
          }
      });
  }
});



