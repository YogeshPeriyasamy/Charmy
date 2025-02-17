const express = require("express");
const cors = require('cors');
const session = require("express-session")
const path = require("path");
// const helmet=require('helmet');
const compression = require('compression');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});



//middlewares
app.use(session({
    secret: "loginkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
    }
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//in network tab requst there will be access allow origin control with it there is options as well its send by browser for special request like post 
//put delete metods it sends option first like asking permission before the actual request its called preflight requeset
app.use(cors({
    origin: "*",
    // method:["GET","POST"], which method should be allowed from other origin//
    credentails: true,
}));

//to provide css for the boooking page set the route
app.use(express.static(path.join(__dirname, 'css')));

//middelware to add security headers
//app.use(helmet({ contentSecurityPolicy: false }));

//middware to compress our file
app.use(compression());
//middle are to config .env
//require('dotenv').config({path:('./util/.env')});
//router 
const router = require('./routes/path');
app.use("/charmy", router);

//database
const sequelize = require('./util/database');
const User = require('./model/user');
const Appointment = require('./model/appointments');
const Shop = require('./model/shops');
const Service = require('./model/services');
const Worker = require('./model/workers');



//to install socket io
// Emit the current count to newly connected clients
// Function to get the count and details of appointments
async function fetchAppointmentData() {
    const appointmentCount = await Appointment.count(); // Get the total count of appointments


    return { appointmentCount };
}

// Emit initial data to clients on connection
io.on('connection', async (socket) => {
    console.log("connection established");
    const appointmentData = await fetchAppointmentData();
    socket.emit('appointmentDataUpdate', appointmentData);

    // Example: Listen for updates on appointments and emit new data (e.g., when appointments are created/updated)
    Appointment.addHook('afterCreate', async () => {
        const updatedData = await fetchAppointmentData();
        io.emit('appointmentDataUpdate', updatedData);
    });
});


// Define User -> Appointment (One-to-Many)
User.hasMany(Appointment, { foreignKey: 'user_id' });
Appointment.belongsTo(User, { foreignKey: 'user_id' });

// Define Shop -> Service (One-to-Many)
Shop.hasMany(Service, { foreignKey: 'shop_id' });
Service.belongsTo(Shop, { foreignKey: 'shop_id' });

// Define Shop -> Worker (One-to-Many)
Shop.hasMany(Worker, { foreignKey: 'shop_id' });
Worker.belongsTo(Shop, { foreignKey: 'shop_id' });

// Define Shop -> Appointment (One-to-Many)
Shop.hasMany(Appointment, { foreignKey: 'shop_id' });
Appointment.belongsTo(Shop, { foreignKey: 'shop_id' });

// Define Service -> Appointment (Many-to-One)
Service.hasMany(Appointment, { foreignKey: 'service_id' });
Appointment.belongsTo(Service, { foreignKey: 'service_id' });

// Define Worker -> Appointment (Many-to-One)
Worker.hasMany(Appointment, { foreignKey: 'worker_id' });
Appointment.belongsTo(Worker, { foreignKey: 'worker_id' });



// Async IIFE to handle await
(async () => {
    try {
        await sequelize.sync();
        server.listen(3000, '0.0.0.0', () => {
            console.log("Database synced and server is running on port 3000");
        });
    } catch (err) {
        console.error("Database not synced", err);
    }
})();
