const Sequelize=require("sequelize");
const sequelize=require('../util/database');
const Workers=sequelize.define("workers",{
    worker_id :{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    name : {
        type:Sequelize.STRING,
        allowNull:false,
    },
    shop_id : {
        type:Sequelize.INTEGER,
        allowNull:false,
        foreignkey:true,
    },
    specialty :{
        type:Sequelize.STRING,
        allowNull:false,
    },
    workerimage:{
        type:Sequelize.STRING,
        allowNull:false,
    },
  
}, {
    freezeTableName: true,
    timestamps: false // This removes createdAt and updatedAt fields
});
module.exports=Workers;