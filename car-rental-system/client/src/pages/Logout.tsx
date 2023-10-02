import { ssoLogOut } from "../utils/ssoAuthenticator";

const Logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("access_token")
    ssoLogOut();
    window.location.href = "/";

    return (
        <></>
    )

}

export default Logout;