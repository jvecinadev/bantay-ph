// src/features/reports/map/LeafletPicker.tsx
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngBounds, LatLngLiteral } from "leaflet";

type Props = {
  value: { lat: number; lng: number } | null;
  onChange: (v: { lat: number; lng: number }) => void;
};

const BARANGAY_LINESTRING: [number, number][] = [
  [120.9499875, 14.7147734],
  [120.9485383, 14.7184177],
  [120.9532135, 14.7201002],
  [120.9482846, 14.7290383],
  [120.9486471, 14.7296692],
  [120.9506041, 14.7288981],
  [120.9523799, 14.7240961],
  [120.9535759, 14.7250074],
  [120.9570509, 14.7187281],
  [120.9581109, 14.7204825],
  [120.9584625, 14.7201893],
  [120.9574956, 14.7185673],
  [120.9569366, 14.7175109],
  [120.9581355, 14.7144972],
  [120.9587519, 14.7133597],
  [120.9515278, 14.7109773],
  [120.9499851, 14.7147786],
  [120.9477629, 14.7136419],
];

const closeRing = (coords: [number, number][]) => {
  if (coords.length === 0) return coords;
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) return coords;
  return [...coords, first];
};

const isPointInPolygon = (point: { lng: number; lat: number }, polygonLngLat: [number, number][]) => {
  let inside = false;

  for (let i = 0, j = polygonLngLat.length - 1; i < polygonLngLat.length; j = i++) {
    const xi = polygonLngLat[i][0];
    const yi = polygonLngLat[i][1];
    const xj = polygonLngLat[j][0];
    const yj = polygonLngLat[j][1];

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

const FitAndLockToBounds = ({ bounds }: { bounds: LatLngBounds }) => {
  const map = useMap();

  useEffect(() => {
    const PAD = L.point(24, 24);
    map.fitBounds(bounds, { padding: [24, 24] });

    const z = map.getBoundsZoom(bounds, false, PAD);
    map.setMinZoom(z);
  }, [map, bounds]);

  return null;
};

const getOuterRingFromBounds = (bounds: LatLngBounds): LatLngLiteral[] => {
  const padded = bounds.pad(2);
  const sw = padded.getSouthWest();
  const nw = padded.getNorthWest();
  const ne = padded.getNorthEast();
  const se = padded.getSouthEast();

  return [
    { lat: sw.lat, lng: sw.lng },
    { lat: nw.lat, lng: nw.lng },
    { lat: ne.lat, lng: ne.lng },
    { lat: se.lat, lng: se.lng },
  ];
};

const OutsideMask = ({
  bounds,
  barangayPolygon,
}: {
  bounds: LatLngBounds;
  barangayPolygon: LatLngLiteral[];
}) => {
  const outerRing = useMemo(() => getOuterRingFromBounds(bounds), [bounds]);

  return (
    <Polygon
      positions={[outerRing, barangayPolygon]}
      pathOptions={{
        stroke: false,
        fillColor: "var(--color-background)",
        fillOpacity: 0.82,
      }}
    />
  );
};

const ClickToSetMarker = ({
  polygonLngLat,
  onChange,
}: {
  polygonLngLat: [number, number][];
  onChange: Props["onChange"];
}) => {
  useMapEvents({
    click: (e) => {
      const next = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (!isPointInPolygon({ lat: next.lat, lng: next.lng }, polygonLngLat)) return;
      onChange(next);
    },
  });

  return null;
};

const PIN_ICON = L.divIcon({
  className: "bantay-pin",
  html: `
    <div style="width: 36px; height: 36px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
          fill="var(--color-primary)"
          fill-rule="evenodd"
        />
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 33],
});

const LeafletPicker = ({ value, onChange }: Props) => {
  const polygonLngLat = useMemo(() => closeRing(BARANGAY_LINESTRING), []);

  const polygonLatLng = useMemo<LatLngLiteral[]>(
    () => polygonLngLat.map(([lng, lat]) => ({ lat, lng })),
    [polygonLngLat],
  );

  const bounds = useMemo(() => L.latLngBounds(polygonLatLng), [polygonLatLng]);
  const [geoTried, setGeoTried] = useState(false);

  useEffect(() => {
    if (geoTried) return;
    setGeoTried(true);

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!isPointInPolygon({ lat: next.lat, lng: next.lng }, polygonLngLat)) return;
        if (!value) onChange(next);
      },
      () => {
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [geoTried, onChange, polygonLngLat, value]);

  return (
    <div className="relative">
      <div className="relative z-0 isolate overflow-hidden rounded-xl border border-border bg-surface-sunken">
        <MapContainer
          className="h-72 w-full sm:h-80"
          bounds={bounds}
          maxBounds={bounds}
          maxBoundsViscosity={1}
          maxZoom={19}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap
          />

          <FitAndLockToBounds bounds={bounds} />

          <OutsideMask bounds={bounds} barangayPolygon={polygonLatLng} />

          <Polygon
            positions={polygonLatLng}
            pathOptions={{
              color: "var(--color-primary)",
              weight: 1.5,
              fillColor: "var(--color-primary-light)",
              fillOpacity: 0.2,
            }}
          />

          <ClickToSetMarker polygonLngLat={polygonLngLat} onChange={onChange} />

          {value ? (
            <Marker
              position={value}
              draggable
              icon={PIN_ICON}
              eventHandlers={{
                dragend: (e) => {
                  const p = e.target.getLatLng();
                  const next = { lat: p.lat, lng: p.lng };

                  if (!isPointInPolygon({ lat: next.lat, lng: next.lng }, polygonLngLat)) {
                    onChange(value);
                    return;
                  }

                  onChange(next);
                },
              }}
            />
          ) : null}
        </MapContainer>

        <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/60 bg-surface/95 px-3 py-1 text-[11px] font-medium text-text-primary shadow-card backdrop-blur-sm">
          {value ? "Drag pin to adjust" : "Tap map to place pin"}
        </div>
      </div>
    </div>
  );
};

export default LeafletPicker;