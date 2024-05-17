const db= require("../models");
const Booking = db.event_booking

const createBooking = async(req,res)=>{
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json({ booking });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error during insertion" });
      }
};

const getBooking = async(req,res)=>{
    try{
        const custId = req.query.customer_id;
        let results;
        if(custId){
            results= await Booking.findOne({where:{
                customer_id:custId
            }})
        }
        res.status(200).send(results);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error while fetching results"})
    }
}
module.exports ={createBooking, getBooking};