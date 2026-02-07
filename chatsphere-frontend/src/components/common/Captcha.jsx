import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

/**
 * Google reCAPTCHA component
 * Add to login and signup forms for bot protection
 */
export default function Captcha({ onVerify, theme = "dark" }) {
    const recaptchaRef = useRef(null);

    // Get site key from environment variable
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Test key

    const handleChange = (token) => {
        if (token) {
            onVerify(token);
        }
    };

    const handleExpired = () => {
        onVerify(null);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--spacing-md)" }}>
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={handleChange}
                onExpired={handleExpired}
                theme={theme}
            />
        </div>
    );
}
