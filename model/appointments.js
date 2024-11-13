const Sequelize=require("sequelize");
const sequelize=require('../util/database');
const Appointments=sequelize.define("appointments",{
    appointment_id :{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    user_id : {
        type:Sequelize.INTEGER,
        allowNull:false,
        foreignkey:true,
    },
    shop_id : {
        type:Sequelize.INTEGER,
        allowNull:false,
        foreignkey:true,
    },
    service_id :{
        type:Sequelize.INTEGER,
        allowNull:false,
        foreignkey:true,
    },
    worker_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        foreignkey:true, 
    },
   
    status:{
        type:Sequelize.STRING,
        allowNull:false, 
    }
  
}, {
    freezeTableName: true,
    timestamps: false // This removes createdAt and updatedAt fields
});
module.exports=Appointments;