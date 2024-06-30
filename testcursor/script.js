document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([43.8, 11.2], 13);

    // Add a base layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Initialize an empty array to store markers
    var markers = [];

    // Add markers to map
    function addMarkers() {
        markers.forEach(function(marker) {
            marker.addTo(map);
        });
    }

    // Remove markers from map
    function removeMarkers() {
        markers.forEach(function(marker) {
            map.removeLayer(marker);
        });
    }

    // Function to save marker data to localStorage and database
    async function saveMarker(name, latlng, timestamp, photo) {
        // Add marker to map and store in markers array
        var marker = L.marker(latlng).bindPopup('<b>' + name + '</b><br><a href="gallery.html">View Photos</a>');
        markers.push(marker);
        marker.addTo(map);

        // Save marker data to localStorage
        var storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        storedMarkers.push({ name: name, latlng: latlng });
        localStorage.setItem('markers', JSON.stringify(storedMarkers));

        // Save marker data to the database
        try {
            const result = await createPhoto(name, timestamp, photo);
            console.log('Photo saved:', result);
        } catch (error) {
            console.error('Error saving photo:', error);
        }
    }

    // Load markers from localStorage if available
    loadMarkers();

    // Button to add photo
    document.getElementById('addPhotoButton').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                var latlng = [position.coords.latitude, position.coords.longitude];
                var markerName = prompt("Enter a name for this marker:");
                if (markerName) {
                    // Generate the current timestamp
                    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    // Placeholder for the photo data
                    // Replace this with your actual logic to get the photo data
                    var photo = await getPhotoData();

                    // Add a marker at the user's current location with the provided name
                    saveMarker(markerName, latlng, timestamp, photo); // Save marker data to localStorage and database
                    map.setView(latlng, 13); // Center map on the user's location
                }
            }, function(error) {
                alert("Unable to retrieve your location due to " + error.message);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    // Function to load markers from localStorage
    function loadMarkers() {
        var storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        storedMarkers.forEach(function(markerData) {
            var marker = L.marker(markerData.latlng).bindPopup('<b>' + markerData.name + '</b><br><a href="gallery.html">View Photos</a>');
            markers.push(marker);
        });
        addMarkers(); // Add markers to map
    }

    // Add or remove markers based on zoom level
    map.on('zoomend', function() {
        var currentZoom = map.getZoom();
        if (currentZoom >= 15) {
            addMarkers(); // Add markers when zoomed in
        } else {
            removeMarkers(); // Remove markers when zoomed out
        }
    });
});

// Function to get photo data
async function getPhotoData() {
    // Placeholder function to simulate getting photo data
    // Replace this with your actual logic to get the photo data
    return 'photo_data_placeholder';
}

// Function to create a photo in the database
async function createPhoto(localita, timestamp, photo) {
    const result = await pool.query(`
        INSERT INTO photos (localita, timestamps, immagine) VALUES (?, ?, ?)`, [localita, timestamp, photo]
    );
    return result;
}