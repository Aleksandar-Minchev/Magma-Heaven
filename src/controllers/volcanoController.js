import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import volcanoService from "../services/volcanoService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const volcanoController = Router();

volcanoController.get('/', async (req, res) => {
    try {
        const volcanoes = await volcanoService.getAll();
        res.render('volcanoes/catalog', { volcanoes });        
    } catch (err) {
        res.render('/', {
            error: getErrorMessage(err)
        }); 
    }
});

volcanoController.get('/search', async (req, res) => {
    const filter = req.query;

    try {
        const volcanoes = await volcanoService.getAll(filter);
        res.render('volcanoes/search', {volcanoes, filter, volcanoTypes: volcanoTypesView()});   
        
    } catch (err) {
        res.render('volcanoes/search', {
            error: getErrorMessage(err)
        });
    }
});

volcanoController.get('/create', isAuth, (req, res) => {
    const volcanoTypes = volcanoTypesView();

    res.render('volcanoes/create', {volcanoTypes})
});

volcanoController.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const ownerId = req.user.id;
    const volcanoTypes = volcanoTypesView(volcanoData.typeVolcano);

    try {
        await volcanoService.create(volcanoData, ownerId);
        res.redirect('/volcanoes')
    } catch (err) {
        res.render('volcanoes/create', {
            error: getErrorMessage(err),
            volcanoes: volcanoData,
            volcanoTypes
        })
    }
});

volcanoController.get('/:volcanoId/details', async (req, res) => {
    const volcanoId = req.params.volcanoId;

    try {
        const volcano = await volcanoService.getOne(volcanoId);

        const isOwner = volcano.owner?.equals(req.user?.id);
        const isVoted = volcano.voteList.includes(req.user?.id);

        res.render('volcanoes/details', {volcano, isOwner, isVoted});
        
    } catch (err) {
        res.redirect('404');
    }
});
volcanoController.get('/:volcanoId/vote', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId
    const userId = req.user.id;

    try {
        const volcano = await volcanoService.vote(volcanoId, userId);
        res.redirect(`/volcanoes/${volcanoId}/details`)
    } catch (err) {
        res.redirect('404');
    }
});

function volcanoTypesView (volcanoType){
    const volcanoTypesList = {
        'supervolcanoes': 'Supervolcanoes',
        'submarine': 'Submarine',
        'subglacial': 'Subglacial',
        'mud': 'Mud',
        'stratovolcanoes': 'Stratovolcanoes',
        'shield': 'Shield'
    };

    const volcanoTypes = Object.keys(volcanoTypesList).map(value => ({
        value,
        label: volcanoTypesList[value],
        selected: value === volcanoType ? 'selected' : '',
    }));

    return volcanoTypes;
}

export default volcanoController;