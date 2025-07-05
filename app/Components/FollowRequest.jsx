"use client";
import React, { useState } from "react";
import Alert from "./Alert";
import Spinner from "./Spinner";
import { useUser } from "../context/UserContext";
import { formatPostDate } from "../utils/formatDate";
import Link from "next/link";

const FollowRequest = () => {
  const {
    requestsFollowing,
    loadingRequests,
    errorRequests,
    removeRequest,
  } = useUser();

  const [loadingStates, setLoadingStates] = useState({});
  const [alerts, setAlerts] = useState({}); // لكل ريكوست

  if (loadingRequests) return <Spinner />;
  if (errorRequests) return <Alert message={errorRequests} type="error" />;
  if (!requestsFollowing) return null;

  const handleLoading = (id, type, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [type]: value },
    }));
  };

  const showAlert = (id, type) => {
    setAlerts((prev) => ({
      ...prev,
      [id]: type,
    }));

    setTimeout(() => {
      setAlerts((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }, 3000);
  };

  const acceptRequest = async (id) => {
    handleLoading(id, "accept", true);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/followRequest/confirm/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await req.json();
      if (!req.ok) throw new Error(res.message);

      showAlert(id, "accepted");

      // تأخير الحذف 3 ثواني
      setTimeout(() => removeRequest(id), 3000);
    } catch (error) {
      console.log(error);
    } finally {
      handleLoading(id, "accept", false);
    }
  };

  const rejectRequest = async (id) => {
    handleLoading(id, "decline", true);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/followRequest/reject/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await req.json();
      if (!req.ok) throw new Error(res.message);

      showAlert(id, "declined");

      // تأخير الحذف 3 ثواني
      setTimeout(() => removeRequest(id), 3000);
    } catch (error) {
      console.log(error);
    } finally {
      handleLoading(id, "decline", false);
    }
  };

  return (
    <>
      {requestsFollowing.length === 0 && <>No Follow Requests</>}
      {requestsFollowing.map((request) => {
        const id = request._id;
        const loadingAccept = loadingStates[id]?.accept || false;
        const loadingDecline = loadingStates[id]?.decline || false;
        const alertMessage = alerts[id];

        return (
          <div
            key={id}
            className="bg-white p-3 rounded-lg mt-4 shadow-md flex flex-col items-center justify-center w-full hover:bg-gray-100"
          >
            {/* Header */}
            <div className="flex w-full gap-3">
              <Link
                href={`/${request.sender.username}`}
                className="size-10 rounded-full overflow-hidden flex-shrink-0"
              >
                <img
                  className="w-full"
                  src={
                    request.sender.profilePicture?.url ||
                    "/assets/iconUser.jpg"
                  }
                  alt="default image"
                />
              </Link>
              <div className="flex flex-col w-full">
                <Link
                  href={`/${request.sender.username}`}
                  className="font-bold lg:text-lg md:text-lg sm:text-md text-sm flex items-center gap-1"
                >
                  {request.sender.firstName + " " + request.sender.lastName ||
                    "user"}
                </Link>
                <p className="text-gray-500 text-sm">
                  {formatPostDate(request.createdAt)}
                </p>
              </div>
            </div>

            {/* Alert */}
            {alertMessage === "accepted" && (
              <Alert message="Request Accepted" type="success" />
            )}
            {alertMessage === "declined" && (
              <Alert message="Request Declined" type="error" />
            )}

            {/* Footer */}
            <div className="flex w-full gap-2">
              <button
                disabled={loadingAccept || loadingDecline}
                onClick={() => acceptRequest(id)}
                className="bg-blue-600 w-full hover:bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-md"
              >
                {loadingAccept ? "Accepting..." : "Accept"}
              </button>
              <button
                disabled={loadingAccept || loadingDecline}
                onClick={() => rejectRequest(id)}
                className="bg-red-600 hover:bg-red-500 cursor-pointer text-white py-2 px-4 rounded-md"
              >
                {loadingDecline ? "Declining..." : "Decline"}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FollowRequest;
