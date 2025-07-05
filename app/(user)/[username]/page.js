import React from "react";
import RenderProfile from "../Components/RenderProfile";

const Page = async ({ params }) => {
  const { username } = await params;

  return (
    <div>
      <RenderProfile username={username} />
    </div>
  );
};

export default Page;
