const uploadImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            message: "No images uploaded",
        });
    }

    const images = req.files.map((file) => `/assets/${file.filename}`);

    return res.status(201).json({
        message: "Images uploaded successfully",
        images,
    });
};

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No image uploaded",
        });
    }

    return res.status(201).json({
        message: "Image uploaded successfully",
        image: `/assets/${req.file.filename}`,
    });
};

module.exports = {
    uploadImages,
    uploadImage,
};