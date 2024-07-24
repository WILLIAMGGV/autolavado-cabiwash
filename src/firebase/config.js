import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDliRcsgjxt9JSPrIRL1g8GsdqUhhkKD68",
  authDomain: "cabi-wash-app.firebaseapp.com",
  projectId: "cabi-wash-app",
  storageBucket: "cabi-wash-app.appspot.com",
  messagingSenderId: "123449013354",
  appId: "1:123449013354:web:47a49fa0963df28d4ec613",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
