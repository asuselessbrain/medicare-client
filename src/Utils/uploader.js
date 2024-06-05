import axios from 'axios';

const uploader = async ({imageFile}) => {
    const apiKey = import.meta.env.VITE_IMAGE_BB_API;
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const res = await axios.post(url, imageFile, {
        headers: {
            "content-type": "multipart/form-data",
        },
    });
    return res.data
};

export default uploader;