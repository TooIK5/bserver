const { Locations } = require("../../models/models")
const ApiError = require('../../error/apierror');

class locationsController {
    async getAll(req, res) {
        let allocations = await Locations.findAll();
        if (!allocations[0]) {
            let newLocationList = await Locations.create();
            return res.json(newLocationList); 
        }
           return res.json(allocations[0]); 
        }  
    }

module.exports = new locationsController();