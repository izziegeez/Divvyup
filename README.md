# DivvyUp: Divide Expenses with Friends
- (Full-stack NodeJS Web Application) 		
## General Instruction
- Implemented an expense splitting service like Splitwise that allows real-time balance update when new attendees join to contribute to the cost of goods, and helps distribute the responsibility of reimbursement among the group. 
- Frontend: an interactive web page with `AJAX` technology implemented with `React`, `HTML`, `CSS` ,`Bootstrap`, `JavaScript`. The Divvyup Website realizes four main functions:
   * **Host** a party: user is prompted to enter a Party name and Party Cost
   * **Join** a party: user is prompted to enter the Party ID and input contribution amount
   * **End** a party: causes user's balance to be updated and displays how much they still need to pay
   * **Account Page**: Displays user's previous party history i.e. party name and amount due per party and a list of active parties that the user is currently in with party name and ID
- Backend: Designed `database schemas` to store users’ name, profile pictures, balances and password, with parties’ name, cost and attendees in `MongoDB`.
  *	Used `AJAX` to `GET` users’ previous and active parties and `POST` to update balances for all attendees.
  * Used `Socket.io` to enable real-time event-based communication for join / end / leave event, attendee change and item additions
  * Encrypted user passwords with `Bcrypt` to ensure database security.
  *  Deploy website server on `Amazon EC2`: http://divvy-react.s3-website.us-east-2.amazonaws.com/

## Infrastructure Design
- 3-tier architecture
   * Presentation tier: React,HTML, CSS, Bootstrap, JavaScript
   * Data tier: MongoDB
   * Logic tier: Java

![Divvyup Website Workflow](http://i.imgur.com/LvDX7h7.png)
> Divvyup Website Workflow

## Website demo
![Host a Party](https://i.imgur.com/U2JKs82.gif)
> Profile Page

![Host a Party](https://i.imgur.com/5x9Wysz.gif)
> Host a Party

![Join a Party](https://i.imgur.com/5x9Wysz.gif)
> Join a Party





## Database Design
- `MongoDB`
* **Schemas**: a Party and a User schema
* **Models**: Party and User
		**Party**: name, id, cost, attendees, archived
		**User**: username, password, id, account balance
    
![MongoDB](https://raw.githubusercontent.com/Wangxh329/EventRecommendation/master/img_font_icon_sources/doc/mysql.png)
> MySQL database design
    
## Security
- Bcrypt (a Node.JS package)
  * Strong password policy: Password must be 8 characters long, and contain at least one of each: Capital Letter, Lowercase Character, Non-Alphanumeric Character e.g. !@#$%^&*~)
  *	Used `Bcrypt` to hash user ID's and passwords, which are then stored in MongoDB to ensure security
  * Only hashed passwords are stored
  



##AJAX


## Implementation Details
- Design pattern
   * **Builder pattern**: `Item.java`
      * When convert events from TicketMasterAPI to java Items, use builder pattern to freely add fields.
   * **Factory pattern**: `ExternalAPIFactory.java`, `DBConnectionFactory.java`
      * `ExternalAPIFactory.java`: support multiple function like recommendation of event, restaurant, news, jobs… just link to different public API like TicketMasterAPI. Improve extension ability.
      * `DBConnectionFactory.java`: support multiple database like MySQL and MongoDB. Improve extension ability.
   * **Singleton pattern**: `MySQLConnection.java`, `MongoDBConnection.java`
      * Only create specific number of instance of database, and the class can control the instance itself, and give the global access to outerclass

## User Behavior Analysis
- Online (**ElasticSearch**, **Logstash**, **Kibana**)
   * Use Logstash to fetch log (in NoSQL-like form), then store data in ElasticSearch, finally use Kibana to analyze the data in ElasticSearch, getting some tables and graphs like APIs use, request status, geolocation of visitors, etc

![ELK analysis](https://raw.githubusercontent.com/Wangxh329/EventRecommendation/master/img_font_icon_sources/doc/elk.png)
> Remote development environment

- Offline (**MapReduce in MongoDB**)
   * Copy-paste some logs from Tomcat server
   * Purify log data and store in MongoDB
   * Do ``mapreduce()`` in MongoDB
   * Get a list of timebucket-count in descending order of count, then find the peak time of website traffic

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

