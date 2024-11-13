const Sequelize=require("sequelize");
const sequelize=require('../util/database');
const Shops=sequelize.define("shops",{
    id :{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    name : {
        type:Sequelize.STRING,
        allowNull:false,
    },
    location : {
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    contact :{
        type:Sequelize.STRING,
        allowNull:false,
    },
    shopimage:{
        type:Sequelize.STRING,
        allowNull:false,
    }
}, {
    freezeTableName: true,
    timestamps: false // This removes createdAt and updatedAt fields
});
module.exports=Shops;