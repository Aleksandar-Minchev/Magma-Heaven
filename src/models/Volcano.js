import { Schema, model, Types } from "mongoose";

const volcanoSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [2, 'Title should be at least 2 characters long!'],              
    },
    location: {
        type: String,
        required: [true, 'Location are required!'],
        minLength: [3, 'Location should be at least 3 characters long!']
    },
    elevation : {
        type: Number,
        required: [true, 'Elevation are required!'],
        min: [0, 'Elevation should be at least 0 characters long!'],
    },
    lastEruption: {
        type: Number,
        required: [true, 'Year of Last Eruption is required!'],
        min: [0, 'Year of Last Eruption should be between 0 and 2024!'],
        max: [2024, 'Year of Last Eruption should be between 0 and 2024!'],
    },
    image: {
        type: String,
        required: [true, 'ImageURL is required!'],
        match: [/^https?:\/\//, 'ImageUrl should start with http://... or https://...!'] 
    },
    typeVolcano: {
        type: String,
        required: [true, 'Volcano Type is required!']
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [10, 'Description should be at least 10 characters long!']
    },
    voteList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Volcano = model('Volcano', volcanoSchema);

export default Volcano;