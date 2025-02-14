export const volcanoTypesView = (volcanoType) => {
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