const d = document, 
$card = d.querySelector(".crud-cards"), 
$form = d.querySelector(".crud-form"), 
$formC = d.querySelector(".crud-form__container"), 
$title = d.querySelector(".crud-title"), 
$template = d.getElementById("crud-template").content, 
$fragment = d.createDocumentFragment(); 

const ajax = options => {
    let {url, method, success, error, data} = options; 
    const xhr = new XMLHttpRequest(); 
    
    /*readystatechange lanza respuesta de estado*/ 
    xhr.addEventListener("readystatechange", e => {
        if(xhr.readyState !== 4) return; 
        if(xhr.status >= 200 && xhr.status < 300){
            let json = JSON.parse(xhr.responseText); 
            success(json); //en xaso de exito se va a getall 
        }else{
            let message = xhr.statusText || "Ocurrio un Error"; 
            error(`Error ${xhr.statusText}: ${message}`); 
        }
    }); 

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
}

const getall = () => {
    ajax({
        url: "http://localhost:3000/Ferrari", 
        success: (res) => {
            res.forEach(el => {
                $template.querySelector(".name").textContent = el.nombre; 
                $template.querySelector(".power").textContent = el.potencia; 
                $template.querySelector(".speed").textContent = el.velocidad; 
                $template.querySelector(".img").innerHTML = `<img src="${el.img}" alt="" srcset="">`;
                $template.querySelector(".price").textContent = el.precio;

                $template.querySelector(".edit").dataset.id = el.id; 
                $template.querySelector(".edit").dataset.nombre = el.nombre; 
                $template.querySelector(".edit").dataset.potencia = el.potencia; 
                $template.querySelector(".edit").dataset.velocidad = el.velocidad; 
                $template.querySelector(".edit").dataset.precio = el.precio;
                $template.querySelector(".edit").dataset.img = el.img; 

                $template.querySelector(".delete").dataset.id = el.id; 

                let $clone = d.importNode($template, true); 
                $fragment.appendChild($clone);  
            }); 
            $card.appendChild($fragment); 
        },
        error: err => {
            $card.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`); 
        }
    })
}

d.addEventListener("DOMContentLoaded", getall); 

d.addEventListener("submit", e => {
    if(e.target === $form){
        e.preventDefault(); 
        
        if(!e.target.id.value){
            ajax({
                url: "http://localhost:3000/Ferrari", 
                method: "POST", 
                success: (res) => location.reload(), 
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`), 
                data: {
                    nombre: e.target.nombre.value, 
                    potencia: e.target.potencia.value, 
                    velocidad: e.target.speed.value, 
                    img: "assets/img/logoF.png", 
                    precio: e.target.precio.value 
                }
            });
        }else{
            //methodo PUT
            ajax({
                url: `http://localhost:3000/Ferrari/${e.target.id.value}`, 
                method: "PUT", 
                success: (res) => location.reload(), 
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`), 
                data: {
                    nombre: e.target.nombre.value, 
                    potencia: e.target.potencia.value, 
                    velocidad: e.target.speed.value, 
                    precio: e.target.precio.value,
                    img: e.target.img.value 
                }
            });
        }
    }
}); 


d.addEventListener("click", e => {
    if(e.target.matches(".edit")){
        $title.textContent = "Editar ferrari"; 

        $form.nombre.value = e.target.dataset.nombre; 
        $form.potencia.value = e.target.dataset.potencia; 
        $form.speed.value = e.target.dataset.velocidad;
        $form.precio.value = e.target.dataset.precio;
        $form.img.value = e.target.dataset.img; 
        $form.id.value = e.target.dataset.id; 

        scrollTo(0,0); 
    
    }


    if(e.target.matches(".delete")){
        let isDelete = confirm(`Quiere eliminar ${e.target.dataset.id}?`); 

        if(isDelete){
            ajax({
                url: `http://localhost:3000/Ferrari/${e.target.dataset.id}`, 
                method: "DELETE", 
                success: (res) => location.reload(), 
                error: (err) => alert(err) 
            });
        }
    }
})