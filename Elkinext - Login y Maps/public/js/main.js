function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
  
    sessionStorage.setItem("user", JSON.stringify(data));
  
    window.location.href = "mainpage.html";
  }
  
  //JWT Decode
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js";
  document.head.appendChild(script);

 
let map;
let marker;
let lastMarker; 
let lastTime;  

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -0.1807, lng: -78.4678 }, 
        zoom: 8,
    });

    marker = new google.maps.Marker({
        position: { lat: -0.1807, lng: -78.4678 },
        map: map,
        title: "Quito",
    });

    google.maps.event.addListener(map, "click", function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        getLocalTime(lat, lng);
    });
}

function getLocalTime(lat, lng) {
    const apiKey = 'NZCA0WCK4DFQ'; 
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "OK") {
                const localTime = data.formatted; // Fecha y hora local
                const regionInfo = document.getElementById("region-info");
                
                if (localTime !== lastTime) {
                    regionInfo.innerHTML = `Hora seleccionada: <strong>${localTime}</strong>`;
                    lastTime = localTime;  // Almacenar la hora actual para comparaciones futuras
                }

                if (lastMarker) {
                    lastMarker.setMap(null); // Eliminar el marcador anterior si existe
                }
                
                // Crear un nuevo marcador en la ubicación seleccionada
                lastMarker = new google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    title: `Hora seleccionada: ${localTime}`,
                });
            } else {
                document.getElementById("region-info").innerText = "No se pudo obtener la hora local.";
            }
        })
        .catch((error) => {
            console.error("Error al obtener la hora:", error);
            document.getElementById("region-info").innerText = "No se pudo obtener la hora local.";
        });
}


