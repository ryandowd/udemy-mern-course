import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Ryan Dowd",
      image:
        "https://pbs.twimg.com/profile_images/664029196650422272/Lmhf-I1i_400x400.jpg",
      place: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
