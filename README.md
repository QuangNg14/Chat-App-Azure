## Description
This is a publish-subscribe system with a browser-based client and managment that is backed by cloud-based data storage and subscription management services
## Browser Application (Frontend):
1. Upload data item(s), as defined below, from client app in browser to cloud application.
2. Deletion and/or replacing of existing stored data is optional.
3. Read existing data items from cloud application for a specific category.
4. Subscribe to data for a specific category value.
5. Receive asynchronously pushed data for subscribed category(s).

## Cloud Service (Backend): 
1. Store received data in cloud database.
2. Retrieve stored data as per browser request.
- Filtered as per specified category value(s)
- Ability to retrieve data items for all categories.
3. Asynchronously push new data items to subscribers.

## Database:
1. Timestamp (UTC): The creation time for that particular data value.
2. Category value: The value defines the content type(s)
3. Content Values: A single category value may refer to a data that contains multiple values of different types (as a "structure" or "record").
