const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetFeeStructure, SelectFeeStructure, CreateFeeStructure, UpdateFeeStructure, DeleteFeeStructure } = require('./fee_structures.controller');

const FeeStructureController = app => {
    app.get('/fee_structure/data', AccessToken, Authorize('Admin'), GetFeeStructure);
    app.get('/fee_structure/data/:id', AccessToken, Authorize('Admin'), SelectFeeStructure);
    app.post('/fee_structure/create', AccessToken, Authorize('Admin'), CreateFeeStructure);
    app.put('/fee_structure/update/:id', AccessToken, Authorize('Admin'), UpdateFeeStructure);
    app.delete('/fee_structure/delete/:id', AccessToken, Authorize('Admin'), DeleteFeeStructure);
}

module.exports = FeeStructureController;
