const db= require("../models");
const Booking = db.event_booking;
const { updateTicketInventory } = require('../Controllers/ticketinventorycontroller');

const createBooking = async(req,res)=>{
    try {
        const{ticket_id, no_of_person}= req.body;
        const booking = await Booking.create(req.body);

        await updateTicketInventory(ticket_id, no_of_person);
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