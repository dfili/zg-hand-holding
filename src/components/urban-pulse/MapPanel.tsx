"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";

import type { UrbanProblem } from "../../types/problem";

const mapContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 45.815399, lng: 15.966568 };

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
} as const;

const THEME_LABELS: Record<string, string> = {
  transport: "Transport",
  waste: "Waste",
  environment: "Environment",
  housing: "Housing",
  safety: "Safety",
  infrastructure: "Infrastructure",
};

function truncate(text: string, max = 220) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export interface MapPanelProps {
  problems: UrbanProblem[];
  selectedId: string | null;
  onMarkerSelect: (id: string) => void;
  /** When this changes, map pans to that problem (e.g. list click). */
  panToVersion: number;
}

export function MapPanel({
  problems,
  selectedId,
  onMarkerSelect,
  panToVersion,
}: MapPanelProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "urban-pulse-map",
    googleMapsApiKey: apiKey,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [infoId, setInfoId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (selectedId) setInfoId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (infoId && !problems.some((p) => p.id === infoId)) {
      setInfoId(null);
    }
  }, [problems, infoId]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !mapContainerRef.current) return;
    const map = mapRef.current;
    const el = mapContainerRef.current;
    const ro = new ResizeObserver(() => {
      if (typeof google !== "undefined" && map) {
        google.maps.event.trigger(map, "resize");
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mapReady]);

  const selected = problems.find((p) => p.id === selectedId);

  useEffect(() => {
    if (!mapRef.current || !selected) return;
    mapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
    mapRef.current.setZoom(14);
  }, [selectedId, panToVersion, selected]);

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 bg-white p-6 text-center text-sm text-zinc-600">
        <p className="font-medium text-zinc-900">Map unavailable</p>
        <p>
          Set{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs text-zinc-800">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          in <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs text-zinc-800">.env.local</code>
        </p>
        <p className="max-w-sm text-xs text-zinc-500">
          Enable Maps JavaScript API for your Google Cloud project.           The list view still works without a map key.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-4 text-sm text-red-600">
        Failed to load Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-white text-sm text-zinc-500">
        Loading map…
      </div>
    );
  }

  const infoProblem = problems.find((p) => p.id === infoId);

  return (
    <div ref={mapContainerRef} className="h-full min-h-0 w-full overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {problems.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            onClick={() => {
              onMarkerSelect(p.id);
              setInfoId(p.id);
            }}
          />
        ))}
        {infoProblem && (
          <InfoWindow
            position={{ lat: infoProblem.lat, lng: infoProblem.lng }}
            onCloseClick={() => setInfoId(null)}
          >
            <div className="max-w-[260px] p-1 text-zinc-900">
              <p className="font-semibold leading-snug">{infoProblem.title}</p>
              <p className="mt-1 text-xs text-zinc-600">
                {infoProblem.category} · {THEME_LABELS[infoProblem.theme] ?? infoProblem.theme}
              </p>
              <p className="mt-2 font-mono text-sm font-semibold text-brand">
                Priority: {infoProblem.priorityScore}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                {truncate(infoProblem.description)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
