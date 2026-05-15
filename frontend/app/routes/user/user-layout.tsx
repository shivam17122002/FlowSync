import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-3 py-6 sm:px-6 md:py-10">
      <Outlet />
    </div>
  );
};

export default UserLayout;
