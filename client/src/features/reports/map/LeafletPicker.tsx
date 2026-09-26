import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngBounds, LatLngLiteral } from "leaflet";
import { LuLocateFixed } from "react-icons/lu";

type Props = {
  value: { lat: number; lng: number } | null;
  onChange: (v: { lat: number; lng: number }) => void;
};

const BARANGAY_POLYGON: [number, number][] = [
  [120.9586242, 14.7210848],
  [120.9564826, 14.7231303],
  [120.9540234, 14.727106],
  [120.9533836, 14.728269],
  [120.9492919, 14.7260941],
  [120.9476096, 14.7254468],
  [120.9524949, 14.7137919],
  [120.9639092, 14.7158946],
  [120.9640602, 14.7196637],
  [120.9585923, 14.7210662],
  [120.9583507, 14.7214168],
  [120.9586242, 14.7210848],
];

const isPointInPolygon = (
  point: { lng: number; lat: number },
  polygon: [number, number][],
) => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

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
    const padding = L.point(24, 24);
    map.fitBounds(bounds, { padding: [24, 24] });
    map.setMinZoom(map.getBoundsZoom(bounds, false, padding));
  }, [map, bounds]);

  return null;
};

const getOuterRing = (bounds: LatLngBounds): LatLngLiteral[] => {
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
  polygon,
}: {
  bounds: LatLngBounds;
  polygon: LatLngLiteral[];
}) => {
  const outerRing = useMemo(() => getOuterRing(bounds), [bounds]);

  return (
    <Polygon
      positions={[outerRing, polygon]}
      pathOptions={{
        stroke: false,
        fillColor: "var(--color-background)",
        fillOpacity: 0.82,
      }}
    />
  );
};

const ClickHandler = ({
  polygon,
  onChange,
}: {
  polygon: [number, number][];
  onChange: Props["onChange"];
}) => {
  useMapEvents({
    click: (e) => {
      const next = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (!isPointInPolygon(next, polygon)) return;
      onChange(next);
    },
  });

  return null;
};

const PIN_ICON = L.divIcon({
  className: "bantay-pin",
  html: `
    <div style="width: 40px; height: 40px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
          fill="var(--color-primary)"
          fill-rule="evenodd"
        />
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 38],
});

const ERROR_MESSAGES: Record<number, string> = {
  1: "Location permission was denied.",
  2: "Your location is unavailable.",
  3: "Getting your location timed out.",
};

const LeafletPicker = ({ value, onChange }: Props) => {
  const polygonLatLng = useMemo<LatLngLiteral[]>(
    () => BARANGAY_POLYGON.map(([lng, lat]) => ({ lat, lng })),
    [],
  );

  const bounds = useMemo(() => L.latLngBounds(polygonLatLng), [polygonLatLng]);

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationError) return;
    const timer = setTimeout(() => setLocationError(null), 4500);
    return () => clearTimeout(timer);
  }, [locationError]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported on this device.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };

        if (!isPointInPolygon(next, BARANGAY_POLYGON)) {
          setLocationError("You're outside the covered barangay.");
          return;
        }

        onChange(next);
      },
      (err) => {
        setLocating(false);
        setLocationError(
          ERROR_MESSAGES[err.code] ?? "Unable to determine your location.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="relative z-0 isolate overflow-hidden rounded-xl border border-border bg-surface-sunken">
      <MapContainer
        className="h-80 w-full sm:h-96"
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1}
        maxZoom={19}
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
          detectRetina
          maxZoom={19}
        />

        <ZoomControl position="bottomleft" />

        <FitAndLockToBounds bounds={bounds} />

        <OutsideMask bounds={bounds} polygon={polygonLatLng} />

        <Polygon
          positions={polygonLatLng}
          pathOptions={{
            color: "var(--color-primary)",
            weight: 2,
            fillColor: "var(--color-primary-light)",
            fillOpacity: 0.22,
          }}
        />

        <ClickHandler polygon={BARANGAY_POLYGON} onChange={onChange} />

        {value ? (
          <Marker
            position={value}
            draggable
            icon={PIN_ICON}
            eventHandlers={{
              dragend: (e) => {
                const p = e.target.getLatLng();
                const next = { lat: p.lat, lng: p.lng };

                if (!isPointInPolygon(next, BARANGAY_POLYGON)) {
                  onChange(value);
                  return;
                }

                onChange(next);
              },
            }}
          />
        ) : null}
      </MapContainer>

      <div
        className={[
          "pointer-events-none absolute left-1/2 top-3 z-1000 max-w-[calc(100%-1.5rem)] -translate-x-1/2 truncate rounded-full border px-3 py-1 text-[11px] font-medium shadow-card backdrop-blur-sm",
          locationError
            ? "border-danger/30 bg-danger-light text-danger"
            : "border-border/60 bg-surface/95 text-text-primary",
        ].join(" ")}
      >
        {locationError ?? (value ? "Drag pin to adjust" : "Tap map to place pin")}
      </div>

      <button
        type="button"
        onClick={handleLocate}
        disabled={locating}
        aria-label="Use my current location"
        title="Use my current location"
        className="absolute bottom-3 right-3 z-1000 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/95 text-text-secondary shadow-card backdrop-blur-sm transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LuLocateFixed size={18} className={locating ? "animate-pulse" : ""} />
      </button>
    </div>
  );
};

export default LeafletPicker;