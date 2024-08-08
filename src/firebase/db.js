import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATpt3Kz6T6uYRioVvKIhFgMxRukO0kZRM",
  authDomain: "casadelahumado-dae46.firebaseapp.com",
  projectId: "casadelahumado-dae46",
  storageBucket: "casadelahumado-dae46.appspot.com",
  messagingSenderId: "559007872097",
  appId: "1:559007872097:web:6bbcb108d01f68433d2620",
};

// Initialize Firebase
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
