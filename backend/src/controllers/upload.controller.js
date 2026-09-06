import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadToImageKit = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided." });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `visitor_${Date.now()}.jpg`,
      folder: "/visitors",
    });

    return res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload image." });
  }
};