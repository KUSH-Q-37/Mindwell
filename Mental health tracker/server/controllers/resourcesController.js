const Resource = require("../models/Resource");
const { getOrSet, clearCache } = require("../services/cacheService");

exports.getResources = async (req, res) => {
  try {
    const resources = await getOrSet("all_resources", async () => {
      return await Resource.find().sort({ createdAt: -1 }).lean();
    });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await getOrSet(`resources_${category}`, async () => {
      return await Resource.find({ category }).sort({ createdAt: -1 }).lean();
    });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Resource not found" });
    }
    res.status(500).send("Server error");
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, description, category, contactInfo } = req.body;

    const newResource = new Resource({
      title,
      description,
      category,
      contactInfo,
    });

    const resource = await newResource.save();
    clearCache(); // Invalidate all resource caches on new entry
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json({ msg: "Resource removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.verifyResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true, updatedAt: Date.now() } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
