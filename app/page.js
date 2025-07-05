"use client";
import SiadBar from "./Components/siadBar/SiadBar";
import SideBarRight from "./Components/siadBar/SideBarRight";
import List from "./Components/list/List";
import { useUser } from "./context/UserContext";
export default function Home() {
  const { user } = useUser();
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Sidebar شمال */}
      <div className="hidden md:block md:col-span-1">
        <SiadBar />
      </div>

      {/* القائمة الرئيسية */}
      <div className="col-span-1  md:col-span-3 flex justify-center">
        <List />
      </div>

      {/* Sidebar يمين */}
      <div className="hidden md:block md:col-span-1">
        <SideBarRight isPrivate={user && user.isPrivate} firstName={user && user.firstName || ""} lastName={ user && user.lastName || ""} profilePicture={ user && user.profilePicture.url} />
      </div>
    </div>
  );
}

