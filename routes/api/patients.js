// ------ Dependencies
const router = require("express").Router();
const patientsController = require("../../controllers/patientsController");

// ------ All
router.route("/")
    .get(patientsController.findAll)
    .post(patientsController.create);

router.route("/:id")
    .get(patientsController.findById)
    .post(patientsController.update);
    
// ------ Export
module.exports = router;