const formulario = document.querySelector("form");
const r = document.querySelector(".input10000")
const em = document.querySelector(".input100") 
const pass = document.querySelector(".input1000")


function cadastro(){

    fetch("http://localhost:8080/signup",{
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        method: "POST", redirect: 'manual',
        body: JSON.stringify({ra: r.value, email: em.value,
            password: pass.value })
    })
    .then(response => {if(response.ok){location.replace("home.html");} else{alert("Cadastro Inválido!")}})
    .catch(function(err) {
        console.info(err);
    });
};

formulario.addEventListener('submit', function(event){
    event.preventDefault();

    cadastro();
});