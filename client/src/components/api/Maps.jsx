import { GoogleMap, useLoadScript, MarkerF} from "@react-google-maps/api";
import { useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
const Maps = ( data ) => {
  console.log(data);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBhyfTQwmYXFdOLspNfnqED5ZjsTbR_HsQ",
  });

  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {!isLoaded ? (
        <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} />
      ) : (
        <GoogleMap
          center={data.center}
          zoom={11}
          mapContainerStyle={mapContainerStyle} 
        >
          {data.markers.map((marker, index) => (
            <MarkerF
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </GoogleMap>
      )}
    </Box>
  );
};

export default Maps;