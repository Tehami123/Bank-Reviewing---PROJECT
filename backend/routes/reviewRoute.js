
const express = require("express")
const { getAllReview, createStory } = require("../controllers/reviewController")

const router = express.Router()

router.get('/all',getAllReview);
router.post('/create',createStory);


module.exports = router;