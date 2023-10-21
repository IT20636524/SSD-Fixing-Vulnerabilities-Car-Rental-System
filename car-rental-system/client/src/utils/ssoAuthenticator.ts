import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from "firebase/auth";
import { app } from "../auth/firebase";

const auth = getAuth(app);

export function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	return signInWithPopup(auth, provider)
		.then((result) => {
			const user = result.user;
			return user;
		}).catch((error) => {
			console.error(error);
		});
}

export function signInWithFacebook() {
	const provider = new FacebookAuthProvider();
	return signInWithPopup(auth, provider)
		.then((result) => {
			// The signed-in user info.
			const user = result.user;
			return user;
		})
		.catch((error) => {
			console.error(error);
		});
}

export async function ssoLogOut() {
	try {
		await signOut(auth);
	} catch (error) {
		console.error("Unable to sign out");
	}
}