import axios from "../lib/axios";
import { signInWithFacebook, signInWithGoogle } from "./ssoAuthenticator";

export default async (provider?: string) => {
    try {
        let user;
        switch(provider) {
            case "facebook":
                user = await signInWithFacebook();
                break;
            default:
                user = await signInWithGoogle();
        }
        const res = await axios.post("/UserAuth/validate", {
            name: user?.displayName,
            email: user?.email,
            profile_pic: user?.photoURL,
            firebase_uid: user?.uid

        });
        const { _id, __v, ...authenticatedUser } = res.data.data.user;
        localStorage.setItem('user', JSON.stringify(authenticatedUser))
        localStorage.setItem('access_token', res.data.data.access_token)
        window.location.href = "/";
    } catch (error) {
        console.log(error);
    }
}