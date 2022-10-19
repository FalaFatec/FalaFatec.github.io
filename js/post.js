const formulario = document.querySelector("form");
const lg = document.querySelector(".input100")
const pass = document.querySelector(".input1000")

function login(){

    fetch("https://fala-fatec.herokuapp.com/signin",{
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        method: "POST", redirect: 'manual',
        body: JSON.stringify({raOrEmail: lg.value,
            password: pass.value })
    })
    .then(response => {if(response.ok){location.replace("home.html");} else{alert("Login Inválido!")}})
    .catch(function(err) {
        console.info(err);
    });
};

formulario.addEventListener('submit', function(event){
    event.preventDefault();

    login();
});
