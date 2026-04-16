"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    // Delayed invalidateSize to handle initial mount and layout shifts
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
}

const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;background:#596332;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 14px rgba(41,23,13,0.35);display:flex;align-items:center;justify-content:center;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

export default function Map() {
  const position: [number, number] = [41.85224, 12.47712];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>
          <div className="font-body text-sm font-semibold text-stitch-on-surface leading-tight">
            San Paolo Hideout
          </div>
          <div className="font-body text-xs text-stitch-on-surface/70 mt-0.5">
            Via Silvio d&apos;Amico 96, Roma
          </div>
        </Popup>
      </Marker>
      <MapResizer />
    </MapContainer>
  );
}
