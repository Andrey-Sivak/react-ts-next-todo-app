import {ID, storage} from "@/appwrite";

const uploadImage = async (file: File) => {
    if (!file) return;

    return await storage.createFile(
        '64f63451886625865788',
        ID.unique(),
        file
    );
}

export default uploadImage;