import {storage} from "@/appwrite";
import {Image} from "@/typings";

const getUrl = async (image: Image) => {
    return storage.getFilePreview(image.bucketId, image.fileId);
}

export default getUrl;