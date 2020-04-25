import React from "react";

// Components
import UserItem from "./UserItem";
import Card from "../../shared/components/UIELements/Card";

// Styles
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="centre">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places}
          />
        );
      })}
    </ul>
  );
  //   return <h2>UsersList works!</h2>;
};

export default UsersList;
