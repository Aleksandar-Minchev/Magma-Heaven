import Volcano from "../models/Volcano.js";

export default {
    create (volcanoData, ownerId){
        const result = Volcano.create({
            ...volcanoData,
            owner: ownerId
        })

        return result;
    },

    async getAll(filter = {}){
        let volcanoes = await Volcano.find({});
        if (filter){

        }
    
        return volcanoes;
    }

}