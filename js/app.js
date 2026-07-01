import { RegisterInstitutionPage } from "../pages/register-institution/register-institution.js";
import { ForgotPasswordPage } from "../pages/forgot-password/forgot-password.js";
import { initLogin } from "./auth/login.js";
import { registerRoute, navigate } from "./router.js";
import { SplashScreen } from "../pages/splash/splash.js";
import { LoginPage } from "../pages/login/login.js";
import { RegisterPage } from "../pages/register/register.js";
import { initRegister } from "./auth/register.js";

registerRoute("splash", SplashScreen);
registerRoute("login", LoginPage);
registerRoute("register", RegisterPage);
registerRoute("forgot-password", ForgotPasswordPage);
registerRoute("register-institution", RegisterInstitutionPage);


navigate("splash");

setTimeout(() => {

    navigate("login");

    requestAnimationFrame(() => {

        initLogin();

    });

}, 2000);
