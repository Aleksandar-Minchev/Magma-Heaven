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
    },

    getOne (volcanoId){
        const query = Volcano.findById(volcanoId);
        return query;
    },

    async vote(volcanoId, userId){
        const volcano = await Volcano.findById(volcanoId);

        if (volcano.owner?.equals(userId)){
            throw new Error ("You can't vote for your own volcanoes")
        }
         if (volcano.voteList.includes(userId)){
            throw new Error ("You've already voted for this volcano")
        }

        volcano.voteList.push(userId);

        return volcano.save();
    }

}