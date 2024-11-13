const path=require("path");
const bcrypt=require("bcrypt");
const userdb=require('../model/user');
// to open signuppage

exports.opensignup=(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/signup.html'));
}

//to add user data to db
exports.createuser=async(req,res)=>{
    const{name,mail,phnumber,password}=req.body;
    console.log('password',password);
    try{
       const hashedpassword=await bcrypt.hash(password,10);
       console.log('hashedpassword',hashedpassword);
       const user=await userdb.create({
        name:name,
        mail:mail,
        phnumber:phnumber,
        password:hashedpassword,
       });
       if(user){
             res.json({redirect:true,url:'http://localhost:3000/charmy/charmy_loginpage'});
       }
       else{
        res.json({redirect:false});
       }
       
    }catch(err){
        console.log("while addinguser into db",err)
    }
}

// to open login page
exports.openlogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/loginpage.html'));
}

// to check whether the user is a user or not 
exports.checklogin=async(req,res)=>{
    const{mail,password}=req.body;
    try{
        const user=await userdb.findOne({where:{mail:mail}});
        if(user){
            bcrypt.compare(password,user.password,async(err,result)=>{
                if(result){
                    req.session.userId = user.id;
                    await req.session.save((err) => {
                        if (err) {
                            console.log('Error saving session:', err);
                        } else {
                            console.log('Session saved successfully');
                        }
                    });
                                     
                   res.json({url:`http://localhost:3000/charmy/charmy_mainpage?islogin=true&loginname=${user.name}`});
                }
                else{
                    res.json({message:'incorrect password'})
                }
            })
        }
        else{
            res.json({message:'not a user'})
        }

    }catch(err){
        console.log('in backend while logging in',err);
    }
}