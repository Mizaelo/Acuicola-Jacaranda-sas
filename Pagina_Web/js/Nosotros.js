document.addEventListener("DOMContentLoaded", function () {
    fetch("../json/Nosotros.json")
        .then(response => response.json())
        .then(data => cargarNosotros(data.BIOFLOCDoc[0].proyecto));

    fetch("../json/Nosotros.json")
        .then(response => response.json())
        .then(data => renderVideos(data.BIOFLOCDoc[0].proyecto));
});



function cargarNosotros(proyecto) {
    let contenido = document.getElementById("contenido-nosotros");
    let iconos = {
        "introduccion": "📜",
        "beneficios_sociales": "🌍",
        "empleo": "💼",
        "productos": "📦",
        "subproductos": "♻️",
        "tecnologia": "🔬",
        "sistema_productivo": "🏭",
        "automatizacion": "⚙️",
        "videos": "🎥",
        "default": "ℹ️"
    };

    for (let key in proyecto) {
        let icono = iconos[key] || iconos["default"];
        let sectionHTML = `<div class='section'>`;
        let formattedKey = key.replace(/_/g, ' ');
        sectionHTML += `<div class='section-header'><span class='icon'>${icono}</span>${proyecto[key].titulo || formattedKey}</div>`;


        if (proyecto[key] === 'Biofloc') {
            continue;
        }

        sectionHTML += renderizarContenido(proyecto[key]);

        if (proyecto.Titulo) {
            document.getElementById("titulo-principal").innerHTML = proyecto.Titulo;
        }


        if (proyecto[key].img) {
            sectionHTML += `<img src="${proyecto[key].img}" alt="${key}">`;
        }


        sectionHTML += `</div>`;
        contenido.innerHTML += sectionHTML;
    }
}


const renderVideos = (proyecto) => {
    const videos = proyecto.Videos;
    const videoSectionDiv = document.getElementById("video-section");
    videoSectionDiv.innerHTML = `
    <h3>Sección de Videos</h3>
    <div class="videos-container">
        ${videos.map(video => `
            <div class="video-column">
                <div class="video-card">
                 <iframe src="${video.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                <h4>${video.titulo}</h4>
                <p>${video.descripcion}</p>
                </div>
            </div>
        `).join("")}
    </div>
`;
}

function renderizarContenido(data) {
    if (typeof data === 'string') {
        return `<p>${data}</p>`;
    } else if (typeof data === 'number' || typeof data === 'boolean') {
        return `<p>${data === true ? "Sí" : data === false ? "No" : data}</p>`;
    } else if (Array.isArray(data)) {
        if (data.length > 0 && typeof data[0] === 'object') {
            let table = `<table class='table'><tr>`;
            Object.keys(data[0]).forEach(key => {
                if (key.toLowerCase() !== 'titulo' && key.toLowerCase() !== 'img') {
                    table += `<th>${key}</th>`;
                }
            });
            table += `</tr>`;
            data.forEach(item => {
                table += `<tr>`;
                Object.entries(item).forEach(([key, value]) => {
                    if (key.toLowerCase() !== 'titulo' && key.toLowerCase() !== 'img') {
                        table += `<td>${value.replace(/_/g, ' ')}</td>`;
                    }
                });
                table += `</tr>`;
            });
            table += `</table>`;
            return table;
        } else {
            return `<ul>` + data.map(item => `<li>${item}</li>`).join('') + `</ul>`;
        }
    } else if (typeof data === 'object') {
        let table = `<table class='table'><tr><th>Clave</th><th>Valor</th></tr>`;
        for (let key in data) {
            if (key.toLowerCase() !== 'titulo' && key.toLowerCase() !== 'img') {
                let value = renderizarContenido(data[key]);
                table += `<tr><td><strong>${key.replace(/_/g, ' ')}</strong></td><td>${value.replace(/_/g, ' ')}</td></tr>`;
            }
        }
        table += `</table>`;
        return table;
    }
    return '';
}