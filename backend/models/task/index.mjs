import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({

    title: {
            // type: String,
            type: mongoose.Schema.Types.String,
            required: true,
        },
        description: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        assignedTo: { type: mongoose.Schema.Types.String, ref: 'User'

         },

         status:{
            type: mongoose.Schema.Types.String,
             enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do',

         },
        },{
            timestamp:true
        })

        


   
    
   

export default mongoose.model('Task', taskSchema);
