"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";
import { useUser } from "@/app/context/UserContext";

const relationshipOptions = [
  { value: "single", label: "Single" },
  { value: "in_relationship", label: "In a Relationship" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
];

const EditDetails = ({
  initialLocation = "",
  initialRegion = "",
  initialRelationship = "",
  initialLinks = [],
  onClose,
  onSave,
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [region, setRegion] = useState(initialRegion);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [relationship, setRelationship] = useState(initialRelationship);
  const [links, setLinks] = useState(() =>
    initialLinks.map((l) => ({ ...l }))
  );
  const { updateUser, deleteLink, updateLink, addLink } = useUser();

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Fetch countries list
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        const list = data
          .map((c) => ({ name: c.name.common, code: c.cca2 }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(console.error);
  }, []);

  // Fetch regions/states عندما يتغير الـ location
  useEffect(() => {
    if (!location) {
      setRegions([]);
      return;
    }
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: location }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data.states)) {
          setRegions(data.data.states.map((s) => s.name));
        } else {
          setRegions([]);
        }
      })
      .catch(() => setRegions([]));
  }, [location]);

  const handleAddLink = () =>
    setLinks((prev) => [...prev, { name: "", url: "" }]);

  // دالة لتعديل حقل name أو url للرابط في الموضع idx
  const handleLinkChange = (idx, field, value) => {
    setLinks((prev) =>
      prev.map((link, i) => (i === idx ? { ...link, [field]: value } : link))
    );
  };

  const handleRemoveLink = (idx) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };


  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const userUpdates = {};
    if (location && location !== initialLocation) {
      userUpdates.country = location;
    }
    if (region && region !== initialRegion) {
      userUpdates.city = region;
    }
    if (relationship && relationship !== initialRelationship) {
      userUpdates.relationship = relationship;
    }
    const initialMap = new Map(
      initialLinks.map((l) => [l._id?.toString(), { name: l.name, url: l.url }])
    );
    const currentMap = new Map(
      links
        .filter((l) => l._id)
        .map((l) => [l._id.toString(), { name: l.name, url: l.url }])
    );

    const removedIds = Array.from(initialMap.keys()).filter(
      (id) => !currentMap.has(id)
    );

    const addedLinks = links.filter((l) => !l._id);

    const updatedLinks = [];
    links.forEach((l) => {
      if (l._id) {
        const orig = initialMap.get(l._id.toString());
        if (orig) {
          if (orig.name !== l.name || orig.url !== l.url) {
            updatedLinks.push(l);
          }
        }
      }
    });

    try {
      if (Object.keys(userUpdates).length > 0) {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userUpdates),
          },
        );
        const data1 = await res1.json();
        if (!res1.ok) {
          throw new Error(data1.message || "Failed to update user details");
        }
        updateUser(data1.user);
      }
      await Promise.all(
        removedIds.map(async (linkId) => {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/link/deleteLink/${linkId}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          deleteLink(linkId);
        })
      );

      await Promise.all(
        updatedLinks.map(async (l) => {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/link/updateLink/${l._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ name: l.name, url: l.url }),
            }
          );
          updateLink({ _id: l._id, name: l.name, url: l.url });
        })
      );

      await Promise.all(
        addedLinks.map(async (l) => {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/link/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name: l.name, url: l.url }),
          });
          addLink({ name: l.name, url: l.url, _id: uuidv4() });
        })
      );

      if (onSave) {
        onSave({
          country: userUpdates.country || initialLocation,
          city: userUpdates.city || initialRegion,
          relationship: userUpdates.relationship || initialRelationship,
          links: [
            ...initialLinks
              .filter((l) => !removedIds.includes(l._id.toString()))
              .map((l) => ({ _id: l._id, name: l.name, url: l.url })),
            ...addedLinks.map((l) => ({ name: l.name, url: l.url })),
          ],
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b">
          <h2 className="text-lg font-bold">Edit Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
          {error && <Alert type={"error"} message={error}/>}
        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Country */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Country</label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setRegion("");
              }}
              className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region/State */}
          {regions.length > 0 && (
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">State/Province</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="" disabled>
                  Select a state/province
                </option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Relationship */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Relationship Status</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
            >
              {relationshipOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Links */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Links</h3>
              <button
                onClick={handleAddLink}
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-3 mt-2">
              {links.map((link, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={link.name}
                    onChange={(e) => handleLinkChange(idx, "name", e.target.value)}
                    className="col-span-5 border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                    className="col-span-6 border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => handleRemoveLink(idx)}
                    className="col-span-1 p-2 rounded-full hover:bg-gray-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDetails;
