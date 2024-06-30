// extract image info
//document.getElementById('imgInput').addEventListener('change', function(event) {
//	var file = event.target.files[0];
//	if (file) {
//		reader.onload = function(e) {
//			var img = new Image();
//			image.onload = function() {
//				EXIF.getData(image, function() {
//					var allMetaData = EXIF.getAllTags(this);
//					var dateTime = allMetaData.DateTime;
//					var latitude = allMetaData.GPSLatitude;
//					var longitude = allMetaData.GPSLongitude;
//					var latRef = allMetaData.GPSLatitudeRef;
//					var longRef = allMetaData.GPSLongitudeRef;
//					//converting to decimal
//					var lat = convertDMSToDD(latitude, latRef);
//					var long = convertDMSToDD(longitude, longRef);
//					document.getElemnentByID('photoContainer').innerHTML = `
//						<p><b>DateTime:</b> ${dateTime}</p>
//						<p><b>Latitude:</b> ${lat}</p>
//						<p><b>Longitude:</b> ${long}</p>
//						`;
//					console.log(allMetaData);
//					console.log(dateTime);
//					console.log(latitude);
//					console.log(longitude);
//				});
//			};
//			img.src = e.target.result;
//		};
//		reader.readAsDataURL(file);
//	}
//});
//function convertDMSToDD(dms, ref) {
//	if (!dms) return null;
//	var degrees = dms[0] + dms[1] / 60 + dms[2] / 3600;
//	if (ref === "S" || ref === "W") {
//		degrees = degrees * -1;
//	}
//	return degrees;
//}
document.addEventListener("DOMContentLoaded", function() {
    fetch("/assets").then((response)=>response.text()).then((data)=>{
        // Assuming the server provides a directory listing, parse the HTML to find image files.
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const links = Array.from(doc.querySelectorAll("a"));
        const imageFiles = links.map((link)=>link.href).filter((href)=>/\.(jpg|jpeg|png|gif)$/i.test(href));
        if (imageFiles.length === 0) {
            console.error("No images found");
            return;
        }
        // For simplicity, let's assume the server lists files in order of modification time.
        // Fetch the last image in the directory listing.
        const lastImageUrl = imageFiles[imageFiles.length - 1];
        fetch(lastImageUrl).then((response)=>response.blob()).then((blob)=>{
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = function() {
                EXIF.getData(img, function() {
                    const allMetaData = EXIF.getAllTags(this);
                    const dateTime = allMetaData.DateTime;
                    const latitude = allMetaData.GPSLatitude;
                    const longitude = allMetaData.GPSLongitude;
                    const latRef = allMetaData.GPSLatitudeRef;
                    const longRef = allMetaData.GPSLongitudeRef;
                    // Convert to decimal
                    const lat = convertDMSToDD(latitude, latRef);
                    const long = convertDMSToDD(longitude, longRef);
                    document.getElementById("photoContainer").innerHTML = `
								<img src="${url}" alt="Last Modified Image" />
								<p><b>DateTime:</b> ${dateTime}</p>
								<p><b>Latitude:</b> ${lat}</p>
								<p><b>Longitude:</b> ${long}</p>
								`;
                });
            };
            img.src = url;
        }).catch((error)=>console.error("Error fetching the last modified image:", error));
    }).catch((error)=>console.error("Error fetching the assets directory:", error));
});
function convertDMSToDD(dms, ref) {
    if (!dms) return null;
    const degrees = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === "S" || ref === "W") return degrees * -1;
    return degrees;
}

//# sourceMappingURL=index.41db75e8.js.map
