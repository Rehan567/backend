const getAllProducts = async (req, res) => {
    res.status(200).json({ msg: "i am getAllPRoduct" })
}

const getAllProductsTesting = async (req, res) => {
    res.status(200).json({ masg: " i am gettung allProductTesting" })
}

module.exports = { getAllProducts, getAllProductsTesting }