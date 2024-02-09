import { useState, useCallback, useEffect } from "react";
import { GoogleMap, MarkerF, InfoWindowF, MarkerClustererF } from "@react-google-maps/api";
import { Box, CircularProgress, Typography, Card, CardContent } from "@mui/material";
import carIcon from "../../assets/img/car.svg";
import { RequestType, geocode, setKey } from "react-geocode";

const mapContainerStyle = ({
    width: "100%",
    height: "100%",
  })

const Maps = ( data ) => {

  const [markers, setMarkers] = useState([]);

  const applyOffset = useCallback(
    (point, offset) => {
      const sin = Math.sin(offset);
      const cos = Math.cos(offset);

      return {
        lat: point.lat + cos * 0.0001,
        lng: point.lng + sin * 0.0001,
      };
    },
    []
  );
  
  useEffect(() => {
    setKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    data.addresses.forEach((address) => {
      geocode(RequestType.ADDRESS, address)
        .then((response) => {
          const { lat, lng } = response.results[0].geometry.location;
          setMarkers((prev) => [
            ...prev,
            {
              lat: lat,
              lng: lng,
            },
          ]);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [data.addresses]);

  const [selected, setSelected] = useState(null);
  
  const onMarkerClickHandler = useCallback((index) => {
    setSelected(index);
    data.onMarkerClick(index);
  }, [data]);

  const onInfoWindowClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {!data.isLoaded ? (
        <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} />
      ) : (
        <GoogleMap 
        center={data.center} 
        zoom={12} 
        mapContainerStyle={mapContainerStyle}>
          <MarkerClustererF options={{ imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" }}>
            {(clusterer) =>
              markers.map((marker, index) => (
                <MarkerF
                  key={index}
                  position={applyOffset(marker, index / 0.001)}
                  onClick={() => onMarkerClickHandler(index)}
                  clusterer={clusterer}
                  icon={{
                    url: carIcon,
                    scaledSize: { width: 75, height: 75 },
                  }}
                >
                  {selected === index && (
                    <InfoWindowF onCloseClick={onInfoWindowClose}>
                      <Card sx={{ minWidth: 200 }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            {data.cars[index].name}
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                            Price: {data.cars[index].price}
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                            Company: {data.cars[index].companie}
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                            Address: {data.cars[index].address}
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                            City: {data.cars[index].city}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Zip Code: {data.cars[index].zipCode}
                          </Typography>
                        </CardContent>
                      </Card>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))
            }
          </MarkerClustererF>
        </GoogleMap>
      )}
    </Box>
  );
};

export default Maps;