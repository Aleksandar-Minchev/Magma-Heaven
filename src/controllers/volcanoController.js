import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import volcanoService from "../services/volcanoService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { volcanoTypesView } from "../utils/volcanoUtils.js";

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

volcanoController.get('/:volcanoId/edit', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const volcano = await volcanoService.getOne(volcanoId);
    const volcanoType = volcanoTypesView(volcano.typeVolcano)

    if (!volcano.owner?.equals(req.user?.id)){
        return res.redirect('404')
    }

    res.render('volcanoes/edit', {volcano, volcanoType})
});

volcanoController.post('/:volcanoId/edit', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const volcanoData = req.body;
    const volcano = await volcanoService.getOne(volcanoId);
    const volcanoType = volcanoTypesView(volcano.typeVolcano)

    if (!volcano.owner?.equals(req.user?.id)){
        return res.redirect('404')
    }

    try {
        await volcanoService.change(volcanoData, volcanoId); 
        res.redirect(`/volcanoes/${volcanoId}/details`);       
    } catch (err) {
        res.render('volcanoes/edit', {volcano: volcanoData, error: getErrorMessage(err), volcanoType})
    }
    
});




export default volcanoController;