import axios from "axios";

/**
 * Converts a Base64 Data URL to a File Object.
 */
export const dataURLtoFile = (dataurl, filename = "visitor-photo.jpg") => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * Uploads captured base64 photo to backend ImageKit endpoint.
 */
export const uploadVisitorPhoto = async (base64Photo) => {
  try {
    if (!base64Photo) return "https://via.placeholder.com/150";

    const file = dataURLtoFile(base64Photo);
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:3000/api/upload/imagekit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return response.data.url;
  } catch (error) {
    console.error("ImageKit upload failed, returning placeholder:", error);
    return "https://via.placeholder.com/150";
  }
};