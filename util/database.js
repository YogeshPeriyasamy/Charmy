const Sequelize=require("sequelize");
const sequelize=new Sequelize(process.env.name,process.env.root,process.env.password,{
    dialect:'mysql',
    host:process.env.host,
})
module.exports=sequelize;