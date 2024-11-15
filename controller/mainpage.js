const path=require("path");
const userdb=require('../model/user');
const shopsdb=require('../model/shops');
const servicedb=require('../model/services');
const workersdb=require('../model/workers');
const appointmentdb=require('../model/appointments');
const axios=require("axios");
const Razorpay=require("razorpay");
// to enter main page
exports.mainpage=(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/mainpage.html'));
}

//to open the shops page
exports.openshops=(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/viewshops.html'));
}

//to get the all shops list
exports.getshopslist=async(req,res)=>{
    const {sevice,venue}=req.body;
    console.log(sevice,venue);
    try{
        const shops = await shopsdb.findAll({
            where: { location: venue },
            include: [{
                model: servicedb,
                where: { name: sevice },
                attributes: ['service_id', 'name', 'price', 'duration'] // Select specific fields from Services
            }],
            attributes: ['id', 'name', 'location', 'contact','shopimage'] // Select specific fields from Shops
        });
        res.json(shops);

    }catch(err){
        console.log("while getting tables in be",err)
    }
}

// get the shops workers and service
exports.shopsservice_workers=async(req,res)=>{
    const shopid=req.query.shopid;
    try{
        const allservices=await servicedb.findAll({where:{shop_id:shopid}});
        const allworkers=await workersdb.findAll({where:{shop_id:shopid}}); 
        res.json({allservices,allworkers});
    }catch(err){
        console.log("while getting workers and service in be",err)
    }
}

// to enter appointment details

exports.confirmappointment=async(req,res)=>{
    const{shopId,serviceId,workerId,shopname,serviceprice}=req.body;
    try{
        const user=await userdb.findByPk(req.session.userId);
        
        //to open razor pay
        const instance=new Razorpay({
            key_id:'rzp_test_PL7AOFdQmx9dUn',
            key_secret:'4Wf3zXsJxZ2C4Th7PvH9ruLV',
        })
        const option={
            amount:(serviceprice*100),
            currency:"INR",
        }
        const razorpay_order=await instance.orders.create(option);
        console.log("razorpay order",razorpay_order);
       
        // to send mail upon booking appointment
        const confirmmail=await axios.post(
            'https://api.sendinblue.com/v3/smtp/email',
            {
              sender:{email:"yogeshsri1209@gmail.com", name:shopname},
              to:[{email:user.mail}],
              subject:"Appointment confirmed",
              htmlContent:`
              <body>
                   <h1>Appoitment booked</h1>
                   <p>Hi ${user.name} we are happy that you had booked your appoitment with us</p>
              </body>
              `
            },
            {
                headers:{
                    'Content-Type':'application/json',
                    'api-key':'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',
                }
            }
        )



//         const SibApiV3Sdk = require('@sendinblue/client');
// const client = new SibApiV3Sdk.TransactionalEmailsApi();
// client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, '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');
// console.log("user.mail",user.mail);
// const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
//     sender: { email:"yogeshsri1209@gmail.com", name: shopname },
//     to: [{ email: user.mail, name: user.name }],
//     subject: "Appointment confirmed",
//     htmlContent: `
//               <body>
//                    <h1>Appoitment booked</h1>
//                    <p>Hi ${user.name} we are happy that you had booked your appoitment with us</p>
//               </body>
//               `,
// });

// await client.sendTransacEmail(sendSmtpEmail)
//     .then(data => console.log('Email sent:', data))
//     .catch(error => console.error('Error:', error));

        await appointmentdb.create({
            user_id:req.session.userId,
            shop_id:shopId,
            service_id:serviceId,
            worker_id:workerId,
            status:"pending",
        })
        console.log("appointment datum entered");

        res.json({
            message:"appointment confirmed",
            url:`http://localhost:3000/charmy/charmy_mainpage?islogin=true&loginname=${user.name}`,
            order:razorpay_order,
            prefill:{
                username:user.name,
                shopname:shopname,
            },
            key:'rzp_test_PL7AOFdQmx9dUn',
        });
    }catch(err){
        console.log("while confirming appointments in be",err)
    }
}