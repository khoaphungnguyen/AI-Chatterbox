import {getApp, getApps, initializeApp, FirebaseOptions} from "firebase/app"
import { getFirestore } from "firebase/firestore"

const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string
const parsedConfig = JSON.parse(config) as FirebaseOptions

const app = getApps().length ? getApp() : initializeApp(parsedConfig);
const db = getFirestore(app);

export { db };
