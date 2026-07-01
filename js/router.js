const routes = {};

export function registerRoute(name,page){

    routes[name] = page;

}

export function navigate(name){

    const app = document.getElementById("app");

    if(!routes[name]){

        console.error("Route not found:",name);

        return;

    }

    app.innerHTML = routes[name]();

    if(name === "login"){

        import("../services/time.service.js")
        .then(module=>{

            module.startLiveClock();

        });

        import("./auth/login.js")
        .then(module=>{

            module.initLogin();

        });

    }

    if(name === "register"){

        import("./auth/register.js")
        .then(module=>{

            module.initRegister();

        });

    }

    if(name === "register-institution"){

        import("./auth/registerInstitution.js")
        .then(module=>{

            module.initRegisterInstitution();

        });

    }

}
