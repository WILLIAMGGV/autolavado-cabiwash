import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAH9EzD8wsN2yeGIHkLJVr8_Zs6yq815fE",
  authDomain: "cabi-wash-web.firebaseapp.com",
  projectId: "cabi-wash-web",
  storageBucket: "cabi-wash-web.appspot.com",
  messagingSenderId: "1057884777550",
  appId: "1:1057884777550:web:c6a82ededdc0a5386c671f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export async function uploadFile(file, valorqr) {
  try {
    console.log(storage);
    const storageRef = ref(storage, valorqr);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
