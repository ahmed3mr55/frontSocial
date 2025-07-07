"use client";
import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import NotificationItem from "./NotificationItem";
import Spinner from "../Spinner";
import Alert from "../Alert";
import { useUser } from "@/app/context/UserContext";

export default function Notifications({ onClose }) {
  const {
    fetchNotifications,
    notifications,
    loadingNotifications,
    errorNotifications,
    notifPagination: { fetched, limit },
  } = useUser();

  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);


  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Bell size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* List with scroll */}
      <div className="divide-y max-h-[60vh] overflow-y-auto">
        {loadingNotifications && localNotifications.length === 0 ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : errorNotifications ? (
          <div className="p-6">
            <Alert type="error" message={errorNotifications} />
          </div>
        ) : localNotifications.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            You have no notifications.
          </div>
        ) : (
          localNotifications.map((n) => (
            <NotificationItem
              key={n._id}
              firstName={n.actor.firstName}
              lastName={n.actor.lastName}
              profilePicture={n.actor.profilePicture?.url}
              date={n.createdAt}
              message={n.meta.title}
              unread={!n.read}
              username={n.actor.username}
              link={n.meta.link}
              type={n.type}
            />
          ))
        )}
      </div>

      {/* Load more */}
      {localNotifications.length >= limit && (
        <div className="p-4 text-center">
          <button
            onClick={() => fetchNotifications(true)}
            disabled={loadingNotifications}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loadingNotifications ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
