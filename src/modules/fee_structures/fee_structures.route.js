const AccessToken = require('../../middleware/authenticate');
const { GetFeeStructure, SelectFeeStructure, CreateFeeStructure, UpdateFeeStructure, DeleteFeeStructure } = require('./fee_structures.controller');

const FeeStructureController = app => {
    app.get('/fee_structure/data', AccessToken, GetFeeStructure);
    app.get('/fee_structure/data/:id', AccessToken, SelectFeeStructure);
    app.post('/fee_structure/create', AccessToken, CreateFeeStructure);
    app.put('/fee_structure/update/:id', AccessToken, UpdateFeeStructure);
    app.delete('/fee_structure/delete/:id', AccessToken, DeleteFeeStructure);
}

module.exports = FeeStructureController;
