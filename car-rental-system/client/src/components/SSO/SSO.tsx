import React from 'react'
import handleThirdPartyAuthentication from '../../utils/handleThirdPartyAuthentication'

const SSO: React.FC = () => {
  return (
    <div>
      <p className="text-center mb-4 opacity-50" style={{ color: "#ad1fff" }}>
        Or sign in with
      </p>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        justifyContent: "center",
      }}>
        <button type="button" style={{
          backgroundImage: "url(/social-icons/google.png)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: 'none'
        }} onClick={() => handleThirdPartyAuthentication()} />
        {/* <img src="/social-icons/google.png" alt="google" width="30px" height="auto" />
                                            </button> */}
        <button type="button" style={{
          backgroundImage: "url(/social-icons/facebook.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          border: 'none'
        }} onClick={() => handleThirdPartyAuthentication("facebook")} />
      </div>
    </div>
  )
}

export default SSO

