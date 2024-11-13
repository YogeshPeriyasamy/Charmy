const express=require("express");
const router=express.Router();
const mainpagecontroller=require('../controller/mainpage');
const logincontroller=require('../controller/login');
//to the main page
router.get('/charmy_mainpage',mainpagecontroller.mainpage);

// to enter login page
router.get('/charmy_loginpage',logincontroller.openlogin);

// to signup new user and open that page
router.get('/regnewuser',logincontroller.opensignup);

// to add new user
router.post('/createuser',logincontroller.createuser);

//check he/ she is a user
router.post('/enterlogin',logincontroller.checklogin);

//to open the shops with given venue ansd service
router.get('/charmy_shopspage',mainpagecontroller.openshops);

//to get the shopslist
router.post('/getshops',mainpagecontroller.getshopslist);

//get the workers and service
router.get('/getshopsservice_workers',mainpagecontroller.shopsservice_workers);

// to enter appointment details
router.post('/confirmAppointment',mainpagecontroller.confirmappointment);
module.exports=router;