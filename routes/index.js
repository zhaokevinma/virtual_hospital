// ------ Dependencies
const router = require("express").Router();
const apiRoutes = require("./api");
const path = require("path");

// ------ API routes
router.use("/api", apiRoutes);

// Default to index.html
router.use(function(req, res) {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// ------ Export router
module.exports = router;