const Sequelize=require("sequelize");
const sequelize=require('../util/database');
const Services=sequelize.define("services",{
    service_id :{
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
    price :{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    duration:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
}, {
    freezeTableName: true,
    timestamps: false // This removes createdAt and updatedAt fields
});
module.exports=Services;