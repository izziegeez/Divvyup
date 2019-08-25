# DivvyUp: Divide Expenses with Friends
- Full-stack NodeJS Web Application		
## General Instruction
- Implemented an expense splitting service like Splitwise that allows real-time balance update when new attendees join to contribute to the cost of goods, and helps distribute the responsibility of reimbursement among the group. 
- Frontend: an interactive web page with `AJAX` technology implemented with `React`, `HTML`, `CSS` ,`Bootstrap`, `JavaScript`. The Divvyup Website realizes four main functions:
   * **Host** a party: user is prompted to enter a Party name and Party Cost
   * **Join** a party: user is prompted to enter the Party ID and input contribution amount
   * **End** a party: causes user's balance to be updated and displays how much they still need to pay
   * **Account Page**: Displays user's previous party history i.e. party name and amount due per party and a list of active parties that the user is currently in with party name and ID
- Backend: Designed `database schemas` to store users’ name, profile pictures, balances and password, with parties’ name, cost and attendees in `MongoDB`.
  * Used `AJAX` to `GET` users’ previous and active parties and `POST` to update balances for all attendees.
  * Used `Socket.io` to enable real-time event-based communication for join / end / leave event, attendee change and item additions
  * Encrypted user passwords with `Bcrypt` to ensure database security.
  *Deployed website server on `Amazon EC2`: http://divvy-react.s3-website.us-east-2.amazonaws.com/

## Infrastructure Design
- 3-tier architecture
   * Presentation tier: React,HTML, CSS, Bootstrap, JavaScript
   * Data tier: MongoDB
   * Logic tier: Java

![Divvyup Website Workflow](http://i.imgur.com/LvDX7h7.png)
> Divvyup Website Workflow

## Website demo
![Profile Page](https://i.imgur.com/0D3ENvr.png)
> Profile Page
- Displays user’s name, profile picture, and current Balance $$
- Offers five options to the logged in user:
  * Previous Parties : User’s previous party history is displayed, i.e. party name and amount due per party
      * “My Ended Party: $42”
  * Active Parties: Displays a list of active parties that the user is currently in with party name and ID
      * “My Active Cool Party: ABC123”
  * Host a Party : Redirects user to party creation interface
  * Join a Party : Redirects user to party search interface
  *  Log Out : Logs out user from the application

![Host a Party](https://i.imgur.com/Va1zBSt.png)
![Host a Party2](https://i.imgur.com/C1NdhhF.png)
> Host a Party

![Join a Party](https://i.imgur.com/FRBxVGu.png)
![Join a Party2](https://i.imgur.com/ZmfpAA4.png)
> Join a Party

![Amount to Pay](https://i.imgur.com/DTQENCD.png)
> Amount to Pay (responsive on a mobile device)

## Database Design
- `MongoDB`
* **Schemas**: a Party and a User schema
* **Models**: Party and User
		**Party**: name, id, cost, attendees, archived
		**User**: username, password, id, account balance
    
## Implementation Details
-`AJAX` :We use axios in React.
 - `GET`:
 	* Login page: send all users in DB
	* Profile page: send individual user information
	* Host page: send all active parties
	* Join page: send all active parties
	* Party page: send info on all active parties and the individual party
	* Contribute page: send info on individual party
	* Error page: sends error info
- `POST`:
	* Login page: create a new user
	* Host page: create a new party
	* Contribute page: update individual user and party information
	
- `Socket.io`: We use Socket.io(a Node.JS package) to ensure realtime update
  - Server Events:
	* join: adds the user to the party specified, creates a new one if it doesn’t exist
	* endParty: archives the current party and sends out payment information
	* leaveParty: indicates the user has left the party in the party’s info
	addItems: users can add the cost of the item they bring as they come to the party
  - Client Events:
	* endParty: redirects all users to payment page
	* leaveParty: redirects to profile page
	* attendanceChange: updates attendee list and cost

## Security
- `Bcrypt` (a Node.JS package)
  * We have a Strong password policy: Password must be 8 characters long, and contain at least one of each: Capital Letter, Lowercase Character, Non-Alphanumeric Character e.g. !@#$%^&*~)
  * Used `Bcrypt` to hash user ID's and passwords, which are then stored in MongoDB to ensure security
  
![MongoDB](https://i.imgur.com/273gw4F.png)
 > only hashed paswrods are stored
