import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from "firebase/auth";
import { app } from "../auth/firebase";

const auth = getAuth(app);

export function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	return signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			// The signed-in user info.
			const user = result.user;
			return user;
		}).catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
}

export function signInWithFacebook() {
	const provider = new FacebookAuthProvider();
	return signInWithPopup(auth, provider)
		.then((result) => {
			// The signed-in user info.
			const user = result.user;

			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			const credential = FacebookAuthProvider.credentialFromResult(result);
			const accessToken = credential?.accessToken;
			return user;
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = FacebookAuthProvider.credentialFromError(error);

			// ...
		});
}

export async function ssoLogOut() {
	try {
		await signOut(auth);
	} catch (error) {
		console.error("Unable to sign out");
	}
}