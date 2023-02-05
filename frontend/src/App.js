import { useState, useEffect, useRef, React } from "react";
import "./App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";

//content
import Rooms from "./components/content/Rooms";
import ReadMessages from "./components/content/ReadMessages";
import SendMessage from "./components/content/SendMessage";

//antd stuff
import {
  SendOutlined,
  AppstoreAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
const { Header, Footer, Sider, Content } = Layout;

// import Connector from './signalRConnection.js'

const testRooms = [
  {
    roomName: "RoomA",
    roomDataCategory: "Text",
  },
  {
    roomName: "RoomB",
    roomDataCategory: "Number",
  },
  {
    roomName: "RoomC",
    roomDataCategory: "UserProfile",
  },
];

const mockDB = [
  {
    room: "CategoryOne",
    user: "anthony",
    message: "hello",
  },
  {
    room: "CategoryOne",
    user: "quang",
    message: "what's up",
  },
  {
    room: "CategoryTwo",
    user: "anthony",
    message: "hello again",
  },
];

function App() {
  const [readMessageState, setReadMessageState] = useState(0);
  const links = [
    [<SendOutlined />, "\t\tSend Message"],
    [<AppstoreAddOutlined />, "\t\tRooms"],
    [<MessageOutlined />, "\t\tRead Messages"],
  ].map((item, index) => ({
    key: String(index + 1),
    // icon: React.createElement(item),
    label: item,
  }));

  const [selectedContent, setSelectedContent] = useState("sendMessage");
  // const content = {
  //     "sendMessage": SendMessage,
  //     "createGroup": CreateGroup,
  //     "readMessages": ReadMessages,
  // }
  const onLinkChange = (e) => {
    console.log("click ", e);
    setSelectedContent(
      e.key == 1 ? "sendMessage" : e.key == 2 ? "rooms" : "readMessages"
    );
  };
  const getContent = () => {
    console.log("updating content");
    return selectedContent == "sendMessage" ? (
      <SendMessage onSend={sendMessage} rooms={allRooms} /> //allRoomsRef.current
    ) : selectedContent == "rooms" ? (
      <Rooms
        rooms={allRooms}
        categories={allCategories}
        onAdd={addRoom}
        onDelete={deleteRoom}
      />
    ) : (
      <ReadMessages
        key={readMessageState}
        messages={allMessagesRef.current}
        rooms={allRooms}
        joinRoom={joinRoom}
        leaveRoom={leaveRoom}
      />
    );
  };

  const [connection, setConnection] = useState();
  const [allMessages, setAllMessages] = useState({});
  const allMessagesRef = useRef({});
  allMessagesRef.current = allMessages;

  const [allRooms, setAllRooms] = useState([]);
  const allRoomsRef = useRef([]);
  allRoomsRef.current = allRooms;

  const [allCategories, setAllCategories] = useState([]);
  const allCategoriesRef = useRef([]);
  allCategoriesRef.current = allCategories;

  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    const initialConnection = new HubConnectionBuilder()
      .withUrl("https://warmup-b-signarlrservice.azurewebsites.net/chatHub") //TODO: Replace with deployed backend url
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    initialConnection
      .start()
      .then((result) => {
        setInitialLoad(true);
        console.log("Connected!");
      })
      .catch((e) => console.log("Connection failed: ", e));
    initialConnection.on("ReceiveSendMessages", (messages, room) => {
      console.log("Recieving Send Message");
      console.log(messages);
      console.log(room);

      // PROCESS MESSAGE
      // const updatedMessages = []
      // messages.map((message) => {
      //     updatedMessages

      // })
      // setAllMessages([...]);
      setAllMessages({ ...allMessagesRef.current, [room]: messages });
    });
    initialConnection.on("ReceiveLeaveMessages", (messages, room) => {
      console.log("Recieving Leave Message");
      console.log(messages);
      console.log(room);

      // PROCESS MESSAGE
      // const updatedMessages = []
      // messages.map((message) => {
      //     updatedMessages

      // })
      // setAllMessages([...]);
      setAllMessages({ ...allMessages, [room]: messages });
    });
    initialConnection.on("ReceiveGetMessages", (messages, room) => {
      console.log("Recieving Get Message");
      console.log(messages);
      console.log(room);

      // PROCESS MESSAGE
      // const updatedMessages = []
      // messages.map((message) => {
      //     updatedMessages
      // })
      setAllMessages({ ...allMessagesRef.current, [room]: messages });
      setReadMessageState(readMessageState + 1);
    });
    initialConnection.on("ReceiveRooms", (rooms) => {
      console.log("Recieving Rooms");
      console.log(rooms);
      // rooms = testRooms

      //extract all unique categories
      const uniqueCats = rooms
        .map((item) => item.roomDataCategory)
        .filter((value, index, self) => self.indexOf(value) === index);

      console.log(uniqueCats);

      // const newRoomToMessages = rooms.filter(item => !Object.keys(allMessages).includes(item.roomName))
      // console.log("rooms to be added")
      // console.log(newRoomToMessages)
      // const newEntries = newRoomToMessages.map(item => ({
      //     [item.roomName]: []
      // }))
      setAllRooms(rooms);
      setAllCategories(uniqueCats);
      // setAllMessages({...allMessages, newEntries})
    });
    setConnection(initialConnection);
  }, []);

  useEffect(() => {
    if (initialLoad) {
      if (connection && connection.state == HubConnectionState.Connected) {
        console.log("hello get rooms");
        getRooms();
      }
      console.log("getting rooms");
    }
  }, [connection, initialLoad]);

  const getRooms = async () => {
    try {
      await connection.invoke("GetRooms");
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (room, user, message) => {
    console.log("Publishing content " + room + " " + message);

    try {
      await connection.invoke("SendMessage", room, user, message);
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const joinRoom = async (room, user) => {
    console.log("Subscribing to ");
    console.log(typeof room);
    // setSelectedSubCatConfirm(selectedSubCat)
    try {
      await connection.invoke("JoinRoom", room, user);
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const addRoom = async (room, category) => {
    console.log(
      "Adding room " + typeof room + " with category " + typeof category
    );
    try {
      await connection.invoke("AddRoom", room, category);
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRoom = async (room) => {
    console.log("Deleting room " + room);
    try {
      await connection.invoke("DeleteRoom", room);
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const leaveRoom = async (room, user) => {
    console.log("Leaving room" + room);
    try {
      await connection.invoke("LeaveRoom", room, user);
      setConnection(connection);
      setAllMessages({ ...allMessagesRef.current, [room]: [] });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Layout>
        <Header style={{ backgroundColor: "white", fontSize: "large" }}>
          chat.
        </Header>
        <Layout hasSider={true}>
          <Sider style={{ backgroundColor: "white" }}>
            <Menu items={links} onClick={onLinkChange} />
          </Sider>
          <Content style={{ backgroundColor: "white", minHeight: "575px" }}>
            <Button onClick={getRooms}> Get Rooms </Button>
            {getContent()}
            {/* {initialLoad ? getContent() : <Button onClick={getRooms}>
                        Start chatting
                    </Button>} */}
            {/* {selectedContent == "sendMessage" ? <SendMessage /> :
                            (selectedContent == "createGroup" ? <CreateGroup /> : <ReadMessages />)} */}
          </Content>
        </Layout>
        <Footer style={{ backgroundColor: "white" }}> - chat ©2023 - </Footer>
      </Layout>
    </div>
  );
}
//<p style={{ "marginLeft": "10px" }}>{item[0]}:</p>
//<p style={{ "marginLeft": "10px" }}>{item[1]}</p>

export default App;
