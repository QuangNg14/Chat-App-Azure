import React, { useState, useRef } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Select, List, Form, Input, Button, message } from 'antd';
import { isArrayLiteralExpression } from 'typescript';

const ReadMessages = (props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const mockDB = [
    {
      'room': 'COMP 410',
      'user': 'anthony',
      'message': 'hello',
      'createdAt': '11:48:50'
    },
    {
      'room': 'COMP 410',
      'user': 'quang',
      'message': "what's up",
      'createdAt': '11:50:40'
    },
    {
      'room': 'IM Basketball',
      'user': 'anthony',
      'message': 'hello again',
      'createdAt': '11:49:33'
    },
  ]

  const [currCat, setCurrCat] = useState([])
  // const currCatRef = useRef([]);
  // currCatRef.current = currCat;
  // const selectHandler = (e) => {
  //   console.log("joining room: ", e)
  //   // setCurrCat(e)
  //   // console.log("changed cat!", currCat)
  //   props.joinRoom(e)

  //   //TODO: add props.joinroom and props.leaveroom functions that connected to backend
  //   //
  // }
  const deselectHandler = (e) => {
    console.log("leaving room: ", e)
    props.leaveRoom(e)
  }

  const onJoin = (e) => {
    console.log(e)
    e.room.map((room) => {
      props.joinRoom(room, e.user)
      messageApi.open({
        type: 'success',
        content: 'Subscribed to ' + room + '!',
      });
    })
    
  }

  const onLeave = (e) => {
    console.log(e)
    e.room.map((room) => {
      props.leaveRoom(room, e.user)
      messageApi.open({
        type: 'success',
        content: 'Unsubscribed to ' + room + '!',
      });
    })
  }
  return (
    <div style={{"marginLeft": "50px"}}>
      {contextHolder}
      <Form
      onFinish={onJoin}>
        <Form.Item
          label="User"
          name="user"
          rules={[
            {
              required: false,
              message: 'Please input your group!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Room" name="room">
          <Select mode='tags'> 
            {props.rooms.map((room) =>
              <Select.Option value={room.roomName}>{room.roomName}</Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Subscribe
          </Button>
        </Form.Item>
      </Form>

      <Form
        onFinish={onLeave}>
        <Form.Item
          label="User"
          name="user"
          rules={[
            {
              required: false,
              message: 'Please input your group!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Room" name="room">
          <Select mode='tags'>
            {props.rooms.map((room) =>
              <Select.Option value={room.roomName}>{room.roomName}</Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Unsubscribe
          </Button>
        </Form.Item>
      </Form>
      
      
      {/* {Object.keys(props.messages).length == 0 ? <></>:  */}
      {/* <div>{props.messages.message}</div> */}
      {/* {Object.values(props.messages).map((item) => 
          <div>{item.message}</div>
      )} */}
      {Object.entries(props.messages).map((messageInfo, index) => 
        //  {
        //   console.log("reading")
        //   console.log(messageInfo[0])
        //   console.log(messageInfo[1])
        // }
        messageInfo[1].length == 0 ? <></>: <div>
          <h1>{messageInfo[0]}</h1>
          <List
            itemLayout="horizontal"
            dataSource={messageInfo[1]}
            style={{ "backgroundColor": "white" }}
            renderItem={(message) =>
              <List.Item
                extra={<p>{message.timestampUTCms}</p>}
              >
                <List.Item.Meta
                  style={{ "height": "50px" }}
                  // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={<a>{message.sender}</a>}
                  description={message.message}
                />
              </List.Item>
            }
          />
        </div>

        
      )}
      
      {/* } */}

    </div>
  )
}

export default ReadMessages