import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import volcanoService from "../services/volcanoService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const volcanoController = Router();

volcanoController.get('/', (req, res) => {
    res.render('volcanoes/catalog')
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
        res.redirect('volcanoes/catalog')
    } catch (err) {
        res.render('volcanoes/create', {
            error: getErrorMessage(err),
            volcanoes: volcanoData,
            volcanoTypes
        })
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