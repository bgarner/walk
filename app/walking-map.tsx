"use client";

import { useEffect, useMemo, useRef } from "react";
import type * as Leaflet from "leaflet";

type LatLng = {
  lat: number;
  lng: number;
};

const route: LatLng[] = [
  { lat: 51.301117452525276, lng: -114.0401711184996 },
  { lat: 51.0447, lng: -114.0719 },
  { lat: 50.4452, lng: -104.6189 },
  { lat: 49.8951, lng: -97.1384 },
  { lat: 43.6532, lng: -79.3832 },
  { lat: 47.5615, lng: -52.7126 },
  { lat: 64.1466, lng: -21.9426 },
  { lat: 51.5072, lng: -0.1276 },
  { lat: 48.8566, lng: 2.3522 },
  { lat: 41.9028, lng: 12.4964 },
  { lat: 30.0444, lng: 31.2357 },
  { lat: 25.2048, lng: 55.2708 },
  { lat: 19.076, lng: 72.8777 },
  { lat: 13.7563, lng: 100.5018 },
  { lat: 35.6762, lng: 139.6503 },
  { lat: 21.3099, lng: -157.8581 },
  { lat: 49.2827, lng: -123.1207 },
  { lat: 51.301117452525276, lng: -114.0401711184996 },
];

const followRadiusKm = 500;

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function haversineMeters(start: LatLng, end: LatLng) {
  const earthRadius = 6371000;
  const dLat = toRad(end.lat - start.lat);
  const dLng = toRad(end.lng - start.lng);
  const lat1 = toRad(start.lat);
  const lat2 = toRad(end.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function interpolate(start: LatLng, end: LatLng, amount: number): LatLng {
  return {
    lat: start.lat + (end.lat - start.lat) * amount,
    lng: start.lng + (end.lng - start.lng) * amount,
  };
}

function buildProgressPath(distanceMeters: number) {
  const path: LatLng[] = [route[0]];
  let remaining = distanceMeters;
  let walker = route[0];

  if (distanceMeters <= 0) {
    return { path, walker };
  }

  for (let index = 0; index < route.length - 1; index += 1) {
    const start = route[index];
    const end = route[index + 1];
    const segment = haversineMeters(start, end);

    if (remaining >= segment) {
      path.push(end);
      walker = end;
      remaining -= segment;
      continue;
    }

    walker = interpolate(start, end, remaining / segment);
    path.push(walker);
    break;
  }

  return { path, walker };
}

function radiusBounds(center: LatLng, radiusKm: number): Leaflet.LatLngBoundsExpression {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos(toRad(center.lat)));

  return [
    [center.lat - latDelta, center.lng - lngDelta],
    [center.lat + latDelta, center.lng + lngDelta],
  ];
}

export default function WalkingMap({ totalSteps }: { totalSteps: number }) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const progressLine = useRef<Leaflet.Polyline | null>(null);
  const walkerMarker = useRef<Leaflet.Marker | null>(null);
  const progress = useMemo(() => buildProgressPath(totalSteps), [totalSteps]);

  useEffect(() => {
    let cancelled = false;

    async function updateMap() {
      const L = await import("leaflet");

      if (cancelled || !mapElement.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapElement.current, {
          center: [route[0].lat, route[0].lng],
          zoom: 4,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
      }

      if (!progressLine.current) {
        progressLine.current = L.polyline([], {
          color: "#ff7a59",
          opacity: 1,
          weight: 7,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(mapRef.current);
      }

      const leafletPath = progress.path.map(
        (point) => [point.lat, point.lng] as Leaflet.LatLngTuple,
      );
      progressLine.current.setLatLngs(leafletPath);

      if (!walkerMarker.current) {
        walkerMarker.current = L.marker([progress.walker.lat, progress.walker.lng], {
          icon: L.divIcon({
            className: "walker-marker",
            html: '<span class="walker-dot">🏃</span><span class="walker-label">WE ARE HERE</span>',
            iconSize: [120, 74],
            iconAnchor: [60, 62],
          }),
        }).addTo(mapRef.current);
      }

      walkerMarker.current.setLatLng([progress.walker.lat, progress.walker.lng]);

      mapRef.current.fitBounds(radiusBounds(progress.walker, followRadiusKm), {
        padding: [48, 48],
      });
    }

    updateMap();

    return () => {
      cancelled = true;
    };
  }, [progress]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      progressLine.current = null;
      walkerMarker.current = null;
    };
  }, []);

  return (
    <div className="leaflet-map-shell">
      <div className="map-loading">Loading map...</div>
      <div ref={mapElement} className="leaflet-map" aria-label="Walking progress map" />
    </div>
  );
}
