import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Harsh Gawali",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Lucifer Morningstar",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Stefan Salvatore",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  //onclick prop is used coz we have created a sepearte button component and we can pass onClick only to native html ele, so we have used onClick props
  //as button is used in multiple components, i have created a diff state for it and then derived using 'childred' whereever req.
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends); //after submitting the addFriend form, the friend list needs to be updated, so v use this state....initialFriends is the default vale of the state. the fuct is written above...
  const [showAddFriend, setShowAddFriend] = useState(false); // false coz by def the form shd be hidden, this state is used so as to rerender the pg when add friend is clicked
  const [selectedFriend, setSelectedFriend] = useState(null); // used for communication bt friend and the friend form

  function handleShowAddFriend() {
    // event handler function for the button props mentioned above
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]); // new friends will be added down
    setShowAddFriend(false); // after adding the new friend the form will get closed. this function is the controller of formAddFriend, thatswhy it is not passed in that function as it does not control the form.. this function controls the form
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend)); //if currently you select diff friend then the prev friend form will auto get closed
    setShowAddFriend(false); // if you click add new friend and then you open a friend list form, then the new friend form will get auto closed
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value } // calculation stuff, seelast video.........
          : friend
      )
    );

    setSelectedFriend(null); // closing form after split bill is clicked
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id} // keys are used cpz earlier the prblm was the friend bill form values was remaining same across the friends, so we use keys as now it will rerender.
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState(""); //state used as diff friends hv diff img and name
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return; // if either img or name is not added, the rest of the code will not be executed

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`, // this is used coz the default value usewd in the setImage state gives diff image each time the url is opened. so to avoid this, it is used
      balance: 0,
    };

    onAddFriend(newFriend);

    setName(""); // these both are used coz after entering the values in addFriend, the form will return to default(i.e. defaiult information)
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form
      className="form-add-friend"
      onSubmit={
        handleSubmit
      } /*when submit is clicked handleSubmit function will be called*/
    >
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)} //to update the values of the respective fields v use onchange
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : ""; //no state is used for this as it can be generated bu simple substractiin
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault(); //to prevent the page refreshing while submitting the form

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value) //if the expense is greater than the bill value, then by def the bill is considered to be paid by the user.
          )
        }
      />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
