import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";

type Props = {
  value: { lat: number; lng: number } | null;
  onChange: (v: { lat: number; lng: number }) => void;
};

const DEFAULT_CENTER: LatLngLiteral = { lat: 14.5995, lng: 120.9842 }; // Metro Manila

const ClickToSetMarker = ({ onChange }: { onChange: Props["onChange"] }) => {
  useMapEvents({
    click: (e) => onChange({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
};

const LeafletPicker = ({ value, onChange }: Props) => {
  const [initialCenter, setInitialCenter] = useState<LatLngLiteral>(DEFAULT_CENTER);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setInitialCenter(next);
        if (!value) onChange(next);
      },
      () => {
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  const center = useMemo<LatLngLiteral>(() => {
    if (value) return value;
    return initialCenter;
  }, [value, initialCenter]);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <MapContainer center={center} zoom={16} className="h-72 w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickToSetMarker onChange={onChange} />

        {value ? (
          <Marker
            position={value}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const p = marker.getLatLng();
                onChange({ lat: p.lat, lng: p.lng });
              },
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
};

export default LeafletPicker;