"use client";
import React, { useState } from "react";
import { MapPin, Link as LinkIcon, Heart, MapPinned, Eye } from "lucide-react";
import EditDetails from "../editProfile/EditDetails";
import ViewerHistory from "../ViewerHistory";

function normalizeUrl(rawUrl) {
  if (!rawUrl) return "";
  return rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`;
}

const InfoProfile = ({
  bio,
  country,
  city,
  links,
  relationship,
  isProfile,
}) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenViewerHistory, setIsOpenViewerHistory] = useState(false);

  return (
    <aside className="w-full bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6">
      {/* Intro */}
      <section className="flex flex-col w-full gap-2">
        {isOpenViewerHistory && (
          <ViewerHistory  onClose={() => setIsOpenViewerHistory(false)} />
        )}
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          Intro 
          {isProfile && (
            <span
              onClick={() => setIsOpenViewerHistory(true)}
              className="bg-gray-200 p-1 cursor-pointer hover:bg-gray-300 rounded-full"
            >
              <Eye size={20} />
            </span>
          )} 
        </h2>
        <p dir="auto" className="text-gray-600 leading-relaxed">{bio}</p>
      </section>

      <hr className="border-gray-200" />

      {/* Location */}
      <section className="flex flex-col gap-2 text-gray-700">
        {country && (
          <div className="flex items-center gap-1">
            <MapPin size={18} className="text-blue-500" />
            <span className="font-medium">{country}</span>
          </div>
        )}
        {city && (
          <div className="flex items-center gap-1">
            <MapPinned size={18} className="text-blue-500" />
            <span className="font-medium">{city}</span>
          </div>
        )}
        {relationship && (
          <div className="flex items-center gap-1">
            <Heart size={18} className="text-blue-500" />
            <span className="font-medium">{relationship}</span>
          </div>
        )}
      </section>

      <hr className="border-gray-200" />

      {/* Links */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Links</h3>
        <ul className="flex flex-col gap-2">
          {Array.isArray(links) && links.length > 0 ? (
            links.map((link) => {
              const normalizedUrl = normalizeUrl(link.url);
              return (
                <li key={link._id} className="flex items-center gap-2">
                  <LinkIcon size={18} className="text-blue-500" />
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              );
            })
          ) : (
            <li className="text-gray-500">No links to show</li>
          )}
        </ul>
      </section>

      {isOpenEdit && (
        <EditDetails
          initialLocation={country}
          initialRegion={city}
          initialRelationship={relationship}
          initialLinks={links}
          onClose={() => setIsOpenEdit(false)}
        />
      )}

      {isProfile && (
        <button
          onClick={() => setIsOpenEdit(true)}
          className="bg-gray-300 text-black py-1 rounded-sm hover:bg-gray-400 cursor-pointer"
        >
          Edit details
        </button>
      )}
    </aside>
  );
};

export default InfoProfile;
