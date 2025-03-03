function toggleMenu() {
    const menu = document.querySelector('nav ul');
    menu.classList.toggle('active');
    document.getElementById("Idmenu-icon").textContent = menu.classList.contains('active') ? 'X' : '☰';
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al cargar los datos");
        }
        return await response.json();
    } catch (error) {
        return console.error("Error al obtener el JSON:", error);
    }
}

function createHeader(data) {
    const header = document.createElement("header");
    const h1 = document.createElement("h1");
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = data.sitio_web.Logo;
    h1.textContent = data.sitio_web.titulo;
    document.head.appendChild(link);
    header.appendChild(h1);

    const authDiv = document.createElement("div");
    authDiv.classList.add("auth-buttons");
    data.sitio_web.Username.forEach(user => {
        const link = document.createElement("a");
        link.href = user.href;
        link.textContent = user.nombre;
        link.classList.add("btn");
        link.classList.add(user.class);
        authDiv.appendChild(link);
    });
    header.appendChild(authDiv);

    const nav = document.createElement("nav");
    const menuIcon = document.createElement("div");
    menuIcon.classList.add("menu-icon");
    menuIcon.id = "Idmenu-icon";
    menuIcon.textContent = "☰";
    menuIcon.onclick = toggleMenu;
    nav.appendChild(menuIcon);
    
    const ul = document.createElement("ul");
    data.sitio_web.navegacion.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.enlace;
        a.textContent = item.nombre;
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);
    header.appendChild(nav);
    
    return header;
}

function createMainContent(data) {
    const main = document.getElementById("Maincontent");
    data.sitio_web.navegacion.forEach(sectionData => {
        const section = document.createElement("section");
        section.id = sectionData.enlace.substring(1);
        
        const h2 = document.createElement("h2");
        h2.textContent = sectionData.nombre;
        
        const p = document.createElement("p");
        p.textContent = sectionData.descripcion;
        
        section.appendChild(h2);
        section.appendChild(p);
        main.appendChild(section);
    });
    return main;
}




function createFooter(data) {
    const footer = document.createElement("footer");
    
    const pFooter = document.createElement("p");
    pFooter.textContent = "© 2025 Acuícola Jacaranda SAS. Todos los derechos reservados.";
    
    
    const socialDiv = document.createElement("div");
    socialDiv.classList.add("social-links");
    


    data.sitio_web.redes_sociales.forEach(social => {
        const a = document.createElement("a");
        a.href = social.enlace;
        a.classList.add(social.nombre);
        a.target = "_blank";
        a.innerHTML = `<i class='${social.icono}'></i>`;
        socialDiv.appendChild(a);
    });
    
    footer.appendChild(socialDiv);
    footer.appendChild(pFooter);
    return footer;
}


fetchData("../json/index.json").then(data => {
    if (data) {
        document.body.prepend(createHeader(data));
        //document.body.appendChild(createMainContent(data));
        document.body.appendChild(createFooter(data));
    }
});